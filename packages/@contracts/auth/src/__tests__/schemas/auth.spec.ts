import { CreateInternalUser, SignIn, SignUp } from '../../schemas';

describe.each([
  {
    name: 'SignIn',
    schema: SignIn,
    fields: ['email', 'password'],
  },
  {
    name: 'SignUp',
    schema: SignUp,
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
    name: 'SignIn',
    schema: SignIn,
    fields: {},
  },
  {
    name: 'SignUp',
    schema: SignUp,
    fields: {
      name: 'Alpha',
    },
  },
  {
    name: 'CreateInternalUser',
    schema: CreateInternalUser,
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

describe('#SignIn', () => {
  suite('when the payload is valid', () => {
    it('returns the validated payload', () => {
      const payload = {
        email: 'alpha@example.com',
        password: 'ChangeMe123!',
      };

      expect(SignIn.assert(payload)).toEqual(payload);
    });
  });

  suite('when the email is invalid', () => {
    it('throws a validation error', () => {
      expect(() => {
        SignIn.assert({
          email: 'invalid-email',
          password: 'ChangeMe123!',
        });
      }).toThrow();
    });
  });
});

describe('#SignUp', () => {
  suite.each(['name', 'email', 'password'] as const)(
    'when %s has an invalid value',
    (field) => {
      it('returns the field translation key through Standard Schema', async () => {
        const result = await SignUp['~standard'].validate({
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

      expect(SignUp.assert(payload)).toEqual(payload);
    });
  });

  suite('when a client supplies a role', () => {
    it('rejects the payload', () => {
      expect(() => {
        SignUp.assert({
          name: 'Alpha',
          email: 'alpha@example.com',
          password: 'ChangeMe123!',
          role: 'admin',
        });
      }).toThrow();
    });
  });
});
