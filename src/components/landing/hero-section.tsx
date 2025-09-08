"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { GraduationCap, Users, FileText, BarChart3, ArrowRight, Star, CheckCircle } from "lucide-react"
import Link from "next/link"

export function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-purple-50 overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
      
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <div className="space-y-8">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 bg-blue-100 text-blue-800 px-4 py-2 rounded-full">
              <Star className="h-4 w-4" />
              <span className="text-sm font-medium">Adeseun Ogundoyin Polytechnic Official System</span>
            </div>

            {/* Main Title */}
            <div className="space-y-4">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 leading-tight">
                Electronic
                <span className="text-blue-600"> Scoring &</span>
                <br />
                Screening System
              </h1>
              
              <p className="text-xl text-gray-600 max-w-2xl">
                Transform your admission process with AOPESS - The comprehensive digital solution for candidate evaluation, screening, and admission management.
              </p>
            </div>

            {/* Key Features */}
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <CheckCircle className="h-5 w-5 text-green-600" />
                <span className="text-gray-700">Automated candidate evaluation and scoring</span>
              </div>
              <div className="flex items-center gap-3">
                <CheckCircle className="h-5 w-5 text-green-600" />
                <span className="text-gray-700">Real-time progress tracking and status updates</span>
              </div>
              <div className="flex items-center gap-3">
                <CheckCircle className="h-5 w-5 text-green-600" />
                <span className="text-gray-700">Secure role-based access for all user types</span>
              </div>
              <div className="flex items-center gap-3">
                <CheckCircle className="h-5 w-5 text-green-600" />
                <span className="text-gray-700">Comprehensive reporting and analytics</span>
              </div>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4">
              <Link href="/auth/login">
                <Button size="lg" className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700">
                  Get Started
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
              <Link href="/auth/register">
                <Button variant="outline" size="lg" className="w-full sm:w-auto">
                  Register as Candidate
                </Button>
              </Link>
            </div>

            {/* Stats */}
            <div className="flex items-center gap-8 pt-6">
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">1000+</div>
                <div className="text-sm text-gray-600">Candidates Processed</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">95%</div>
                <div className="text-sm text-gray-600">Processing Efficiency</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-600">24/7</div>
                <div className="text-sm text-gray-600">System Availability</div>
              </div>
            </div>
          </div>

          {/* Right Content - Feature Cards */}
          <div className="space-y-6">
            <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
              <CardHeader className="pb-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <Users className="h-6 w-6 text-blue-600" />
                  </div>
                  <div>
                    <CardTitle className="text-lg">Multi-Role Access</CardTitle>
                    <CardDescription>Dedicated portals for candidates, admins, and officers</CardDescription>
                  </div>
                </div>
              </CardHeader>
            </Card>

            <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
              <CardHeader className="pb-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-green-100 rounded-lg">
                    <FileText className="h-6 w-6 text-green-600" />
                  </div>
                  <div>
                    <CardTitle className="text-lg">Smart Screening</CardTitle>
                    <CardDescription>AI-powered evaluation with customizable criteria</CardDescription>
                  </div>
                </div>
              </CardHeader>
            </Card>

            <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
              <CardHeader className="pb-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-purple-100 rounded-lg">
                    <BarChart3 className="h-6 w-6 text-purple-600" />
                  </div>
                  <div>
                    <CardTitle className="text-lg">Real Analytics</CardTitle>
                    <CardDescription>Comprehensive reporting and data insights</CardDescription>
                  </div>
                </div>
              </CardHeader>
            </Card>

            <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
              <CardHeader className="pb-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-orange-100 rounded-lg">
                    <GraduationCap className="h-6 w-6 text-orange-600" />
                  </div>
                  <div>
                    <CardTitle className="text-lg">Academic Excellence</CardTitle>
                    <CardDescription>Fair and transparent admission process</CardDescription>
                  </div>
                </div>
              </CardHeader>
            </Card>
          </div>
        </div>
      </div>

      {/* Bottom Wave */}
      <div className="absolute bottom-0 left-0 right-0">
        <svg className="w-full h-24" viewBox="0 0 1440 120" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M0 120L60 110C120 100 180 90 240 85C300 80 360 80 420 85C480 90 540 100 600 110C660 120 720 130 780 135C840 140 900 140 960 135C1020 130 1080 120 1140 110C1200 100 1260 90 1320 85C1380 80 1410 80 1440 85V120H0Z" fill="#f8fafc"/>
        </svg>
      </div>
    </section>
  )
}