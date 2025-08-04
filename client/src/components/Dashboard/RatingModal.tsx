import React, { useState } from 'react';
import { X, Star } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useData } from '../../context/DataContext';

interface RatingModalProps {
  swapRequestId: string;
  onClose: () => void;
}

const RatingModal: React.FC<RatingModalProps> = ({ swapRequestId, onClose }) => {
  const { user } = useAuth();
  const { swapRequests, addRating, users } = useData();
  const [rating, setRating] = useState(0);
  const [feedback, setFeedback] = useState('');
  const [hoveredRating, setHoveredRating] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const swapRequest = swapRequests.find(req => req.id === swapRequestId);
  if (!swapRequest || !user) return null;

  const otherUserId = swapRequest.fromUserId === user.id ? swapRequest.toUserId : swapRequest.fromUserId;
  const otherUser = users.find(u => u.id === otherUserId);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (rating === 0) return;

    setIsSubmitting(true);

    try {
      addRating({
        swapRequestId,
        fromUserId: user.id,
        toUserId: otherUserId,
        rating,
        feedback: feedback.trim(),
      });

      onClose();
    } catch (error) {
      console.error('Error submitting rating:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-md">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold text-gray-900">
              Rate Your Experience
            </h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X className="h-6 w-6" />
            </button>
          </div>

          <div className="text-center mb-6">
            <p className="text-gray-600 mb-2">
              How was your skill swap with <span className="font-semibold">{otherUser?.name}</span>?
            </p>
            <div className="text-sm text-gray-500">
              <span className="font-medium">Skill exchanged:</span> {swapRequest.wantedSkill}
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Star Rating */}
            <div className="text-center">
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Rating *
              </label>
              <div className="flex justify-center space-x-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setRating(star)}
                    onMouseEnter={() => setHoveredRating(star)}
                    onMouseLeave={() => setHoveredRating(0)}
                    className="p-1 transition-transform hover:scale-110"
                  >
                    <Star
                      className={`h-8 w-8 ${
                        star <= (hoveredRating || rating)
                          ? 'fill-yellow-400 text-yellow-400'
                          : 'text-gray-300'
                      }`}
                    />
                  </button>
                ))}
              </div>
              {rating > 0 && (
                <p className="mt-2 text-sm text-gray-600">
                  {rating === 1 && 'Poor'}
                  {rating === 2 && 'Fair'}
                  {rating === 3 && 'Good'}
                  {rating === 4 && 'Very Good'}
                  {rating === 5 && 'Excellent'}
                </p>
              )}
            </div>

            {/* Feedback */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Feedback (Optional)
              </label>
              <textarea
                value={feedback}
                onChange={(e) => setFeedback(e.target.value)}
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="Share your experience with this skill swap..."
              />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={rating === 0 || isSubmitting}
              className="w-full bg-indigo-600 text-white py-2 px-4 rounded-lg font-medium hover:bg-indigo-700 focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {isSubmitting ? 'Submitting...' : 'Submit Rating'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default RatingModal;