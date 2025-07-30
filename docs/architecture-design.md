# Micro Frontend User Profile Widget - System Architecture

## Overview
This system implements a micro frontend architecture with a user profile management widget that can be embedded across multiple domains with seamless authentication, similar to Google's cross-domain authentication system.

## Architecture Components

### 1. Widget Host (website1.com)
- **Framework**: React/Remix
- **Purpose**: Hosts the main user profile widget
- **Features**:
  - User profile management interface
  - Authentication endpoints
  - Widget embedding API
  - Session management

### 2. React Client (website2.com)
- **Framework**: React
- **Purpose**: Demonstrates widget integration in React app
- **Features**:
  - Embeds widget via JavaScript
  - Shares authentication state
  - React-specific integration patterns

### 3. PHP Client (website3.com)
- **Framework**: PHP
- **Purpose**: Demonstrates widget integration in PHP app
- **Features**:
  - Server-side widget embedding
  - PHP authentication integration
  - Cross-platform compatibility

## Cross-Domain Authentication Strategy

### Google-Style Authentication Flow
1. **Central Authentication Domain**: website1.com acts as the authentication authority
2. **JWT Tokens**: Secure token-based authentication
3. **Cross-Domain Cookies**: Secure, HttpOnly cookies with SameSite=None
4. **PostMessage API**: Secure communication between iframe and parent
5. **Session Synchronization**: Real-time session state across domains

### Authentication Components
- **Auth Server**: Centralized authentication service on website1.com
- **Token Service**: JWT generation, validation, and refresh
- **Session Manager**: Cross-domain session synchronization
- **Security Layer**: CORS, CSP, and XSS protection

## Technical Implementation

### Widget Architecture
```
┌─────────────────────────────────────────────────────────────┐
│                    website1.com (Widget Host)               │
│  ┌─────────────────┐  ┌─────────────────┐  ┌──────────────┐ │
│  │   User Profile  │  │  Auth Service   │  │ Widget API   │ │
│  │     Widget      │  │                 │  │              │ │
│  └─────────────────┘  └─────────────────┘  └──────────────┘ │
└─────────────────────────────────────────────────────────────┘
                                │
                    ┌───────────┴───────────┐
                    │                       │
┌───────────────────▼─────────────┐ ┌───────▼─────────────────┐
│      website2.com (React)       │ │    website3.com (PHP)   │
│  ┌─────────────────────────────┐ │ │ ┌─────────────────────┐ │
│  │    Widget Integration       │ │ │ │  Widget Integration │ │
│  │   (JavaScript Embed)        │ │ │ │  (Server-side)      │ │
│  └─────────────────────────────┘ │ │ └─────────────────────┘ │
└─────────────────────────────────┘ └─────────────────────────┘
```

### Security Considerations
- **HTTPS Only**: All communications over secure connections
- **CORS Configuration**: Proper cross-origin resource sharing
- **CSP Headers**: Content Security Policy implementation
- **Token Validation**: Secure JWT validation on all endpoints
- **Rate Limiting**: API rate limiting and abuse prevention

## Development Workflow
1. Each phase will be committed to Git for version tracking
2. Feature branches for major components
3. Integration testing at each phase
4. Deployment verification before proceeding

## Deployment Strategy
- **website1.com**: Primary widget host (production deployment)
- **website2.com**: React client demonstration
- **website3.com**: PHP client demonstration
- **CDN Integration**: Widget assets served via CDN for performance

This architecture ensures scalability, security, and seamless user experience across different domains and frameworks.

