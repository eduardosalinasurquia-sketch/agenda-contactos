export default function DialogoConfirmar({ mensaje, onAceptar, onCancelar }) {
  if (!mensaje) return null

  return (
    <div className="fixed inset-0 z-20 grid place-items-center bg-slate-950/60 p-4">
      <section className="w-full max-w-sm rounded-lg bg-white p-5 shadow-xl" role="dialog" aria-modal="true">
        <h2 className="text-lg font-semibold">Confirmar accion</h2>
        <p className="mt-2 text-sm text-slate-600">{mensaje}</p>
        <div className="mt-5 flex justify-end gap-2">
          <button onClick={onCancelar} className="rounded-lg border px-4 py-2 text-sm">
            Cancelar
          </button>
          <button onClick={onAceptar} className="rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white">
            Eliminar
          </button>
        </div>
      </section>
    </div>
  )
}
