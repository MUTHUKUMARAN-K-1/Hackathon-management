import React from 'react';
import { motion } from 'framer-motion';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { Trophy, Users, GitPullRequest, Coffee } from 'lucide-react';
import { cn } from '../lib/utils';

const mockData = [
  { time: '00:00', commits: 12 },
  { time: '04:00', commits: 19 },
  { time: '08:00', commits: 3 },
  { time: '12:00', commits: 5 },
  { time: '16:00', commits: 2 },
  { time: '20:00', commits: 21 },
  { time: '24:00', commits: 25 },
];

const stats = [
  { icon: Users, label: 'Participants', value: '156' },
  { icon: Trophy, label: 'Teams', value: '32' },
  { icon: GitPullRequest, label: 'Commits', value: '847' },
  { icon: Coffee, label: 'Coffee Cups', value: '231' },
];

export function HackathonStats() {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
      <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-6">
        Hackathon Statistics
      </h2>

      <div className="grid grid-cols-2 gap-4 mb-6">
        {stats.map((stat, index) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className={cn(
              "p-4 rounded-lg",
              "bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20"
            )}
          >
            <div className="flex items-center gap-3">
              <stat.icon className="w-5 h-5 text-blue-600 dark:text-blue-400" />
              <div>
                <div className="text-sm text-gray-600 dark:text-gray-400">{stat.label}</div>
                <div className="text-xl font-bold text-gray-900 dark:text-white">{stat.value}</div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="h-48">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={mockData}>
            <XAxis
              dataKey="time"
              stroke="#6B7280"
              fontSize={12}
              tickLine={false}
              axisLine={false}
            />
            <YAxis
              stroke="#6B7280"
              fontSize={12}
              tickLine={false}
              axisLine={false}
              tickFormatter={(value) => `${value}`}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: 'rgba(255, 255, 255, 0.8)',
                border: 'none',
                borderRadius: '8px',
                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
              }}
            />
            <Line
              type="monotone"
              dataKey="commits"
              stroke="#3B82F6"
              strokeWidth={2}
              dot={false}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}