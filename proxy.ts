import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function proxy(request: NextRequest) {
  const token = request.cookies.get('token')?.value
  const { pathname } = request.nextUrl

  const rotasPublicas = ['/Login', '/Cadastro']
  const rotaPublica = rotasPublicas.includes(pathname)

  const rotaProtegida =
    pathname.startsWith('/Produtos') ||
    pathname.startsWith('/Movimentacao') ||
    pathname.startsWith('/Sobre')

  if (pathname === '/') {
    if (token) {
      return NextResponse.redirect(new URL('/Produtos', request.url))
    }

    return NextResponse.redirect(new URL('/Login', request.url))
  }

  if (!token && rotaProtegida) {
    return NextResponse.redirect(new URL('/Login', request.url))
  }

  if (token && rotaPublica) {
    return NextResponse.redirect(new URL('/Produtos', request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/', '/Login', '/Cadastro', '/Produtos/:path*', '/Movimentacao', '/Sobre'],
}