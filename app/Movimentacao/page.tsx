'use client'
import { useEffect, useState } from "react";
import Swal from 'sweetalert2'

useState

interface Produto{
    id: number
    nome: string
    estoque: number
}

export default function Movimentacao(){
     const [produtos, setProdutos] = useState<Produto[]>([])
     const [produtoId, setProdutoId] = useState("")
     const [tipo, setTipo] = useState("ENTRADA")
     const [quantidade, setQuantidade] = useState("")

     //Carregar os produtos
     useEffect(()=>{
        fetch("http://localhost:3001/produtos")
        .then(res => res.json())
        .then(data => setProdutos(data))
     },[])

     async function SalvarMovimentacao(e:any) {
        e.preventDefault()

       const res = await fetch('http://localhost:3001/movimentacoes',{
            method:'POST',
            headers: {'Content-Type':'application/json'},
            body: JSON.stringify({
                produtoId: Number(produtoId),
                tipo,
                quantidade: Number(quantidade)
            })
        })

        if (!res.ok){
            const erro = await res.json()
            alert(erro.message||'erro ao movimentar')
        }

       Swal.fire({
        title: 'Sucesso!',
        text: 'Movimentação realizada com sucesso',
        icon: 'success',
        confirmButtonText: 'OK'
        })



        setQuantidade
     }


        return (
        <div>
            <h1>Movimentar Estoque</h1>
            <form onSubmit={SalvarMovimentacao}>


            <select
        
            value={produtoId}
            onChange={(e) => setProdutoId(e.target.value)}
            >
            <option   style={{color:'black'}} value="">Selecione um produto</option>

            {produtos.map((produto) => (
                <option style={{color:'black'}} key={produto.id} value={produto.id}>
                {produto.nome}
                </option>
            ))}
            </select>

            <select value={tipo}
            onChange={(e)=>setTipo(e.target.value)}>
            
            <option  style={{color:'black'}} value="entrada">Entrada</option>
            <option   style={{color:'black'}} value="saida">Saida</option>
                      
            </select>

            <input        
            placeholder="Quantidade.."
            value={quantidade}
            onChange={(e)=>setQuantidade(e.target.value)}
            required
            />
            <button style={{cursor:"pointer"}} type="submit">Movimentar</button>

                        
            </form>


        </div>
        );
}