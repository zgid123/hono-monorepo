import {
  ChangeInternalUserRoleSchema,
  ChangeInternalUserStatusSchema,
  CreateInternalUserSchema,
  InternalUserParamsSchema,
  UpdateInternalUserProfileSchema,
} from '../../schemas';

describe('#CreateInternalUserSchema', () => {
  suite('when create-user input is valid', () => {
    it('returns the validated payload', () => {
      const payload = {
        name: 'Alpha',
        email: 'alpha@example.com',
        password: 'ChangeMe123!',
        displayName: 'Alphacifer',
      };

      expect(CreateInternalUserSchema(payload)).toEqual(payload);
    });
  });

  suite('when the password is empty', () => {
    it('rejects the payload', () => {
      const result = CreateInternalUserSchema({
        name: 'Alpha',
        email: 'alpha@example.com',
        password: '',
      });

      expect(result.toString()).toContain('password must be non-empty');
    });
  });

  suite('when the password exceeds Better Auth maximum length', () => {
    it('rejects the payload', () => {
      const result = CreateInternalUserSchema({
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

describe('#UpdateInternalUserProfileSchema', () => {
  suite('when update-profile input is valid', () => {
    it('returns the validated payload', () => {
      const payload = {
        image: null,
        displayName: 'Alphacifer',
      };

      expect(UpdateInternalUserProfileSchema(payload)).toEqual(payload);
    });
  });
});

describe('#ChangeInternalUserRoleSchema', () => {
  suite('when change-role input is valid', () => {
    it('returns the validated payload', () => {
      const payload = {
        role: 'admin' as const,
      };

      expect(ChangeInternalUserRoleSchema(payload)).toEqual(payload);
    });
  });
});

describe('#ChangeInternalUserStatusSchema', () => {
  suite('when change-status input is valid', () => {
    it('returns the validated payload', () => {
      const payload = {
        status: 'banned' as const,
      };

      expect(ChangeInternalUserStatusSchema(payload)).toEqual(payload);
    });
  });
});

describe('#InternalUserParamsSchema', () => {
  suite('when the user id is a UUID', () => {
    it('returns the validated parameter', () => {
      const params = {
        userId: '019c820f-5a60-7000-8000-000000000001',
      };

      expect(InternalUserParamsSchema(params)).toEqual(params);
    });
  });
});
