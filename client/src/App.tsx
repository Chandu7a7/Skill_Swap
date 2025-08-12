import React, { useState, useEffect } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { DataProvider, useData } from './context/DataContext';

import Header from './components/Layout/Navbar';
import Footer from './components/Layout/Footer';

import Dashboard from './components/Dashboard/Dashboard';
import HomePage from './components/Pages/HomePage';

const USERS_PER_PAGE = 6;

function AppContent() {
  const { isAuthenticated } = useAuth();
  const { searchUsers } = useData();

  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [showDashboard, setShowDashboard] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);

  const filteredUsers = searchUsers ? searchUsers(searchQuery) : [];
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

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header onSearch={setSearchQuery} searchQuery={searchQuery} />

      <div className="flex-grow">
        {showDashboard && isAuthenticated ? (
          <>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
              <button
                onClick={() => setShowDashboard(false)}
                className="mb-4 text-indigo-600 hover:text-indigo-700 font-medium"
              >
                ← Back to Browse
              </button>
            </div>
            <Dashboard />
          </>
        ) : (
          <HomePage
            isAuthenticated={isAuthenticated}
            handleDashboardClick={handleDashboardClick}
            setShowAuthModal={setShowAuthModal}
            showAuthModal={showAuthModal}
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            filteredUsers={filteredUsers}
            displayedUsers={displayedUsers}
            currentPage={currentPage}
            totalPages={totalPages}
            setCurrentPage={setCurrentPage}
          />
        )}
      </div>

      {/* 👇 Footer har jagah dikhega */}
      <Footer />
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
