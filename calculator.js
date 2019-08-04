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
			postFix = infixToPostfix(display.textContent);
			display.textContent = postFix;
		}
	}
})

function infixToPostfix(infix) {
	var postFixString = []
	var stack = []

	for (i = 0; i < infix.length; i++) {
		if (isNumeric(infix[i])) {
			postFixString.push(infix[i]);
		}
		else if (isOperator(infix[i]) && stack.length == 0) {
			stack.push(infix[i]);
		}
		else if (isOperator(infix[i]) && stack.length != 0) {
			while (stack.length != 0) {
				if (getPrecedence(stack[stack.length-1]) > getPrecedence(infix[i])) {
					postFixString.push(stack.pop());
				}
				else {
					stack.push(infix[i]);
					break;
				}
			}
		}
	}
	while (stack.length != 0) {
		postFixString.push(stack.pop());
	}
	tmp = postFixString;
	postFixString = ""
	for (i = 0; i < tmp.length; i++) {
		postFixString += tmp[i];
	}
	return postFixString;
}

function calculate() {


}

function isOperator(input) {
	return (input === '+' ||
			input === '-' ||
			input === '&times' ||
			input === '÷')
}

function getPrecedence(input) { //TODO: add exponents & brackets
	switch (input) {
		case '÷':
		case '&times':
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