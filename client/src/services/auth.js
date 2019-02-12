import axios from 'axios';

export const login = (loginInfo) => {
  return axios.put('/auth/login', {
    username: loginInfo.username,
    password: loginInfo.password
  })
  .then((result) => {
    console.log(result);
    if (result.status === 200 && result.data.status) return result.data
    else return null;
  })
  .catch((err) => {
    console.log(err);
    return null;
  })
}

export const signup = (signupInfo) => {
  return axios.post('/auth/signup', {
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
  return axios.put('/auth/update', {
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
  return axios.get('/auth/logout')
  .then((result) => {
    if (result.status === 200 && result.data.status) return result.data
    else return null;
  })
  .catch((err) => {
    return null;
  })
}