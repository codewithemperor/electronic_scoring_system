"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { 
  Users, 
  FileText, 
  BarChart3, 
  Shield, 
  Clock, 
  Zap,
  GraduationCap,
  Search,
  Download,
  Award,
  CheckCircle,
  ArrowRight
} from "lucide-react"

export function FeaturesSection() {
  const features = [
    {
      icon: Users,
      title: "Multi-Role Access",
      description: "Dedicated portals for candidates, administrators, screening officers, and department heads with role-based permissions.",
      color: "text-blue-600",
      bgColor: "bg-blue-100"
    },
    {
      icon: FileText,
      title: "Smart Screening",
      description: "Automated evaluation system with customizable criteria, weighted scoring, and real-time validation.",
      color: "text-green-600",
      bgColor: "bg-green-100"
    },
    {
      icon: BarChart3,
      title: "Advanced Analytics",
      description: "Comprehensive dashboards, real-time statistics, and detailed reporting for data-driven decisions.",
      color: "text-purple-600",
      bgColor: "bg-purple-100"
    },
    {
      icon: Shield,
      title: "Secure & Compliant",
      description: "Enterprise-grade security with audit trails, data encryption, and compliance with educational standards.",
      color: "text-red-600",
      bgColor: "bg-red-100"
    },
    {
      icon: Clock,
      title: "Real-time Processing",
      description: "Instant candidate evaluation, status updates, and progress tracking for improved efficiency.",
      color: "text-orange-600",
      bgColor: "bg-orange-100"
    },
    {
      icon: Zap,
      title: "Lightning Fast",
      description: "Optimized performance with quick load times and seamless user experience across all devices.",
      color: "text-yellow-600",
      bgColor: "bg-yellow-100"
    }
  ]

  const capabilities = [
    {
      icon: GraduationCap,
      title: "Candidate Management",
      items: [
        "Online registration and profile management",
        "Document upload and verification",
        "Application tracking and status monitoring"
      ]
    },
    {
      icon: Search,
      title: "Advanced Search",
      items: [
        "Multi-dimensional candidate filtering",
        "Real-time search results",
        "Bulk operations and data export"
      ]
    },
    {
      icon: Download,
      title: "Reporting System",
      items: [
        "Multiple report formats (PDF, CSV, Excel)",
        "Customizable report templates",
        "Automated report generation and scheduling"
      ]
    },
    {
      icon: Award,
      title: "Quality Assurance",
      items: [
        "Standardized evaluation criteria",
        "Audit trails and compliance tracking",
        "Quality metrics and performance monitoring"
      ]
    }
  ]

  return (
    <section className="py-24 bg-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <Badge className="inline-flex items-center gap-2 bg-blue-100 text-blue-800 px-4 py-2 rounded-full mb-4">
            <CheckCircle className="h-4 w-4" />
            <span className="text-sm font-medium">Powerful Features</span>
          </Badge>
          
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Everything You Need for
            <span className="text-blue-600"> Modern Admission Processing</span>
          </h2>
          
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            AOPESS provides a comprehensive suite of features designed to streamline every aspect of the candidate screening and admission process.
          </p>
        </div>

        {/* Main Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {features.map((feature, index) => (
            <Card key={index} className="border-0 shadow-lg hover:shadow-xl transition-shadow duration-300">
              <CardHeader className="pb-4">
                <div className="flex items-center gap-4">
                  <div className={`p-3 rounded-lg ${feature.bgColor}`}>
                    <feature.icon className={`h-6 w-6 ${feature.color}`} />
                  </div>
                  <div>
                    <CardTitle className="text-lg">{feature.title}</CardTitle>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-gray-700">
                  {feature.description}
                </CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Capabilities Section */}
        <div>
          <h3 className="text-2xl font-bold text-gray-900 text-center mb-12">
            Comprehensive Capabilities
          </h3>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {capabilities.map((capability, index) => (
              <Card key={index} className="border-0 shadow-sm">
                <CardHeader className="pb-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-gray-100 rounded-lg">
                      <capability.icon className="h-5 w-5 text-gray-700" />
                    </div>
                    <CardTitle className="text-lg">{capability.title}</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3">
                    {capability.items.map((item, itemIndex) => (
                      <li key={itemIndex} className="flex items-start gap-3">
                        <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                        <span className="text-gray-700">{item}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* CTA Section */}
        <div className="mt-16 text-center">
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-8 text-white">
            <h3 className="text-3xl font-bold mb-4">
              Ready to Transform Your Admission Process?
            </h3>
            <p className="text-xl text-blue-100 mb-6 max-w-2xl mx-auto">
              Join hundreds of institutions that have already streamlined their admission processes with AOPESS.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors flex items-center gap-2">
                Get Started Now
                <ArrowRight className="h-4 w-4" />
              </button>
              <button className="border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-blue-600 transition-colors">
                Schedule a Demo
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}