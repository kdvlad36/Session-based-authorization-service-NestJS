// Моки Firestore
const mockFirestore = {
  collection: jest.fn().mockImplementation(() => ({
    doc: jest.fn().mockImplementation(() => ({
      set: jest.fn().mockResolvedValue(true),
      get: jest.fn().mockResolvedValue(true),
      update: jest.fn().mockResolvedValue(true),
    })),
  })),
};

// Функция для создания мока timestamp
const createTimestampMock = () => ({
  toDate: jest.fn(() => new Date()),
  toMillis: jest.fn(() => new Date().getTime()),
});

// Мок для admin.firestore.Timestamp
const timestamp = {
  now: jest.fn(createTimestampMock),
  fromMillis: jest.fn(createTimestampMock),
  fromDate: jest.fn(createTimestampMock),
};

// dbMock
const userRefMock = {
  get: jest.fn().mockResolvedValueOnce({
    exists: true,
    data: jest.fn().mockReturnValueOnce({
      sessions: [],
    }),
  }),
  update: jest.fn().mockResolvedValueOnce({}),
};

const dbMock = {
  collection: jest.fn(() => {
    return {
      doc: jest.fn(() => userRefMock),
    };
  }),
};

// Полный мок для firebase-admin
const mockFirebaseAdmin = {
  initializeApp: jest.fn(),
  credential: {
    cert: jest.fn(),
  },
  auth: jest.fn(() => ({
    createUser: jest
      .fn()
      .mockResolvedValue({ uid: 'some-uid', email: 'test@example.com' }),
    verifyIdToken: jest.fn().mockResolvedValue({ uid: 'some-uid' }),
  })),
  firestore: jest.fn(() => ({
    ...mockFirestore,
    ...dbMock, // Добавляем dbMock здесь
    Timestamp: timestamp,
  })),
};

export default mockFirebaseAdmin;

// Использование мока
jest.mock('firebase-admin', () => mockFirebaseAdmin);
