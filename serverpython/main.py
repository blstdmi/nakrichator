from fastapi import FastAPI, Request
from fastapi.staticfiles import StaticFiles
from fastapi.middleware.cors import CORSMiddleware  # Добавляем импорт
from fastapi.responses import FileResponse, RedirectResponse
import os
import httpx
from pydantic import BaseModel

app = FastAPI()

# Добавляем CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Разрешаем все домены
    allow_credentials=True,
    allow_methods=["*"],  # Разрешаем все HTTP методы
    allow_headers=["*"],  # Разрешаем все заголовки
)

# Проверяем режим работы (production/development)
IS_PROD = os.path.exists("../frontend/dist")
print(f"Starting in {'PRODUCTION' if IS_PROD else 'DEVELOPMENT'} mode")

if IS_PROD:
    print("Mounting production frontend files")
    app.mount("/assets", StaticFiles(directory="../frontend/dist/assets"), name="assets")
    app.mount("/", StaticFiles(directory="../frontend/dist", html=True), name="frontend")

@app.get("/api/hello")
async def hello():
    print("Hello endpoint called")
    return {"message": "Hello from Python backend!"}


class ParsedMessage(BaseModel):
    timestamp: float
    command: str
    name: str
    group: str
    message: str

database = {}

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
    print("Custom /api/parse handler called")
    try:
        # Разделяем timestamp и остальную часть
        #timestamp, rest = input_string.split('*', 1)
        timestamp_part, rest = input_string.split('*', 1)
        timestamp = float(timestamp_part)
        
        # Разбираем остальную часть: команда, username, группа, сообщение
        parts = rest.split(maxsplit=3)
        if len(parts) == 0:
            raise ValueError("Недостаточно частей в строке после timestamp")
        
        name_command = parts[0][:3]  # "доб"

        if name_command == "доб":



            if len(parts) < 3:
                raise ValueError("Недостаточно частей в строке после timestamp")
            
            # Первое слово после * - это команда+username
            command_user = parts[0]
            
            # Разделяем команду и username (первые 3 символа - команда, остальное - username)
            #name_command = command_user[:3]  # "доб"
            username = command_user[3:]      # "test"
            
            group_name = parts[1]            # "A"
            message = parts[2] if len(parts) == 3 else parts[2] + ' ' + parts[3]
            
            # return ParsedMessage(
            #     timestamp=timestamp,
            #     name_command=name_command,#sanitize_string(name_command),
            #     username=username,
            #     group_name=group_name,
            #     message=message
            # )
            print (timestamp,username,group_name,message)
            #database[timestamp]={'user':username,'group':group_name,'message':message}
            database[timestamp]=username,group_name,message
            return "данные добавлены"
        
        return "ошибка команды"
        
    except Exception as e:
        return {"error": f"Ошибка парсинга: {str(e)}", "input": input_string}
    
@app.get("/api/newdata")
async def longpool():
    #all data, наверное можно было заморочится, но данных мало.
    return database

@app.api_route("/{path:path}", methods=["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"])
async def catch_all(request: Request, path: str):
    print(f"\n=== NEW REQUEST ===")
    print(f"Method: {request.method}, Path: {path}")

    # # Исключение для API-запросов
    # if path.startswith('api/'):
    #     print("API route not handled - returning 404")
    #     raise HTTPException(status_code=404, detail="Not Found")
    
    if IS_PROD:
        print("Serving production index.html")
        return FileResponse("../frontend/dist/index.html")
    
    vite_url = f"http://localhost:5173/{path}"
    print(f"Proxying to Vite: {vite_url}")

    try:
        if request.method == "GET":
            print("Redirecting GET request to Vite")
            return RedirectResponse(vite_url)
        
        async with httpx.AsyncClient() as client:
            print(f"Proxying {request.method} request to Vite")
            response = await client.request(
                request.method,
                vite_url,
                headers={k: v for k, v in request.headers.items() if k.lower() != "host"},
                params=request.query_params,
                data=await request.body()
            )
            return RedirectResponse(vite_url)
            
    except httpx.ConnectError:
        print("Vite server is not running!")
        return {"detail": "Vite server is not running - please run 'npm run dev'"}
    except Exception as e:
        print(f"Error: {str(e)}")
        return {"detail": "Internal server error"}