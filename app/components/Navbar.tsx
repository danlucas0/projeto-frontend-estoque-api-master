import Link from "next/link"

export default function Navbar(){
    return(
        <nav style={{backgroundColor:"black", color:'white', padding: '20px'}}>
            <Link href="/" style={{marginLeft:'10px'}}>Home</Link>
            <Link href="/Produtos/novo" style={{marginLeft:'10px'}}>Novo Produto</Link>
            <Link href="/Movimentacao" style={{marginLeft:'10px'}}>Movimentacao</Link>
            <Link href="/Produtos" style={{marginLeft:'10px'}}>Produtos</Link>
            <Link href="/Sobre" style={{marginLeft:'10px'}}>Sobre</Link>
        </nav>
    )
}