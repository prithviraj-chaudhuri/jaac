from math_utils import Calculator

# Create a calculator object with initial values
c = C(5, 3)

# Perform addition using the class method
result = c.perform_operation("add")
print(f"result: {result}")

# Perform multiplication using the imported function
result_m = m(c.num1, c.num2)
print(f"Multiplication result (using external function): {result_m}")