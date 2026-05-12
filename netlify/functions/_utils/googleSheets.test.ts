import { describe, it, expect, vi, beforeEach } from 'vitest';
import { initializeFirebaseAdmin, getOrCreatePssSheet, savePssResult, listRecentResults } from './googleSheets';

describe('Google Sheets/Database Utilities', () => {
  let mockAdminApp: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    vi.clearAllMocks();
    mockAdminApp = vi.mocked(admin.database());
  });

  describe('initializeFirebaseAdmin', () => {
    it('initializes Firebase admin with service account', async () => {
      const mockApp = {
        auth: vi.fn(),
        database: vi.fn(),
      };
      vi.spyOn(admin, 'initializeApp').mockReturnValue(mockApp);

      await initializeFirebaseAdmin();

      expect(admin.initializeApp).toHaveBeenCalled();
      expect(admin.apps).toContain(mockApp);
    });

    it('returns first app instance', async () => {
      const mockApp = {
        auth: vi.fn(),
        database: vi.fn(),
      };
      vi.spyOn(admin, 'initializeApp').mockReturnValue(mockApp);

      const result = await initializeFirebaseAdmin();

      expect(result).toBe(mockApp);
    });
  });

  describe('getOrCreatePssSheet', () => {
    it('returns database reference for assessments', async () => {
      const mockRef = { child: vi.fn() };
      mockAdminApp.ref.mockReturnValue(mockRef);

      const result = await getOrCreatePssSheet(mockAdminApp);

      expect(mockAdminApp.ref).toHaveBeenCalledWith('pss_assessments');
    });
  });

  describe('savePssResult', () => {
    it('saves result with unique key', async () => {
      const mockRef = { child: vi.fn().child };
      const mockChild = { set: vi.fn() };
      mockAdminApp.ref.mockReturnValue({ child: vi.fn().mockReturnValue(mockChild) });

      await savePssResult(mockAdminApp, {
        userId: 'test-uid',
        answers: [{ questionId: 1, answerValue: 2 }],
        score: 2,
        category: 'Low Stress',
        timestamp: new Date().toISOString(),
      });

      expect(mockChild.set).toHaveBeenCalledWith({
        userId: 'test-uid',
        answers: [{ questionId: 1, answerValue: 2 }],
        score: 2,
        category: 'Low Stress',
        timestamp: expect.any(String),
        createdAt: expect.anything(),
      });
    });
  });

  describe('listRecentResults', () => {
    it('returns empty array when no results exist', async () => {
      const mockSnapshot = {
        exists: vi.fn().mockReturnValue(false),
      };
      mockAdminApp.ref.mockImplementation((ref) => {
        const mockRef = {
          limitToFirst: vi.fn().mockImplementation((limit) => {
            const result = mockSnapshot;
            result.once = vi.fn().mockReturnValue(result);
            return result;
          }),
        };
        return mockRef;
      });

      const result = await listRecentResults(mockAdminApp);

      expect(result).toEqual([]);
    });

    it('returns results when snapshot exists', async () => {
      const mockSnapshot = {
        exists: vi.fn().mockReturnValue(true),
        val: vi.fn().mockReturnValue({
          'result_uid_1': { userId: 'uid1', score: 10 },
          'result_uid_2': { userId: 'uid2', score: 20 },
        }),
      };
      mockAdminApp.ref.mockImplementation((ref) => {
        const mockRef = {
          limitToFirst: vi.fn().mockImplementation((limit) => {
            const result = mockSnapshot;
            result.once = vi.fn().mockReturnValue(result);
            return result;
          }),
        };
        return mockRef;
      });

      const result = await listRecentResults(mockAdminApp);

      expect(result).toEqual([
        { userId: 'uid1', score: 10 },
        { userId: 'uid2', score: 20 },
      ]);
    });
  });
});
