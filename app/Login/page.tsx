export default function Login() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-950 flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="bg-white/10 backdrop-blur-md border border-white/20 shadow-2xl rounded-2xl p-8">
          <div className="mb-8 text-center">
            <h1 className="text-4xl font-extrabold text-white">Bem-vindo</h1>
            <p className="text-gray-200 mt-2">
              Acesse seu sistema de estoque
            </p>
          </div>

          <form className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-200 mb-2">
                Email
              </label>
              <input
                type="email"
                placeholder="Digite seu email..."
                className="w-full rounded-xl border border-white/20 bg-white/10 text-white placeholder:text-gray-300 px-4 py-3 outline-none focus:ring-2 focus:ring-cyan-400"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-200 mb-2">
                Senha
              </label>
              <input
                type="password"
                placeholder="Digite sua senha..."
                className="w-full rounded-xl border border-white/20 bg-white/10 text-white placeholder:text-gray-300 px-4 py-3 outline-none focus:ring-2 focus:ring-cyan-400"
              />
            </div>

            <button
              type="submit"
              className="w-full rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold py-3 transition duration-300 shadow-lg cursor-pointer"
            >
              Entrar
            </button>
          </form>

          <p className="text-center text-sm text-gray-300 mt-6">
            Controle de estoque
          </p>
        </div>
      </div>
    </div>
  )
}