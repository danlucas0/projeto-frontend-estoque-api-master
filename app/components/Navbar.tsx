'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import Swal from 'sweetalert2'
import { useEffect, useState } from 'react'

export default function Navbar() {
  const pathname = usePathname()
  const [mostrarNavbar, setMostrarNavbar] = useState(false)
  const [menuAberto, setMenuAberto] = useState(false)

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

  useEffect(() => {
    setMenuAberto(false)
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
      <nav className="w-full px-5 py-4 flex items-center justify-between gap-4">
        <div className="flex items-center gap-6">
          <span className="text-2xl font-extrabold text-cyan-400">
            EstoquePro
          </span>

          <div className="hidden md:flex items-center gap-2 flex-wrap">
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
          className="hidden md:block rounded-xl bg-red-500 hover:bg-red-400 text-white font-bold px-4 py-2 transition duration-300 shadow-lg cursor-pointer"
        >
          Logout
        </button>

        <button
          onClick={() => setMenuAberto(!menuAberto)}
          className="relative flex h-7 w-7 flex-col justify-center items-center md:hidden"
          aria-label="Abrir menu"
        >
          <span
            className={`absolute h-0.5 w-6 bg-white transition-all duration-300 ${
              menuAberto ? 'rotate-45' : '-translate-y-2'
            }`}
          ></span>
          <span
            className={`absolute h-0.5 w-6 bg-white transition-all duration-300 ${
              menuAberto ? 'opacity-0' : 'opacity-100'
            }`}
          ></span>
          <span
            className={`absolute h-0.5 w-6 bg-white transition-all duration-300 ${
              menuAberto ? '-rotate-45' : 'translate-y-2'
            }`}
          ></span>
        </button>
      </nav>

      <div
        className={`overflow-hidden border-t border-white/10 bg-slate-950/95 backdrop-blur md:hidden transition-all duration-300 ${
          menuAberto ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
        }`}
      >
        <div className="flex flex-col px-5 py-4 gap-2">
          {links.map((link) => {
            const ativo = pathname === link.href

            return (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMenuAberto(false)}
                className={`block rounded-xl px-4 py-3 text-sm font-semibold transition ${
                  ativo
                    ? 'bg-cyan-500 text-slate-950 shadow-md'
                    : 'text-white hover:bg-white/10 hover:text-cyan-300'
                }`}
              >
                {link.label}
              </Link>
            )
          })}

          <button
            onClick={handleLogout}
            className="mt-2 rounded-xl bg-red-500 hover:bg-red-400 text-white font-bold px-4 py-3 transition duration-300 shadow-lg cursor-pointer"
          >
            Logout
          </button>
        </div>
      </div>
    </header>
  )
}