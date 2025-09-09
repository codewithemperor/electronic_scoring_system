'use client'

import React, { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Badge } from '@/components/ui/badge'
import { GraduationCap, Shield, Users, UserCheck, Eye, EyeOff } from 'lucide-react'
import { useAuth } from '@/contexts/auth-context'
import { UserRole } from '@prisma/client'

export default function LoginPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const redirect = searchParams.get('redirect')
  const { login, isLoading } = useAuth()
  
  const [selectedRole, setSelectedRole] = useState<UserRole>(UserRole.CANDIDATE)
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  })
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')

  const roles = [
    {
      id: UserRole.SUPER_ADMIN,
      title: 'Super Admin',
      description: 'System administration',
      icon: Shield,
      color: 'bg-red-500'
    },
    {
      id: UserRole.ADMIN,
      title: 'Administrator',
      description: 'Department management',
      icon: Users,
      color: 'bg-blue-500'
    },
    {
      id: UserRole.STAFF,
      title: 'Staff',
      description: 'Screening operations',
      icon: UserCheck,
      color: 'bg-green-500'
    },
    {
      id: UserRole.CANDIDATE,
      title: 'Candidate',
      description: 'Student applicant',
      icon: GraduationCap,
      color: 'bg-purple-500'
    }
  ]

  useEffect(() => {
    const roleParam = searchParams.get('role')
    if (roleParam && Object.values(UserRole).includes(roleParam as UserRole)) {
      setSelectedRole(roleParam as UserRole)
    }
  }, [searchParams])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
    setError('')
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (!formData.email || !formData.password) {
      setError('Please fill in all fields')
      return
    }

    const result = await login(formData.email, formData.password)
    
    if (result.success) {
      // Redirect based on role or specified redirect path
      if (redirect) {
        router.push(redirect)
      } else {
        const dashboardPath = `/dashboard/${selectedRole.toLowerCase().replace('_', '-')}`
        router.push(dashboardPath)
      }
    } else {
      setError(result.error || 'Login failed')
    }
  }

  const handleRoleChange = (role: UserRole) => {
    setSelectedRole(role)
    setError('')
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="w-full max-w-6xl">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-4">
            <div className="w-16 h-16 bg-blue-600 rounded-lg flex items-center justify-center">
              <GraduationCap className="w-10 h-10 text-white" />
            </div>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Adeseun Ogundoyin Polytechnic Eruwa
          </h1>
          <p className="text-lg text-gray-600">
            Electronic Scoring and Screening System
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Role Selection */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Shield className="w-5 h-5 mr-2" />
                  Select Your Role
                </CardTitle>
                <CardDescription>
                  Choose your role to access the appropriate portal
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4">
                  {roles.map((role) => (
                    <Card
                      key={role.id}
                      className={`cursor-pointer transition-all duration-200 ${
                        selectedRole === role.id
                          ? 'ring-2 ring-blue-500 bg-blue-50'
                          : 'hover:shadow-md'
                      }`}
                      onClick={() => handleRoleChange(role.id)}
                    >
                      <CardContent className="p-4 text-center">
                        <div className={`w-12 h-12 mx-auto ${role.color} rounded-full flex items-center justify-center mb-3`}>
                          <role.icon className="w-6 h-6 text-white" />
                        </div>
                        <h3 className="font-semibold text-sm mb-1">{role.title}</h3>
                        <p className="text-xs text-gray-600">{role.description}</p>
                        {selectedRole === role.id && (
                          <Badge className="mt-2 text-xs">Selected</Badge>
                        )}
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* System Information */}
            <Card>
              <CardHeader>
                <CardTitle>System Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Academic Year:</span>
                  <Badge variant="secondary">2025/2025</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Status:</span>
                  <Badge className="bg-green-100 text-green-800">Active</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Support:</span>
                  <span className="text-sm text-blue-600">support@aope.edu.ng</span>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Login Form */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                {roles.find(r => r.id === selectedRole)?.icon && (
                  <div className={`w-8 h-8 ${roles.find(r => r.id === selectedRole)?.color} rounded-full flex items-center justify-center mr-3`}>
                    {React.createElement(roles.find(r => r.id === selectedRole)!.icon, { className: "w-4 h-4 text-white" })}
                  </div>
                )}
                {roles.find(r => r.id === selectedRole)?.title} Login
              </CardTitle>
              <CardDescription>
                Enter your credentials to access the {roles.find(r => r.id === selectedRole)?.title.toLowerCase()} portal
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                {error && (
                  <Alert variant="destructive">
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                )}

                <div className="space-y-2">
                  <Label htmlFor="email">Email Address</Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="Enter your email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <div className="relative">
                    <Input
                      id="password"
                      name="password"
                      type={showPassword ? 'text' : 'password'}
                      placeholder="Enter your password"
                      value={formData.password}
                      onChange={handleInputChange}
                      required
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                </div>

                <Button
                  type="submit"
                  className="w-full"
                  disabled={isLoading}
                >
                  {isLoading ? 'Signing in...' : 'Sign In'}
                </Button>

                {selectedRole === UserRole.CANDIDATE && (
                  <div className="text-center">
                    <p className="text-sm text-gray-600">
                      Don't have an account?{' '}
                      <a href="/register" className="text-blue-600 hover:underline">
                        Register here
                      </a>
                    </p>
                  </div>
                )}

                <div className="text-center">
                  <a href="/forgot-password" className="text-sm text-blue-600 hover:underline">
                    Forgot your password?
                  </a>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}