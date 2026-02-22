import random
import json
import time
from sockets.runner import Engine
'''
TODO:
-run code
    - run the most recent commit against the test cases
    - return the results of the test cases to the client
- next turn
    - switch the current player to the next player in the turn order
    - return the new current player to the client
    - this should be triggered by a timer that runs for a certain duration (e.g. 60 seconds)

'''

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
        self.questionCategory = ""
        self.questionDifficulty = ""
        self.questionDesc = ""
        self.questionExample = ""
        self.questionStarterCode = ""
        self.questionFuncName = ""
        self.questionParameters = []
        self.sourceCode = []
        
        self.currentPlayer: Player = None

    def commit(self, playerid, code) -> Commit:
        commit = Commit(playerid, code)
        self.sourceCode.append([commit.playerid, commit.code])
        return self.sourceCode
    
    def getCommitLogs(self):
        commitLogs = {
            "Commits":[] #[self.sourceCode[i][0], self.sourceCode[i][1]] for i in range(len(self.sourceCode))
        }
        for i in range(len(self.sourceCode)):
            commitLogs["Commits"].append([
                self.sourceCode[i][0],
                self.sourceCode[i][1]
            ]
        )   
           
        return commitLogs

    def startGame(self):
        self.state = "initializing"
        self.assignRoles()
        self.setVotes()
        self.assignTurns()
        self.getQuestion()
        self.state = "in-progress"

    async def addPlayer(self, id, websocket, name):
        player = Player(
            id=id,
            websocket=websocket,
            userName=name
        )  
        self.players.append(player)

        await self.emit(self.getListOfPlayers())

    async def emit(self, message):
        for player in self.players:
            await player.websocket.send(json.dumps(message))

    def assignRoles(self):
        for player in self.players:
            player.role = "crewmate"

        temp = self.players
        if len(self.players) == 1:
                imposter = temp[0]
                imposter.role = "imposter"
                return imposter
        
        imposter = temp[random.randrange(0, len(temp))]
        imposter.role = "imposter"
        return imposter

    def getOrder(self):
        order = []
        for player in self.turns:
            order.append(player.userName)
        return order


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

    def nextTurn(self):
        self.currentPlayer.active = False
        self.currentPlayer = self.currentPlayer.next
        self.currentPlayer.active = True
        return self.currentPlayer


    def addVote(self, playerid):
        for player in self.players:
            if player.id == playerid:
                player.votes += 1
                break

    def setVotes(self):
        for player in self.players:
            player.votes = 0

    def getVotes(self):
        votes = {
            player.userName: player.votes for player in self.players
        }
        return votes

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
               # "category": q["category"],
                "difficulty": q["difficulty"],
                "description": q["description"],
                "examples": q["examples"],
                "starter_code": q["starter_code"],
                "function_name": q["function_name"],
                "parameters": q["parameters"]
            } 
            for q in data["questions"]
        }
        self.questionId = random.randrange(1, len(questions)+1)

        question =  questions.get(self.questionId)        
        self.commit("SYSTEM", question["starter_code"])
        self.questionDifficulty = question["difficulty"]
        self.questionTitle = question["title"]
        #self.questionCategory = question["category"]
        self.questionDesc = question["description"]
        self.questionExample = question["examples"]
        self.questionStarterCode = question["starter_code"]    
        self.questionFuncName = question["function_name"]
        self.questionParameters.append(question["parameters"])
        return question

    def getSourceCode(self):
        print(self.sourceCode)
        return self.sourceCode[len(self.sourceCode)-1][1]
    
    def runcode(self):
        engine = Engine(self.getSourceCode(), self.getTests())
        results = engine.runTests()
        return results
    
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
        self.votes = 0
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

    # Manually add players without websockets for testing
    p1 = Player(id="p1", websocket=None, userName="Alice")
    p2 = Player(id="p2", websocket=None, userName="Bob")
    p3 = Player(id="p3", websocket=None, userName="Charlie")
    game.players = [p1, p2, p3]

    # Load a question (sets questionId and starter code)
    question = game.getQuestion()
    print(f"\nQuestion loaded: {game.questionTitle} ({game.questionDifficulty})")
    print(f"Starter code:\n{game.questionStarterCode}")

    # Simulate a player committing a solution
    solution_code = """
def two_sum(nums, target):
    seen = {}
    for i, num in enumerate(nums):
        complement = target - num
        if complement in seen:
            return [seen[complement], i]
        seen[num] = i
"""
    game.commit("p1", solution_code)
    print("\nCommit logs after player submission:")
    print(game.getCommitLogs())

    # Run the committed code against the test cases
    print("\nRunning code against test cases...")
    results = game.runcode()
    print("Test results:")
    print(results)
