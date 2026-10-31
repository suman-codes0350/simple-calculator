const display = document.getElementById("display");
const buttons = document.querySelector(".buttons");

let expression = "";
let justCalculated = false;

function updateDisplay(value = expression) {
  display.value = value || "0";
}

function addValue(value) {
  const isOperator = ["+", "-", "*", "/"].includes(value);

  if (justCalculated && !isOperator) {
    expression = "";
  }
  justCalculated = false;

  if (isOperator) {
    if (expression === "" && value !== "-") return;
    if (/[+*/-]$/.test(expression)) {
      expression = expression.slice(0, -1);
    }
    expression += value;
  } else if (value === ".") {
    const currentNumber = expression.split(/[+*/-]/).pop();
    if (currentNumber.includes(".")) return;
    expression += currentNumber === "" ? "0." : ".";
  } else {
    expression += value;
  }

  updateDisplay();
}

function calculate() {
  if (!expression || /[+*/.-]$/.test(expression)) return;

  // Only allow numbers and basic arithmetic operators.
  if (!/^[0-9+*/.\- ]+$/.test(expression)) {
    updateDisplay("Invalid input");
    expression = "";
    return;
  }

  try {
    const result = Function('"use strict"; return (' + expression + ')')();
    if (!Number.isFinite(result)) throw new Error("Invalid result");
    expression = String(Number(result.toFixed(10)));
    justCalculated = true;
    updateDisplay();
  } catch {
    expression = "";
    updateDisplay("Error");
  }
}

buttons.addEventListener("click", (event) => {
  const button = event.target.closest("button");
  if (!button) return;

  const action = button.dataset.action;
  const value = button.dataset.value;

  if (action === "clear") {
    expression = "";
    justCalculated = false;
    updateDisplay();
  } else if (action === "delete") {
    expression = expression.slice(0, -1);
    justCalculated = false;
    updateDisplay();
  } else if (action === "calculate") {
    calculate();
  } else if (value !== undefined) {
    addValue(value);
  }
});

document.addEventListener("keydown", (event) => {
  if (/^[0-9.+*/-]$/.test(event.key)) {
    addValue(event.key);
  } else if (event.key === "Enter" || event.key === "=") {
    event.preventDefault();
    calculate();
  } else if (event.key === "Backspace") {
    expression = expression.slice(0, -1);
    updateDisplay();
  } else if (event.key === "Escape") {
    expression = "";
    updateDisplay();
  }
});
