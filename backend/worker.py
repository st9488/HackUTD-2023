
class Worker:

    

    def __init__(self, type):
        self.type = type

        self.events = self.retrieveCurrentEvents()

    def retrieveCurrentEvents(self):
        return []
    
    def addEvent(self, event):
        self.events.append(event)

    def makeSuggestions(self):
        return []