import axios from 'axios';

export const signup = (signupInfo) => {
  return axios.post('/api/auth/signup', {
    username: signupInfo.username,
    password: signupInfo.password,
    email : signupInfo.email,
    sex : signupInfo.sex
  }).then((result) => {
    if (result.status === 200 && result.data) return result.data
    else return null;
  })
  .catch((err) => {
    console.log(err)
    return null;
  })
}
