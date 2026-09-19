import { obtenerDB } from './database.js'

function primeraFila(sql) {
  const res = obtenerDB().exec(sql)
  if (res.length === 0 || res[0].values.length === 0) return null
  return Object.fromEntries(res[0].columns.map((columna, index) => [columna, res[0].values[0][index]]))
}

export function resumenGeneral() {
  return primeraFila(`
    SELECT
      COUNT(*) AS total,
      SUM(CASE favorito WHEN 1 THEN 1 ELSE 0 END) AS favoritos,
      MIN(creado_en) AS mas_antiguo
    FROM contactos
  `)
}

export function resumenPorGrupo() {
  const res = obtenerDB().exec(`
    SELECT g.nombre AS grupo, COUNT(c.id) AS total
    FROM grupos g
    LEFT JOIN contactos c ON c.grupo_id = g.id
    GROUP BY g.id
    ORDER BY g.nombre COLLATE NOCASE
  `)

  if (res.length === 0) return []
  return res[0].values.map(([grupo, total]) => ({ grupo, total }))
}
