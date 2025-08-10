import { useState } from 'react';
import { Save, Building, CreditCard, Bell, Shield, User } from 'lucide-react';

export function SettingsPage() {
  const [activeTab, setActiveTab] = useState('business');

  const tabs = [
    { id: 'business', name: 'Business Info', icon: Building },
    { id: 'billing', name: 'Billing', icon: CreditCard },
    { id: 'notifications', name: 'Notifications', icon: Bell },
    { id: 'security', name: 'Security', icon: Shield },
    { id: 'profile', name: 'Profile', icon: User },
  ];

  return (
    <div className="py-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
        <h1 className="text-2xl font-semibold text-gray-900">Settings</h1>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 mt-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar */}
          <div className="lg:w-64">
            <nav className="space-y-1">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full flex items-center px-3 py-2 text-sm font-medium rounded-md ${
                    activeTab === tab.id
                      ? 'bg-primary-100 text-primary-700'
                      : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                  }`}
                >
                  <tab.icon className="mr-3 h-5 w-5" />
                  {tab.name}
                </button>
              ))}
            </nav>
          </div>

          {/* Content */}
          <div className="flex-1">
            {activeTab === 'business' && <BusinessSettings />}
            {activeTab === 'billing' && <BillingSettings />}
            {activeTab === 'notifications' && <NotificationSettings />}
            {activeTab === 'security' && <SecuritySettings />}
            {activeTab === 'profile' && <ProfileSettings />}
          </div>
        </div>
      </div>
    </div>
  );
}

function BusinessSettings() {
  return (
    <div className="card">
      <h2 className="text-lg font-medium text-gray-900 mb-6">Business Information</h2>
      <form className="space-y-6">
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Business Name
            </label>
            <input
              type="text"
              className="input"
              defaultValue="Demo Coffee Shop"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Phone Number
            </label>
            <input
              type="tel"
              className="input"
              defaultValue="+1 (555) 123-4567"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Description
          </label>
          <textarea
            className="input"
            rows={3}
            defaultValue="A cozy coffee shop in downtown San Francisco"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Website
          </label>
          <input
            type="url"
            className="input"
            defaultValue="https://democoffee.com"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Address
          </label>
          <input
            type="text"
            className="input"
            defaultValue="123 Market Street, San Francisco, CA 94105"
          />
        </div>

        <div className="flex justify-end">
          <button className="btn-primary flex items-center">
            <Save className="h-4 w-4 mr-2" />
            Save Changes
          </button>
        </div>
      </form>
    </div>
  );
}

function BillingSettings() {
  return (
    <div className="space-y-6">
      <div className="card">
        <h2 className="text-lg font-medium text-gray-900 mb-6">Current Plan</h2>
        <div className="bg-primary-50 border border-primary-200 rounded-lg p-4">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="text-lg font-medium text-primary-900">Starter Plan</h3>
              <p className="text-sm text-primary-700">Up to 1,000 claims per month</p>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-primary-900">$29</div>
              <div className="text-sm text-primary-700">per month</div>
            </div>
          </div>
        </div>
        <div className="mt-4">
          <button className="btn-secondary">Upgrade Plan</button>
        </div>
      </div>

      <div className="card">
        <h2 className="text-lg font-medium text-gray-900 mb-6">Payment Method</h2>
        <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
          <div className="flex items-center">
            <div className="w-8 h-5 bg-blue-600 rounded text-white text-xs flex items-center justify-center font-bold">
              VISA
            </div>
            <div className="ml-3">
              <div className="text-sm font-medium text-gray-900">•••• •••• •••• 4242</div>
              <div className="text-sm text-gray-500">Expires 12/25</div>
            </div>
          </div>
          <button className="btn-secondary text-sm">Update</button>
        </div>
      </div>

      <div className="card">
        <h2 className="text-lg font-medium text-gray-900 mb-6">Billing History</h2>
        <div className="space-y-3">
          {[
            { date: '2025-08-01', amount: '$29.00', status: 'Paid' },
            { date: '2025-07-01', amount: '$29.00', status: 'Paid' },
            { date: '2025-06-01', amount: '$29.00', status: 'Paid' },
          ].map((invoice, index) => (
            <div key={index} className="flex justify-between items-center py-2 border-b border-gray-100 last:border-b-0">
              <div>
                <div className="text-sm font-medium text-gray-900">{invoice.date}</div>
                <div className="text-sm text-gray-500">Monthly subscription</div>
              </div>
              <div className="text-right">
                <div className="text-sm font-medium text-gray-900">{invoice.amount}</div>
                <div className="text-sm text-green-600">{invoice.status}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function NotificationSettings() {
  return (
    <div className="card">
      <h2 className="text-lg font-medium text-gray-900 mb-6">Notification Preferences</h2>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-medium text-gray-900">New Claims</h3>
            <p className="text-sm text-gray-500">Get notified when users claim your loot boxes</p>
          </div>
          <input type="checkbox" className="h-4 w-4 text-primary-600" defaultChecked />
        </div>

        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-medium text-gray-900">Daily Summary</h3>
            <p className="text-sm text-gray-500">Receive daily activity summaries</p>
          </div>
          <input type="checkbox" className="h-4 w-4 text-primary-600" defaultChecked />
        </div>

        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-medium text-gray-900">Marketing Updates</h3>
            <p className="text-sm text-gray-500">Get updates about new features and promotions</p>
          </div>
          <input type="checkbox" className="h-4 w-4 text-primary-600" />
        </div>

        <div className="flex justify-end">
          <button className="btn-primary">Save Preferences</button>
        </div>
      </div>
    </div>
  );
}

function SecuritySettings() {
  return (
    <div className="space-y-6">
      <div className="card">
        <h2 className="text-lg font-medium text-gray-900 mb-6">Change Password</h2>
        <form className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Current Password
            </label>
            <input type="password" className="input" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              New Password
            </label>
            <input type="password" className="input" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Confirm New Password
            </label>
            <input type="password" className="input" />
          </div>
          <div className="flex justify-end">
            <button className="btn-primary">Update Password</button>
          </div>
        </form>
      </div>

      <div className="card">
        <h2 className="text-lg font-medium text-gray-900 mb-6">Two-Factor Authentication</h2>
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-medium text-gray-900">SMS Authentication</h3>
            <p className="text-sm text-gray-500">Add an extra layer of security to your account</p>
          </div>
          <button className="btn-secondary">Enable</button>
        </div>
      </div>
    </div>
  );
}

function ProfileSettings() {
  return (
    <div className="card">
      <h2 className="text-lg font-medium text-gray-900 mb-6">Profile Information</h2>
      <form className="space-y-6">
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              First Name
            </label>
            <input
              type="text"
              className="input"
              defaultValue="Demo"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Last Name
            </label>
            <input
              type="text"
              className="input"
              defaultValue="User"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Email Address
          </label>
          <input
            type="email"
            className="input"
            defaultValue="demo@business.com"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Time Zone
          </label>
          <select className="input">
            <option>Pacific Time (PT)</option>
            <option>Mountain Time (MT)</option>
            <option>Central Time (CT)</option>
            <option>Eastern Time (ET)</option>
          </select>
        </div>

        <div className="flex justify-end">
          <button className="btn-primary flex items-center">
            <Save className="h-4 w-4 mr-2" />
            Save Changes
          </button>
        </div>
      </form>
    </div>
  );
}
