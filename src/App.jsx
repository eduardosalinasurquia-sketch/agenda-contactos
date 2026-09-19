import { useState } from 'react'
import ContactoCard from './components/ContactoCard.jsx'
import ContactoForm from './components/ContactoForm.jsx'
import DialogoConfirmar from './components/DialogoConfirmar.jsx'
import PanelEstadisticas from './components/PanelEstadisticas.jsx'
import PanelHerramientas from './components/PanelHerramientas.jsx'
import { useContactos } from './hooks/useContactos.js'
import { buscarDuplicado } from './utils/similitud.js'

function App() {
  const agenda = useContactos()
  const [editando, setEditando] = useState(null)
  const [pendienteEliminar, setPendienteEliminar] = useState(null)
  const [duplicado, setDuplicado] = useState(null)

  const guardar = (contacto) => {
    const ok = editando ? agenda.actualizar(editando.id, contacto) : agenda.crear(contacto)
    if (ok) {
      setEditando(null)
      setDuplicado(null)
    }
    return ok
  }

  const revisarDuplicado = (contacto) => {
    if (editando || !contacto.nombre || !contacto.telefono) {
      setDuplicado(null)
      return
    }

    setDuplicado(buscarDuplicado(contacto, agenda.contactos))
  }

  const confirmarImportacion = async (archivo) => {
    setPendienteEliminar({
      nombre: 'base actual',
      importar: archivo,
    })
  }

  const aceptarDialogo = async () => {
    if (pendienteEliminar?.importar) {
      await agenda.importar(pendienteEliminar.importar)
    } else if (pendienteEliminar) {
      agenda.eliminar(pendienteEliminar.id)
    }

    setPendienteEliminar(null)
  }

  if (!agenda.listos) {
    return <main className="grid min-h-screen place-items-center bg-slate-100 text-slate-700">Cargando SQLite...</main>
  }

  const sinContactos = agenda.contactos.length === 0 && !agenda.texto
  const sinResultados = agenda.contactos.length === 0 && agenda.texto

  return (
    <main className="min-h-screen bg-slate-100 p-4 text-slate-900 sm:p-6">
      <div className="mx-auto grid max-w-6xl gap-5">
        <header className="rounded-lg bg-slate-900 p-5 text-white shadow-lg">
          <p className="text-sm font-semibold uppercase text-emerald-300">SENATI - React + Tailwind CSS + SQLite</p>
          <h1 className="mt-1 text-3xl font-bold">Agenda de contactos</h1>
          <p className="mt-2 text-slate-300">
            CRUD offline-first con SQLite, WhatsApp, vCard, grupos, estadisticas y plantillas.
          </p>
        </header>

        <PanelHerramientas
          texto={agenda.texto}
          grupoId={agenda.grupoId}
          orden={agenda.orden}
          grupos={agenda.grupos}
          onTexto={agenda.setTexto}
          onGrupo={agenda.setGrupoId}
          onOrden={agenda.setOrden}
          onCrearGrupo={agenda.crearGrupo}
          onExportar={agenda.exportar}
          onImportar={confirmarImportacion}
        />

        <PanelEstadisticas estadisticas={agenda.estadisticas} />

        <section className="grid gap-5 lg:grid-cols-[420px_1fr]">
          <ContactoForm
            editando={editando}
            grupos={agenda.grupos}
            duplicado={duplicado}
            onRevisar={revisarDuplicado}
            onGuardar={guardar}
            onCancelar={() => setEditando(null)}
          />

          <section className="grid content-start gap-3">
            {agenda.error && <p className="rounded-lg bg-red-50 p-3 text-sm text-red-700">{agenda.error}</p>}

            {sinContactos && (
              <div className="rounded-lg border border-dashed border-slate-300 bg-white p-8 text-center text-slate-500">
                La agenda esta vacia. Completa el formulario para registrar el primer contacto.
              </div>
            )}

            {sinResultados && (
              <div className="rounded-lg border border-dashed border-slate-300 bg-white p-8 text-center text-slate-500">
                No hay resultados para esa busqueda. Limpia el filtro o registra un contacto nuevo.
              </div>
            )}

            {agenda.contactos.map((contacto) => (
              <ContactoCard
                key={contacto.id}
                contacto={contacto}
                plantillas={agenda.plantillas}
                onEditar={setEditando}
                onEliminar={setPendienteEliminar}
                onFavorito={agenda.favorito}
                onRegistrarMensaje={agenda.registrarMensaje}
              />
            ))}
          </section>
        </section>
      </div>

      <DialogoConfirmar
        mensaje={
          pendienteEliminar?.importar
            ? 'Importar reemplazara la base actual. Confirma para continuar.'
            : pendienteEliminar
              ? `Eliminar a ${pendienteEliminar.nombre} ${pendienteEliminar.apellido}?`
              : ''
        }
        onAceptar={aceptarDialogo}
        onCancelar={() => setPendienteEliminar(null)}
      />
    </main>
  )
}

export default App
