/**
 * JWT Utilities for Cross-Domain Authentication
 * Provides secure token generation and validation
 */

const crypto = require('crypto');

// In production, this should be a secure environment variable
const JWT_SECRET = process.env.JWT_SECRET || 'multisitesso-secret-key-2024';
const JWT_EXPIRY = '24h'; // Token expiry time

class JWTUtils {
  /**
   * Generate a JWT token for a user
   * @param {Object} user - User object
   * @returns {string} JWT token
   */
  static generateToken(user) {
    const header = {
      alg: 'HS256',
      typ: 'JWT'
    };

    const payload = {
      sub: user.id,
      email: user.email,
      name: user.name,
      iat: Math.floor(Date.now() / 1000),
      exp: Math.floor(Date.now() / 1000) + (24 * 60 * 60), // 24 hours
      iss: 'multisitesso-auth',
      aud: ['website1.com', 'website2.com', 'website3.com']
    };

    const encodedHeader = this.base64UrlEncode(JSON.stringify(header));
    const encodedPayload = this.base64UrlEncode(JSON.stringify(payload));
    
    const signature = this.sign(`${encodedHeader}.${encodedPayload}`, JWT_SECRET);
    
    return `${encodedHeader}.${encodedPayload}.${signature}`;
  }

  /**
   * Verify and decode a JWT token
   * @param {string} token - JWT token
   * @returns {Object|null} Decoded payload or null if invalid
   */
  static verifyToken(token) {
    try {
      const parts = token.split('.');
      if (parts.length !== 3) {
        return null;
      }

      const [encodedHeader, encodedPayload, signature] = parts;
      
      // Verify signature
      const expectedSignature = this.sign(`${encodedHeader}.${encodedPayload}`, JWT_SECRET);
      if (signature !== expectedSignature) {
        return null;
      }

      // Decode payload
      const payload = JSON.parse(this.base64UrlDecode(encodedPayload));
      
      // Check expiry
      if (payload.exp < Math.floor(Date.now() / 1000)) {
        return null;
      }

      return payload;
    } catch (error) {
      return null;
    }
  }

  /**
   * Refresh a token if it's close to expiry
   * @param {string} token - Current JWT token
   * @returns {string|null} New token or null if invalid
   */
  static refreshToken(token) {
    const payload = this.verifyToken(token);
    if (!payload) {
      return null;
    }

    // Check if token expires within 1 hour
    const oneHour = 60 * 60;
    if (payload.exp - Math.floor(Date.now() / 1000) > oneHour) {
      return token; // Token is still fresh
    }

    // Generate new token
    const user = {
      id: payload.sub,
      email: payload.email,
      name: payload.name
    };

    return this.generateToken(user);
  }

  /**
   * Base64 URL encode
   * @param {string} str - String to encode
   * @returns {string} Encoded string
   */
  static base64UrlEncode(str) {
    return Buffer.from(str)
      .toString('base64')
      .replace(/\+/g, '-')
      .replace(/\//g, '_')
      .replace(/=/g, '');
  }

  /**
   * Base64 URL decode
   * @param {string} str - String to decode
   * @returns {string} Decoded string
   */
  static base64UrlDecode(str) {
    str += '='.repeat((4 - str.length % 4) % 4);
    return Buffer.from(str.replace(/-/g, '+').replace(/_/g, '/'), 'base64').toString();
  }

  /**
   * Sign data with HMAC SHA256
   * @param {string} data - Data to sign
   * @param {string} secret - Secret key
   * @returns {string} Signature
   */
  static sign(data, secret) {
    return crypto
      .createHmac('sha256', secret)
      .update(data)
      .digest('base64')
      .replace(/\+/g, '-')
      .replace(/\//g, '_')
      .replace(/=/g, '');
  }

  /**
   * Generate a secure session ID
   * @returns {string} Session ID
   */
  static generateSessionId() {
    return crypto.randomBytes(32).toString('hex');
  }

  /**
   * Create authentication cookies for cross-domain use
   * @param {string} token - JWT token
   * @param {string} domain - Domain for the cookie
   * @returns {Object} Cookie configuration
   */
  static createAuthCookie(token, domain = null) {
    return {
      name: 'multisitesso_auth',
      value: token,
      httpOnly: true,
      secure: true, // HTTPS only
      sameSite: 'None', // Allow cross-site requests
      maxAge: 24 * 60 * 60 * 1000, // 24 hours
      domain: domain, // Set domain for cross-domain sharing
      path: '/'
    };
  }
}

module.exports = JWTUtils;

