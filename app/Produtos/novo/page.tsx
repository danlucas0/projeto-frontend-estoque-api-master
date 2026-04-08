'use client'
import { useEffect, useState } from "react"
import Swal from "sweetalert2"

export default function NovoProduto() {
  const [nome, setNome] = useState('')
  const [descricao, setDescricao] = useState('')
  const [estoque, setEstoque] = useState('')
  const [estoqueMinimo, setEstoqueMinimo] = useState('')

  useEffect(() => {
  const token = localStorage.getItem('token')

  if (!token) {
    window.location.href = '/Login'
  }
}, [])

async function handleSubmit(e: React.FormEvent) {
  e.preventDefault()

  if (
    !nome.trim() ||
    !descricao.trim() ||
    Number(estoque) <= 0 ||
    Number(estoqueMinimo) <= 0
  ) {
    Swal.fire({
      title: 'Atenção!',
      text: 'Preencha todos os campos corretamente!',
      icon: 'warning'
    })
    return
  }

  if (Number(estoqueMinimo) > Number(estoque)) {
    Swal.fire({
      title: 'Erro!',
      text: 'O estoque mínimo não pode ser maior que o estoque atual.',
      icon: 'error'
    })
    return
  }

  const produto = {
    nome,
    descricao,
    estoque: Number(estoque),
    estoqueMinimo: Number(estoqueMinimo)
  }

 const token = localStorage.getItem('token')

const res = await fetch('http://localhost:3001/produtos', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${token}`,
  },
  body: JSON.stringify(produto),
})

  if (!res.ok) {
    const erro = await res.json()

    Swal.fire({
      title: 'Erro!',
      text: erro.message || 'Produto já cadastrado',
      icon: 'error'
    })
    return
  }

  Swal.fire({
    title: 'Sucesso!',
    text: 'Produto cadastrado com sucesso!',
    icon: 'success'
  })

  setNome('')
  setDescricao('')
  setEstoque('')
  setEstoqueMinimo('')
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

        <div className="max-w-2xl bg-white/10 backdrop-blur-md border border-white/10 rounded-2xl shadow-2xl p-8">
          <form onSubmit={handleSubmit} className="grid gap-5">
            <div>
              <label className="block text-sm font-medium text-gray-200 mb-2">
                Nome do produto
              </label>
              <input
                placeholder="Ex: Mouse Redragon"
                value={nome}
                onChange={(e) => setNome(e.target.value)}
                className="w-full rounded-xl border border-white/15 bg-white/10 px-4 py-3 text-white placeholder:text-gray-400 outline-none focus:ring-2 focus:ring-cyan-400"
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
                className="w-full rounded-xl border border-white/15 bg-white/10 px-4 py-3 text-white placeholder:text-gray-400 outline-none focus:ring-2 focus:ring-cyan-400"
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
                  className="w-full rounded-xl border border-white/15 bg-white/10 px-4 py-3 text-white placeholder:text-gray-400 outline-none focus:ring-2 focus:ring-cyan-400"
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
                  className="w-full rounded-xl border border-white/15 bg-white/10 px-4 py-3 text-white placeholder:text-gray-400 outline-none focus:ring-2 focus:ring-cyan-400"
                />
              </div>
            </div>

            <button
              type="submit"
              className="mt-2 w-full rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold py-3 transition duration-300 shadow-lg cursor-pointer"
            >
              Cadastrar
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}