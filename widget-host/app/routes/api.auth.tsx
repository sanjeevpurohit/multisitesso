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

// Simple JWT implementation for demo (in production, use a proper JWT library)
const JWT_SECRET = "multisitesso-secret-key-2024";

function generateJWT(user: any) {
  const header = { alg: "HS256", typ: "JWT" };
  const payload = {
    sub: user.id,
    email: user.email,
    name: user.name,
    avatar: user.avatar,
    iat: Math.floor(Date.now() / 1000),
    exp: Math.floor(Date.now() / 1000) + (24 * 60 * 60), // 24 hours
    iss: "multisitesso-auth",
    aud: ["website1.com", "website2.com", "website3.com"]
  };

  const encodedHeader = btoa(JSON.stringify(header)).replace(/=/g, "");
  const encodedPayload = btoa(JSON.stringify(payload)).replace(/=/g, "");
  
  // Simple signature (in production, use proper HMAC)
  const signature = btoa(`${encodedHeader}.${encodedPayload}.${JWT_SECRET}`).replace(/=/g, "");
  
  return `${encodedHeader}.${encodedPayload}.${signature}`;
}

function verifyJWT(token: string) {
  try {
    const parts = token.split(".");
    if (parts.length !== 3) return null;

    const payload = JSON.parse(atob(parts[1]));
    
    // Check expiry
    if (payload.exp < Math.floor(Date.now() / 1000)) {
      return null;
    }

    return payload;
  } catch {
    return null;
  }
}

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

  // Get current user from JWT token
  const authHeader = request.headers.get("Authorization");
  
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return json(
      { user: null, isAuthenticated: false },
      { headers: setCORSHeaders(origin) }
    );
  }

  const token = authHeader.replace("Bearer ", "");
  const payload = verifyJWT(token);

  if (!payload) {
    return json(
      { user: null, isAuthenticated: false },
      { headers: setCORSHeaders(origin) }
    );
  }

  const user = {
    id: payload.sub,
    name: payload.name,
    email: payload.email,
    avatar: payload.avatar,
  };

  return json(
    { user, isAuthenticated: true },
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
      const token = generateJWT(user);

      // Set secure cookie for cross-domain authentication
      const headers = {
        ...setCORSHeaders(origin),
        "Set-Cookie": `multisitesso_auth=${token}; HttpOnly; Secure; SameSite=None; Max-Age=86400; Path=/`,
      };

      return json(
        { 
          user: userWithoutPassword, 
          token,
          isAuthenticated: true 
        },
        { headers }
      );
    }

    case "logout": {
      const headers = {
        ...setCORSHeaders(origin),
        "Set-Cookie": "multisitesso_auth=; HttpOnly; Secure; SameSite=None; Max-Age=0; Path=/",
      };

      return json(
        { user: null, isAuthenticated: false },
        { headers }
      );
    }

    case "update": {
      const authHeader = request.headers.get("Authorization");
      if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return json(
          { error: "Unauthorized" },
          { status: 401, headers: setCORSHeaders(origin) }
        );
      }

      const token = authHeader.replace("Bearer ", "");
      const payload = verifyJWT(token);

      if (!payload) {
        return json(
          { error: "Invalid token" },
          { status: 401, headers: setCORSHeaders(origin) }
        );
      }

      const user = Array.from(users.values()).find(u => u.id === payload.sub);
      if (!user) {
        return json(
          { error: "User not found" },
          { status: 404, headers: setCORSHeaders(origin) }
        );
      }

      const name = formData.get("name") as string;
      const email = formData.get("email") as string;

      // Update user data
      if (name) user.name = name;
      if (email) user.email = email;

      // Generate new token with updated info
      const newToken = generateJWT(user);
      const { password, ...userWithoutPassword } = user;

      const headers = {
        ...setCORSHeaders(origin),
        "Set-Cookie": `multisitesso_auth=${newToken}; HttpOnly; Secure; SameSite=None; Max-Age=86400; Path=/`,
      };

      return json(
        { user: userWithoutPassword, token: newToken, isAuthenticated: true },
        { headers }
      );
    }

    default:
      return json(
        { error: "Invalid action" },
        { status: 400, headers: setCORSHeaders(origin) }
      );
  }
}

