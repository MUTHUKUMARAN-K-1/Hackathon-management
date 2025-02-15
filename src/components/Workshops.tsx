import React from 'react';
import { motion } from 'framer-motion';
import { Calendar, Clock, Users, ExternalLink } from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '../lib/utils';

const workshops = [
  {
    id: 1,
    title: 'Building Scalable APIs with GraphQL',
    description: 'Learn how to design and implement efficient GraphQL APIs for your applications.',
    speaker: 'Sarah Johnson',
    company: 'TechCorp',
    date: new Date(Date.now() + 2 * 3600 * 1000),
    duration: '45 minutes',
    attendees: 28,
    maxAttendees: 50,
    tags: ['Backend', 'API', 'GraphQL'],
  },
  {
    id: 2,
    title: 'AI Integration Workshop',
    description: 'Hands-on session on integrating AI models into your hackathon projects.',
    speaker: 'Dr. Michael Chen',
    company: 'AI Labs',
    date: new Date(Date.now() + 5 * 3600 * 1000),
    duration: '60 minutes',
    attendees: 42,
    maxAttendees: 45,
    tags: ['AI', 'Machine Learning', 'Integration'],
  },
  {
    id: 3,
    title: 'UI/UX Best Practices',
    description: 'Design principles and patterns for creating exceptional user experiences.',
    speaker: 'Emily Rodriguez',
    company: 'Design Studio',
    date: new Date(Date.now() + 8 * 3600 * 1000),
    duration: '50 minutes',
    attendees: 35,
    maxAttendees: 40,
    tags: ['Design', 'UI/UX', 'Frontend'],
  },
];

export function Workshops() {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
      <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-6">
        Upcoming Workshops
      </h2>

      <div className="space-y-4">
        {workshops.map((workshop, index) => (
          <motion.div
            key={workshop.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className={cn(
              "p-4 rounded-lg",
              "bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-700/50 dark:to-gray-800/50"
            )}
          >
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                  {workshop.title}
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                  {workshop.description}
                </p>
                
                <div className="flex flex-wrap gap-2 mb-3">
                  {workshop.tags.map((tag) => (
                    <span
                      key={tag}
                      className="px-2 py-1 text-xs font-medium rounded-full bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400"
                    >
                      {tag}
                    </span>
                  ))}
                </div>

                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                    <Calendar className="w-4 h-4" />
                    {format(workshop.date, 'MMM d, h:mm a')}
                  </div>
                  <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                    <Clock className="w-4 h-4" />
                    {workshop.duration}
                  </div>
                  <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                    <Users className="w-4 h-4" />
                    {workshop.attendees}/{workshop.maxAttendees} attending
                  </div>
                </div>
              </div>

              <button
                className={cn(
                  "ml-4 px-4 py-2 rounded-lg text-sm font-medium transition-colors",
                  workshop.attendees >= workshop.maxAttendees
                    ? "bg-gray-100 text-gray-400 cursor-not-allowed dark:bg-gray-700"
                    : "bg-blue-100 text-blue-600 hover:bg-blue-200 dark:bg-blue-900/30 dark:text-blue-400 dark:hover:bg-blue-800/30"
                )}
                disabled={workshop.attendees >= workshop.maxAttendees}
              >
                {workshop.attendees >= workshop.maxAttendees ? 'Full' : 'Register'}
              </button>
            </div>

            <div className="mt-3 pt-3 border-t border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between text-sm">
                <div className="text-gray-600 dark:text-gray-400">
                  <span className="font-medium text-gray-900 dark:text-white">{workshop.speaker}</span>
                  {' from '}
                  {workshop.company}
                </div>
                <button className="flex items-center gap-1 text-blue-600 hover:text-blue-500 dark:text-blue-400">
                  <span>Join</span>
                  <ExternalLink className="w-4 h-4" />
                </button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}