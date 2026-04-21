'use client'

import { useState } from 'react'
import Link from 'next/link'
import Swal from 'sweetalert2'

export default function Login() {
  const [email, setEmail] = useState('')
  const [senha, setSenha] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleLogin(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()

    if (loading) return

    setLoading(true)

    try {
      const resposta = await fetch('https://projeto-estoque-api-backend-master.onrender.com/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, senha }),
      })

      const dados = await resposta.json()

      if (!resposta.ok) {
        await Swal.fire({
          icon: 'error',
          title: 'Erro no login',
          text: Array.isArray(dados.message)
            ? dados.message[0]
            : dados.message || 'Não foi possível fazer login.',
        })
        return
      }

      localStorage.setItem('token', dados.access_token)
      localStorage.setItem('usuarioEmail', dados.usuario.email)

      document.cookie = `token=${dados.access_token}; path=/; max-age=86400; samesite=lax`
      document.cookie = `usuarioEmail=${dados.usuario.email}; path=/; max-age=86400; samesite=lax`

      await Swal.fire({
        icon: 'success',
        title: 'Login realizado',
        text: 'Você entrou no sistema com sucesso.',
      })

      window.location.href = '/Produtos'
    } catch (error) {
      console.error(error)

      await Swal.fire({
        icon: 'error',
        title: 'Erro de conexão',
        text: 'Não foi possível conectar com o servidor.',
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-950 flex items-center justify-center px-4 py-6">
      <div className="w-full max-w-md">
        <div className="relative bg-white/10 backdrop-blur-md border border-white/20 shadow-2xl rounded-2xl p-8">
          <div className="mb-8 text-center">
            <h1 className="text-4xl font-extrabold text-white">Bem-vindo</h1>
            <p className="text-gray-200 mt-2">
              Acesse seu sistema de estoque
            </p>
          </div>

          <form className="space-y-4" onSubmit={handleLogin}>
            <div>
              <label className="block text-sm font-medium text-gray-200 mb-2">
                Email
              </label>
              <input
                type="email"
                placeholder="Digite seu email..."
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                autoComplete="email"
                disabled={loading}
                className="w-full rounded-xl border border-white/20 bg-white/10 text-white placeholder:text-gray-300 px-4 py-3 text-base outline-none focus:ring-2 focus:ring-cyan-400 disabled:opacity-50 disabled:cursor-not-allowed"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-200 mb-2">
                Senha
              </label>
              <input
                type="password"
                placeholder="Digite sua senha..."
                value={senha}
                onChange={(e) => setSenha(e.target.value)}
                autoComplete="current-password"
                disabled={loading}
                className="w-full rounded-xl border border-white/20 bg-white/10 text-white placeholder:text-gray-300 px-4 py-3 text-base outline-none focus:ring-2 focus:ring-cyan-400 disabled:opacity-50 disabled:cursor-not-allowed"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className={`relative z-10 w-full rounded-xl font-bold py-3 transition duration-300 shadow-lg touch-manipulation flex items-center justify-center gap-2 ${
                loading
                  ? 'bg-slate-500 text-white cursor-not-allowed opacity-80'
                  : 'bg-cyan-500 hover:bg-cyan-400 text-slate-950 cursor-pointer active:scale-[0.99]'
              }`}
            >
              {loading && (
                <span className="h-5 w-5 rounded-full border-2 border-white/40 border-t-white animate-spin" />
              )}
              {loading ? 'Entrando...' : 'Entrar'}
            </button>
          </form>

          <p className="text-center text-sm text-gray-300 mt-6">
            Não tem conta?{' '}
            <Link
              href="/Cadastro"
              className={`text-cyan-300 hover:text-cyan-200 font-semibold underline inline-block px-1 py-1 relative z-10 touch-manipulation ${
                loading ? 'pointer-events-none opacity-50' : ''
              }`}
            >
              Cadastre-se
            </Link>
          </p>

          <p className="text-center text-sm text-gray-300 mt-6">
            Controle de estoque
          </p>
        </div>
      </div>
    </div>
  )
}