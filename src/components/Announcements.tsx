import React, { useEffect, useState } from 'react';
import { Megaphone } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../hooks/useAuth';
import ReactMarkdown from 'react-markdown';

interface Announcement {
  id: string;
  content: string;
  created_at: string;
  author: string;
}

export function Announcements() {
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [newAnnouncement, setNewAnnouncement] = useState('');
  const { user } = useAuth();

  useEffect(() => {
    const fetchAnnouncements = async () => {
      const { data, error } = await supabase
        .from('announcements')
        .select('*')
        .order('created_at', { ascending: false });

      if (!error && data) {
        setAnnouncements(data);
      }
    };

    fetchAnnouncements();

    const subscription = supabase
      .channel('announcements')
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'announcements' }, 
        (payload) => {
          setAnnouncements(current => [payload.new as Announcement, ...current]);
        }
      )
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAnnouncement.trim() || !user) return;

    const { error } = await supabase
      .from('announcements')
      .insert([
        {
          content: newAnnouncement,
          author: user.email,
        },
      ]);

    if (!error) {
      setNewAnnouncement('');
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
      <div className="flex items-center gap-3 mb-6">
        <Megaphone className="w-6 h-6 text-blue-600 dark:text-blue-400" />
        <h2 className="text-xl font-semibold text-gray-800 dark:text-white">Announcements</h2>
      </div>

      {user && (
        <form onSubmit={handleSubmit} className="mb-6">
          <textarea
            value={newAnnouncement}
            onChange={(e) => setNewAnnouncement(e.target.value)}
            placeholder="Write an announcement... (Markdown supported)"
            className="w-full p-3 rounded-lg border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
            rows={3}
          />
          <button
            type="submit"
            className="mt-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Post Announcement
          </button>
        </form>
      )}

      <div className="space-y-4">
        {announcements.map((announcement) => (
          <div
            key={announcement.id}
            className="p-4 rounded-lg bg-gray-50 dark:bg-gray-700"
          >
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm text-gray-600 dark:text-gray-400">
                {announcement.author}
              </span>
              <span className="text-sm text-gray-500 dark:text-gray-400">
                {new Date(announcement.created_at).toLocaleString()}
              </span>
            </div>
            <div className="prose dark:prose-invert">
              <ReactMarkdown>{announcement.content}</ReactMarkdown>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}