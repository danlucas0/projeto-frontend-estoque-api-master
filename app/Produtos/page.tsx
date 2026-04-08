'use client'

import Swal from 'sweetalert2'
import { useEffect, useState } from 'react'

interface Produto {
  id: number
  nome: string
  descricao: string
  estoque: number
  estoqueMinimo: number
}

export default function Produtos() {
  const [produtos, setProdutos] = useState<Produto[]>([])
  const [emailUsuario, setEmailUsuario] = useState('')
  const [carregando, setCarregando] = useState(true)

  useEffect(() => {
    const email = localStorage.getItem('usuarioEmail')

    if (email) {
      setEmailUsuario(email)
    }

    carregarProdutos()
  }, [])

  async function carregarProdutos() {
    const inicio = Date.now()
    const tempoMinimo = 900

    try {
      setCarregando(true)

      const token = localStorage.getItem('token')

      const res = await fetch('http://localhost:3001/produtos', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      if (!res.ok) {
        throw new Error('Erro ao buscar produtos')
      }

      const data = await res.json()

      const tempoPassado = Date.now() - inicio
      const tempoRestante = Math.max(tempoMinimo - tempoPassado, 0)

      setTimeout(() => {
        setProdutos(Array.isArray(data) ? data : [])
        setCarregando(false)
      }, tempoRestante)
    } catch (error) {
      console.error(error)

      const tempoPassado = Date.now() - inicio
      const tempoRestante = Math.max(tempoMinimo - tempoPassado, 0)

      setTimeout(() => {
        Swal.fire({
          title: 'Erro!',
          text: 'Não foi possível carregar os produtos.',
          icon: 'error',
        })

        setCarregando(false)
      }, tempoRestante)
    }
  }

  async function removerProduto(id: number) {
    const result = await Swal.fire({
      title: 'Tem certeza?',
      text: 'Esse produto será removido permanentemente!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sim, remover',
      cancelButtonText: 'Cancelar',
    })

    if (!result.isConfirmed) return

    try {
      const token = localStorage.getItem('token')

      const res = await fetch(`http://localhost:3001/produtos/${id}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      if (res.ok) {
        setProdutos(produtos.filter((p) => p.id !== id))

        Swal.fire({
          title: 'Removido!',
          text: 'Produto removido com sucesso.',
          icon: 'success',
        })
      } else {
        Swal.fire({
          title: 'Erro!',
          text: 'Não foi possível remover o produto.',
          icon: 'error',
        })
      }
    } catch (error) {
      console.error(error)

      Swal.fire({
        title: 'Erro!',
        text: 'Erro ao conectar com o servidor.',
        icon: 'error',
      })
    }
  }

  return (
    <div className="min-h-[calc(100vh-80px)] bg-gradient-to-br from-slate-900 via-blue-900 to-slate-950 px-4 py-10">
      <div className="w-full px-6 animate-fadeIn">
        <div className="mb-8">
          <h1 className="text-4xl font-extrabold text-white">
            Produtos Cadastrados
          </h1>
          <p className="text-gray-300 mt-2">
            Visualize e gerencie todos os produtos cadastrados no sistema.
          </p>

          {emailUsuario && (
            <p className="text-cyan-300 mt-3 text-sm font-medium">
              Logado como: {emailUsuario}
            </p>
          )}
        </div>

        {carregando ? (
          <ProdutosSkeleton />
        ) : produtos.length === 0 ? (
          <div className="bg-white/10 backdrop-blur-md border border-white/10 rounded-2xl shadow-2xl p-8 text-center animate-fadeIn">
            <div className="text-5xl mb-4">📦</div>
            <h2 className="text-2xl font-bold text-white">
              Nenhum produto cadastrado
            </h2>
            <p className="text-gray-300 mt-2">
              Cadastre um produto para começar a gerenciar seu estoque.
            </p>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 animate-fadeIn">
            {produtos.map((prod) => {
              const estoqueBaixo = prod.estoque <= prod.estoqueMinimo

              return (
                <div
                  key={prod.id}
                  className={`rounded-2xl shadow-2xl p-5 border backdrop-blur-md transition duration-300 hover:scale-[1.01] ${
                    estoqueBaixo
                      ? 'bg-red-500/10 border-red-400/40'
                      : 'bg-white/10 border-white/10'
                  }`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <h2 className="text-2xl font-bold text-white break-words">
                      {prod.nome}
                    </h2>

                    {estoqueBaixo && (
                      <span className="shrink-0 rounded-full bg-red-500/20 text-red-300 text-xs font-bold px-3 py-1 border border-red-400/30">
                        Estoque baixo
                      </span>
                    )}
                  </div>

                  <p className="text-gray-300 mt-3 text-sm break-words">
                    {prod.descricao}
                  </p>

                  <div className="mt-5 grid grid-cols-2 gap-4">
                    <div className="rounded-xl bg-white/5 border border-white/10 p-3">
                      <p className="text-xs text-gray-400">Estoque atual</p>
                      <p className="text-lg font-bold text-cyan-300">
                        {prod.estoque}
                      </p>
                    </div>

                    <div className="rounded-xl bg-white/5 border border-white/10 p-3">
                      <p className="text-xs text-gray-400">Estoque mínimo</p>
                      <p className="text-lg font-bold text-red-300">
                        {prod.estoqueMinimo}
                      </p>
                    </div>
                  </div>

                  <button
                    onClick={() => removerProduto(prod.id)}
                    className="mt-5 w-full rounded-xl bg-red-500 hover:bg-red-400 text-white font-bold py-3 transition duration-300 shadow-lg cursor-pointer"
                  >
                    Remover
                  </button>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}

function ProdutosSkeleton() {
  return (
    <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 animate-fadeIn">
      {Array.from({ length: 8 }).map((_, index) => (
        <div
          key={index}
          className="rounded-2xl shadow-2xl p-5 border border-white/10 bg-white/10 backdrop-blur-md"
        >
          <div className="flex items-start justify-between gap-3">
            <div className="h-7 w-36 rounded-lg bg-white/10 animate-pulse" />
            <div className="h-7 w-24 rounded-full bg-white/10 animate-pulse" />
          </div>

          <div className="mt-3 space-y-2">
            <div className="h-4 w-full rounded bg-white/10 animate-pulse" />
            <div className="h-4 w-4/5 rounded bg-white/10 animate-pulse" />
          </div>

          <div className="mt-5 grid grid-cols-2 gap-4">
            <div className="rounded-xl bg-white/5 border border-white/10 p-3">
              <div className="h-3 w-20 rounded bg-white/10 animate-pulse mb-3" />
              <div className="h-6 w-12 rounded bg-white/10 animate-pulse" />
            </div>

            <div className="rounded-xl bg-white/5 border border-white/10 p-3">
              <div className="h-3 w-24 rounded bg-white/10 animate-pulse mb-3" />
              <div className="h-6 w-12 rounded bg-white/10 animate-pulse" />
            </div>
          </div>

          <div className="mt-5 h-12 w-full rounded-xl bg-white/10 animate-pulse" />
        </div>
      ))}
    </div>
  )
}