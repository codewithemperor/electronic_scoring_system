"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Badge } from "@/components/ui/badge"
import { User, Lock, GraduationCap, Eye, EyeOff } from "lucide-react"

const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  role: z.string().min(1, "Please select your role"),
})

type LoginFormData = z.infer<typeof loginSchema>

interface LoginFormProps {
  onLogin: (data: LoginFormData) => void
  isLoading?: boolean
}

export function LoginForm({ onLogin, isLoading = false }: LoginFormProps) {
  const [showPassword, setShowPassword] = useState(false)
  const [selectedRole, setSelectedRole] = useState<string>("")

  const form = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
      role: "",
    },
  })

  const roles = [
    {
      value: "CANDIDATE",
      label: "Candidate",
      description: "For applicants and students",
      color: "bg-blue-100 text-blue-800",
      icon: User
    },
    {
      value: "ADMIN",
      label: "Administrator",
      description: "System administrators and managers",
      color: "bg-purple-100 text-purple-800",
      icon: GraduationCap
    },
    {
      value: "OFFICER",
      label: "Screening Officer",
      description: "Admission and screening staff",
      color: "bg-green-100 text-green-800",
      icon: User
    },
    {
      value: "HOD",
      label: "Head of Department",
      description: "Department heads and deans",
      color: "bg-orange-100 text-orange-800",
      icon: GraduationCap
    }
  ]

  const onSubmit = (data: LoginFormData) => {
    onLogin(data)
  }

  return (
    <Card className="w-full max-w-md mx-auto border-0 shadow-lg">
      <CardHeader className="text-center">
        <div className="flex justify-center mb-4">
          <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center">
            <GraduationCap className="h-8 w-8 text-white" />
          </div>
        </div>
        <CardTitle className="text-2xl font-bold text-gray-900">
          AOPESS Portal
        </CardTitle>
        <CardDescription className="text-gray-600">
          Adeseun Ogundoyin Polytechnic Electronic Scoring & Screening System
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {/* Role Selection */}
            <FormField
              control={form.control}
              name="role"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Select Your Role *</FormLabel>
                  <div className="grid grid-cols-2 gap-3">
                    {roles.map((role) => (
                      <div
                        key={role.value}
                        className={`border-2 rounded-lg p-3 cursor-pointer transition-all hover:shadow-md ${
                          selectedRole === role.value || field.value === role.value
                            ? "border-blue-500 bg-blue-50"
                            : "border-gray-200"
                        }`}
                        onClick={() => {
                          setSelectedRole(role.value)
                          field.onChange(role.value)
                        }}
                      >
                        <div className="flex items-center gap-2">
                          <role.icon className="h-4 w-4" />
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="font-medium text-sm">{role.label}</span>
                              <Badge className={role.color} variant="secondary">
                                {role.value}
                              </Badge>
                            </div>
                            <p className="text-xs text-gray-600 mt-1">{role.description}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Email */}
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email Address *</FormLabel>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                    <Input
                      type="email"
                      placeholder="Enter your email address"
                      className="pl-10"
                      {...field}
                    />
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Password */}
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password *</FormLabel>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                    <Input
                      type={showPassword ? "text" : "password"}
                      placeholder="Enter your password"
                      className="pl-10 pr-10"
                      {...field}
                    />
                    <button
                      type="button"
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Submit Button */}
            <Button
              type="submit"
              className="w-full"
              disabled={isLoading || !form.formState.isValid}
            >
              {isLoading ? "Signing in..." : "Sign In"}
            </Button>

            {/* Additional Links */}
            <div className="text-center space-y-2 text-sm">
              <a href="#" className="text-blue-600 hover:text-blue-800">
                Forgot your password?
              </a>
              {selectedRole === "CANDIDATE" && (
                <div className="pt-2 border-t border-gray-200">
                  <a href="#" className="text-blue-600 hover:text-blue-800">
                    Don't have an account? Register as a candidate
                  </a>
                </div>
              )}
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  )
}