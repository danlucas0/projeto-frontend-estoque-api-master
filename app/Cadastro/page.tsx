'use client'

import { useState } from 'react'
import Link from 'next/link'
import Swal from 'sweetalert2'

export default function Cadastro() {
  const [email, setEmail] = useState('')
  const [senha, setSenha] = useState('')

  async function handleCadastro(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()

    try {
      const resposta = await fetch('https://projeto-estoque-api-backend-master.onrender.com/auth/register', {
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
          title: 'Erro no cadastro',
          text: Array.isArray(dados.message)
            ? dados.message[0]
            : dados.message || 'Não foi possível cadastrar.',
        })
        return
      }

      await Swal.fire({
        icon: 'success',
        title: 'Cadastro realizado',
        text: 'Usuário cadastrado com sucesso.',
      })

      window.location.href = '/Login'

      setEmail('')
      setSenha('')
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
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-950 flex items-center justify-center px-4 py-6">
      <div className="w-full max-w-md">
        <div className="relative bg-white/10 backdrop-blur-md border border-white/20 shadow-2xl rounded-2xl p-8">
          
          <div className="mb-8 text-center">
            <h1 className="text-4xl font-extrabold text-white">Cadastro</h1>
            <p className="text-gray-200 mt-2">Crie sua conta no sistema</p>
          </div>

          <form className="space-y-4" onSubmit={handleCadastro}>
            
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
                className="w-full rounded-xl border border-white/20 bg-white/10 text-white placeholder:text-gray-300 px-4 py-3 text-base outline-none focus:ring-2 focus:ring-cyan-400"
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
                autoComplete="new-password"
                className="w-full rounded-xl border border-white/20 bg-white/10 text-white placeholder:text-gray-300 px-4 py-3 text-base outline-none focus:ring-2 focus:ring-cyan-400"
              />
            </div>

            <button
              type="submit"
              className="relative z-10 w-full rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold py-3 transition duration-300 shadow-lg cursor-pointer touch-manipulation active:scale-[0.99]"
            >
              Cadastrar
            </button>

          </form>

          {/* opcional (voltar pro login) */}
          <p className="text-center text-sm text-gray-300 mt-6">
            Já tem conta?{' '}
            <Link
              href="/Login"
              className="text-cyan-300 hover:text-cyan-200 font-semibold underline inline-block px-1 py-1 touch-manipulation"
            >
              Entrar
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