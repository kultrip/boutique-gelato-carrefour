import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ShoppingBag, Package, Settings, TrendingUp } from 'lucide-react';
import { t } from '@/lib/i18n';
import Layout from '@/components/Layout';

const Dashboard = () => {
  const navigate = useNavigate();

  const quickActions = [
    {
      title: t('nav.orders'),
      description: 'Create a new order',
      icon: ShoppingBag,
      path: '/orders',
      color: 'bg-primary text-primary-foreground',
    },
    {
      title: t('nav.products'),
      description: 'Manage products',
      icon: Package,
      path: '/products',
      color: 'bg-accent text-accent-foreground',
    },
    {
      title: t('nav.settings'),
      description: 'Shop settings',
      icon: Settings,
      path: '/settings',
      color: 'bg-secondary text-secondary-foreground',
    },
  ];

  return (
    <Layout>
      <div className="space-y-6">
        <div>
          <h2 className="text-3xl font-bold text-foreground mb-2">
            {t('nav.dashboard')}
          </h2>
          <p className="text-muted-foreground">
            Quick access to all POS features
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {quickActions.map((action) => {
            const Icon = action.icon;
            return (
              <Card
                key={action.path}
                className="card-shadow card-hover cursor-pointer"
                onClick={() => navigate(action.path)}
              >
                <CardHeader>
                  <div className={`w-16 h-16 rounded-2xl ${action.color} flex items-center justify-center mb-4`}>
                    <Icon className="w-8 h-8" />
                  </div>
                  <CardTitle className="text-xl">{action.title}</CardTitle>
                  <CardDescription>{action.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <Button className="w-full touch-target">
                    Open
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Stats placeholder */}
        <Card className="card-shadow">
          <CardHeader>
            <div className="flex items-center gap-3">
              <TrendingUp className="w-6 h-6 text-primary" />
              <CardTitle>Today's Summary</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              Start creating orders to see your daily statistics here.
            </p>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default Dashboard;
