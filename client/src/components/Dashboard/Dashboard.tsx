import React, { useState } from 'react';
import {
  User,
  MessageSquare,
  Star,
  Shield,
  BarChart3
} from 'lucide-react';
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
      <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
        
        {/* Header */}
        <div className="bg-gradient-to-r from-indigo-500 to-purple-500 p-6">
          <h1 className="text-2xl font-bold text-white">Welcome, {user.name}</h1>
          <p className="text-indigo-100 text-sm">Manage your profile, track analytics, and more</p>
        </div>

        {/* Tab Navigation */}
        <div className="border-b border-gray-200 bg-gray-50">
          <nav className="flex overflow-x-auto no-scrollbar">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center space-x-2 px-6 py-4 font-medium text-sm transition-all duration-300 ${
                    isActive
                      ? 'text-indigo-600 border-b-4 border-indigo-500 bg-white shadow-sm'
                      : 'text-gray-500 hover:text-indigo-500 hover:bg-indigo-50'
                  }`}
                >
                  <Icon className={`h-5 w-5 ${isActive ? 'text-indigo-500' : ''}`} />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </nav>
        </div>

        {/* Tab Content */}
        <div className="p-6 bg-white">
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
