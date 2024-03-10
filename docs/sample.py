import os

def addNumbers(a, b):
    sum = a + b
    return sum

def printEnv():
    print(os.getenv("TEST"))


def new_fuction():
    printEnv()
    result = addNumbers(10, 12)
    return result
