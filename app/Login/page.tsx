'use client'

import { useState } from 'react'
import Swal from 'sweetalert2'

export default function Login() {
  const [email, setEmail] = useState('')
  const [senha, setSenha] = useState('')

  async function handleLogin(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()

    try {
      const resposta = await fetch('http://localhost:3001/auth/login', {
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
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-950 flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="bg-white/10 backdrop-blur-md border border-white/20 shadow-2xl rounded-2xl p-8">
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
                className="w-full rounded-xl border border-white/20 bg-white/10 text-white placeholder:text-gray-300 px-4 py-3 outline-none focus:ring-2 focus:ring-cyan-400"
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
                className="w-full rounded-xl border border-white/20 bg-white/10 text-white placeholder:text-gray-300 px-4 py-3 outline-none focus:ring-2 focus:ring-cyan-400"
              />
            </div>

            <button
              type="submit"
              className="w-full rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold py-3 transition duration-300 shadow-lg cursor-pointer"
            >
              Entrar
            </button>
          </form>

          <p className="text-center text-sm text-gray-300 mt-6">
            Não tem conta?{' '}
            <a
              href="/Cadastro"
              className="text-cyan-300 hover:text-cyan-200 font-semibold underline"
            >
              Cadastre-se
            </a>
          </p>

          <p className="text-center text-sm text-gray-300 mt-6">
            Controle de estoque
          </p>
        </div>
      </div>
    </div>
  )
}