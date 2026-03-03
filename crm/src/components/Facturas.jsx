import { useState, useEffect } from 'react'
import toast from 'react-hot-toast'
import { Plus, Trash2, CheckCircle2, Clock, Receipt } from 'lucide-react'

export function Facturas() {
  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const [clientes, setClientes] = useState([]);
  
  useEffect(() => {
    const clientesGuardados = localStorage.getItem('vdt-crm-clientes');
    if (clientesGuardados) setClientes(JSON.parse(clientesGuardados));
  }, []);

  const [facturas, setFacturas] = useState(() => {
    const facturasGuardadas = localStorage.getItem('vdt-crm-facturas');
    return facturasGuardadas ? JSON.parse(facturasGuardadas) : [];
  });

  useEffect(() => {
    localStorage.setItem('vdt-crm-facturas', JSON.stringify(facturas));
  }, [facturas]);

  const [formData, setFormData] = useState({ clienteId: '', monto: '', fechaVencimiento: '', estado: 'Pendiente' });

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.clienteId || !formData.monto || !formData.fechaVencimiento) {
      toast.error('Por favor completá todos los campos');
      return;
    }

    const nuevaFactura = {
      id: Date.now(),
      clienteId: Number(formData.clienteId),
      monto: Number(formData.monto),
      fechaVencimiento: formData.fechaVencimiento,
      estado: formData.estado
    };

    setFacturas([...facturas, nuevaFactura]);
    setFormData({ clienteId: '', monto: '', fechaVencimiento: '', estado: 'Pendiente' });
    setMostrarFormulario(false);
    toast.success('¡Factura emitida correctamente!');
  };

  const eliminarFactura = (id) => {
    if (window.confirm('¿Eliminar esta factura?')) {
      setFacturas(facturas.filter(f => f.id !== id));
      toast.error('Factura eliminada del sistema');
    }
  };

  const alternarEstado = (id) => {
    const facturasActualizadas = facturas.map(factura => {
      if (factura.id === id) {
        const nuevoEstado = factura.estado === 'Pendiente' ? 'Pagada' : 'Pendiente';
        if (nuevoEstado === 'Pagada') {
          toast.success('¡Factura marcada como Pagada!');
        } else {
          toast('Factura devuelta a Pendiente', { icon: '⏳' });
        }
        return { ...factura, estado: nuevoEstado };
      }
      return factura;
    });
    setFacturas(facturasActualizadas);
  };

  const obtenerNombreCliente = (id) => {
    const cliente = clientes.find(c => c.id === id);
    return cliente ? cliente.nombre : 'Cliente eliminado';
  };

  return (
    <div className="space-y-6 animate-fade-in">
      
      {}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-2">
        <div>
          <h2 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
            Gestión de Facturación 
          </h2>
          <p className="text-slate-500 text-sm mt-1">
            Emití facturas y seguí el estado de pago de tus clientes.
          </p>
        </div>

        {!mostrarFormulario && (
          <button 
            onClick={() => setMostrarFormulario(true)} 
            className="bg-[#8B5CF6] hover:bg-[#7C3AED] text-white px-4 py-2 rounded-xl font-medium transition-colors flex items-center gap-2 text-sm shadow-md shadow-violet-900/20 mt-2 sm:mt-0"
          >
            <Plus className="w-4 h-4" /> Nueva Factura
          </button>
        )}
      </div>

      {}
      {mostrarFormulario ? (
        <div className="bg-[#18181C] p-8 rounded-2xl border border-[#27272A] shadow-sm transition-colors duration-300">
          <h3 className="text-lg font-bold text-white mb-6">Emitir Nueva Factura</h3>
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-slate-400 mb-2">Seleccionar Cliente</label>
              <select name="clienteId" value={formData.clienteId} onChange={handleInputChange} className="w-full bg-[#111113] border border-[#27272A] text-white rounded-xl px-4 py-3 focus:outline-none focus:border-[#8B5CF6] focus:ring-1 focus:ring-[#8B5CF6] transition-colors">
                <option value="">-- Elegí un cliente --</option>
                {clientes.map(cliente => (
                  <option key={cliente.id} value={cliente.id}>{cliente.nombre}</option>
                ))}
              </select>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              <div>
                <label className="block text-sm font-medium text-slate-400 mb-2">Monto ($)</label>
                <input type="number" name="monto" value={formData.monto} onChange={handleInputChange} className="w-full bg-[#111113] border border-[#27272A] text-white rounded-xl px-4 py-3 focus:outline-none focus:border-[#8B5CF6] focus:ring-1 focus:ring-[#8B5CF6] transition-colors placeholder:text-slate-600" placeholder="0.00" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-400 mb-2">Fecha de Vencimiento</label>
                <input type="date" name="fechaVencimiento" value={formData.fechaVencimiento} onChange={handleInputChange} className="w-full bg-[#111113] border border-[#27272A] text-white rounded-xl px-4 py-3 focus:outline-none focus:border-[#8B5CF6] focus:ring-1 focus:ring-[#8B5CF6] transition-colors style-color-scheme-dark" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-400 mb-2">Estado</label>
                <select name="estado" value={formData.estado} onChange={handleInputChange} className="w-full bg-[#111113] border border-[#27272A] text-white rounded-xl px-4 py-3 focus:outline-none focus:border-[#8B5CF6] focus:ring-1 focus:ring-[#8B5CF6] transition-colors">
                  <option value="Pendiente">Pendiente</option>
                  <option value="Pagada">Pagada</option>
                </select>
              </div>
            </div>
            <div className="pt-4 flex justify-end gap-3 border-t border-[#27272A] mt-6">
              <button type="button" onClick={() => setMostrarFormulario(false)} className="px-6 py-2.5 text-slate-400 hover:bg-[#27272A] rounded-xl font-medium transition-colors mt-4 text-sm">Cancelar</button>
              <button type="submit" className="bg-[#8B5CF6] hover:bg-[#7C3AED] text-white px-8 py-2.5 rounded-xl font-medium transition-colors shadow-md shadow-violet-900/20 mt-4 text-sm">Guardar Factura</button>
            </div>
          </form>
        </div>
      ) : (

        <div className="bg-[#18181C] rounded-2xl border border-[#27272A] shadow-sm overflow-hidden transition-colors duration-300">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-[#1F1F24]/50 border-b border-[#27272A] text-slate-400 text-xs uppercase tracking-wider">
                  <th className="p-5 font-semibold pl-6">Cliente</th>
                  <th className="p-5 font-semibold">Monto</th>
                  <th className="p-5 font-semibold">Vencimiento</th>
                  <th className="p-5 font-semibold text-center">Estado</th>
                  <th className="p-5 font-semibold text-right pr-6">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#27272A]">
                {facturas.map((factura) => (
                  <tr key={factura.id} className="hover:bg-white/[0.02] transition-colors group">
                    <td className="p-5 pl-6 font-medium text-slate-200">{obtenerNombreCliente(factura.clienteId)}</td>
                    <td className="p-5 text-slate-300 font-medium">${factura.monto}</td>
                    <td className="p-5 text-slate-400 text-sm">{factura.fechaVencimiento}</td>
                    
                    <td className="p-5 text-center">
                      <button 
                        onClick={() => alternarEstado(factura.id)}
                        className={`flex items-center justify-center gap-1.5 mx-auto px-2.5 py-1 rounded-md text-[11px] font-bold uppercase tracking-wide border transition-all ${
                          factura.estado === 'Pagada' 
                          ? 'bg-[#10B981]/10 text-[#10B981] border-[#10B981]/20 hover:bg-[#10B981]/20' 
                          : 'bg-[#F59E0B]/10 text-[#F59E0B] border-[#F59E0B]/20 hover:bg-[#F59E0B]/20'
                        }`}
                      >
                        {factura.estado === 'Pagada' ? <CheckCircle2 className="w-3 h-3" /> : <Clock className="w-3 h-3" />}
                        {factura.estado}
                      </button>
                    </td>
                    
                    <td className="p-5 pr-6 text-right">
                      <button onClick={() => eliminarFactura(factura.id)} className="flex items-center justify-end gap-1.5 ml-auto text-slate-400 hover:text-red-400 font-medium text-xs transition-colors px-3 py-1.5 rounded-lg hover:bg-red-500/10 opacity-0 group-hover:opacity-100">
                        <Trash2 className="w-4 h-4" /> Eliminar
                      </button>
                    </td>
                  </tr>
                ))}

                {}
                {facturas.length === 0 && (
                  <tr>
                    <td colSpan="5" className="p-12 text-center">
                      <div className="flex flex-col items-center justify-center space-y-3">
                        <div className="w-12 h-12 rounded-full bg-[#27272A] flex items-center justify-center">
                          <Receipt className="w-6 h-6 text-slate-500" />
                        </div>
                        <p className="text-slate-300 font-medium">Sin comprobantes</p>
                        <p className="text-slate-500 text-sm max-w-sm">
                          No hay facturas emitidas por el momento. Registrá tu primer cobro para empezar a medir tus ingresos. 💸
                        </p>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  )
}