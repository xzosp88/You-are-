import React, { useState, useCallback } from 'react';

// Helper function to perform the calculation
const calculate = (firstOperand, secondOperand, operator) => {
  const num1 = parseFloat(firstOperand);
  const num2 = parseFloat(secondOperand);

  if (isNaN(num1) || isNaN(num2)) return NaN;

  switch (operator) {
    case '+':
      return num1 + num2;
    case '-':
      return num1 - num2;
    case '*':
      return num1 * num2;
    case '/':
      if (num2 === 0) {
        return 'ERROR: Div by Zero';
      }
      return num1 / num2;
    case '%':
        return num1 * (num2 / 100); // Standard calculator behavior uses % slightly differently, but basic percentage calculation is applied here.
    default:
      return num2;
  }
};

const App = () => {
  const [displayValue, setDisplayValue] = useState('0');
  const [operator, setOperator] = useState(null);
  const [prevValue, setPrevValue] = useState(null);
  const [waitingForOperand, setWaitingForOperand] = useState(true);
  const [error, setError] = useState(null);

  // Clear all state
  const clearAll = useCallback(() => {
    setDisplayValue('0');
    setOperator(null);
    setPrevValue(null);
    setWaitingForOperand(true);
    setError(null);
  }, []);

  // Handle digit input (0-9)
  const inputDigit = useCallback((digit) => {
    if (error) return;

    if (waitingForOperand) {
      setDisplayValue(String(digit));
      setWaitingForOperand(false);
    } else {
      setDisplayValue(displayValue === '0' ? String(digit) : displayValue + digit);
    }
  }, [displayValue, waitingForOperand, error]);

  // Handle decimal point
  const inputDecimal = useCallback(() => {
    if (error) return;
    if (waitingForOperand) {
      setDisplayValue('0.');
      setWaitingForOperand(false);
      return;
    }
    if (!displayValue.includes('.')) {
      setDisplayValue(displayValue + '.');
    }
  }, [displayValue, waitingForOperand, error]);

  // Handle +/- sign toggle
  const toggleSign = useCallback(() => {
    if (error) return;
    setDisplayValue(String(parseFloat(displayValue) * -1));
  }, [displayValue, error]);

  // Perform calculation or store first operand
  const performOperation = useCallback((nextOperator) => {
    if (error) return;

    const inputValue = parseFloat(displayValue);

    // Pressing an operator after an error or initial state
    if (prevValue === null && !isNaN(inputValue)) {
      setPrevValue(inputValue);
    } else if (operator) {
      const result = calculate(prevValue, inputValue, operator);

      if (typeof result === 'string' && result.startsWith('ERROR')) {
        setError(result);
        setDisplayValue('Error');
        setPrevValue(null);
        setOperator(null);
        return;
      }

      // Format result, avoiding excessive decimals
      const formattedResult = String(
        Math.round(result * 1000000000000) / 1000000000000
      );

      setDisplayValue(formattedResult);
      setPrevValue(formattedResult);
    }

    setWaitingForOperand(true);
    setOperator(nextOperator === '=' ? null : nextOperator);
  }, [displayValue, operator, prevValue, error]);

  // Determine button press action
  const handleButtonClick = (label) => {
    if (label === 'AC') {
      clearAll();
    } else if (label >= '0' && label <= '9') {
      inputDigit(label);
    } else if (label === '.') {
      inputDecimal();
    } else if (label === '+/-') {
      toggleSign();
    } else if (['+', '-', '*', '/', '=', '%'].includes(label)) {
      performOperation(label);
    }
  };

  // Define button structure and styling
  const buttons = [
    { label: 'AC', className: 'text-black bg-gray-300 hover:bg-gray-400', action: 'clear' },
    { label: '+/-', className: 'text-black bg-gray-300 hover:bg-gray-400', action: 'sign' },
    { label: '%', className: 'text-black bg-gray-300 hover:bg-gray-400', action: 'operator' },
    { label: '/', className: 'bg-orange-500 hover:bg-orange-600', action: 'operator' },

    { label: '7', className: 'bg-gray-700 hover:bg-gray-600', action: 'digit' },
    { label: '8', className: 'bg-gray-700 hover:bg-gray-600', action: 'digit' },
    { label: '9', className: 'bg-gray-700 hover:bg-gray-600', action: 'digit' },
    { label: '*', className: 'bg-orange-500 hover:bg-orange-600', action: 'operator' },

    { label: '4', className: 'bg-gray-700 hover:bg-gray-600', action: 'digit' },
    { label: '5', className: 'bg-gray-700 hover:bg-gray-600', action: 'digit' },
    { label: '6', className: 'bg-gray-700 hover:bg-gray-600', action: 'digit' },
    { label: '-', className: 'bg-orange-500 hover:bg-orange-600', action: 'operator' },

    { label: '1', className: 'bg-gray-700 hover:bg-gray-600', action: 'digit' },
    { label: '2', className: 'bg-gray-700 hover:bg-gray-600', action: 'digit' },
    { label: '3', className: 'bg-gray-700 hover:bg-gray-600', action: 'digit' },
    { label: '+', className: 'bg-orange-500 hover:bg-orange-600', action: 'operator' },

    { label: '0', className: 'col-span-2 bg-gray-700 hover:bg-gray-600', action: 'digit' }, // Spans 2 columns
    { label: '.', className: 'bg-gray-700 hover:bg-gray-600', action: 'decimal' },
    { label: '=', className: 'bg-orange-500 hover:bg-orange-600', action: 'equals' },
  ];

  const currentDisplay = error || displayValue;

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-900 p-4">
      <div className="w-full max-w-sm bg-black rounded-xl shadow-2xl overflow-hidden p-2">
        
        {/* Display */}
        <div className="h-28 flex items-end justify-end p-4 mb-2 bg-gray-800 rounded-lg">
          <p
            className={`text-white font-light ${
              error ? 'text-red-400 text-3xl' : 'text-5xl md:text-6xl'
            } truncate max-w-full`}
            style={{ fontFamily: 'sans-serif' }}
          >
            {currentDisplay}
          </p>
        </div>

        {/* Buttons Grid */}
        <div className="grid grid-cols-4 gap-3">
          {buttons.map((button) => (
            <button
              key={button.label}
              onClick={() => handleButtonClick(button.label)}
              className={`
                ${button.className}
                text-white 
                font-semibold 
                text-2xl 
                p-4 
                rounded-full 
                transition-colors 
                duration-150
                ${button.label === '0' ? 'text-left pl-8' : ''}
              `}
              // Ensure size consistency for non-zero buttons
              style={{
                aspectRatio: button.label === '0' ? 'auto' : '1 / 1',
                height: button.label === '0' ? 'auto' : '5rem',
              }}
            >
              {button.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default App;