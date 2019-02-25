import axios from 'axios';

export const upload = fileData => {
  return axios
    .post('/api/fileManager/upload', fileData)
    .then(result => {
      if (result.status === 200 && result.data.status) return result.data;
      else return null;
    })
    .catch(err => {
      console.log(err);
      return null;
    });
};

export const getAllData = () => {
  return axios
    .get('/api/fileManager/getAllData')
    .then(result => {
      if (result.status === 200 && result.data.status) return result.data.msg;
      else return null;
    })
    .catch(err => {
      return null;
    });
};

export const readFile = path => {
  return axios
    .get(`/api/fileManager/read?path=${path}`)
    .then(result => {
      if (result.status === 200 && result.data.status) return result.data.msg;
      else return null;
    })
    .catch(err => {
      return null;
    });
};

export const updateFile = updateData => {
  return axios
    .put('/api/fileManager/update', updateData)
    .then(result => {
      if (result.status === 200 && result.data.status) return result.data;
      else return null;
    })
    .catch(err => {
      console.log(err);
      return null;
    });
};
