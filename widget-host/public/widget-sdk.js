/**
 * Multisitesso User Profile Widget SDK
 * Allows easy embedding of the user profile widget across different domains
 */

(function(window, document) {
  'use strict';

  const WIDGET_HOST = 'https://website1.com'; // Will be updated with actual domain
  
  class MultisitessoWidget {
    constructor(options = {}) {
      this.options = {
        containerId: 'multisitesso-widget',
        width: '320px',
        height: 'auto',
        theme: 'light',
        position: 'bottom-right',
        ...options
      };
      
      this.iframe = null;
      this.container = null;
      this.isAuthenticated = false;
      this.user = null;
      
      this.init();
    }

    init() {
      this.createContainer();
      this.createIframe();
      this.setupMessageListener();
      this.loadWidget();
    }

    createContainer() {
      let container = document.getElementById(this.options.containerId);
      
      if (!container) {
        container = document.createElement('div');
        container.id = this.options.containerId;
        document.body.appendChild(container);
      }

      // Apply positioning styles
      container.style.cssText = `
        position: fixed;
        z-index: 10000;
        ${this.getPositionStyles()}
      `;

      this.container = container;
    }

    getPositionStyles() {
      const { position } = this.options;
      
      switch (position) {
        case 'top-left':
          return 'top: 20px; left: 20px;';
        case 'top-right':
          return 'top: 20px; right: 20px;';
        case 'bottom-left':
          return 'bottom: 20px; left: 20px;';
        case 'bottom-right':
        default:
          return 'bottom: 20px; right: 20px;';
      }
    }

    createIframe() {
      this.iframe = document.createElement('iframe');
      this.iframe.style.cssText = `
        width: ${this.options.width};
        height: ${this.options.height === 'auto' ? '400px' : this.options.height};
        border: none;
        border-radius: 8px;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
        background: white;
        transition: all 0.3s ease;
      `;
      
      this.iframe.setAttribute('sandbox', 'allow-scripts allow-same-origin allow-forms');
      this.iframe.setAttribute('loading', 'lazy');
      
      this.container.appendChild(this.iframe);
    }

    setupMessageListener() {
      window.addEventListener('message', (event) => {
        // Verify origin in production
        if (event.origin !== WIDGET_HOST && WIDGET_HOST !== 'https://website1.com') {
          return;
        }

        const { type, data } = event.data;

        switch (type) {
          case 'WIDGET_HEIGHT_UPDATE':
            if (this.options.height === 'auto') {
              this.iframe.style.height = `${data.height || event.data.height}px`;
            }
            break;

          case 'USER_PROFILE_UPDATED':
            this.user = event.data.user;
            this.onUserUpdate(this.user);
            break;

          case 'USER_LOGOUT':
            this.user = null;
            this.isAuthenticated = false;
            this.onLogout();
            break;

          case 'WIDGET_LOGIN_REQUEST':
            this.onLoginRequest();
            break;
        }
      });
    }

    loadWidget() {
      const params = new URLSearchParams({
        origin: window.location.origin,
        theme: this.options.theme,
      });

      // Add authentication token if available
      const token = this.getAuthToken();
      if (token) {
        params.append('token', token);
      }

      this.iframe.src = `${WIDGET_HOST}/embed?${params.toString()}`;
    }

    getAuthToken() {
      // Check for token in localStorage, sessionStorage, or cookies
      return localStorage.getItem('multisitesso_token') || 
             sessionStorage.getItem('multisitesso_token') ||
             this.getCookie('multisitesso_token');
    }

    getCookie(name) {
      const value = `; ${document.cookie}`;
      const parts = value.split(`; ${name}=`);
      if (parts.length === 2) return parts.pop().split(';').shift();
      return null;
    }

    setAuthToken(token) {
      localStorage.setItem('multisitesso_token', token);
      this.loadWidget(); // Reload widget with new token
    }

    login(credentials) {
      return fetch(`${WIDGET_HOST}/api/auth`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
          action: 'login',
          ...credentials
        }),
        credentials: 'include'
      })
      .then(response => response.json())
      .then(data => {
        if (data.token) {
          this.setAuthToken(data.token);
          this.user = data.user;
          this.isAuthenticated = true;
        }
        return data;
      });
    }

    logout() {
      localStorage.removeItem('multisitesso_token');
      sessionStorage.removeItem('multisitesso_token');
      this.user = null;
      this.isAuthenticated = false;
      this.loadWidget();
    }

    show() {
      this.container.style.display = 'block';
    }

    hide() {
      this.container.style.display = 'none';
    }

    toggle() {
      const isVisible = this.container.style.display !== 'none';
      if (isVisible) {
        this.hide();
      } else {
        this.show();
      }
    }

    destroy() {
      if (this.container && this.container.parentNode) {
        this.container.parentNode.removeChild(this.container);
      }
    }

    // Event handlers - can be overridden
    onUserUpdate(user) {
      console.log('User profile updated:', user);
    }

    onLogout() {
      console.log('User logged out');
    }

    onLoginRequest() {
      console.log('Login requested');
      // Default behavior - you can override this
      const email = prompt('Enter email:');
      const password = prompt('Enter password:');
      
      if (email && password) {
        this.login({ email, password });
      }
    }
  }

  // Expose to global scope
  window.MultisitessoWidget = MultisitessoWidget;

  // Auto-initialize if data attributes are present
  document.addEventListener('DOMContentLoaded', function() {
    const autoInit = document.querySelector('[data-multisitesso-widget]');
    if (autoInit) {
      const options = {
        containerId: autoInit.getAttribute('data-container-id') || 'multisitesso-widget',
        position: autoInit.getAttribute('data-position') || 'bottom-right',
        theme: autoInit.getAttribute('data-theme') || 'light',
      };
      
      window.multisitessoWidget = new MultisitessoWidget(options);
    }
  });

})(window, document);

