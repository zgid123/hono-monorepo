import { PaginationViewModel } from '../../viewModels';

describe('#PaginationViewModel', () => {
  suite('when pagination metadata is valid', () => {
    it('validates pagination metadata', () => {
      const pagination = {
        page: 1,
        limit: 10,
        total: 21,
        totalPages: 3,
      };

      expect(PaginationViewModel(pagination)).toEqual(pagination);
    });
  });
});
