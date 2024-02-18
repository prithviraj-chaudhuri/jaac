import os

def addNumbers(a, b):
    sum = a + b
    return sum

def printEnv():
    print(os.getenv("TEST"))