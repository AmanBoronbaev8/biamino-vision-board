
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent } from './ui/card';
import { Button } from './ui/button';
import { ArrowRight, Clock, Zap } from 'lucide-react';

const HomePage: React.FC = () => {
  const navigate = useNavigate();

  const departments = [
    {
      id: 'present',
      name: 'Отдел настоящего',
      emoji: '⚡',
      description: 'Текущие проекты и задачи',
      gradient: 'from-yellow-400 to-orange-500',
      icon: Zap,
      stats: 'Активные проекты'
    },
    {
      id: 'future',
      name: 'Отдел будущего',
      emoji: '🚀',
      description: 'Инновации и планы развития',
      gradient: 'from-blue-400 to-purple-500',
      icon: Clock,
      stats: 'Проекты в разработке'
    }
  ];

  return (
    <div className="space-y-8">
      <div className="text-center">
        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
          Добро пожаловать в{' '}
          <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Biamino
          </span>
        </h1>
        <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
          Централизованная платформа для управления проектами команды. 
          Отслеживайте прогресс, управляйте задачами и координируйте работу отделов.
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
        {departments.map((dept) => (
          <Card
            key={dept.id}
            className="group cursor-pointer transform transition-all duration-300 hover:scale-105 hover:shadow-2xl border-0 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm overflow-hidden"
            onClick={() => navigate(`/projects/${dept.id}`)}
          >
            <CardContent className="p-0">
              <div className={`bg-gradient-to-br ${dept.gradient} p-6 text-white`}>
                <div className="flex items-center justify-between mb-4">
                  <div className="text-4xl">{dept.emoji}</div>
                  <dept.icon className="w-6 h-6 opacity-80" />
                </div>
                <h3 className="text-2xl font-bold mb-2">{dept.name}</h3>
                <p className="opacity-90">{dept.description}</p>
              </div>
              
              <div className="p-6">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-500 dark:text-gray-400">
                    {dept.stats}
                  </span>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="group-hover:translate-x-1 transition-transform"
                  >
                    Перейти
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default HomePage;
