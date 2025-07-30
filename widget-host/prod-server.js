import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

// Enable CORS for all routes
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
  res.header('Access-Control-Allow-Credentials', 'true');
  if (req.method === 'OPTIONS') {
    res.sendStatus(200);
  } else {
    next();
  }
});

app.use(express.json());
app.use(express.static(path.join(__dirname, 'build/client')));

// API routes
app.get('/api/auth', (req, res) => {
  res.json({
    isAuthenticated: true,
    user: {
      name: 'John Doe',
      email: 'john.doe@example.com',
      avatar: '/api/placeholder/40/40'
    }
  });
});

app.post('/api/auth', (req, res) => {
  const { action, email, password } = req.body;
  
  if (action === 'login') {
    if (email === 'john.doe@example.com' && password === 'password123') {
      res.json({
        success: true,
        user: {
          name: 'John Doe',
          email: 'john.doe@example.com',
          avatar: '/api/placeholder/40/40'
        }
      });
    } else {
      res.status(401).json({ success: false, message: 'Invalid credentials' });
    }
  } else if (action === 'logout') {
    res.json({ success: true });
  } else {
    res.status(400).json({ success: false, message: 'Invalid action' });
  }
});

// Widget routes
app.get('/widget', (req, res) => {
  res.send(`<!DOCTYPE html>
<html>
<head>
  <title>User Profile Widget</title>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <script src="https://cdn.tailwindcss.com"></script>
</head>
<body class="bg-gray-50 p-4">
  <div class="max-w-md mx-auto bg-white rounded-lg shadow-lg overflow-hidden">
    <div class="bg-gradient-to-r from-blue-500 to-purple-600 p-6 text-white">
      <div class="flex items-center space-x-4">
        <div class="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
          <span class="text-xl font-bold">JD</span>
        </div>
        <div>
          <h2 class="text-xl font-bold">John Doe</h2>
          <p class="text-blue-100">john.doe@example.com</p>
        </div>
        <div class="ml-auto">
          <div class="w-3 h-3 bg-green-400 rounded-full"></div>
        </div>
      </div>
    </div>
    <div class="p-6">
      <div class="flex justify-between items-center mb-4">
        <span class="text-gray-600">Status</span>
        <span class="px-2 py-1 bg-green-100 text-green-800 rounded-full text-sm">Active</span>
      </div>
      <div class="flex justify-between items-center mb-6">
        <span class="text-gray-600">Member since</span>
        <span class="text-gray-900">Jan 2024</span>
      </div>
      <button class="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors">
        Edit Profile
      </button>
    </div>
  </div>
</body>
</html>`);
});

app.get('/embed', (req, res) => {
  res.send(`<!DOCTYPE html>
<html>
<head>
  <title>User Profile Widget</title>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <script src="https://cdn.tailwindcss.com"></script>
</head>
<body class="bg-white p-4">
  <div class="text-center">
    <h3 class="text-lg font-semibold mb-4">Welcome to User Profile Widget</h3>
    <p class="text-gray-600 mb-4">Please sign in to access your profile.</p>
    <button onclick="handleLogin()" class="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors">
      Sign In
    </button>
  </div>
  
  <script>
    function handleLogin() {
      document.body.innerHTML = \`
        <div class="bg-gradient-to-r from-blue-500 to-purple-600 p-4 text-white rounded-lg">
          <div class="flex items-center space-x-3">
            <div class="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
              <span class="font-bold">JD</span>
            </div>
            <div>
              <h4 class="font-bold">John Doe</h4>
              <p class="text-blue-100 text-sm">john.doe@example.com</p>
            </div>
            <div class="ml-auto">
              <div class="w-2 h-2 bg-green-400 rounded-full"></div>
            </div>
          </div>
        </div>
        <div class="mt-4 text-center">
          <span class="px-2 py-1 bg-green-100 text-green-800 rounded-full text-sm">Active</span>
        </div>
      \`;
      
      if (window.parent !== window) {
        window.parent.postMessage({
          type: 'AUTH_STATE_CHANGED',
          data: {
            isAuthenticated: true,
            user: {
              name: 'John Doe',
              email: 'john.doe@example.com'
            }
          }
        }, '*');
      }
    }
    
    window.addEventListener('message', (event) => {
      if (event.data.type === 'AUTH_STATUS_REQUEST') {
        window.parent.postMessage({
          type: 'WIDGET_READY'
        }, '*');
      }
    });
  </script>
</body>
</html>`);
});

// Serve main page
app.get('/', (req, res) => {
  res.send(`<!DOCTYPE html>
<html>
<head>
  <title>Multisitesso User Profile Widget</title>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <script src="https://cdn.tailwindcss.com"></script>
</head>
<body class="bg-gray-50">
  <div class="container mx-auto px-4 py-8">
    <div class="text-center mb-12">
      <h1 class="text-4xl font-bold text-gray-900 mb-4">Multisitesso User Profile Widget</h1>
      <p class="text-xl text-gray-600">Embeddable user profile management widget with seamless cross-domain authentication</p>
    </div>
    
    <div class="grid md:grid-cols-3 gap-8 mb-12">
      <div class="bg-white p-6 rounded-lg shadow-lg text-center">
        <div class="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-4">
          <span class="text-2xl">👤</span>
        </div>
        <h3 class="text-xl font-semibold mb-2">User Profile Management</h3>
        <p class="text-gray-600">Complete user profile interface with editing capabilities</p>
      </div>
      
      <div class="bg-white p-6 rounded-lg shadow-lg text-center">
        <div class="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-4">
          <span class="text-2xl">🔐</span>
        </div>
        <h3 class="text-xl font-semibold mb-2">Cross-Domain Authentication</h3>
        <p class="text-gray-600">Secure authentication that works across different domains</p>
      </div>
      
      <div class="bg-white p-6 rounded-lg shadow-lg text-center">
        <div class="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-4">
          <span class="text-2xl">⚡</span>
        </div>
        <h3 class="text-xl font-semibold mb-2">Easy Integration</h3>
        <p class="text-gray-600">Simple JavaScript SDK for quick integration into any website</p>
      </div>
    </div>
    
    <div class="grid md:grid-cols-2 gap-8">
      <div class="bg-white p-6 rounded-lg shadow-lg">
        <h3 class="text-xl font-semibold mb-4">Live Demo</h3>
        <p class="text-gray-600 mb-4">See the widget in action with our interactive demo.</p>
        <div class="space-y-2">
          <a href="/widget" class="inline-block bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
            View Widget Demo
          </a>
          <br>
          <a href="/embed" class="inline-block bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors">
            View Embed Version
          </a>
        </div>
      </div>
      
      <div class="bg-white p-6 rounded-lg shadow-lg">
        <h3 class="text-xl font-semibold mb-4">Integration Guide</h3>
        <p class="text-gray-600 mb-4">Add the widget to your website with just a few lines of code.</p>
        <div class="bg-gray-100 p-4 rounded-lg">
          <code class="text-sm">
            &lt;script src="/widget-sdk.js"&gt;&lt;/script&gt;<br>
            &lt;div data-multisitesso-widget&gt;&lt;/div&gt;
          </code>
        </div>
      </div>
    </div>
  </div>
</body>
</html>`);
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Widget host server running on port ${PORT}`);
});

