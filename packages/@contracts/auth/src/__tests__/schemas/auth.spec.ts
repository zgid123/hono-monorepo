import {
  CreateInternalUserSchema,
  SignInSchema,
  SignUpSchema,
} from '../../schemas';

describe.each([
  {
    name: 'SignInSchema',
    schema: SignInSchema,
    fields: ['email', 'password'],
  },
  {
    name: 'SignUpSchema',
    schema: SignUpSchema,
    fields: ['email', 'name', 'password'],
  },
])('#$name missing fields', ({ schema, fields }) => {
  suite('when the form is empty', () => {
    it('returns translation keys and paths for every missing field', async () => {
      const result = await schema['~standard'].validate({});

      expect(
        result.issues?.map((issue) => {
          return {
            message: issue.message,
            path: issue.path ? [...issue.path] : [],
          };
        }),
      ).toEqual(
        fields.map((field) => {
          return {
            message: `auth.issues.${field}`,
            path: [field],
          };
        }),
      );
    });
  });
});

describe.each([
  {
    name: 'SignInSchema',
    schema: SignInSchema,
    fields: {},
  },
  {
    name: 'SignUpSchema',
    schema: SignUpSchema,
    fields: {
      name: 'Alpha',
    },
  },
  {
    name: 'CreateInternalUserSchema',
    schema: CreateInternalUserSchema,
    fields: {
      name: 'Alpha',
    },
  },
])('#$name email issues', ({ schema, fields }) => {
  suite.each(['invalid-email', '', 123, null, undefined])(
    'when email is %j',
    (email) => {
      it('returns the translation key and field path through Standard Schema', async () => {
        const result = await schema['~standard'].validate({
          ...fields,
          email,
          password: 'ChangeMe123!',
        });

        expect(
          result.issues?.map((issue) => {
            return {
              message: issue.message,
              path: issue.path ? [...issue.path] : [],
            };
          }),
        ).toEqual([{ message: 'auth.issues.email', path: ['email'] }]);
      });
    },
  );
});

describe('#SignInSchema', () => {
  suite('when the payload is valid', () => {
    it('returns the validated payload', () => {
      const payload = {
        email: 'alpha@example.com',
        password: 'ChangeMe123!',
      };

      expect(SignInSchema.assert(payload)).toEqual(payload);
    });
  });

  suite('when the email is invalid', () => {
    it('throws a validation error', () => {
      expect(() => {
        SignInSchema.assert({
          email: 'invalid-email',
          password: 'ChangeMe123!',
        });
      }).toThrow();
    });
  });
});

describe('#SignUpSchema', () => {
  suite.each(['name', 'email', 'password'] as const)(
    'when %s has an invalid value',
    (field) => {
      it('returns the field translation key through Standard Schema', async () => {
        const result = await SignUpSchema['~standard'].validate({
          name: 'Alpha',
          email: 'alpha@example.com',
          password: 'ChangeMe123!',
          [field]: null,
        });

        expect(
          result.issues?.map((issue) => {
            return {
              message: issue.message,
              path: issue.path ? [...issue.path] : [],
            };
          }),
        ).toEqual([{ message: `auth.issues.${field}`, path: [field] }]);
      });
    },
  );

  suite('when the payload is valid', () => {
    it('returns the validated public registration fields', () => {
      const payload = {
        name: 'Alpha',
        email: 'alpha@example.com',
        password: 'ChangeMe123!',
        displayName: 'Alphacifer',
      };

      expect(SignUpSchema.assert(payload)).toEqual(payload);
    });
  });

  suite('when a client supplies a role', () => {
    it('rejects the payload', () => {
      expect(() => {
        SignUpSchema.assert({
          name: 'Alpha',
          email: 'alpha@example.com',
          password: 'ChangeMe123!',
          role: 'admin',
        });
      }).toThrow();
    });
  });
});
