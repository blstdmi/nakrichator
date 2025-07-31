from fastapi import FastAPI, Request
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse
import os

app = FastAPI()

# В продакшене мы будем монтировать статику из собранного фронтенда
if os.path.exists("../frontend/dist"):
    print("Serve have build-->> run")
    app.mount("/static", StaticFiles(directory="../frontend/dist/assets"), name="static")
    app.mount("/", StaticFiles(directory="../frontend/dist", html=True), name="frontend")

@app.get("/api/hello")
async def hello():
    return {"message": "Hello from Python backend!"}

# Для разработки - проксируем запросы к Vite серверу
@app.api_route("/{path:path}", methods=["GET", "POST", "PUT", "DELETE"])
async def catch_all(request: Request, path: str):
    if "frontend" in app.mounts:  # В продакшене
        return FileResponse("../frontend/dist/index.html")
    # В разработке можно проксировать запросы к Vite (но лучше разделять серверы)
    return {"detail": "Not found in production mode"}