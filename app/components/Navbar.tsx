'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import Swal from 'sweetalert2'
import { useEffect, useState } from 'react'

export default function Navbar() {
  const pathname = usePathname()
  const [mostrarNavbar, setMostrarNavbar] = useState(false)

  const paginasSemNavbar = ['/Login', '/Cadastro']

  useEffect(() => {
    const token = localStorage.getItem('token')

    if (paginasSemNavbar.includes(pathname)) {
      setMostrarNavbar(false)
      return
    }

    if (!token) {
      setMostrarNavbar(false)
      return
    }

    setMostrarNavbar(true)
  }, [pathname])

  if (!mostrarNavbar) return null

  const links = [
    { href: '/Produtos', label: 'Produtos' },
    { href: '/Produtos/novo', label: 'Novo Produto' },
    { href: '/Movimentacao', label: 'Movimentação' },
    { href: '/Sobre', label: 'Sobre' },
  ]

  async function handleLogout() {
    const result = await Swal.fire({
      title: 'Deseja sair?',
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Sim, sair',
      cancelButtonText: 'Cancelar',
    })

    if (!result.isConfirmed) return

    localStorage.removeItem('token')
    localStorage.removeItem('usuarioEmail')

    document.cookie = 'token=; path=/; max-age=0'
    document.cookie = 'usuarioEmail=; path=/; max-age=0'

    await Swal.fire({
      icon: 'success',
      title: 'Logout realizado',
    })

    window.location.href = '/Login'
  }

  return (
    <header className="sticky top-0 z-50 bg-slate-950/95 backdrop-blur border-b border-cyan-500/20 shadow-lg">
      <nav className="w-full px-5 py-4 flex items-center justify-between gap-4 flex-wrap">
        <div className="flex items-center gap-6 flex-wrap">
          <span className="text-2xl font-extrabold text-cyan-400">
            EstoquePro
          </span>

          <div className="flex items-center gap-2 flex-wrap">
            {links.map((link) => {
              const ativo = pathname === link.href

              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`px-4 py-2 rounded-xl text-sm font-semibold transition ${
                    ativo
                      ? 'bg-cyan-500 text-slate-950 shadow-md'
                      : 'text-white hover:bg-white/10 hover:text-cyan-300'
                  }`}
                >
                  {link.label}
                </Link>
              )
            })}
          </div>
        </div>

        <button
          onClick={handleLogout}
          className="rounded-xl bg-red-500 hover:bg-red-400 text-white font-bold px-4 py-2 transition duration-300 shadow-lg cursor-pointer"
        >
          Logout
        </button>
      </nav>
    </header>
  )
}