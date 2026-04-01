'use client'
import { useState } from "react"

export default function NovoProduto() {

  const [nome, setNome] = useState('')
  const [descricao, setDescricao] = useState('')
  const [estoque, setEstoque] = useState(0)
  const [estoqueMinimo, setEstoqueMinimo] = useState(0)


  async function handleSubmit(e:any) {
    e.preventDefault()

    const produto = {
      nome,
      descricao,
      estoque,
      estoqueMinimo
    }

    await fetch('http://localhost:3001/produtos',{
      method:'POST',
      headers:{'Content-Type':'application/json'},
      body:JSON.stringify(produto)
    })

    alert("Produto cadastrado com sucesso!")
  }

  return(
    <div>
      <h1>Cadastro de Produtos</h1>
      <form onSubmit={handleSubmit}>
          <input
          placeholder="Nome"
          onChange={(e)=> setNome(e.target.value)}
          />
          <input
          placeholder="Descricao"
          onChange={(e)=> setDescricao(e.target.value)}
          />
           <input
          placeholder="Estoque"
          onChange={(e)=> setEstoque(Number(e.target.value))}
          />
          <input
          placeholder="Estoque Minimo"
          onChange={(e)=> setEstoqueMinimo(Number(e.target.value))}
          />
      </form>
    </div>
  )

}