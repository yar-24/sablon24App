import FIREBASE from '../config/FIREBASE';
import { storeData } from '../utils';

export const REGISTER_USER = 'REGISTER_USER';

export const registerUser = (data, password) => {
  return dispatch => {
    // LOADING
    dispatch({
      type: REGISTER_USER,
      payload: {
        loading: true,
        data: false,
        errorMessage: false,
      },
    });

    FIREBASE
      .auth()
      .createUserWithEmailAndPassword(data.email, password)
      .then((success) => {
        //  ambil UID, buat data baru (data+uid)
        const dataBaru = {
            ...data,
            uid: success.user.uid
        }

        //simpan ke realtime 
        FIREBASE.database()
        .ref('users/' + success.user.uid)
        .set(dataBaru);

        //SUCCESS
        dispatch({
            type: REGISTER_USER,
            payload: {
              loading: false,
              data: dataBaru,
              errorMessage: false,
            },
          });

          //local storage(async storage)
          storeData('user', dataBaru)

      })
      .catch(error => {
       
        //ERROR
        dispatch({
            type: REGISTER_USER,
            payload: {
              loading: false,
              data: false,
              errorMessage: error.message,
            },
          });
          alert.apply(error.message)
      });
  };
};
