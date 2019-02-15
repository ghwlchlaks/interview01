import axios from 'axios';

export const upload = (fileData) => {
  return axios.post('/api/fileManager/upload', fileData)
  .then((result) => {
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
    console.log(result)
    if (result.status === 200 && result.data.status) return result.data.msg
    else return null;
  })
  .catch((err) => {
    return null;
  })
}