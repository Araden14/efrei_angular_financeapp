import { TestBed } from '@angular/core/testing';
import { AuthService } from './auth.service';
import { LoginRequest, RegisterRequest } from '../models/user.model';

describe('AuthService', () => {
  let service: AuthService;
  let localStorageSpy: jasmine.SpyObj<Storage>;

  beforeEach(() => {
    // Mock localStorage
    localStorageSpy = jasmine.createSpyObj('Storage', ['getItem', 'setItem', 'removeItem']);

    Object.defineProperty(window, 'localStorage', {
      value: localStorageSpy,
      writable: true
    });

    TestBed.configureTestingModule({});
    service = TestBed.inject(AuthService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('login', () => {
    it('should login successfully with valid credentials', async () => {
      const credentials: LoginRequest = {
        email: 'admin@example.com',
        password: 'admin123'
      };

      const result = await service.login(credentials);

      expect(result.success).toBe(true);
      expect(result.user).toBeDefined();
      expect(result.user?.email).toBe('admin@example.com');
      expect(result.user?.role).toBe('admin');
      expect(localStorageSpy.setItem).toHaveBeenCalledWith('token', jasmine.any(String));
    });

    it('should fail login with invalid email', async () => {
      const credentials: LoginRequest = {
        email: 'invalid@example.com',
        password: 'admin123'
      };

      const result = await service.login(credentials);

      expect(result.success).toBe(false);
      expect(result.error).toBe('Email ou mot de passe incorrect');
      expect(result.user).toBeUndefined();
      expect(localStorageSpy.setItem).not.toHaveBeenCalled();
    });

    it('should fail login with invalid password', async () => {
      const credentials: LoginRequest = {
        email: 'admin@example.com',
        password: 'wrongpassword'
      };

      const result = await service.login(credentials);

      expect(result.success).toBe(false);
      expect(result.error).toBe('Email ou mot de passe incorrect');
      expect(result.user).toBeUndefined();
      expect(localStorageSpy.setItem).not.toHaveBeenCalled();
    });
  });

  describe('register', () => {
    it('should register successfully with valid data', async () => {
      const userData: RegisterRequest = {
        name: 'New User',
        email: 'newuser@example.com',
        password: 'password123',
        confirmPassword: 'password123'
      };

      const result = await service.register(userData);

      expect(result.success).toBe(true);
      expect(result.user).toBeDefined();
      expect(result.user?.name).toBe('New User');
      expect(result.user?.email).toBe('newuser@example.com');
      expect(result.user?.role).toBe('user');
      expect(localStorageSpy.setItem).toHaveBeenCalledWith('token', jasmine.any(String));
    });

    it('should fail registration with existing email', async () => {
      const userData: RegisterRequest = {
        name: 'Existing User',
        email: 'admin@example.com', // Already exists
        password: 'password123',
        confirmPassword: 'password123'
      };

      const result = await service.register(userData);

      expect(result.success).toBe(false);
      expect(result.error).toBe('Cet email est déjà utilisé');
      expect(result.user).toBeUndefined();
      expect(localStorageSpy.setItem).not.toHaveBeenCalled();
    });

    it('should fail registration with mismatched passwords', async () => {
      const userData: RegisterRequest = {
        name: 'New User',
        email: 'newuser@example.com',
        password: 'password123',
        confirmPassword: 'differentpassword'
      };

      const result = await service.register(userData);

      expect(result.success).toBe(false);
      expect(result.error).toBe('Les mots de passe ne correspondent pas');
      expect(result.user).toBeUndefined();
      expect(localStorageSpy.setItem).not.toHaveBeenCalled();
    });
  });

  describe('logout', () => {
    it('should logout successfully', async () => {
      // First login to set current user
      const credentials: LoginRequest = {
        email: 'admin@example.com',
        password: 'admin123'
      };
      await service.login(credentials);

      // Then logout
      await service.logout();

      expect(service.isAuthenticated()).toBe(false);
      expect(service.getCurrentUser()).toBe(null);
      expect(localStorageSpy.removeItem).toHaveBeenCalledWith('token');
    });
  });

  describe('authentication state', () => {
    it('should return false when no user is authenticated', () => {
      expect(service.isAuthenticated()).toBe(false);
    });

    it('should return true when user is authenticated', async () => {
      const credentials: LoginRequest = {
        email: 'admin@example.com',
        password: 'admin123'
      };
      await service.login(credentials);

      expect(service.isAuthenticated()).toBe(true);
    });

    it('should return current user', async () => {
      const credentials: LoginRequest = {
        email: 'admin@example.com',
        password: 'admin123'
      };
      await service.login(credentials);

      const user = service.getCurrentUser();
      expect(user).toBeDefined();
      expect(user?.email).toBe('admin@example.com');
    });

    it('should check if user is admin', async () => {
      // Login as admin
      const adminCredentials: LoginRequest = {
        email: 'admin@example.com',
        password: 'admin123'
      };
      await service.login(adminCredentials);
      expect(service.isAdmin()).toBe(true);

      // Login as regular user
      await service.logout();
      const userCredentials: LoginRequest = {
        email: 'user@example.com',
        password: 'user123'
      };
      await service.login(userCredentials);
      expect(service.isAdmin()).toBe(false);
    });
  });

  describe('user management', () => {
    it('should get all users (admin only)', async () => {
      // Login as admin first
      const credentials: LoginRequest = {
        email: 'admin@example.com',
        password: 'admin123'
      };
      await service.login(credentials);

      const users = await service.getAllUsers();

      expect(users.length).toBeGreaterThan(0);
      expect(users[0].password).toBe('***'); // Passwords should be masked
      expect(users[0].email).toBeDefined();
    });

    it('should throw error when non-admin tries to get all users', async () => {
      // Login as regular user
      const credentials: LoginRequest = {
        email: 'user@example.com',
        password: 'user123'
      };
      await service.login(credentials);

      await expectAsync(service.getAllUsers()).toBeRejectedWith('Accès non autorisé');
    });

    it('should delete user', async () => {
      // First register a new user to delete
      const userData: RegisterRequest = {
        name: 'User To Delete',
        email: 'delete@example.com',
        password: 'password123',
        confirmPassword: 'password123'
      };
      const registerResult = await service.register(userData);
      const userId = registerResult.user!.id;

      // Delete the user
      service.deleteUser(userId);

      // Try to find the user by token
      const token = registerResult.user!.token;
      const foundUser = service.findUserByToken(token);
      expect(foundUser).toBeNull();
    });

    it('should find user by token', async () => {
      const credentials: LoginRequest = {
        email: 'admin@example.com',
        password: 'admin123'
      };
      await service.login(credentials);

      const token = service.getToken();
      const user = service.findUserByToken(token);

      expect(user).toBeDefined();
      expect(user?.email).toBe('admin@example.com');
    });

    it('should return null for invalid token', () => {
      const user = service.findUserByToken('invalid-token');
      expect(user).toBeNull();
    });
  });

  describe('token management', () => {
    it('should generate a token', () => {
      const token = service.generateToken();
      expect(token).toBeDefined();
      expect(typeof token).toBe('string');
      expect(token.length).toBeGreaterThan(0);
    });

    it('should get token from current user', async () => {
      const credentials: LoginRequest = {
        email: 'admin@example.com',
        password: 'admin123'
      };
      await service.login(credentials);

      const token = service.getToken();
      expect(token).toBeDefined();
      expect(typeof token).toBe('string');
    });

    it('should return empty string when no user is authenticated', () => {
      const token = service.getToken();
      expect(token).toBe('');
    });
  });
});
