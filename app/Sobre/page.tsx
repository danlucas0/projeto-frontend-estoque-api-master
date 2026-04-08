'use client'

import { useEffect } from 'react'




export default function Sobre() {

  
     useEffect(() => {
    const token = localStorage.getItem('token')

    if (!token) {
      window.location.href = '/Login'
    }
  }, [])



  return (
    <div className="min-h-[calc(100vh-80px)] bg-gradient-to-br from-slate-900 via-blue-900 to-slate-950 px-4 py-10">

      <div className="max-w-5xl mx-auto">

        {/* Título */}
        <div className="text-center mb-10">
          <h1 className="text-4xl font-extrabold text-white">
            Sobre o Sistema
          </h1>
          <p className="text-gray-300 mt-3">
            Conheça mais sobre o EstoquePro e suas funcionalidades.
          </p>
        </div>

        {/* Card principal */}
        <div className="bg-white/10 backdrop-blur-md border border-white/10 rounded-2xl shadow-2xl p-8 space-y-8">

          {/* Descrição */}
          <div>
            <h2 className="text-2xl font-bold text-white mb-2">
              📦 O que é o EstoquePro?
            </h2>
            <p className="text-gray-300">
              O EstoquePro é um sistema de gerenciamento de estoque desenvolvido
              para controlar produtos, entradas e saídas de forma simples,
              rápida e eficiente.
            </p>
          </div>

          {/* Funcionalidades */}
          <div>
            <h2 className="text-2xl font-bold text-white mb-3">
              🚀 Funcionalidades
            </h2>

            <ul className="grid sm:grid-cols-2 gap-3 text-gray-300">
              <li className="bg-white/5 p-3 rounded-lg border border-white/10">
                ✔ Cadastro de produtos
              </li>
              <li className="bg-white/5 p-3 rounded-lg border border-white/10">
                ✔ Listagem de produtos
              </li>
              <li className="bg-white/5 p-3 rounded-lg border border-white/10">
                ✔ Controle de estoque
              </li>
              <li className="bg-white/5 p-3 rounded-lg border border-white/10">
                ✔ Movimentação (entrada/saída)
              </li>
              <li className="bg-white/5 p-3 rounded-lg border border-white/10">
                ✔ Exclusão de produtos
              </li>
              <li className="bg-white/5 p-3 rounded-lg border border-white/10">
                ✔ Alertas com SweetAlert
              </li>
            </ul>
          </div>

          {/* Tecnologias */}
          <div>
            <h2 className="text-2xl font-bold text-white mb-3">
              ⚙️ Tecnologias utilizadas
            </h2>

            <div className="flex flex-wrap gap-3">
              <span className="bg-cyan-500/20 text-cyan-300 px-4 py-2 rounded-lg border border-cyan-400/30">
                Next.js
              </span>
              <span className="bg-cyan-500/20 text-cyan-300 px-4 py-2 rounded-lg border border-cyan-400/30">
                React
              </span>
              <span className="bg-cyan-500/20 text-cyan-300 px-4 py-2 rounded-lg border border-cyan-400/30">
                Tailwind CSS
              </span>
              <span className="bg-cyan-500/20 text-cyan-300 px-4 py-2 rounded-lg border border-cyan-400/30">
                NestJS
              </span>
              <span className="bg-cyan-500/20 text-cyan-300 px-4 py-2 rounded-lg border border-cyan-400/30">
                MySQL
              </span>
            </div>
          </div>

          {/* Autor */}
          <div>
            <h2 className="text-2xl font-bold text-white mb-2">
              👨‍💻 Desenvolvedor
            </h2>
            <p className="text-gray-300">
Projeto desenvolvido por Daniel Lucas com o objetivo de aplicar conhecimentos em desenvolvimento full stack e construção de sistemas web.
            </p>
          </div>

        </div>
      </div>
    </div>
  )
}