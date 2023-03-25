import axios from 'axios'
console.log(process.env)
export const instance = axios.create({
  baseURL: process.env.VUE_APP_API_URL,
  timeout: 10000,
  'Access-Control-Allow-Origin': '*'
})
