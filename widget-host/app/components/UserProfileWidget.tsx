import { useState } from "react";

interface User {
  id: string;
  name: string;
  email: string;
  avatar: string;
  isAuthenticated: boolean;
}

interface UserProfileWidgetProps {
  user: User;
}

export function UserProfileWidget({ user }: UserProfileWidgetProps) {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editedUser, setEditedUser] = useState(user);

  const handleSave = () => {
    // In production, this would make an API call to save user data
    console.log("Saving user data:", editedUser);
    setIsEditing(false);
    
    // Notify parent window of user update
    if (window.parent !== window) {
      window.parent.postMessage({
        type: "USER_PROFILE_UPDATED",
        user: editedUser,
      }, "*");
    }
  };

  const handleLogout = () => {
    // In production, this would clear authentication
    console.log("Logging out user");
    
    // Notify parent window of logout
    if (window.parent !== window) {
      window.parent.postMessage({
        type: "USER_LOGOUT",
      }, "*");
    }
  };

  if (!user.isAuthenticated) {
    return (
      <div className="bg-white rounded-lg shadow-lg p-6 max-w-sm mx-auto">
        <div className="text-center">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Sign In Required
          </h3>
          <button className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md transition-colors">
            Sign In
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-lg max-w-sm mx-auto overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-4">
        <div className="flex items-center space-x-3">
          <img
            src={user.avatar}
            alt={user.name}
            className="w-12 h-12 rounded-full border-2 border-white"
          />
          <div className="flex-1">
            <h3 className="text-white font-semibold">{user.name}</h3>
            <p className="text-blue-100 text-sm">{user.email}</p>
          </div>
          <button
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            className="text-white hover:text-blue-100 transition-colors"
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </button>
        </div>
      </div>

      {/* Dropdown Menu */}
      {isDropdownOpen && (
        <div className="border-b border-gray-200">
          <div className="p-2">
            <button
              onClick={() => {
                setIsEditing(true);
                setIsDropdownOpen(false);
              }}
              className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-md transition-colors"
            >
              Edit Profile
            </button>
            <button
              onClick={handleLogout}
              className="w-full text-left px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded-md transition-colors"
            >
              Sign Out
            </button>
          </div>
        </div>
      )}

      {/* Profile Content */}
      <div className="p-4">
        {isEditing ? (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Name
              </label>
              <input
                type="text"
                value={editedUser.name}
                onChange={(e) => setEditedUser({ ...editedUser, name: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email
              </label>
              <input
                type="email"
                value={editedUser.email}
                onChange={(e) => setEditedUser({ ...editedUser, email: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="flex space-x-2">
              <button
                onClick={handleSave}
                className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md transition-colors"
              >
                Save
              </button>
              <button
                onClick={() => {
                  setIsEditing(false);
                  setEditedUser(user);
                }}
                className="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-700 font-medium py-2 px-4 rounded-md transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        ) : (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Status</span>
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                Active
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Member since</span>
              <span className="text-sm text-gray-900">Jan 2024</span>
            </div>
            <div className="pt-2">
              <button
                onClick={() => setIsEditing(true)}
                className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium py-2 px-4 rounded-md transition-colors"
              >
                Edit Profile
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

