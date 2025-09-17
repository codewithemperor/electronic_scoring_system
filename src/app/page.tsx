"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { 
  GraduationCap, 
  Users, 
  BookOpen, 
  Award, 
  ArrowRight,
  CheckCircle,
  Clock,
  Shield
} from "lucide-react"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center">
              <GraduationCap className="h-8 w-8 text-blue-600 mr-3" />
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Adeseun Ogundoyin Polytechnic</h1>
                <p className="text-sm text-gray-600">Electronic Scoring and Screening System</p>
              </div>
            </div>
            <nav className="flex space-x-4">
              <Link href="/candidate/login" className="text-blue-600 hover:text-blue-800 font-medium">
                Candidate Login
              </Link>
              <Link href="/admin/login" className="text-blue-600 hover:text-blue-800 font-medium">
                Admin Login
              </Link>
            </nav>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <h2 className="text-4xl font-extrabold text-gray-900 sm:text-5xl">
            Welcome to the Future of
            <span className="text-blue-600"> Academic Screening</span>
          </h2>
          <p className="mt-6 text-xl text-gray-600 max-w-3xl mx-auto">
            Experience a seamless, secure, and efficient electronic scoring and screening system designed 
            to streamline the admission process at Adeseun Ogundoyin Polytechnic Eruwa.
          </p>
          <div className="mt-10 flex justify-center gap-4">
            <Link href="/candidate/register">
              <Button size="lg" className="bg-blue-600 hover:bg-blue-700">
                Get Started as Candidate
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
            <Link href="/admin/login">
              <Button variant="outline" size="lg">
                Admin Portal
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h3 className="text-3xl font-bold text-gray-900">Why Choose Our System?</h3>
            <p className="mt-4 text-lg text-gray-600">
              Advanced features designed to make academic screening efficient and transparent
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card className="text-center">
              <CardHeader>
                <div className="mx-auto w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                  <Clock className="h-6 w-6 text-blue-600" />
                </div>
                <CardTitle className="mt-4">Real-time Processing</CardTitle>
                <CardDescription>
                  Instant scoring and result generation with no delays
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="text-center">
              <CardHeader>
                <div className="mx-auto w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                  <Shield className="h-6 w-6 text-green-600" />
                </div>
                <CardTitle className="mt-4">Secure & Reliable</CardTitle>
                <CardDescription>
                  Advanced security measures to protect sensitive candidate data
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="text-center">
              <CardHeader>
                <div className="mx-auto w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                  <Users className="h-6 w-6 text-purple-600" />
                </div>
                <CardTitle className="mt-4">User-Friendly</CardTitle>
                <CardDescription>
                  Intuitive interface designed for all user types
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="text-center">
              <CardHeader>
                <div className="mx-auto w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                  <BookOpen className="h-6 w-6 text-orange-600" />
                </div>
                <CardTitle className="mt-4">Comprehensive Testing</CardTitle>
                <CardDescription>
                  Support for various question types and difficulty levels
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="text-center">
              <CardHeader>
                <div className="mx-auto w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
                  <Award className="h-6 w-6 text-red-600" />
                </div>
                <CardTitle className="mt-4">Accurate Evaluation</CardTitle>
                <CardDescription>
                  Precise scoring algorithms ensuring fair assessment
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="text-center">
              <CardHeader>
                <div className="mx-auto w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center">
                  <CheckCircle className="h-6 w-6 text-indigo-600" />
                </div>
                <CardTitle className="mt-4">Audit Trail</CardTitle>
                <CardDescription>
                  Complete transparency with comprehensive logging
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      </section>

      {/* Portal Access Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h3 className="text-3xl font-bold text-gray-900">Access Your Portal</h3>
            <p className="mt-4 text-lg text-gray-600">
              Choose the appropriate portal based on your role
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Link href="/candidate/login">
              <Card className="hover:shadow-lg transition-shadow cursor-pointer">
                <CardHeader className="text-center">
                  <div className="mx-auto w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4">
                    <Users className="h-8 w-8 text-blue-600" />
                  </div>
                  <CardTitle>Candidate Portal</CardTitle>
                  <CardDescription>
                    For students applying for admission
                  </CardDescription>
                </CardHeader>
                <CardContent className="text-center">
                  <Button variant="outline" className="w-full">
                    Access Portal
                  </Button>
                </CardContent>
              </Card>
            </Link>

            <Link href="/admin/login">
              <Card className="hover:shadow-lg transition-shadow cursor-pointer">
                <CardHeader className="text-center">
                  <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
                    <Shield className="h-8 w-8 text-green-600" />
                  </div>
                  <CardTitle>Admin Portal</CardTitle>
                  <CardDescription>
                    For system administrators
                  </CardDescription>
                </CardHeader>
                <CardContent className="text-center">
                  <Button variant="outline" className="w-full">
                    Access Portal
                  </Button>
                </CardContent>
              </Card>
            </Link>

            <Link href="/staff/login">
              <Card className="hover:shadow-lg transition-shadow cursor-pointer">
                <CardHeader className="text-center">
                  <div className="mx-auto w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mb-4">
                    <BookOpen className="h-8 w-8 text-purple-600" />
                  </div>
                  <CardTitle>Staff Portal</CardTitle>
                  <CardDescription>
                    For academic staff members
                  </CardDescription>
                </CardHeader>
                <CardContent className="text-center">
                  <Button variant="outline" className="w-full">
                    Access Portal
                  </Button>
                </CardContent>
              </Card>
            </Link>

            <Link href="/examiner/login">
              <Card className="hover:shadow-lg transition-shadow cursor-pointer">
                <CardHeader className="text-center">
                  <div className="mx-auto w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mb-4">
                    <Award className="h-8 w-8 text-orange-600" />
                  </div>
                  <CardTitle>Examiner Portal</CardTitle>
                  <CardDescription>
                    For examiners and assessors
                  </CardDescription>
                </CardHeader>
                <CardContent className="text-center">
                  <Button variant="outline" className="w-full">
                    Access Portal
                  </Button>
                </CardContent>
              </Card>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <div className="flex items-center mb-4">
                <GraduationCap className="h-8 w-8 text-blue-400 mr-3" />
                <h4 className="text-lg font-semibold">AOPE Eruwa</h4>
              </div>
              <p className="text-gray-400">
                Adeseun Ogundoyin Polytechnic Eruwa - Leading in technological education and innovation.
              </p>
            </div>
            
            <div>
              <h4 className="text-lg font-semibold mb-4">Quick Links</h4>
              <ul className="space-y-2 text-gray-400">
                <li><Link href="/candidate/register" className="hover:text-white">Candidate Registration</Link></li>
                <li><Link href="/candidate/login" className="hover:text-white">Candidate Login</Link></li>
                <li><Link href="/admin/login" className="hover:text-white">Admin Portal</Link></li>
                <li><Link href="/staff/login" className="hover:text-white">Staff Portal</Link></li>
              </ul>
            </div>
            
            <div>
              <h4 className="text-lg font-semibold mb-4">Contact Info</h4>
              <ul className="space-y-2 text-gray-400">
                <li>Email: support@polytechnic.edu.ng</li>
                <li>Phone: +234 XXX XXX XXXX</li>
                <li>Address: Eruwa, Oyo State, Nigeria</li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2024 Adeseun Ogundoyin Polytechnic Eruwa. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}