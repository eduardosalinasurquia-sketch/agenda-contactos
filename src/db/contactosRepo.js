import { obtenerDB, persistir } from './database.js'

const ORDENES = {
  nombre: 'c.nombre COLLATE NOCASE ASC',
  recientes: 'c.creado_en DESC',
  grupo: 'g.nombre COLLATE NOCASE ASC, c.nombre COLLATE NOCASE ASC',
}

function filas(sql, params = {}) {
  const stmt = obtenerDB().prepare(sql)
  stmt.bind(params)

  const resultado = []
  while (stmt.step()) resultado.push(stmt.getAsObject())
  stmt.free()

  return resultado
}

export function listarContactos({ texto = '', grupoId = 'Todos', orden = 'nombre' } = {}) {
  const orderBy = ORDENES[orden] ?? ORDENES.nombre
  const sql = `
    SELECT c.*, g.nombre AS grupo, g.color AS grupo_color, MAX(m.enviado_en) AS ultimo_mensaje
    FROM contactos c
    JOIN grupos g ON g.id = c.grupo_id
    LEFT JOIN mensajes m ON m.contacto_id = c.id
    WHERE (c.nombre LIKE $t OR c.apellido LIKE $t OR c.telefono LIKE $t OR c.email LIKE $t)
      AND ($g = 'Todos' OR c.grupo_id = $g)
    GROUP BY c.id
    ORDER BY c.favorito DESC, ${orderBy}
  `

  return filas(sql, { $t: `%${texto}%`, $g: grupoId })
}

export function crearContacto(c) {
  obtenerDB().run(
    `INSERT INTO contactos (nombre, apellido, telefono, email, cumple, grupo_id, favorito, notas)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      c.nombre.trim(),
      c.apellido.trim(),
      c.telefono.trim(),
      c.email.trim(),
      c.cumple || null,
      Number(c.grupo_id),
      c.favorito ? 1 : 0,
      c.notas.trim(),
    ],
  )
  persistir()
}

export function actualizarContacto(id, c) {
  obtenerDB().run(
    `UPDATE contactos
     SET nombre = ?, apellido = ?, telefono = ?, email = ?, cumple = ?, grupo_id = ?, favorito = ?, notas = ?
     WHERE id = ?`,
    [
      c.nombre.trim(),
      c.apellido.trim(),
      c.telefono.trim(),
      c.email.trim(),
      c.cumple || null,
      Number(c.grupo_id),
      c.favorito ? 1 : 0,
      c.notas.trim(),
      id,
    ],
  )
  persistir()
}

export function eliminarContacto(id) {
  obtenerDB().run('DELETE FROM contactos WHERE id = ?', [id])
  persistir()
}

export function alternarFavorito(id) {
  obtenerDB().run('UPDATE contactos SET favorito = CASE favorito WHEN 1 THEN 0 ELSE 1 END WHERE id = ?', [id])
  persistir()
}

export function listarGrupos() {
  return filas('SELECT * FROM grupos ORDER BY nombre COLLATE NOCASE')
}

export function crearGrupo(g) {
  obtenerDB().run('INSERT INTO grupos (nombre, color) VALUES (?, ?)', [g.nombre.trim(), g.color])
  persistir()
}

export function listarPlantillas() {
  return filas('SELECT * FROM plantillas ORDER BY id')
}

export function guardarPlantilla(p) {
  obtenerDB().run('UPDATE plantillas SET nombre = ?, tono = ?, texto = ? WHERE id = ?', [
    p.nombre.trim(),
    p.tono.trim(),
    p.texto.trim(),
    p.id,
  ])
  persistir()
}

export function registrarMensaje(contactoId, texto) {
  obtenerDB().run('INSERT INTO mensajes (contacto_id, texto) VALUES (?, ?)', [contactoId, texto])
  persistir()
}
