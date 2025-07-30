/**
 * Cross-Domain Authentication Service
 * Implements Google-style authentication across multiple domains
 */

class CrossDomainAuth {
  constructor() {
    this.authDomain = 'website1.com'; // Primary authentication domain
    this.trustedDomains = ['website1.com', 'website2.com', 'website3.com'];
    this.sessionKey = 'multisitesso_session';
    this.tokenKey = 'multisitesso_token';
  }

  /**
   * Initialize cross-domain authentication
   * Sets up message listeners and checks for existing authentication
   */
  init() {
    this.setupMessageListener();
    this.checkExistingAuth();
    this.setupPeriodicTokenRefresh();
  }

  /**
   * Set up message listener for cross-domain communication
   */
  setupMessageListener() {
    window.addEventListener('message', (event) => {
      // Verify origin is trusted
      if (!this.isTrustedOrigin(event.origin)) {
        return;
      }

      const { type, data } = event.data;

      switch (type) {
        case 'AUTH_TOKEN_REQUEST':
          this.handleTokenRequest(event);
          break;
        case 'AUTH_TOKEN_RESPONSE':
          this.handleTokenResponse(data);
          break;
        case 'AUTH_LOGOUT':
          this.handleLogout();
          break;
        case 'AUTH_STATUS_REQUEST':
          this.handleStatusRequest(event);
          break;
        case 'AUTH_STATUS_RESPONSE':
          this.handleStatusResponse(data);
          break;
      }
    });
  }

  /**
   * Check if origin is trusted
   * @param {string} origin - Origin to check
   * @returns {boolean} True if trusted
   */
  isTrustedOrigin(origin) {
    const url = new URL(origin);
    return this.trustedDomains.some(domain => 
      url.hostname === domain || url.hostname.endsWith('.' + domain)
    );
  }

  /**
   * Check for existing authentication
   */
  async checkExistingAuth() {
    const token = this.getStoredToken();
    if (token) {
      const isValid = await this.validateToken(token);
      if (isValid) {
        this.setAuthenticatedState(token);
        this.syncAuthAcrossDomains(token);
      } else {
        this.clearStoredToken();
      }
    } else {
      // Check with other domains for existing auth
      this.requestAuthFromOtherDomains();
    }
  }

  /**
   * Request authentication status from other domains
   */
  requestAuthFromOtherDomains() {
    this.trustedDomains.forEach(domain => {
      if (domain !== window.location.hostname) {
        this.sendMessageToDomain(domain, {
          type: 'AUTH_STATUS_REQUEST',
          requestId: this.generateRequestId()
        });
      }
    });
  }

  /**
   * Send message to specific domain
   * @param {string} domain - Target domain
   * @param {Object} message - Message to send
   */
  sendMessageToDomain(domain, message) {
    const iframe = document.createElement('iframe');
    iframe.style.display = 'none';
    iframe.src = `https://${domain}/auth-bridge`;
    
    iframe.onload = () => {
      iframe.contentWindow.postMessage(message, `https://${domain}`);
      setTimeout(() => {
        document.body.removeChild(iframe);
      }, 1000);
    };
    
    document.body.appendChild(iframe);
  }

  /**
   * Handle token request from other domains
   * @param {MessageEvent} event - Message event
   */
  handleTokenRequest(event) {
    const token = this.getStoredToken();
    if (token) {
      event.source.postMessage({
        type: 'AUTH_TOKEN_RESPONSE',
        data: { token, requestId: event.data.requestId }
      }, event.origin);
    }
  }

  /**
   * Handle token response from other domains
   * @param {Object} data - Response data
   */
  async handleTokenResponse(data) {
    const { token } = data;
    if (token) {
      const isValid = await this.validateToken(token);
      if (isValid) {
        this.storeToken(token);
        this.setAuthenticatedState(token);
      }
    }
  }

  /**
   * Handle logout across domains
   */
  handleLogout() {
    this.clearStoredToken();
    this.setUnauthenticatedState();
    this.notifyLogoutToOtherDomains();
  }

  /**
   * Handle authentication status request
   * @param {MessageEvent} event - Message event
   */
  handleStatusRequest(event) {
    const token = this.getStoredToken();
    const isAuthenticated = !!token;
    
    event.source.postMessage({
      type: 'AUTH_STATUS_RESPONSE',
      data: { 
        isAuthenticated, 
        token: isAuthenticated ? token : null,
        requestId: event.data.requestId 
      }
    }, event.origin);
  }

  /**
   * Handle authentication status response
   * @param {Object} data - Response data
   */
  async handleStatusResponse(data) {
    const { isAuthenticated, token } = data;
    if (isAuthenticated && token) {
      const isValid = await this.validateToken(token);
      if (isValid) {
        this.storeToken(token);
        this.setAuthenticatedState(token);
      }
    }
  }

