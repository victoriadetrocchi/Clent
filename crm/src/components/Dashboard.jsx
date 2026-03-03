import { useState, useEffect } from 'react'
import { BarChart, Bar, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts'
import { Wallet, TrendingUp, Users, Download, ArrowUpRight, Clock } from 'lucide-react'
import toast from 'react-hot-toast'
import jsPDF from 'jspdf'
import autoTable from 'jspdf-autotable'

export function Dashboard() {
  const [metricas, setMetricas] = useState({ ingresos: 0, pendientes: 0, totalClientes: 0 });
  const [filtroTiempo, setFiltroTiempo] = useState('historico');
  const [clientes, setClientes] = useState([]);
  const [facturasRecientes, setFacturasRecientes] = useState([]);
  const [datosEvolucion, setDatosEvolucion] = useState([]);

  useEffect(() => {
    const clientesGuardados = JSON.parse(localStorage.getItem('vdt-crm-clientes')) || [];
    const facturasGuardadas = JSON.parse(localStorage.getItem('vdt-crm-facturas')) || [];
    
    setClientes(clientesGuardados);

    let facturasFiltradas = facturasGuardadas;

    if (filtroTiempo === 'mes') {
      const fechaActual = new Date();
      const mesActual = fechaActual.getMonth() + 1;
      const anioActual = fechaActual.getFullYear();
      facturasFiltradas = facturasGuardadas.filter(f => {
        if(!f.fechaVencimiento) return false;
        const [anio, mes] = f.fechaVencimiento.split('-');
        return Number(anio) === anioActual && Number(mes) === mesActual;
      });
    } else if (filtroTiempo === 'anio') {
      const anioActual = new Date().getFullYear();
      facturasFiltradas = facturasGuardadas.filter(f => {
        if(!f.fechaVencimiento) return false;
        const [anio] = f.fechaVencimiento.split('-');
        return Number(anio) === anioActual;
      });
    }

    const totalClientes = clientesGuardados.length;
    const ingresos = facturasFiltradas.filter(f => f.estado === 'Pagada').reduce((t, f) => t + f.monto, 0);
    const pendientes = facturasFiltradas.filter(f => f.estado === 'Pendiente').reduce((t, f) => t + f.monto, 0);

    setMetricas({ ingresos, pendientes, totalClientes });

    const recientes = [...facturasFiltradas].sort((a, b) => b.id - a.id).slice(0, 5);
    setFacturasRecientes(recientes);

    const mesesNombres = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];
    const ventasPorMes = {};
    
    facturasGuardadas.forEach(f => {
      if(f.fechaVencimiento && f.estado === 'Pagada') {
        const [anio, mes] = f.fechaVencimiento.split('-');
        const nombreMes = `${mesesNombres[parseInt(mes) - 1]} ${anio.substring(2)}`;
        if(!ventasPorMes[nombreMes]) ventasPorMes[nombreMes] = 0;
        ventasPorMes[nombreMes] += f.monto;
      }
    });

    const datosEvol = Object.keys(ventasPorMes).map(mes => ({ nombre: mes, valor: ventasPorMes[mes] }));
    setDatosEvolucion(datosEvol.length > 0 ? datosEvol : [{nombre: 'Sin datos', valor: 0}]);

  }, [filtroTiempo]);

  const formatearPlata = (numero) => {
    return new Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS' }).format(numero);
  };

  const obtenerNombreCliente = (id) => {
    const cliente = clientes.find(c => c.id === id);
    return cliente ? cliente.nombre : 'Cliente Desconocido';
  };

  const descargarReportePDF = () => {
    const doc = new jsPDF();
    doc.setFontSize(18);
    doc.text(`Reporte Financiero CLENT - ${filtroTiempo.toUpperCase()}`, 14, 22);
    
    doc.setFontSize(12);
    doc.text(`Total Cobrado: $${metricas.ingresos}`, 14, 32);
    doc.text(`Deuda Pendiente: $${metricas.pendientes}`, 14, 40);
    doc.text(`Clientes Activos: ${metricas.totalClientes}`, 14, 48);

    if (facturasRecientes.length > 0) {
      const columnas = [['Cliente', 'Fecha', 'Monto', 'Estado']];
      const datos = facturasRecientes.map(f => [obtenerNombreCliente(f.clienteId), f.fechaVencimiento, `$${f.monto}`, f.estado]);
      
      autoTable(doc, {
        startY: 55,
        head: columnas,
        body: datos,
        theme: 'grid',
        headStyles: { fillColor: [139, 92, 246] },
      });
    }

    doc.save(`reporte_clent_${filtroTiempo}.pdf`);
    toast.success('¡PDF generado con éxito!');
  };

  const datosBarras = [
    { nombre: 'Cobrado', valor: metricas.ingresos, color: '#8B5CF6' },
    { nombre: 'Pendiente', valor: metricas.pendientes, color: '#6366f1' }
  ];

  const opcionesFecha = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
  const fechaHoy = new Date().toLocaleDateString('es-AR', opcionesFecha);

  return (
    <div className="space-y-6">
      
      {}
      <div className="mb-2 animate-fade-in">
        <h2 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
          ¡Hola! 
        </h2>
        <p className="text-slate-500 text-sm mt-1">
          Resumen actualizado al {fechaHoy}.
        </p>
      </div>

      {}
      <div className="flex items-center gap-6 border-b border-[#27272A] pb-0 animate-fade-in">
        <button onClick={() => setFiltroTiempo('mes')} className={`pb-3 text-sm font-medium transition-colors border-b-2 ${filtroTiempo === 'mes' ? 'border-[#8B5CF6] text-white' : 'border-transparent text-slate-400 hover:text-slate-300'}`}>Este Mes</button>
        <button onClick={() => setFiltroTiempo('anio')} className={`pb-3 text-sm font-medium transition-colors border-b-2 ${filtroTiempo === 'anio' ? 'border-[#8B5CF6] text-white' : 'border-transparent text-slate-400 hover:text-slate-300'}`}>Este Año</button>
        <button onClick={() => setFiltroTiempo('historico')} className={`pb-3 text-sm font-medium transition-colors border-b-2 ${filtroTiempo === 'historico' ? 'border-[#8B5CF6] text-white' : 'border-transparent text-slate-400 hover:text-slate-300'}`}>Histórico</button>
      </div>

      {}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4">
        
        {}
        <div className="bg-gradient-to-br from-[#8B5CF6] to-[#6D28D9] p-6 rounded-2xl shadow-lg flex flex-col justify-between animate-fade-in hover:translate-y-[-2px] transition-transform duration-300">
          <div className="flex justify-between items-start">
            <div className="p-2 bg-white/20 rounded-lg"><Wallet className="w-5 h-5 text-white" /></div>
          </div>
          <div className="mt-6">
            <h3 className="text-white/80 text-sm font-medium mb-1">Total Cobrado</h3>
            <div className="flex items-end gap-3">
              <p className="text-3xl font-bold text-white tracking-tight">{formatearPlata(metricas.ingresos)}</p>
              <span className="bg-emerald-500/20 text-emerald-300 text-[11px] px-2 py-0.5 rounded-md font-bold mb-1.5 border border-emerald-500/20 flex items-center gap-1">↑ 12.5%</span>
            </div>
            <p className="text-white/50 text-xs mt-2 font-medium">Comparado al período anterior</p>
          </div>
        </div>

        {}
        <div className="bg-[#18181C] border border-[#27272A] p-6 rounded-2xl flex flex-col justify-between shadow-sm hover-glow animate-fade-in delay-100 cursor-default">
          <div className="flex justify-between items-start">
            <div className="p-2 bg-[#27272A] rounded-lg transition-colors group-hover:bg-[#8B5CF6]/10"><TrendingUp className="w-5 h-5 text-[#8B5CF6]" /></div>
          </div>
          <div className="mt-6">
            <h3 className="text-slate-400 text-sm font-medium mb-1">Deuda Pendiente</h3>
            <div className="flex items-end gap-3">
              <p className="text-3xl font-bold text-white tracking-tight">{formatearPlata(metricas.pendientes)}</p>
              <span className="bg-red-500/10 text-red-400 text-[11px] px-2 py-0.5 rounded-md font-bold mb-1.5 border border-red-500/10 flex items-center gap-1">↓ 2.1%</span>
            </div>
            <p className="text-slate-500 text-xs mt-2 font-medium">Comparado al período anterior</p>
          </div>
        </div>

        {}
        <div className="bg-[#18181C] border border-[#27272A] p-6 rounded-2xl flex flex-col justify-between shadow-sm hover-glow animate-fade-in delay-200 cursor-default">
          <div className="flex justify-between items-start">
            <div className="p-2 bg-[#27272A] rounded-lg"><Users className="w-5 h-5 text-[#8B5CF6]" /></div>
          </div>
          <div className="mt-6">
            <h3 className="text-slate-400 text-sm font-medium mb-1">Clientes Activos</h3>
            <div className="flex items-end gap-3">
              <p className="text-3xl font-bold text-white tracking-tight">{metricas.totalClientes}</p>
              <span className="bg-emerald-500/10 text-emerald-400 text-[11px] px-2 py-0.5 rounded-md font-bold mb-1.5 border border-emerald-500/10 flex items-center gap-1">↑ Nuevos</span>
            </div>
            <p className="text-slate-500 text-xs mt-2 font-medium">Total en cartera</p>
          </div>
        </div>
      </div>

      {}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-2">
        
        {}
        <div className="bg-[#18181C] border border-[#27272A] p-6 rounded-2xl shadow-sm h-[380px] flex flex-col animate-fade-in delay-100 hover-glow">
          <div className="flex justify-between items-center mb-6">
              <h3 className="text-md font-bold text-white">Balance Financiero</h3>
              <button 
                onClick={descargarReportePDF}
                className="px-3 py-1.5 text-xs font-semibold text-[#8B5CF6] bg-[#8B5CF6]/10 rounded-lg hover:bg-[#8B5CF6]/20 transition-colors flex items-center gap-1.5"
              >
                  <Download className="w-3.5 h-3.5" /> PDF
              </button>
          </div>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={datosBarras} margin={{ top: 10, right: 10, left: 20, bottom: 20 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#27272A" />
              <XAxis dataKey="nombre" stroke="#71717A" tick={{fill: '#71717A', fontSize: 12}} axisLine={false} tickLine={false} tickMargin={12} />
              <YAxis stroke="#71717A" tick={{fill: '#71717A', fontSize: 12}} tickFormatter={(value) => `$${value}`} axisLine={false} tickLine={false} tickMargin={12} />
              <Tooltip cursor={{fill: 'rgba(255, 255, 255, 0.02)'}} contentStyle={{ backgroundColor: '#18181C', border: '1px solid #27272A', borderRadius: '8px', color: '#fff' }} />
              <Bar dataKey="valor" radius={[6, 6, 0, 0]} barSize={40}>
                {datosBarras.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        {}
        <div className="bg-[#18181C] border border-[#27272A] p-6 rounded-2xl shadow-sm h-[380px] flex flex-col animate-fade-in delay-200 hover-glow">
          <div className="flex justify-between items-center mb-6">
              <h3 className="text-md font-bold text-white">Evolución de Ingresos</h3>
          </div>
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={datosEvolucion} margin={{ top: 10, right: 10, left: 20, bottom: 20 }}>
              <defs>
                <linearGradient id="colorEvol" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.4}/>
                  <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#27272A" />
              <XAxis dataKey="nombre" stroke="#71717A" tick={{fill: '#71717A', fontSize: 12}} axisLine={false} tickLine={false} tickMargin={12} />
              <YAxis stroke="#71717A" tick={{fill: '#71717A', fontSize: 12}} tickFormatter={(value) => `$${value}`} axisLine={false} tickLine={false} tickMargin={12} />
              <Tooltip contentStyle={{ backgroundColor: '#18181C', border: '1px solid #27272A', borderRadius: '8px', color: '#fff' }} itemStyle={{ color: '#8b5cf6', fontWeight: 'bold' }} />
              <Area type="monotone" dataKey="valor" stroke="#8b5cf6" strokeWidth={3} fillOpacity={1} fill="url(#colorEvol)" activeDot={{ r: 5, fill: '#18181C', stroke: '#8b5cf6', strokeWidth: 2 }} />
            </AreaChart>
          </ResponsiveContainer>
        </div>

      </div>

      {}
      <div className="bg-[#18181C] border border-[#27272A] rounded-2xl shadow-sm overflow-hidden mt-6 animate-fade-in delay-300">
        <div className="p-6 border-b border-[#27272A] flex justify-between items-center">
          <h3 className="text-md font-bold text-white">Actividad Reciente</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[#1F1F24]/50 border-b border-[#27272A] text-slate-400 text-xs uppercase tracking-wider">
                <th className="p-4 font-semibold pl-6">Cliente</th>
                <th className="p-4 font-semibold">Monto</th>
                <th className="p-4 font-semibold">Fecha</th>
                <th className="p-4 font-semibold">Estado</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#27272A]">
              {facturasRecientes.map((factura) => (
                <tr key={factura.id} className="hover:bg-white/[0.02] transition-colors">
                  <td className="p-4 pl-6 text-sm font-medium text-slate-200">{obtenerNombreCliente(factura.clienteId)}</td>
                  <td className="p-4 text-sm text-slate-300">${factura.monto}</td>
                  <td className="p-4 text-sm text-slate-400">{factura.fechaVencimiento}</td>
                  <td className="p-4">
                    <span className={`inline-flex items-center gap-2 px-2.5 py-1 rounded-md text-[11px] font-bold uppercase tracking-wide border ${
                      factura.estado === 'Pagada' 
                      ? 'bg-[#10B981]/10 text-[#10B981] border-[#10B981]/20' 
                      : 'bg-[#F59E0B]/10 text-[#F59E0B] border-[#F59E0B]/20'
                    }`}>
                      {factura.estado === 'Pagada' 
                        ? <span className="w-1.5 h-1.5 rounded-full bg-[#10B981] led-pulse"></span> 
                        : <Clock className="w-3 h-3 text-[#F59E0B]" />
                      }
                      {factura.estado}
                    </span>
                  </td>
                </tr>
              ))}
              {facturasRecientes.length === 0 && (
                <tr>
                  <td colSpan="4" className="p-12 text-center">
                    <div className="flex flex-col items-center justify-center space-y-3">
                      <div className="w-12 h-12 rounded-full bg-[#27272A] flex items-center justify-center">
                        <Wallet className="w-5 h-5 text-slate-500" />
                      </div>
                      <p className="text-slate-300 font-medium">Todo al día</p>
                      <p className="text-slate-500 text-sm max-w-sm">
                        No hay movimientos recientes en este período. ¡Es un gran momento para salir a cerrar nuevas ventas! ✨
                      </p>
                    </div>
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