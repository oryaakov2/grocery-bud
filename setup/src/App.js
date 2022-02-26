import React, { useState, useEffect } from 'react'
import List from './List'
import Alert from './Alert'

function App() {

  const getLocalStorage = () => {
    let list = localStorage.getItem('list')

    if (list) {
      return JSON.parse(localStorage.getItem('list'))

    } else {
      return []
    }
  }

  const [name, setName] = useState('')
  const [list, setList] = useState(getLocalStorage())
  const [isEditing, setIsEditing] = useState(false)
  const [editId, setEditId] = useState('')
  const [alert, setAlert] = useState({ show: false, msg: '', type: '' })

  const handleSubmit = (e) => {
    e.preventDefault()

    if (!name) {
      setAlert({ show: true, msg: 'please enter value', type: 'danger' })
      return;

    } else if (name && isEditing) {
      setList(list.map((item) => {

        if (item.id === editId) {
          return { ...item, title: name }
        }
        return item
      }))

      setName('')
      setEditId(null)
      setIsEditing(false)
      setAlert({ show: true, msg: 'item edited successfully', type: 'success' })

    } else {
      setAlert({ show: true, msg: 'item added to the list', type: 'success' })

      const newItem = {
        id: new Date().getTime().toString(),
        title: name
      }
      setList([...list, newItem])
      setName('')
    }
  }

  const clearList = () => {
    setAlert({ show: true, msg: 'clear list', type: 'success' })
    setList([])
    localStorage.removeItem("list")
  }

  const removeAlert = () => {
    setAlert({ show: false, msg: '', type: '' })
  }

  const deleteItem = (id) => {
    setAlert({ show: true, msg: 'item removed', type: 'danger' })
    setList(list.filter((item) => item.id !== id))
  }

  const editItem = (id) => {
    const item = list.find(item => item.id === id)
    setIsEditing(true)
    setName(item.title)
    setEditId(item.id)
  }

  useEffect(() => {
    localStorage.setItem('list', JSON.stringify(list))
  }, [list])

  return (
    <section className='section-center'>
      <form className='grocery-form' onSubmit={handleSubmit}>
        {alert.show && <Alert {...alert} removeAlert={removeAlert} list={list} />}
        <h3>grocery bud</h3>
        <div className="form-control">
          <input
            type='text'
            className='grocery'
            placeholder='e.g. eggs'
            onChange={e => setName(e.target.value)}
            value={name}
          />
          <button type='submit' className="submit-btn">
            {isEditing ? 'edit' : 'submit'}
          </button>
        </div>
      </form>
      {list.length > 0 && (
        <div className='grocery-container'>
          <List items={list} removeItem={deleteItem} editItem={editItem} />
          <button className='clear-btn' onClick={clearList}>
            clear items
          </button>
        </div>
      )}
    </section>
  )
}

export default App
