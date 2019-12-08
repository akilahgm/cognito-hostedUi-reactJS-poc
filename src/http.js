import { Auth } from 'aws-amplify';
import axios from 'axios';

const http = axios.create({
  baseURL: 'https://',
  timeout: 30000,
  headers:{
      'Content-Type':'application/json'
    }
});

http.interceptors.request.use(config => {
  return Auth.currentSession()
    .then((session) => {
      config.headers.Authorization = session.getIdToken().jwtToken;
      return config
    })
    .catch((error) => {
        console.log('Error happen',error)
    });
});

http.interceptors.response.use(function (response) {
    // Do something with response data
    console.log(response)
    return response;
  }, function (error) {
    console.log('error happen',{error})
    return error
  });

export default http;