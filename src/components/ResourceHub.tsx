import React from 'react';
import { motion } from 'framer-motion';
import { Book, Code, Coffee, Cpu, Database, Globe, Server, Zap } from 'lucide-react';
import { cn } from '../lib/utils';

const resources = [
  {
    icon: Code,
    title: 'Starter Templates',
    description: 'Quick-start templates for various tech stacks',
    link: '#',
    category: 'Development',
  },
  {
    icon: Database,
    title: 'API Documentation',
    description: 'Comprehensive API guides and examples',
    link: '#',
    category: 'Backend',
  },
  {
    icon: Globe,
    title: 'Design Resources',
    description: 'UI kits, icons, and design inspiration',
    link: '#',
    category: 'Design',
  },
  {
    icon: Server,
    title: 'Cloud Credits',
    description: 'Free cloud hosting for your projects',
    link: '#',
    category: 'Infrastructure',
  },
  {
    icon: Book,
    title: 'Learning Path',
    description: 'Curated tutorials and workshops',
    link: '#',
    category: 'Education',
  },
  {
    icon: Coffee,
    title: 'Mentorship',
    description: 'Connect with industry experts',
    link: '#',
    category: 'Support',
  },
  {
    icon: Cpu,
    title: 'Hardware Lab',
    description: 'IoT devices and testing equipment',
    link: '#',
    category: 'Hardware',
  },
  {
    icon: Zap,
    title: 'AI Services',
    description: 'ML models and AI integration guides',
    link: '#',
    category: 'AI/ML',
  },
];

export function ResourceHub() {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
      <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-6">
        Resource Hub
      </h2>

      <div className="grid gap-4 sm:grid-cols-2">
        {resources.map((resource, index) => (
          <motion.a
            key={resource.title}
            href={resource.link}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className={cn(
              "p-4 rounded-lg transition-all",
              "bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-700/50 dark:to-gray-800/50",
              "hover:from-blue-50 hover:to-blue-100 dark:hover:from-blue-900/20 dark:hover:to-blue-800/20",
              "group cursor-pointer"
            )}
          >
            <div className="flex items-start gap-4">
              <div className="p-2 rounded-lg bg-blue-100 dark:bg-blue-900/30 group-hover:bg-blue-200 dark:group-hover:bg-blue-800/30 transition-colors">
                <resource.icon className="w-5 h-5 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <h3 className="font-medium text-gray-900 dark:text-white mb-1">
                  {resource.title}
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {resource.description}
                </p>
                <span className="inline-block mt-2 text-xs font-medium text-blue-600 dark:text-blue-400">
                  {resource.category}
                </span>
              </div>
            </div>
          </motion.a>
        ))}
      </div>
    </div>
  );
}