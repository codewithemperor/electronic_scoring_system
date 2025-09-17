"use client"

import { useSession } from "next-auth/react"
import { useRouter, usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  LayoutDashboard,
  User,
  BookOpen,
  ClipboardList,
  TrendingUp,
  LogOut,
  ChevronLeft,
  ChevronRight,
  Menu,
  X
} from "lucide-react"
import { useState } from "react"
import Link from "next/link"

interface CandidateSidebarProps {
  className?: string
}

const sidebarItems = [
  {
    title: "Dashboard",
    href: "/candidate/dashboard",
    icon: LayoutDashboard,
    description: "Overview and statistics"
  },
  {
    title: "My Profile",
    href: "/candidate/profile",
    icon: User,
    description: "View and edit your information"
  },
  {
    title: "Available Tests",
    href: "/candidate/available-tests",
    icon: BookOpen,
    description: "View and start available tests"
  },
  {
    title: "Test Results",
    href: "/candidate/test-results",
    icon: TrendingUp,
    description: "View your test scores and results"
  },
  {
    title: "Registration",
    href: "/candidate/register",
    icon: ClipboardList,
    description: "Update registration details"
  }
]

export function CandidateSidebar({ className }: CandidateSidebarProps) {
  const [isCollapsed, setIsCollapsed] = useState(false)
  const [isMobileOpen, setIsMobileOpen] = useState(false)
  const pathname = usePathname()
  const router = useRouter()
  const { data: session } = useSession()

  const handleSignOut = () => {
    router.push("/candidate/login")
  }

  return (
    <>
      {/* Mobile overlay */}
      {isMobileOpen && (
        <div 
          className="fixed inset-0 z-50 bg-black/50 lg:hidden"
          onClick={() => setIsMobileOpen(false)}
        />
      )}
      
      {/* Sidebar */}
      <div className={cn(
        "fixed left-0 top-0 z-50 h-full bg-white border-r transition-all duration-300",
        isCollapsed ? "w-16" : "w-64",
        "lg:relative lg:translate-x-0",
        isMobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0",
        className
      )}>
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b">
            {!isCollapsed && (
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                  <BookOpen className="h-5 w-5 text-white" />
                </div>
                <div>
                  <h2 className="font-semibold text-lg">Candidate</h2>
                  <p className="text-xs text-gray-500">Portal</p>
                </div>
              </div>
            )}
            
            <div className="flex items-center space-x-1">
              {/* Mobile close button */}
              <Button
                variant="ghost"
                size="sm"
                className="lg:hidden"
                onClick={() => setIsMobileOpen(false)}
              >
                <X className="h-4 w-4" />
              </Button>
              
              {/* Collapse toggle */}
              <Button
                variant="ghost"
                size="sm"
                className="hidden lg:flex"
                onClick={() => setIsCollapsed(!isCollapsed)}
              >
                {isCollapsed ? (
                  <ChevronRight className="h-4 w-4" />
                ) : (
                  <ChevronLeft className="h-4 w-4" />
                )}
              </Button>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-4 space-y-2">
            {sidebarItems.map((item) => {
              const isActive = pathname === item.href
              const Icon = item.icon
              
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "flex items-center space-x-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors",
                    isActive
                      ? "bg-blue-100 text-blue-700"
                      : "text-gray-700 hover:bg-gray-100 hover:text-gray-900",
                    isCollapsed && "justify-center space-x-0"
                  )}
                  title={isCollapsed ? item.title : undefined}
                >
                  <Icon className="h-5 w-5 flex-shrink-0" />
                  {!isCollapsed && (
                    <div>
                      <div>{item.title}</div>
                      <div className="text-xs text-gray-500 font-normal">
                        {item.description}
                      </div>
                    </div>
                  )}
                </Link>
              )
            })}
          </nav>

          {/* User info and sign out */}
          <div className="p-4 border-t">
            {!isCollapsed && session?.user && (
              <div className="mb-4">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                    <User className="h-5 w-5 text-blue-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">
                      {session.user.firstName} {session.user.lastName}
                    </p>
                    <p className="text-xs text-gray-500 truncate">
                      {session.user.registrationNumber || "Candidate"}
                    </p>
                  </div>
                </div>
                <Badge variant="secondary" className="mt-2">
                  Candidate
                </Badge>
              </div>
            )}
            
            <Button
              variant="outline"
              className="w-full justify-start"
              onClick={handleSignOut}
            >
              <LogOut className="h-4 w-4 mr-2" />
              {!isCollapsed && "Sign Out"}
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile menu button */}
      <Button
        variant="ghost"
        size="sm"
        className="lg:hidden fixed top-4 left-4 z-40"
        onClick={() => setIsMobileOpen(true)}
      >
        <Menu className="h-4 w-4" />
      </Button>
    </>
  )
}

interface CandidateLayoutProps {
  children: React.ReactNode
}

export function CandidateLayout({ children }: CandidateLayoutProps) {
  return (
    <div className="min-h-screen bg-gray-50">
      <CandidateSidebar />
      <main className="lg:ml-64">
        <div className="p-4 lg:p-8 pt-16 lg:pt-8">
          {children}
        </div>
      </main>
    </div>
  )
}