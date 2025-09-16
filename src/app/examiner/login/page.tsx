"use client"

import { useState } from "react"
import { signIn } from "next-auth/react"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { loginSchema, type LoginInput } from "@/lib/validations"
import { BookOpen, PenTool } from "lucide-react"
import Link from "next/link"

export default function ExaminerLogin() {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const router = useRouter()

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
  })

  const onSubmit = async (data: LoginInput) => {
    setIsLoading(true)
    setError("")

    try {
      const result = await signIn("credentials", {
        email: data.email,
        password: data.password,
        redirect: false,
      })

      if (result?.error) {
        setError("Invalid email or password")
      } else {
        // Redirect to examiner dashboard
        router.push("/dashboard")
      }
    } catch (err) {
      setError("An error occurred. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-purple-50 to-violet-100 p-4">
      <div className="w-full max-w-md space-y-6">
        <div className="text-center">
          <div className="flex items-center justify-center mb-4">
            <BookOpen className="h-12 w-12 text-purple-600" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Examiner Portal
          </h1>
          <p className="text-lg text-gray-600">
            Adeseun Ogundoyin Polytechnic
          </p>
          <Badge variant="secondary" className="mt-2">
            Examiners
          </Badge>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Examiner Sign In</CardTitle>
            <CardDescription>
              Enter your examiner credentials to access the system
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Examiner Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="examiner@polytechnic.edu.ng"
                  {...register("email")}
                />
                {errors.email && (
                  <p className="text-sm text-red-600">{errors.email.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="Enter your password"
                  {...register("password")}
                />
                {errors.password && (
                  <p className="text-sm text-red-600">{errors.password.message}</p>
                )}
              </div>

              {error && (
                <Alert variant="destructive">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? "Signing in..." : "Sign In as Examiner"}
              </Button>
            </form>
          </CardContent>
        </Card>

        <div className="text-center space-y-2">
          <div className="flex items-center justify-center gap-4 text-sm">
            <Link href="/admin/login" className="text-purple-600 hover:underline">
              Admin Portal
            </Link>
            <Link href="/staff/login" className="text-purple-600 hover:underline">
              Staff Portal
            </Link>
            <Link href="/candidate/login" className="text-purple-600 hover:underline">
              Candidate Portal
            </Link>
          </div>
          <p className="text-gray-600">
            © 2024 Adeseun Ogundoyin Polytechnic Eruwa
          </p>
        </div>
      </div>
    </div>
  )
}