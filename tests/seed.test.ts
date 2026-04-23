const mockFrom = jest.fn();
const mockReturning = jest.fn();

const mockSelect = jest.fn(() => ({
  from: mockFrom,
}));

const mockInsert = jest.fn((table) => ({
  values: jest.fn(() => {
    if (table === 'categories') {
      return {
        returning: mockReturning,
      };
    }

    return Promise.resolve();
  }),
}));

jest.mock('../db/client', () => ({
  db: {
    select: mockSelect,
    insert: mockInsert,
  },
}));

jest.mock('../db/schema', () => ({
  applications: 'applications',
  categories: 'categories',
  targets: 'targets',
}));

describe('seedApplicationsIfEmpty', () => {
  let seedApplicationsIfEmpty: () => Promise<void>;

  beforeEach(() => {
    jest.clearAllMocks();
    ({ seedApplicationsIfEmpty } = require('../db/seed'));
  });

  it('adds categories, applications, and targets when tables are empty', async () => {
    mockFrom
      .mockResolvedValueOnce([])
      .mockResolvedValueOnce([])
      .mockResolvedValueOnce([]);

    mockReturning.mockResolvedValueOnce([
      { id: 1, name: 'Tech', color: '#2563EB' },
      { id: 2, name: 'Finance', color: '#16A34A' },
      { id: 3, name: 'Consulting', color: '#F59E0B' },
    ]);

    await seedApplicationsIfEmpty();

    expect(mockSelect).toHaveBeenCalledTimes(3);
    expect(mockInsert).toHaveBeenCalledTimes(3);
  });

  it('does not add duplicate applications when applications already exist', async () => {
    mockFrom
      .mockResolvedValueOnce([{ id: 1 }])
      .mockResolvedValueOnce([
        { id: 1, name: 'Tech', color: '#2563EB' },
        { id: 2, name: 'Finance', color: '#16A34A' },
        { id: 3, name: 'Consulting', color: '#F59E0B' },
      ])
      .mockResolvedValueOnce([{ id: 1, type: 'weekly', amount: 5 }]);

    await seedApplicationsIfEmpty();

    expect(mockInsert).not.toHaveBeenCalledWith(
      'applications'
    );
  });
});