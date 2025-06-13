
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useProjects } from '../hooks/useProjects';
import { useComments } from '../hooks/useComments';
import { Project } from '../types';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Textarea } from './ui/textarea';
import { ArrowLeft, Edit, DollarSign, Github, ExternalLink, MessageCircle, Send, EyeOff, Trash2 } from 'lucide-react';
import ProjectForm from './ProjectForm';

const ProjectDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { projects, deleteProject } = useProjects();
  const { comments, addComment, deleteComment } = useComments(id!);
  const [project, setProject] = useState<Project | null>(null);
  const [newComment, setNewComment] = useState('');
  const [showEditForm, setShowEditForm] = useState(false);

  useEffect(() => {
    const foundProject = projects.find(p => p.id === id);
    setProject(foundProject || null);
  }, [projects, id]);

  const handleAddComment = async () => {
    if (!newComment.trim() || !user) return;

    const success = await addComment(newComment, user.id);
    if (success) {
      setNewComment('');
    }
  };

  const handleDeleteComment = async (commentId: string) => {
    await deleteComment(commentId);
  };

  const handleDeleteProject = async () => {
    if (!confirm('Вы уверены, что хотите удалить этот проект?')) return;

    const success = await deleteProject(id!);
    if (success) {
      navigate(`/projects/${project?.department}`);
    }
  };

  if (!project) {
    return (
      <div className="text-center py-12">
        <div className="text-6xl mb-4">❓</div>
        <h3 className="text-xl font-semibold text-gray-600 dark:text-gray-300 mb-2">
          Проект не найден
        </h3>
        <Button onClick={() => navigate('/')}>
          Вернуться на главную
        </Button>
      </div>
    );
  }

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

  const canViewField = (isNda: boolean) => {
    if (!isNda) return true;
    return user?.role === 'admin' || user?.role === 'team';
  };

  const getFieldValue = (value: string, isNda: boolean) => {
    if (canViewField(isNda)) return value;
    return 'NDA - Конфиденциальная информация';
  };

  const renderFieldWithNDA = (title: string, value: string, isNda: boolean = false) => {
    if (!value) return null;
    
    return (
      <div>
        <div className="flex items-center space-x-2 mb-2">
          <h4 className="font-semibold">{title}</h4>
          {isNda && (
            <Badge variant="destructive" className="text-xs">
              NDA
            </Badge>
          )}
        </div>
        <p className="text-gray-600 dark:text-gray-300 whitespace-pre-wrap">
          {getFieldValue(value, isNda)}
        </p>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button
            variant="ghost"
            onClick={() => navigate(`/projects/${project.department}`)}
            className="flex items-center space-x-2"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>К проектам</span>
          </Button>
        </div>

        <div className="flex space-x-2">
          {user?.role === 'admin' && (
            <>
              <Button
                variant="outline"
                onClick={() => setShowEditForm(true)}
              >
                <Edit className="w-4 h-4 mr-2" />
                Редактировать
              </Button>
              <Button
                variant="destructive"
                onClick={handleDeleteProject}
              >
                <Trash2 className="w-4 h-4 mr-2" />
                Удалить
              </Button>
            </>
          )}
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          {/* Основная информация */}
          <Card className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-0">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex items-center space-x-3">
                  <span className="text-4xl">{project.emoji}</span>
                  <div>
                    <CardTitle className="text-2xl">{project.title}</CardTitle>
                    <div className="flex items-center space-x-2 mt-2">
                      <Badge className={getStatusColor(project.status)}>
                        {getStatusText(project.status)}
                      </Badge>
                      {project.secondary_status && (
                        <Badge variant="outline">
                          {project.secondary_status}
                        </Badge>
                      )}
                      {project.is_private && (
                        <Badge variant="secondary" className="flex items-center space-x-1">
                          <EyeOff className="w-3 h-3" />
                          <span>Приватный</span>
                        </Badge>
                      )}
                    </div>
                  </div>
                </div>
                <div className="flex flex-col items-end space-y-2">
                  {project.revenue && (
                    <div className="flex items-center space-x-1 text-green-600">
                      <DollarSign className="w-4 h-4" />
                      <span className="text-sm">
                        {project.revenue_amount ? `Доходный (${project.revenue_amount})` : 'Доходный'}
                      </span>
                    </div>
                  )}
                  {project.github_url && (
                    <a
                      href={project.github_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center space-x-1 text-gray-600 hover:text-gray-800"
                    >
                      <Github className="w-4 h-4" />
                      <span className="text-sm">GitHub</span>
                    </a>
                  )}
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {renderFieldWithNDA('Описание', project.description, project.description_is_nda)}
                {renderFieldWithNDA('Цель проекта', project.goal, project.goal_is_nda)}
                {renderFieldWithNDA('Требования', project.requirements, project.requirements_is_nda)}
                {renderFieldWithNDA('Инвентарь', project.inventory, project.inventory_is_nda)}

                {/* Ссылки */}
                {project.links && project.links.length > 0 && (
                  <div>
                    <h4 className="font-semibold mb-2">Ссылки</h4>
                    <div className="space-y-2">
                      {project.links.map((link) => (
                        <div key={link.id} className="p-2 border rounded-lg">
                          <a
                            href={link.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center space-x-2 text-blue-600 hover:text-blue-800"
                          >
                            <ExternalLink className="w-4 h-4" />
                            <span className="font-medium">{link.title}</span>
                          </a>
                          {link.description && (
                            <p className="text-sm text-gray-600 mt-1">{link.description}</p>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Кастомные поля */}
                {project.custom_fields && project.custom_fields.length > 0 && (
                  <div>
                    <h4 className="font-semibold mb-2">Дополнительные поля</h4>
                    <div className="space-y-2">
                      {project.custom_fields.map((field) => (
                        <div key={field.id} className="p-2 border rounded-lg">
                          <div className="flex items-center justify-between mb-1">
                            <span className="font-medium">{field.key}</span>
                            {field.is_nda && (
                              <Badge variant="destructive" className="text-xs">
                                NDA
                              </Badge>
                            )}
                          </div>
                          <p className="text-gray-600 dark:text-gray-300">
                            {getFieldValue(field.value, field.is_nda)}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Комментарии */}
        <div className="lg:col-span-1">
          <Card className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-0">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <MessageCircle className="w-5 h-5" />
                <span>Комментарии ({comments.length})</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Форма добавления комментария */}
              <div className="space-y-2">
                <Textarea
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  placeholder="Добавить комментарий..."
                  rows={3}
                />
                <Button
                  onClick={handleAddComment}
                  disabled={!newComment.trim()}
                  size="sm"
                  className="w-full"
                >
                  <Send className="w-4 h-4 mr-2" />
                  Отправить
                </Button>
              </div>

              {/* Список комментариев */}
              <div className="space-y-3 max-h-96 overflow-y-auto">
                {comments.map((comment) => (
                  <div key={comment.id} className="p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center space-x-2">
                        <span className="text-sm font-medium">
                          {comment.user.email}
                        </span>
                        <span className={`px-1 py-0.5 text-xs rounded ${
                          comment.user.role === 'admin' 
                            ? 'bg-red-100 text-red-800'
                            : comment.user.role === 'team'
                            ? 'bg-green-100 text-green-800'
                            : 'bg-blue-100 text-blue-800'
                        }`}>
                          {comment.user.role === 'admin' ? 'Админ' : 
                           comment.user.role === 'team' ? 'Команда' : 'Пользователь'}
                        </span>
                      </div>
                      {user?.role === 'admin' && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDeleteComment(comment.id)}
                        >
                          <Trash2 className="w-3 h-3" />
                        </Button>
                      )}
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-300 whitespace-pre-wrap">
                      {comment.content}
                    </p>
                    <span className="text-xs text-gray-400 mt-1 block">
                      {new Date(comment.created_at).toLocaleString('ru-RU')}
                    </span>
                  </div>
                ))}

                {comments.length === 0 && (
                  <div className="text-center py-6 text-gray-500">
                    Комментариев пока нет
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {showEditForm && (
        <ProjectForm
          project={project}
          department={project.department}
          onClose={() => setShowEditForm(false)}
          onSave={() => setShowEditForm(false)}
        />
      )}
    </div>
  );
};

export default ProjectDetail;
