"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { 
  UserPlus, 
  FileText, 
  ClipboardCheck, 
  Award,
  ArrowRight,
  CheckCircle,
  Clock,
  Users
} from "lucide-react"

export function HowItWorksSection() {
  const steps = [
    {
      step: "01",
      icon: UserPlus,
      title: "Candidate Registration",
      description: "Candidates create accounts and complete their profiles with personal and academic information.",
      details: [
        "Simple online registration form",
        "Document upload (passport photo, O'level results)",
        "Program selection and preferences"
      ]
    },
    {
      step: "02",
      icon: FileText,
      title: "Application Processing",
      description: "Administrative staff review applications and assign candidates to screening queues.",
      details: [
        "Application verification and validation",
        "Document screening and qualification checks",
        "Queue assignment for evaluation"
      ]
    },
    {
      step: "03",
      icon: ClipboardCheck,
      title: "Smart Screening",
      description: "Screening officers evaluate candidates using standardized criteria with automated scoring.",
      details: [
        "Multi-criteria evaluation system",
        "Real-time score calculation",
        "Progress tracking and status updates"
      ]
    },
    {
      step: "04",
      icon: Award,
      title: "Decision & Admission",
      description: "Final decisions are made, admission letters are generated, and candidates are notified.",
      details: [
        "Automated decision recommendations",
        "Admission letter generation",
        "Candidate notification and onboarding"
      ]
    }
  ]

  const roles = [
    {
      icon: Users,
      title: "For Candidates",
      description: "Complete registration, track your application, and receive real-time updates on your admission status.",
      features: [
        "Self-service registration and profile management",
        "Real-time application status tracking",
        "Secure document upload and verification",
        "Direct communication with admissions office"
      ]
    },
    {
      icon: Users,
      title: "For Administrators",
      description: "Manage the entire admission process with powerful tools for oversight and decision-making.",
      features: [
        "Program management and configuration",
        "User management and role assignment",
        "System-wide analytics and reporting",
        "Audit trails and compliance monitoring"
      ]
    },
    {
      icon: Users,
      title: "For Screening Officers",
      description: "Efficiently evaluate candidates using standardized criteria and automated scoring tools.",
      features: [
        "Candidate queue management",
        "Standardized evaluation interface",
        "Real-time scoring and feedback",
        "Progress monitoring and productivity tracking"
      ]
    },
    {
      icon: Users,
      title: "For Department Heads",
      description: "Oversee department-specific admissions and ensure quality standards are met.",
      features: [
        "Department-level analytics and insights",
        "Quality assurance and approval workflows",
        "Faculty-specific reporting and metrics",
        "Strategic decision support tools"
      ]
    }
  ]

  return (
    <section className="py-24 bg-gray-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <Badge className="inline-flex items-center gap-2 bg-blue-100 text-blue-800 px-4 py-2 rounded-full mb-4">
            <Clock className="h-4 w-4" />
            <span className="text-sm font-medium">How It Works</span>
          </Badge>
          
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Streamlined Admission
            <span className="text-blue-600"> Process Flow</span>
          </h2>
          
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            AOPESS simplifies the entire admission process from registration to final decision, making it efficient and transparent for everyone involved.
          </p>
        </div>

        {/* Process Steps */}
        <div className="mb-20">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {steps.map((step, index) => (
              <div key={index} className="relative">
                {/* Step Number */}
                <div className="absolute -top-4 -left-4 w-12 h-12 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold text-lg shadow-lg">
                  {step.step}
                </div>
                
                <Card className="border-0 shadow-lg h-full pt-8">
                  <CardContent className="space-y-4">
                    <div className="flex items-center gap-3">
                      <div className="p-3 bg-blue-100 rounded-lg">
                        <step.icon className="h-6 w-6 text-blue-600" />
                      </div>
                      <h3 className="text-lg font-semibold text-gray-900">{step.title}</h3>
                    </div>
                    
                    <p className="text-gray-700">{step.description}</p>
                    
                    <ul className="space-y-2">
                      {step.details.map((detail, detailIndex) => (
                        <li key={detailIndex} className="flex items-start gap-2">
                          <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                          <span className="text-sm text-gray-600">{detail}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
                
                {/* Arrow Connector */}
                {index < steps.length - 1 && (
                  <div className="hidden lg:block absolute top-1/2 -right-4 transform -translate-y-1/2 z-10">
                    <ArrowRight className="h-6 w-6 text-gray-400" />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Role-Based Features */}
        <div>
          <h3 className="text-2xl font-bold text-gray-900 text-center mb-12">
            Designed for Every Role
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {roles.map((role, index) => (
              <Card key={index} className="border-0 shadow-sm hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="p-2 bg-gray-100 rounded-lg">
                      <role.icon className="h-5 w-5 text-gray-700" />
                    </div>
                    <h4 className="font-semibold text-gray-900">{role.title}</h4>
                  </div>
                  
                  <p className="text-sm text-gray-700 mb-4">{role.description}</p>
                  
                  <ul className="space-y-2">
                    {role.features.map((feature, featureIndex) => (
                      <li key={featureIndex} className="flex items-start gap-2">
                        <CheckCircle className="h-3 w-3 text-green-600 mt-0.5 flex-shrink-0" />
                        <span className="text-xs text-gray-600">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}