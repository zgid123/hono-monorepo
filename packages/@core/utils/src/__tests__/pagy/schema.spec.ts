import { Metadata } from '../../pagy';

describe('#Metadata', () => {
  suite('when metadata is valid', () => {
    it('returns the metadata', () => {
      const result = Metadata.assert({
        page: 1,
        limit: 10,
        total: 25,
      });

      expect(result).toEqual({
        page: 1,
        limit: 10,
        total: 25,
      });
    });
  });

  suite('when metadata contains a non-number', () => {
    it('throws a validation error', () => {
      expect(() => {
        Metadata.assert({
          page: 1,
          limit: '10',
          total: 25,
        });
      }).toThrow();
    });
  });
});
