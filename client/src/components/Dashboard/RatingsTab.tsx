import React from 'react';
import { Star, MessageSquare } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useData } from '../../context/DataContext';

const RatingsTab: React.FC = () => {
  const { user } = useAuth();
  const { ratings, users } = useData();

  if (!user) return null;

  const userRatings = ratings.filter(rating => rating.toUserId === user.id);
  const givenRatings = ratings.filter(rating => rating.fromUserId === user.id);

  const getUserById = (id: string) => users.find(u => u.id === id);

  const renderStars = (rating: number) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <Star
          key={i}
          className={`h-4 w-4 ${
            i <= rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'
          }`}
        />
      );
    }
    return stars;
  };

  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Ratings & Feedback</h2>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Ratings Received */}
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Ratings Received ({userRatings.length})
          </h3>
          
          {userRatings.length === 0 ? (
            <div className="text-center py-8 bg-gray-50 rounded-lg">
              <Star className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500">No ratings received yet</p>
            </div>
          ) : (
            <div className="space-y-4">
              {userRatings.map((rating) => {
                const fromUser = getUserById(rating.fromUserId);
                return (
                  <div key={rating.id} className="bg-white border border-gray-200 rounded-lg p-4">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 rounded-full flex items-center justify-center overflow-hidden">
                          {fromUser?.profilePhoto ? (
                            <img
                              src={fromUser.profilePhoto}
                              alt={fromUser.name}
                              className="w-10 h-10 rounded-full object-cover"
                            />
                          ) : (
                            <div className="w-10 h-10 bg-indigo-100 rounded-full flex items-center justify-center">
                              <span className="text-indigo-600 font-medium">
                                {fromUser?.name.charAt(0)}
                              </span>
                            </div>
                          )}
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">{fromUser?.name}</p>
                          <div className="flex items-center space-x-1">
                            {renderStars(rating.rating)}
                          </div>
                        </div>
                      </div>
                      <span className="text-xs text-gray-500">
                        {new Date(rating.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                    
                    {rating.feedback && (
                      <p className="text-gray-600 text-sm bg-gray-50 p-3 rounded-lg">
                        {rating.feedback}
                      </p>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Ratings Given */}
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Ratings Given ({givenRatings.length})
          </h3>
          
          {givenRatings.length === 0 ? (
            <div className="text-center py-8 bg-gray-50 rounded-lg">
              <MessageSquare className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500">No ratings given yet</p>
            </div>
          ) : (
            <div className="space-y-4">
              {givenRatings.map((rating) => {
                const toUser = getUserById(rating.toUserId);
                return (
                  <div key={rating.id} className="bg-white border border-gray-200 rounded-lg p-4">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 rounded-full flex items-center justify-center overflow-hidden">
                          {toUser?.profilePhoto ? (
                            <img
                              src={toUser.profilePhoto}
                              alt={toUser.name}
                              className="w-10 h-10 rounded-full object-cover"
                            />
                          ) : (
                            <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                              <span className="text-green-600 font-medium">
                                {toUser?.name.charAt(0)}
                              </span>
                            </div>
                          )}
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">{toUser?.name}</p>
                          <div className="flex items-center space-x-1">
                            {renderStars(rating.rating)}
                          </div>
                        </div>
                      </div>
                      <span className="text-xs text-gray-500">
                        {new Date(rating.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                    
                    {rating.feedback && (
                      <p className="text-gray-600 text-sm bg-gray-50 p-3 rounded-lg">
                        {rating.feedback}
                      </p>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default RatingsTab;