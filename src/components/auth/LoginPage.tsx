import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Stethoscope, Mail, Lock, User } from 'lucide-react';
import dentalHero from '@/assets/dental-hero.jpg';

export const LoginPage = () => {
  const [selectedRole, setSelectedRole] = useState<'admin' | 'patient'>('admin');
  const [userEmail, setUserEmail] = useState('');
  const [userPassword, setUserPassword] = useState('');
  const navigate = useNavigate();

  const handleUserLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // Simulate authentication (would call backend in real app)
    if (userEmail && userPassword) {
      localStorage.setItem('user', JSON.stringify({ 
        email: userEmail, 
        role: selectedRole, 
        name: selectedRole === 'admin' ? 'Dr. Priyanshu Agarwal' : 'John Doe',
        id: selectedRole === 'admin' ? 'admin-1' : 'p1',
        patientId: selectedRole === 'patient' ? 'p1' : undefined
      }));
      navigate(selectedRole === 'admin' ? '/admin' : '/patient');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-background flex items-center justify-center p-4">
      <div className="w-full max-w-6xl grid lg:grid-cols-2 gap-8 items-center">
        {/* Hero Image */}
        <div className="hidden lg:block">
          <img 
            src={dentalHero} 
            alt="Modern Dental Office" 
            className="w-full h-[600px] object-cover rounded-2xl shadow-hover"
          />
        </div>

        {/* Login Form */}
        <div className="w-full max-w-md mx-auto">
          <Card className="shadow-hover border-0">
            <CardHeader className="text-center space-y-4">
              <div className="mx-auto w-16 h-16 bg-gradient-primary rounded-2xl flex items-center justify-center">
                <Stethoscope className="w-8 h-8 text-white" />
              </div>
              <div>
                <CardTitle className="text-2xl font-bold text-foreground">
                  Agarwal Dental Clinic
                </CardTitle>
                <p className="text-muted-foreground mt-2">
                  Welcome back! Please sign in to your account
                </p>
              </div>
            </CardHeader>

            <CardContent className="space-y-6">
              <form onSubmit={handleUserLogin} className="space-y-4">
                {/* Role Selection */}
                <div className="space-y-3">
                  <Label className="text-sm font-medium">I am a:</Label>
                  <RadioGroup
                    value={selectedRole}
                    onValueChange={(value) => setSelectedRole(value as 'admin' | 'patient')}
                    className="flex space-x-6 role-radio-group"
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="admin" id="admin" />
                      <Label htmlFor="admin" className="cursor-pointer">Admin (Dentist)</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="patient" id="patient" />
                      <Label htmlFor="patient" className="cursor-pointer">Patient</Label>
                    </div>
                  </RadioGroup>
                </div>

                {/* Email Input */}
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="email"
                      type="email"
                      placeholder="your@email.com"
                      value={userEmail}
                      onChange={(e) => setUserEmail(e.target.value)}
                      className="pl-10 email-input"
                      required
                    />
                  </div>
                </div>

                {/* Password Input */}
                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="password"
                      type="password"
                      placeholder="Enter your password (e.g. admin123)"
                      value={userPassword}
                      onChange={(e) => setUserPassword(e.target.value)}
                      className="pl-10 password-input"
                      required
                    />
                  </div>
                </div>

                {/* Login Button */}
                <Button 
                  type="submit" 
                  variant="medical" 
                  size="lg" 
                  className="w-full"
                >
                  <User className="w-4 h-4 mr-2" />
                  Sign In as {selectedRole === 'admin' ? 'Admin' : 'Patient'}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};