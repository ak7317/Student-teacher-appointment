// Firebase config (replace with your credentials)
const firebaseConfig = {
   apiKey: "AIzaSyB1ts0GfZ7csIqc_vR0e6jkLVOGYCCspwM",
  authDomain: "student-teacher-appointm-59000.firebaseapp.com",
  projectId: "student-teacher-appointm-59000",
  storageBucket: "student-teacher-appointm-59000.firebasestorage.app",
  messagingSenderId: "679717292421",
  appId: "1:679717292421:web:4b5893785e3a40a7345cec",
  measurementId: "G-7KFW5E7KVL"
};
firebase.initializeApp(firebaseConfig);
const auth=firebase.auth(),db=firebase.firestore();
async function logAction(uid,action){await db.collection('logs').add({uid,action,timestamp:firebase.firestore.FieldValue.serverTimestamp()});}
async function getUserDoc(uid){const snap=await db.collection('users').doc(uid).get();return snap.exists?{id:snap.id,...snap.data()}:null;}
