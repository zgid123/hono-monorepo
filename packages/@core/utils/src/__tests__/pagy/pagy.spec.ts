import { resolvePagy } from '../../pagy';

describe('#resolvePagy', () => {
  suite('when page and limit are invalid', () => {
    it('returns the default pagination', () => {
      const result = resolvePagy({
        page: Number.NaN,
        limit: Number.NaN,
      });

      expect(result).toEqual({
        page: 1,
        limit: 10,
        offset: 0,
      });
    });
  });

  suite('when page and limit are valid', () => {
    it('returns the pagination and offset', () => {
      const result = resolvePagy({
        page: 3,
        limit: 25,
      });

      expect(result).toEqual({
        page: 3,
        limit: 25,
        offset: 50,
      });
    });
  });

  suite('when page and limit are not integers', () => {
    it('returns the default pagination', () => {
      const result = resolvePagy({
        page: 2.5,
        limit: 10.5,
      });

      expect(result).toEqual({
        page: 1,
        limit: 10,
        offset: 0,
      });
    });
  });

  suite('when page and limit are outside the allowed range', () => {
    it('clamps the values to the allowed range', () => {
      const result = resolvePagy({
        page: -1,
        limit: 101,
      });

      expect(result).toEqual({
        page: 1,
        limit: 100,
        offset: 0,
      });
    });
  });
});
