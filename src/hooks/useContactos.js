import { useCallback, useEffect, useState } from 'react'
import { descargarDB, importarDB, iniciarDB } from '../db/database.js'
import * as repo from '../db/contactosRepo.js'
import { resumenGeneral, resumenPorGrupo } from '../db/estadisticas.js'

export function useContactos() {
  const [listos, setListos] = useState(false)
  const [contactos, setContactos] = useState([])
  const [grupos, setGrupos] = useState([])
  const [plantillas, setPlantillas] = useState([])
  const [estadisticas, setEstadisticas] = useState({ general: null, grupos: [] })
  const [texto, setTexto] = useState('')
  const [grupoId, setGrupoId] = useState('Todos')
  const [orden, setOrden] = useState('nombre')
  const [error, setError] = useState('')

  const refrescar = useCallback(() => {
    setContactos(repo.listarContactos({ texto, grupoId, orden }))
    setGrupos(repo.listarGrupos())
    setPlantillas(repo.listarPlantillas())
    setEstadisticas({ general: resumenGeneral(), grupos: resumenPorGrupo() })
  }, [texto, grupoId, orden])

  useEffect(() => {
    iniciarDB().then(() => setListos(true))
  }, [])

  useEffect(() => {
    if (listos) refrescar()
  }, [listos, refrescar])

  const ejecutar = (accion) => {
    try {
      accion()
      setError('')
      refrescar()
      return true
    } catch (e) {
      setError(String(e.message).includes('UNIQUE') ? 'Ese numero ya esta registrado.' : 'No se pudo guardar.')
      return false
    }
  }

  const importar = async (archivo) => {
    await importarDB(archivo)
    refrescar()
  }

  return {
    listos,
    contactos,
    grupos,
    plantillas,
    estadisticas,
    texto,
    grupoId,
    orden,
    error,
    setTexto,
    setGrupoId,
    setOrden,
    crear: (c) => ejecutar(() => repo.crearContacto(c)),
    actualizar: (id, c) => ejecutar(() => repo.actualizarContacto(id, c)),
    eliminar: (id) => ejecutar(() => repo.eliminarContacto(id)),
    favorito: (id) => ejecutar(() => repo.alternarFavorito(id)),
    crearGrupo: (g) => ejecutar(() => repo.crearGrupo(g)),
    guardarPlantilla: (p) => ejecutar(() => repo.guardarPlantilla(p)),
    registrarMensaje: (id, mensaje) => ejecutar(() => repo.registrarMensaje(id, mensaje)),
    exportar: descargarDB,
    importar,
  }
}
