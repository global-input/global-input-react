const mockConsoleMethod = (realConsoleMethod) => {
  const ignoredMessages = [
    "test was not wrapped in act(...)"
  ];

  return (message, ...args) => {
    const containsIgnoredMessage = ignoredMessages.some((ignoredMessage) => message.includes(ignoredMessage));

    if (!containsIgnoredMessage) {
      realConsoleMethod(message, ...args);
    }
  };
};

// Suppress console errors and warnings to avoid polluting output in tests.
console.warn = jest.fn(mockConsoleMethod(console.warn));
console.error = jest.fn(mockConsoleMethod(console.error));