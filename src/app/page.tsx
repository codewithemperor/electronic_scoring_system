'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { GraduationCap, Users, Shield, UserCheck, BookOpen, Award, Clock, BarChart3 } from 'lucide-react'

export default function Home() {
  const [selectedRole, setSelectedRole] = useState<string | null>(null)

  const roles = [
    {
      id: 'super-admin',
      title: 'Super Admin',
      description: 'Complete system control and configuration',
      icon: Shield,
      color: 'bg-red-500 hover:bg-red-600',
      features: ['System-wide settings', 'User management', 'Audit logs', 'System configuration']
    },
    {
      id: 'admin',
      title: 'Administrator',
      description: 'Department and program management',
      icon: Users,
      color: 'bg-blue-500 hover:bg-blue-600',
      features: ['Department management', 'Program oversight', 'Staff supervision', 'Report generation']
    },
    {
      id: 'staff',
      title: 'Staff',
      description: 'Screening operations and candidate evaluation',
      icon: UserCheck,
      color: 'bg-green-500 hover:bg-green-600',
      features: ['Candidate screening', 'Score management', 'Exam supervision', 'Result processing']
    },
    {
      id: 'candidate',
      title: 'Candidate',
      description: 'Registration and screening participation',
      icon: GraduationCap,
      color: 'bg-purple-500 hover:bg-purple-600',
      features: ['Self-registration', 'Profile management', 'Screening participation', 'Result viewing']
    }
  ]

  const features = [
    {
      icon: Clock,
      title: 'Fast Processing',
      description: 'Automated scoring reduces processing time from days to minutes'
    },
    {
      icon: BarChart3,
      title: 'Real-time Analytics',
      description: 'Live dashboards and comprehensive reporting system'
    },
    {
      icon: Award,
      title: 'Accurate Evaluation',
      description: 'Eliminate human error with automated scoring algorithms'
    },
    {
      icon: BookOpen,
      title: 'Academic Excellence',
      description: 'Designed specifically for educational institutions'
    }
  ]

  const handleRoleSelect = (roleId: string) => {
    // Navigate to the appropriate login page
    switch (roleId) {
      case 'super-admin':
        window.location.href = '/login/super-admin'
        break
      case 'admin':
        window.location.href = '/login/admin'
        break
      case 'staff':
        window.location.href = '/login/staff'
        break
      case 'candidate':
        window.location.href = '/login/candidate'
        break
      default:
        window.location.href = '/login/candidate'
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center">
                <GraduationCap className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Adeseun Ogundoyin Polytechnic Eruwa</h1>
                <p className="text-sm text-gray-600">Electronic Scoring and Screening System</p>
              </div>
            </div>
            <Badge variant="secondary" className="bg-blue-100 text-blue-800">
              Academic Year 2025/2025
            </Badge>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-bold text-gray-900 mb-6">
            Transforming Admission Processing with Technology
          </h2>
          <p className="text-xl text-gray-600 mb-8 leading-relaxed">
            Experience a modern, efficient, and transparent electronic scoring and screening system 
            designed specifically for Adeseun Ogundoyin Polytechnic Eruwa. Automate candidate evaluation, 
            reduce processing time, and enhance admission accuracy.
          </p>
          <div className="flex justify-center space-x-4">
            <Badge variant="outline" className="px-4 py-2 text-sm">
              <Users className="w-4 h-4 mr-2" />
              Multi-Role Access
            </Badge>
            <Badge variant="outline" className="px-4 py-2 text-sm">
              <Shield className="w-4 h-4 mr-2" />
              Secure & Compliant
            </Badge>
            <Badge variant="outline" className="px-4 py-2 text-sm">
              <Clock className="w-4 h-4 mr-2" />
              Real-time Processing
            </Badge>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-12 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <h3 className="text-3xl font-bold text-center text-gray-900 mb-12">Key Features</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="text-center hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="w-16 h-16 mx-auto bg-blue-100 rounded-full flex items-center justify-center mb-4">
                    <feature.icon className="w-8 h-8 text-blue-600" />
                  </div>
                  <CardTitle className="text-lg">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription>{feature.description}</CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Role Selection Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <h3 className="text-3xl font-bold text-center text-gray-900 mb-4">Select Your Role</h3>
          <p className="text-center text-gray-600 mb-12">
            Choose your role to access the appropriate portal and features
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {roles.map((role) => (
              <Card 
                key={role.id} 
                className={`cursor-pointer transition-all duration-200 hover:shadow-xl hover:scale-105 ${
                  selectedRole === role.id ? 'ring-2 ring-blue-500 shadow-lg scale-105' : ''
                }`}
                onClick={() => handleRoleSelect(role.id)}
              >
                <CardHeader className="text-center pb-4">
                  <div className={`w-16 h-16 mx-auto ${role.color} rounded-full flex items-center justify-center mb-4 transition-transform duration-200 hover:scale-110`}>
                    <role.icon className="w-8 h-8 text-white" />
                  </div>
                  <CardTitle className="text-xl">{role.title}</CardTitle>
                  <CardDescription>{role.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {role.features.map((feature, index) => (
                      <div key={index} className="flex items-center text-sm text-gray-600">
                        <div className="w-2 h-2 bg-blue-500 rounded-full mr-3 animate-pulse"></div>
                        {feature}
                      </div>
                    ))}
                  </div>
                  <Button 
                    className={`w-full mt-4 ${role.color} text-white transition-all duration-200 ${
                      selectedRole === role.id ? 'shadow-lg' : 'hover:shadow-md'
                    }`}
                    variant={selectedRole === role.id ? "default" : "outline"}
                  >
                    {selectedRole === role.id ? 'Selected' : 'Select Role'}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* System Overview Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-4xl mx-auto">
          <h3 className="text-3xl font-bold text-center text-gray-900 mb-12">System Overview</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <BookOpen className="w-6 h-6 mr-2 text-blue-600" />
                  For Candidates
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3 text-gray-600">
                  <li className="flex items-start">
                    <div className="w-2 h-2 bg-green-500 rounded-full mr-3 mt-2"></div>
                    <span>Easy online registration and profile management</span>
                  </li>
                  <li className="flex items-start">
                    <div className="w-2 h-2 bg-green-500 rounded-full mr-3 mt-2"></div>
                    <span>Real-time screening status updates</span>
                  </li>
                  <li className="flex items-start">
                    <div className="w-2 h-2 bg-green-500 rounded-full mr-3 mt-2"></div>
                    <span>Instant access to screening results</span>
                  </li>
                  <li className="flex items-start">
                    <div className="w-2 h-2 bg-green-500 rounded-full mr-3 mt-2"></div>
                    <span>Secure document upload and management</span>
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Users className="w-6 h-6 mr-2 text-blue-600" />
                  For Administrators
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3 text-gray-600">
                  <li className="flex items-start">
                    <div className="w-2 h-2 bg-green-500 rounded-full mr-3 mt-2"></div>
                    <span>Automated candidate scoring and evaluation</span>
                  </li>
                  <li className="flex items-start">
                    <div className="w-2 h-2 bg-green-500 rounded-full mr-3 mt-2"></div>
                    <span>Comprehensive analytics and reporting</span>
                  </li>
                  <li className="flex items-start">
                    <div className="w-2 h-2 bg-green-500 rounded-full mr-3 mt-2"></div>
                    <span>Department and program management</span>
                  </li>
                  <li className="flex items-start">
                    <div className="w-2 h-2 bg-green-500 rounded-full mr-3 mt-2"></div>
                    <span>Audit trails and compliance tracking</span>
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <div className="flex items-center space-x-3 mb-4">
                <GraduationCap className="w-8 h-8 text-blue-400" />
                <h4 className="text-lg font-semibold">AOPE Eruwa</h4>
              </div>
              <p className="text-gray-400 text-sm">
                Adeseun Ogundoyin Polytechnic Eruwa - Committed to academic excellence and technological innovation.
              </p>
            </div>
            
            <div>
              <h4 className="text-lg font-semibold mb-4">Quick Links</h4>
              <ul className="space-y-2 text-gray-400 text-sm">
                <li><a href="#" className="hover:text-white transition-colors">About Us</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Admissions</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Programs</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Contact</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="text-lg font-semibold mb-4">Support</h4>
              <ul className="space-y-2 text-gray-400 text-sm">
                <li><a href="#" className="hover:text-white transition-colors">Help Center</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Technical Support</a></li>
                <li><a href="#" className="hover:text-white transition-colors">User Guide</a></li>
                <li><a href="#" className="hover:text-white transition-colors">FAQs</a></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400 text-sm">
            <p>&copy; 2025 Adeseun Ogundoyin Polytechnic Eruwa. All rights reserved. | Electronic Scoring and Screening System</p>
          </div>
        </div>
      </footer>
    </div>
  )
}