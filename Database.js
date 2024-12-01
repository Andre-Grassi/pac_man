// Firebase imports
import { db } from './firebase-config.js'
import {
  collection,
  addDoc,
} from 'https://www.gstatic.com/firebasejs/11.0.2/firebase-firestore.js'

const Database = {
  post: async function (collectionName, objectData) {
    try {
      await addDoc(collection(db, collectionName), objectData)
    } catch (e) {
      console.error('Error posting: ', e)
    }
  },
}

export default Database
