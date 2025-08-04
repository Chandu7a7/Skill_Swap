import React, { useState } from 'react';
import { Check, X, Trash2, MessageCircle, Clock, CheckCircle, XCircle, Star } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useData } from '../../context/DataContext';
import RatingModal from './RatingModal';

const SwapRequestsTab: React.FC = () => {
  const { user } = useAuth();
  const { swapRequests, updateSwapRequest, deleteSwapRequest, users } = useData();
  const [activeFilter, setActiveFilter] = useState<'all' | 'sent' | 'received'>('all');
  const [showRatingModal, setShowRatingModal] = useState<string | null>(null);

  if (!user) return null;

  const userRequests = swapRequests.filter(request => 
    request.fromUserId === user.id || request.toUserId === user.id
  );

  const filteredRequests = userRequests.filter(request => {
    if (activeFilter === 'sent') return request.fromUserId === user.id;
    if (activeFilter === 'received') return request.toUserId === user.id;
    return true;
  });

  const getUserById = (id: string) => users.find(u => u.id === id);

  const handleAccept = (requestId: string) => {
    updateSwapRequest(requestId, { status: 'accepted' });
  };

  const handleReject = (requestId: string) => {
    updateSwapRequest(requestId, { status: 'rejected' });
  };

  const handleDelete = (requestId: string) => {
    deleteSwapRequest(requestId);
  };

  const handleComplete = (requestId: string) => {
    updateSwapRequest(requestId, { status: 'completed' });
    setShowRatingModal(requestId);
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending':
        return <Clock className="h-5 w-5 text-yellow-500" />;
      case 'accepted':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'rejected':
        return <XCircle className="h-5 w-5 text-red-500" />;
      case 'completed':
        return <Star className="h-5 w-5 text-purple-500" />;
      default:
        return null;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'accepted':
        return 'bg-green-100 text-green-800';
      case 'rejected':
        return 'bg-red-100 text-red-800';
      case 'completed':
        return 'bg-purple-100 text-purple-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Swap Requests</h2>
        
        {/* Filter Tabs */}
        <div className="flex space-x-1 bg-gray-100 rounded-lg p-1">
          {[
            { id: 'all', label: 'All' },
            { id: 'sent', label: 'Sent' },
            { id: 'received', label: 'Received' },
          ].map((filter) => (
            <button
              key={filter.id}
              onClick={() => setActiveFilter(filter.id as any)}
              className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
                activeFilter === filter.id
                  ? 'bg-white text-indigo-600 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              {filter.label}
            </button>
          ))}
        </div>
      </div>

      {filteredRequests.length === 0 ? (
        <div className="text-center py-12">
          <MessageCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No swap requests</h3>
          <p className="text-gray-500">
            {activeFilter === 'sent' 
              ? "You haven't sent any swap requests yet."
              : activeFilter === 'received'
              ? "You haven't received any swap requests yet."
              : "No swap requests found."}
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredRequests.map((request) => {
            const otherUser = request.fromUserId === user.id 
              ? getUserById(request.toUserId)
              : getUserById(request.fromUserId);
            const isReceived = request.toUserId === user.id;
            const isPending = request.status === 'pending';
            const isAccepted = request.status === 'accepted';

            return (
              <div key={request.id} className="bg-white border border-gray-200 rounded-lg p-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-3">
                      <div className="w-10 h-10 rounded-full flex items-center justify-center overflow-hidden">
                        {otherUser?.profilePhoto ? (
                          <img
                            src={otherUser.profilePhoto}
                            alt={otherUser.name}
                            className="w-10 h-10 rounded-full object-cover"
                          />
                        ) : (
                          <div className="w-10 h-10 bg-indigo-100 rounded-full flex items-center justify-center">
                            <span className="text-indigo-600 font-medium">
                              {otherUser?.name.charAt(0)}
                            </span>
                          </div>
                        )}
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900">
                          {isReceived ? 'Request from' : 'Request to'} {otherUser?.name}
                        </h3>
                        <div className="flex items-center space-x-2">
                          {getStatusIcon(request.status)}
                          <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(request.status)}`}>
                            {request.status.charAt(0).toUpperCase() + request.status.slice(1)}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                      <div>
                        <p className="text-sm font-medium text-gray-700">Skill Offered</p>
                        <p className="text-sm text-gray-900 bg-green-50 px-3 py-1 rounded-full inline-block mt-1">
                          {request.offeredSkill}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-700">Skill Wanted</p>
                        <p className="text-sm text-gray-900 bg-blue-50 px-3 py-1 rounded-full inline-block mt-1">
                          {request.wantedSkill}
                        </p>
                      </div>
                    </div>

                    {request.message && (
                      <div className="mb-4">
                        <p className="text-sm font-medium text-gray-700 mb-1">Message</p>
                        <p className="text-sm text-gray-600 bg-gray-50 p-3 rounded-lg">
                          {request.message}
                        </p>
                      </div>
                    )}

                    <p className="text-xs text-gray-500">
                      {isReceived ? 'Received' : 'Sent'} on {new Date(request.createdAt).toLocaleDateString()}
                    </p>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex flex-col space-y-2 ml-4">
                    {isReceived && isPending && (
                      <>
                        <button
                          onClick={() => handleAccept(request.id)}
                          className="flex items-center space-x-1 bg-green-600 text-white px-3 py-1 rounded-md text-sm font-medium hover:bg-green-700 transition-colors"
                        >
                          <Check className="h-4 w-4" />
                          <span>Accept</span>
                        </button>
                        <button
                          onClick={() => handleReject(request.id)}
                          className="flex items-center space-x-1 bg-red-600 text-white px-3 py-1 rounded-md text-sm font-medium hover:bg-red-700 transition-colors"
                        >
                          <X className="h-4 w-4" />
                          <span>Reject</span>
                        </button>
                      </>
                    )}

                    {isAccepted && (
                      <button
                        onClick={() => handleComplete(request.id)}
                        className="flex items-center space-x-1 bg-purple-600 text-white px-3 py-1 rounded-md text-sm font-medium hover:bg-purple-700 transition-colors"
                      >
                        <Star className="h-4 w-4" />
                        <span>Complete</span>
                      </button>
                    )}

                    {!isReceived && isPending && (
                      <button
                        onClick={() => handleDelete(request.id)}
                        className="flex items-center space-x-1 bg-gray-600 text-white px-3 py-1 rounded-md text-sm font-medium hover:bg-gray-700 transition-colors"
                      >
                        <Trash2 className="h-4 w-4" />
                        <span>Delete</span>
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {showRatingModal && (
        <RatingModal
          swapRequestId={showRatingModal}
          onClose={() => setShowRatingModal(null)}
        />
      )}
    </div>
  );
};

export default SwapRequestsTab;