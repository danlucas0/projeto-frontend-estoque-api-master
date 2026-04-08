'use client'

import { useEffect, useState } from 'react'
import Swal from 'sweetalert2'

const LIMITE_ESTOQUE = 999999

export default function NovoProduto() {
  const [nome, setNome] = useState('')
  const [descricao, setDescricao] = useState('')
  const [estoque, setEstoque] = useState('')
  const [estoqueMinimo, setEstoqueMinimo] = useState('')
  const [salvando, setSalvando] = useState(false)

  useEffect(() => {
    const token = localStorage.getItem('token')

    if (!token) {
      window.location.href = '/Login'
    }
  }, [])

  function obterMensagemErro(erro: any) {
    if (!erro) return 'Não foi possível cadastrar o produto.'

    if (Array.isArray(erro.message)) {
      return erro.message.join(' ')
    }

    if (typeof erro.message === 'string') {
      return erro.message
    }

    return 'Não foi possível cadastrar o produto.'
  }

  function validarCampos() {
    const nomeLimpo = nome.trim()
    const descricaoLimpa = descricao.trim()

    const estoqueNumero = Number(estoque)
    const estoqueMinimoNumero = Number(estoqueMinimo)

    if (!nomeLimpo || !descricaoLimpa || estoque === '' || estoqueMinimo === '') {
      Swal.fire({
        title: 'Atenção!',
        text: 'Preencha todos os campos.',
        icon: 'warning',
      })
      return false
    }

    if (!Number.isInteger(estoqueNumero) || !Number.isInteger(estoqueMinimoNumero)) {
      Swal.fire({
        title: 'Valor inválido!',
        text: 'Estoque e estoque mínimo devem ser números inteiros.',
        icon: 'warning',
      })
      return false
    }

    if (estoqueNumero < 0 || estoqueMinimoNumero < 0) {
      Swal.fire({
        title: 'Valor inválido!',
        text: 'Os valores não podem ser negativos.',
        icon: 'warning',
      })
      return false
    }

    if (estoqueNumero > LIMITE_ESTOQUE || estoqueMinimoNumero > LIMITE_ESTOQUE) {
      Swal.fire({
        title: 'Valor muito alto!',
        text: `O estoque e o estoque mínimo devem ser no máximo ${LIMITE_ESTOQUE}.`,
        icon: 'warning',
      })
      return false
    }

    if (estoqueMinimoNumero > estoqueNumero) {
      Swal.fire({
        title: 'Erro!',
        text: 'O estoque mínimo não pode ser maior que o estoque atual.',
        icon: 'error',
      })
      return false
    }

    return true
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()

    if (salvando) return

    if (!validarCampos()) return

    const token = localStorage.getItem('token')

    if (!token) {
      Swal.fire({
        title: 'Sessão expirada!',
        text: 'Faça login novamente.',
        icon: 'warning',
      }).then(() => {
        window.location.href = '/Login'
      })
      return
    }

    const produto = {
      nome: nome.trim(),
      descricao: descricao.trim(),
      estoque: Number(estoque),
      estoqueMinimo: Number(estoqueMinimo),
    }

    try {
      setSalvando(true)

      const res = await fetch('http://localhost:3001/produtos', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(produto),
      })

      const data = await res.json().catch(() => null)

      if (!res.ok) {
        if (res.status === 401) {
          Swal.fire({
            title: 'Não autorizado!',
            text: 'Sua sessão expirou. Faça login novamente.',
            icon: 'warning',
          }).then(() => {
            localStorage.removeItem('token')
            localStorage.removeItem('usuarioEmail')
            window.location.href = '/Login'
          })
          return
        }

        throw new Error(obterMensagemErro(data))
      }

      await Swal.fire({
        title: 'Sucesso!',
        text: 'Produto cadastrado com sucesso!',
        icon: 'success',
      })

      setNome('')
      setDescricao('')
      setEstoque('')
      setEstoqueMinimo('')
    } catch (error: any) {
      Swal.fire({
        title: 'Erro!',
        text: error.message || 'Não foi possível cadastrar o produto.',
        icon: 'error',
      })
    } finally {
      setSalvando(false)
    }
  }

  return (
    <div className="min-h-[calc(100vh-80px)] bg-gradient-to-br from-slate-900 via-blue-900 to-slate-950 px-4 py-10">
      <div className="max-w-5xl mx-auto flex flex-col items-center">
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-extrabold text-white">
            Cadastro de Produtos
          </h1>
          <p className="text-gray-300 mt-2">
            Adicione novos itens ao sistema de estoque.
          </p>
        </div>

        <div className="w-full max-w-2xl bg-white/10 backdrop-blur-md border border-white/10 rounded-2xl shadow-2xl p-8">
          <form onSubmit={handleSubmit} className="grid gap-5">
            <div>
              <label className="block text-sm font-medium text-gray-200 mb-2">
                Nome do produto
              </label>
              <input
                placeholder="Ex: Mouse Redragon"
                value={nome}
                onChange={(e) => setNome(e.target.value)}
                maxLength={100}
                disabled={salvando}
                className="w-full rounded-xl border border-white/15 bg-white/10 px-4 py-3 text-white placeholder:text-gray-400 outline-none focus:ring-2 focus:ring-cyan-400 disabled:opacity-60"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-200 mb-2">
                Descrição
              </label>
              <input
                placeholder="Ex: Mouse gamer 10000 DPI"
                value={descricao}
                onChange={(e) => setDescricao(e.target.value)}
                maxLength={200}
                disabled={salvando}
                className="w-full rounded-xl border border-white/15 bg-white/10 px-4 py-3 text-white placeholder:text-gray-400 outline-none focus:ring-2 focus:ring-cyan-400 disabled:opacity-60"
              />
            </div>

            <div className="grid md:grid-cols-2 gap-5">
              <div>
                <label className="block text-sm font-medium text-gray-200 mb-2">
                  Estoque
                </label>
                <input
                  type="number"
                  placeholder="Ex: 50"
                  value={estoque}
                  onChange={(e) => setEstoque(e.target.value)}
                  min={0}
                  max={LIMITE_ESTOQUE}
                  step={1}
                  disabled={salvando}
                  className="w-full rounded-xl border border-white/15 bg-white/10 px-4 py-3 text-white placeholder:text-gray-400 outline-none focus:ring-2 focus:ring-cyan-400 disabled:opacity-60"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-200 mb-2">
                  Estoque mínimo
                </label>
                <input
                  type="number"
                  placeholder="Ex: 5"
                  value={estoqueMinimo}
                  onChange={(e) => setEstoqueMinimo(e.target.value)}
                  min={0}
                  max={LIMITE_ESTOQUE}
                  step={1}
                  disabled={salvando}
                  className="w-full rounded-xl border border-white/15 bg-white/10 px-4 py-3 text-white placeholder:text-gray-400 outline-none focus:ring-2 focus:ring-cyan-400 disabled:opacity-60"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={salvando}
              className="mt-2 w-full rounded-xl bg-cyan-500 hover:bg-cyan-400 disabled:bg-cyan-700 disabled:cursor-not-allowed text-slate-950 font-bold py-3 transition duration-300 shadow-lg cursor-pointer"
            >
              {salvando ? 'Cadastrando...' : 'Cadastrar'}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}