import { ArkTypeAdapter } from '@eidora/arktype';
import { Serializer } from '@eidora/core';

import {
  InternalUsersViewModel,
  InternalUserViewModel,
} from '../../viewModels';

describe('#InternalUserViewModel', () => {
  suite('when the source contains additional fields', () => {
    it('serializes only the internal user response fields', () => {
      const serializer = new Serializer({
        adapter: new ArkTypeAdapter(),
      });
      const result = serializer.serialize(
        {
          id: '0198f519-cf28-7c44-a022-b95512d8c10f',
          role: 'admin' as const,
          status: 'active' as const,
          name: 'Alpha',
          email: 'alpha@example.com',
          image: null,
          createdAt: '2026-08-31T00:00:00.000Z',
          updatedAt: '2026-08-31T01:00:00.000Z',
          displayName: 'Alphacifer',
          emailVerified: true,
          passwordHash: 'must-not-leak',
        },
        {
          schema: InternalUserViewModel,
        },
      );

      expect(result).toEqual({
        id: '0198f519-cf28-7c44-a022-b95512d8c10f',
        role: 'admin',
        status: 'active',
        name: 'Alpha',
        email: 'alpha@example.com',
        image: null,
        createdAt: '2026-08-31T00:00:00.000Z',
        updatedAt: '2026-08-31T01:00:00.000Z',
        displayName: 'Alphacifer',
        emailVerified: true,
      });
    });
  });
});

describe('#InternalUsersViewModel', () => {
  suite('when users and pagination are valid', () => {
    it('validates users and pagination together', () => {
      const response = {
        data: [
          {
            id: '0198f519-cf28-7c44-a022-b95512d8c10f',
            role: 'admin' as const,
            status: 'active' as const,
            name: 'Alpha',
            email: 'alpha@example.com',
            image: null,
            createdAt: '2026-08-31T00:00:00.000Z',
            updatedAt: '2026-08-31T01:00:00.000Z',
            displayName: 'Alphacifer',
            emailVerified: true,
          },
        ],
        metadata: {
          page: 1,
          limit: 10,
          total: 1,
          totalPages: 1,
        },
      };

      expect(InternalUsersViewModel.schema(response)).toEqual(response);
    });
  });
});
