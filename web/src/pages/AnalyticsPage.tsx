import { TrendingUp, Users, MapPin, Trophy, DollarSign } from 'lucide-react';

// Mock data for charts - in production, this would come from your analytics API
const chartData = {
  dailyClaims: [
    { date: '2025-08-01', claims: 12 },
    { date: '2025-08-02', claims: 19 },
    { date: '2025-08-03', claims: 8 },
    { date: '2025-08-04', claims: 15 },
    { date: '2025-08-05', claims: 22 },
    { date: '2025-08-06', claims: 18 },
    { date: '2025-08-07', claims: 25 },
  ],
  topHunts: [
    { name: 'Demo Coffee Shop Hunt', claims: 45, revenue: '$1,250' },
    { name: 'Pizza Palace Hunt', claims: 32, revenue: '$890' },
    { name: 'Tech Bookstore Hunt', claims: 28, revenue: '$720' },
    { name: 'Fitness First Hunt', claims: 22, revenue: '$580' },
  ],
  userEngagement: [
    { metric: 'New Users', value: 89, change: '+12%' },
    { metric: 'Returning Users', value: 156, change: '+8%' },
    { metric: 'Avg. Session Time', value: '4m 32s', change: '+15%' },
    { metric: 'Claims per User', value: '2.3', change: '+5%' },
  ],
};

export function AnalyticsPage() {
  return (
    <div className="py-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-semibold text-gray-900">Analytics</h1>
          <div className="flex space-x-3">
            <select className="input text-sm">
              <option>Last 7 days</option>
              <option>Last 30 days</option>
              <option>Last 90 days</option>
            </select>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 mt-8">
        {/* Key Metrics */}
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 mb-8">
          <div className="card">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <Trophy className="h-6 w-6 text-primary-600" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    Total Claims
                  </dt>
                  <dd className="text-2xl font-semibold text-gray-900">127</dd>
                </dl>
              </div>
            </div>
          </div>

          <div className="card">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <Users className="h-6 w-6 text-green-600" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    Active Users
                  </dt>
                  <dd className="text-2xl font-semibold text-gray-900">245</dd>
                </dl>
              </div>
            </div>
          </div>

          <div className="card">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <MapPin className="h-6 w-6 text-blue-600" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    Active Hunts
                  </dt>
                  <dd className="text-2xl font-semibold text-gray-900">3</dd>
                </dl>
              </div>
            </div>
          </div>

          <div className="card">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <DollarSign className="h-6 w-6 text-yellow-600" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    Revenue
                  </dt>
                  <dd className="text-2xl font-semibold text-gray-900">$2,847</dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Claims Chart */}
          <div className="card">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-medium text-gray-900">Daily Claims</h2>
              <TrendingUp className="h-5 w-5 text-gray-400" />
            </div>
            
            {/* Simple bar chart representation */}
            <div className="space-y-3">
              {chartData.dailyClaims.map((day) => (
                <div key={day.date} className="flex items-center">
                  <div className="w-20 text-xs text-gray-500">
                    {new Date(day.date).toLocaleDateString('en-US', { 
                      month: 'short', 
                      day: 'numeric' 
                    })}
                  </div>
                  <div className="flex-1 ml-4">
                    <div className="bg-gray-200 rounded-full h-4 relative">
                      <div
                        className="bg-primary-600 h-4 rounded-full"
                        style={{ width: `${(day.claims / 25) * 100}%` }}
                      />
                      <span className="absolute right-2 top-0 text-xs text-gray-600 leading-4">
                        {day.claims}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Top Performing Hunts */}
          <div className="card">
            <h2 className="text-lg font-medium text-gray-900 mb-6">
              Top Performing Hunts
            </h2>
            <div className="space-y-4">
              {chartData.topHunts.map((hunt, index) => (
                <div key={hunt.name} className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center">
                        <span className="text-sm font-medium text-primary-600">
                          {index + 1}
                        </span>
                      </div>
                    </div>
                    <div className="ml-4">
                      <p className="text-sm font-medium text-gray-900">
                        {hunt.name}
                      </p>
                      <p className="text-sm text-gray-500">
                        {hunt.claims} claims
                      </p>
                    </div>
                  </div>
                  <div className="text-sm font-medium text-gray-900">
                    {hunt.revenue}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* User Engagement */}
          <div className="card">
            <h2 className="text-lg font-medium text-gray-900 mb-6">
              User Engagement
            </h2>
            <div className="grid grid-cols-2 gap-4">
              {chartData.userEngagement.map((metric) => (
                <div key={metric.metric} className="text-center">
                  <div className="text-2xl font-semibold text-gray-900">
                    {metric.value}
                  </div>
                  <div className="text-sm text-gray-500 mb-1">
                    {metric.metric}
                  </div>
                  <div className="text-xs text-green-600 font-medium">
                    {metric.change}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Recent Activity Summary */}
          <div className="card">
            <h2 className="text-lg font-medium text-gray-900 mb-6">
              Activity Summary
            </h2>
            <div className="space-y-4">
              <div className="flex items-center justify-between py-2 border-b border-gray-100">
                <span className="text-sm text-gray-600">Claims Today</span>
                <span className="text-sm font-medium text-gray-900">25</span>
              </div>
              <div className="flex items-center justify-between py-2 border-b border-gray-100">
                <span className="text-sm text-gray-600">New Users Today</span>
                <span className="text-sm font-medium text-gray-900">12</span>
              </div>
              <div className="flex items-center justify-between py-2 border-b border-gray-100">
                <span className="text-sm text-gray-600">Redemptions Today</span>
                <span className="text-sm font-medium text-gray-900">18</span>
              </div>
              <div className="flex items-center justify-between py-2">
                <span className="text-sm text-gray-600">Revenue Today</span>
                <span className="text-sm font-medium text-gray-900">$347</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
