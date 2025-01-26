import { initializeApp } from 'firebase/app'
import { getAuth, GoogleAuthProvider } from 'firebase/auth'
import { getFirestore } from 'firebase/firestore'

// const firebaseConfig = {
//   apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
//   authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
//   projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
//   storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
//   messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
//   appId: process.env.REACT_APP_FIREBASE_APP_ID
// }
const firebaseConfig = {
  apiKey: 'AIzaSyDhOeba4ZgyEqKpEq1q0KhJLyYbiIIdA0Y',
  authDomain: 'allskillscount.firebaseapp.com',
  projectId: 'allskillscount',
  storageBucket: 'allskillscount.firebasestorage.app',
  messagingSenderId: '1027526679703',
  appId: '1:1027526679703:web:94995057d1839285991dd2',
  measurementId: 'G-S3DLDN1MFD'
}
console.log('🚀 ~ firebaseConfig:', firebaseConfig)

const app = initializeApp(firebaseConfig)
const auth = getAuth(app)
const db = getFirestore(app)
const googleProvider = new GoogleAuthProvider()

export { auth, db, googleProvider }
