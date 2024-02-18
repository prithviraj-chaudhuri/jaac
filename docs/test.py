def print_argument(func):
    def wrapper(the_number):
        print("Argument for", func.__name__, "is", the_number)
        return func(the_number)
    return wrapper

@print_argument
def add_one(x):
    return x + 1
print(add_one(1))