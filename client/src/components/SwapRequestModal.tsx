import React, { useState } from 'react';
import { X, Send } from 'lucide-react';
import { User } from '../types';
import { useAuth } from '../context/AuthContext';
import { useData } from '../context/DataContext';

interface SwapRequestModalProps {
  targetUser: User;
  onClose: () => void;
}

const SwapRequestModal: React.FC<SwapRequestModalProps> = ({ targetUser, onClose }) => {
  const { user } = useAuth();
  const { createSwapRequest } = useData();
  const [selectedOfferedSkill, setSelectedOfferedSkill] = useState('');
  const [selectedWantedSkill, setSelectedWantedSkill] = useState('');
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !selectedOfferedSkill || !selectedWantedSkill) return;

    setIsSubmitting(true);

    try {
      createSwapRequest({
        fromUserId: user.id,
        toUserId: targetUser.id,
        offeredSkill: selectedOfferedSkill,
        wantedSkill: selectedWantedSkill,
        message: message.trim(),
        status: 'pending',
      });

      onClose();
    } catch (error) {
      console.error('Error creating swap request:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!user) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-md">
        <div className="p-6">
          {/* Header */}
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold text-gray-900">
              Request Skill Swap with {targetUser.name}
            </h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X className="h-6 w-6" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Your Offered Skill */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Skill You Want to Offer *
              </label>
              <select
                value={selectedOfferedSkill}
                onChange={(e) => setSelectedOfferedSkill(e.target.value)}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              >
                <option value="">Select a skill you offer</option>
                {user.skillsOffered.map((skill, index) => (
                  <option key={index} value={skill}>
                    {skill}
                  </option>
                ))}
              </select>
            </div>

            {/* Skill You Want */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Skill You Want to Learn *
              </label>
              <select
                value={selectedWantedSkill}
                onChange={(e) => setSelectedWantedSkill(e.target.value)}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              >
                <option value="">Select a skill they offer</option>
                {targetUser.skillsOffered.map((skill, index) => (
                  <option key={index} value={skill}>
                    {skill}
                  </option>
                ))}
              </select>
            </div>

            {/* Message */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Message (Optional)
              </label>
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="Introduce yourself and explain why you'd like to swap skills..."
              />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting || !selectedOfferedSkill || !selectedWantedSkill}
              className="w-full bg-indigo-600 text-white py-2 px-4 rounded-lg font-medium hover:bg-indigo-700 focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center space-x-2"
            >
              <Send className="h-4 w-4" />
              <span>{isSubmitting ? 'Sending...' : 'Send Request'}</span>
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default SwapRequestModal;