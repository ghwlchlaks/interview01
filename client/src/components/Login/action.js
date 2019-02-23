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
    if (result.status === 200 && result.data) return result.data
    else return null;
  })
  .catch((err) => {
    console.log('err', err);
    return null;
  })
}