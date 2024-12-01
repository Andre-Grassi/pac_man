import { initializeApp } from 'https://www.gstatic.com/firebasejs/11.0.2/firebase-app.js'

// Import Firestore (database) from the Firebase SDK
import { getFirestore } from 'https://www.gstatic.com/firebasejs/11.0.2/firebase-firestore.js'
// https://firebase.google.com/docs/web/setup#available-libraries

// Web app's Firebase configuration
const firebaseConfig = {
  apiKey: 'AIzaSyCL9eAgIwV0bkJX3HuU04kPFxnHjtIAjxk',
  authDomain: 'pac-man-5ff59.firebaseapp.com',
  projectId: 'pac-man-5ff59',
  storageBucket: 'pac-man-5ff59.firebasestorage.app',
  messagingSenderId: '18361081813',
  appId: '1:18361081813:web:8c3841cdf3744ab927e75c',
}

// Initialize Firebase
const app = initializeApp(firebaseConfig)

const db = getFirestore(app)

export { db }
