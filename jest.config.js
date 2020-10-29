module.exports = {
    verbose: true,
    setupFiles:["<rootDir>/setupJest.js"],
    modulePathIgnorePatterns:['<rootDir>/src/__tests__/utils',
    '<rootDir>/package',
    '<rootDir>/dist']
};