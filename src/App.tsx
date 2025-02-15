import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CountdownTimer } from './components/CountdownTimer';
import { ThemeToggle } from './components/ThemeToggle';
import { AuthForm } from './components/AuthForm';
import { Announcements } from './components/Announcements';
import { TeamManagement } from './components/TeamManagement';
import { ProjectSubmission } from './components/ProjectSubmission';
import { HackathonStats } from './components/HackathonStats';
import { ResourceHub } from './components/ResourceHub';
import { Workshops } from './components/Workshops';
import { useAuth } from './hooks/useAuth';
import { Rocket, Menu, X } from 'lucide-react';
import { cn } from './lib/utils';

function App() {
  const { user, loading, signOut } = useAuth();
  const endTime = new Date(Date.now() + 48 * 3600 * 1000);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="flex flex-col items-center gap-4"
        >
          <Rocket className="w-12 h-12 text-blue-600 dark:text-blue-400 animate-pulse" />
          <div className="text-gray-600 dark:text-gray-400">Loading Hackathon Hub...</div>
        </motion.div>
      </div>
    );
  }

  const sidebarLinks = [
    { title: 'Dashboard', component: 'dashboard' },
    { title: 'Teams', component: 'teams' },
    { title: 'Projects', component: 'projects' },
    { title: 'Announcements', component: 'announcements' },
    { title: 'Workshops', component: 'workshops' },
    { title: 'Resources', component: 'resources' },
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors">
      <ThemeToggle />
      
      {!user ? (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-md mx-auto pt-20 px-4"
        >
          <AuthForm />
        </motion.div>
      ) : (
        <div className="flex h-screen overflow-hidden">
          {/* Sidebar */}
          <AnimatePresence>
            {isSidebarOpen && (
              <motion.div
                initial={{ x: -300 }}
                animate={{ x: 0 }}
                exit={{ x: -300 }}
                className="fixed inset-0 z-50 lg:relative"
              >
                <div className="absolute inset-0 bg-black/50 lg:hidden" onClick={() => setIsSidebarOpen(false)} />
                <div className="relative w-64 h-full bg-white dark:bg-gray-800 shadow-xl">
                  <div className="p-4 flex items-center justify-between border-b border-gray-200 dark:border-gray-700">
                    <div className="flex items-center gap-2">
                      <Rocket className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                      <span className="font-bold text-gray-900 dark:text-white">Hackathon Hub</span>
                    </div>
                    <button
                      onClick={() => setIsSidebarOpen(false)}
                      className="lg:hidden p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>
                  <nav className="p-4 space-y-2">
                    {sidebarLinks.map((link) => (
                      <button
                        key={link.component}
                        className="w-full px-4 py-2 text-left rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                      >
                        {link.title}
                      </button>
                    ))}
                    <button
                      onClick={() => signOut()}
                      className="w-full px-4 py-2 text-left text-red-600 dark:text-red-400 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                    >
                      Sign Out
                    </button>
                  </nav>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Main Content */}
          <div className="flex-1 overflow-auto">
            <header className="sticky top-0 z-40 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
              <div className="container mx-auto px-4 h-16 flex items-center justify-between">
                <button
                  onClick={() => setIsSidebarOpen(true)}
                  className="lg:hidden p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
                >
                  <Menu className="w-5 h-5" />
                </button>
                <div className="flex items-center gap-4">
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    Welcome, {user.email}
                  </span>
                </div>
              </div>
            </header>

            <main className="container mx-auto px-4 py-8 space-y-8">
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="col-span-full lg:col-span-2"
                >
                  <CountdownTimer endTime={endTime} />
                </motion.div>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                >
                  <HackathonStats />
                </motion.div>
              </div>

              <div className="grid gap-6 lg:grid-cols-2">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                >
                  <Announcements />
                </motion.div>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                >
                  <TeamManagement />
                </motion.div>
              </div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
              >
                <ProjectSubmission />
              </motion.div>

              <div className="grid gap-6 lg:grid-cols-2">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                >
                  <Workshops />
                </motion.div>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6 }}
                >
                  <ResourceHub />
                </motion.div>
              </div>
            </main>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;