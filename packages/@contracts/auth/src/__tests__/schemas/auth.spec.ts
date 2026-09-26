import { SignIn, SignUp } from '../../schemas';

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
