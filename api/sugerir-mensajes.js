const MODELO_GEMINI = process.env.GEMINI_MODEL || 'gemini-3.5-flash-lite'

const promptSistema = `
Responde unicamente con JSON valido.
Devuelve un arreglo de exactamente tres objetos con esta forma:
[
  { "tono": "formal", "mensaje": "..." },
  { "tono": "cercano", "mensaje": "..." },
  { "tono": "breve", "mensaje": "..." }
]
No incluyas markdown, explicaciones ni texto adicional.
`

function limpiarTexto(texto) {
  return String(texto ?? '').trim().slice(0, 500)
}

function extraerJson(texto) {
  const limpio = texto.trim().replace(/^```json\s*/i, '').replace(/```$/i, '')
  const inicio = limpio.indexOf('[')
  const fin = limpio.lastIndexOf(']')

  if (inicio === -1 || fin === -1) {
    throw new Error('Gemini no devolvio un arreglo JSON.')
  }

  return JSON.parse(limpio.slice(inicio, fin + 1))
}

function validarMensajes(data) {
  if (!Array.isArray(data)) throw new Error('La respuesta no es un arreglo.')

  return data.slice(0, 3).map((item) => ({
    tono: limpiarTexto(item.tono),
    mensaje: limpiarTexto(item.mensaje),
  }))
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Metodo no permitido.' })
  }

  const apiKey = process.env.GEMINI_API_KEY

  if (!apiKey) {
    return res.status(500).json({ error: 'Falta configurar GEMINI_API_KEY en Vercel.' })
  }

  try {
    const contacto = req.body?.contacto ?? {}
    const nombre = limpiarTexto(contacto.nombre)
    const grupo = limpiarTexto(contacto.grupo)
    const notas = limpiarTexto(contacto.notas)

    const respuesta = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/${MODELO_GEMINI}:generateContent`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-goog-api-key': apiKey,
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                {
                  text:
                    `${promptSistema}\n\n` +
                    `Contacto:\n` +
                    `Nombre: ${nombre}\n` +
                    `Grupo: ${grupo}\n` +
                    `Notas: ${notas || 'Sin notas'}\n`,
                },
              ],
            },
          ],
          generationConfig: {
            responseMimeType: 'application/json',
            maxOutputTokens: 512,
          },
        }),
      },
    )

    const data = await respuesta.json()

    if (!respuesta.ok) {
      return res.status(respuesta.status).json({
        error: data.error?.message || 'Gemini no pudo generar mensajes.',
      })
    }

    const texto = data.candidates?.[0]?.content?.parts?.[0]?.text
    const mensajes = validarMensajes(extraerJson(texto || '[]'))

    return res.status(200).json({ mensajes })
  } catch (error) {
    return res.status(500).json({ error: error.message || 'Error generando mensajes.' })
  }
}
