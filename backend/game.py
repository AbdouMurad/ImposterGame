import random

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

    def getQuestion(Id):  
        pass

    def selectQuestion(self):
        pass


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
