import { useState, useEffect } from 'react'
import { ArrowLeft, Wallet, TrendingUp, CheckCircle2, Clock } from 'lucide-react'

export function PerfilCliente({ clienteId, volver }) {
  const [cliente, setCliente] = useState(null);
  const [facturasCliente, setFacturasCliente] = useState([]);
  const [metricas, setMetricas] = useState({ facturado: 0, pendiente: 0 });

  useEffect(() => {
    const clientesGuardados = JSON.parse(localStorage.getItem('vdt-crm-clientes')) || [];
    const clienteEncontrado = clientesGuardados.find(c => c.id === clienteId);
    setCliente(clienteEncontrado);

    const facturasGuardadas = JSON.parse(localStorage.getItem('vdt-crm-facturas')) || [];
    const facturasFiltradas = facturasGuardadas.filter(f => f.clienteId === clienteId);
    setFacturasCliente(facturasFiltradas);

    const facturado = facturasFiltradas.reduce((total, f) => total + f.monto, 0);
    const pendiente = facturasFiltradas.filter(f => f.estado === 'Pendiente').reduce((total, f) => total + f.monto, 0);

    setMetricas({ facturado, pendiente });
  }, [clienteId]);

  const formatearPlata = (numero) => {
    return new Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS' }).format(numero);
  };

  if (!cliente) return <div className="p-10 text-center text-slate-500">Cargando perfil del cliente...</div>;

  return (
    <div className="space-y-6 animate-fade-in">
      
      {/* ENCABEZADO Y BOTÓN DE VOLVER */}
      <div className="flex items-center gap-4 border-b border-[#27272A] pb-6">
        <button 
          onClick={volver}
          className="p-2.5 bg-[#18181C] hover:bg-[#27272A] text-slate-400 hover:text-white rounded-xl transition-colors border border-[#27272A] shadow-sm"
          title="Volver a clientes"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div>
          <h2 className="text-2xl font-bold text-white tracking-tight">{cliente.nombre}</h2>
          <div className="flex items-center gap-2 mt-1">
            <p className="text-slate-400 text-sm">{cliente.email}</p>
            <span className="text-slate-600">•</span>
            <span className="bg-[#8B5CF6]/10 text-[#8B5CF6] px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wide border border-[#8B5CF6]/20">
              {cliente.servicio}
            </span>
          </div>
        </div>
      </div>

      {/* TARJETAS DE MÉTRICAS INDIVIDUALES */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-[#18181C] p-6 rounded-2xl border border-[#27272A] shadow-sm transition-colors duration-300 flex flex-col justify-between">
          <div className="flex justify-between items-start">
            <div className="p-2 bg-[#27272A] rounded-lg"><Wallet className="w-5 h-5 text-[#8B5CF6]" /></div>
          </div>
          <div className="mt-6">
            <h3 className="text-slate-400 text-sm font-medium mb-1">Historial Facturado</h3>
            <p className="text-3xl font-bold text-white tracking-tight">{formatearPlata(metricas.facturado)}</p>
          </div>
        </div>
        
        <div className="bg-[#18181C] p-6 rounded-2xl border border-[#27272A] shadow-sm transition-colors duration-300 flex flex-col justify-between">
          <div className="flex justify-between items-start">
            <div className="p-2 bg-[#27272A] rounded-lg"><TrendingUp className="w-5 h-5 text-[#8B5CF6]" /></div>
          </div>
          <div className="mt-6">
            <h3 className="text-slate-400 text-sm font-medium mb-1">Deuda Pendiente</h3>
            <p className="text-3xl font-bold text-white tracking-tight">{formatearPlata(metricas.pendiente)}</p>
          </div>
        </div>
      </div>

      {/* HISTORIAL DE FACTURAS DEL CLIENTE */}
      <div className="bg-[#18181C] rounded-2xl border border-[#27272A] shadow-sm overflow-hidden transition-colors duration-300 mt-8">
        <div className="p-6 border-b border-[#27272A] flex items-center justify-between">
          <h3 className="text-md font-bold text-white">Historial de Facturas</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[#1F1F24]/50 border-b border-[#27272A] text-slate-400 text-xs uppercase tracking-wider">
                <th className="p-5 font-semibold pl-6">Fecha de Venc.</th>
                <th className="p-5 font-semibold">Monto</th>
                <th className="p-5 font-semibold pr-6">Estado</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#27272A]">
              {facturasCliente.map((factura) => (
                <tr key={factura.id} className="hover:bg-white/[0.02] transition-colors">
                  <td className="p-5 pl-6 text-slate-400 text-sm">{factura.fechaVencimiento}</td>
                  <td className="p-5 font-medium text-slate-200">${factura.monto}</td>
                  <td className="p-5 pr-6">
                    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[11px] font-bold uppercase tracking-wide border ${
                      factura.estado === 'Pagada' 
                      ? 'bg-[#10B981]/10 text-[#10B981] border-[#10B981]/20' 
                      : 'bg-[#F59E0B]/10 text-[#F59E0B] border-[#F59E0B]/20'
                    }`}>
                      {factura.estado === 'Pagada' ? <CheckCircle2 className="w-3 h-3" /> : <Clock className="w-3 h-3" />}
                      {factura.estado}
                    </span>
                  </td>
                </tr>
              ))}
              {facturasCliente.length === 0 && (
                <tr>
                  <td colSpan="3" className="p-10 text-center text-slate-500 text-sm">
                    Este cliente todavía no tiene facturas emitidas.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  )
}