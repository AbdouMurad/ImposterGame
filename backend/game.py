import random
import json

class Commit:
    def __init__(self, playerid, code):
        self.playerid = playerid
        self.code = code

class Game:
    def __init__(self, gameId):
        self.state = "waiting"
        self.gameId = gameId
        self.players = []
        self.questionId = None

        self.question = ""
        self.sourceCode = []
        
        self.currentPlayer: Player = None

    def commit(self, playerid, code) -> Commit:
        commit = Commit(playerid, code)
        self.sourceCode.append(commit)
        return commit

    def startGame(self):
        self.state = "initializing"
       # self.assignRoles()
       # self.assignTurns()
        self.getQuestion()
        self.state = "in-progress"

    def addPlayer(self, id, websocket, name):
        player = Player(
            id=id,
            websocket=websocket,
            userName=name
        )  
        self.players.append(player)

    def assignRoles(self):
        for player in self.players:
            player.role = "crewmate"

        temp = self.players
        imposter = temp[random.randrange(len(temp))]
        imposter.role = "imposter"
        return imposter

    def assignTurns(self):
        random.shuffle(self.players)  
        root = self.players[0]
        current = root
        
        for i in range(1, len(self.players)):
            current.next = self.players[i]
            current = current.next
        current.next = root

        self.currentPlayer = root

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
                "starter_code": q["starter_code"]
            } 
            for q in data["questions"]
        }
        self.questionId = random.randrange(1, len(questions)+1)

        question =  questions.get(self.questionId)        
        self.commit("SYSTEM", question["starter_code"])
        self.question = question["description"]

        return question
    def getSourceCode(self):
        return self.sourceCode[len(self.sourceCode)-1].code
    
    def selectQuestion(self,Id):
        filePath = 'backend/test_questions/questions.json'

        with open(filePath) as f:
            data = json.load(f)
        
        questions = {
            q["id"]: {
                "title": q["title"],
                "difficulty": q["difficulty"],
                "description": q["description"],
                "starter_code": q["starter_code"]
            } 
            for q in data["questions"]
        }
        question = questions.get(Id)
        self.commit("SYSTEM", question["starter_code"])
        self.question = question["description"]
        return question


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

    # Test getQuestion - randomly chosen
    print("=== Get Question (Random) ===")
    question = game.getQuestion()
    print(question['title'])
 

   