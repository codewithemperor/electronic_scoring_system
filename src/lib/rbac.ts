import { Role } from "@prisma/client"

// Role definitions and permissions
export const ROLES = {
  SUPER_ADMIN: {
    name: 'Super Administrator',
    permissions: ['*'] // All permissions
  },
  ADMIN: {
    name: 'Administrator',
    permissions: [
      'manage_users',
      'manage_screenings',
      'manage_questions',
      'view_reports',
      'manage_programs',
      'view_audit_logs'
    ]
  },
   CANDIDATE: {
    name: 'Candidate',
    permissions: [
      'take_tests',
      'view_own_results'
    ]
  },
  STAFF: {
    name: 'Staff',
    permissions: [
      'manage_candidates',
      'view_screenings',
      'score_tests',
      'generate_reports'
    ]
  },
  EXAMINER: {
    name: 'Examiner',
    permissions: [
      'manage_questions',
      'view_screenings',
      'score_tests'
    ]
  }
} as const

export type Permission = typeof ROLES[keyof typeof ROLES]['permissions'][number]

// Permission checking utility
export function hasPermission(userRole: Role, permission: string): boolean {
  const rolePermissions = ROLES[userRole]?.permissions || []
  return rolePermissions.includes('*') || rolePermissions.includes(permission as Permission)
}

// Check if user has any of the specified permissions
export function hasAnyPermission(userRole: Role, permissions: string[]): boolean {
  return permissions.some(permission => hasPermission(userRole, permission))
}

// Check if user has all of the specified permissions
export function hasAllPermissions(userRole: Role, permissions: string[]): boolean {
  return permissions.every(permission => hasPermission(userRole, permission))
}

// Get user-friendly role name
export function getRoleName(role: Role): string {
  return ROLES[role]?.name || role
}

// Get all available permissions
export function getAllPermissions(): Permission[] {
  const allPermissions = new Set<Permission>()
  
  Object.values(ROLES).forEach(role => {
    role.permissions.forEach(permission => {
      if (permission !== '*') {
        allPermissions.add(permission)
      }
    })
  })
  
  return Array.from(allPermissions)
}