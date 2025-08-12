import React, { useState } from 'react';
import { X, Send } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useData } from '../context/DataContext';

interface SwapRequestModalProps {
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
      await createSwapRequest({
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
    <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden">
        {/* Modal Header */}
        <div className="bg-indigo-600 px-6 py-4 flex justify-between items-center">
          <h2 className="text-lg font-semibold text-white">
            Skill Swap with {targetUser.name}
          </h2>
          <button
            onClick={onClose}
            className="text-white hover:text-gray-200 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          {/* Offered Skill */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Skill You Offer <span className="text-red-500">*</span>
            </label>
            <select
              value={selectedOfferedSkill}
              onChange={(e) => setSelectedOfferedSkill(e.target.value)}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="">Select a skill you offer</option>
              {user.skillsOffered.map((skill, index) => (
                <option key={index} value={skill}>
                  {skill}
                </option>
              ))}
            </select>
          </div>

          {/* Wanted Skill */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Skill You Want <span className="text-red-500">*</span>
            </label>
            <select
              value={selectedWantedSkill}
              onChange={(e) => setSelectedWantedSkill(e.target.value)}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="">Select a skill they offer</option>
              {targetUser.skillsOffered.map((skill, index) => (
                <option key={index} value={skill}>
                  {skill}
                </option>
              ))}
            </select>
          </div>

          {/* Optional Message */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Message <span className="text-gray-400">(Optional)</span>
            </label>
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              rows={4}
              placeholder="Introduce yourself or add context for the swap request..."
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none"
            />
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={isSubmitting || !selectedOfferedSkill || !selectedWantedSkill}
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2 px-4 rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
          >
            <Send className="w-4 h-4" />
            <span>{isSubmitting ? 'Sending...' : 'Send Request'}</span>
          </button>
        </form>
      </div>
    </div>
  );
};

export default SwapRequestModal;
