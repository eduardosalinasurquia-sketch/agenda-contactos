export default function PanelEstadisticas({ estadisticas }) {
  const general = estadisticas.general ?? { total: 0, favoritos: 0, mas_antiguo: null }

  return (
    <section className="grid gap-3 rounded-lg bg-white p-4 shadow-sm sm:grid-cols-3">
      <div>
        <p className="text-xs uppercase text-slate-500">Total</p>
        <p className="text-2xl font-semibold">{general.total ?? 0}</p>
      </div>
      <div>
        <p className="text-xs uppercase text-slate-500">Favoritos</p>
        <p className="text-2xl font-semibold">{general.favoritos ?? 0}</p>
      </div>
      <div>
        <p className="text-xs uppercase text-slate-500">Mas antiguo</p>
        <p className="text-sm font-medium">{general.mas_antiguo ?? 'Sin contactos'}</p>
      </div>
      <div className="sm:col-span-3">
        <p className="mb-2 text-xs uppercase text-slate-500">Reparto por grupo</p>
        <div className="flex flex-wrap gap-2">
          {estadisticas.grupos.map((item) => (
            <span key={item.grupo} className="rounded-full bg-slate-100 px-3 py-1 text-xs">
              {item.grupo}: {item.total}
            </span>
          ))}
        </div>
      </div>
    </section>
  )
}
