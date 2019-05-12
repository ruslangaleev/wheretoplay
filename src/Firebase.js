import * as firebase from 'firebase';

const config = {
  apiKey: "AIzaSyCzOlnLdzA-D76S5-DlArQ8LvEpLlHlY5A",
  authDomain: "playplace-e1e1a.firebaseapp.com",
  databaseURL: "https://playplace-e1e1a.firebaseio.com",
  projectId: "playplace-e1e1a",
  storageBucket: "playplace-e1e1a.appspot.com",
  messagingSenderId: "1005378897932"
};

firebase.initializeApp(config);

export default firebase;