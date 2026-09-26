import {
  ChangeInternalUserRole,
  ChangeInternalUserStatus,
  CreateInternalUser,
  InternalUserParams,
  UpdateInternalUserProfile,
} from '../../schemas';

describe('#CreateInternalUser', () => {
  suite('when create-user input is valid', () => {
    it('returns the validated payload', () => {
      const payload = {
        name: 'Alpha',
        email: 'alpha@example.com',
        password: 'ChangeMe123!',
        displayName: 'Alphacifer',
      };

      expect(CreateInternalUser(payload)).toEqual(payload);
    });
  });

  suite('when the password is empty', () => {
    it('rejects the payload', () => {
      const result = CreateInternalUser({
        name: 'Alpha',
        email: 'alpha@example.com',
        password: '',
      });

      expect(result.toString()).toContain('password must be non-empty');
    });
  });

  suite('when the password exceeds Better Auth maximum length', () => {
    it('rejects the payload', () => {
      const result = CreateInternalUser({
        name: 'Alpha',
        email: 'alpha@example.com',
        password: 'x'.repeat(129),
      });

      expect(result.toString()).toContain(
        'password must be at most length 128',
      );
    });
  });
});

describe('#UpdateInternalUserProfile', () => {
  suite('when update-profile input is valid', () => {
    it('returns the validated payload', () => {
      const payload = {
        image: null,
        displayName: 'Alphacifer',
      };

      expect(UpdateInternalUserProfile(payload)).toEqual(payload);
    });
  });
});

describe('#ChangeInternalUserRole', () => {
  suite('when change-role input is valid', () => {
    it('returns the validated payload', () => {
      const payload = {
        role: 'admin' as const,
      };

      expect(ChangeInternalUserRole(payload)).toEqual(payload);
    });
  });
});

describe('#ChangeInternalUserStatus', () => {
  suite('when change-status input is valid', () => {
    it('returns the validated payload', () => {
      const payload = {
        status: 'banned' as const,
      };

      expect(ChangeInternalUserStatus(payload)).toEqual(payload);
    });
  });
});

describe('#InternalUserParams', () => {
  suite('when the user id is a UUID', () => {
    it('returns the validated parameter', () => {
      const params = {
        userId: '019c820f-5a60-7000-8000-000000000001',
      };

      expect(InternalUserParams(params)).toEqual(params);
    });
  });
});
