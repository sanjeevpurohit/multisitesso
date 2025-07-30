import { json, type ActionFunctionArgs, type LoaderFunctionArgs } from "@remix-run/node";

// Mock user database - in production this would be a real database
const users = new Map([
  ["john.doe@example.com", {
    id: "1",
    name: "John Doe",
    email: "john.doe@example.com",
    avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face",
    password: "password123", // In production, this would be hashed
  }],
  ["jane.smith@example.com", {
    id: "2",
    name: "Jane Smith",
    email: "jane.smith@example.com",
    avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face",
    password: "password123",
  }],
]);

function setCORSHeaders(origin: string) {
  return {
    "Access-Control-Allow-Origin": origin || "*",
    "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, Authorization",
    "Access-Control-Allow-Credentials": "true",
  };
}

export async function loader({ request }: LoaderFunctionArgs) {
  const origin = request.headers.get("origin") || "*";
  
  // Handle preflight requests
  if (request.method === "OPTIONS") {
    return new Response(null, {
      status: 200,
      headers: setCORSHeaders(origin),
    });
  }

  // Get current user from session/token
  // In production, this would validate JWT token
  const authHeader = request.headers.get("Authorization");
  
  if (!authHeader) {
    return json(
      { user: null, isAuthenticated: false },
      { headers: setCORSHeaders(origin) }
    );
  }

  // Mock token validation
  const token = authHeader.replace("Bearer ", "");
  const user = Array.from(users.values()).find(u => u.id === token);

  if (!user) {
    return json(
      { user: null, isAuthenticated: false },
      { headers: setCORSHeaders(origin) }
    );
  }

  const { password, ...userWithoutPassword } = user;
  return json(
    { user: userWithoutPassword, isAuthenticated: true },
    { headers: setCORSHeaders(origin) }
  );
}

export async function action({ request }: ActionFunctionArgs) {
  const origin = request.headers.get("origin") || "*";
  
  if (request.method === "OPTIONS") {
    return new Response(null, {
      status: 200,
      headers: setCORSHeaders(origin),
    });
  }

  const formData = await request.formData();
  const action = formData.get("action");

  switch (action) {
    case "login": {
      const email = formData.get("email") as string;
      const password = formData.get("password") as string;

      const user = users.get(email);
      if (!user || user.password !== password) {
        return json(
          { error: "Invalid credentials" },
          { status: 401, headers: setCORSHeaders(origin) }
        );
      }

      const { password: _, ...userWithoutPassword } = user;
      
      // In production, generate a real JWT token
      const token = user.id;

      return json(
        { 
          user: userWithoutPassword, 
          token,
          isAuthenticated: true 
        },
        { headers: setCORSHeaders(origin) }
      );
    }

    case "logout": {
      return json(
        { user: null, isAuthenticated: false },
        { headers: setCORSHeaders(origin) }
      );
    }

    case "update": {
      const authHeader = request.headers.get("Authorization");
      if (!authHeader) {
        return json(
          { error: "Unauthorized" },
          { status: 401, headers: setCORSHeaders(origin) }
        );
      }

      const token = authHeader.replace("Bearer ", "");
      const user = Array.from(users.values()).find(u => u.id === token);

      if (!user) {
        return json(
          { error: "User not found" },
          { status: 404, headers: setCORSHeaders(origin) }
        );
      }

      const name = formData.get("name") as string;
      const email = formData.get("email") as string;

      // Update user data
      user.name = name || user.name;
      user.email = email || user.email;

      const { password, ...userWithoutPassword } = user;
      return json(
        { user: userWithoutPassword, isAuthenticated: true },
        { headers: setCORSHeaders(origin) }
      );
    }

    default:
      return json(
        { error: "Invalid action" },
        { status: 400, headers: setCORSHeaders(origin) }
      );
  }
}

