import axios from 'axios';

export const login = (loginInfo) => {
  return axios.put('/api/fileManager/login', {
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

export const getAllData = () => {
  return axios.get('/api/fileManager/getAllData')
  .then((result) => {
    if (result.status === 200 && result.data.status) return result.data.msg
    else return null;
  })
  .catch((err) => {
    return null;
  })
}