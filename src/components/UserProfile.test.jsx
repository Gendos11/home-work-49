import { afterEach, describe, expect, it, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import UserProfile from './UserProfile'

const mockUser = {
  name: 'Leanne Graham',
  email: 'leanne@example.com',
  phone: '1-770-736-8031',
  website: 'hildegard.org',
}

const createDeferred = () => {
  let resolve
  let reject
  const promise = new Promise((res, rej) => {
    resolve = res
    reject = rej
  })
  return { promise, resolve, reject }
}

describe('UserProfile', () => {
  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('shows loading indicator while request is in progress', () => {
    const deferred = createDeferred()
    vi.stubGlobal('fetch', vi.fn(() => deferred.promise))

    render(<UserProfile />)

    expect(screen.getByRole('status')).toHaveTextContent(/loading/i)
  })

  it('renders user data after successful request', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn(() =>
        Promise.resolve({
          ok: true,
          json: () => Promise.resolve(mockUser),
        })
      )
    )

    render(<UserProfile />)

    expect(await screen.findByText(mockUser.name)).toBeInTheDocument()
    expect(screen.getByText(mockUser.email)).toBeInTheDocument()
    expect(screen.getByText(mockUser.phone)).toBeInTheDocument()
    expect(screen.getByText(mockUser.website)).toBeInTheDocument()
  })

  it('renders error message when request fails', async () => {
    vi.stubGlobal('fetch', vi.fn(() => Promise.reject(new Error('Network error'))))

    render(<UserProfile />)

    expect(await screen.findByRole('alert')).toHaveTextContent(/network error/i)
  })
})
