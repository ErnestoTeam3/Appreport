"use client";

import { useEffect, useState } from "react";
import { Html5QrcodeScanner } from "html5-qrcode";
import { useRouter } from "next/navigation";
import { Camera, ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function EscanearQR() {
  const router = useRouter();
  const [scanResult, setScanResult] = useState<string | null>(null);

  useEffect(() => {
    // Configuración del escáner
    const scanner = new Html5QrcodeScanner(
      "reader",
      {
        fps: 10,
        qrbox: { width: 250, height: 250 },
        rememberLastUsedCamera: true,
        supportedScanTypes: [0] // 0 es para cámara
      },
      /* verbose= */ false
    );

    function onScanSuccess(decodedText: string) {
      // Detenemos el escáner al encontrar un código
      scanner.clear();
      setScanResult(decodedText);
      
      // El decodedText debería ser la URL: http://localhost:3000/producto/1
      // O solo el ID. Aquí lo manejamos para redirigir:
      if (decodedText.includes("/producto/")) {
        router.push(decodedText.split("http://localhost:3000")[1] || decodedText);
      } else {
        // Si el QR solo tiene el número (ej: "1"), lo mandamos manualmente
        router.push(`/maquina/${decodedText}`);
      }
    }

    function onScanFailure(error: any) {
      // Ignoramos errores de lectura continua (cuando no hay QR en frente)
    }

    scanner.render(onScanSuccess, onScanFailure);

    // Limpieza al salir de la página
    return () => {
      scanner.clear();
    };
  }, [router]);

  return (
    <main className="min-h-screen bg-black flex flex-col items-center justify-between p-6">
      
      {/* Botón Volver */}
      <div className="w-full flex justify-start">
        <Link href="/" className="p-3 bg-white/10 rounded-full text-white hover:bg-white/20">
          <ArrowLeft size={24} />
        </Link>
      </div>

      <div className="flex flex-col items-center gap-6 w-full">
        <div className="bg-blue-600 p-4 rounded-3xl shadow-lg animate-pulse">
          <Camera size={32} className="text-white" />
        </div>
        
        <div className="text-center">
          <h1 className="text-2xl font-black text-white uppercase tracking-tighter">
            Escanear Equipo
          </h1>
          <p className="text-zinc-500 text-sm mt-2">
            Apunta la cámara al código QR pegado en la computadora
          </p>
        </div>

        {/* CONTENEDOR DEL ESCÁNER */}
        <div className="w-full max-w-sm overflow-hidden rounded-[2rem] border-4 border-blue-600 bg-zinc-900 shadow-2xl shadow-blue-500/20">
          <div id="reader" className="w-full"></div>
        </div>

        {scanResult && (
          <div className="bg-emerald-500 text-white px-6 py-3 rounded-full font-bold animate-bounce">
            ¡Código detectado! Redirigiendo...
          </div>
        )}
      </div>

      <footer className="w-full text-center">
        <p className="text-[10px] text-zinc-600 font-bold uppercase tracking-widest">
          Sistema de Inventario - Juzgado Ocozocoautla
        </p>
      </footer>

      {/* Estilos personalizados para la librería (para que se vea bonito) */}
      <style jsx global>{`
        #reader__scan_region {
          background: transparent !important;
        }
        #reader__dashboard_section_csr button {
          background-color: #2563eb !important;
          color: white !important;
          padding: 10px 20px !important;
          border-radius: 12px !important;
          font-weight: bold !important;
          border: none !important;
          margin-top: 10px !important;
          text-transform: uppercase !important;
          font-size: 12px !important;
        }
        #reader video {
          border-radius: 1.5rem !important;
        }
      `}</style>
    </main>
  );
}