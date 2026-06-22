interface User {
  userId?: string,
  userName: string,
  userEmail: string,
  userRole: UserRole,
  userStatus: UserStatus
}

enum UserRole {
  admin = 'admin',
  user = 'user',
  superAdmin = 'super admin'
}

enum UserStatus {
  active = 'active',
  inactive = 'inactive'
}

export type { User }

export { UserRole, UserStatus }