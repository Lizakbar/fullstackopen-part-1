import { useState, useEffect } from 'react'
import personService from './services/persons'
import Notification from './Notification'
import Filter from './Filter'
import PersonForm from './PersonForm'
import Persons from './Persons'

const App = () => {
  const [persons, setPersons] = useState([])
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [notification, setNotification] = useState(null)
  const [searchTerm, setSearchTerm] = useState('')

  useEffect(() => {
    personService
      .getAll()
      .then(initialPersons => setPersons(initialPersons))
      .catch(error => {
        console.error('Error al obtener los datos:', error)
        setNotification('Error al obtener los contactos.')
        setTimeout(() => setNotification(null), 5000)
      })
  }, [])

  const addPerson = (event) => {
    event.preventDefault()

    if (newName.trim() === '' || newNumber.trim() === '') {
      setNotification('Por favor, completa el nombre y el número.')
      setTimeout(() => setNotification(null), 5000)
      return
    }

    const nameExists = persons.some(person => person.name === newName)

    if (nameExists) {
      setNotification(`El nombre '${newName}' ya está en la agenda.`)
      setTimeout(() => setNotification(null), 5000)
      return
    }

    const personObject = {
      name: newName,
      number: newNumber
    }

    personService
      .create(personObject)
      .then(returnedPerson => {
        setPersons(persons.concat(returnedPerson))
        setNotification(`Añadido '${newName}' a la agenda.`)
        setTimeout(() => setNotification(null), 5000)
        setNewName('')
        setNewNumber('')
      })
      .catch(error => {
        console.error('Error al añadir la persona:', error)
        setNotification('Error al añadir el contacto.')
        setTimeout(() => setNotification(null), 5000)
      })
  }

  const handleNameChange = (e) => setNewName(e.target.value)

  const handleNumberChange = (e) => {
    const input = e.target.value
    const filteredInput = input.replace(/[^0-9\s-]/g, '')
    setNewNumber(filteredInput)
  }

  const handleSearchChange = (e) => setSearchTerm(e.target.value)

  const personsToShow = persons.filter(person =>
    person.name.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const handleDelete = (id, name) => {
  if (window.confirm(`¿Quieres eliminar a ${name}?`)) {
    personService
      .remove(id)
      .then(() => {
        setPersons(persons.filter(person => person.id !== id))
        setNotification(`Eliminado '${name}' de la agenda.`)
        setTimeout(() => setNotification(null), 5000)
      })
      .catch(error => {
        console.error('Error al eliminar la persona:', error)
        setNotification(`Error al eliminar a '${name}'.`)
        setTimeout(() => setNotification(null), 5000)
      })
  }
}


  return (
    <div>
      <h2>Phonebook</h2>
      <Notification message={notification} />

      <Filter searchTerm={searchTerm} handleSearchChange={handleSearchChange} />
      <PersonForm
        newName={newName}
        handleNameChange={handleNameChange}
        newNumber={newNumber}
        handleNumberChange={handleNumberChange}
        addPerson={addPerson}
      />
      <h2>Numbers</h2>
      <Persons personsToShow={personsToShow} handleDelete={handleDelete}/>
    </div>
  )
}

export default App
