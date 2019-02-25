import axios from 'axios';

export const isAuthenticated = () => {
  return axios
    .get('/api/auth/')
    .then(result => {
      if (result.status === 200 && result.data.status) return result.data;
      else {
        return null;
      }
    })
    .catch(err => {
      console.error(err);
      return null;
    });
};

export const logout = () => {
  return axios
    .get('/api/auth/logout')
    .then(result => {
      if (result.status === 200 && result.data.status)
        return result.data.status;
      else return null;
    })
    .catch(err => {
      return null;
    });
};
