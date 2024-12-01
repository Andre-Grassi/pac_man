// Firebase imports
import { db } from './firebase-config.js'
import {
  collection,
  doc,
  addDoc,
  deleteDoc,
} from 'https://www.gstatic.com/firebasejs/11.0.2/firebase-firestore.js'

const Database = {
  post: async function (collectionName, objectData) {
    try {
      const docRef = await addDoc(collection(db, collectionName), objectData)
      console.log('Document written with ID: ', docRef.id)
      return docRef.id
    } catch (e) {
      console.error('Error posting: ', e)
    }
  },

  delete: async function (collectionName, docId) {
    try {
      const docRef = doc(db, collectionName, docId)
      await deleteDoc(docRef)
    } catch (e) {
      console.error('Error deleting: ', e)
    }
  },
}

export default Database
