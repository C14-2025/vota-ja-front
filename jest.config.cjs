module.exports = {
  preset: "ts-jest",
  testEnvironment: "jsdom",
  moduleFileExtensions: ["ts", "tsx", "js", "jsx", "json", "node"],
  transform: {
    "^.+\\.(ts|tsx)$": [
      "ts-jest",
      {
        tsconfig: "tsconfig.jest.json",
      },
    ],
  },
  moduleNameMapper: {
    "\\.(css|less|sass|scss)$": "<rootDir>/tests/__mocks__/styleMock.ts",
    "\\.(gif|ttf|eot|svg|png|jpg|jpeg)$":
      "<rootDir>/tests/__mocks__/fileMock.ts",
  },
  testMatch: ["**/?(*.)+(spec|test).+(ts|tsx|js)"],
};
