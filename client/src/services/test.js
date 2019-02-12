import axios from 'axios';

export const getData = () => {
    return axios.get('/api/getUsername')
    .then((result) => {
        return result.data;
    })
}