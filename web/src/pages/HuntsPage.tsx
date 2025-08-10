import { useState } from 'react';
import { Plus, MapPin, Calendar, Trophy, MoreVertical, Edit, Trash2 } from 'lucide-react';

interface Hunt {
  id: string;
  title: string;
  description: string;
  status: 'DRAFT' | 'ACTIVE' | 'PAUSED' | 'COMPLETED';
  startAt: string;
  endAt: string;
  lootBoxCount: number;
  claimsCount: number;
  maxClaims: number;
}

const mockHunts: Hunt[] = [
  {
    id: '1',
    title: 'Demo Coffee Shop Hunt',
    description: 'Find hidden treasures around our coffee shop and unlock exclusive rewards!',
    status: 'ACTIVE',
    startAt: '2025-08-01',
    endAt: '2025-08-31',
    lootBoxCount: 3,
    claimsCount: 45,
    maxClaims: 1000,
  },
  {
    id: '2',
    title: 'Summer Special Hunt',
    description: 'Limited time summer promotion with amazing rewards.',
    status: 'DRAFT',
    startAt: '2025-08-15',
    endAt: '2025-09-15',
    lootBoxCount: 5,
    claimsCount: 0,
    maxClaims: 500,
  },
  {
    id: '3',
    title: 'Grand Opening Hunt',
    description: 'Celebrate our grand opening with this special treasure hunt!',
    status: 'COMPLETED',
    startAt: '2025-07-01',
    endAt: '2025-07-31',
    lootBoxCount: 2,
    claimsCount: 234,
    maxClaims: 250,
  },
];

const statusColors = {
  DRAFT: 'bg-gray-100 text-gray-800',
  ACTIVE: 'bg-green-100 text-green-800',
  PAUSED: 'bg-yellow-100 text-yellow-800',
  COMPLETED: 'bg-blue-100 text-blue-800',
};

export function HuntsPage() {
  const [hunts] = useState<Hunt[]>(mockHunts);
  const [showCreateModal, setShowCreateModal] = useState(false);

  return (
    <div className="py-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-semibold text-gray-900">Treasure Hunts</h1>
          <button
            onClick={() => setShowCreateModal(true)}
            className="btn-primary flex items-center"
          >
            <Plus className="h-4 w-4 mr-2" />
            Create Hunt
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 mt-8">
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2 xl:grid-cols-3">
          {hunts.map((hunt) => (
            <div key={hunt.id} className="card hover:shadow-md transition-shadow">
              <div className="flex justify-between items-start mb-4">
                <div className="flex-1">
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    {hunt.title}
                  </h3>
                  <span
                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      statusColors[hunt.status]
                    }`}
                  >
                    {hunt.status}
                  </span>
                </div>
                <div className="relative">
                  <button className="p-1 rounded-full hover:bg-gray-100">
                    <MoreVertical className="h-4 w-4 text-gray-400" />
                  </button>
                </div>
              </div>

              <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                {hunt.description}
              </p>

              <div className="space-y-3">
                <div className="flex items-center text-sm text-gray-500">
                  <Calendar className="h-4 w-4 mr-2" />
                  <span>
                    {new Date(hunt.startAt).toLocaleDateString()} -{' '}
                    {new Date(hunt.endAt).toLocaleDateString()}
                  </span>
                </div>

                <div className="flex items-center text-sm text-gray-500">
                  <MapPin className="h-4 w-4 mr-2" />
                  <span>{hunt.lootBoxCount} loot boxes</span>
                </div>

                <div className="flex items-center text-sm text-gray-500">
                  <Trophy className="h-4 w-4 mr-2" />
                  <span>
                    {hunt.claimsCount} / {hunt.maxClaims} claims
                  </span>
                </div>

                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-primary-600 h-2 rounded-full"
                    style={{
                      width: `${Math.min((hunt.claimsCount / hunt.maxClaims) * 100, 100)}%`,
                    }}
                  ></div>
                </div>
              </div>

              <div className="mt-6 flex space-x-2">
                <button className="flex-1 btn-secondary text-sm py-2">
                  <Edit className="h-4 w-4 mr-1" />
                  Edit
                </button>
                <button className="flex-1 btn-secondary text-sm py-2 text-red-600 hover:bg-red-50">
                  <Trash2 className="h-4 w-4 mr-1" />
                  Delete
                </button>
              </div>
            </div>
          ))}

          {/* Create Hunt Card */}
          <div
            onClick={() => setShowCreateModal(true)}
            className="card border-2 border-dashed border-gray-300 hover:border-primary-500 cursor-pointer transition-colors flex items-center justify-center min-h-[300px]"
          >
            <div className="text-center">
              <Plus className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Create New Hunt
              </h3>
              <p className="text-sm text-gray-500">
                Start a new treasure hunt for your customers
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Create Hunt Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                Create New Hunt
              </h3>
              <form className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Hunt Title
                  </label>
                  <input
                    type="text"
                    className="input"
                    placeholder="Enter hunt title"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Description
                  </label>
                  <textarea
                    className="input"
                    rows={3}
                    placeholder="Describe your hunt"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Start Date
                    </label>
                    <input type="date" className="input" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      End Date
                    </label>
                    <input type="date" className="input" />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Max Claims
                  </label>
                  <input
                    type="number"
                    className="input"
                    placeholder="1000"
                  />
                </div>
              </form>
              <div className="flex space-x-3 mt-6">
                <button
                  onClick={() => setShowCreateModal(false)}
                  className="flex-1 btn-secondary"
                >
                  Cancel
                </button>
                <button
                  onClick={() => setShowCreateModal(false)}
                  className="flex-1 btn-primary"
                >
                  Create Hunt
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
