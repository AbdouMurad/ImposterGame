import random
import json
import time

class Commit:
    def __init__(self, playerid, code):
        self.playerid = playerid
        self.code = code

class Timer:
    def __init__(self, duration):
        self.duration = duration

    def startTime(self):
        self.start_time = time.time()        

    def getTime(self):
        return time.time() - self.start_time
    
    def getTimeLeft(self):
        return round(self.duration - self.getTime())
        
class Game:
    def __init__(self, gameId):
        self.state = "waiting"
        self.gameId = gameId
        self.players = []

        self.turns = []

        self.questionId = None
        self.questionTitle = ""
        self.questionDifficulty = ""
        self.questionDesc = ""
        self.questionExample = ""
        self.questionStarterCode = ""
        self.sourceCode = []
        
        self.currentPlayer: Player = None

    def commit(self, playerid, code) -> Commit:
        commit = Commit(playerid, code)
        self.sourceCode.append([commit.playerid, commit.code])
        return self.sourceCode

    def startGame(self):
        self.state = "initializing"

        self.assignRoles()
        self.assignTurns()
        self.getQuestion()
        print(self.questionDesc)
        self.state = "in-progress"

    async def addPlayer(self, id, websocket, name):
        player = Player(
            id=id,
            websocket=websocket,
            userName=name
        )  
        self.players.append(player)


        for player in self.players:
            print("SENDING TO ", player.userName)
            await player.websocket.send(json.dumps(self.getListOfPlayers()))

    def assignRoles(self):
        for player in self.players:
            player.role = "crewmate"

        temp = self.players
        print(temp)
        imposter = temp[random.randrange(0, len(temp))]
        imposter.role = "imposter"
        return imposter


    def assignTurns(self):
        random.shuffle(self.players)  
        root = self.players[0]
        current = root

        self.turns = [root]
        
        for i in range(1, len(self.players)):
            current.next = self.players[i]
            current = current.next
            self.turns.append(current)
        current.next = root

        self.currentPlayer = root

    def switchTurns(self):
        self.currentPlayer.active = False
        self.currentPlayer = self.currentPlayer.next
        self.currentPlayer.active = True
        return self.currentPlayer

    def nextPlayer(self):
        if self.currentPlayer:
            self.currentPlayer = self.currentPlayer.next

    def getQuestion(self):  
        filePath = 'backend/test_questions/questions.json'

        with open(filePath) as f:
            data = json.load(f)
        
        questions = {
            q["id"]: {
                "title": q["title"],
                "difficulty": q["difficulty"],
                "description": q["description"],
                "examples": q["examples"],
                "starter_code": q["starter_code"]
            } 
            for q in data["questions"]
        }
        self.questionId = random.randrange(1, len(questions)+1)

        question =  questions.get(self.questionId)        
        self.commit("SYSTEM", question["starter_code"])
        self.questionDifficulty = question["difficulty"]
        self.questionTitle = question["title"]
        self.questionDesc = question["description"]
        self.questionExample = question["examples"]
        self.questionStarterCode = question["starter_code"]      

        return question
    
    def getSourceCode(self):
        return self.sourceCode[len(self.sourceCode)-1].code
    
    def getTests(self):
        filePath = 'backend/test_questions/testcases.json'

        with open(filePath) as f:
            data = json.load(f)

        tests = data.get(str(self.questionId)).get("tests")  
        return tests

    
    def selectQuestion(self,Id):
        filePath = 'backend/test_questions/questions.json'

        with open(filePath) as f:
            data = json.load(f)
        
        questions = {
            q["id"]: {
                "title": q["title"],
                "difficulty": q["difficulty"],
                "description": q["description"],
                "examples": q["examples"],
                "starter_code": q["starter_code"]
            } 
            for q in data["questions"]
        }
        question = questions.get(Id)
        self.commit("SYSTEM", question["starter_code"])
        self.questionId = Id
        self.questionDifficulty = question["difficulty"]
        self.questionTitle = question["title"]
        self.questionDesc = question["description"]
        self.questionExample = question["examples"]
        self.questionStarterCode = question["starter_code"]
        return question

    def getListOfPlayers(self):
        return {
            "type": "player-list",
            "players": [player.userName for player in self.players]
        }
    
    def getListOfTurns(self):
        return {
            "type": "turn-list",
            "players": [player.userName for player in self.turns]
        }

class Node:
    def __init__(self):
        self.next = None
        self.back = None

class Player(Node):
    def __init__(self, id, websocket, userName):
        super().__init__()
        self.id = id
        self.active = False
        self.websocket = websocket
        self.userName = userName
        self.role = "crewmate"

    def set_role(self, role):
        self.role = role

    def is_imposter(self):
        return self.role == "imposter"


if __name__ == "__main__":
    game = Game("game1")
    game.selectQuestion(1)
    tests = game.getTests()
    print(tests)