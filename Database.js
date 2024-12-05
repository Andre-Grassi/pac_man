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

// Database object
// This object contains methods to interact with the Firestore database
const Database = {
  // Get all documents from a collection
  // Returns an array of objects with the document ID and the data
  // If there's an error, returns null
  get: async function (collectionName) {
    try {
      const querySnapshot = await getDocs(collection(db, collectionName))
      const data = []
      querySnapshot.forEach((doc) => {
        data.push({ docId: doc.id, ...doc.data() })
      })
      return data
    } catch (e) {
      console.error('Error getting: ', e)
      return null
    }
  },

  // Post a new document to a collection
  // Returns the ID of the new document
  // If there's an error, returns null
  post: async function (collectionName, objectData) {
    try {
      const docRef = await addDoc(collection(db, collectionName), objectData)
      console.log('Document written with ID: ', docRef.id)
      return docRef.id
    } catch (e) {
      console.error('Error posting: ', e)
      return null
    }
  },

  // Put (update) a document in a collection
  // The docId parameter is the ID of the document to update
  // The objectData parameter is the new data to update the document
  // Returns true if the operation was successful, false otherwise
  put: async function (collectionName, docId, objectData) {
    try {
      const docRef = doc(db, collectionName, docId)
      await setDoc(docRef, objectData)
      return true
    } catch (e) {
      console.error('Error putting: ', e)
      return false
    }
  },

  // Delete a document from a collection
  // The docId parameter is the ID of the document to delete
  // Returns true if the operation was successful, false otherwise
  delete: async function (collectionName, docId) {
    try {
      const docRef = doc(db, collectionName, docId)
      await deleteDoc(docRef)
      return true
    } catch (e) {
      console.error('Error deleting: ', e)
      return false
    }
  },
}

export default Database
