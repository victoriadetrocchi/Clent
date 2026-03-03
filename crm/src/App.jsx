import { useState } from 'react'
import { Toaster } from 'react-hot-toast'
import { Dashboard } from './components/Dashboard'
import { Clientes } from './components/Clientes'
import { Facturas } from './components/Facturas'
import { PerfilCliente } from './components/PerfilCliente'
import { LayoutDashboard, Users, Receipt } from 'lucide-react'

function App() {
  const [vistaActual, setVistaActual] = useState('dashboard');
  const [clienteIdSeleccionado, setClienteIdSeleccionado] = useState(null);

  return (
    <div className="dark">
      
      {}
      <div className="flex min-h-screen bg-[#07030f] p-4 md:p-6 gap-6 transition-colors duration-300 font-sans text-white">
        
        {}
        <Toaster 
          position="bottom-right" 
          toastOptions={{
            className: 'bg-[#1c1c1c] text-white border border-white/10',
          }} 
        />

        {}
        {}
        <aside className="w-64 bg-[#121212] rounded-xl shadow-2xl flex flex-col overflow-hidden transition-colors duration-300 border border-white/5">
          
          <div className="p-8 pb-4">
            <h1 className="text-2xl font-black tracking-tight text-violet-500">CLENT</h1>
            <p className="text-xs text-slate-500 mt-1 font-medium uppercase tracking-wider">Workspace</p>
          </div>
          
          <nav className="flex-1 px-4 space-y-2 mt-4">
            {}
            <button onClick={() => setVistaActual('dashboard')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 font-medium ${vistaActual === 'dashboard' ? 'bg-violet-600 text-white shadow-lg shadow-violet-500/25' : 'text-slate-400 hover:bg-white/5 hover:text-white'}`}>
              <LayoutDashboard className="w-5 h-5" /> Inicio
            </button>
            <button 
              onClick={() => setVistaActual('clientes')} 
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 font-medium ${
                vistaActual === 'clientes' || vistaActual === 'perfil' 
                ? 'bg-violet-600 text-white shadow-lg shadow-violet-500/25' 
                : 'text-slate-400 hover:bg-white/5 hover:text-white'
              }`}
            >
              <Users className="w-5 h-5" /> Clientes
            </button>
            <button onClick={() => setVistaActual('facturas')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 font-medium ${vistaActual === 'facturas' ? 'bg-violet-600 text-white shadow-lg shadow-violet-500/25' : 'text-slate-400 hover:bg-white/5 hover:text-white'}`}>
              <Receipt className="w-5 h-5" /> Facturación
            </button>
          </nav>

          {}
          <div className="p-6 mt-auto border-t border-white/5">
            <p className="text-xs text-slate-600 text-center font-medium">CLENT</p>
          </div>
        </aside>

        {}
        {}
        <main className="flex-1 bg-[#121212] rounded-xl shadow-2xl overflow-hidden border border-white/5 flex flex-col transition-colors duration-300">
          
          <header className="px-10 pt-10 pb-6 border-b border-white/5">
            <h2 className="text-3xl font-bold text-white transition-colors duration-300">
              {vistaActual === 'dashboard' && 'Panel De Control'}
              {vistaActual === 'clientes' && 'Clientes'}
              {vistaActual === 'facturas' && 'Facturas'}
              {vistaActual === 'perfil' && 'Perfil del Cliente'}
            </h2>
          </header>
          
          <div className="flex-1 p-10 overflow-y-auto">
            {vistaActual === 'dashboard' && <Dashboard />}
            
            {vistaActual === 'clientes' && (
              <Clientes onVerPerfil={(id) => {
                setClienteIdSeleccionado(id);
                setVistaActual('perfil');
              }} />
            )}
            
            {vistaActual === 'facturas' && <Facturas />}
            
            {vistaActual === 'perfil' && (
              <PerfilCliente 
                clienteId={clienteIdSeleccionado} 
                volver={() => setVistaActual('clientes')} 
              />
            )}
          </div>
          
        </main>

      </div>
    </div>
  )
}

export default App