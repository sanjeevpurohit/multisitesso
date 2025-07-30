import type { MetaFunction } from "@remix-run/node";
import { Link } from "@remix-run/react";

export const meta: MetaFunction = () => {
  return [
    { title: "Multisitesso User Profile Widget" },
    { name: "description", content: "Embeddable user profile widget with cross-domain authentication" },
  ];
};

export default function Index() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Multisitesso User Profile Widget
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Embeddable user profile management widget with seamless cross-domain authentication
          </p>
        </div>

        {/* Features */}
        <div className="grid md:grid-cols-3 gap-8 mb-12">
          <div className="bg-white rounded-lg p-6 shadow-md">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
              <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">User Profile Management</h3>
            <p className="text-gray-600">Complete user profile interface with editing capabilities</p>
          </div>

          <div className="bg-white rounded-lg p-6 shadow-md">
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
              <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Cross-Domain Authentication</h3>
            <p className="text-gray-600">Secure authentication that works across different domains</p>
          </div>

          <div className="bg-white rounded-lg p-6 shadow-md">
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
              <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Easy Integration</h3>
            <p className="text-gray-600">Simple JavaScript SDK for quick integration into any website</p>
          </div>
        </div>

        {/* Demo and Links */}
        <div className="grid md:grid-cols-2 gap-8 mb-12">
          <div className="bg-white rounded-lg p-6 shadow-md">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Live Demo</h3>
            <p className="text-gray-600 mb-4">
              See the widget in action with our interactive demo.
            </p>
            <div className="space-y-2">
              <Link 
                to="/widget" 
                className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md transition-colors"
              >
                View Widget Demo
              </Link>
              <br />
              <Link 
                to="/embed" 
                className="inline-block bg-gray-600 hover:bg-gray-700 text-white font-medium py-2 px-4 rounded-md transition-colors"
              >
                View Embed Version
              </Link>
            </div>
          </div>

          <div className="bg-white rounded-lg p-6 shadow-md">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Integration Guide</h3>
            <p className="text-gray-600 mb-4">
              Add the widget to your website with just a few lines of code.
            </p>
            <div className="bg-gray-100 rounded-md p-4 text-sm font-mono">
              {`<script src="/widget-sdk.js"></script>
<div data-multisitesso-widget></div>`}
            </div>
          </div>
        </div>

        {/* API Documentation */}
        <div className="bg-white rounded-lg p-8 shadow-md">
          <h3 className="text-2xl font-semibold text-gray-900 mb-6">API Endpoints</h3>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-semibold text-gray-900 mb-2">Authentication</h4>
              <ul className="space-y-1 text-sm text-gray-600">
                <li><code className="bg-gray-100 px-2 py-1 rounded">GET /api/auth</code> - Get current user</li>
                <li><code className="bg-gray-100 px-2 py-1 rounded">POST /api/auth</code> - Login/logout/update</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-gray-900 mb-2">Widget</h4>
              <ul className="space-y-1 text-sm text-gray-600">
                <li><code className="bg-gray-100 px-2 py-1 rounded">GET /widget</code> - Standalone widget</li>
                <li><code className="bg-gray-100 px-2 py-1 rounded">GET /embed</code> - Embeddable widget</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

