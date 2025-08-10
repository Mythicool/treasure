
import { Trophy, Users, MapPin, DollarSign, TrendingUp, Clock } from 'lucide-react';

const stats = [
  {
    name: 'Total Claims',
    value: '127',
    change: '+12%',
    changeType: 'increase',
    icon: Trophy,
  },
  {
    name: 'Active Users',
    value: '89',
    change: '+8%',
    changeType: 'increase',
    icon: Users,
  },
  {
    name: 'Active Hunts',
    value: '3',
    change: '0%',
    changeType: 'neutral',
    icon: MapPin,
  },
  {
    name: 'Revenue',
    value: '$2,847',
    change: '+23%',
    changeType: 'increase',
    icon: DollarSign,
  },
];

const recentActivity = [
  {
    id: 1,
    user: 'Alice Johnson',
    action: 'claimed "Welcome Bonus"',
    time: '2 minutes ago',
    hunt: 'Demo Coffee Shop Hunt',
  },
  {
    id: 2,
    user: 'Bob Smith',
    action: 'redeemed "Free Item"',
    time: '15 minutes ago',
    hunt: 'Demo Coffee Shop Hunt',
  },
  {
    id: 3,
    user: 'Carol Davis',
    action: 'claimed "Special Discount"',
    time: '1 hour ago',
    hunt: 'Pizza Palace Hunt',
  },
  {
    id: 4,
    user: 'David Wilson',
    action: 'claimed "Welcome Bonus"',
    time: '2 hours ago',
    hunt: 'Demo Coffee Shop Hunt',
  },
];

export function DashboardPage() {
  return (
    <div className="py-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
        <h1 className="text-2xl font-semibold text-gray-900">Dashboard</h1>
      </div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
        {/* Stats */}
        <div className="mt-8">
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {stats.map((stat) => (
              <div key={stat.name} className="card">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <stat.icon className="h-6 w-6 text-gray-400" />
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 truncate">
                        {stat.name}
                      </dt>
                      <dd className="flex items-baseline">
                        <div className="text-2xl font-semibold text-gray-900">
                          {stat.value}
                        </div>
                        <div
                          className={`ml-2 flex items-baseline text-sm font-semibold ${
                            stat.changeType === 'increase'
                              ? 'text-green-600'
                              : stat.changeType === 'decrease'
                              ? 'text-red-600'
                              : 'text-gray-500'
                          }`}
                        >
                          {stat.changeType === 'increase' && (
                            <TrendingUp className="self-center flex-shrink-0 h-4 w-4 text-green-500" />
                          )}
                          <span className="sr-only">
                            {stat.changeType === 'increase' ? 'Increased' : 'Decreased'} by
                          </span>
                          {stat.change}
                        </div>
                      </dd>
                    </dl>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Activity */}
        <div className="mt-8">
          <div className="card">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-medium text-gray-900">Recent Activity</h2>
              <Clock className="h-5 w-5 text-gray-400" />
            </div>
            
            <div className="flow-root">
              <ul className="-mb-8">
                {recentActivity.map((activity, activityIdx) => (
                  <li key={activity.id}>
                    <div className="relative pb-8">
                      {activityIdx !== recentActivity.length - 1 ? (
                        <span
                          className="absolute top-4 left-4 -ml-px h-full w-0.5 bg-gray-200"
                          aria-hidden="true"
                        />
                      ) : null}
                      <div className="relative flex space-x-3">
                        <div>
                          <span className="h-8 w-8 rounded-full bg-primary-500 flex items-center justify-center ring-8 ring-white">
                            <Trophy className="h-4 w-4 text-white" />
                          </span>
                        </div>
                        <div className="min-w-0 flex-1 pt-1.5 flex justify-between space-x-4">
                          <div>
                            <p className="text-sm text-gray-500">
                              <span className="font-medium text-gray-900">{activity.user}</span>{' '}
                              {activity.action}
                            </p>
                            <p className="text-xs text-gray-400">{activity.hunt}</p>
                          </div>
                          <div className="text-right text-sm whitespace-nowrap text-gray-500">
                            {activity.time}
                          </div>
                        </div>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="mt-8">
          <div className="card">
            <h2 className="text-lg font-medium text-gray-900 mb-6">Quick Actions</h2>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              <button className="btn-primary text-left p-4 h-auto">
                <div className="flex items-center">
                  <MapPin className="h-5 w-5 mr-3" />
                  <span>Create New Hunt</span>
                </div>
              </button>
              <button className="btn-secondary text-left p-4 h-auto">
                <div className="flex items-center">
                  <Trophy className="h-5 w-5 mr-3" />
                  <span>Add Loot Box</span>
                </div>
              </button>
              <button className="btn-secondary text-left p-4 h-auto">
                <div className="flex items-center">
                  <TrendingUp className="h-5 w-5 mr-3" />
                  <span>View Analytics</span>
                </div>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
