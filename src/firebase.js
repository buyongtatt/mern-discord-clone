import firebase from "firebase";

const firebaseConfig = {
  apiKey: "AIzaSyDVlF_c36GPcQ5wzgVsaAYthK7HfWl8bcY",
  authDomain: "mern-discord-clone-51d78.firebaseapp.com",
  projectId: "mern-discord-clone-51d78",
  storageBucket: "mern-discord-clone-51d78.appspot.com",
  messagingSenderId: "831869310159",
  appId: "1:831869310159:web:414f267892aa685fc553ba",
  measurementId: "G-XYNPWN0KG2", // your firebase config
};

const firebaseApp = firebase.initializeApp(firebaseConfig);

const db = firebaseApp.firestore();
const auth = firebase.auth();
const provider = new firebase.auth.GoogleAuthProvider();

export { auth, provider };
export default db;
