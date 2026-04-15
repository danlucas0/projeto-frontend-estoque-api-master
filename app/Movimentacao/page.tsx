'use client'

import { useEffect, useMemo, useState } from 'react'
import Swal from 'sweetalert2'

interface Produto {
  id: number
  nome: string
  estoque: number
}

const LIMITE_ESTOQUE = 999999

export default function Movimentacao() {
  const [produtos, setProdutos] = useState<Produto[]>([])
  const [produtoId, setProdutoId] = useState('')
  const [tipo, setTipo] = useState('entrada')
  const [quantidade, setQuantidade] = useState('')
  const [carregandoProdutos, setCarregandoProdutos] = useState(true)
  const [salvando, setSalvando] = useState(false)

  useEffect(() => {
    async function carregarProdutos() {
      const token = localStorage.getItem('token')

      if (!token) {
        window.location.href = '/Login'
        return
      }

      try {
        setCarregandoProdutos(true)

        const res = await fetch('http://localhost:3001/produtos', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })

        const data = await res.json().catch(() => null)

        if (!res.ok) {
          if (res.status === 401) {
            Swal.fire({
              title: 'Sessão expirada!',
              text: 'Faça login novamente.',
              icon: 'warning',
            }).then(() => {
              localStorage.removeItem('token')
              localStorage.removeItem('usuarioEmail')
              window.location.href = '/Login'
            })
            return
          }

          throw new Error(
            Array.isArray(data?.message)
              ? data.message.join(' ')
              : data?.message || 'Erro ao carregar produtos.',
          )
        }

        setProdutos(Array.isArray(data) ? data : [])
      } catch (error: any) {
        Swal.fire({
          title: 'Erro!',
          text: error.message || 'Não foi possível carregar os produtos.',
          icon: 'error',
        })
      } finally {
        setCarregandoProdutos(false)
      }
    }

    carregarProdutos()
  }, [])

  const produtoSelecionado = useMemo(() => {
    return produtos.find((produto) => produto.id === Number(produtoId)) || null
  }, [produtos, produtoId])

  async function SalvarMovimentacao(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()

    if (salvando) return

    const quantidadeNumero = Number(quantidade)

    if (!produtoId || quantidade === '') {
      Swal.fire({
        title: 'Atenção!',
        text: 'Selecione um produto e informe uma quantidade.',
        icon: 'warning',
      })
      return
    }

    if (!Number.isInteger(quantidadeNumero) || quantidadeNumero <= 0) {
      Swal.fire({
        title: 'Valor inválido!',
        text: 'A quantidade deve ser um número inteiro maior que zero.',
        icon: 'warning',
      })
      return
    }

    if (!produtoSelecionado) {
      Swal.fire({
        title: 'Erro!',
        text: 'Produto não encontrado.',
        icon: 'error',
      })
      return
    }

    if (tipo === 'saida' && quantidadeNumero > produtoSelecionado.estoque) {
      Swal.fire({
        title: 'Estoque insuficiente!',
        text: `Disponível: ${produtoSelecionado.estoque}.`,
        icon: 'error',
      })
      return
    }

    if (tipo === 'entrada' && produtoSelecionado.estoque + quantidadeNumero > LIMITE_ESTOQUE) {
      Swal.fire({
        title: 'Limite excedido!',
        text: `O estoque não pode ultrapassar ${LIMITE_ESTOQUE}. Estoque atual: ${produtoSelecionado.estoque}.`,
        icon: 'warning',
      })
      return
    }

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

    try {
      setSalvando(true)

      const res = await fetch('http://localhost:3001/movimentacoes', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          produtoId: Number(produtoId),
          tipo,
          quantidade: quantidadeNumero,
        }),
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

        throw new Error(
          Array.isArray(data?.message)
            ? data.message.join(' ')
            : data?.message || 'Erro ao movimentar.',
        )
      }

      const novoEstoque =
        tipo === 'entrada'
          ? produtoSelecionado.estoque + quantidadeNumero
          : produtoSelecionado.estoque - quantidadeNumero

      setProdutos((estadoAtual) =>
        estadoAtual.map((produto) =>
          produto.id === Number(produtoId)
            ? { ...produto, estoque: novoEstoque }
            : produto,
        ),
      )

      await Swal.fire({
        title: 'Sucesso!',
        text: 'Movimentação realizada com sucesso.',
        icon: 'success',
      })

      setQuantidade('')
      setProdutoId('')
      setTipo('entrada')
    } catch (error: any) {
      Swal.fire({
        title: 'Erro!',
        text: error.message || 'Erro ao movimentar.',
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
            Movimentar Estoque
          </h1>
          <p className="text-gray-300 mt-2">
            Realize entradas e saídas de produtos no estoque.
          </p>
        </div>

        <div className="max-w-2xl w-full bg-white/10 backdrop-blur-md border border-white/10 rounded-2xl shadow-2xl p-8">
          <form onSubmit={SalvarMovimentacao} className="grid gap-5">
            <div>
              <label className="block text-sm font-medium text-gray-200 mb-2">
                Produto
              </label>
              <select
                value={produtoId}
                onChange={(e) => setProdutoId(e.target.value)}
                disabled={carregandoProdutos || salvando}
                className="w-full rounded-xl border border-white/15 bg-white/10 px-4 py-3 text-white outline-none focus:ring-2 focus:ring-cyan-400 disabled:opacity-60"
              >
                <option value="" className="text-black">
                  {carregandoProdutos ? 'Carregando produtos...' : 'Selecione um produto'}
                </option>

                {produtos.map((produto) => (
                  <option
                    key={produto.id}
                    value={produto.id}
                    className="text-black"
                  >
                    {produto.nome} — estoque: {produto.estoque}
                  </option>
                ))}
              </select>
            </div>

            {produtoSelecionado && (
              <div className="rounded-xl bg-white/5 border border-white/10 p-4">
                <p className="text-sm text-gray-300">
                  Produto selecionado:
                  <span className="font-bold text-white ml-2">
                    {produtoSelecionado.nome}
                  </span>
                </p>
                <p className="text-sm text-cyan-300 mt-1">
                  Estoque atual: {produtoSelecionado.estoque}
                </p>
                <p className="text-xs text-gray-400 mt-1">
                  Limite máximo permitido: {LIMITE_ESTOQUE}
                </p>
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-200 mb-2">
                Tipo de movimentação
              </label>
              <select
                value={tipo}
                onChange={(e) => setTipo(e.target.value)}
                disabled={salvando}
                className="w-full rounded-xl border border-white/15 bg-white/10 px-4 py-3 text-white outline-none focus:ring-2 focus:ring-cyan-400 disabled:opacity-60"
              >
                <option value="entrada" className="text-black">
                  Entrada
                </option>
                <option value="saida" className="text-black">
                  Saída
                </option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-200 mb-2">
                Quantidade
              </label>
              <input
                type="number"
                placeholder="Ex: 10"
                value={quantidade}
                onChange={(e) => setQuantidade(e.target.value)}
                min={1}
                max={LIMITE_ESTOQUE}
                step={1}
                disabled={salvando}
                className="w-full rounded-xl border border-white/15 bg-white/10 px-4 py-3 text-white placeholder:text-gray-400 outline-none focus:ring-2 focus:ring-cyan-400 disabled:opacity-60"
              />
            </div>

            <button
              type="submit"
              disabled={salvando || carregandoProdutos}
              className="mt-2 w-full rounded-xl bg-cyan-500 hover:bg-cyan-400 disabled:bg-cyan-700 disabled:cursor-not-allowed text-slate-950 font-bold py-3 transition duration-300 shadow-lg cursor-pointer"
            >
              {salvando ? 'Movimentando...' : 'Movimentar'}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}