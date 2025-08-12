import React from 'react';
import CountUp from 'react-countup';
import { motion } from 'framer-motion';
import { User } from 'lucide-react';
import Header from '../Layout/Navbar';
import UserCard from '../UserCard';
import Pagination from '../Pagination';
import AuthModal from '../Auth/AuthModal';
import SkillsCarousel from '../SkillsCarousel';
import Content from '../Content';
const stats = [
  { value: "425k+", label: "Members" },
  { value: "30k+", label: "Classes" },
  { value: "9k+", label: "Teachers" },
  { value: "4.8 ★★★★★", label: "App Store Rating" },
];

const Home = ({
  isAuthenticated,
  handleDashboardClick,
  setShowAuthModal,
  showAuthModal,
  searchQuery,
  setSearchQuery,
  filteredUsers,
  displayedUsers,
  currentPage,
  totalPages,
  setCurrentPage
}) => {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-indigo-600 text-white py-20 px-4 md:px-8">
        <div className="max-w-6xl mx-auto flex flex-col-reverse md:flex-row items-center justify-between gap-12">
          {/* Left Content */}
          <div className="text-center md:text-left md:w-1/2 space-y-6">
            <h1 className="text-3xl md:text-5xl font-extrabold leading-tight">
              Swap Skills, <span className="text-yellow-300">Grow Together</span>
            </h1>
            <p className="text-base md:text-lg text-indigo-100">
              Connect with others to exchange knowledge and learn new skills.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
              {isAuthenticated ? (
                <button
                  onClick={handleDashboardClick}
                  className="bg-white text-indigo-600 px-6 py-2 rounded-md font-semibold hover:bg-gray-100 transition-all"
                >
                  My Dashboard
                </button>
              ) : (
                <button
                  onClick={() => setShowAuthModal(true)}
                  className="bg-white text-indigo-600 px-6 py-2 rounded-md font-semibold hover:bg-gray-100 transition-all"
                >
                  Join SkillSwap
                </button>
              )}
            </div>
          </div>

          {/* Right Animated Image */}
          <div className="md:w-1/2 flex justify-center">
            <motion.img
              initial={{ y: -20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 1, ease: "easeOut" }}
              whileHover={{ scale: 1.05, rotate: 1 }}
              src="./src/assids/Hero-logo.png"
              alt="Skill Exchange"
              className="w-60 md:w-80 rounded-xl shadow-xl border-4 border-white"
            />
          </div>
        </div>
      </div>
<SkillsCarousel/>
<Content/>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12 px-4">
  {/* Active Users */}
  <div className="bg-indigo-600 rounded-2xl shadow-lg border border-gray-200 p-8 text-center hover:scale-105 transition-transform duration-300">
    <div className="text-4xl font-extrabold text-yellow-300 mb-2">
      <CountUp end={filteredUsers.length} duration={2} />
    </div>
    <p className="text-white font-medium">Active Users</p>
  </div>

  {/* Skills Available */}
  <div className="bg-indigo-600 rounded-2xl shadow-lg border border-gray-200 p-8 text-center hover:scale-105 transition-transform duration-300">
    <div className="text-4xl font-extrabold text-green-300 mb-2">
      <CountUp
        end={filteredUsers.reduce((acc, user) => acc + user.skillsOffered.length, 0)}
        duration={2.5}
      />
    </div>
    <p className="text-white font-medium">Skills Available</p>
  </div>

  {/* Successful Swaps */}
  <div className="bg-indigo-600 rounded-2xl shadow-lg border border-gray-200 p-8 text-center hover:scale-105 transition-transform duration-300">
    <div className="text-4xl font-extrabold text-pink-300 mb-2">
      <CountUp
        end={filteredUsers.reduce((acc, user) => acc + user.totalRatings, 0)}
        duration={3}
      />
    </div>
    <p className="text-white font-medium">Successful Swaps</p>
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

        {/* User Cards */}
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

      {/* Auth Modal */}
      {showAuthModal && (
        <AuthModal onClose={() => setShowAuthModal(false)} />
      )}
    </div>
  );
};

export default Home;
