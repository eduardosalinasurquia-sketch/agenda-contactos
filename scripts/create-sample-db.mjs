import { writeFile } from 'node:fs/promises'
import initSqlJs from 'sql.js'
import { ESQUEMA } from '../src/db/esquema.js'

const SQL = await initSqlJs()
const db = new SQL.Database()

db.run(ESQUEMA)

const contactos = [
  ['Ana', 'Rios', '965123456', 'ana.rios@example.com', '2001-03-15', 1, 1, 'Contacto de prueba'],
  ['Luis', 'Paredes', '987654321', 'luis.paredes@example.com', '1999-08-21', 2, 0, 'Trabajo'],
  ['Maria', 'Quispe', '912345678', 'maria.quispe@example.com', '2000-01-11', 3, 1, 'SENATI'],
  ['Carlos', 'Torres', '923456789', 'carlos.torres@example.com', '1998-04-02', 4, 0, 'Familia'],
  ['Rosa', 'Mendoza', '934567890', 'rosa.mendoza@example.com', '2002-10-30', 1, 0, 'Personal'],
  ['Jorge', 'Salas', '945678901', 'jorge.salas@example.com', '1997-12-05', 2, 1, 'Proveedor'],
  ['Diana', 'Castro', '956789012', 'diana.castro@example.com', '2003-06-17', 3, 0, 'Companera'],
  ['Pedro', 'Flores', '967890123', 'pedro.flores@example.com', '1996-09-09', 4, 0, 'Primo'],
  ['Elena', 'Vega', '978901234', 'elena.vega@example.com', '2004-02-25', 1, 1, 'Vecina'],
  ['Miguel', 'Santos', '989012345', 'miguel.santos@example.com', '1995-11-14', 2, 0, 'Cliente'],
]

const stmt = db.prepare(`
  INSERT INTO contactos (nombre, apellido, telefono, email, cumple, grupo_id, favorito, notas)
  VALUES (?, ?, ?, ?, ?, ?, ?, ?)
`)

for (const contacto of contactos) {
  stmt.run(contacto)
}

stmt.free()

await writeFile('agenda.db', Buffer.from(db.export()))
console.log('agenda.db creado con 10 contactos')
