// Firebase imports
import { db } from './firebase-config.js'
import {
  collection,
  doc,
  getDocs,
  addDoc,
  setDoc,
  deleteDoc,
} from 'https://www.gstatic.com/firebasejs/11.0.2/firebase-firestore.js'

const Database = {
  get: async function (collectionName) {
    try {
      const querySnapshot = await getDocs(collection(db, collectionName))
      const data = []
      querySnapshot.forEach((doc) => {
        data.push({ id: doc.id, ...doc.data() })
      })
      return data
    } catch (e) {
      console.error('Error getting: ', e)
    }
  },

  post: async function (collectionName, objectData) {
    try {
      const docRef = await addDoc(collection(db, collectionName), objectData)
      console.log('Document written with ID: ', docRef.id)
      return docRef.id
    } catch (e) {
      console.error('Error posting: ', e)
    }
  },

  put: async function (collectionName, docId, objectData) {
    try {
      const docRef = doc(db, collectionName, docId)
      await setDoc(docRef, objectData)
    } catch (e) {
      console.error('Error putting: ', e)
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
