// Endpoint to communicate with the Firestore database
const apiEndpoint =
  'https://firestore.googleapis.com/v1/projects/pac-man-5ff59/databases/(default)/documents/users'

// Database class
// This class contains methods to interact with the Firestore database

// The database has the following structure:
// users: a collection of user data
// users/userId: a document with the user data (the id of the document is the user ID)
// users/userId/enemies: a collection with documents of enemy data

// To interact with the database, you need to create a new instance of the
// Database class and call the initialize method to set the user ID
class Database {
  constructor() {
    this.userId = null
  }

  // Initialize the database with the user ID
  async initialize() {
    this.userId = await this.getUserId()
    if (!this.userId) throw new Error('Could not get user ID from the database')
  }

  // Get the user ID from database
  // Or create one if it doesn't exist
  // The ID is stored in a cookie called userId in local storage
  async getUserId() {
    // Access local cookies
    const userId = localStorage.getItem('userId')
    console.log(userId)

    // If the cookie is not set, create a new user ID
    let response
    if (!userId)
      response = await fetch(`${apiEndpoint}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      })
    else response = await fetch(`${apiEndpoint}/${userId}`)

    if (!response.ok) {
      console.error('Error fetching user ID: ', response)
      return null
    }

    const responseData = await response.json()

    // Extract the user ID from the response
    const id = responseData.name.split('/').pop()

    // Save the user ID in a cookie
    localStorage.setItem('userId', id)

    this.userId = id

    return id
  }

  // Get all documents from a collection
  // Returns an array of objects with the document ID and the data
  // If there's an error, returns null
  async get(collectionName) {
    const response = await fetch(
      `${apiEndpoint}/${this.userId}/${collectionName}`
    )
    console.log(response)
    if (!response.ok) {
      console.error('Error fetching from database: ', response)
      return null
    }

    const responseData = await response.json()
    if (!responseData.documents) return []

    const documents = responseData.documents
    const data = []
    documents.forEach((doc) => {
      const id = doc.name.split('/').pop()
      const name = doc.fields.name.stringValue
      const spritePath = doc.fields.spritePath.stringValue
      data.push({ docId: id, name: name, spritePath: spritePath })
    })

    return data
  }

  // Post a new document to a collection
  // Returns the ID of the new document
  // If there's an error, returns null
  async post(collectionName, objectData) {
    const firestoreData = {
      fields: {
        name: { stringValue: objectData.name },
        spritePath: { stringValue: objectData.spritePath },
      },
    }

    const response = await fetch(
      `${apiEndpoint}/${this.userId}/${collectionName}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(firestoreData),
      }
    )
    console.log(response)

    if (!response.ok) {
      console.error('Error posting to database: ', response)
      return null
    }

    const responseData = await response.json()
    const id = responseData.name.split('/').pop()

    return id
  }

  // Put (update) a document in a collection
  // The docId parameter is the ID of the document to update
  // The objectData parameter is the new data to update the document
  // Returns true if the operation was successful, false otherwise
  async put(collectionName, docId, objectData) {
    const firestoreData = {
      fields: {
        name: { stringValue: objectData.name },
        spritePath: { stringValue: objectData.spritePath },
      },
    }

    const response = await fetch(
      `${apiEndpoint}/${this.userId}/${collectionName}/${docId}`,
      {
        method: 'PATCH', // Use PATCH to update an existing document
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(firestoreData),
      }
    )

    if (!response.ok) {
      console.error('Error putting to database: ', response)
      return false
    }

    return true
  }

  // Delete a document from a collection
  // The docId parameter is the ID of the document to delete
  // Returns true if the operation was successful, false otherwise
  async delete(collectionName, docId) {
    const response = await fetch(
      `${apiEndpoint}/${this.userId}/${collectionName}/${docId}`,
      {
        method: 'DELETE',
      }
    )

    if (!response.ok) {
      console.error('Error deleting from database: ', response)
      return false
    }

    return true
  }
}

export default Database
