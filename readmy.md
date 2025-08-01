взгляд.. 
- сначало думал реалтайм, чтобы мышка отображалась и тд, думаю блин это просто.. сокеты и тд..
- потом если webrtc или внеш сервер тогда тут общие сообщения, думаю хм подключить телега? получается потоки. агрегатор хм.
-1  но хотел svg лица и чтоб от туда слова вылитали..

а сам концепт:
 - складировать матерные слова и вырожения?
 - поднимать какую то тему и хреначить ее, общая помойка + -

так а технологии..
 -   rest.., loongpooling, websocket?, webrtc.. matrix?
    может eventbus.. в общем пойду просто eventemiter браузера,
    и может телегу..
    - в общем если бы socketio использовал там бродкаст как гарантия что подключенные получат сообщение
      и если сокеты не поддерживают из коробки лонгпулинг с другой стороны vk отказался от сокетов.



набор мыслей
1.  vite статика + python serv longpooling?
2.  cd: frontend &npm install vuetify@^3.6.0 #может использовать чтонть хм..
3. выбор  websocket (socketio), webrtc, matrix.. может шина данных..


1. npm create vite@latest frontend -- --template vue
1.2 npm install

2. mkdir serverpython
2.1 python -m venv venv
-2.2 venv\Scripts\activate
-2.3 source venv/bin/activate
2.4 mybash source venv/Scripts/activate

3. pip install fastapi uvicorn aiofiles



