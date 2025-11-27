from dotenv import load_dotenv
import os
import sys
import shutil
import subprocess
import logging
import argparse
from pathlib import Path
from typing import Optional
import threading
import webbrowser
import time

load_dotenv()

base_dir = Path(getattr(sys, "_MEIPASS", Path(__file__).parent)).resolve()

db_url = os.getenv("DATABASE_URL", "sqlite:///backend/app.db")
if db_url.startswith("sqlite:///"):
    os.environ["DATABASE_URL"] = f"sqlite:///{base_dir / 'app.db'}"

from backend.app import app
from backend.database.database import Base, engine
from fastapi.staticfiles import StaticFiles

logger = logging.getLogger("main")
logging.basicConfig(level=logging.INFO)


def run_command(cmd, cwd: Optional[str] = None, timeout: int = 300) -> bool:
    try:
        logger.info("Running: %s (cwd=%s)", " ".join(cmd), cwd)
        subprocess.run(cmd, cwd=cwd, check=True, timeout=timeout)
        return True
    except subprocess.CalledProcessError as e:
        logger.error(
            "Command failed: %s (cwd=%s) exit:%s", " ".join(cmd), cwd, e.returncode
        )
    except subprocess.TimeoutExpired:
        logger.error("Command timed out: %s (cwd=%s)", " ".join(cmd), cwd)
    except FileNotFoundError:
        logger.error("Command not found: %s (cwd=%s)", cmd[0], cwd)
    return False


def should_build(frontend_dir: Path, force: bool, build_on_start_env: bool) -> bool:
    """Decide whether to build the frontend."""
    dist_candidates = [
        frontend_dir / "dist",
        frontend_dir / "build",
        frontend_dir / "public",
    ]
    built = any(p.exists() for p in dist_candidates)
    if force:
        return True
    return build_on_start_env or not built


def build_frontend(
    frontend_dir: Path, force_rebuild: bool, build_on_start_env: bool
) -> bool:
    if not frontend_dir.exists():
        logger.info("Frontend directory not found: %s", frontend_dir)
        return False

    package_json = frontend_dir / "package.json"
    if not package_json.exists():
        logger.info("No package.json in frontend dir; skipping build: %s", frontend_dir)
        return False

    use_yarn = (frontend_dir / "yarn.lock").exists() and shutil.which("yarn")
    use_npm = shutil.which("npm") is not None

    if not use_yarn and not use_npm:
        logger.warning("Neither npm nor yarn found in PATH; cannot build frontend")
        return False

    if not should_build(frontend_dir, force_rebuild, build_on_start_env):
        logger.info("Skipping frontend build; already built or not requested")
        return True

    if use_yarn:
        if not run_command(
            ["yarn", "install", "--frozen-lockfile"], cwd=str(frontend_dir)
        ):
            return False
        if not run_command(["yarn", "build"], cwd=str(frontend_dir)):
            return False
    else:
        if run_command(["npm", "ci"], cwd=str(frontend_dir)):
            pass
        else:
            if not run_command(["npm", "install"], cwd=str(frontend_dir)):
                return False
        if not run_command(["npm", "run", "build"], cwd=str(frontend_dir)):
            return False

    logger.info("Frontend build finished")
    return True


def mount_frontend(app):
    frontend_dir_env = os.getenv("FRONTEND_DIR")
    candidates = [frontend_dir_env, str(base_dir / "frontend")]

    for candidate in candidates:
        if not candidate:
            continue
        base = Path(candidate)
        if not base.exists():
            continue

        dist_candidates = [base / "dist", base / "build", base / "public"]
        for d in dist_candidates:
            if d.exists():
                app.mount(
                    "/", StaticFiles(directory=str(d), html=True), name="frontend"
                )
                logger.info("Serving frontend from: %s", d)
                return True

    logger.info(
        "No frontend build found; APIs only. Build the frontend and set FRONTEND_DIR or place build in frontend/dist or frontend/build"
    )
    return False


def init_db():
    logger.info("Ensuring database schema exists")
    Base.metadata.create_all(bind=engine)


def _browser_host_for_open(host: str) -> str:
    if host in ("0.0.0.0", "::"):
        return "127.0.0.1"
    return host


def _open_browser_later(host: str, port: int, delay: float = 0.8):
    def _open():
        time.sleep(delay)
        url = f"http://{_browser_host_for_open(host)}:{port}/"
        try:
            webbrowser.open(url)
        except Exception:
            print("Couldn't auto-open browser; open:", url)

    threading.Thread(target=_open, daemon=True).start()


def main():
    parser = argparse.ArgumentParser(
        description="Run the Optimiser server with optional frontend build"
    )
    parser.add_argument("--host", default=os.getenv("HOST", "0.0.0.0"))
    parser.add_argument("--port", type=int, default=int(os.getenv("PORT", 8000)))
    parser.add_argument(
        "--no-mount-frontend",
        action="store_true",
        help="Skip mounting any frontend built files",
    )
    parser.add_argument(
        "--frontend-dir",
        default=os.getenv("FRONTEND_DIR", str(base_dir / "frontend")),
        help="Path to frontend project",
    )
    parser.add_argument(
        "--build-frontend",
        action="store_true",
        help="Force a frontend build at startup",
    )
    parser.add_argument(
        "--force-rebuild",
        action="store_true",
        help="Force rebuild the frontend even if output exists",
    )
    parser.add_argument(
        "--no-build", action="store_true", help="Skip frontend build steps"
    )
    parser.add_argument(
        "--reload", action="store_true", help="Run uvicorn with reload (dev only)"
    )
    parser.add_argument(
        "--no-browser-open",
        action="store_true",
        help="Don't attempt to open the browser automatically",
    )
    args = parser.parse_args()

    build_on_start_env = os.getenv("FRONTEND_BUILD_ON_START", "0") in (
        "1",
        "true",
        "True",
    )
    force_rebuild_env = os.getenv("FRONTEND_FORCE_REBUILD", "0") in (
        "1",
        "true",
        "True",
    )
    frontend_dir = Path(args.frontend_dir)

    init_db()

    if not args.no_build:
        do_build = args.build_frontend or build_on_start_env
        if args.force_rebuild:
            force_rebuild = True
        else:
            force_rebuild = force_rebuild_env
        if do_build or force_rebuild:
            _ = build_frontend(
                frontend_dir,
                force_rebuild=force_rebuild,
                build_on_start_env=build_on_start_env,
            )

    if not args.no_mount_frontend:
        mounted = mount_frontend(app)
        if not mounted:
            logger.info("Frontend not mounted; continue serving APIs only")

    if not args.no_browser_open:
        _open_browser_later(args.host, args.port)

    import uvicorn

    uvicorn.run(app, host=args.host, port=args.port, reload=args.reload)


if __name__ == "__main__":
    main()
