"use client"

import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Star, Quote } from "lucide-react"

const testimonials = [
  {
    name: "Dr. Adekunle Johnson",
    role: "Registrar, Adeseun Ogundoyin Polytechnic",
    content: "AOPESS has revolutionized our admission process. What used to take weeks of manual paperwork now takes days with complete accuracy and transparency.",
    rating: 5,
    avatar: "AJ"
  },
  {
    name: "Prof. Funmilayo Adebayo",
    role: "Head of Computer Science Department",
    content: "The screening system has significantly improved the quality of our candidate evaluations. The standardized criteria ensure fairness and consistency across all applications.",
    rating: 5,
    avatar: "FA"
  },
  {
    name: "John Doe",
    role: "Successful Candidate",
    content: "The registration process was seamless and I could track my application status in real-time. The system kept me informed throughout the entire process.",
    rating: 5,
    avatar: "JD"
  },
  {
    name: "Mrs. Grace Ogunleye",
    role: "Screening Officer",
    content: "As a screening officer, this system has made my job much easier. The interface is intuitive and the automated scoring saves time while maintaining accuracy.",
    rating: 4,
    avatar: "GO"
  }
]

const stats = [
  { label: "Institutions Using AOPESS", value: "25+" },
  { label: "Candidates Processed", value: "50,000+" },
  { label: "Processing Time Reduced", value: "80%" },
  { label: "User Satisfaction", value: "98%" }
]

export function TestimonialsSection() {
  return (
    <section className="py-24 bg-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <Badge className="inline-flex items-center gap-2 bg-green-100 text-green-800 px-4 py-2 rounded-full mb-4">
            <Star className="h-4 w-4" />
            <span className="text-sm font-medium">Trusted by Institutions</span>
          </Badge>
          
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            What Our Users
            <span className="text-green-600"> Say About AOPESS</span>
          </h2>
          
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Hear from educational institutions, administrators, and candidates who have transformed their admission processes with AOPESS.
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-16">
          {stats.map((stat, index) => (
            <div key={index} className="text-center">
              <div className="text-3xl md:text-4xl font-bold text-blue-600 mb-2">{stat.value}</div>
              <div className="text-gray-600 font-medium">{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Testimonials Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {testimonials.map((testimonial, index) => (
            <Card key={index} className="border-0 shadow-lg hover:shadow-xl transition-shadow duration-300">
              <CardHeader className="pb-4">
                <div className="flex items-center gap-3">
                  <Avatar>
                    <AvatarFallback>{testimonial.avatar}</AvatarFallback>
                  </Avatar>
                  <div>
                    <h4 className="font-semibold text-gray-900">{testimonial.name}</h4>
                    <p className="text-sm text-gray-600">{testimonial.role}</p>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex mb-3">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="h-4 w-4 text-yellow-400 fill-current" />
                  ))}
                </div>
                <div className="relative">
                  <Quote className="h-8 w-8 text-blue-100 absolute -top-2 -left-2" />
                  <p className="text-gray-700 text-sm relative z-10 pl-6">
                    "{testimonial.content}"
                  </p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Trust Badges */}
        <div className="mt-16 text-center">
          <h3 className="text-2xl font-bold text-gray-900 mb-8">
            Trusted by Leading Educational Institutions
          </h3>
          
          <div className="flex flex-wrap justify-center items-center gap-8 opacity-60">
            <div className="text-center">
              <div className="text-lg font-bold text-gray-700">AOPESS</div>
              <div className="text-sm text-gray-500">Flagship Institution</div>
            </div>
            <div className="text-center">
              <div className="text-lg font-bold text-gray-700">Ministry of Education</div>
              <div className="text-sm text-gray-500">Approved Solution</div>
            </div>
            <div className="text-center">
              <div className="text-lg font-bold text-gray-700">NBTE</div>
              <div className="text-sm text-gray-500">Compliant</div>
            </div>
            <div className="text-center">
              <div className="text-lg font-bold text-gray-700">JAMB</div>
              <div className="text-sm text-gray-500">Integrated</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}