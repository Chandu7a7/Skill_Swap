import React, { useState } from 'react';
import { User, MessageSquare, Star, Settings, Shield, BarChart3 } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import ProfileTab from './ProfileTab';
import SwapRequestsTab from './SwapRequestsTab';
import RatingsTab from './RatingsTab';
import AnalyticsTab from './AnalyticsTab';
import AdminPanel from './AdminPanel';

const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('profile');

  if (!user) return null;

  const tabs = [
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'analytics', label: 'Analytics', icon: BarChart3 },
    { id: 'requests', label: 'Swap Requests', icon: MessageSquare },
    { id: 'ratings', label: 'Ratings', icon: Star },
    ...(user.isAdmin ? [{ id: 'admin', label: 'Admin Panel', icon: Shield }] : []),
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        {/* Tab Navigation */}
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8 px-6">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center space-x-2 py-4 px-1 border-b-2 font-medium text-sm ${
                    activeTab === tab.id
                      ? 'border-indigo-500 text-indigo-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <Icon className="h-5 w-5" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </nav>
        </div>

        {/* Tab Content */}
        <div className="p-6">
          {activeTab === 'profile' && <ProfileTab />}
          {activeTab === 'analytics' && <AnalyticsTab />}
          {activeTab === 'requests' && <SwapRequestsTab />}
          {activeTab === 'ratings' && <RatingsTab />}
          {activeTab === 'admin' && user.isAdmin && <AdminPanel />}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;