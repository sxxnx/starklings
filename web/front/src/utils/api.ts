

import axios from 'axios'
import queryString from 'query-string'

const starklings = axios.create({
  baseURL: 'https://localhost:8080',
  headers: {
    'content-type': 'application/json',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET,PUT,POST,DELETE,PATCH,OPTIONS'
  },
  paramsSerializer: params => queryString.stringify(params)
})

starklings.interceptors.request.use(async (config) => {
  return config
})

starklings.interceptors.response.use((response) => {
  if (response && response.data) {
    return response.data
  }
  return response
}, (error) => {
  throw error
})

export const starklingsAPI = {
  getUserInfo: async (userData: any) => {
    const url = `/fetchUserInfo`
    const response = await starklings.post(url, userData)
    return response.data
  },
  registerUser: async (userData: any) => {
    const url = `/registerUser`
    const response = await starklings.post(url, userData)
    return response.data
  }
}