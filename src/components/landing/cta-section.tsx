"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { 
  ArrowRight, 
  CheckCircle, 
  Clock, 
  Users, 
  BarChart3,
  Shield,
  Zap,
  Star,
  Award,
  Phone,
  Mail,
  MapPin
} from "lucide-react"

export function CTASection() {
  const benefits = [
    { icon: CheckCircle, text: "Free Setup & Installation" },
    { icon: Clock, text: "Quick Implementation - 48 Hours" },
    { icon: Users, text: "Unlimited User Support" },
    { icon: BarChart3, text: "Real-time Analytics" },
    { icon: Shield, text: "Enterprise Security" },
    { icon: Zap, text: "Lightning Fast Performance" }
  ]

  const contactInfo = [
    { icon: Phone, value: "+234 801 234 5678", label: "Phone Support" },
    { icon: Mail, value: "support@aopess.edu.ng", label: "Email Support" },
    { icon: MapPin, value: "Eruwa, Oyo State, Nigeria", label: "Office Location" }
  ]

  return (
    <section className="py-24 bg-gradient-to-br from-blue-600 to-purple-700">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <div className="space-y-8">
            <Badge className="inline-flex items-center gap-2 bg-white/20 text-white px-4 py-2 rounded-full">
              <Award className="h-4 w-4" />
              <span className="text-sm font-medium">Get Started Today</span>
            </Badge>

            <h2 className="text-4xl font-bold text-white leading-tight">
              Ready to Transform Your
              <span className="text-yellow-300"> Admission Process?</span>
            </h2>
            
            <p className="text-xl text-blue-100">
              Join hundreds of educational institutions that have already streamlined their admission processes with AOPESS. Get started in minutes, not months.
            </p>

            {/* Benefits List */}
            <div className="space-y-3">
              {benefits.map((benefit, index) => (
                <div key={index} className="flex items-center gap-3">
                  <div className="p-1 bg-white/20 rounded-lg">
                    <benefit.icon className="h-4 w-4 text-white" />
                  </div>
                  <span className="text-white">{benefit.text}</span>
                </div>
              ))}
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4">
              <Button size="lg" className="bg-yellow-400 text-blue-900 hover:bg-yellow-300 font-semibold">
                Start Free Trial
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
              <Button variant="outline" size="lg" className="border-white text-white hover:bg-white hover:text-blue-900 font-semibold">
                Schedule Demo
              </Button>
            </div>

            {/* Trust Indicators */}
            <div className="flex items-center gap-6 pt-4">
              <div className="flex items-center gap-1">
                <Star className="h-4 w-4 text-yellow-400 fill-current" />
                <Star className="h-4 w-4 text-yellow-400 fill-current" />
                <Star className="h-4 w-4 text-yellow-400 fill-current" />
                <Star className="h-4 w-4 text-yellow-400 fill-current" />
                <Star className="h-4 w-4 text-yellow-400 fill-current" />
                <span className="text-white text-sm ml-1">4.9/5 Rating</span>
              </div>
              <div className="text-white text-sm">•</div>
              <div className="text-white text-sm">1000+ Active Institutions</div>
              <div className="text-white text-sm">•</div>
              <div className="text-white text-sm">98% Satisfaction Rate</div>
            </div>
          </div>

          {/* Right Content - Contact Card */}
          <div>
            <Card className="border-0 shadow-2xl bg-white/10 backdrop-blur-sm">
              <CardContent className="p-8">
                <div className="text-center mb-6">
                  <h3 className="text-2xl font-bold text-white mb-2">
                    Get in Touch
                  </h3>
                  <p className="text-blue-100">
                    Have questions? Our team is here to help you get started with AOPESS.
                  </p>
                </div>

                {/* Contact Form */}
                <form className="space-y-4 mb-6">
                  <div>
                    <input
                      type="text"
                      placeholder="Your Name"
                      className="w-full px-4 py-3 rounded-lg bg-white/20 text-white placeholder-blue-200 border border-white/30 focus:outline-none focus:border-white/50"
                    />
                  </div>
                  <div>
                    <input
                      type="email"
                      placeholder="Your Email"
                      className="w-full px-4 py-3 rounded-lg bg-white/20 text-white placeholder-blue-200 border border-white/30 focus:outline-none focus:border-white/50"
                    />
                  </div>
                  <div>
                    <input
                      type="text"
                      placeholder="Institution Name"
                      className="w-full px-4 py-3 rounded-lg bg-white/20 text-white placeholder-blue-200 border border-white/30 focus:outline-none focus:border-white/50"
                    />
                  </div>
                  <div>
                    <textarea
                      placeholder="How can we help you?"
                      rows={3}
                      className="w-full px-4 py-3 rounded-lg bg-white/20 text-white placeholder-blue-200 border border-white/30 focus:outline-none focus:border-white/50 resize-none"
                    />
                  </div>
                  <Button type="submit" className="w-full bg-yellow-400 text-blue-900 hover:bg-yellow-300 font-semibold">
                    Send Message
                  </Button>
                </form>

                {/* Contact Information */}
                <div className="space-y-3 pt-6 border-t border-white/20">
                  {contactInfo.map((info, index) => (
                    <div key={index} className="flex items-center gap-3">
                      <div className="p-2 bg-white/20 rounded-lg">
                        <info.icon className="h-4 w-4 text-white" />
                      </div>
                      <div>
                        <div className="text-white font-medium">{info.value}</div>
                        <div className="text-blue-200 text-sm">{info.label}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </section>
  )
}