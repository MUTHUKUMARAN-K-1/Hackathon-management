import React, { useEffect, useState } from 'react';
import { Users, Plus } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../hooks/useAuth';

interface Team {
  id: string;
  name: string;
  description: string;
  members: string[];
  created_at: string;
}

export function TeamManagement() {
  const [teams, setTeams] = useState<Team[]>([]);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [newTeam, setNewTeam] = useState({ name: '', description: '' });
  const { user } = useAuth();

  useEffect(() => {
    const fetchTeams = async () => {
      const { data, error } = await supabase
        .from('teams')
        .select('*');

      if (!error && data) {
        setTeams(data);
      }
    };

    fetchTeams();

    const subscription = supabase
      .channel('teams')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'teams' },
        () => {
          fetchTeams();
        }
      )
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const handleCreateTeam = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !newTeam.name.trim()) return;

    const { error } = await supabase
      .from('teams')
      .insert([
        {
          name: newTeam.name,
          description: newTeam.description,
          members: [user.id],
        },
      ]);

    if (!error) {
      setNewTeam({ name: '', description: '' });
      setShowCreateForm(false);
    }
  };

  const handleJoinTeam = async (teamId: string) => {
    if (!user) return;

    const team = teams.find(t => t.id === teamId);
    if (!team) return;

    const { error } = await supabase
      .from('teams')
      .update({
        members: [...team.members, user.id],
      })
      .eq('id', teamId);

    if (!error) {
      // Team list will be updated via subscription
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <Users className="w-6 h-6 text-blue-600 dark:text-blue-400" />
          <h2 className="text-xl font-semibold text-gray-800 dark:text-white">Teams</h2>
        </div>
        {user && (
          <button
            onClick={() => setShowCreateForm(true)}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            <Plus className="w-4 h-4" />
            Create Team
          </button>
        )}
      </div>

      {showCreateForm && (
        <form onSubmit={handleCreateTeam} className="mb-6 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Team Name
              </label>
              <input
                type="text"
                value={newTeam.name}
                onChange={(e) => setNewTeam(prev => ({ ...prev, name: e.target.value }))}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-600 dark:border-gray-500 dark:text-white"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Description
              </label>
              <textarea
                value={newTeam.description}
                onChange={(e) => setNewTeam(prev => ({ ...prev, description: e.target.value }))}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-600 dark:border-gray-500 dark:text-white"
                rows={3}
              />
            </div>
            <div className="flex gap-2">
              <button
                type="submit"
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Create
              </button>
              <button
                type="button"
                onClick={() => setShowCreateForm(false)}
                className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 dark:bg-gray-600 dark:text-gray-200 dark:hover:bg-gray-500"
              >
                Cancel
              </button>
            </div>
          </div>
        </form>
      )}

      <div className="grid gap-4 md:grid-cols-2">
        {teams.map((team) => (
          <div
            key={team.id}
            className="p-4 rounded-lg border border-gray-200 dark:border-gray-700"
          >
            <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-2">
              {team.name}
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              {team.description}
            </p>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-500 dark:text-gray-400">
                {team.members.length} members
              </span>
              {user && !team.members.includes(user.id) && (
                <button
                  onClick={() => handleJoinTeam(team.id)}
                  className="px-3 py-1 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm"
                >
                  Join Team
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}