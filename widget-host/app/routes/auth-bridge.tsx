import { json, type LoaderFunctionArgs } from "@remix-run/node";
import { useEffect } from "react";

export async function loader({ request }: LoaderFunctionArgs) {
  const origin = request.headers.get("origin") || "*";
  
  return json(
    { success: true },
    {
      headers: {
        "Access-Control-Allow-Origin": origin,
        "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type, Authorization",
        "Access-Control-Allow-Credentials": "true",
        "X-Frame-Options": "ALLOWALL",
        "Content-Security-Policy": "frame-ancestors *;",
      },
    }
  );
}

export default function AuthBridge() {
  useEffect(() => {
    // Set up message listener for cross-domain auth communication
    const handleMessage = (event: MessageEvent) => {
      const { type, data } = event.data;

      switch (type) {
        case 'AUTH_STATUS_REQUEST':
          handleAuthStatusRequest(event);
          break;
        case 'AUTH_TOKEN_REQUEST':
          handleTokenRequest(event);
          break;
        case 'AUTH_TOKEN_SYNC':
          handleTokenSync(data);
          break;
        case 'AUTH_LOGOUT':
          handleLogout();
          break;
      }
    };

    const handleAuthStatusRequest = (event: MessageEvent) => {
      const token = getStoredToken();
      const isAuthenticated = !!token;
      
      event.source?.postMessage({
        type: 'AUTH_STATUS_RESPONSE',
        data: { 
          isAuthenticated, 
          token: isAuthenticated ? token : null,
          requestId: event.data.requestId 
        }
      }, event.origin);
    };

    const handleTokenRequest = (event: MessageEvent) => {
      const token = getStoredToken();
      if (token) {
        event.source?.postMessage({
          type: 'AUTH_TOKEN_RESPONSE',
          data: { token, requestId: event.data.requestId }
        }, event.origin);
      }
    };

    const handleTokenSync = (data: any) => {
      const { token } = data;
      if (token) {
        storeToken(token);
        notifyAuthChange(true, token);
      }
    };

    const handleLogout = () => {
      clearStoredToken();
      notifyAuthChange(false, null);
    };

    const getStoredToken = () => {
      return localStorage.getItem('multisitesso_token') || 
             sessionStorage.getItem('multisitesso_token');
    };

    const storeToken = (token: string) => {
      localStorage.setItem('multisitesso_token', token);
      sessionStorage.setItem('multisitesso_token', token);
    };

    const clearStoredToken = () => {
      localStorage.removeItem('multisitesso_token');
      sessionStorage.removeItem('multisitesso_token');
    };

    const notifyAuthChange = (isAuthenticated: boolean, token: string | null) => {
      window.parent.postMessage({
        type: 'AUTH_STATE_CHANGED',
        data: { isAuthenticated, token }
      }, '*');
    };

    window.addEventListener('message', handleMessage);

    // Notify parent that bridge is ready
    window.parent.postMessage({
      type: 'AUTH_BRIDGE_READY'
    }, '*');

    return () => {
      window.removeEventListener('message', handleMessage);
    };
  }, []);

  return (
    <div style={{ display: 'none' }}>
      {/* Hidden auth bridge iframe */}
    </div>
  );
}