  /**
   * Authenticate user with credentials
   * @param {Object} credentials - User credentials
   * @returns {Promise<Object>} Authentication result
   */
  async authenticate(credentials) {
    try {
      const response = await fetch(`https://${this.authDomain}/api/auth`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
          action: 'login',
          ...credentials
        }),
        credentials: 'include'
      });

      const result = await response.json();
      
      if (result.token) {
        this.storeToken(result.token);
        this.setAuthenticatedState(result.token);
        this.syncAuthAcrossDomains(result.token);
        return { success: true, user: result.user };
      } else {
        return { success: false, error: result.error };
      }
    } catch (error) {
      return { success: false, error: 'Authentication failed' };
    }
  }

  /**
   * Logout user
   */
  async logout() {
    try {
      await fetch(`https://${this.authDomain}/api/auth`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'Authorization': `Bearer ${this.getStoredToken()}`
        },
        body: new URLSearchParams({ action: 'logout' }),
        credentials: 'include'
      });
    } catch (error) {
      console.error('Logout request failed:', error);
    }

    this.clearStoredToken();
    this.setUnauthenticatedState();
    this.notifyLogoutToOtherDomains();
  }

  /**
   * Sync authentication across all domains
   * @param {string} token - Authentication token
   */
  syncAuthAcrossDomains(token) {
    this.trustedDomains.forEach(domain => {
      if (domain !== window.location.hostname) {
        this.sendMessageToDomain(domain, {
          type: 'AUTH_TOKEN_SYNC',
          data: { token }
        });
      }
    });
  }

  /**
   * Notify logout to other domains
   */
  notifyLogoutToOtherDomains() {
    this.trustedDomains.forEach(domain => {
      if (domain !== window.location.hostname) {
        this.sendMessageToDomain(domain, {
          type: 'AUTH_LOGOUT'
        });
      }
    });
  }

  /**
   * Validate token with server
   * @param {string} token - Token to validate
   * @returns {Promise<boolean>} True if valid
   */
  async validateToken(token) {
    try {
      const response = await fetch(`https://${this.authDomain}/api/auth`, {
        headers: {
          'Authorization': `Bearer ${token}`
        },
        credentials: 'include'
      });

      const result = await response.json();
      return result.isAuthenticated;
    } catch (error) {
      return false;
    }
  }

  /**
   * Set up periodic token refresh
   */
  setupPeriodicTokenRefresh() {
    setInterval(async () => {
      const token = this.getStoredToken();
      if (token) {
        const refreshedToken = await this.refreshToken(token);
        if (refreshedToken && refreshedToken !== token) {
          this.storeToken(refreshedToken);
          this.syncAuthAcrossDomains(refreshedToken);
        }
      }
    }, 30 * 60 * 1000); // Check every 30 minutes
  }

  /**
   * Refresh authentication token
   * @param {string} token - Current token
   * @returns {Promise<string|null>} Refreshed token or null
   */
  async refreshToken(token) {
    try {
      const response = await fetch(`https://${this.authDomain}/api/auth/refresh`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        credentials: 'include'
      });

      const result = await response.json();
      return result.token || null;
    } catch (error) {
      return null;
    }
  }

  /**
   * Store token in local storage
   * @param {string} token - Token to store
   */
  storeToken(token) {
    localStorage.setItem(this.tokenKey, token);
    sessionStorage.setItem(this.tokenKey, token);
  }

  /**
   * Get stored token
   * @returns {string|null} Stored token
   */
  getStoredToken() {
    return localStorage.getItem(this.tokenKey) || 
           sessionStorage.getItem(this.tokenKey);
  }

  /**
   * Clear stored token
   */
  clearStoredToken() {
    localStorage.removeItem(this.tokenKey);
    sessionStorage.removeItem(this.tokenKey);
  }

  /**
   * Set authenticated state
   * @param {string} token - Authentication token
   */
  setAuthenticatedState(token) {
    document.dispatchEvent(new CustomEvent('authStateChanged', {
      detail: { isAuthenticated: true, token }
    }));
  }

  /**
   * Set unauthenticated state
   */
  setUnauthenticatedState() {
    document.dispatchEvent(new CustomEvent('authStateChanged', {
      detail: { isAuthenticated: false, token: null }
    }));
  }

  /**
   * Generate unique request ID
   * @returns {string} Request ID
   */
  generateRequestId() {
    return Math.random().toString(36).substr(2, 9);
  }
}

// Export for use in different environments
if (typeof module !== 'undefined' && module.exports) {
  module.exports = CrossDomainAuth;
} else {
  window.CrossDomainAuth = CrossDomainAuth;
}

