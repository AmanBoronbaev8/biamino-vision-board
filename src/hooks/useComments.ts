
import { useState, useEffect } from 'react';
import { supabase } from '../integrations/supabase/client';
import { Comment } from '../types';

export const useComments = (projectId: string) => {
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (projectId) {
      loadComments();
    }
  }, [projectId]);

  const loadComments = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('comments')
        .select(`
          *,
          user:users (*)
        `)
        .eq('project_id', projectId)
        .order('created_at', { ascending: true });

      if (error) {
        console.error('Error loading comments:', error);
        return;
      }

      setComments(data || []);
    } catch (error) {
      console.error('Error loading comments:', error);
    } finally {
      setLoading(false);
    }
  };

  const addComment = async (content: string, userId: string) => {
    try {
      const { error } = await supabase
        .from('comments')
        .insert([{
          project_id: projectId,
          user_id: userId,
          content
        }]);

      if (error) {
        console.error('Error adding comment:', error);
        return false;
      }

      await loadComments();
      return true;
    } catch (error) {
      console.error('Error adding comment:', error);
      return false;
    }
  };

  const deleteComment = async (commentId: string) => {
    try {
      const { error } = await supabase
        .from('comments')
        .delete()
        .eq('id', commentId);

      if (error) {
        console.error('Error deleting comment:', error);
        return false;
      }

      await loadComments();
      return true;
    } catch (error) {
      console.error('Error deleting comment:', error);
      return false;
    }
  };

  return {
    comments,
    loading,
    addComment,
    deleteComment,
    loadComments
  };
};
