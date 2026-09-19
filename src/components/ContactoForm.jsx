import { useEffect, useState } from 'react'

const VACIO = {
  nombre: '',
  apellido: '',
  telefono: '',
  email: '',
  cumple: '',
  grupo_id: 1,
  favorito: false,
  notas: '',
}

export default function ContactoForm({ editando, grupos, duplicado, onRevisar, onGuardar, onCancelar }) {
  const [form, setForm] = useState(VACIO)
  const [fallos, setFallos] = useState({})

  useEffect(() => {
    setForm(editando ? { ...editando, favorito: !!editando.favorito, grupo_id: editando.grupo_id } : VACIO)
    setFallos({})
  }, [editando])

  const cambiar = (campo) => (event) => {
    const valor = event.target.type === 'checkbox' ? event.target.checked : event.target.value
    const siguiente = { ...form, [campo]: valor }
    setForm(siguiente)
    onRevisar(siguiente)
  }

  const validar = () => {
    const errores = {}
    if (!form.nombre.trim()) errores.nombre = 'Escribe el nombre'
    if (!/^[0-9+\s]{6,15}$/.test(form.telefono)) errores.telefono = 'Telefono no valido'
    if (form.email && !/^\S+@\S+\.\S+$/.test(form.email)) errores.email = 'Correo no valido'
    setFallos(errores)
    return Object.keys(errores).length === 0
  }

  const enviar = () => {
    if (!validar()) return
    if (onGuardar(form)) setForm(VACIO)
  }

  const input =
    'w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500'

  return (
    <section className="space-y-3 rounded-lg bg-white p-4 shadow-sm">
      <h2 className="text-base font-semibold">{editando ? 'Editar contacto' : 'Nuevo contacto'}</h2>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <div>
          <input className={input} placeholder="Nombre" value={form.nombre} onChange={cambiar('nombre')} />
          {fallos.nombre && <p className="mt-1 text-xs text-red-600">{fallos.nombre}</p>}
        </div>

        <input className={input} placeholder="Apellido" value={form.apellido} onChange={cambiar('apellido')} />

        <div>
          <input
            className={input}
            placeholder="Telefono: 965123456"
            value={form.telefono}
            onChange={cambiar('telefono')}
          />
          {fallos.telefono && <p className="mt-1 text-xs text-red-600">{fallos.telefono}</p>}
        </div>

        <div>
          <input className={input} placeholder="Correo" value={form.email} onChange={cambiar('email')} />
          {fallos.email && <p className="mt-1 text-xs text-red-600">{fallos.email}</p>}
        </div>

        <input className={input} type="date" value={form.cumple ?? ''} onChange={cambiar('cumple')} />

        <select className={input} value={form.grupo_id} onChange={cambiar('grupo_id')}>
          {grupos.map((grupo) => (
            <option key={grupo.id} value={grupo.id}>
              {grupo.nombre}
            </option>
          ))}
        </select>

        <label className="flex items-center gap-2 text-sm">
          <input type="checkbox" checked={!!form.favorito} onChange={cambiar('favorito')} />
          Marcar como favorito
        </label>
      </div>

      <textarea
        className={input}
        rows="3"
        placeholder="Notas"
        value={form.notas ?? ''}
        onChange={cambiar('notas')}
      />

      {duplicado && !editando && (
        <p className="rounded-lg bg-amber-50 px-3 py-2 text-sm text-amber-800">
          Posible duplicado: {duplicado.nombre} {duplicado.apellido}
        </p>
      )}

      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          onClick={enviar}
          className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
        >
          {editando ? 'Guardar cambios' : 'Agregar contacto'}
        </button>
        {editando && (
          <button type="button" onClick={onCancelar} className="rounded-lg border px-4 py-2 text-sm">
            Cancelar
          </button>
        )}
      </div>
    </section>
  )
}
