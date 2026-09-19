export const PROMPT_SUGERIR_MENSAJES = `
Responde unicamente con un arreglo JSON de tres objetos { "tono": string, "mensaje": string }.
Propón mensajes de WhatsApp para este contacto usando tres tonos: formal, cercano y breve.
No incluyas texto adicional fuera del JSON.
`

export async function sugerirMensajes(contacto) {
  const endpoint = import.meta.env.VITE_AI_ENDPOINT

  if (!endpoint) {
    return [
      { tono: 'formal', mensaje: `Hola ${contacto.nombre}, le escribo para coordinar un tema pendiente.` },
      { tono: 'cercano', mensaje: `Hola ${contacto.nombre}, como estas? Te escribo para saludarte.` },
      { tono: 'breve', mensaje: `Hola ${contacto.nombre}, podemos conversar un momento?` },
    ]
  }

  const respuesta = await fetch(endpoint, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      prompt: PROMPT_SUGERIR_MENSAJES,
      contacto: {
        nombre: contacto.nombre,
        grupo: contacto.grupo,
        notas: contacto.notas,
      },
    }),
  })

  if (!respuesta.ok) throw new Error('El modelo no respondio correctamente.')

  const texto = await respuesta.text()
  const data = JSON.parse(texto)

  if (!Array.isArray(data)) throw new Error('El modelo no devolvio un arreglo JSON.')
  return data
}
