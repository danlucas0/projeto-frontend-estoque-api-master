
interface Produto {
    id: number
    nome: string
    descricao: string
    estoque: number
    estoqueMinimo: number
}


async function getProdutos(): Promise<Produto[]> {
    const res = await fetch('http://localhost:3001/produtos')
    return res.json()
}


export default async function Produtos(){

    const produtos = await getProdutos()

    return(
       <div>
  <h1 className="text-3xl font-bold mb-6 text-gray-800">
  
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
      </div>
    ))}
  </div>
</div>
    )
}