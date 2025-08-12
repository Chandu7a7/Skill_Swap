import React, { useState } from 'react';
import { MapPin, Star, MessageCircle, User as UserIcon } from 'lucide-react';
import { User } from '../types';
import { useAuth } from '../context/AuthContext';
import SwapRequestModal from './SwapRequestModal';
import AuthModal from './Auth/AuthModal';

interface UserCardProps {
  user: User;
}

const UserCard: React.FC<UserCardProps> = ({ user }) => {
  const { isAuthenticated, user: currentUser } = useAuth();
  const [showSwapModal, setShowSwapModal] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);

  const handleSwapRequest = () => {
    if (!isAuthenticated) {
      setShowAuthModal(true);
      return;
    }
    setShowSwapModal(true);
  };

  const renderStars = (rating: number) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;

    for (let i = 0; i < fullStars; i++) {
      stars.push(
        <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
      );
    }

    if (hasHalfStar) {
      stars.push(
        <Star key="half" className="h-4 w-4 fill-yellow-400 text-yellow-400 opacity-50" />
      );
    }

    const remainingStars = 5 - Math.ceil(rating);
    for (let i = 0; i < remainingStars; i++) {
      stars.push(
        <Star key={`empty-${i}`} className="h-4 w-4 text-indigo-300 opacity-30" />
      );
    }

    return stars;
  };

  return (
    <>
      <div className="bg-indigo-600 rounded-xl shadow-md border border-indigo-500 p-6 text-white hover:shadow-lg transition-shadow duration-300">
        {/* Profile Header */}
        <div className="flex items-start space-x-4 mb-4">
          <div className="w-16 h-16 rounded-full overflow-hidden flex items-center justify-center bg-indigo-500">
            {user.profilePhoto ? (
              <img
                src={user.profilePhoto}
                alt={user.name}
                className="w-16 h-16 object-cover rounded-full"
              />
            ) : (
              <UserIcon className="h-8 w-8 text-white" />
            )}
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="text-lg font-semibold truncate">{user.name}</h3>
            {user.location && (
              <div className="flex items-center text-sm text-indigo-200 mt-1">
                <MapPin className="h-4 w-4 mr-1" />
                {user.location}
              </div>
            )}
            {user.totalRatings > 0 && (
              <div className="flex items-center mt-2">
                <div className="flex items-center space-x-1">
                  {renderStars(user.rating)}
                </div>
                <span className="ml-2 text-sm text-indigo-100">
                  {user.rating.toFixed(1)} ({user.totalRatings} reviews)
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Skills Offered */}
        {user.skillsOffered.length > 0 && (
          <div className="mb-4">
            <h4 className="text-sm font-semibold text-indigo-100 mb-2">Skills Offered</h4>
            <div className="flex flex-wrap gap-2">
              {user.skillsOffered.slice(0, 3).map((skill, index) => (
                <span
                  key={index}
                  className="px-3 py-1 bg-green-200/20 text-green-200 text-xs font-medium rounded-full"
                >
                  {skill}
                </span>
              ))}
              {user.skillsOffered.length > 3 && (
                <span className="px-3 py-1 bg-white/10 text-white/80 text-xs font-medium rounded-full">
                  +{user.skillsOffered.length - 3} more
                </span>
              )}
            </div>
          </div>
        )}

        {/* Skills Wanted */}
        {user.skillsWanted.length > 0 && (
          <div className="mb-4">
            <h4 className="text-sm font-semibold text-indigo-100 mb-2">Skills Wanted</h4>
            <div className="flex flex-wrap gap-2">
              {user.skillsWanted.slice(0, 3).map((skill, index) => (
                <span
                  key={index}
                  className="px-3 py-1 bg-blue-200/20 text-blue-200 text-xs font-medium rounded-full"
                >
                  {skill}
                </span>
              ))}
              {user.skillsWanted.length > 3 && (
                <span className="px-3 py-1 bg-white/10 text-white/80 text-xs font-medium rounded-full">
                  +{user.skillsWanted.length - 3} more
                </span>
              )}
            </div>
          </div>
        )}

        {/* Availability */}
        {user.availability.length > 0 && (
          <div className="mb-4">
            <h4 className="text-sm font-semibold text-indigo-100 mb-2">Availability</h4>
            <div className="flex flex-wrap gap-2">
              {user.availability.map((time, index) => (
                <span
                  key={index}
                  className="px-3 py-1 bg-purple-200/20 text-purple-200 text-xs font-medium rounded-full"
                >
                  {time}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Action Button */}
        {currentUser?.id !== user.id && (
          <button
            onClick={handleSwapRequest}
            className="w-full bg-white text-indigo-600 py-2 px-4 rounded-lg font-semibold hover:bg-indigo-100 focus:ring-2 focus:ring-white focus:ring-offset-2 transition-colors flex items-center justify-center space-x-2"
          >
            <MessageCircle className="h-4 w-4" />
            <span>Request Skill Swap</span>
          </button>
        )}
      </div>

      {/* Modals */}
      {showSwapModal && (
        <SwapRequestModal
          targetUser={user}
          onClose={() => setShowSwapModal(false)}
        />
      )}
      {showAuthModal && (
        <AuthModal onClose={() => setShowAuthModal(false)} />
      )}
    </>
  );
};

export default UserCard;
