function normalizar(texto) {
  const limpio = String(texto)
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]/g, '')

  if (/^\d+$/.test(limpio) && limpio.startsWith('51') && limpio.length > 9) {
    return limpio.slice(2)
  }

  return limpio
}

export function distanciaLevenshtein(a, b) {
  const izquierda = normalizar(a)
  const derecha = normalizar(b)
  const matriz = Array.from({ length: izquierda.length + 1 }, (_, fila) => [fila])

  for (let columna = 1; columna <= derecha.length; columna += 1) matriz[0][columna] = columna

  for (let fila = 1; fila <= izquierda.length; fila += 1) {
    for (let columna = 1; columna <= derecha.length; columna += 1) {
      const costo = izquierda[fila - 1] === derecha[columna - 1] ? 0 : 1
      matriz[fila][columna] = Math.min(
        matriz[fila - 1][columna] + 1,
        matriz[fila][columna - 1] + 1,
        matriz[fila - 1][columna - 1] + costo,
      )
    }
  }

  return matriz[izquierda.length][derecha.length]
}

export function similitud(a, b) {
  const izquierda = normalizar(a)
  const derecha = normalizar(b)
  const mayor = Math.max(izquierda.length, derecha.length)

  if (mayor === 0) return 1
  return 1 - distanciaLevenshtein(izquierda, derecha) / mayor
}

export function buscarDuplicado(candidato, contactos, umbral = 0.85) {
  return contactos.find((contacto) => {
    const nombre = similitud(`${candidato.nombre} ${candidato.apellido}`, `${contacto.nombre} ${contacto.apellido}`)
    const telefono = similitud(candidato.telefono, contacto.telefono)
    return nombre >= umbral || telefono >= umbral
  })
}
