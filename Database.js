// Endpoint to communicate with the Firestore database
const apiEndpoint =
  'https://firestore.googleapis.com/v1/projects/pac-man-5ff59/databases/(default)/documents/users'

// Database object
// This object contains methods to interact with the Firestore database

// The database has the following structure:
// users: a collection of user data
// users/userId: a document with the user data (the id of the document is the user ID)
// users/userId/enemies: a collection with documents of enemy data
const Database = {
  // Get the user ID from database
  // Or create one if it doesn't exist
  // The ID is stored in a cookie called userId in local storage
  getUserId: async function () {
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

    return id
  },

  // Get all documents from a collection
  // Returns an array of objects with the document ID and the data
  // If there's an error, returns null
  get: async function (userId, collectionName) {
    const response = await fetch(`${apiEndpoint}/${userId}/${collectionName}`)
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
  },

  // Post a new document to a collection
  // Returns the ID of the new document
  // If there's an error, returns null
  post: async function (userId, collectionName, objectData) {
    const firestoreData = {
      fields: {
        name: { stringValue: objectData.name },
        spritePath: { stringValue: objectData.spritePath },
      },
    }

    const response = await fetch(`${apiEndpoint}/${userId}/${collectionName}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(firestoreData),
    })
    console.log(response)

    if (!response.ok) {
      console.error('Error posting to database: ', response)
      return null
    }

    const responseData = await response.json()
    const id = responseData.name.split('/').pop()

    return id
  },

  // Put (update) a document in a collection
  // The docId parameter is the ID of the document to update
  // The objectData parameter is the new data to update the document
  // Returns true if the operation was successful, false otherwise
  put: async function (userId, collectionName, docId, objectData) {
    const firestoreData = {
      fields: {
        name: { stringValue: objectData.name },
        spritePath: { stringValue: objectData.spritePath },
      },
    }

    const response = await fetch(
      `${apiEndpoint}/${userId}/${collectionName}/${docId}`,
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
  },

  // Delete a document from a collection
  // The docId parameter is the ID of the document to delete
  // Returns true if the operation was successful, false otherwise
  delete: async function (userId, collectionName, docId) {
    const response = await fetch(
      `${apiEndpoint}/${userId}/${collectionName}/${docId}`,
      {
        method: 'DELETE',
      }
    )

    if (!response.ok) {
      console.error('Error deleting from database: ', response)
      return false
    }

    return true
  },
}

export default Database
