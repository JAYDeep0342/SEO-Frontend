import client from './client'

export function signup({ username, password, name, email }) {
  return client.post('/auth/signup', { username, password, name, email }).then((res) => res.data)
}

export function login({ username, password }) {
  return client.post('/auth/login', { username, password }).then((res) => res.data)
}
