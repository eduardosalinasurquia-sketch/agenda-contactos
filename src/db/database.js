import initSqlJs from 'sql.js'
import wasmUrl from 'sql.js/dist/sql-wasm.wasm?url'
import { ESQUEMA } from './esquema.js'

const CLAVE = 'agenda_contactos_v1'

let SQL = null
let db = null

const aBase64 = (bytes) => btoa(String.fromCharCode(...bytes))
const aBytes = (b64) => Uint8Array.from(atob(b64), (c) => c.charCodeAt(0))

export async function iniciarDB() {
  SQL = await initSqlJs({ locateFile: () => wasmUrl })

  let guardada = null
  try {
    guardada = localStorage.getItem(CLAVE)
  } catch (error) {
    console.warn('Sin acceso a localStorage', error)
  }

  db = guardada ? new SQL.Database(aBytes(guardada)) : new SQL.Database()
  db.run(ESQUEMA)
  persistir()

  return db
}

export function obtenerDB() {
  if (!db) throw new Error('Llama a iniciarDB() antes de consultar.')
  return db
}

export function persistir() {
  try {
    localStorage.setItem(CLAVE, aBase64(db.export()))
  } catch (error) {
    console.warn('No se pudo guardar la base', error)
  }
}

export function exportarBytes() {
  return obtenerDB().export()
}

export function descargarDB() {
  const url = URL.createObjectURL(new Blob([exportarBytes()], { type: 'application/octet-stream' }))
  const link = document.createElement('a')
  link.href = url
  link.download = 'agenda.db'
  link.click()
  URL.revokeObjectURL(url)
}

export async function importarDB(archivo) {
  if (!SQL) {
    SQL = await initSqlJs({ locateFile: () => wasmUrl })
  }

  const buffer = await archivo.arrayBuffer()
  const importada = new SQL.Database(new Uint8Array(buffer))
  importada.run(ESQUEMA)
  db = importada
  persistir()
}
