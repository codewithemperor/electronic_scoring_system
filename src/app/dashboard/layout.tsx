'use client'

import { useState } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuLabel, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu'
import { 
  Sidebar, 
  SidebarContent, 
  SidebarFooter, 
  SidebarGroup, 
  SidebarGroupContent, 
  SidebarGroupLabel, 
  SidebarHeader, 
  SidebarMenu, 
  SidebarMenuButton, 
  SidebarMenuItem, 
  SidebarProvider 
} from '@/components/ui/sidebar'
import { useAuth } from '@/contexts/auth-context'
import { UserRole } from '@prisma/client'
import {
  Home,
  Users,
  UserCheck,
  Shield,
  Settings,
  LogOut,
  Menu,
  Bell,
  Search,
  FileText,
  BarChart3,
  BookOpen,
  GraduationCap,
  ClipboardList,
  UserPlus,
  Building2,
  Calendar,
  MessageSquare,
  User as UserIcon
} from 'lucide-react'

interface DashboardLayoutProps {
  children: React.ReactNode
  params: { role: string }
}

// Navigation items for different roles
const navigationItems = {
  'super-admin': [
    {
      title: 'Dashboard',
      url: '/dashboard/super-admin',
      icon: Home,
    },
    {
      title: 'System Overview',
      url: '/dashboard/super-admin/overview',
      icon: BarChart3,
    },
    {
      title: 'User Management',
      url: '/dashboard/super-admin/users',
      icon: Users,
    },
    {
      title: 'Departments',
      url: '/dashboard/super-admin/departments',
      icon: Building2,
    },
    {
      title: 'Programs',
      url: '/dashboard/super-admin/programs',
      icon: BookOpen,
    },
    {
      title: 'Audit Logs',
      url: '/dashboard/super-admin/audit',
      icon: FileText,
    },
    {
      title: 'System Settings',
      url: '/dashboard/super-admin/settings',
      icon: Settings,
    },
  ],
  'admin': [
    {
      title: 'Dashboard',
      url: '/dashboard/admin',
      icon: Home,
    },
    {
      title: 'Department Overview',
      url: '/dashboard/admin/overview',
      icon: BarChart3,
    },
    {
      title: 'Staff Management',
      url: '/dashboard/admin/staff',
      icon: Users,
    },
    {
      title: 'Programs',
      url: '/dashboard/admin/programs',
      icon: BookOpen,
    },
    {
      title: 'Candidates',
      url: '/dashboard/admin/candidates',
      icon: GraduationCap,
    },
    {
      title: 'Screening Criteria',
      url: '/dashboard/admin/criteria',
      icon: ClipboardList,
    },
    {
      title: 'Reports',
      url: '/dashboard/admin/reports',
      icon: FileText,
    },
  ],
  'staff': [
    {
      title: 'Dashboard',
      url: '/dashboard/staff',
      icon: Home,
    },
    {
      title: 'Screening Queue',
      url: '/dashboard/staff/queue',
      icon: UserCheck,
    },
    {
      title: 'Active Screenings',
      url: '/dashboard/staff/active',
      icon: ClipboardList,
    },
    {
      title: 'Completed Screenings',
      url: '/dashboard/staff/completed',
      icon: FileText,
    },
    {
      title: 'Examinations',
      url: '/dashboard/staff/exams',
      icon: BookOpen,
    },
    {
      title: 'Schedule',
      url: '/dashboard/staff/schedule',
      icon: Calendar,
    },
  ],
  'candidate': [
    {
      title: 'Dashboard',
      url: '/dashboard/candidate',
      icon: Home,
    },
    {
      title: 'My Profile',
      url: '/dashboard/candidate/profile',
      icon: User,
    },
    {
      title: 'Applications',
      url: '/dashboard/candidate/applications',
      icon: FileText,
    },
    {
      title: 'Screening Status',
      url: '/dashboard/candidate/screening',
      icon: ClipboardList,
    },
    {
      title: 'Results',
      url: '/dashboard/candidate/results',
      icon: BarChart3,
    },
    {
      title: 'Messages',
      url: '/dashboard/candidate/messages',
      icon: MessageSquare,
    },
  ],
}

