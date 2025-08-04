import React from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  AreaChart,
  Area,
} from 'recharts';
import { TrendingUp, Users, MessageSquare, Star, Activity, Shield } from 'lucide-react';
import { useData } from '../../context/DataContext';

const AdminAnalytics: React.FC = () => {
  const { users, swapRequests, ratings } = useData();

  // Prepare data for admin charts
  const userGrowthData = [
    { month: 'Jan', users: 15, swaps: 8 },
    { month: 'Feb', users: 28, swaps: 15 },
    { month: 'Mar', users: 42, swaps: 23 },
    { month: 'Apr', users: 58, swaps: 34 },
    { month: 'May', users: 73, swaps: 45 },
    { month: 'Jun', users: users.length, swaps: swapRequests.filter(r => r.status === 'completed').length },
  ];

  const skillCategoriesData = [
    { category: 'Technology', count: 45, color: '#3B82F6' },
    { category: 'Design', count: 32, color: '#10B981' },
    { category: 'Business', count: 28, color: '#F59E0B' },
    { category: 'Languages', count: 22, color: '#EF4444' },
    { category: 'Arts', count: 18, color: '#8B5CF6' },
    { category: 'Others', count: 15, color: '#6B7280' },
  ];

  const swapStatusData = [
    { status: 'Completed', count: swapRequests.filter(r => r.status === 'completed').length, color: '#10B981' },
    { status: 'Accepted', count: swapRequests.filter(r => r.status === 'accepted').length, color: '#3B82F6' },
    { status: 'Pending', count: swapRequests.filter(r => r.status === 'pending').length, color: '#F59E0B' },
    { status: 'Rejected', count: swapRequests.filter(r => r.status === 'rejected').length, color: '#EF4444' },
  ];

  const ratingDistributionData = [
    { rating: '5 Stars', count: ratings.filter(r => r.rating === 5).length, color: '#10B981' },
    { rating: '4 Stars', count: ratings.filter(r => r.rating === 4).length, color: '#3B82F6' },
    { rating: '3 Stars', count: ratings.filter(r => r.rating === 3).length, color: '#F59E0B' },
    { rating: '2 Stars', count: ratings.filter(r => r.rating === 2).length, color: '#EF4444' },
    { rating: '1 Star', count: ratings.filter(r => r.rating === 1).length, color: '#DC2626' },
  ].filter(item => item.count > 0);

  const platformStats = {
    totalUsers: users.filter(u => !u.isAdmin).length,
    activeUsers: users.filter(u => !u.isBanned && !u.isAdmin).length,
    bannedUsers: users.filter(u => u.isBanned).length,
    totalSwaps: swapRequests.length,
    completedSwaps: swapRequests.filter(r => r.status === 'completed').length,
    averageRating: ratings.length > 0 ? (ratings.reduce((sum, r) => sum + r.rating, 0) / ratings.length) : 0,
  };

  return (
    <div className="space-y-8">
      <div>
        <h3 className="text-xl font-bold text-gray-900 mb-6">Platform Analytics</h3>
        
        {/* Admin Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl p-6 text-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-100 text-sm font-medium">Total Users</p>
                <p className="text-3xl font-bold">{platformStats.totalUsers}</p>
              </div>
              <Users className="h-8 w-8 text-blue-200" />
            </div>
            <div className="mt-4 flex items-center">
              <TrendingUp className="h-4 w-4 text-blue-200 mr-1" />
              <span className="text-blue-100 text-sm">+{platformStats.activeUsers} active</span>
            </div>
          </div>

          <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-xl p-6 text-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-green-100 text-sm font-medium">Total Swaps</p>
                <p className="text-3xl font-bold">{platformStats.totalSwaps}</p>
              </div>
              <MessageSquare className="h-8 w-8 text-green-200" />
            </div>
            <div className="mt-4 flex items-center">
              <span className="text-green-100 text-sm">{platformStats.completedSwaps} completed</span>
            </div>
          </div>

          <div className="bg-gradient-to-r from-purple-500 to-purple-600 rounded-xl p-6 text-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-purple-100 text-sm font-medium">Platform Rating</p>
                <p className="text-3xl font-bold">{platformStats.averageRating.toFixed(1)}</p>
              </div>
              <Star className="h-8 w-8 text-purple-200" />
            </div>
            <div className="mt-4 flex items-center">
              <span className="text-purple-100 text-sm">Based on {ratings.length} reviews</span>
            </div>
          </div>

          <div className="bg-gradient-to-r from-red-500 to-red-600 rounded-xl p-6 text-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-red-100 text-sm font-medium">Banned Users</p>
                <p className="text-3xl font-bold">{platformStats.bannedUsers}</p>
              </div>
              <Shield className="h-8 w-8 text-red-200" />
            </div>
            <div className="mt-4 flex items-center">
              <span className="text-red-100 text-sm">Moderation actions</span>
            </div>
          </div>
        </div>
      </div>

      {/* Admin Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Platform Growth Chart */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h4 className="text-lg font-semibold text-gray-900 mb-4">Platform Growth</h4>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={userGrowthData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="month" stroke="#6b7280" />
              <YAxis stroke="#6b7280" />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: '#fff', 
                  border: '1px solid #e5e7eb',
                  borderRadius: '8px',
                  boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                }}
              />
              <Line 
                type="monotone" 
                dataKey="users" 
                stroke="#3B82F6" 
                strokeWidth={3}
                dot={{ fill: '#3B82F6', strokeWidth: 2, r: 4 }}
                name="Total Users"
              />
              <Line 
                type="monotone" 
                dataKey="swaps" 
                stroke="#10B981" 
                strokeWidth={3}
                dot={{ fill: '#10B981', strokeWidth: 2, r: 4 }}
                name="Completed Swaps"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Skill Categories Distribution */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h4 className="text-lg font-semibold text-gray-900 mb-4">Skill Categories</h4>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={skillCategoriesData} layout="horizontal">
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis type="number" stroke="#6b7280" />
              <YAxis dataKey="category" type="category" stroke="#6b7280" width={80} />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: '#fff', 
                  border: '1px solid #e5e7eb',
                  borderRadius: '8px',
                  boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                }}
              />
              <Bar 
                dataKey="count" 
                fill="#8884d8"
                radius={[0, 4, 4, 0]}
                name="Skills Count"
              />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Swap Status Distribution */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h4 className="text-lg font-semibold text-gray-900 mb-4">Swap Status Distribution</h4>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={swapStatusData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={100}
                paddingAngle={5}
                dataKey="count"
              >
                {swapStatusData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
          <div className="mt-4 grid grid-cols-2 gap-4">
            {swapStatusData.map((item, index) => (
              <div key={index} className="flex items-center space-x-2">
                <div 
                  className="w-3 h-3 rounded-full" 
                  style={{ backgroundColor: item.color }}
                ></div>
                <span className="text-sm text-gray-600">
                  {item.status}: {item.count}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Rating Distribution */}
        {ratingDistributionData.length > 0 && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h4 className="text-lg font-semibold text-gray-900 mb-4">Platform Rating Distribution</h4>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={ratingDistributionData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ rating, count }) => `${count}`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="count"
                >
                  {ratingDistributionData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
            <div className="mt-4 grid grid-cols-3 gap-2">
              {ratingDistributionData.map((item, index) => (
                <div key={index} className="flex items-center space-x-2">
                  <div 
                    className="w-3 h-3 rounded-full" 
                    style={{ backgroundColor: item.color }}
                  ></div>
                  <span className="text-xs text-gray-600">
                    {item.rating}: {item.count}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Platform Health Metrics */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h4 className="text-lg font-semibold text-gray-900 mb-4">Platform Health Metrics</h4>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="text-center p-4 bg-blue-50 rounded-lg">
            <div className="text-2xl font-bold text-blue-600 mb-2">
              {((platformStats.completedSwaps / platformStats.totalSwaps) * 100 || 0).toFixed(1)}%
            </div>
            <div className="text-sm text-blue-800">Success Rate</div>
            <div className="text-xs text-blue-600 mt-1">Completed swaps</div>
          </div>
          
          <div className="text-center p-4 bg-green-50 rounded-lg">
            <div className="text-2xl font-bold text-green-600 mb-2">
              {((platformStats.activeUsers / platformStats.totalUsers) * 100 || 0).toFixed(1)}%
            </div>
            <div className="text-sm text-green-800">Active Users</div>
            <div className="text-xs text-green-600 mt-1">Non-banned users</div>
          </div>
          
          <div className="text-center p-4 bg-purple-50 rounded-lg">
            <div className="text-2xl font-bold text-purple-600 mb-2">
              {platformStats.totalUsers > 0 ? (ratings.length / platformStats.totalUsers).toFixed(1) : '0'}
            </div>
            <div className="text-sm text-purple-800">Reviews per User</div>
            <div className="text-xs text-purple-600 mt-1">Engagement metric</div>
          </div>
          
          <div className="text-center p-4 bg-orange-50 rounded-lg">
            <div className="text-2xl font-bold text-orange-600 mb-2">
              {((platformStats.bannedUsers / platformStats.totalUsers) * 100 || 0).toFixed(1)}%
            </div>
            <div className="text-sm text-orange-800">Moderation Rate</div>
            <div className="text-xs text-orange-600 mt-1">Banned users</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminAnalytics;