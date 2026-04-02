'use client'
import Swal from 'sweetalert2'
import { useEffect, useState } from "react"

interface Produto {
  id: number
  nome: string
  descricao: string
  estoque: number
  estoqueMinimo: number
}

export default function Produtos() {
  const [produtos, setProdutos] = useState<Produto[]>([])

  useEffect(() => {
    carregarProdutos()
  }, [])

  async function carregarProdutos() {
    const res = await fetch('http://localhost:3001/produtos')
    const data = await res.json()
    setProdutos(data)
  }

async function removerProduto(id: number) {
  const result = await Swal.fire({
    title: 'Tem certeza?',
    text: 'Esse produto será removido permanentemente!',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonText: 'Sim, remover',
    cancelButtonText: 'Cancelar'
  })

  if (!result.isConfirmed) return

  const res = await fetch(`http://localhost:3001/produtos/${id}`, {
    method: 'DELETE'
  })

  if (res.ok) {
    setProdutos(produtos.filter((p) => p.id !== id))

    Swal.fire({
      title: 'Removido!',
      text: 'Produto removido com sucesso.',
      icon: 'success'
    })
  }
}

  return (
    <div>
      <h1 className="text-4xl font-extrabold mb-6 text-white-600">
       Produtos Cadastrados
      </h1>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {produtos.map((prod) => (
          <div
            key={prod.id}
            className="bg-white rounded-xl shadow-md p-5 hover:shadow-lg transition duration-300 border border-gray-100"
          >
            <h2 className="text-xl font-semibold text-gray-800">
              {prod.nome}
            </h2>

            <p className="text-gray-600 mt-2 text-sm">
              {prod.descricao}
            </p>

            <div className="mt-4 flex justify-between items-center">
              <span className="text-green-600 font-bold">
                Estoque: {prod.estoque}
              </span>

              <span className="text-sm text-red-500">
                Mín: {prod.estoqueMinimo}
              </span>
            </div>

            <button
              onClick={() => removerProduto(prod.id)}
              className="mt-4 bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600"
            >
              Remover
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}