export default function DashboardLayout({ children, params }: DashboardLayoutProps) {
  const { user, logout } = useAuth()
  const router = useRouter()
  const pathname = usePathname()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  const role = params.role as string
  const items = navigationItems[role as keyof typeof navigationItems] || []

  const handleLogout = async () => {
    await logout()
    router.push('/login')
  }

  const getRoleDisplayName = (role: string) => {
    switch (role) {
      case 'super-admin': return 'Super Admin'
      case 'admin': return 'Administrator'
      case 'staff': return 'Staff'
      case 'candidate': return 'Candidate'
      default: return role
    }
  }

  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'super-admin': return Shield
      case 'admin': return Users
      case 'staff': return UserCheck
      case 'candidate': return GraduationCap
      default: return UserIcon
    }
  }

  const RoleIcon = getRoleIcon(role)

  // Mobile sidebar component
  const MobileSidebar = () => (
    <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
      <SheetTrigger asChild>
        <Button variant="outline" size="icon" className="shrink-0 md:hidden">
          <Menu className="h-5 w-5" />
          <span className="sr-only">Toggle navigation menu</span>
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="flex flex-col">
        <div className="flex h-14 items-center border-b px-4 lg:h-[60px] lg:px-6">
          <div className="flex items-center gap-2 font-semibold">
            <RoleIcon className="h-6 w-6" />
            <span>{getRoleDisplayName(role)}</span>
          </div>
        </div>
        <nav className="grid gap-2 py-4">
          {items.map((item) => (
            <Button
              key={item.url}
              variant={pathname === item.url ? "secondary" : "ghost"}
              className="justify-start"
              onClick={() => {
                router.push(item.url)
                setIsMobileMenuOpen(false)
              }}
            >
              <item.icon className="mr-2 h-4 w-4" />
              {item.title}
            </Button>
          ))}
        </nav>
      </SheetContent>
    </Sheet>
  )

  return (
    <SidebarProvider>
      <div className="grid min-h-screen w-full md:grid-cols-[220px_1fr] lg:grid-cols-[280px_1fr]">
        {/* Desktop Sidebar */}
        <div className="hidden border-r bg-gray-100/40 md:block">
          <div className="flex h-full max-h-screen flex-col gap-2">
            <div className="flex h-14 items-center border-b px-4 lg:h-[60px] lg:px-6">
              <div className="flex items-center gap-2 font-semibold">
                <RoleIcon className="h-6 w-6" />
                <span>{getRoleDisplayName(role)}</span>
              </div>
            </div>
            <div className="flex-1">
              <nav className="grid items-start px-2 text-sm font-medium lg:px-4">
                {items.map((item) => (
                  <Button
                    key={item.url}
                    variant={pathname === item.url ? "secondary" : "ghost"}
                    className="justify-start"
                    onClick={() => router.push(item.url)}
                  >
                    <item.icon className="mr-2 h-4 w-4" />
                    {item.title}
                  </Button>
                ))}
              </nav>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex flex-col">
          {/* Header */}
          <header className="flex h-14 items-center gap-4 border-b bg-muted/40 px-4 lg:h-[60px] lg:px-6">
            <MobileSidebar />
            <div className="w-full flex-1">
              <form>
                <div className="relative">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <input
                    type="search"
                    placeholder="Search..."
                    className="w-full appearance-none bg-background pl-8 shadow-none md:w-2/3 lg:w-1/3"
                  />
                </div>
              </form>
            </div>
            
            {/* User Menu */}
            <div className="flex items-center gap-4">
              <Button variant="outline" size="icon" className="ml-auto h-8 w-8">
                <Bell className="h-4 w-4" />
                <span className="sr-only">Notifications</span>
              </Button>
              
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="secondary" size="icon" className="rounded-full">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src="/avatar.jpg" alt={user?.firstName} />
                      <AvatarFallback>
                        {user?.firstName?.[0]}{user?.lastName?.[0]}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuLabel>
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-medium leading-none">
                        {user?.firstName} {user?.lastName}
                      </p>
                      <p className="text-xs leading-none text-muted-foreground">
                        {user?.email}
                      </p>
                      <Badge variant="outline" className="w-fit mt-1">
                        {getRoleDisplayName(role)}
                      </Badge>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => router.push('/dashboard/candidate/profile')}>
                    <UserIcon className="mr-2 h-4 w-4" />
                    Profile
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => router.push('/dashboard/candidate/settings')}>
                    <Settings className="mr-2 h-4 w-4" />
                    Settings
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleLogout}>
                    <LogOut className="mr-2 h-4 w-4" />
                    Logout
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </header>

          {/* Main Content Area */}
          <main className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6">
            {children}
          </main>
        </div>
      </div>
    </SidebarProvider>
  )
}