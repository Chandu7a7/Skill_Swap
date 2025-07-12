import React, { useState, useEffect } from 'react';
import { Settings, User } from 'lucide-react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { DataProvider, useData } from './context/DataContext';
import Header from './components/Layout/Header';
import UserCard from './components/UserCard';
import Pagination from './components/Pagination';
import Dashboard from './components/Dashboard/Dashboard';
import AuthModal from './components/Auth/AuthModal';

const USERS_PER_PAGE = 6;

function AppContent() {
  const { isAuthenticated, user } = useAuth();
  const { searchUsers } = useData();
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [showDashboard, setShowDashboard] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);

  const filteredUsers = searchUsers(searchQuery);
  const totalPages = Math.ceil(filteredUsers.length / USERS_PER_PAGE);
  const startIndex = (currentPage - 1) * USERS_PER_PAGE;
  const displayedUsers = filteredUsers.slice(startIndex, startIndex + USERS_PER_PAGE);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery]);

  const handleDashboardClick = () => {
    if (!isAuthenticated) {
      setShowAuthModal(true);
      return;
    }
    setShowDashboard(true);
  };

  if (showDashboard && isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header onSearch={setSearchQuery} searchQuery={searchQuery} />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <button
            onClick={() => setShowDashboard(false)}
            className="mb-4 text-indigo-600 hover:text-indigo-700 font-medium"
          >
            ← Back to Browse
          </button>
        </div>
        <Dashboard />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header onSearch={setSearchQuery} searchQuery={searchQuery} />
      
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Swap Skills, Grow Together
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-indigo-100">
              Connect with others to exchange knowledge and learn new skills
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              {isAuthenticated ? (
                <button
                  onClick={handleDashboardClick}
                  className="bg-white text-indigo-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors flex items-center justify-center space-x-2"
                >
                  <Settings className="h-5 w-5" />
                  <span>My Dashboard</span>
                </button>
              ) : (
                <button
                  onClick={() => setShowAuthModal(true)}
                  className="bg-white text-indigo-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors flex items-center justify-center space-x-2"
                >
                  <User className="h-5 w-5" />
                  <span>Join SkillSwap</span>
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 text-center">
            <div className="text-3xl font-bold text-indigo-600 mb-2">{filteredUsers.length}</div>
            <div className="text-gray-600">Active Users</div>
          </div>
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 text-center">
            <div className="text-3xl font-bold text-green-600 mb-2">
              {filteredUsers.reduce((acc, user) => acc + user.skillsOffered.length, 0)}
            </div>
            <div className="text-gray-600">Skills Available</div>
          </div>
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 text-center">
            <div className="text-3xl font-bold text-purple-600 mb-2">
              {filteredUsers.reduce((acc, user) => acc + user.totalRatings, 0)}
            </div>
            <div className="text-gray-600">Successful Swaps</div>
          </div>
        </div>

        {/* Search Results */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            {searchQuery ? `Search Results for "${searchQuery}"` : 'Discover Skills'}
          </h2>
          <p className="text-gray-600">
            {filteredUsers.length} {filteredUsers.length === 1 ? 'user' : 'users'} found
          </p>
        </div>

        {/* User Grid */}
        {displayedUsers.length === 0 ? (
          <div className="text-center py-12">
            <User className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No users found</h3>
            <p className="text-gray-600">
              {searchQuery 
                ? 'Try adjusting your search terms or browse all users.'
                : 'Be the first to join our community!'}
            </p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {displayedUsers.map((user) => (
                <UserCard key={user.id} user={user} />
              ))}
            </div>

            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
            />
          </>
        )}
      </div>

      {showAuthModal && (
        <AuthModal onClose={() => setShowAuthModal(false)} />
      )}
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <DataProvider>
        <AppContent />
      </DataProvider>
    </AuthProvider>
  );
}

export default App;