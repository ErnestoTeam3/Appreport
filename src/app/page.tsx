import Image from "next/image";
import Link from "next/link";
import { QrCode, ShieldCheck, Settings2 } from "lucide-react";

export default function Home() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 font-sans dark:bg-black">
      <main className="flex min-h-screen w-full max-w-xl flex-col items-center justify-center py-12 px-8 bg-white dark:bg-zinc-950 shadow-2xl sm:rounded-[3rem]">
        
        {/* Logo y Encabezado */}
        <div className="flex flex-col items-center mb-12">
          <div className="bg-blue-600 p-4 rounded-3xl mb-6 shadow-lg shadow-blue-200">
            <ShieldCheck size={48} className="text-white" />
          </div>
          <h1 className="text-3xl font-black tracking-tight text-zinc-900 dark:text-white text-center">
            SISTEMA QREPORT
          </h1>
          <p className="text-zinc-500 text-[10px] font-bold uppercase tracking-[0.3em] mt-2">
            Juzgado Municipal
          </p>
        </div>

        {/* CONTENEDOR DE ACCIONES */}
        <div className="w-full space-y-6">
          
          {/* BOTÓN 1: ESCANEAR QR */}
          <Link 
            href="/escanear" 
            className="group flex flex-col items-center justify-center w-full aspect-video bg-blue-600 rounded-[2.5rem] shadow-2xl shadow-blue-200 transition-all hover:bg-blue-700 active:scale-95 overflow-hidden relative"
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-10 -mt-10 blur-2xl"></div>
            <QrCode size={48} className="text-white mb-3 group-hover:scale-110 transition-transform" strokeWidth={1.5} />
            <span className="text-white text-lg font-black uppercase tracking-widest">
              Escanear QR
            </span>
            <p className="text-blue-100 text-[10px] mt-1 font-medium uppercase tracking-tighter">
              Identificar equipo de cómputo
            </p>
          </Link>

          {/* BOTÓN 2: GESTIÓN / EDITAR (NUEVO) */}
          <Link 
            href="/edit" 
            className="group flex items-center justify-between w-full p-8 bg-zinc-900 rounded-[2rem] shadow-xl transition-all hover:bg-black active:scale-[0.98] border border-zinc-800"
          >
            <div className="flex items-center gap-5">
              <div className="p-4 bg-zinc-800 rounded-2xl text-blue-500 group-hover:text-blue-400 transition-colors">
                <Settings2 size={28} />
              </div>
              <div className="text-left">
                <span className="text-white text-lg font-black uppercase tracking-tight block">
                  Gestión Total
                </span>
                <span className="text-zinc-500 text-[10px] font-bold uppercase tracking-widest">
                  Ver y Editar Inventario
                </span>
              </div>
            </div>
            <div className="h-10 w-10 rounded-full border border-zinc-700 flex items-center justify-center text-zinc-500 group-hover:translate-x-1 transition-transform">
              →
            </div>
          </Link>
          

        </div>

        {/* Footer Informativo */}
        <footer className="mt-16 text-center">
          <p className="text-[9px] text-zinc-400 font-bold uppercase tracking-[0.4em] leading-relaxed">
            Ocozocoautla de Espinosa <br /> 
            Chiapas, México 2026
          </p>
        </footer>
      </main>
    </div>
  );
}
