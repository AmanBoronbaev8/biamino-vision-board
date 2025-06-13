
import { useState, useEffect } from 'react';
import { supabase } from '../integrations/supabase/client';
import { Project } from '../types';

export const useProjects = (department?: 'present' | 'future') => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadProjects();
  }, [department]);

  const loadProjects = async () => {
    try {
      setLoading(true);
      let query = supabase
        .from('projects')
        .select(`
          *,
          custom_fields (*),
          project_links (*)
        `);

      if (department) {
        query = query.eq('department', department);
      }

      const { data, error } = await query;

      if (error) {
        console.error('Error loading projects:', error);
        return;
      }

      // Transform data to match the expected format
      const transformedProjects = data?.map(project => ({
        ...project,
        custom_fields: project.custom_fields || [],
        links: project.project_links || []
      })) || [];

      setProjects(transformedProjects);
    } catch (error) {
      console.error('Error loading projects:', error);
    } finally {
      setLoading(false);
    }
  };

  const createProject = async (projectData: Omit<Project, 'id' | 'created_at' | 'updated_at'>) => {
    try {
      const { data, error } = await supabase
        .from('projects')
        .insert([{
          title: projectData.title,
          description: projectData.description,
          emoji: projectData.emoji,
          department: projectData.department,
          status: projectData.status,
          secondary_status: projectData.secondary_status,
          goal: projectData.goal,
          github_url: projectData.github_url,
          revenue: projectData.revenue,
          revenue_amount: projectData.revenue_amount,
          requirements: projectData.requirements,
          inventory: projectData.inventory,
          is_private: projectData.is_private,
          description_is_nda: projectData.description_is_nda,
          goal_is_nda: projectData.goal_is_nda,
          requirements_is_nda: projectData.requirements_is_nda,
          inventory_is_nda: projectData.inventory_is_nda
        }])
        .select()
        .single();

      if (error) {
        console.error('Error creating project:', error);
        return null;
      }

      // Add custom fields and links
      if (projectData.custom_fields && projectData.custom_fields.length > 0) {
        await supabase
          .from('custom_fields')
          .insert(
            projectData.custom_fields.map(field => ({
              project_id: data.id,
              key: field.key,
              value: field.value,
              is_nda: field.is_nda
            }))
          );
      }

      if (projectData.links && projectData.links.length > 0) {
        await supabase
          .from('project_links')
          .insert(
            projectData.links.map(link => ({
              project_id: data.id,
              title: link.title,
              url: link.url,
              description: link.description
            }))
          );
      }

      await loadProjects();
      return data;
    } catch (error) {
      console.error('Error creating project:', error);
      return null;
    }
  };

  const updateProject = async (id: string, projectData: Partial<Project>) => {
    try {
      const { error } = await supabase
        .from('projects')
        .update({
          title: projectData.title,
          description: projectData.description,
          emoji: projectData.emoji,
          department: projectData.department,
          status: projectData.status,
          secondary_status: projectData.secondary_status,
          goal: projectData.goal,
          github_url: projectData.github_url,
          revenue: projectData.revenue,
          revenue_amount: projectData.revenue_amount,
          requirements: projectData.requirements,
          inventory: projectData.inventory,
          is_private: projectData.is_private,
          description_is_nda: projectData.description_is_nda,
          goal_is_nda: projectData.goal_is_nda,
          requirements_is_nda: projectData.requirements_is_nda,
          inventory_is_nda: projectData.inventory_is_nda
        })
        .eq('id', id);

      if (error) {
        console.error('Error updating project:', error);
        return false;
      }

      // Update custom fields
      if (projectData.custom_fields) {
        // Delete existing custom fields
        await supabase
          .from('custom_fields')
          .delete()
          .eq('project_id', id);

        // Insert new custom fields
        if (projectData.custom_fields.length > 0) {
          await supabase
            .from('custom_fields')
            .insert(
              projectData.custom_fields.map(field => ({
                project_id: id,
                key: field.key,
                value: field.value,
                is_nda: field.is_nda
              }))
            );
        }
      }

      // Update project links
      if (projectData.links) {
        // Delete existing links
        await supabase
          .from('project_links')
          .delete()
          .eq('project_id', id);

        // Insert new links
        if (projectData.links.length > 0) {
          await supabase
            .from('project_links')
            .insert(
              projectData.links.map(link => ({
                project_id: id,
                title: link.title,
                url: link.url,
                description: link.description
              }))
            );
        }
      }

      await loadProjects();
      return true;
    } catch (error) {
      console.error('Error updating project:', error);
      return false;
    }
  };

  const deleteProject = async (id: string) => {
    try {
      const { error } = await supabase
        .from('projects')
        .delete()
        .eq('id', id);

      if (error) {
        console.error('Error deleting project:', error);
        return false;
      }

      await loadProjects();
      return true;
    } catch (error) {
      console.error('Error deleting project:', error);
      return false;
    }
  };

  return {
    projects,
    loading,
    loadProjects,
    createProject,
    updateProject,
    deleteProject
  };
};
