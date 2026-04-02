'use client'
import { useState } from "react"
import Swal from "sweetalert2"

export default function NovoProduto() {
  const [nome, setNome] = useState('')
  const [descricao, setDescricao] = useState('')
  const [estoque, setEstoque] = useState('')
  const [estoqueMinimo, setEstoqueMinimo] = useState('')

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()

    // validação extra
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

    const produto = {
      nome,
      descricao,
      estoque: Number(estoque),
      estoqueMinimo: Number(estoqueMinimo)
    }

    const res = await fetch('http://localhost:3001/produtos', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(produto)
    })

    // tratar erro de duplicado
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

    //limpar campos
    setNome('')
    setDescricao('')
    setEstoque('')
    setEstoqueMinimo('')
  }

  return (
    <div>
      <h1>Cadastro de Produtos</h1>

      <form onSubmit={handleSubmit}>
        <input
          placeholder="Nome"
          value={nome}
          onChange={(e) => setNome(e.target.value)}
        />

        <input
          placeholder="Descrição"
          value={descricao}
          onChange={(e) => setDescricao(e.target.value)}
        />

        <input
          type="number"
          placeholder="Estoque"
          value={estoque}
          onChange={(e) => setEstoque(e.target.value)}
        />

        <input
          type="number"
          placeholder="Estoque Mínimo"
          value={estoqueMinimo}
          onChange={(e) => setEstoqueMinimo(e.target.value)}
        />

        <button
          type="submit"
          style={{ cursor: 'pointer' }}
        >
          Cadastrar
        </button>
      </form>
    </div>
  )
}