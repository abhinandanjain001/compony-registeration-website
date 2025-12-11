import api from './api'

const buildForm = (fileField, file) => {
  const form = new FormData()
  form.append(fileField, file)
  return form
}

const register = async (payload) => {
  const { companyName, addressLine1, addressLine2, city, state, country, postalCode, website, industry } = payload
  const address = [addressLine1, addressLine2].filter(Boolean).join(', ')
  const body = {
    companyName,
    address,
    city,
    state,
    country,
    postalCode,
    website,
    industry,
  }
  const res = await api.post('/api/company/register', body)
  return res.data
}

const getProfile = async () => {
  const res = await api.get('/api/company/profile')
  return res.data
}

const updateProfile = async (payload) => {
  const { companyName, addressLine1, addressLine2, city, state, country, postalCode, website, industry } = payload
  const address = [addressLine1, addressLine2].filter(Boolean).join(', ')
  const body = {
    companyName,
    address,
    city,
    state,
    country,
    postalCode,
    website,
    industry,
  }
  const res = await api.put('/api/company/profile', body)
  return res.data
}

const uploadLogo = async (file) => {
  const form = buildForm('logo', file)
  const res = await api.post('/api/company/upload-logo', form, {
    headers: { 'Content-Type': 'multipart/form-data' },
  })
  return res.data
}

const uploadBanner = async (file) => {
  const form = buildForm('banner', file)
  const res = await api.post('/api/company/upload-banner', form, {
    headers: { 'Content-Type': 'multipart/form-data' },
  })
  return res.data
}

const companyService = {
  register,
  getProfile,
  updateProfile,
  uploadLogo,
  uploadBanner,
}

export default companyService
