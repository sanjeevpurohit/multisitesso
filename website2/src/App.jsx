import { useState } from 'react';
import { Button } from '@/components/ui/button.jsx';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card.jsx';
import { Badge } from '@/components/ui/badge.jsx';
import { MultisitessoWidget } from './components/MultisitessoWidget.jsx';
import { Globe, Shield, Zap, Code, Users, CheckCircle } from 'lucide-react';
import './App.css';

function App() {
  const [activeTab, setActiveTab] = useState('demo');

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              <Globe className="h-8 w-8 text-blue-600" />
              <h1 className="text-2xl font-bold text-gray-900">Website2.com</h1>
              <Badge variant="secondary">React Client</Badge>
            </div>
            <nav className="flex space-x-4">
              <Button 
                variant={activeTab === 'demo' ? 'default' : 'ghost'}
                onClick={() => setActiveTab('demo')}
              >
                Widget Demo
              </Button>
              <Button 
                variant={activeTab === 'features' ? 'default' : 'ghost'}
                onClick={() => setActiveTab('features')}
              >
                Features
              </Button>
              <Button 
                variant={activeTab === 'integration' ? 'default' : 'ghost'}
                onClick={() => setActiveTab('integration')}
              >
                Integration
              </Button>
            </nav>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === 'demo' && (
          <div className="space-y-8">
            {/* Hero Section */}
            <div className="text-center space-y-4">
              <h2 className="text-4xl font-bold text-gray-900">
                React Client with Multisitesso Widget
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Experience seamless cross-domain authentication with our embedded user profile widget.
                This React application demonstrates how to integrate the Multisitesso widget from website1.com.
              </p>
            </div>

            {/* Widget Demo */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <Shield className="h-5 w-5 text-green-600" />
                      <span>Live Widget Integration</span>
                    </CardTitle>
                    <CardDescription>
                      The widget below is loaded from website1.com and maintains authentication state across domains.
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <MultisitessoWidget />
                  </CardContent>
                </Card>
              </div>

              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <Zap className="h-5 w-5 text-yellow-600" />
                      <span>Cross-Domain Features</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center space-x-3">
                      <CheckCircle className="h-5 w-5 text-green-600" />
                      <span>Single Sign-On (SSO) across domains</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <CheckCircle className="h-5 w-5 text-green-600" />
                      <span>Real-time authentication synchronization</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <CheckCircle className="h-5 w-5 text-green-600" />
                      <span>Secure JWT token management</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <CheckCircle className="h-5 w-5 text-green-600" />
                      <span>PostMessage API communication</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <CheckCircle className="h-5 w-5 text-green-600" />
                      <span>Responsive iframe embedding</span>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <Users className="h-5 w-5 text-blue-600" />
                      <span>Test Credentials</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <div className="p-3 bg-muted rounded-lg">
                      <p className="text-sm"><strong>Email:</strong> john.doe@example.com</p>
                      <p className="text-sm"><strong>Password:</strong> password123</p>
                    </div>
                    <div className="p-3 bg-muted rounded-lg">
                      <p className="text-sm"><strong>Email:</strong> jane.smith@example.com</p>
                      <p className="text-sm"><strong>Password:</strong> password123</p>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'features' && (
          <div className="space-y-8">
            <div className="text-center space-y-4">
              <h2 className="text-4xl font-bold text-gray-900">Platform Features</h2>
              <p className="text-xl text-gray-600">
                Discover the powerful features of our cross-domain authentication system
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <Card>
                <CardHeader>
                  <Shield className="h-12 w-12 text-blue-600 mb-4" />
                  <CardTitle>Secure Authentication</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600">
                    JWT-based authentication with secure token management and automatic refresh capabilities.
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <Globe className="h-12 w-12 text-green-600 mb-4" />
                  <CardTitle>Cross-Domain SSO</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600">
                    Seamless single sign-on experience across multiple domains, similar to Google's approach.
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <Zap className="h-12 w-12 text-yellow-600 mb-4" />
                  <CardTitle>Real-Time Sync</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600">
                    Instant authentication state synchronization across all connected domains and applications.
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <Code className="h-12 w-12 text-purple-600 mb-4" />
                  <CardTitle>Easy Integration</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600">
                    Simple JavaScript SDK and iframe embedding for quick integration into any website.
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <Users className="h-12 w-12 text-red-600 mb-4" />
                  <CardTitle>User Management</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600">
                    Complete user profile management with editing capabilities and real-time updates.
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CheckCircle className="h-12 w-12 text-teal-600 mb-4" />
                  <CardTitle>Production Ready</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600">
                    Battle-tested architecture with proper error handling and security best practices.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        )}

        {activeTab === 'integration' && (
          <div className="space-y-8">
            <div className="text-center space-y-4">
              <h2 className="text-4xl font-bold text-gray-900">Integration Guide</h2>
              <p className="text-xl text-gray-600">
                Learn how to integrate the Multisitesso widget into your applications
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <Card>
                <CardHeader>
                  <CardTitle>HTML/JavaScript Integration</CardTitle>
                  <CardDescription>
                    Basic integration using vanilla JavaScript
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <pre className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto text-sm">
{`<!-- Include the widget SDK -->
<script src="https://website1.com/widget-sdk.js"></script>

<!-- Widget container -->
<div data-multisitesso-widget></div>

<!-- Initialize the widget -->
<script>
  MultisitessoWidget.init({
    container: '[data-multisitesso-widget]',
    onAuthChange: (user) => {
      console.log('Auth changed:', user);
    }
  });
</script>`}
                  </pre>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>React Integration</CardTitle>
                  <CardDescription>
                    Integration with React applications
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <pre className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto text-sm">
{`import { useEffect, useRef } from 'react';

function UserWidget() {
  const iframeRef = useRef(null);
  
  useEffect(() => {
    const handleMessage = (event) => {
      if (event.data.type === 'AUTH_STATE_CHANGED') {
        // Handle auth state changes
        console.log('User:', event.data.user);
      }
    };
    
    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, []);
  
  return (
    <iframe
      ref={iframeRef}
      src="https://website1.com/embed"
      className="w-full h-64"
    />
  );
}`}
                  </pre>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>PHP Integration</CardTitle>
                  <CardDescription>
                    Server-side integration with PHP
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <pre className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto text-sm">
{`<?php
// Validate JWT token from cookie
function validateMultisitessoToken($token) {
    $url = 'https://website1.com/api/auth';
    $context = stream_context_create([
        'http' => [
            'method' => 'GET',
            'header' => "Authorization: Bearer $token"
        ]
    ]);
    
    $response = file_get_contents($url, false, $context);
    return json_decode($response, true);
}

// Check authentication
$token = $_COOKIE['multisitesso_auth'] ?? null;
$user = $token ? validateMultisitessoToken($token) : null;

if ($user && $user['isAuthenticated']) {
    echo "Welcome, " . $user['user']['name'];
} else {
    echo "Please sign in";
}
?>`}
                  </pre>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Configuration Options</CardTitle>
                  <CardDescription>
                    Available configuration parameters
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-semibold">Widget Host URL</h4>
                      <p className="text-sm text-gray-600">https://website1.com</p>
                    </div>
                    <div>
                      <h4 className="font-semibold">Embed Endpoint</h4>
                      <p className="text-sm text-gray-600">/embed</p>
                    </div>
                    <div>
                      <h4 className="font-semibold">API Endpoint</h4>
                      <p className="text-sm text-gray-600">/api/auth</p>
                    </div>
                    <div>
                      <h4 className="font-semibold">Auth Bridge</h4>
                      <p className="text-sm text-gray-600">/auth-bridge</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-white border-t mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center text-gray-600">
            <p>© 2024 Website2.com - React Client with Multisitesso Widget Integration</p>
            <p className="mt-2">Demonstrating cross-domain authentication and micro frontend architecture</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;

