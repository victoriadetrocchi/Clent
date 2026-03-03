import { useState, useEffect } from 'react'
import toast from 'react-hot-toast'
import jsPDF from 'jspdf'
import autoTable from 'jspdf-autotable'
import { Search, Download, UserPlus, Trash2, Eye, Users } from 'lucide-react'

export function Clientes({ onVerPerfil }) {
  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const [terminoBusqueda, setTerminoBusqueda] = useState('');

  const [clientes, setClientes] = useState(() => {
    const clientesGuardados = localStorage.getItem('vdt-crm-clientes');
    return clientesGuardados ? JSON.parse(clientesGuardados) : [];
  });

  useEffect(() => {
    localStorage.setItem('vdt-crm-clientes', JSON.stringify(clientes));
  }, [clientes]);

  const [formData, setFormData] = useState({ nombre: '', email: '', servicio: '' });

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.nombre || !formData.email || !formData.servicio) {
      toast.error('Completá todos los campos');
      return;
    }

    const nuevoCliente = {
      id: Date.now(),
      nombre: formData.nombre,
      email: formData.email,
      servicio: formData.servicio
    };

    setClientes([...clientes, nuevoCliente]);
    setFormData({ nombre: '', email: '', servicio: '' });
    setMostrarFormulario(false);
    toast.success('Cliente guardado');
  };

  const eliminarCliente = (id) => {
    if (window.confirm('¿Seguro que querés eliminarlo?')) {
      setClientes(clientes.filter(cliente => cliente.id !== id));
      toast.error('Cliente eliminado');
    }
  };

  const exportarPDF = () => {
    if (clientes.length === 0) {
      toast.error('No hay clientes para exportar');
      return;
    }

    const doc = new jsPDF();
    doc.setFontSize(18);
    doc.text('Directorio de Clientes - CLENT', 14, 22);
    
    const columnas = [['Nombre / Empresa', 'Email', 'Servicio Prestado']];
    const datos = clientes.map(c => [c.nombre, c.email, c.servicio]);

    autoTable(doc, {
      startY: 30,
      head: columnas,
      body: datos,
      theme: 'grid',
      headStyles: { fillColor: [139, 92, 246] }, 
    });

    doc.save('clientes_clent.pdf');
    toast.success('¡PDF generado con éxito!');
  };

  const obtenerIniciales = (nombre) => {
    const partes = nombre.trim().split(' ');
    if (partes.length >= 2) return (partes[0][0] + partes[1][0]).toUpperCase();
    return nombre.substring(0, 2).toUpperCase();
  };

  const clientesFiltrados = clientes.filter(cliente => 
    cliente.nombre.toLowerCase().includes(terminoBusqueda.toLowerCase()) ||
    cliente.servicio.toLowerCase().includes(terminoBusqueda.toLowerCase())
  );

  return (
    <div className="space-y-6 animate-fade-in">
      
      {}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-2">
        <div>
          <h2 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
            Gestión de Clientes
          </h2>
          <p className="text-slate-500 text-sm mt-1">
            Seguimiento completo de clientes y servicios.
          </p>
        </div>
        
        {!mostrarFormulario && (
          <div className="flex gap-3 mt-2 sm:mt-0">
            <button 
              onClick={exportarPDF} 
              className="bg-[#18181C] hover:bg-[#27272A] text-slate-300 border border-[#27272A] px-4 py-2 rounded-xl font-medium transition-colors flex items-center gap-2 text-sm shadow-sm"
            >
              <Download className="w-4 h-4" /> Exportar PDF
            </button>
            <button 
              onClick={() => setMostrarFormulario(true)} 
              className="bg-[#8B5CF6] hover:bg-[#7C3AED] text-white px-4 py-2 rounded-xl font-medium transition-colors flex items-center gap-2 text-sm shadow-md shadow-violet-900/20"
            >
              <UserPlus className="w-4 h-4" /> Nuevo Cliente
            </button>
          </div>
        )}
      </div>

      {mostrarFormulario ? (
        <div className="bg-[#18181C] p-8 rounded-2xl border border-[#27272A] shadow-sm transition-colors duration-300">
          <h3 className="text-lg font-bold text-white mb-6">Agregar Nuevo Cliente</h3>
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-slate-400 mb-2">Nombre / Empresa</label>
              <input type="text" name="nombre" value={formData.nombre} onChange={handleInputChange} className="w-full bg-[#111113] border border-[#27272A] text-white rounded-xl px-4 py-3 focus:outline-none focus:border-[#8B5CF6] focus:ring-1 focus:ring-[#8B5CF6] transition-colors placeholder:text-slate-600" placeholder="Ej: VDT Hybrid Minimal Tech" />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className="block text-sm font-medium text-slate-400 mb-2">Email</label>
                <input type="email" name="email" value={formData.email} onChange={handleInputChange} className="w-full bg-[#111113] border border-[#27272A] text-white rounded-xl px-4 py-3 focus:outline-none focus:border-[#8B5CF6] focus:ring-1 focus:ring-[#8B5CF6] transition-colors placeholder:text-slate-600" placeholder="contacto@empresa.com" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-400 mb-2">Servicio Prestado</label>
                <input type="text" name="servicio" value={formData.servicio} onChange={handleInputChange} className="w-full bg-[#111113] border border-[#27272A] text-white rounded-xl px-4 py-3 focus:outline-none focus:border-[#8B5CF6] focus:ring-1 focus:ring-[#8B5CF6] transition-colors placeholder:text-slate-600" placeholder="Ej: Desarrollo Web" />
              </div>
            </div>
            <div className="pt-4 flex justify-end gap-3 border-t border-[#27272A] mt-6">
              <button type="button" onClick={() => setMostrarFormulario(false)} className="px-6 py-2.5 text-slate-400 hover:bg-[#27272A] rounded-xl font-medium transition-colors mt-4 text-sm">Cancelar</button>
              <button type="submit" className="bg-[#8B5CF6] hover:bg-[#7C3AED] text-white px-8 py-2.5 rounded-xl font-medium transition-colors shadow-md shadow-violet-900/20 mt-4 text-sm">Guardar Cliente</button>
            </div>
          </form>
        </div>
      ) : (
        <>
          <div className="bg-[#18181C] p-2 rounded-2xl border border-[#27272A] shadow-sm flex items-center gap-3 transition-colors duration-300">
            <Search className="w-5 h-5 text-slate-500 ml-3" />
            <input 
              type="text" 
              value={terminoBusqueda}
              onChange={(e) => setTerminoBusqueda(e.target.value)}
              placeholder="Buscar cliente por nombre o servicio..." 
              className="flex-1 bg-transparent border-none py-2 text-white focus:outline-none focus:ring-0 placeholder:text-slate-600" 
            />
          </div>

          <div className="bg-[#18181C] rounded-2xl border border-[#27272A] shadow-sm overflow-hidden transition-colors duration-300">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-[#1F1F24]/50 border-b border-[#27272A] text-slate-400 text-xs uppercase tracking-wider">
                    <th className="p-5 font-semibold pl-6">Cliente</th>
                    <th className="p-5 font-semibold">Email</th>
                    <th className="p-5 font-semibold">Servicio</th>
                    <th className="p-5 font-semibold text-right pr-6">Acciones</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#27272A]">
                  {clientesFiltrados.map((cliente) => (
                    <tr key={cliente.id} className="hover:bg-white/[0.02] transition-colors group">
                      <td className="p-5 pl-6">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-lg bg-[#8B5CF6]/10 text-[#8B5CF6] flex items-center justify-center text-xs font-bold border border-[#8B5CF6]/20">
                            {obtenerIniciales(cliente.nombre)}
                          </div>
                          <span className="font-medium text-slate-200">{cliente.nombre}</span>
                        </div>
                      </td>
                      <td className="p-5 text-slate-400 text-sm">{cliente.email}</td>
                      <td className="p-5">
                        <span className="bg-[#8B5CF6]/10 text-[#8B5CF6] px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wide border border-[#8B5CF6]/20">
                          {cliente.servicio}
                        </span>
                      </td>
                      <td className="p-5 pr-6 text-right flex justify-end gap-2">
                        <button onClick={() => onVerPerfil(cliente.id)} className="flex items-center gap-1.5 text-slate-400 hover:text-[#8B5CF6] font-medium text-xs transition-colors px-3 py-1.5 rounded-lg hover:bg-[#8B5CF6]/10">
                          <Eye className="w-4 h-4" /> Perfil
                        </button>
                        <button onClick={() => eliminarCliente(cliente.id)} className="flex items-center gap-1.5 text-slate-400 hover:text-red-400 font-medium text-xs transition-colors px-3 py-1.5 rounded-lg hover:bg-red-500/10 opacity-0 group-hover:opacity-100">
                          <Trash2 className="w-4 h-4" /> Eliminar
                        </button>
                      </td>
                    </tr>
                  ))}
                  
                  {}
                  {clientesFiltrados.length === 0 && (
                    <tr>
                      <td colSpan="4" className="p-12 text-center">
                        <div className="flex flex-col items-center justify-center space-y-3">
                          <div className="w-12 h-12 rounded-full bg-[#27272A] flex items-center justify-center">
                            <Users className="w-6 h-6 text-slate-500" />
                          </div>
                          <p className="text-slate-300 font-medium">Directorio vacío</p>
                          <p className="text-slate-500 text-sm max-w-sm">
                            Todavía no tenés clientes registrados o tu búsqueda no dio resultados. ¡Agregá tu primer cliente para hacer crecer tu red! 🚀
                          </p>
                        </div>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}
    </div>
  )
}