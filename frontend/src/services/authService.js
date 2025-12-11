import api from './api'

const login = async (email, password) => {
  const res = await api.post('/api/auth/login', { email, password })
  if (res.data?.token) {
    localStorage.setItem('token', res.data.token)
    localStorage.setItem('user', JSON.stringify(res.data.user))
  }
  return res.data
}

const register = async (payload) => {
  const { email, password, fullName, mobile, gender } = payload
  const res = await api.post('/api/auth/register', {
    email,
    password,
    fullName,
    mobile,
    gender,
  })
  if (res.data?.token) {
    localStorage.setItem('token', res.data.token)
    localStorage.setItem('user', JSON.stringify(res.data.user))
  }
  return res.data
}

const logout = () => {
  localStorage.removeItem('token')
  localStorage.removeItem('user')
}

const getCurrentUser = () => {
  const user = localStorage.getItem('user')
  return user ? JSON.parse(user) : null
}

const getToken = () => localStorage.getItem('token')

const authService = {
  login,
  register,
  logout,
  getCurrentUser,
  getToken,
}

export default authService
