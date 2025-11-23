import threading
import webview
import os
from backend.server import start_backend

def start_server():
    threading.Thread(target=start_backend, daemon=True).start()

if __name__ == "__main__":
    start_server()

    dist_path = os.path.join(os.path.dirname(__file__), "frontend", "dist", "index.html")

    window = webview.create_window(
        "My App",
        dist_path
    )

    webview.start()
