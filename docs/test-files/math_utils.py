def a(x, y):
  """Adds two numbers and returns the sum."""
  return x + y

def s(x, y):
  """Subtracts two numbers and returns the difference."""
  return x - y

def m(x, y):
  """Multiplies two numbers and returns the product."""
  return x * y

class C:
  """A basic calculator class."""

  def __init__(self, num1, num2):
    """Initializes the calculator with two numbers."""
    self.num1 = num1
    self.num2 = num2

  def perform_operation(self, operation):
    """Performs a specified operation on the stored numbers."""
    if operation == "add":
      return a(self.num1, self.num2)
    elif operation == "subtract":
      return s(self.num1, self.num2)
    elif operation == "multiply":
      return m(self.num1, self.num2)
    else:
      raise ValueError("Invalid operation")
