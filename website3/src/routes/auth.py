from flask import Blueprint, jsonify, request, session
import requests
import json
from datetime import datetime

auth_bp = Blueprint('auth', __name__)

# Widget host URL for validation
WIDGET_HOST_URL = 'https://3000-iulhipjpw6slcboeknu21-4abb91c0.manusvm.computer'

@auth_bp.route('/auth/status', methods=['GET'])
def get_auth_status():
    """Get current authentication status from session"""
    user = session.get('user')
    is_authenticated = user is not None
    
    return jsonify({
        'isAuthenticated': is_authenticated,
        'user': user,
        'sessionId': session.get('session_id'),
        'lastUpdated': session.get('last_updated')
    })

@auth_bp.route('/auth/validate', methods=['POST'])
def validate_token():
    """Validate JWT token with widget host"""
    data = request.json
    token = data.get('token')
    
    if not token:
        return jsonify({'error': 'Token required'}), 400
    
    try:
        # Validate token with widget host
        headers = {'Authorization': f'Bearer {token}'}
        response = requests.get(f'{WIDGET_HOST_URL}/api/auth', headers=headers, timeout=10)
        
        if response.status_code == 200:
            auth_data = response.json()
            if auth_data.get('isAuthenticated'):
                # Store user in session
                session['user'] = auth_data.get('user')
                session['session_id'] = f'php_session_{datetime.now().timestamp()}'
                session['last_updated'] = datetime.now().isoformat()
                
                return jsonify({
                    'valid': True,
                    'user': auth_data.get('user'),
                    'message': 'Token validated successfully'
                })
        
        return jsonify({'valid': False, 'message': 'Invalid token'}), 401
        
    except requests.RequestException as e:
        return jsonify({'error': 'Token validation failed', 'details': str(e)}), 500

@auth_bp.route('/auth/sync', methods=['POST'])
def sync_auth_state():
    """Sync authentication state from widget"""
    data = request.json
    
    if data.get('isAuthenticated') and data.get('user'):
        # User is authenticated, store in session
        session['user'] = data.get('user')
        session['session_id'] = f'php_session_{datetime.now().timestamp()}'
        session['last_updated'] = datetime.now().isoformat()
        session['auth_token'] = data.get('token')
        
        return jsonify({
            'status': 'success',
            'message': 'Authentication state synchronized',
            'sessionId': session['session_id']
        })
    else:
        # User is not authenticated, clear session
        session.clear()
        
        return jsonify({
            'status': 'success',
            'message': 'Session cleared'
        })

@auth_bp.route('/auth/login', methods=['POST'])
def login():
    """Handle login request (delegates to widget)"""
    data = request.json
    email = data.get('email')
    password = data.get('password')
    
    if not email or not password:
        return jsonify({'error': 'Email and password required'}), 400
    
    try:
        # Forward login request to widget host
        login_data = {'email': email, 'password': password}
        response = requests.post(f'{WIDGET_HOST_URL}/api/auth', json=login_data, timeout=10)
        
        if response.status_code == 200:
            auth_result = response.json()
            if auth_result.get('isAuthenticated'):
                # Store user in session
                session['user'] = auth_result.get('user')
                session['session_id'] = f'php_session_{datetime.now().timestamp()}'
                session['last_updated'] = datetime.now().isoformat()
                
                return jsonify({
                    'success': True,
                    'user': auth_result.get('user'),
                    'message': 'Login successful'
                })
        
        return jsonify({'success': False, 'message': 'Invalid credentials'}), 401
        
    except requests.RequestException as e:
        return jsonify({'error': 'Login failed', 'details': str(e)}), 500

@auth_bp.route('/auth/logout', methods=['POST'])
def logout():
    """Handle logout request"""
    session.clear()
    
    return jsonify({
        'success': True,
        'message': 'Logged out successfully'
    })

@auth_bp.route('/user/profile', methods=['GET'])
def get_user_profile():
    """Get current user profile"""
    user = session.get('user')
    
    if not user:
        return jsonify({'error': 'Not authenticated'}), 401
    
    return jsonify({
        'user': user,
        'sessionInfo': {
            'sessionId': session.get('session_id'),
            'lastUpdated': session.get('last_updated'),
            'isActive': True
        }
    })

@auth_bp.route('/session/info', methods=['GET'])
def get_session_info():
    """Get detailed session information"""
    return jsonify({
        'sessionId': session.get('session_id', 'No active session'),
        'isAuthenticated': session.get('user') is not None,
        'user': session.get('user'),
        'lastUpdated': session.get('last_updated'),
        'authToken': session.get('auth_token', 'None'),
        'sessionData': dict(session) if session else {}
    })

