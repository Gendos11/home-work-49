import { useEffect, useState } from 'react'

const USER_API_URL = 'https://jsonplaceholder.typicode.com/users/1'

function UserProfile() {
  const [status, setStatus] = useState('loading')
  const [user, setUser] = useState(null)
  const [error, setError] = useState('')

  useEffect(() => {
    let isMounted = true

    const loadUser = async () => {
      try {
        const response = await fetch(USER_API_URL)
        if (!response.ok) {
          throw new Error('Failed to load user')
        }
        const data = await response.json()
        if (isMounted) {
          setUser(data)
          setStatus('success')
        }
      } catch (err) {
        if (isMounted) {
          setError(err instanceof Error ? err.message : 'Failed to load user')
          setStatus('error')
        }
      }
    }

    loadUser()

    return () => {
      isMounted = false
    }
  }, [])

  if (status === 'loading') {
    return <p role="status">Loading...</p>
  }

  if (status === 'error') {
    return (
      <p role="alert">
        Error: {error}
      </p>
    )
  }

  if (!user) {
    return null
  }

  return (
    <section>
      <h2>User profile</h2>
      <ul>
        <li>
          <strong>Name:</strong> {user.name}
        </li>
        <li>
          <strong>Email:</strong> {user.email}
        </li>
        <li>
          <strong>Phone:</strong> {user.phone}
        </li>
        <li>
          <strong>Website:</strong> {user.website}
        </li>
      </ul>
    </section>
  )
}

export default UserProfile
