export const ESQUEMA = `
PRAGMA foreign_keys = ON;

CREATE TABLE IF NOT EXISTS grupos (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  nombre TEXT NOT NULL UNIQUE,
  color TEXT NOT NULL DEFAULT '#2563eb'
);

INSERT OR IGNORE INTO grupos (id, nombre, color) VALUES
  (1, 'Personal', '#2563eb'),
  (2, 'Trabajo', '#0f766e'),
  (3, 'SENATI', '#7c3aed'),
  (4, 'Familia', '#db2777');

CREATE TABLE IF NOT EXISTS contactos (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  nombre TEXT NOT NULL,
  apellido TEXT NOT NULL DEFAULT '',
  telefono TEXT NOT NULL UNIQUE,
  email TEXT,
  cumple TEXT,
  grupo_id INTEGER NOT NULL DEFAULT 1,
  favorito INTEGER NOT NULL DEFAULT 0 CHECK (favorito IN (0,1)),
  notas TEXT,
  creado_en TEXT NOT NULL DEFAULT (datetime('now','localtime')),
  FOREIGN KEY (grupo_id) REFERENCES grupos(id)
);

CREATE INDEX IF NOT EXISTS idx_contactos_nombre ON contactos(nombre);
CREATE INDEX IF NOT EXISTS idx_contactos_grupo ON contactos(grupo_id);

CREATE TABLE IF NOT EXISTS mensajes (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  contacto_id INTEGER NOT NULL,
  texto TEXT NOT NULL,
  enviado_en TEXT NOT NULL DEFAULT (datetime('now','localtime')),
  FOREIGN KEY (contacto_id) REFERENCES contactos(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS plantillas (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  nombre TEXT NOT NULL UNIQUE,
  tono TEXT NOT NULL,
  texto TEXT NOT NULL
);

INSERT OR IGNORE INTO plantillas (id, nombre, tono, texto) VALUES
  (1, 'Saludo', 'cercano', 'Hola {nombre}, te escribo desde mi agenda de contactos.'),
  (2, 'Reunion', 'formal', 'Hola {nombre}, te escribo para coordinar nuestra reunion.'),
  (3, 'Cobranza', 'breve', 'Hola {nombre}, te escribo para recordarte el pago pendiente.');
`
