import React, { useEffect, useState } from 'react'
import { initializeApp } from "firebase/app";
import { firebaseConfig } from './firebaseConfig'
import { getFirestore, collection, addDoc, getDocs, doc, deleteDoc, updateDoc } from 'firebase/firestore';


const app = initializeApp(firebaseConfig);
const db = getFirestore(app)
const value = collection(db, 'cricPlayers')

const App = () => {
  const [users, setUsers] = useState([])
  const [usersField, setUsersField] = useState({})
  const [isUpdate, setIsUpdate] = useState(false)

  useEffect(() => {
    getData()
  }, [])

  const getData = async () => {
    const res = await getDocs(value)
    let users = res.docs.map(e => ({ ...e.data(), id: e.id }))
    setUsers(users)
  }

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUsersField({
      ...usersField,
      [name]: value
    })
  }
  const addData = async () => {
    await addDoc(value, usersField)
    setUsersField({ name: '', age: '' })
    getData()
  }

  const updateData = async () => {
    const updateQuery = doc(db, 'cricPlayers', usersField.id)
    const updatedData = { name: usersField.name, age: usersField.age }
    await updateDoc(updateQuery, updatedData)
    setIsUpdate(false)
    getData()
    setUsersField({ name: '', age: '' })
  }

  const handleEdit = (e) => {
    setUsersField({ ...usersField, name: e.name, age: e.age, id: e.id })
    setIsUpdate(true)
  }

  const deleteData = async (id) => {
    const deleteQuery = doc(db, 'cricPlayers', id)
    await deleteDoc(deleteQuery)
    getData()
  }

  return (
    <div>
      <input placeholder='name' name='name' onChange={handleChange} value={usersField.name} /> &nbsp;
      <input placeholder='age' name='age' onChange={handleChange} value={usersField.age} /> &nbsp; &nbsp;
      {!isUpdate ? <button onClick={addData}>Add</button> : <button onClick={updateData}>Update</button>}
      {users.map(e => (
        <div key={e.id}>
          <h1>{e.name}</h1>
          <h1>{e.age}</h1>
          <button onClick={() => handleEdit(e)}>Edit</button> &nbsp;
          <button onClick={() => deleteData(e.id)}>Delete</button>
          <hr />
        </div>
      ))}
    </div>
  )
}

export default App