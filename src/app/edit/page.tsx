import { db } from "@/app/lib/db";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { 
  Save, ArrowLeft, Monitor, Edit3, Cpu, HardDrive, 
  User, Tag, Keyboard, MessageSquare, AlertCircle, 
  Activity, Shield, Plus, QrCode
} from "lucide-react";
import Link from "next/link";

export default async function PaginaEditMaestra({ 
  searchParams 
}: { 
  searchParams: Promise<{ id?: string, filtro?: string, nuevo?: string }> 
}) {
  const { id, filtro, nuevo } = await searchParams;

  // --- 1. ACCIÓN: CREAR EQUIPO CON TODOS LOS DATOS ---
  async function crearEquipo(formData: FormData) {
    "use server";
    await db.query(
      `INSERT INTO computadoras 
       (numero_inventario, responsable_inventario, responsable_area, marca_modelo, 
        almacenamiento, memoria_ram, procesador, monitor, mouse_teclado, observacion, requiere_mantenimiento) 
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)`,
      [
        formData.get("numero"), formData.get("responsable"), formData.get("jefe_area"),
        formData.get("marca"), formData.get("disco"), formData.get("ram"), 
        formData.get("procesador"), formData.get("monitor"), formData.get("mouse_teclado"), 
        formData.get("observacion"), formData.get("mantenimiento") === "on"
      ]
    );
    revalidatePath(`/edit`);
    redirect("/edit");
  }

  // --- 2. ACCIÓN: GUARDAR CAMBIOS (EDITAR) ---
  async function guardarCambios(formData: FormData) {
    "use server";
    const targetId = formData.get("id");
    
    await db.query(
      `UPDATE computadoras 
       SET numero_inventario = $1, responsable_inventario = $2, responsable_area = $3, 
           marca_modelo = $4, almacenamiento = $5, memoria_ram = $6, 
           procesador = $7, monitor = $8, mouse_teclado = $9, 
           observacion = $10, requiere_mantenimiento = $11, 
           ultima_revision = CURRENT_TIMESTAMP 
       WHERE id = $12`,
      [
        formData.get("numero"), formData.get("responsable"), formData.get("jefe_area"),
        formData.get("marca"), formData.get("disco"), formData.get("ram"), 
        formData.get("procesador"), formData.get("monitor"), formData.get("mouse_teclado"), 
        formData.get("observacion"), formData.get("mantenimiento") === "on", targetId
      ]
    );

    revalidatePath(`/edit`);
    redirect("/edit"); 
  }

  // --- VISTA DE FORMULARIO ---
  if (id || nuevo) {
    let data: any = {}; 
if (id) {
  const result = await db.query('SELECT * FROM computadoras WHERE id = $1', [id]);
  data = result.rows[0];
}
    
    if (id) {
      const result = await db.query('SELECT * FROM computadoras WHERE id = $1', [id]);
      data = result.rows[0];
    }

    // URL para el QR: Apunta a la vista de consulta
    const qrUrl = `https://tu-dominio.com/view?id=${data.id}`;

    return (
      <main className="min-h-screen bg-slate-50 p-4 flex flex-col items-center">
        <div className="w-full max-w-md">
          <Link href="/edit" className="flex items-center gap-2 text-slate-400 mb-6 font-bold text-xs uppercase tracking-widest hover:text-blue-600 transition-colors">
            <ArrowLeft size={14} /> Volver al Inventario
          </Link>

          <form action={id ? guardarCambios : crearEquipo} className="bg-white rounded-[2.5rem] shadow-2xl border border-slate-100 p-8 space-y-4">
            <input type="hidden" name="id" value={id} />
            
            <header className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-4">
                <div className="bg-blue-600 p-3 rounded-2xl text-white shadow-lg">
                  {nuevo ? <Plus size={24} /> : <Monitor size={24} />}
                </div>
                <h1 className="text-xl font-black text-slate-800 uppercase italic">
                  {nuevo ? "Nuevo Equipo" : "Editar Ficha"}
                </h1>
              </div>

              {id && (
                <div className="group relative">
                  <div className="bg-slate-100 p-2 rounded-xl text-slate-600 hover:bg-blue-600 hover:text-white transition-all cursor-help">
                    <QrCode size={20} />
                  </div>
                  <div className="absolute hidden group-hover:block right-0 mt-2 p-4 bg-white shadow-2xl rounded-2xl border z-50 w-48 text-center border-slate-100">
                    <p className="text-[8px] font-black uppercase mb-2 text-slate-400">QR Identificador</p>
                    <img src={`https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${qrUrl}`} alt="QR" className="mx-auto" />
                    <p className="text-[10px] mt-2 font-bold text-blue-600">ID: {data.numero_inventario}</p>
                  </div>
                </div>
              )}
            </header>

            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-[9px] font-black text-slate-400 uppercase ml-2 flex items-center gap-1"><Tag size={10}/> Inventario #</label>
                  <input required name="numero" defaultValue={data.numero_inventario} className="w-full p-3 bg-slate-50 rounded-xl border font-bold text-slate-700 outline-none focus:border-blue-500 transition-all" />
                </div>
                <div className="space-y-1">
                  <label className="text-[9px] font-black text-slate-400 uppercase ml-2 flex items-center gap-1"><Shield size={10}/> Resp. Área</label>
                  <input name="jefe_area" defaultValue={data.responsable_area} className="w-full p-3 bg-slate-50 rounded-xl border font-bold text-slate-700 outline-none focus:border-blue-500 transition-all" />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[9px] font-black text-slate-400 uppercase ml-2 flex items-center gap-1"><User size={10}/> Responsable Equipo</label>
                <input name="responsable" defaultValue={data.responsable_inventario} className="w-full p-3 bg-slate-50 rounded-xl border font-bold text-slate-700 outline-none focus:border-blue-500 transition-all" />
              </div>

              <div className="space-y-1">
                <label className="text-[9px] font-black text-slate-400 uppercase ml-2">Marca y Modelo</label>
                <input name="marca" defaultValue={data.marca_modelo} className="w-full p-3 bg-slate-50 rounded-xl border font-bold text-slate-700 outline-none focus:border-blue-500 transition-all" />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-[9px] font-black text-slate-400 uppercase ml-2 flex items-center gap-1"><Cpu size={10}/> Procesador</label>
                  <input name="procesador" defaultValue={data.procesador} className="w-full p-3 bg-slate-50 rounded-xl border font-bold text-slate-700 text-xs outline-none focus:border-blue-500" />
                </div>
                <div className="space-y-1">
                  <label className="text-[9px] font-black text-slate-400 uppercase ml-2 flex items-center gap-1"><Activity size={10}/> RAM</label>
                  <input name="ram" defaultValue={data.memoria_ram} className="w-full p-3 bg-slate-50 rounded-xl border font-bold text-slate-700 text-xs outline-none focus:border-blue-500" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-[9px] font-black text-slate-400 uppercase ml-2 flex items-center gap-1"><HardDrive size={10}/> Disco</label>
                  <input name="disco" defaultValue={data.almacenamiento} className="w-full p-3 bg-slate-50 rounded-xl border font-bold text-slate-700 text-xs outline-none focus:border-blue-500" />
                </div>
                <div className="space-y-1">
                  <label className="text-[9px] font-black text-slate-400 uppercase ml-2 flex items-center gap-1"><Monitor size={10}/> Monitor</label>
                  <input name="monitor" defaultValue={data.monitor} className="w-full p-3 bg-slate-50 rounded-xl border font-bold text-slate-700 text-xs outline-none focus:border-blue-500" />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[9px] font-black text-slate-400 uppercase ml-2 flex items-center gap-1"><Keyboard size={10}/> Periféricos</label>
                <input name="mouse_teclado" defaultValue={data.mouse_teclado} className="w-full p-3 bg-slate-50 rounded-xl border font-bold text-slate-700 outline-none focus:border-blue-500" />
              </div>

              <div className="space-y-1">
                <label className="text-[9px] font-black text-slate-400 uppercase ml-2 flex items-center gap-1"><MessageSquare size={10}/> Observaciones</label>
                <textarea name="observacion" defaultValue={data.observacion} rows={2} className="w-full p-3 bg-slate-50 rounded-xl border font-bold text-slate-700 text-xs outline-none focus:border-blue-500" />
              </div>

              <label className="flex items-center justify-between p-4 bg-red-50/50 rounded-2xl border border-red-100 cursor-pointer active:scale-95 transition-all">
                <div className="flex items-center gap-2 text-red-700">
                  <AlertCircle size={18} />
                  <span className="text-[10px] font-black uppercase tracking-widest">Requiere Mantenimiento</span>
                </div>
                <input type="checkbox" name="mantenimiento" defaultChecked={data.requiere_mantenimiento} className="w-5 h-5 accent-red-600 rounded-lg shadow-sm" />
              </label>
            </div>

            <button type="submit" className="w-full bg-slate-900 text-white py-4 rounded-2xl font-black flex items-center justify-center gap-3 shadow-xl hover:bg-black transition-all uppercase text-xs tracking-widest">
              <Save size={18} /> {id ? "Guardar Cambios" : "Crear Equipo"}
            </button>
          </form>
        </div>
      </main>
    );
  }

  // --- VISTA: LISTA PRINCIPAL ---
  let querySql = 'SELECT * FROM computadoras';
  if (filtro === 'mantenimiento') querySql += ' WHERE requiere_mantenimiento = true';
  querySql += ' ORDER BY numero_inventario ASC';

  const allResult = await db.query(querySql);
  const computadoras = allResult.rows;

  return (
    <main className="min-h-screen bg-slate-50 p-6 flex flex-col items-center">
      <div className="w-full max-w-xl">
        <header className="mb-10 text-center space-y-6">
          <h1 className="text-3xl font-black text-slate-800 uppercase italic tracking-tighter">Inventario Juzgado</h1>
          <div className="flex gap-2 justify-center items-center">
            <Link href="/edit" className={`px-5 py-2 rounded-full text-[9px] font-black uppercase border transition-all ${!filtro ? 'bg-slate-900 text-white shadow-lg' : 'bg-white text-slate-400'}`}>Todos</Link>
            <Link href="/edit?filtro=mantenimiento" className={`px-5 py-2 rounded-full text-[9px] font-black uppercase border transition-all ${filtro === 'mantenimiento' ? 'bg-red-600 text-white shadow-lg' : 'bg-white text-red-400'}`}>Urgente</Link>
            <Link href="/edit?nuevo=true" className="ml-4 bg-blue-600 text-white p-3 rounded-2xl shadow-lg hover:bg-blue-700 transition-all flex items-center gap-2 text-[9px] font-black uppercase">
                <Plus size={16} /> Nuevo
            </Link>
          </div>
        </header>

        <div className="space-y-3">
          {computadoras.map((pc) => (
            <div key={pc.id} className="bg-white p-5 rounded-[2.2rem] shadow-sm border border-slate-100 flex items-center justify-between group hover:border-blue-200 transition-all">
              <div className="flex items-center gap-4">
                <div className={`p-4 rounded-2xl ${pc.requiere_mantenimiento ? 'bg-red-50 text-red-500 animate-pulse' : 'bg-blue-50 text-blue-500'}`}>
                  <Monitor size={22} />
                </div>
                <div>
                  <h2 className="font-black text-slate-800 uppercase text-xs leading-none">#{pc.numero_inventario} - {pc.marca_modelo}</h2>
                  <p className="text-[10px] text-blue-600 font-bold uppercase mt-1 tracking-tighter">Resp: {pc.responsable_inventario}</p>
                </div>
              </div>
              <Link href={`/edit?id=${pc.id}`} className="bg-slate-900 text-white p-4 rounded-2xl hover:bg-blue-600 transition-colors shadow-md">
                <Edit3 size={18} />
              </Link>
            </div>
          ))}
        </div>
      </div>
    </main>
  );

}

