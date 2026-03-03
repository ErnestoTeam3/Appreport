"use client";

import { useEffect, useState } from "react";
import { Html5QrcodeScanner } from "html5-qrcode";
import { useRouter } from "next/navigation";
import { Camera, ArrowLeft, CheckCircle2 } from "lucide-react";
import Link from "next/link";

export default function EscanearQR() {
  const router = useRouter();
  const [scanResult, setScanResult] = useState<string | null>(null);

  useEffect(() => {
    // Configuración del escáner optimizada para móviles
    const scanner = new Html5QrcodeScanner(
      "reader",
      {
        fps: 15, // Un poco más rápido para mayor fluidez
        qrbox: { width: 250, height: 250 },
        rememberLastUsedCamera: true,
        supportedScanTypes: [0] // Prioriza la cámara trasera
      },
      /* verbose= */ false
    );

    function onScanSuccess(decodedText: string) {
      // 1. Detener el escáner inmediatamente para evitar lecturas dobles
      scanner.clear();
      setScanResult(decodedText);
      
      // 2. Lógica de Redirección Inteligente
      // Si el QR es una URL completa (ej: http://.../view?id=5)
      if (decodedText.includes("/view") || decodedText.includes("/edit")) {
        try {
          const urlObj = new URL(decodedText);
          router.push(urlObj.pathname + urlObj.search);
        } catch (e) {
          // Si falla el parseo de URL, intentamos extraer la ruta relativa manualmente
          const rutaRelativa = decodedText.split(window.location.origin)[1] || decodedText;
          router.push(rutaRelativa);
        }
      } 
      // Si el QR es solo el ID numérico (ej: "5")
      else {
        // Redirigir siempre a la página de CONSULTA (view) por seguridad
        router.push(`/view?id=${decodedText}`);
      }
    }

    function onScanFailure(error: any) {
      // Se ignora para evitar saturar la consola durante la búsqueda del QR
    }

    scanner.render(onScanSuccess, onScanFailure);

    // Limpieza al desmontar el componente
    return () => {
      scanner.clear();
    };
  }, [router]);

  return (
    <main className="min-h-screen bg-zinc-950 flex flex-col items-center justify-between p-6 select-none">
      
      {/* Cabecera / Botón Volver */}
      <div className="w-full flex justify-start">
        <Link href="/" className="p-3 bg-white/5 rounded-2xl text-white hover:bg-white/20 transition-all border border-white/10">
          <ArrowLeft size={24} />
        </Link>
      </div>

      <div className="flex flex-col items-center gap-8 w-full max-w-sm">
        {/* Indicador Visual */}
        <div className={`p-5 rounded-[2rem] transition-all duration-500 ${scanResult ? 'bg-emerald-500 shadow-[0_0_30px_rgba(16,185,129,0.4)]' : 'bg-blue-600 shadow-[0_0_30px_rgba(37,99,235,0.3)] animate-pulse'}`}>
          {scanResult ? <CheckCircle2 size={32} className="text-white" /> : <Camera size={32} className="text-white" />}
        </div>
        
        <div className="text-center space-y-2">
          <h1 className="text-2xl font-black text-white uppercase italic tracking-tighter">
            {scanResult ? "Lectura Exitosa" : "Escanear Equipo"}
          </h1>
          <p className="text-zinc-500 text-xs font-bold uppercase tracking-widest">
            {scanResult ? "Redirigiendo a la ficha..." : "Enfoque el código QR del equipo"}
          </p>
        </div>

        {/* Visor de la Cámara */}
        <div className="relative w-full aspect-square overflow-hidden rounded-[3rem] border-[6px] border-zinc-800 bg-zinc-900 shadow-2xl">
          <div id="reader" className="w-full h-full"></div>
          
          {/* Guía visual sobre la cámara */}
          {!scanResult && (
            <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
              <div className="w-64 h-64 border-2 border-blue-500/50 rounded-3xl border-dashed"></div>
            </div>
          )}
        </div>
      </div>

      {/* Footer Informativo */}
      <footer className="w-full text-center pb-4">
        <p className="text-[10px] text-zinc-600 font-black uppercase tracking-[0.3em]">
          QREPORT • Juzgado Ocozocoautla • 2026
        </p>
      </footer>

      {/* Inyección de estilos para limpiar la interfaz de la librería */}
      <style jsx global>{`
        #reader {
          border: none !important;
        }
        #reader__scan_region {
          background: #18181b !important;
        }
        #reader__dashboard_section_csr button {
          background-color: #2563eb !important;
          color: white !important;
          padding: 12px 24px !important;
          border-radius: 16px !important;
          font-weight: 900 !important;
          border: none !important;
          text-transform: uppercase !important;
          font-size: 11px !important;
          letter-spacing: 0.1em !important;
          box-shadow: 0 10px 15px -3px rgba(37, 99, 235, 0.4) !important;
        }
        #reader video {
          object-fit: cover !important;
          width: 100% !important;
          height: 100% !important;
        }
        #reader img {
            display: none !important; /* Oculta iconos innecesarios de la lib */
        }
      `}</style>
    </main>
  );
}