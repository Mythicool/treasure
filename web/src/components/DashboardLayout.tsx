import { useState } from 'react';
import type { ReactNode } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  BarChart3, 
  Map, 
  Settings, 
  LogOut, 
  Menu, 
  X,
  Home,
  Trophy
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

interface DashboardLayoutProps {
  children: ReactNode;
}

const navigation = [
  { name: 'Dashboard', href: '/', icon: Home },
  { name: 'Hunts', href: '/hunts', icon: Trophy },
  { name: 'Analytics', href: '/analytics', icon: BarChart3 },
  { name: 'Settings', href: '/settings', icon: Settings },
];

export function DashboardLayout({ children }: DashboardLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { user, logout } = useAuth();
  const location = useLocation();

  return (
    <div className="h-screen flex overflow-hidden bg-gray-100">
      {/* Mobile sidebar */}
      <div className={`fixed inset-0 flex z-40 md:hidden ${sidebarOpen ? '' : 'hidden'}`}>
        <div className="fixed inset-0 bg-gray-600 bg-opacity-75" onClick={() => setSidebarOpen(false)} />
        <div className="relative flex-1 flex flex-col max-w-xs w-full bg-white">
          <div className="absolute top-0 right-0 -mr-12 pt-2">
            <button
              className="ml-1 flex items-center justify-center h-10 w-10 rounded-full focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
              onClick={() => setSidebarOpen(false)}
            >
              <X className="h-6 w-6 text-white" />
            </button>
          </div>
          <SidebarContent navigation={navigation} currentPath={location.pathname} />
        </div>
      </div>

      {/* Desktop sidebar */}
      <div className="hidden md:flex md:flex-shrink-0">
        <div className="flex flex-col w-64">
          <SidebarContent navigation={navigation} currentPath={location.pathname} />
        </div>
      </div>

      {/* Main content */}
      <div className="flex flex-col w-0 flex-1 overflow-hidden">
        {/* Top bar */}
        <div className="relative z-10 flex-shrink-0 flex h-16 bg-white shadow">
          <button
            className="px-4 border-r border-gray-200 text-gray-500 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary-500 md:hidden"
            onClick={() => setSidebarOpen(true)}
          >
            <Menu className="h-6 w-6" />
          </button>
          
          <div className="flex-1 px-4 flex justify-between">
            <div className="flex-1 flex">
              <div className="w-full flex md:ml-0">
                <div className="relative w-full text-gray-400 focus-within:text-gray-600">
                  <div className="flex items-center h-16">
                    <h1 className="text-xl font-semibold text-gray-900">
                      Local Treasure Hunts
                    </h1>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="ml-4 flex items-center md:ml-6">
              <div className="relative">
                <div className="flex items-center space-x-4">
                  <span className="text-sm text-gray-700">{user?.displayName}</span>
                  <button
                    onClick={logout}
                    className="bg-white p-1 rounded-full text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                  >
                    <LogOut className="h-5 w-5" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Page content */}
        <main className="flex-1 relative overflow-y-auto focus:outline-none">
          {children}
        </main>
      </div>
    </div>
  );
}

function SidebarContent({ navigation, currentPath }: { navigation: any[], currentPath: string }) {
  const { user, logout } = useAuth();

  return (
    <div className="flex flex-col h-full bg-gradient-to-b from-indigo-900 via-indigo-800 to-indigo-900 text-white">
      {/* Logo Section */}
      <div className="flex items-center flex-shrink-0 px-6 py-6 border-b border-indigo-700/50">
        <div className="w-10 h-10 bg-gradient-to-br from-amber-400 to-amber-600 rounded-xl flex items-center justify-center shadow-lg">
          <Trophy className="h-6 w-6 text-white" />
        </div>
        <div className="ml-3">
          <h1 className="text-lg font-bold text-white">Treasure Hunts</h1>
          <p className="text-xs text-indigo-300">Business Portal</p>
        </div>
      </div>

      {/* Navigation */}
      <div className="flex-1 px-4 py-6">
        <nav className="space-y-2">
          {navigation.map((item) => {
            const isActive = currentPath === item.href;
            return (
              <Link
                key={item.name}
                to={item.href}
                className={`group flex items-center px-4 py-3 text-sm font-medium rounded-xl transition-all duration-200 ${
                  isActive
                    ? 'bg-white/10 text-white shadow-lg backdrop-blur-sm border border-white/20'
                    : 'text-indigo-200 hover:bg-white/5 hover:text-white'
                }`}
              >
                <item.icon
                  className={`mr-4 h-5 w-5 ${
                    isActive ? 'text-amber-400' : 'text-indigo-300 group-hover:text-indigo-200'
                  }`}
                />
                {item.name}
                {isActive && (
                  <div className="ml-auto w-2 h-2 bg-amber-400 rounded-full"></div>
                )}
              </Link>
            );
          })}
        </nav>
      </div>

      {/* User Profile */}
      <div className="flex-shrink-0 px-4 py-4 border-t border-indigo-700/50">
        <div className="flex items-center space-x-3 p-3 rounded-xl bg-white/5 backdrop-blur-sm">
          <div className="w-10 h-10 bg-gradient-to-br from-amber-400 to-amber-600 rounded-full flex items-center justify-center">
            <span className="text-white font-semibold text-sm">
              {user?.email?.charAt(0).toUpperCase()}
            </span>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-white truncate">{user?.email}</p>
            <p className="text-xs text-indigo-300">Business Owner</p>
          </div>
          <button
            onClick={logout}
            className="p-2 text-indigo-300 hover:text-white rounded-lg hover:bg-white/10 transition-colors"
            title="Sign out"
          >
            <LogOut className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
