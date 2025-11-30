import { loginSchema, registerSchema } from '../src/utils/validation';
import type { LoginFormData, RegisterFormData } from '../src/utils/validation';

describe('Validation schemas', () => {
  describe('loginSchema', () => {
    it('should validate correct login data', () => {
      const validData: LoginFormData = {
        email: 'user@example.com',
        password: '123456',
      };

      const result = loginSchema.safeParse(validData);
      expect(result.success).toBe(true);
    });

    it('should reject invalid email format', () => {
      const invalidData = {
        email: 'invalid-email',
        password: '123456',
      };

      const result = loginSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].path[0]).toBe('email');
      }
    });

    it('should reject empty email', () => {
      const invalidData = {
        email: '',
        password: '123456',
      };

      const result = loginSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
    });

    it('should reject password shorter than 6 characters', () => {
      const invalidData = {
        email: 'user@example.com',
        password: '12345',
      };

      const result = loginSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].path[0]).toBe('password');
      }
    });

    it('should reject empty password', () => {
      const invalidData = {
        email: 'user@example.com',
        password: '',
      };

      const result = loginSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
    });

    it('should accept password with exactly 6 characters', () => {
      const validData = {
        email: 'user@example.com',
        password: '123456',
      };

      const result = loginSchema.safeParse(validData);
      expect(result.success).toBe(true);
    });
  });

  describe('registerSchema', () => {
    it('should validate correct registration data', () => {
      const validData: RegisterFormData = {
        name: 'John Doe',
        email: 'john@example.com',
        password: '123456',
        confirmPassword: '123456',
      };

      const result = registerSchema.safeParse(validData);
      expect(result.success).toBe(true);
    });

    it('should reject name shorter than 3 characters', () => {
      const invalidData = {
        name: 'Jo',
        email: 'john@example.com',
        password: '123456',
        confirmPassword: '123456',
      };

      const result = registerSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].path[0]).toBe('name');
      }
    });

    it('should reject invalid email format', () => {
      const invalidData = {
        name: 'John Doe',
        email: 'invalid-email',
        password: '123456',
        confirmPassword: '123456',
      };

      const result = registerSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].path[0]).toBe('email');
      }
    });

    it('should reject password shorter than 6 characters', () => {
      const invalidData = {
        name: 'John Doe',
        email: 'john@example.com',
        password: '12345',
        confirmPassword: '12345',
      };

      const result = registerSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].path[0]).toBe('password');
      }
    });

    it('should reject when passwords do not match', () => {
      const invalidData = {
        name: 'John Doe',
        email: 'john@example.com',
        password: '123456',
        confirmPassword: '654321',
      };

      const result = registerSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].path[0]).toBe('confirmPassword');
      }
    });

    it('should accept matching passwords', () => {
      const validData = {
        name: 'John Doe',
        email: 'john@example.com',
        password: '123456',
        confirmPassword: '123456',
      };

      const result = registerSchema.safeParse(validData);
      expect(result.success).toBe(true);
    });

    it('should reject empty name', () => {
      const invalidData = {
        name: '',
        email: 'john@example.com',
        password: '123456',
        confirmPassword: '123456',
      };

      const result = registerSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
    });

    it('should accept name with exactly 3 characters', () => {
      const validData = {
        name: 'Bob',
        email: 'bob@example.com',
        password: '123456',
        confirmPassword: '123456',
      };

      const result = registerSchema.safeParse(validData);
      expect(result.success).toBe(true);
    });
  });
});
