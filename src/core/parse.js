export function parse(value = '') {
  if (value.startsWith('=')) {
    try {
      return evaluateExpression(value.slice(1));
    } catch (e) {
      console.warn('Skipping parse error', e.message);
    }
  }
  return value;
}

/* =============== Токенизация ================ */
const NUMBER_PATTERN = /[0-9.]/;
const OPERATORS = ['+', '-', '*', '/', '(', ')'];

// Разбиваем выражение на токены
function tokenize(expression) {
  const tokens = [];
  let currentNumber = '';

  for (let index = 0; index < expression.length; index++) {
    const symbol = expression[index];

    if (symbol === ' ') {
      continue;
    }

    if (NUMBER_PATTERN.test(symbol)) {
      currentNumber += symbol;
      continue;
    }

    if (currentNumber) {
      tokens.push(currentNumber);
      currentNumber = '';
    }

    if (!OPERATORS.includes(symbol)) {
      throw new Error(`Invalid symbol: ${symbol}`);
    }
    tokens.push(symbol);
  }

  if (currentNumber) {
    tokens.push(currentNumber);
  }

  if (!tokens.length) {
    throw new Error('Empty expression');
  }

  return tokens;
}

/* =============== Преобразование в RPN ================ */
const OP_PRECEDENCE = {
  'u-': 3,
  '*': 2,
  '/': 2,
  '+': 1,
  '-': 1
};

// Приводим инфиксное выражение к обратной польской записи
function toRpn(tokens) {
  const output = [];
  const stack = [];
  let previousToken = null;

  tokens.forEach((token) => {
    if (isNumber(token)) {
      output.push(token);
      previousToken = token;
      return;
    }

    if (token === '(') {
      stack.push(token);
      previousToken = token;
      return;
    }

    if (token === ')') {
      while (stack.length && stack[stack.length - 1] !== '(') {
        output.push(stack.pop());
      }
      if (stack[stack.length - 1] !== '(') {
        throw new Error('Mismatched parentheses');
      }
      stack.pop();
      previousToken = token;
      return;
    }

    const normalizedToken = normalizeOperator(token, previousToken);
    while (shouldPopOperator(stack[stack.length - 1], normalizedToken)) {
      output.push(stack.pop());
    }
    stack.push(normalizedToken);
    previousToken = normalizedToken;
  });

  while (stack.length) {
    const operator = stack.pop();
    if (operator === '(' || operator === ')') {
      throw new Error('Mismatched parentheses');
    }
    output.push(operator);
  }

  return output;
}

/* =============== Вычисление выражения ================ */
// Вычисляем арифметику из обратной польской записи
function evaluateRpn(rpnTokens) {
  const stack = [];

  rpnTokens.forEach((token) => {
    if (isNumber(token)) {
      stack.push(Number(token));
      return;
    }

    if (token === 'u-') {
      if (!stack.length) {
        throw new Error('Invalid unary operator');
      }
      const value = stack.pop();
      stack.push(-value);
      return;
    }

    if (stack.length < 2) {
      throw new Error('Invalid expression');
    }

    const right = stack.pop();
    const left = stack.pop();
    stack.push(applyOperator(token, left, right));
  });

  if (stack.length !== 1) {
    throw new Error('Invalid expression');
  }

  return stack[0];
}

// Считаем арифметическую операцию
function applyOperator(operator, left, right) {
  switch (operator) {
    case '+':
      return left + right;
    case '-':
      return left - right;
    case '*':
      return left * right;
    case '/':
      return left / right;
    default:
      throw new Error(`Unknown operator: ${operator}`);
  }
}

// Вычисляем выражение без eval
function evaluateExpression(expression) {
  const tokens = tokenize(expression);
  const rpnTokens = toRpn(tokens);
  return evaluateRpn(rpnTokens);
}

/* =============== Предикаты и служебные функции ================ */
// Проверяем, что токен является числом
function isNumber(token) {
  return !Number.isNaN(Number(token));
}

// Нормализуем минус к унарной форме при необходимости
function normalizeOperator(token, previousToken) {
  if (token !== '-') {
    return token;
  }

  if (!previousToken || isOperator(previousToken) || previousToken === '(') {
    return 'u-';
  }

  return token;
}

// Решаем, нужно ли извлекать оператор со стека
function shouldPopOperator(stackTop, currentOperator) {
  if (!isOperator(stackTop)) {
    return false;
  }

  if (currentOperator === 'u-') {
    return OP_PRECEDENCE[stackTop] > OP_PRECEDENCE[currentOperator];
  }

  return OP_PRECEDENCE[stackTop] >= OP_PRECEDENCE[currentOperator];
}

// Проверяем, что токен является оператором
function isOperator(token) {
  return Object.prototype.hasOwnProperty.call(OP_PRECEDENCE, token);
}
