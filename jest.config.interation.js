module.exports = {
    preset: "@shelf/jest-mongodb",
    globals: {
        "ts-jest": {
            tsconfig: "tsconfig.json"
        }
    },
    moduleFileExtensions: [
        "ts",
        "js"
    ],
    transform: {
        "^.+\\.(ts|tsx)$": "ts-jest"
    },
    testMatch: [
        "**/src/**/*.itest.(ts|js)"
    ],
    testEnvironment: "node"
};
