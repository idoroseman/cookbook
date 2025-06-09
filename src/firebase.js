// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// import { getFirestore } from 'firebase/firestore';
import { initializeFirestore } from 'firebase/firestore'

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAk1FA9NPa-8MZHqmt1TAMbssW7UnRlgZI",
  authDomain: "cookbook-d80b6.firebaseapp.com",
  projectId: "cookbook-d80b6",
  storageBucket: "cookbook-d80b6.appspot.com",
  messagingSenderId: "520720560472",
  appId: "1:520720560472:web:196fd0235ceeb49347f52d",
  measurementId: "G-L8NEP2YDT8"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const analytics = getAnalytics(app);

export const db = initializeFirestore(app, { experimentalForceLongPolling: true,  useFetchStreams: false });

// export const db = getFirestore(app)
// const usersColl = db.collection('users')