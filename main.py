import webview
from backend.app import create_api
import os

FRONTEND_DIST = os.path.join(os.getcwd(), "frontend", "dist", "index.html")

if __name__ == "__main__":
    api = create_api()

    window = webview.create_window(
        title="CDM Optimiser",
        url=FRONTEND_DIST,
        js_api=api,
        width=1200,
        height=800
    )

    webview.start()
