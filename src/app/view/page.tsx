import { db } from "@/app/lib/db";
import { redirect } from "next/navigation";
import { 
  ArrowLeft, Monitor, Cpu, HardDrive, 
  User, Tag, Keyboard, MessageSquare, AlertCircle, 
  Activity, Shield 
} from "lucide-react";
import Link from "next/link";

export default async function PaginaConsultaMaestra({ 
  searchParams 
}: { 
  searchParams: Promise<{ id?: string, filtro?: string }> 
}) {
  const { id, filtro } = await searchParams;

  // --- VISTA DE DETALLE (SOLO LECTURA) ---
  if (id) {
    const result = await db.query('SELECT * FROM computadoras WHERE id = $1', [id]);
    const data = result.rows[0];
    if (!data) return redirect("/view");

    // Componente interno para mantener la misma estructura visual de los campos
    const CampoLectura = ({ icon: Icon, etiqueta, valor, placeholder = "" }: any) => (
      <div className="space-y-1">
        <label className="text-[9px] font-black text-slate-400 uppercase ml-2 flex items-center gap-1">
          <Icon size={10}/> {etiqueta}
        </label>
        <div className="w-full p-3 bg-slate-50 rounded-xl border border-transparent font-bold text-slate-700 text-sm min-h-[46px] flex items-center">
          {valor || <span className="text-slate-300 font-normal">{placeholder}</span>}
        </div>
      </div>
    );

    return (
      <main className="min-h-screen bg-slate-50 p-4 flex flex-col items-center select-none">
        <div className="w-full max-w-md">
          <Link href="/view" className="flex items-center gap-2 text-slate-400 mb-6 font-bold text-xs uppercase tracking-widest hover:text-blue-600 transition-colors">
            <ArrowLeft size={14} /> Volver al Inventario
          </Link>

          <div className="bg-white rounded-[2.5rem] shadow-2xl border border-slate-100 p-8 space-y-4">
            <header className="flex items-center gap-4 mb-2">
              <div className="bg-slate-900 p-3 rounded-2xl text-white shadow-lg"><Monitor size={24} /></div>
              <h1 className="text-xl font-black text-slate-800 uppercase italic">Consulta Técnica</h1>
            </header>

            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <CampoLectura icon={Tag} etiqueta="Inventario #" valor={data.numero_inventario} />
                <CampoLectura icon={Shield} etiqueta="Resp. Área" valor={data.responsable_area} placeholder="Jefe de depto." />
              </div>

              <CampoLectura icon={User} etiqueta="Responsable Equipo" valor={data.responsable_inventario} />

              <div className="space-y-1">
                <label className="text-[9px] font-black text-slate-400 uppercase ml-2">Marca y Modelo</label>
                <div className="w-full p-3 bg-slate-50 rounded-xl border border-transparent font-bold text-slate-700 text-sm">
                  {data.marca_modelo}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <CampoLectura icon={Cpu} etiqueta="Procesador" valor={data.procesador} />
                <CampoLectura icon={Activity} etiqueta="RAM" valor={data.memoria_ram} />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <CampoLectura icon={HardDrive} etiqueta="Disco" valor={data.almacenamiento} />
                <CampoLectura icon={Monitor} etiqueta="Monitor" valor={data.monitor} />
              </div>

              <CampoLectura icon={Keyboard} etiqueta="Periféricos" valor={data.mouse_teclado} placeholder="Mouse/Teclado mod." />

              <div className="space-y-1">
                <label className="text-[9px] font-black text-slate-400 uppercase ml-2 flex items-center gap-1"><MessageSquare size={10}/> Observaciones</label>
                <div className="w-full p-3 bg-slate-50 rounded-xl border border-transparent font-bold text-slate-700 text-xs italic min-h-[60px]">
                  {data.observacion || "Sin observaciones."}
                </div>
              </div>

              <div className={`flex items-center justify-between p-4 rounded-2xl border transition-all ${data.requiere_mantenimiento ? 'bg-red-50 border-red-100 text-red-700' : 'bg-slate-50 border-slate-100 text-slate-400'}`}>
                <div className="flex items-center gap-2">
                  <AlertCircle size={18} />
                  <span className="text-[10px] font-black uppercase tracking-widest">
                    {data.requiere_mantenimiento ? "Requiere Mantenimiento" : "Estado Operativo"}
                  </span>
                </div>
                <div className={`w-5 h-5 rounded-lg border-2 flex items-center justify-center ${data.requiere_mantenimiento ? 'bg-red-600 border-red-600 text-white' : 'border-slate-200'}`}>
                  {data.requiere_mantenimiento && "✓"}
                </div>
              </div>
            </div>

            <div className="w-full bg-slate-100 text-slate-400 py-4 rounded-2xl font-black flex items-center justify-center gap-3 uppercase text-xs tracking-widest cursor-not-allowed">
               Modo Lectura
            </div>
          </div>
        </div>
      </main>
    );
  }

  // --- VISTA DE LISTA ---
  let querySql = 'SELECT * FROM computadoras';
  if (filtro === 'mantenimiento') querySql += ' WHERE requiere_mantenimiento = true';
  querySql += ' ORDER BY numero_inventario ASC';

  const allResult = await db.query(querySql);
  const computadoras = allResult.rows;

  return (
    <main className="min-h-screen bg-slate-50 p-6 flex flex-col items-center font-sans">
      <div className="w-full max-w-xl">
        <header className="mb-10 text-center space-y-4">
          <h1 className="text-3xl font-black text-slate-800 uppercase italic tracking-tighter">Consulta Inventario</h1>
          <div className="flex gap-2 justify-center">
            <Link href="/view" className={`px-5 py-2 rounded-full text-[9px] font-black uppercase border transition-all ${!filtro ? 'bg-slate-900 text-white shadow-lg' : 'bg-white text-slate-400'}`}>Todos</Link>
            <Link href="/view?filtro=mantenimiento" className={`px-5 py-2 rounded-full text-[9px] font-black uppercase border transition-all ${filtro === 'mantenimiento' ? 'bg-red-600 text-white shadow-lg' : 'bg-white text-red-400'}`}>Urgente</Link>
          </div>
        </header>

        <div className="space-y-3">
          {computadoras.map((pc: any) => (
            <div key={pc.id} className="bg-white p-5 rounded-[2.2rem] shadow-sm border border-slate-100 flex items-center justify-between group hover:border-emerald-400 transition-all">
              <div className="flex items-center gap-4">
                <div className={`p-4 rounded-2xl ${pc.requiere_mantenimiento ? 'bg-red-50 text-red-500' : 'bg-blue-50 text-blue-500'}`}>
                  <Monitor size={22} />
                </div>
                <div>
                  <h2 className="font-black text-slate-800 uppercase text-xs leading-none">#{pc.numero_inventario} - {pc.marca_modelo}</h2>
                  <p className="text-[10px] text-blue-600 font-bold uppercase mt-1 tracking-tighter">Resp: {pc.responsable_inventario}</p>
                </div>
              </div>
              <Link href={`/view?id=${pc.id}`} className="bg-slate-900 text-white p-4 rounded-2xl hover:bg-emerald-600 transition-colors shadow-md">
                <Monitor size={18} />
              </Link>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}