import { json, type LoaderFunctionArgs } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { useEffect } from "react";
import { UserProfileWidget } from "~/components/UserProfileWidget";

export async function loader({ request }: LoaderFunctionArgs) {
  const url = new URL(request.url);
  const origin = request.headers.get("origin") || url.searchParams.get("origin") || "*";
  
  // Mock authentication check - in production this would validate JWT
  const authToken = url.searchParams.get("token");
  
  let user = null;
  if (authToken) {
    // Mock user data based on token
    user = {
      id: authToken,
      name: "John Doe",
      email: "john.doe@example.com",
      avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face",
      isAuthenticated: true,
    };
  }

  return json(
    { user, origin },
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

export default function Embed() {
  const { user, origin } = useLoaderData<typeof loader>();

  useEffect(() => {
    // Set up communication with parent window
    const handleMessage = (event: MessageEvent) => {
      // Verify origin in production
      if (event.data.type === "WIDGET_RESIZE") {
        // Handle resize requests from parent
        const height = document.body.scrollHeight;
        event.source?.postMessage({
          type: "WIDGET_HEIGHT_UPDATE",
          height,
        }, "*");
      }
    };

    window.addEventListener("message", handleMessage);
    
    // Send initial height to parent
    const height = document.body.scrollHeight;
    window.parent.postMessage({
      type: "WIDGET_HEIGHT_UPDATE",
      height,
    }, "*");

    return () => {
      window.removeEventListener("message", handleMessage);
    };
  }, []);

  return (
    <div className="min-h-screen bg-transparent p-4">
      <style>{`
        body {
          margin: 0;
          padding: 0;
          background: transparent;
        }
        .widget-container {
          background: transparent;
        }
      `}</style>
      
      {user ? (
        <UserProfileWidget user={user} />
      ) : (
        <div className="bg-white rounded-lg shadow-lg p-6 max-w-sm mx-auto">
          <div className="text-center">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Welcome to User Profile Widget
            </h3>
            <p className="text-gray-600 mb-4">
              Please sign in to access your profile.
            </p>
            <button 
              onClick={() => {
                window.parent.postMessage({
                  type: "WIDGET_LOGIN_REQUEST",
                }, "*");
              }}
              className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md transition-colors"
            >
              Sign In
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

