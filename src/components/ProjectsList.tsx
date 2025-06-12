
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Project } from '../types';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Plus, ArrowLeft, Eye, EyeOff, DollarSign, Github } from 'lucide-react';
import ProjectForm from './ProjectForm';

const ProjectsList: React.FC = () => {
  const { department } = useParams<{ department: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [projects, setProjects] = useState<Project[]>([]);
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    loadProjects();
  }, [department]);

  const loadProjects = () => {
    const saved = localStorage.getItem('biamino_projects');
    const allProjects: Project[] = saved ? JSON.parse(saved) : [];
    
    let filteredProjects = allProjects.filter(p => p.department === department);
    
    // Фильтрация для пользователей (скрыть приватные проекты)
    if (user?.role === 'user') {
      filteredProjects = filteredProjects.filter(p => !p.is_private);
    }
    
    setProjects(filteredProjects);
  };

  const departmentInfo = {
    present: {
      name: 'Отдел настоящего',
      emoji: '⚡',
      description: 'Текущие проекты и задачи'
    },
    future: {
      name: 'Отдел будущего', 
      emoji: '🚀',
      description: 'Инновации и планы развития'
    }
  };

  const currentDept = departmentInfo[department as keyof typeof departmentInfo];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'development': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
      case 'production': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'archive': return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
      default: return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'development': return 'В разработке';
      case 'production': return 'В продакшене';
      case 'archive': return 'В архиве';
      default: return status;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button
            variant="ghost"
            onClick={() => navigate('/')}
            className="flex items-center space-x-2"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Назад</span>
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center space-x-3">
              <span className="text-4xl">{currentDept?.emoji}</span>
              <span>{currentDept?.name}</span>
            </h1>
            <p className="text-gray-600 dark:text-gray-300">{currentDept?.description}</p>
          </div>
        </div>

        {user?.role === 'admin' && (
          <Button
            onClick={() => setShowForm(true)}
            className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
          >
            <Plus className="w-4 h-4 mr-2" />
            Добавить проект
          </Button>
        )}
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {projects.map((project) => (
          <Card
            key={project.id}
            className="group cursor-pointer transform transition-all duration-300 hover:scale-105 hover:shadow-lg border-0 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm"
            onClick={() => navigate(`/project/${project.id}`)}
          >
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="flex items-center space-x-3">
                  <span className="text-2xl">{project.emoji}</span>
                  <div>
                    <CardTitle className="text-lg line-clamp-1">{project.title}</CardTitle>
                    {project.is_private && (
                      <div className="flex items-center space-x-1 mt-1">
                        <EyeOff className="w-3 h-3" />
                        <span className="text-xs text-gray-500">Приватный</span>
                      </div>
                    )}
                  </div>
                </div>
                <div className="flex flex-col items-end space-y-1">
                  {project.revenue && (
                    <DollarSign className="w-4 h-4 text-green-600" />
                  )}
                  {project.github_url && (
                    <Github className="w-4 h-4 text-gray-600" />
                  )}
                </div>
              </div>
            </CardHeader>
            
            <CardContent className="pt-0">
              <p className="text-sm text-gray-600 dark:text-gray-300 line-clamp-2 mb-3">
                {project.description}
              </p>
              
              <div className="space-y-2">
                <div className="flex flex-wrap gap-1">
                  <Badge className={getStatusColor(project.status)}>
                    {getStatusText(project.status)}
                  </Badge>
                  {project.secondary_status && (
                    <Badge variant="outline" className="text-xs">
                      {project.secondary_status}
                    </Badge>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {projects.length === 0 && (
        <div className="text-center py-12">
          <div className="text-6xl mb-4">📭</div>
          <h3 className="text-xl font-semibold text-gray-600 dark:text-gray-300 mb-2">
            Проектов пока нет
          </h3>
          <p className="text-gray-500 dark:text-gray-400">
            {user?.role === 'admin' 
              ? 'Создайте первый проект для этого отдела'
              : 'Проекты появятся здесь, когда их добавит администратор'
            }
          </p>
        </div>
      )}

      {showForm && (
        <ProjectForm
          department={department as 'present' | 'future'}
          onClose={() => setShowForm(false)}
          onSave={() => {
            setShowForm(false);
            loadProjects();
          }}
        />
      )}
    </div>
  );
};

export default ProjectsList;
