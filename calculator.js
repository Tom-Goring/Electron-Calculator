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

		if (!action) { // handle numbers being entered
			if (displayedSum === '0') {
				display.textContent = keyContent;
			} else {
				display.textContent = displayedSum + keyContent;
			}
			calculator.dataset.previousKeyType = 'number';
		} 
		else if ( // handle an operator being pressed
			action === 'add' ||
			action === 'subtract' ||
			action === 'multiply' ||
			action === 'divide'
		) {
			if (calculator.dataset.previousKeyType !== 'operator') { // check if last thing entered was an operator
				key.classList.add('is-depressed');
				calculator.dataset.previousKeyType = 'operator';
				display.textContent = displayedSum + keyContent;
				decimalUsed = false
			}
		}
		else if (action === 'decimal' && 
		calculator.dataset.previousKeyType !== 'operator' && 
		calculator.dataset.previousKeyType !== '.') {
			if (!decimalUsed) { // we can't have two decimals in a single number
								// are numbers, and numbers = operators + 1
				display.textContent = displayedSum + '.';
				decimalUsed = true;
			}
		}
		else if (action === 'clear') {
			calculator.dataset.previousKeyType = 'clear'
			display.textContent = 0;
		}
		else if (action === 'calculate') {
			tokens = tokeniseStringExpression(display.textContent);
			postFix = infixToPostfix(tokens);
			console.log(postFix);
			display.textContent = calculate(postFix);
		}
	}
})

function infixToPostfix(infix) {
	var postFixTokens = []
	var stack = []
	var infixTokens = []

	for (i = 0; i < infix.length; i++) {
		if (isNumeric(infix[i])) {
			postFixTokens.push(infix[i]);
		}
		else if (isOperator(infix[i]) && stack.length == 0) {
			stack.push(infix[i]);
		}
		else if (isOperator(infix[i]) && stack.length != 0) {
			while (stack.length != 0) {
				if (getPrecedence(stack[stack.length-1]) > getPrecedence(infix[i])) {
					postFixTokens.push(stack.pop());
				}
				else {
					stack.push(infix[i]);
					break;
				}
			}
		}
	}
	while (stack.length != 0) {
		postFixTokens.push(stack.pop());
	}
	return postFixTokens;
}

function calculate(postFixExp) {
	var stack = []

	for (i = 0; i < postFixExp.length; i++) {
		if (isNumeric(postFixExp[i])) {
			postFixExp[i] = parseInt(postFixExp[i])
			console.log("Converting string num to integer...")
		}

		if (postFixExp[i] == '+') {
			console.log("Adding...")
			stack.push(parseInt(stack.pop()) + parseInt(stack.pop()));
		}
		else if (postFixExp[i] == '-') {
			console.log("Subtracting...")
			stack.push(-parseInt(stack.pop()) + parseInt(stack.pop()));
		}
		else if (postFixExp[i] == '×') {
			console.log("Multiplying...")
			stack.push(parseInt(stack.pop()) * parseInt(stack.pop()));
		}
		else if (postFixExp[i] == '÷') {
			console.log("Dividing...")
			stack.push((parseInt(stack.pop()) / parseInt(stack.pop())).toFixed(2));
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

function tokeniseStringExpression(expression) {
	var tokens = [];
	var index = 0;

	while (index < expression.length) {
		var startingIndex = index;
		while (!isOperator(expression[index]) && (index < expression.length)) {
			index++;
		}
		var endingIndex = index;
	
		var currentToken = ""
		for (i = startingIndex; i < endingIndex; i++) {
			currentToken += expression[i];
		}
		tokens.push(currentToken);

		if (isOperator(expression[index])) {
			tokens.push(expression[index]);
		}
		else {
			console.log(tokens);
			return tokens;
		}
		index++;
	}
}