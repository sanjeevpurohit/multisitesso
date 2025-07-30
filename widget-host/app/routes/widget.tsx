import { json, type LoaderFunctionArgs } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { UserProfileWidget } from "~/components/UserProfileWidget";

export async function loader({ request }: LoaderFunctionArgs) {
  // Extract origin from request headers for CORS handling
  const origin = request.headers.get("origin") || "*";
  
  // Mock user data - in production this would come from authentication
  const user = {
    id: "1",
    name: "John Doe",
    email: "john.doe@example.com",
    avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face",
    isAuthenticated: true,
  };

  return json(
    { user, origin },
    {
      headers: {
        "Access-Control-Allow-Origin": origin,
        "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type, Authorization",
        "Access-Control-Allow-Credentials": "true",
        "Content-Type": "application/json",
      },
    }
  );
}

export default function Widget() {
  const { user } = useLoaderData<typeof loader>();

  return (
    <div className="widget-container">
      <UserProfileWidget user={user} />
    </div>
  );
}

