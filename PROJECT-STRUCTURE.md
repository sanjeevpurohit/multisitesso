# Project Structure

## Overview
This repository contains a micro frontend user profile management system with cross-domain authentication capabilities.

## Directory Structure

```
multisitesso-product/
├── widget-host/              # Main widget hosting application (website1.com)
│   ├── app/                  # Remix application files
│   ├── public/               # Static assets
│   └── styles/               # CSS and styling files
├── react-client/             # React client application (website2.com)
│   ├── src/                  # React source code
│   ├── public/               # Public assets
│   └── build/                # Production build output
├── php-client/               # PHP client application (website3.com)
│   ├── src/                  # PHP source code
│   ├── public/               # Web-accessible files
│   └── config/               # Configuration files
├── shared/                   # Shared utilities and types
│   ├── auth/                 # Authentication utilities
│   ├── utils/                # Common utilities
│   └── types/                # TypeScript type definitions
├── docs/                     # Documentation
│   ├── api/                  # API documentation
│   ├── deployment/           # Deployment guides
│   └── security/             # Security documentation
├── scripts/                  # Build and deployment scripts
└── README.md                 # Main project documentation
```

## Components

### Widget Host (website1.com)
- **Technology**: React/Remix
- **Purpose**: Central widget hosting and authentication
- **Key Features**:
  - User profile management widget
  - Authentication API endpoints
  - Cross-domain session management
  - Widget embedding capabilities

### React Client (website2.com)
- **Technology**: React
- **Purpose**: Demonstration of widget integration in React
- **Key Features**:
  - JavaScript widget embedding
  - React-specific integration patterns
  - Shared authentication state

### PHP Client (website3.com)
- **Technology**: PHP
- **Purpose**: Demonstration of widget integration in PHP
- **Key Features**:
  - Server-side widget integration
  - PHP authentication handling
  - Cross-platform compatibility

## Development Workflow

1. **Phase-based Development**: Each major feature is developed in phases
2. **Git Tracking**: All changes are committed at each phase for tracking
3. **Testing**: Integration testing at each phase
4. **Documentation**: Comprehensive documentation throughout

## Getting Started

1. Clone this repository
2. Follow the setup instructions in each component's directory
3. Refer to `docs/architecture-design.md` for detailed architecture information
4. Check `docs/project-todo.md` for current development status

## Authentication Flow

The system implements Google-style cross-domain authentication:
- Central authentication on website1.com
- JWT-based token system
- Cross-domain cookie sharing
- PostMessage API for secure communication
- Real-time session synchronization

## Security Features

- HTTPS-only communication
- CORS configuration
- Content Security Policy (CSP)
- JWT token validation
- Rate limiting and abuse prevention

