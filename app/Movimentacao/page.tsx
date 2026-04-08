'use client'
import { useEffect, useState } from "react";
import Swal from 'sweetalert2'

interface Produto {
  id: number
  nome: string
  estoque: number
}

export default function Movimentacao() {
  const [produtos, setProdutos] = useState<Produto[]>([])
  const [produtoId, setProdutoId] = useState("")
  const [tipo, setTipo] = useState("entrada")
  const [quantidade, setQuantidade] = useState("")

  useEffect(() => {
     const token = localStorage.getItem('token')

     if (!token) {
    window.location.href = '/Login'
    return
  }

    fetch("http://localhost:3001/produtos",{
     headers: {
      Authorization: `Bearer ${token}`,
    },
  })
      .then(res => res.json())
      .then(data => setProdutos(data))
  }, [])

  async function SalvarMovimentacao(e: React.FormEvent) {
    e.preventDefault()

    if (!produtoId || Number(quantidade) <= 0) {
      Swal.fire({
        title: 'Erro!',
        text: 'Selecione um produto e informe uma quantidade válida',
        icon: 'error'
      })
      return
    }

const token = localStorage.getItem('token')

const res = await fetch('http://localhost:3001/movimentacoes', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${token}`,
  },
  body: JSON.stringify({
    produtoId: Number(produtoId),
    tipo,
    quantidade: Number(quantidade),
  }),
})

    if (!res.ok) {
      const erro = await res.json()
      Swal.fire({
        title: 'Erro!',
        text: erro.message || 'Erro ao movimentar',
        icon: 'error'
      })
      return
    }

    Swal.fire({
      title: 'Sucesso!',
      text: 'Movimentação realizada com sucesso',
      icon: 'success'
    })

    setQuantidade("")
    setProdutoId("")
    setTipo("entrada")
  }

  return (
    <div className="min-h-[calc(100vh-80px)] bg-gradient-to-br from-slate-900 via-blue-900 to-slate-950 px-4 py-10">
      
      <div className="max-w-5xl mx-auto flex flex-col items-center">

        {/* Título */}
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-extrabold text-white">
            Movimentar Estoque
          </h1>
          <p className="text-gray-300 mt-2">
            Realize entradas e saídas de produtos no estoque.
          </p>
        </div>

        {/* Card */}
        <div className="max-w-2xl w-full bg-white/10 backdrop-blur-md border border-white/10 rounded-2xl shadow-2xl p-8">

          <form onSubmit={SalvarMovimentacao} className="grid gap-5">

            {/* Produto */}
            <div>
              <label className="block text-sm font-medium text-gray-200 mb-2">
                Produto
              </label>
              <select
                value={produtoId}
                onChange={(e) => setProdutoId(e.target.value)}
                className="w-full rounded-xl border border-white/15 bg-white/10 px-4 py-3 text-white outline-none focus:ring-2 focus:ring-cyan-400"
              >
                <option value="" className="text-black">
                  Selecione um produto
                </option>
                {produtos.map((produto) => (
                  <option
                    key={produto.id}
                    value={produto.id}
                    className="text-black"
                  >
                    {produto.nome}
                  </option>
                ))}
              </select>
            </div>

            {/* Tipo */}
            <div>
              <label className="block text-sm font-medium text-gray-200 mb-2">
                Tipo de movimentação
              </label>
              <select
                value={tipo}
                onChange={(e) => setTipo(e.target.value)}
                className="w-full rounded-xl border border-white/15 bg-white/10 px-4 py-3 text-white outline-none focus:ring-2 focus:ring-cyan-400"
              >
                <option value="entrada" className="text-black">Entrada</option>
                <option value="saida" className="text-black">Saída</option>
              </select>
            </div>

            {/* Quantidade */}
            <div>
              <label className="block text-sm font-medium text-gray-200 mb-2">
                Quantidade
              </label>
              <input
                type="number"
                placeholder="Ex: 10"
                value={quantidade}
                onChange={(e) => setQuantidade(e.target.value)}
                className="w-full rounded-xl border border-white/15 bg-white/10 px-4 py-3 text-white placeholder:text-gray-400 outline-none focus:ring-2 focus:ring-cyan-400"
              />
            </div>

            {/* Botão */}
            <button
              type="submit"
              className="mt-2 w-full rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold py-3 transition duration-300 shadow-lg cursor-pointer"
            >
              Movimentar
            </button>

          </form>

        </div>

      </div>

    </div>
  )
}