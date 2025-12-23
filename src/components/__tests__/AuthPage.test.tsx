import { render } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import { BrowserRouter } from 'react-router-dom'
import { AuthProvider } from '../../contexts/AuthContext'
import { AuthPage } from '../AuthPage'

describe('AuthPage', () => {
  it('renders AuthPage', () => {
    render(
      <BrowserRouter>
        <AuthProvider>
          <AuthPage />
        </AuthProvider>
      </BrowserRouter>
    )

    expect(document.body).toBeTruthy()
  })
})
