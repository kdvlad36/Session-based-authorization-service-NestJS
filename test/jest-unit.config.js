module.exports = {
  roots: ['<rootDir>'], // Обновленный путь
  testMatch: ['**/*.spec.ts'], // Паттерн, по которому Jest будет искать тестовые файлы
  transform: {
    '^.+\\.(t|j)s$': 'ts-jest', // Здесь только ts-jest
  },
  moduleFileExtensions: ['ts', 'js', 'json'],
  testEnvironment: 'node',
  globals: {
    'ts-jest': {
      tsconfig: 'tsconfig.json', // Указание пути к tsconfig.json
    },
  },
};
