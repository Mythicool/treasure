
import { useEffect, useState } from 'react';
import { Trophy, Users, MapPin, DollarSign, TrendingUp, Clock } from 'lucide-react';

const stats = [
  {
    name: 'Total Claims',
    value: '127',
    change: '+12%',
    changeType: 'increase',
    icon: Trophy,
    tint: 'from-amber-400 to-amber-600',
    spark: [12, 14, 15, 13, 18, 20, 22],
  },
  {
    name: 'Active Users',
    value: '89',
    change: '+8%',
    changeType: 'increase',
    icon: Users,
    tint: 'from-indigo-400 to-indigo-600',
    spark: [5, 7, 8, 6, 9, 8, 10],
  },
  {
    name: 'Active Hunts',
    value: '3',
    change: '0%',
    changeType: 'neutral',
    icon: MapPin,
    tint: 'from-emerald-400 to-emerald-600',
    spark: [2, 3, 3, 3, 3, 3, 3],
  },
  {
    name: 'Revenue',
    value: '$2,847',
    change: '+23%',
    changeType: 'increase',
    icon: DollarSign,
    tint: 'from-purple-400 to-purple-600',
    spark: [200, 240, 180, 260, 280, 300, 320],
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
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 600);
    return () => clearTimeout(timer);
  }, []);

export function DashboardPage() {
  return (
      {isLoading && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 animate-pulse">
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 mt-8">
            {[1,2,3,4].map((i) => (
              <div key={i} className="card">
                <div className="h-6 w-1/3 bg-gray-200 rounded mb-4" />
                <div className="h-8 w-1/2 bg-gray-200 rounded" />
              </div>
            ))}
          </div>
        </div>
      )}
    <div className="py-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
        <h1 className="text-2xl font-semibold text-gray-900">Dashboard</h1>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
        {/* Stats */}
        <div className="mt-8">
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {stats.map((stat) => (
              <div key={stat.name} className="card transition-transform duration-200 hover:scale-[1.02]">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <div className={`h-10 w-10 rounded-xl bg-gradient-to-br ${stat.tint} flex items-center justify-center shadow-soft`}>
                        <stat.icon className="h-5 w-5 text-white" />
                      </div>
                    </div>
                    <div className="ml-4 w-0 flex-1">
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
                                ? 'text-emerald-600'
                                : stat.changeType === 'decrease'
                                ? 'text-red-600'
                                : 'text-gray-500'
                            }`}
                          >
                            {stat.changeType === 'increase' && (
                              <TrendingUp className="self-center flex-shrink-0 h-4 w-4" />
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

                  {/* Mini inline bar chart */}
                  <div className="ml-4 hidden sm:block">
                    <svg width="80" height="28" viewBox="0 0 80 28" aria-hidden="true">
                      {stat.spark?.map((v, i) => {
                        const max = Math.max(...stat.spark!);
                        const h = Math.max(2, Math.round((v / (max || 1)) * 24));
                        const x = i * 12;
                        const y = 24 - h;
                        return (
                          <rect key={i} x={x} y={y} width="8" height={h} rx="2" className="fill-gray-200" />
                        );
                      })}
                    </svg>
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
              {recentActivity.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-12 text-center">
                  <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center mb-3">
                    <Clock className="h-6 w-6 text-gray-400" />
                  </div>
                  <p className="text-gray-700 font-medium">No recent activity</p>
                  <p className="text-sm text-gray-500">Once players start claiming treasures, you'll see updates here.</p>
                </div>
              ) : (
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
              )}
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
