const calculator = document.querySelector('.calc');
const keys = calculator.querySelector('.keys');
const display = document.querySelector('.display');

var decimalUsed = false;

keys.addEventListener('click', e => {
	if (e.target.matches('button')) {
		const key = e.target;
		const action = key.dataset.action;
		const keyContent = key.textContent;
		const displayedSum = display.textContent;

		console.log(calculator.dataset.previousKeyType)

		if (!action) { // handle numbers being entered
			if (displayedSum === '0') {
				display.textContent = keyContent;
			} else {
				display.textContent = displayedSum + keyContent;
			}
			calculator.dataset.previousKeyType = 'number';
		} else {
			switch (action) {

				case 'add':
				case 'subtract':
				case 'multiply':
				case 'divide':
					if (calculator.dataset.previousKeyType !== 'operator') { // check if last thing entered was an operator
						key.classList.add('is-depressed');
						calculator.dataset.previousKeyType = 'operator';
						display.textContent = displayedSum + keyContent;
						decimalUsed = false
					}
				break;

				case 'decimal':
					if (
					calculator.dataset.previousKeyType !== 'operator' && 
					calculator.dataset.previousKeyType !== '.') {
						if (!decimalUsed) { // we can't have two decimals in a single number
											// are numbers, and numbers = operators + 1
							display.textContent = displayedSum + '.';
							decimalUsed = true;
						}
					}
				break;

				case 'decimal':
					if (display.textContent == '0') {
						display.textContent = '(';
						calculator.dataset.previousKeyType = '('
					}
					else if (calculator.dataset.previousKeyType == 'operator' ||
							 calculator.dataset.previousKeyType == '(') {
								display.textContent += '(';
								calculator.dataset.previousKeyType = '('
					}
				break;

				case 'close-bracket':
					if (calculator.dataset.previousKeyType == 'number' ||
						calculator.dataset.previousKeyType == ')') {
							display.textContent += ')';
							calculator.dataset.previousKeyType = ')'
						}
				break;

				case 'clear':
						calculator.dataset.previousKeyType = 'clear'
						display.textContent = 0;
						decimalUsed = false;
				break;
				case 'delete-prev':

					if (display.textContent != '0') {
						display.textContent = display.textContent.slice(0, -1);
					}
				break;
				case 'calculate':
						var leftBracketCount = (display.textContent.match(/\(/g) || []).length;
						var rightBracketCount = (display.textContent.match(/\)/g) || []).length;
			
						if (leftBracketCount == rightBracketCount) {
							tokens = tokeniseStringExpression(display.textContent);
							postFix = infixToPostfix(tokens);
							display.textContent = calculate(postFix);
						}
				break;
			}
		}
	}
})

function infixToPostfix(infix) {
	var infixTokens = []
	var outputQueue = []
	var operatorStack = []

	for (i = 0; i < infix.length; i++) {
		if (isNumeric(infix[i])) {
			outputQueue.push(infix[i]);
		}
		else if (isOperator(infix[i]) && operatorStack.length == 0) {
			operatorStack.push(infix[i]);
		}
		else if (isOperator(infix[i]) && operatorStack.length != 0) {
			while (operatorStack.length != 0) {
				if (getPrecedence(operatorStack[operatorStack.length-1]) > getPrecedence(infix[i])) {
					outputQueue.push(operatorStack.pop());
				}
				else {
					operatorStack.push(infix[i]);
					break;
				}
			}
		}
		else if (infix[i] == '(') {
			operatorStack.push(infix[i]);
		}
		else if (infix[i] ==')') {
			while (operatorStack[operatorStack.length-1] != '(') {
				outputQueue.push(operatorStack.pop());
			}
			operatorStack.pop()
		}
	}
	while (operatorStack.length != 0) {
		outputQueue.push(operatorStack.pop());
	}
	return outputQueue;
}

function calculate(postFixExp) {
	var stack = []

	for (i = 0; i < postFixExp.length; i++) {
		if (isNumeric(postFixExp[i])) {
			postFixExp[i] = parseFloat(postFixExp[i])
			console.log("Converting string num to integer...")
		}

		if (postFixExp[i] == '+') {
			console.log("Adding...")
			stack.push(parseFloat(stack.pop()) + parseFloat(stack.pop()));
		}
		else if (postFixExp[i] == '-') {
			console.log("Subtracting...")
			stack.push(-parseFloat(stack.pop()) + parseFloat(stack.pop()));
		}
		else if (postFixExp[i] == '×') {
			console.log("Multiplying...")
			stack.push(parseFloat(stack.pop()) * parseFloat(stack.pop()));
		}
		else if (postFixExp[i] == '÷') {
			console.log("Dividing...")
			var operand1 = parseFloat(stack.pop());
			var operand2 = parseFloat(stack.pop());
			stack.push((operand2 / operand1).toFixed(2));
		}
		else {
			stack.push(postFixExp[i]);
		}
	}

	return stack;
}

function isOperator(input) {
	return (input === '+' ||
			input === '-' ||
			input === '×' ||
			input === '÷')
}

function getPrecedence(input) { //TODO: add exponents & brackets
	switch (input) {
		case '÷':
		case '×':
			return 2;
		case '+':
		case '-':
			return 1;
		default:
			return 0;
	}
}

function isNumeric(input) {
	return !isNaN(input);
}

function isBracket(input) {
	return (input == '(' || input == ')');
}

function tokeniseStringExpression(expression) {
	var tokens = [];
	var index = 0;

	while (index < expression.length) {
		var startingIndex = index;
		while (!isOperator(expression[index]) &&
			  (index < expression.length) &&
			  expression[index] != '(' &&
			  expression[index] != ')') {
				index++;
		}
		var endingIndex = index;
	
		var currentToken = ""
		for (i = startingIndex; i < endingIndex; i++) {
			currentToken += expression[i];
		}
		if (currentToken != "") {
			tokens.push(currentToken);
		}
		if (isOperator(expression[index])) {
			tokens.push(expression[index]);
		}
		else if (isBracket(expression[index])) {
			tokens.push(expression[index]);
		}
		else {
			console.log(tokens);
			tokens = tokens.filter(Boolean);
			return tokens;
		}
		index++;
	}
	return tokens;
}