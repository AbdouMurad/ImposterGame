import random


class Game:
    def __init__(self, gameId):
        self.state = "waiting"
        self.gameId = gameId
        self.players = []
        self.questionId = None
        self.selectedQuestion = ""
        self.currentPlayer: Player = None

    def startGame(self):
        self.state = "initializing"
        self.assignRoles()
        self.assignTurns()
        self.getQuestion()
        self.state = "in-progress"

    def addPlayer(self, id, websocket, name):
        player = Player(
            id=id,
            websocket=websocket,
            name=name
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

    def getQuestion(Id):  
        pass

    def selectQuestion(self):
        pass


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
    # Setup
    game = Game("game1")
    p1 = Player("Alice")
    p2 = Player("Bob")
    p3 = Player("Charlie")

    for p in [p1, p2, p3]:
        game.addPlayer(p)

    # Show players list
    print("=== Players List ===")
    for p in game.players:
        print(f"  {p.userName}")

    # Test linked list
    print("\n=== Linked List ===")
    print(f"p1.next: {p1.next.userName}")   # Bob
    print(f"p2.back: {p2.back.userName}")   # Alice
    print(f"p3.back: {p3.back.userName}")   # Bob

    # Test roles
    print("\n=== Roles ===")
    imposter = game.assignRoles()
    print(f"Imposter: {imposter.userName}")
    for p in game.players:
        print(f"  {p.userName}: {p.role}")

    # Test turns
    print("\n=== Turn Order ===")
    game.assignTurns()
    for p in game.players:
        print(f"  {p.userName}")

    # Test nextPlayer
    print("\n=== Next Player ===")
    game.currentPlayer = p1
    print(f"Current: {game.currentPlayer.userName}")
    game.nextPlayer()
    print(f"After next: {game.currentPlayer.userName}")
