import { useRef, useState } from 'react'

export default function PanelHerramientas({
  texto,
  grupoId,
  orden,
  grupos,
  onTexto,
  onGrupo,
  onOrden,
  onCrearGrupo,
  onExportar,
  onImportar,
}) {
  const [nombre, setNombre] = useState('')
  const [color, setColor] = useState('#2563eb')
  const archivoRef = useRef(null)

  const crearGrupo = () => {
    if (!nombre.trim()) return
    if (onCrearGrupo({ nombre, color })) setNombre('')
  }

  return (
    <section className="grid gap-3 rounded-lg bg-white p-4 shadow-sm lg:grid-cols-[1fr_170px_170px_auto]">
      <input
        value={texto}
        onChange={(event) => onTexto(event.target.value)}
        placeholder="Buscar por nombre, telefono o correo"
        className="rounded-lg border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
      />

      <select
        value={grupoId}
        onChange={(event) => onGrupo(event.target.value)}
        className="rounded-lg border border-slate-300 px-3 py-2 text-sm"
      >
        <option value="Todos">Todos</option>
        {grupos.map((grupo) => (
          <option key={grupo.id} value={grupo.id}>
            {grupo.nombre}
          </option>
        ))}
      </select>

      <select
        value={orden}
        onChange={(event) => onOrden(event.target.value)}
        className="rounded-lg border border-slate-300 px-3 py-2 text-sm"
      >
        <option value="nombre">Nombre A-Z</option>
        <option value="recientes">Mas recientes</option>
        <option value="grupo">Grupo</option>
      </select>

      <div className="flex flex-wrap gap-2">
        <button onClick={onExportar} className="rounded-lg border px-3 py-2 text-sm">
          Exportar
        </button>
        <button onClick={() => archivoRef.current.click()} className="rounded-lg border px-3 py-2 text-sm">
          Importar
        </button>
        <input
          ref={archivoRef}
          type="file"
          accept=".db,application/octet-stream"
          className="hidden"
          onChange={(event) => event.target.files[0] && onImportar(event.target.files[0])}
        />
      </div>

      <div className="flex gap-2 lg:col-span-4">
        <input
          value={nombre}
          onChange={(event) => setNombre(event.target.value)}
          placeholder="Nuevo grupo"
          className="min-w-0 flex-1 rounded-lg border border-slate-300 px-3 py-2 text-sm"
        />
        <input
          value={color}
          onChange={(event) => setColor(event.target.value)}
          type="color"
          aria-label="Color de grupo"
          className="h-10 w-12 rounded-lg border border-slate-300"
        />
        <button onClick={crearGrupo} className="rounded-lg bg-slate-900 px-3 py-2 text-sm font-medium text-white">
          Crear grupo
        </button>
      </div>
    </section>
  )
}
