from fastapi import FastAPI, Request
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse
from pydantic import BaseModel
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
        print("frontend run dist index")
        return FileResponse("../frontend/dist/index.html")
    print("local?")
    
    # В разработке можно проксировать запросы к Vite (но лучше разделять серверы)
    return {"detail": "Not found in production mode"}



class ParsedMessage(BaseModel):
    timestamp: float
    command: str
    name: str
    group: str
    message: str


def sanitize_string(input_string: str) -> str:
    """Удаляем потенциально опасные символы"""
    return re.sub(r'[^\w\sа-яА-ЯёЁ.,!?-]', '', input_string).strip()

@app.get("/api/parse")
async def parse_message(input_string: str):
    """
    Парсит строку формата: TIMESTAMP*COMMAND USERNAME GROUP MESSAGE
    Пример: 1754048620630.7*добtest A ТЕКСТ
    
    Структура:
    - 1754048620630.7 - timestamp (метка времени)
    - *доб - name_command (команда после *)
    - test - username (слово после команды)
    - A - group_name (буква или слово)
    - ТЕКСТ - message (остальной текст)
    """
    try:
        # Разделяем timestamp и остальную часть
        timestamp_part, rest = input_string.split('*', 1)
        timestamp = float(timestamp_part)
        
        # Разбираем остальную часть: команда, username, группа, сообщение
        parts = rest.split(maxsplit=3)
        
        if len(parts) < 3:
            raise ValueError("Недостаточно частей в строке после timestamp")
        
        # Первое слово после * - это команда+username
        command_user = parts[0]
        
        # Разделяем команду и username (первые 3 символа - команда, остальное - username)
        name_command = command_user[:3]  # "доб"
        username = command_user[3:]      # "test"
        
        group_name = parts[1]            # "A"
        message = parts[2] if len(parts) == 3 else parts[2] + ' ' + parts[3]
        
        return ParsedMessage(
            timestamp=timestamp,
            name_command=sanitize_string(name_command),
            username=sanitize_string(username),
            group_name=sanitize_string(group_name),
            message=sanitize_string(message)
        )
        
    except Exception as e:
        return {"error": f"Ошибка парсинга: {str(e)}", "input": input_string}