import axios from 'axios';

export const isAuthenticated = () => {
  return axios.get('/api/auth/').then((result) => {
    if (result.status === 200 && result.data.status) return result.data;
    else {
      return null};
  }).catch((err) => {
    console.error(err);
    return null;
  })
}

export const login = (loginInfo) => {
  return axios.put('/api/auth/login', {
    username: loginInfo.username,
    password: loginInfo.password
  })
  .then((result) => {
    if (result.status === 200 && result.data.status) return result.data
    else return null;
  })
  .catch((err) => {
    console.log(err);
    return null;
  })
}

export const signup = (signupInfo) => {
  return axios.post('/api/auth/signup', {
    username: signupInfo.username,
    password: signupInfo.password,
    email : signupInfo.email,
    sex : signupInfo.sex
  }).then((result) => {
    if (result.status === 200 && result.data.status) return result.data
    else return null;
  })
  .catch((err) => {
    return null;
  })
}

export const update = (updateInfo) => {
  return axios.put('/api/auth/update', {
    password: updateInfo.password
  }).then((result) => {
    if (result.status === 200 && result.data.status) return result.data
    else return null;
  })
  .catch((err) => {
    return null;
  })
}

export const logout = () => {
  return axios.get('/api/auth/logout')
  .then((result) => {
    if (result.status === 200 && result.data.status) return result.data.status
    else return null;
  })
  .catch((err) => {
    return null;
  })
}