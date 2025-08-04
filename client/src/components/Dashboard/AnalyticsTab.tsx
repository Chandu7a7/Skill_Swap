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
  Area,
  AreaChart,
} from 'recharts';
import { TrendingUp, Users, MessageSquare, Star, Calendar } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useData } from '../../context/DataContext';

const AnalyticsTab: React.FC = () => {
  const { user } = useAuth();
  const { users, swapRequests, ratings } = useData();

  if (!user) return null;

  // Prepare data for charts
  const skillsData = user.skillsOffered.map((skill, index) => ({
    name: skill,
    requests: Math.floor(Math.random() * 10) + 1, // Mock data
    color: `hsl(${(index * 137.5) % 360}, 70%, 50%)`,
  }));

  const monthlyActivity = [
    { month: 'Jan', swaps: 2, requests: 5 },
    { month: 'Feb', swaps: 4, requests: 8 },
    { month: 'Mar', swaps: 3, requests: 6 },
    { month: 'Apr', swaps: 6, requests: 12 },
    { month: 'May', swaps: 5, requests: 9 },
    { month: 'Jun', swaps: 8, requests: 15 },
  ];

  const ratingDistribution = [
    { rating: '5 Stars', count: ratings.filter(r => r.toUserId === user.id && r.rating === 5).length, color: '#10B981' },
    { rating: '4 Stars', count: ratings.filter(r => r.toUserId === user.id && r.rating === 4).length, color: '#3B82F6' },
    { rating: '3 Stars', count: ratings.filter(r => r.toUserId === user.id && r.rating === 3).length, color: '#F59E0B' },
    { rating: '2 Stars', count: ratings.filter(r => r.toUserId === user.id && r.rating === 2).length, color: '#EF4444' },
    { rating: '1 Star', count: ratings.filter(r => r.toUserId === user.id && r.rating === 1).length, color: '#DC2626' },
  ].filter(item => item.count > 0);

  const swapStatusData = [
    { status: 'Completed', count: swapRequests.filter(r => (r.fromUserId === user.id || r.toUserId === user.id) && r.status === 'completed').length, color: '#10B981' },
    { status: 'Accepted', count: swapRequests.filter(r => (r.fromUserId === user.id || r.toUserId === user.id) && r.status === 'accepted').length, color: '#3B82F6' },
    { status: 'Pending', count: swapRequests.filter(r => (r.fromUserId === user.id || r.toUserId === user.id) && r.status === 'pending').length, color: '#F59E0B' },
    { status: 'Rejected', count: swapRequests.filter(r => (r.fromUserId === user.id || r.toUserId === user.id) && r.status === 'rejected').length, color: '#EF4444' },
  ].filter(item => item.count > 0);

  const userStats = {
    totalSwaps: swapRequests.filter(r => (r.fromUserId === user.id || r.toUserId === user.id) && r.status === 'completed').length,
    pendingRequests: swapRequests.filter(r => (r.fromUserId === user.id || r.toUserId === user.id) && r.status === 'pending').length,
    averageRating: user.rating,
    totalRatings: user.totalRatings,
  };

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Analytics Dashboard</h2>
        
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl p-6 text-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-100 text-sm font-medium">Total Swaps</p>
                <p className="text-3xl font-bold">{userStats.totalSwaps}</p>
              </div>
              <MessageSquare className="h-8 w-8 text-blue-200" />
            </div>
            <div className="mt-4 flex items-center">
              <TrendingUp className="h-4 w-4 text-blue-200 mr-1" />
              <span className="text-blue-100 text-sm">+12% from last month</span>
            </div>
          </div>

          <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-xl p-6 text-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-green-100 text-sm font-medium">Average Rating</p>
                <p className="text-3xl font-bold">{userStats.averageRating.toFixed(1)}</p>
              </div>
              <Star className="h-8 w-8 text-green-200" />
            </div>
            <div className="mt-4 flex items-center">
              <span className="text-green-100 text-sm">Based on {userStats.totalRatings} reviews</span>
            </div>
          </div>

          <div className="bg-gradient-to-r from-purple-500 to-purple-600 rounded-xl p-6 text-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-purple-100 text-sm font-medium">Pending Requests</p>
                <p className="text-3xl font-bold">{userStats.pendingRequests}</p>
              </div>
              <Calendar className="h-8 w-8 text-purple-200" />
            </div>
            <div className="mt-4 flex items-center">
              <span className="text-purple-100 text-sm">Awaiting response</span>
            </div>
          </div>

          <div className="bg-gradient-to-r from-orange-500 to-orange-600 rounded-xl p-6 text-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-orange-100 text-sm font-medium">Skills Offered</p>
                <p className="text-3xl font-bold">{user.skillsOffered.length}</p>
              </div>
              <Users className="h-8 w-8 text-orange-200" />
            </div>
            <div className="mt-4 flex items-center">
              <span className="text-orange-100 text-sm">Active skills</span>
            </div>
          </div>
        </div>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Monthly Activity Chart */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Monthly Activity</h3>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={monthlyActivity}>
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
              <Area 
                type="monotone" 
                dataKey="swaps" 
                stackId="1" 
                stroke="#3B82F6" 
                fill="#3B82F6" 
                fillOpacity={0.6}
                name="Completed Swaps"
              />
              <Area 
                type="monotone" 
                dataKey="requests" 
                stackId="1" 
                stroke="#10B981" 
                fill="#10B981" 
                fillOpacity={0.6}
                name="Requests Sent"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Skills Popularity Chart */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Skills Popularity</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={skillsData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis 
                dataKey="name" 
                stroke="#6b7280"
                angle={-45}
                textAnchor="end"
                height={80}
              />
              <YAxis stroke="#6b7280" />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: '#fff', 
                  border: '1px solid #e5e7eb',
                  borderRadius: '8px',
                  boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                }}
              />
              <Bar 
                dataKey="requests" 
                fill="#8884d8"
                radius={[4, 4, 0, 0]}
                name="Requests Received"
              />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Rating Distribution */}
        {ratingDistribution.length > 0 && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Rating Distribution</h3>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={ratingDistribution}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ rating, count }) => `${rating}: ${count}`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="count"
                >
                  {ratingDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        )}

        {/* Swap Status Distribution */}
        {swapStatusData.length > 0 && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Swap Status Overview</h3>
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
        )}
      </div>

      {/* Performance Insights */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Performance Insights</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center p-4 bg-blue-50 rounded-lg">
            <div className="text-2xl font-bold text-blue-600 mb-2">
              {((userStats.totalSwaps / (userStats.totalSwaps + userStats.pendingRequests)) * 100 || 0).toFixed(1)}%
            </div>
            <div className="text-sm text-blue-800">Success Rate</div>
            <div className="text-xs text-blue-600 mt-1">Completed vs Total Requests</div>
          </div>
          
          <div className="text-center p-4 bg-green-50 rounded-lg">
            <div className="text-2xl font-bold text-green-600 mb-2">
              {user.skillsOffered.length > 0 ? (userStats.totalSwaps / user.skillsOffered.length).toFixed(1) : '0'}
            </div>
            <div className="text-sm text-green-800">Swaps per Skill</div>
            <div className="text-xs text-green-600 mt-1">Average utilization</div>
          </div>
          
          <div className="text-center p-4 bg-purple-50 rounded-lg">
            <div className="text-2xl font-bold text-purple-600 mb-2">
              {userStats.totalRatings > 0 ? (ratings.filter(r => r.fromUserId === user.id).length / userStats.totalRatings * 100).toFixed(1) : '0'}%
            </div>
            <div className="text-sm text-purple-800">Feedback Rate</div>
            <div className="text-xs text-purple-600 mt-1">Reviews given vs received</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnalyticsTab;