import asyncio
import websockets
import json

rooms = {}
clients = {} # key = playerid, value = websocket

def create_room(room_id):
    rooms[room_id] = []

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

        msg_type = data.get("type")

        if msg_type == "join-room":
            name = data.get("name", "")
            playerid = data.get("playerid", "")
            roomid = data.get("roomid")

            if roomid is None:
                await websocket.send("No room ID provided")
                continue

            clients[playerid] = websocket

            if not check_room(roomid):
                print("no room found")
                continue
            rooms[roomid].append({"name": name, "playerid": playerid})
            print(f"{name} joined room {roomid}")
            print(rooms)

            await websocket.send(f"Welcome {name} to room {roomid}")

        else:
            await websocket.send(f"Unknown message type: {msg_type}")


async def main():
   

    async with websockets.serve(handler, "localhost", 8765):
        create_room('123')
        print("Running on ws://localhost:8765")
        await asyncio.Future()  # run forever

asyncio.run(main())