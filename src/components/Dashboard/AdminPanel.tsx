import React, { useState } from 'react';
import { Users, MessageSquare, Ban, Download, Send, AlertTriangle, BarChart3 } from 'lucide-react';
import { useData } from '../../context/DataContext';
import AdminAnalytics from './AdminAnalytics';

const AdminPanel: React.FC = () => {
  const { users, swapRequests, ratings, banUser, addAdminMessage } = useData();
  const [activeTab, setActiveTab] = useState('users');
  const [messageForm, setMessageForm] = useState({
    title: '',
    content: '',
    type: 'info' as 'info' | 'warning' | 'update',
  });

  const activeUsers = users.filter(u => !u.isBanned && !u.isAdmin);
  const bannedUsers = users.filter(u => u.isBanned);
  const pendingSwaps = swapRequests.filter(req => req.status === 'pending');
  const completedSwaps = swapRequests.filter(req => req.status === 'completed');

  const handleBanUser = (userId: string) => {
    if (window.confirm('Are you sure you want to ban this user?')) {
      banUser(userId);
    }
  };

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!messageForm.title.trim() || !messageForm.content.trim()) return;

    addAdminMessage({
      title: messageForm.title,
      content: messageForm.content,
      type: messageForm.type,
    });

    setMessageForm({ title: '', content: '', type: 'info' });
    alert('Message sent to all users!');
  };

  const downloadReport = (type: string) => {
    let data = '';
    let filename = '';

    switch (type) {
      case 'users':
        data = JSON.stringify(users, null, 2);
        filename = 'users-report.json';
        break;
      case 'swaps':
        data = JSON.stringify(swapRequests, null, 2);
        filename = 'swaps-report.json';
        break;
      case 'ratings':
        data = JSON.stringify(ratings, null, 2);
        filename = 'ratings-report.json';
        break;
    }

    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
  };

  const tabs = [
    { id: 'analytics', label: 'Analytics', icon: BarChart3 },
    { id: 'users', label: 'User Management', icon: Users },
    { id: 'swaps', label: 'Swap Monitoring', icon: MessageSquare },
    { id: 'messages', label: 'Platform Messages', icon: Send },
    { id: 'reports', label: 'Reports', icon: Download },
  ];

  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Admin Panel</h2>

      {/* Tab Navigation */}
      <div className="border-b border-gray-200 mb-6">
        <nav className="flex space-x-8">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center space-x-2 py-2 px-1 border-b-2 font-medium text-sm ${
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
      {activeTab === 'analytics' && <AdminAnalytics />}
      
      {activeTab === 'users' && (
        <div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-blue-50 p-6 rounded-lg">
              <h3 className="text-lg font-semibold text-blue-900">Active Users</h3>
              <p className="text-3xl font-bold text-blue-600">{activeUsers.length}</p>
            </div>
            <div className="bg-red-50 p-6 rounded-lg">
              <h3 className="text-lg font-semibold text-red-900">Banned Users</h3>
              <p className="text-3xl font-bold text-red-600">{bannedUsers.length}</p>
            </div>
            <div className="bg-green-50 p-6 rounded-lg">
              <h3 className="text-lg font-semibold text-green-900">Total Users</h3>
              <p className="text-3xl font-bold text-green-600">{users.length - 1}</p>
            </div>
          </div>

          <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">User List</h3>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      User
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Email
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Rating
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {users.filter(u => !u.isAdmin).map((user) => (
                    <tr key={user.id}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="w-10 h-10 rounded-full flex items-center justify-center overflow-hidden">
                            {user.profilePhoto ? (
                              <img
                                src={user.profilePhoto}
                                alt={user.name}
                                className="w-10 h-10 rounded-full object-cover"
                              />
                            ) : (
                              <div className="w-10 h-10 bg-indigo-100 rounded-full flex items-center justify-center">
                                <span className="text-indigo-600 font-medium">
                                  {user.name.charAt(0)}
                                </span>
                              </div>
                            )}
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">{user.name}</div>
                            <div className="text-sm text-gray-500">{user.location}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {user.email}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {user.totalRatings > 0 ? `${user.rating.toFixed(1)} (${user.totalRatings})` : 'No ratings'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                          user.isBanned 
                            ? 'bg-red-100 text-red-800' 
                            : 'bg-green-100 text-green-800'
                        }`}>
                          {user.isBanned ? 'Banned' : 'Active'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        {!user.isBanned && (
                          <button
                            onClick={() => handleBanUser(user.id)}
                            className="text-red-600 hover:text-red-900 flex items-center space-x-1"
                          >
                            <Ban className="h-4 w-4" />
                            <span>Ban</span>
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'swaps' && (
        <div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-yellow-50 p-6 rounded-lg">
              <h3 className="text-lg font-semibold text-yellow-900">Pending Swaps</h3>
              <p className="text-3xl font-bold text-yellow-600">{pendingSwaps.length}</p>
            </div>
            <div className="bg-green-50 p-6 rounded-lg">
              <h3 className="text-lg font-semibold text-green-900">Completed Swaps</h3>
              <p className="text-3xl font-bold text-green-600">{completedSwaps.length}</p>
            </div>
            <div className="bg-blue-50 p-6 rounded-lg">
              <h3 className="text-lg font-semibold text-blue-900">Total Swaps</h3>
              <p className="text-3xl font-bold text-blue-600">{swapRequests.length}</p>
            </div>
          </div>

          <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">Recent Swap Requests</h3>
            </div>
            <div className="divide-y divide-gray-200">
              {swapRequests.slice(0, 10).map((request) => {
                const fromUser = users.find(u => u.id === request.fromUserId);
                const toUser = users.find(u => u.id === request.toUserId);
                return (
                  <div key={request.id} className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-900">
                          {fromUser?.name} → {toUser?.name}
                        </p>
                        <p className="text-sm text-gray-500">
                          {request.offeredSkill} ↔ {request.wantedSkill}
                        </p>
                        <p className="text-xs text-gray-400">
                          {new Date(request.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                        request.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                        request.status === 'accepted' ? 'bg-green-100 text-green-800' :
                        request.status === 'rejected' ? 'bg-red-100 text-red-800' :
                        'bg-purple-100 text-purple-800'
                      }`}>
                        {request.status.charAt(0).toUpperCase() + request.status.slice(1)}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {activeTab === 'messages' && (
        <div>
          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Send Platform Message</h3>
            <form onSubmit={handleSendMessage} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Message Title *
                </label>
                <input
                  type="text"
                  value={messageForm.title}
                  onChange={(e) => setMessageForm(prev => ({ ...prev, title: e.target.value }))}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="e.g., Platform Maintenance, New Feature Update"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Message Type *
                </label>
                <select
                  value={messageForm.type}
                  onChange={(e) => setMessageForm(prev => ({ ...prev, type: e.target.value as any }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                >
                  <option value="info">Information</option>
                  <option value="warning">Warning</option>
                  <option value="update">Update</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Message Content *
                </label>
                <textarea
                  value={messageForm.content}
                  onChange={(e) => setMessageForm(prev => ({ ...prev, content: e.target.value }))}
                  required
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="Enter your message content..."
                />
              </div>

              <button
                type="submit"
                className="flex items-center space-x-2 bg-indigo-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-indigo-700 transition-colors"
              >
                <Send className="h-4 w-4" />
                <span>Send Message</span>
              </button>
            </form>
          </div>
        </div>
      )}

      {activeTab === 'reports' && (
        <div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white border border-gray-200 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">User Report</h3>
              <p className="text-gray-600 mb-4">Download complete user data including profiles and activity.</p>
              <button
                onClick={() => downloadReport('users')}
                className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors"
              >
                <Download className="h-4 w-4" />
                <span>Download</span>
              </button>
            </div>

            <div className="bg-white border border-gray-200 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Swap Report</h3>
              <p className="text-gray-600 mb-4">Download all swap requests and their current status.</p>
              <button
                onClick={() => downloadReport('swaps')}
                className="flex items-center space-x-2 bg-green-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-green-700 transition-colors"
              >
                <Download className="h-4 w-4" />
                <span>Download</span>
              </button>
            </div>

            <div className="bg-white border border-gray-200 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Ratings Report</h3>
              <p className="text-gray-600 mb-4">Download all ratings and feedback data.</p>
              <button
                onClick={() => downloadReport('ratings')}
                className="flex items-center space-x-2 bg-purple-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-purple-700 transition-colors"
              >
                <Download className="h-4 w-4" />
                <span>Download</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminPanel;