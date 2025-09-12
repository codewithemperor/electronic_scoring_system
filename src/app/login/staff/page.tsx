'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { UserCheck, Eye, EyeOff, GraduationCap } from 'lucide-react'
import { useAuth } from '@/contexts/auth-context'
import { useToast } from '@/hooks/use-toast'

export default function StaffLoginPage() {
  const router = useRouter()
  const { loginStaff, isLoading } = useAuth()
  const { toast } = useToast()
  
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  })
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')

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
      toast({
        title: "Validation Error",
        description: "Please fill in all fields",
        variant: "destructive",
      })
      return
    }

    const result = await loginStaff(formData.email, formData.password)
    
    if (result.success) {
      // Show success toast
      toast({
        title: "Login Successful",
        description: `Welcome back!`,
      })
      
      // Redirect to staff dashboard
      router.push('/dashboard/staff')
    } else {
      setError(result.error || 'Login failed')
      toast({
        title: "Login Failed",
        description: result.error || 'Login failed',
        variant: "destructive",
      })
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-4">
            <div className="w-16 h-16 bg-green-600 rounded-lg flex items-center justify-center">
              <UserCheck className="w-10 h-10 text-white" />
            </div>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Staff Login
          </h1>
          <p className="text-lg text-gray-600">
            Adeseun Ogundoyin Polytechnic Eruwa
          </p>
          <p className="text-sm text-gray-500 mt-2">
            Electronic Scoring and Screening System
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <UserCheck className="w-5 h-5 mr-2 text-green-600" />
              Staff Portal
            </CardTitle>
            <CardDescription>
              Enter your staff credentials to access screening operations
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
                className="w-full bg-green-600 hover:bg-green-700"
                disabled={isLoading}
              >
                {isLoading ? 'Signing in...' : 'Sign In as Staff'}
              </Button>

              <div className="text-center">
                <a href="/forgot-password" className="text-sm text-green-600 hover:underline">
                  Forgot your password?
                </a>
              </div>
            </form>
          </CardContent>
        </Card>

        <div className="mt-6 text-center">
          <div className="flex items-center justify-center space-x-4 text-sm text-gray-600">
            <a href="/login/super-admin" className="hover:text-green-600 transition-colors">
              Super Admin
            </a>
            <span>•</span>
            <a href="/login/admin" className="hover:text-green-600 transition-colors">
              Admin Login
            </a>
            <span>•</span>
            <a href="/login/candidate" className="hover:text-green-600 transition-colors">
              Candidate Login
            </a>
          </div>
        </div>

        <div className="mt-8 text-center">
          <div className="flex items-center justify-center mb-2">
            <GraduationCap className="w-5 h-5 text-gray-400 mr-2" />
            <span className="text-sm text-gray-500">Academic Year 2025/2025</span>
          </div>
          <p className="text-xs text-gray-400">
            © 2025 Adeseun Ogundoyin Polytechnic Eruwa. All rights reserved.
          </p>
        </div>
      </div>
    </div>
  )
}