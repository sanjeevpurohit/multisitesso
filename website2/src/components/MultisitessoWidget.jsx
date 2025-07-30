import { useEffect, useRef, useState } from 'react';
import { Button } from '@/components/ui/button.jsx';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card.jsx';
import { Badge } from '@/components/ui/badge.jsx';

const WIDGET_HOST_URL = 'https://3000-iulhipjpw6slcboeknu21-4abb91c0.manusvm.computer';

export function MultisitessoWidget() {
  const iframeRef = useRef(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Initialize cross-domain authentication
    const initAuth = () => {
      // Listen for messages from the widget iframe
      const handleMessage = (event) => {
        if (event.origin !== WIDGET_HOST_URL) return;

        const { type, data } = event.data;

        switch (type) {
          case 'AUTH_STATE_CHANGED':
            setIsAuthenticated(data.isAuthenticated);
            if (data.isAuthenticated && data.user) {
              setUser(data.user);
            } else {
              setUser(null);
            }
            setIsLoading(false);
            break;
          case 'WIDGET_READY':
            setIsLoading(false);
            // Request current auth status
            if (iframeRef.current) {
              iframeRef.current.contentWindow.postMessage({
                type: 'AUTH_STATUS_REQUEST'
              }, WIDGET_HOST_URL);
            }
            break;
        }
      };

      window.addEventListener('message', handleMessage);
      return () => window.removeEventListener('message', handleMessage);
    };

    const cleanup = initAuth();
    return cleanup;
  }, []);

  const handleLogin = () => {
    if (iframeRef.current) {
      iframeRef.current.contentWindow.postMessage({
        type: 'SHOW_LOGIN'
      }, WIDGET_HOST_URL);
    }
  };

  const handleLogout = () => {
    if (iframeRef.current) {
      iframeRef.current.contentWindow.postMessage({
        type: 'LOGOUT'
      }, WIDGET_HOST_URL);
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          User Profile Widget
          <Badge variant={isAuthenticated ? "default" : "secondary"}>
            {isAuthenticated ? "Authenticated" : "Not Authenticated"}
          </Badge>
        </CardTitle>
        <CardDescription>
          Integrated from website1.com with cross-domain authentication
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {isLoading ? (
          <div className="flex items-center justify-center p-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        ) : (
          <>
            <div className="border rounded-lg overflow-hidden">
              <iframe
                ref={iframeRef}
                src={`${WIDGET_HOST_URL}/embed`}
                className="w-full h-64 border-0"
                title="Multisitesso User Profile Widget"
                allow="cross-origin-isolated"
              />
            </div>
            
            {isAuthenticated && user && (
              <div className="p-4 bg-muted rounded-lg">
                <h4 className="font-semibold mb-2">Synchronized User Data:</h4>
                <div className="space-y-1 text-sm">
                  <p><strong>Name:</strong> {user.name}</p>
                  <p><strong>Email:</strong> {user.email}</p>
                  <p><strong>Status:</strong> <Badge variant="outline">Active</Badge></p>
                </div>
              </div>
            )}
            
            <div className="flex gap-2">
              {!isAuthenticated ? (
                <Button onClick={handleLogin} className="flex-1">
                  Sign In
                </Button>
              ) : (
                <Button onClick={handleLogout} variant="outline" className="flex-1">
                  Sign Out
                </Button>
              )}
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
}

