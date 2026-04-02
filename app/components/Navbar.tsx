'use client'

import Link from "next/link"
import { usePathname } from "next/navigation"

export default function Navbar() {
  const pathname = usePathname()

  const links = [
    { href: "/", label: "Home" },
    { href: "/Produtos/novo", label: "Novo Produto" },
    { href: "/Movimentacao", label: "Movimentação" },
    { href: "/Produtos", label: "Produtos" },
    { href: "/Sobre", label: "Sobre" },
  ]

  return (
    <header className="sticky top-0 z-50 bg-slate-950/95 backdrop-blur border-b border-cyan-500/20 shadow-lg">
      <nav className="w-full px-5 py-4 flex items-center gap-8">
        <Link
          href="/"
          className="text-2xl font-extrabold text-cyan-400 hover:text-cyan-300 transition"
        >
          EstoquePro
        </Link>

        <div className="flex items-center gap-2 flex-wrap">
          {links.map((link) => {
            const ativo = pathname === link.href

            return (
              <Link
                key={link.href}
                href={link.href}
                className={`px-4 py-2 rounded-xl text-sm font-semibold transition ${
                  ativo
                    ? "bg-cyan-500 text-slate-950 shadow-md"
                    : "text-white hover:bg-white/10 hover:text-cyan-300"
                }`}
              >
                {link.label}
              </Link>
            )
          })}
        </div>
      </nav>
    </header>
  )
}