import { useState } from 'react'
import { aplicarPlantilla, compartirContacto, descargarVCard, enlaceWhatsApp, formatoFechaPeru } from '../utils/contacto.js'
import { sugerirMensajes } from '../utils/ia.js'

export default function ContactoCard({
  contacto,
  plantillas,
  onEditar,
  onEliminar,
  onFavorito,
  onRegistrarMensaje,
}) {
  const [plantillaId, setPlantillaId] = useState(plantillas[0]?.id ?? '')
  const [mensaje, setMensaje] = useState('')
  const [sugerencias, setSugerencias] = useState([])
  const [cargando, setCargando] = useState(false)

  const plantilla = plantillas.find((item) => item.id === Number(plantillaId))
  const textoWhatsApp = mensaje || aplicarPlantilla(plantilla?.texto ?? 'Hola {nombre}.', contacto)
  const iniciales = `${contacto.nombre[0] ?? ''}${contacto.apellido?.[0] ?? ''}`.toUpperCase()

  const abrirWhatsApp = () => {
    onRegistrarMensaje(contacto.id, textoWhatsApp)
    window.open(enlaceWhatsApp(contacto.telefono, textoWhatsApp), '_blank', 'noopener,noreferrer')
  }

  const pedirSugerencias = async () => {
    setCargando(true)
    try {
      setSugerencias(await sugerirMensajes(contacto))
    } catch {
      setSugerencias([{ tono: 'error', mensaje: 'No se pudo obtener sugerencias del modelo.' }])
    } finally {
      setCargando(false)
    }
  }

  return (
    <article className="rounded-lg bg-white p-4 shadow-sm hover:shadow-md">
      <div className="flex items-start gap-3">
        <div className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-blue-100 font-semibold text-blue-700">
          {iniciales}
        </div>

        <div className="min-w-0 flex-1">
          <h3 className="truncate font-semibold">
            {contacto.nombre} {contacto.apellido}
          </h3>
          <p className="text-sm text-slate-500">{contacto.telefono}</p>
          {contacto.email && <p className="truncate text-sm text-slate-500">{contacto.email}</p>}
          {contacto.cumple && <p className="text-sm text-slate-500">Cumple: {formatoFechaPeru(contacto.cumple)}</p>}
          {contacto.ultimo_mensaje && <p className="text-xs text-slate-400">Ultimo WhatsApp: {contacto.ultimo_mensaje}</p>}
          <span
            className="mt-1 inline-block rounded-full px-2 py-0.5 text-xs text-white"
            style={{ backgroundColor: contacto.grupo_color }}
          >
            {contacto.grupo}
          </span>
        </div>

        <button
          onClick={() => onFavorito(contacto.id)}
          aria-label="Marcar favorito"
          title="Favorito"
          className={contacto.favorito ? 'text-amber-500' : 'text-slate-300'}
        >
          ★
        </button>
      </div>

      <div className="mt-3 grid gap-2">
        <select
          value={plantillaId}
          onChange={(event) => setPlantillaId(event.target.value)}
          className="rounded-lg border border-slate-300 px-3 py-2 text-xs"
          aria-label="Plantilla de mensaje"
        >
          {plantillas.map((item) => (
            <option key={item.id} value={item.id}>
              {item.nombre}
            </option>
          ))}
        </select>

        <textarea
          value={textoWhatsApp}
          onChange={(event) => setMensaje(event.target.value)}
          rows="2"
          className="rounded-lg border border-slate-300 px-3 py-2 text-xs"
          aria-label="Mensaje para WhatsApp"
        />

        {sugerencias.length > 0 && (
          <div className="grid gap-1">
            {sugerencias.map((item) => (
              <button
                key={`${item.tono}-${item.mensaje}`}
                onClick={() => setMensaje(item.mensaje)}
                className="rounded-lg border px-3 py-1.5 text-left text-xs"
              >
                <strong>{item.tono}:</strong> {item.mensaje}
              </button>
            ))}
          </div>
        )}
      </div>

      <div className="mt-3 flex flex-wrap gap-2">
        <button onClick={abrirWhatsApp} className="rounded-lg bg-whatsapp px-3 py-1.5 text-xs font-medium text-white">
          Escribir por WhatsApp
        </button>
        <button onClick={pedirSugerencias} className="rounded-lg border px-3 py-1.5 text-xs">
          {cargando ? 'Sugiriendo...' : 'Sugerir mensaje'}
        </button>
        <button onClick={() => compartirContacto(contacto)} className="rounded-lg border px-3 py-1.5 text-xs">
          Compartir
        </button>
        <button onClick={() => descargarVCard(contacto)} className="rounded-lg border px-3 py-1.5 text-xs">
          Descargar .vcf
        </button>
        <button onClick={() => onEditar(contacto)} className="rounded-lg border px-3 py-1.5 text-xs">
          Editar
        </button>
        <button
          onClick={() => onEliminar(contacto)}
          className="rounded-lg border border-red-200 px-3 py-1.5 text-xs text-red-600"
        >
          Eliminar
        </button>
      </div>
    </article>
  )
}
