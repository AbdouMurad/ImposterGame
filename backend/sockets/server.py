import asyncio
import websockets
import json
import random
import string
from backend.game import Game
rooms = {} #ket = roomid, value = Game
clients = {} # key = playerid, value = websocket


def generate_random_id(length=6):
    characters = string.ascii_letters.upper() + string.digits

    id =  ''.join(random.choice(characters) for _ in range(length))
    while id in rooms:
        id =  ''.join(random.choice(characters) for _ in range(length))
    
    return id

def create_room(room_id):
    game = Game(room_id)
    rooms[room_id] = game
    return game

def check_room(room_id):
    return room_id in rooms


async def handler(websocket):
    print("Client connected")
    async for message in websocket:
        try:
            data = json.loads(message)
        except json.JSONDecodeError:
            await websocket.send("Invalid JSON")
            continue
        
        msg_type = data.get("type", None)
        if msg_type == "create-room":
            roomid = generate_random_id()
            playerid = data.get("playerid", None)
            name = data.get("name", None)

            game = create_room(roomid)
            game.addPlayer(
                id=playerid,
                websocket=websocket,
                name=name
            )

            createResponse = {
                "type": "room-created",
                "roomid": roomid
            }
            await websocket.send(json.dumps(createResponse))

        elif msg_type == "join-room":
            name = data.get("name", None)
            playerid = data.get("playerid", None)
            roomid = data.get("roomid", None)

            if roomid is None:
                await websocket.send("No room ID provided")
                continue

            clients[playerid] = websocket

            if not check_room(roomid):
                print("no room found")
                continue
            game = rooms[roomid]

            if game.state != "waiting":
                await websocket.send("Game already in progress")
                continue

            game.addPlayer(
                id=playerid,
                websocket=websocket,
                name=name
            )

            joinResponse = {
                "type": "player-joined",
                "roomid": roomid
            }

            await websocket.send(json.dumps(joinResponse))
            print(joinResponse)

        elif msg_type == "start-game":
            roomid = data.get("roomid", None)

            if roomid is None:
                await websocket.send("No room ID provided")
                continue
            if not check_room(roomid):
                await websocket.send("Room not found")
                continue
            game = rooms[roomid]
            game.startGame()
            print(f"Game in room {roomid} started")

            startResponse = {
                "type": "game-started",
                "roomid": roomid
            }
            await websocket.send(json.dumps(startResponse))
            
        elif msg_type == "player-list":
            roomid = data.get("roomid", None)

            if roomid is None:
                await websocket.send("No room ID provided")
                continue
            if not check_room(roomid):
                await websocket.send("Room not found")
                continue

            game = rooms[roomid]

            playerListResponse = {
                "type": "player-list",
                "players": [player.userName for player in game.players]
            }
            await websocket.send(json.dumps(playerListResponse))
        elif msg_type == "source-code":
            roomid = data.get("roomid", None)
            playerid = data.get("playerid", None)
            
            game = rooms[roomid]
            source_code = game.getSourceCode()
            await websocket.send(json.dumps({
                "type": "source-code",
                "question": game.question,
                "code": source_code
            }))

        else:
            await websocket.send(f"Unknown message type: {msg_type}")


async def main():
   
    async with websockets.serve(handler, "localhost", 8765):
        print(generate_random_id())
        game1 = create_room("123")
        game1.addPlayer("123", "websocket", "Lem")
        game1.addPlayer("123", "websocket", "Abdou")
        print("Running on ws://localhost:8765")
        await asyncio.Future()  # run forever

asyncio.run(main())