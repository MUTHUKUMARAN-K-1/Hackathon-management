import React, { useEffect, useState } from 'react';
import { FileCode, Github } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../hooks/useAuth';
import ReactMarkdown from 'react-markdown';

interface Project {
  id: string;
  title: string;
  description: string;
  github_url: string;
  tech_stack: string[];
  team_id: string;
  created_at: string;
}

export function ProjectSubmission() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [showSubmitForm, setShowSubmitForm] = useState(false);
  const [newProject, setNewProject] = useState({
    title: '',
    description: '',
    github_url: '',
    tech_stack: '',
  });
  const { user } = useAuth();

  useEffect(() => {
    const fetchProjects = async () => {
      const { data, error } = await supabase
        .from('projects')
        .select('*')
        .order('created_at', { ascending: false });

      if (!error && data) {
        setProjects(data);
      }
    };

    fetchProjects();

    const subscription = supabase
      .channel('projects')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'projects' },
        () => {
          fetchProjects();
        }
      )
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !newProject.title.trim() || !newProject.github_url.trim()) return;

    const { error } = await supabase
      .from('projects')
      .insert([
        {
          title: newProject.title,
          description: newProject.description,
          github_url: newProject.github_url,
          tech_stack: newProject.tech_stack.split(',').map(tech => tech.trim()),
        },
      ]);

    if (!error) {
      setNewProject({
        title: '',
        description: '',
        github_url: '',
        tech_stack: '',
      });
      setShowSubmitForm(false);
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <FileCode className="w-6 h-6 text-blue-600 dark:text-blue-400" />
          <h2 className="text-xl font-semibold text-gray-800 dark:text-white">Projects</h2>
        </div>
        {user && (
          <button
            onClick={() => setShowSubmitForm(true)}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Submit Project
          </button>
        )}
      </div>

      {showSubmitForm && (
        <form onSubmit={handleSubmit} className="mb-6 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Project Title
              </label>
              <input
                type="text"
                value={newProject.title}
                onChange={(e) => setNewProject(prev => ({ ...prev, title: e.target.value }))}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-600 dark:border-gray-500 dark:text-white"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Description (Markdown supported)
              </label>
              <textarea
                value={newProject.description}
                onChange={(e) => setNewProject(prev => ({ ...prev, description: e.target.value }))}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-600 dark:border-gray-500 dark:text-white"
                rows={4}
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                GitHub URL
              </label>
              <input
                type="url"
                value={newProject.github_url}
                onChange={(e) => setNewProject(prev => ({ ...prev, github_url: e.target.value }))}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-600 dark:border-gray-500 dark:text-white"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Tech Stack (comma-separated)
              </label>
              <input
                type="text"
                value={newProject.tech_stack}
                onChange={(e) => setNewProject(prev => ({ ...prev, tech_stack: e.target.value }))}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-600 dark:border-gray-500 dark:text-white"
                placeholder="React, TypeScript, Tailwind CSS"
                required
              />
            </div>
            <div className="flex gap-2">
              <button
                type="submit"
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Submit
              </button>
              <button
                type="button"
                onClick={() => setShowSubmitForm(false)}
                className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 dark:bg-gray-600 dark:text-gray-200 dark:hover:bg-gray-500"
              >
                Cancel
              </button>
            </div>
          </div>
        </form>
      )}

      <div className="space-y-6">
        {projects.map((project) => (
          <div
            key={project.id}
            className="p-4 rounded-lg border border-gray-200 dark:border-gray-700"
          >
            <div className="flex justify-between items-start mb-4">
              <h3 className="text-lg font-semibold text-gray-800 dark:text-white">
                {project.title}
              </h3>
              <a
                href={project.github_url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-blue-600 hover:text-blue-500"
              >
                <Github className="w-5 h-5" />
                <span className="text-sm">View on GitHub</span>
              </a>
            </div>
            <div className="prose dark:prose-invert mb-4">
              <ReactMarkdown>{project.description}</ReactMarkdown>
            </div>
            <div className="flex flex-wrap gap-2">
              {project.tech_stack.map((tech, index) => (
                <span
                  key={index}
                  className="px-2 py-1 text-sm bg-gray-100 dark:bg-gray-700 rounded-full"
                >
                  {tech}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}