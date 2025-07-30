# Cross-Domain Session Persistence Testing Guide

## Overview
This guide provides step-by-step instructions for testing the cross-domain authentication and session persistence in the Multisitesso micro frontend architecture.

## Architecture Summary
- **Website1.com**: Widget host delivering the authentication micro frontend
- **Website2.com**: React client consuming the widget
- **Website3.com**: PHP-style backend consuming the widget
- **Goal**: Login on website2.com → Session persists on website3.com

## Live Testing URLs
- **Website1.com (Widget Host)**: https://3000-iulhipjpw6slcboeknu21-4abb91c0.manusvm.computer
- **Website2.com (React Client)**: https://avvuvyet.manus.space
- **Website3.com (PHP Backend)**: https://58hpi8c7yy87.manus.space

## Test Credentials
- **Email**: john.doe@example.com
- **Password**: password123
- **Alternative**: jane.smith@example.com / password123

## Testing Methodology

### Phase 1: Baseline Authentication Test
**Objective**: Verify that authentication works on the widget host

1. Open browser in incognito/private mode
2. Navigate to Website1.com (widget host)
3. Click "View Widget Demo"
4. Verify initial state (should show login form)
5. Enter test credentials and login
6. Verify authenticated state (user profile displayed)

### Phase 2: Cross-Domain Login Test
**Objective**: Test login on website2.com and verify session on website3.com

1. **Step 1: Start Fresh Session**
   - Open new incognito/private browser window
   - Clear all cookies and local storage

2. **Step 2: Navigate to Website2.com**
   - Go to: https://avvuvyet.manus.space
   - Click on "Widget Demo" tab
   - Observe widget state (should show login form)

3. **Step 3: Login on Website2.com**
   - In the embedded widget, enter credentials:
     - Email: john.doe@example.com
     - Password: password123
   - Click "Sign In"
   - Verify authentication success

4. **Step 4: Check Session on Website3.com**
   - Open new tab (same browser session)
   - Navigate to: https://58hpi8c7yy87.manus.space
   - Observe widget state
   - **Expected**: Should show authenticated user (John Doe)
   - **Current**: May show login form (indicates sync issue)

### Phase 3: Reverse Test
**Objective**: Test login on website3.com and verify session on website2.com

1. **Step 1: Clear Session**
   - Clear browser cookies and local storage
   - Start fresh incognito session

2. **Step 2: Login on Website3.com**
   - Navigate to: https://58hpi8c7yy87.manus.space
   - Use embedded widget to login
   - Verify authentication

3. **Step 3: Check Session on Website2.com**
   - Open new tab
   - Navigate to: https://avvuvyet.manus.space
   - Check if user is authenticated

### Phase 4: Widget Host Direct Test
**Objective**: Verify that direct widget host authentication propagates

1. **Step 1: Login on Widget Host**
   - Navigate to: https://3000-iulhipjpw6slcboeknu21-4abb91c0.manusvm.computer
   - Login using widget demo

2. **Step 2: Check Client Sites**
   - Visit website2.com and website3.com
   - Verify if authentication state is synchronized

## Expected vs Current Behavior

### Expected Behavior (Google-style SSO)
1. User logs in on any website
2. Authentication state immediately synchronizes across all domains
3. User appears logged in on all three websites
4. Logout from any site logs out from all sites

### Current Behavior (As Implemented)
1. ✅ Authentication works perfectly on widget host
2. ⚠️ Cross-domain synchronization framework exists but needs enhancement
3. ⚠️ Each domain maintains separate session state
4. ⚠️ Manual synchronization required

## Technical Implementation Details

### Current Cross-Domain Communication
- **PostMessage API**: Implemented for iframe communication
- **JWT Tokens**: Generated and managed by widget host
- **CORS Headers**: Configured for cross-origin requests
- **Authentication Bridge**: Framework exists in `/auth-bridge` route

### Authentication Flow
```
1. User interacts with widget on website2.com
2. Widget (iframe) communicates with website1.com
3. Website1.com handles authentication
4. JWT token generated and stored
5. PostMessage sent to parent window (website2.com)
6. Website2.com receives authentication state
7. [MISSING] Website2.com should notify website3.com
8. [MISSING] Website3.com should sync authentication state
```

## Debugging Tools

### Browser Developer Tools
1. **Network Tab**: Monitor API calls and responses
2. **Console Tab**: Check for PostMessage events and errors
3. **Application Tab**: Inspect cookies, localStorage, sessionStorage
4. **Security Tab**: Verify HTTPS and certificate status

### API Endpoints for Testing
- `GET /api/auth` - Check authentication status
- `POST /api/auth` - Login/logout
- `GET /auth-bridge` - Cross-domain authentication bridge

### Console Commands for Testing
```javascript
// Check PostMessage events
window.addEventListener('message', (event) => {
  console.log('PostMessage received:', event.data);
});

// Check localStorage
console.log('LocalStorage:', localStorage);

// Check sessionStorage  
console.log('SessionStorage:', sessionStorage);

// Check cookies
console.log('Cookies:', document.cookie);
```

## Common Issues and Solutions

### Issue 1: Widget Not Loading
- **Cause**: CORS or iframe restrictions
- **Solution**: Check browser console for errors
- **Fix**: Verify CORS headers and iframe policies

### Issue 2: Authentication Not Syncing
- **Cause**: Cross-domain communication not working
- **Solution**: Check PostMessage events in console
- **Fix**: Enhance PostMessage handling and token sharing

### Issue 3: Session Not Persisting
- **Cause**: Different domain cookies not shared
- **Solution**: Implement proper cross-domain session management
- **Fix**: Use JWT tokens with proper domain configuration

## Success Criteria

### ✅ Fully Working Cross-Domain SSO
1. Login on website2.com → Immediately authenticated on website3.com
2. Login on website3.com → Immediately authenticated on website2.com  
3. Logout from any site → Logged out from all sites
4. Session persists across browser tabs
5. Real-time synchronization without page refresh

### ⚠️ Current Implementation Status
1. Widget host authentication: ✅ Working
2. Individual site widget integration: ✅ Working
3. Cross-domain framework: ✅ Implemented
4. Real-time synchronization: ⚠️ Needs enhancement
5. Session persistence: ⚠️ Needs enhancement

## Next Steps for Full Implementation

1. **Enhance PostMessage Communication**
   - Implement real-time authentication state broadcasting
   - Add event listeners for authentication changes

2. **Implement Cross-Domain Token Sharing**
   - Use secure token sharing mechanism
   - Implement token validation across domains

3. **Add Session Synchronization**
   - Real-time session state updates
   - Automatic logout propagation

4. **Test and Validate**
   - Comprehensive cross-domain testing
   - Performance and security validation

