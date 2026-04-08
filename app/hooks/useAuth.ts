'use client'

import { useEffect, useState } from 'react'

export function useAuth() {
  const [verificado, setVerificado] = useState(false)

  useEffect(() => {
    const token = localStorage.getItem('token')

    if (!token) {
      window.location.href = '/Login'
      return
    }

    setVerificado(true)
  }, [])

  return verificado
}