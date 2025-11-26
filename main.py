import webview
import threading
import uvicorn
from backend.app import app


def start_api():
    uvicorn.run(app, host="127.0.0.1", port=8000)


if __name__ == "__main__":
    threading.Thread(target=start_api, daemon=True).start()

    webview.create_window(
        "CDM Optimiser",
        url="frontend/dist/index.html",
        width=1400,
        height=900,
    )

    webview.start()
