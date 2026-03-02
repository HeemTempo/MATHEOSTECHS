import { Link } from 'react-router-dom';
import { AlertCircle, Shield, Users, TrendingUp } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Card, CardContent } from '../components/ui/card';

export function LandingPage() {
  const features = [
    {
      icon: AlertCircle,
      title: 'Incident Tracking',
      description: 'Track and manage incidents from creation to resolution with a clear workflow.',
    },
    {
      icon: Shield,
      title: 'Role-Based Access',
      description: 'Secure access control with Reporter, Operator, and Admin roles.',
    },
    {
      icon: Users,
      title: 'Team Collaboration',
      description: 'Assign incidents, add comments, and keep everyone in the loop.',
    },
    {
      icon: TrendingUp,
      title: 'Real-Time Updates',
      description: 'Monitor incident status and get instant updates on progress.',
    },
  ];

  return (
    <div className="min-h-screen bg-[#0f1117]">
      {/* Header */}
      <header className="border-b border-[#2e3149] bg-[#1a1d27]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <AlertCircle className="w-8 h-8 text-indigo-400 mr-2" />
              <h1 className="text-xl font-bold text-white">Incident Log System</h1>
            </div>
            <Link to="/login">
              <Button className="bg-indigo-600 hover:bg-indigo-700">
                Sign In
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-12 sm:py-16 md:py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-4 sm:mb-6">
            Manage Incidents with Confidence
          </h2>
          <p className="text-lg sm:text-xl text-slate-400 mb-6 sm:mb-8 max-w-3xl mx-auto px-4">
            A powerful incident management system designed for operational teams. 
            Track, assign, and resolve incidents efficiently with real-time collaboration.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center px-4">
            <Link to="/login">
              <Button size="lg" className="bg-indigo-600 hover:bg-indigo-700 w-full sm:w-auto">
                Get Started
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-12 sm:py-16 md:py-20 px-4 sm:px-6 lg:px-8 bg-[#1a1d27]/30">
        <div className="max-w-7xl mx-auto">
          <h3 className="text-2xl sm:text-3xl font-bold text-white text-center mb-8 sm:mb-12">
            Key Features
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {features.map((feature) => {
              const Icon = feature.icon;
              return (
                <Card key={feature.title} className="bg-[#1a1d27] border-[#2e3149]">
                  <CardContent className="pt-6">
                    <div className="flex flex-col items-center text-center">
                      <div className="p-3 rounded-lg bg-indigo-500/10 mb-4">
                        <Icon className="w-6 h-6 text-indigo-400" />
                      </div>
                      <h4 className="text-lg font-semibold text-white mb-2">
                        {feature.title}
                      </h4>
                      <p className="text-slate-400 text-sm">
                        {feature.description}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Workflow Section */}
      <section className="py-12 sm:py-16 md:py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <h3 className="text-2xl sm:text-3xl font-bold text-white text-center mb-8 sm:mb-12">
            Simple Workflow
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 sm:gap-8">
            {[
              { step: '1', title: 'Report', desc: 'Create incident reports' },
              { step: '2', title: 'Assign', desc: 'Assign to operators' },
              { step: '3', title: 'Investigate', desc: 'Track progress' },
              { step: '4', title: 'Resolve', desc: 'Close incidents' },
            ].map((item, index) => (
              <div key={item.step} className="text-center">
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-indigo-500/10 text-indigo-400 font-bold text-xl mb-4">
                  {item.step}
                </div>
                <h4 className="text-lg font-semibold text-white mb-2">{item.title}</h4>
                <p className="text-slate-400 text-sm">{item.desc}</p>
                {index < 3 && (
                  <div className="hidden md:block absolute top-6 left-1/2 w-full h-0.5 bg-[#2e3149]" />
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-12 sm:py-16 md:py-20 px-4 sm:px-6 lg:px-8 bg-[#1a1d27]/30">
        <div className="max-w-4xl mx-auto text-center">
          <h3 className="text-2xl sm:text-3xl font-bold text-white mb-4 sm:mb-6">
            Ready to Get Started?
          </h3>
          <p className="text-lg sm:text-xl text-slate-400 mb-6 sm:mb-8 px-4">
            Sign in to access your incident management dashboard.
          </p>
          <Link to="/login">
            <Button size="lg" className="bg-indigo-600 hover:bg-indigo-700 w-full sm:w-auto">
              Sign In Now
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-[#2e3149] py-6 sm:py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-center text-slate-400 text-xs sm:text-sm">
            © 2026 Incident Log System. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
