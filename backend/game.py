import random
import json

class Node:
    def __init__(self):
        self.next = None
        self.back = None  #
class Game:
    def __init__(self, gameId):
        self.gameId = gameId
        self.players = []
        self.questionId = None
        self.currentPlayer: Player = None

    def addPlayer(self, player):  
        self.players.append(player)

        # Link the new player into the linked list
        if len(self.players) > 1:
            prev = self.players[-2]
            prev.next = player
            player.back = prev

    def assignRoles(self):
        for player in self.players:
            player.role = "crewmate"

        temp = self.players
        imposter = temp[random.randrange(len(temp))]
        imposter.role = "imposter"
        return imposter

    def assignTurns(self):
        random.shuffle(self.players)  
        return self.players

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
        return questions.get(random.randrange(1, len(questions)+1))        
    
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
        return questions.get(Id)


class Player(Node):
    def __init__(self, userName):
        super().__init__()
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
 

   