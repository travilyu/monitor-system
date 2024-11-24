export interface User {
  id: string
  username: string
  password: string
  name: string
  avatar?: string
  role: 'admin' | 'user'
}

export interface LoginResponse {
  token: string
  userInfo: {
    name: string
    avatar?: string
  }
}
