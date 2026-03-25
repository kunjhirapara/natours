/* eslint-disable */
// import axios from 'axios';

import axios from 'axios';
import { showAlert } from './alerts';

// export const login = async (email, password) => {
//   try {
//     const res = await axios({
//       method: 'POST',
//       url: 'http://localhost:3000/api/v1/users/login',
//       data: {
//         email,
//         password,
//       },
//     });

//     if (res.data.status === 'success') {
//       console.log('logged in successfully');
//       window.setTimeout(() => {
//         location.assign('/');
//       }, 500);
//     }
//   } catch (err) {
//     console.log(err.response.data.message);
//   }
// };
export const login = async (email, password) => {
  try {
    const res = await axios({
      url: 'http://localhost:3000/api/v1/users/login',
      method: 'POST',
      data: { email, password },
    });

    if (res.data.status === 'success') {
      showAlert('success', 'logged in successfully');
      window.setTimeout(() => {
        location.assign('/');
      }, 1500);
    }
  } catch (err) {
    showAlert('error', err.response?.data?.message || err.message);
  }
};
export const logout = async () => {
  try {
    const res = await axios({
      method: 'GET',
      url: 'http://localhost:3000/api/v1/users/logout',
    });

    if (res.data.status === 'success') {
      showAlert('success', 'logged out successfully');
      window.setTimeout(() => {
        location.assign('/');
      }, 1500);
    } else {
      showAlert('error', data.message);
    }
  } catch (err) {
    showAlert('error', err.response?.data?.message || err.message);
  }
};
