
import React, { useState } from 'react';
import { Project, CustomField, ProjectLink } from '../types';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Switch } from './ui/switch';
import { Badge } from './ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Plus, X, Save } from 'lucide-react';

interface ProjectFormProps {
  project?: Project;
  department: 'present' | 'future';
  onClose: () => void;
  onSave: () => void;
}

const ProjectForm: React.FC<ProjectFormProps> = ({ project, department, onClose, onSave }) => {
  const [formData, setFormData] = useState<Partial<Project>>({
    title: project?.title || '',
    description: project?.description || '',
    emoji: project?.emoji || '📝',
    department: project?.department || department,
    status: project?.status || 'development',
    secondary_status: project?.secondary_status || '',
    goal: project?.goal || '',
    github_url: project?.github_url || '',
    revenue: project?.revenue || false,
    requirements: project?.requirements || '',
    inventory: project?.inventory || '',
    is_private: project?.is_private || false,
    custom_fields: project?.custom_fields || [],
    links: project?.links || []
  });

  const handleSave = () => {
    const saved = localStorage.getItem('biamino_projects');
    const projects: Project[] = saved ? JSON.parse(saved) : [];
    
    if (project) {
      // Редактирование
      const index = projects.findIndex(p => p.id === project.id);
      if (index !== -1) {
        projects[index] = {
          ...project,
          ...formData,
          updated_at: new Date().toISOString()
        } as Project;
      }
    } else {
      // Создание
      const newProject: Project = {
        id: Date.now().toString(),
        ...formData,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      } as Project;
      projects.push(newProject);
    }
    
    localStorage.setItem('biamino_projects', JSON.stringify(projects));
    onSave();
  };

  const addCustomField = () => {
    setFormData(prev => ({
      ...prev,
      custom_fields: [
        ...(prev.custom_fields || []),
        { id: Date.now().toString(), key: '', value: '', is_nda: false }
      ]
    }));
  };

  const updateCustomField = (index: number, field: Partial<CustomField>) => {
    setFormData(prev => ({
      ...prev,
      custom_fields: prev.custom_fields?.map((f, i) => 
        i === index ? { ...f, ...field } : f
      ) || []
    }));
  };

  const removeCustomField = (index: number) => {
    setFormData(prev => ({
      ...prev,
      custom_fields: prev.custom_fields?.filter((_, i) => i !== index) || []
    }));
  };

  const addLink = () => {
    setFormData(prev => ({
      ...prev,
      links: [
        ...(prev.links || []),
        { id: Date.now().toString(), title: '', url: '', description: '' }
      ]
    }));
  };

  const updateLink = (index: number, link: Partial<ProjectLink>) => {
    setFormData(prev => ({
      ...prev,
      links: prev.links?.map((l, i) => 
        i === index ? { ...l, ...link } : l
      ) || []
    }));
  };

  const removeLink = (index: number) => {
    setFormData(prev => ({
      ...prev,
      links: prev.links?.filter((_, i) => i !== index) || []
    }));
  };

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {project ? 'Редактировать проект' : 'Создать проект'}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Название</label>
              <Input
                value={formData.title}
                onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                placeholder="Название проекта"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1">Эмодзи</label>
              <Input
                value={formData.emoji}
                onChange={(e) => setFormData(prev => ({ ...prev, emoji: e.target.value }))}
                placeholder="📝"
                className="text-center"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Описание</label>
            <Textarea
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              placeholder="Краткое описание проекта"
              rows={3}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Статус</label>
              <Select
                value={formData.status}
                onValueChange={(value) => setFormData(prev => ({ ...prev, status: value as any }))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="development">В разработке</SelectItem>
                  <SelectItem value="production">В продакшене</SelectItem>
                  <SelectItem value="archive">В архиве</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Дополнительный статус</label>
              <Input
                value={formData.secondary_status}
                onChange={(e) => setFormData(prev => ({ ...prev, secondary_status: e.target.value }))}
                placeholder="Любой текст"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Цель проекта</label>
            <Textarea
              value={formData.goal}
              onChange={(e) => setFormData(prev => ({ ...prev, goal: e.target.value }))}
              placeholder="Цель и задачи проекта"
              rows={2}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">GitHub URL</label>
              <Input
                value={formData.github_url}
                onChange={(e) => setFormData(prev => ({ ...prev, github_url: e.target.value }))}
                placeholder="https://github.com/user/repo"
              />
            </div>

            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <Switch
                  checked={formData.revenue}
                  onCheckedChange={(checked) => setFormData(prev => ({ ...prev, revenue: checked }))}
                />
                <label className="text-sm font-medium">Приносит доход</label>
              </div>

              <div className="flex items-center space-x-2">
                <Switch
                  checked={formData.is_private}
                  onCheckedChange={(checked) => setFormData(prev => ({ ...prev, is_private: checked }))}
                />
                <label className="text-sm font-medium">Приватный</label>
              </div>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Требования</label>
            <Textarea
              value={formData.requirements}
              onChange={(e) => setFormData(prev => ({ ...prev, requirements: e.target.value }))}
              placeholder="Технические требования и зависимости"
              rows={3}
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Инвентарь</label>
            <Textarea
              value={formData.inventory}
              onChange={(e) => setFormData(prev => ({ ...prev, inventory: e.target.value }))}
              placeholder="Используемые ресурсы и инструменты"
              rows={3}
            />
          </div>

          {/* Ссылки */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <label className="block text-sm font-medium">Ссылки</label>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={addLink}
              >
                <Plus className="w-4 h-4 mr-1" />
                Добавить ссылку
              </Button>
            </div>
            
            <div className="space-y-3">
              {formData.links?.map((link, index) => (
                <div key={link.id} className="p-3 border rounded-lg space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Ссылка {index + 1}</span>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => removeLink(index)}
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    <Input
                      value={link.title}
                      onChange={(e) => updateLink(index, { title: e.target.value })}
                      placeholder="Название ссылки"
                    />
                    <Input
                      value={link.url}
                      onChange={(e) => updateLink(index, { url: e.target.value })}
                      placeholder="URL"
                    />
                  </div>
                  
                  <Input
                    value={link.description}
                    onChange={(e) => updateLink(index, { description: e.target.value })}
                    placeholder="Описание (необязательно)"
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Кастомные поля */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <label className="block text-sm font-medium">Дополнительные поля</label>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={addCustomField}
              >
                <Plus className="w-4 h-4 mr-1" />
                Добавить поле
              </Button>
            </div>
            
            <div className="space-y-3">
              {formData.custom_fields?.map((field, index) => (
                <div key={field.id} className="p-3 border rounded-lg space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Поле {index + 1}</span>
                    <div className="flex items-center space-x-2">
                      <div className="flex items-center space-x-1">
                        <Switch
                          checked={field.is_nda}
                          onCheckedChange={(checked) => updateCustomField(index, { is_nda: checked })}
                        />
                        <span className="text-xs">NDA</span>
                      </div>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => removeCustomField(index)}
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    <Input
                      value={field.key}
                      onChange={(e) => updateCustomField(index, { key: e.target.value })}
                      placeholder="Название поля"
                    />
                    <Input
                      value={field.value}
                      onChange={(e) => updateCustomField(index, { value: e.target.value })}
                      placeholder="Значение"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="flex justify-end space-x-3 pt-4 border-t">
          <Button variant="outline" onClick={onClose}>
            Отмена
          </Button>
          <Button onClick={handleSave}>
            <Save className="w-4 h-4 mr-2" />
            Сохранить
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ProjectForm;
