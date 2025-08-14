import { TokenPayload } from '@/types/auth';

class TokenService {
  private token: string | null = null;
  private refreshToken: string | null = null;
  private readonly TOKEN_KEY = 'auth_token';
  private readonly REFRESH_TOKEN_KEY = 'auth_refresh_token';

  /**
   * Set authentication tokens
   */
  setTokens(token: string, refreshToken: string): void {
    this.token = token;
    this.refreshToken = refreshToken;
    
    // Store refresh token securely (localStorage for remember me functionality)
    if (refreshToken) {
      localStorage.setItem(this.REFRESH_TOKEN_KEY, refreshToken);
    }
  }

  /**
   * Get current access token
   */
  getToken(): string | null {
    return this.token;
  }

  /**
   * Get current refresh token
   */
  getRefreshToken(): string | null {
    return this.refreshToken || localStorage.getItem(this.REFRESH_TOKEN_KEY);
  }

  /**
   * Clear all tokens
   */
  clearTokens(): void {
    this.token = null;
    this.refreshToken = null;
    localStorage.removeItem(this.REFRESH_TOKEN_KEY);
    sessionStorage.removeItem(this.TOKEN_KEY);
  }

  /**
   * Check if token exists
   */
  hasToken(): boolean {
    return !!this.token;
  }

  /**
   * Parse JWT token payload without verification
   */
  parseToken(token: string): TokenPayload | null {
    try {
      const base64Url = token.split('.')[1];
      if (!base64Url) return null;
      
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const jsonPayload = decodeURIComponent(
        atob(base64)
          .split('')
          .map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
          .join('')
      );
      
      return JSON.parse(jsonPayload) as TokenPayload;
    } catch (error) {
      console.error('Failed to parse token:', error);
      return null;
    }
  }

  /**
   * Check if token is expired
   */
  isTokenExpired(token: string): boolean {
    const payload = this.parseToken(token);
    if (!payload) return true;
    
    const currentTime = Math.floor(Date.now() / 1000);
    return payload.exp < currentTime;
  }

  /**
   * Initialize tokens from storage on app start
   */
  initializeFromStorage(): void {
    const refreshToken = localStorage.getItem(this.REFRESH_TOKEN_KEY);
    if (refreshToken) {
      this.refreshToken = refreshToken;
    }
  }
}

export const tokenService = new TokenService();