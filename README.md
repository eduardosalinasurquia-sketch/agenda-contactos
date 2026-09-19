# Agenda de Contactos - React + Tailwind CSS + SQLite

Aplicacion web offline-first desarrollada para el laboratorio SENATI. Usa React con Vite, Tailwind CSS y SQLite en el navegador mediante `sql.js`.

## Instalacion

```bash
npm install
npm run dev
```

## Verificacion

```bash
npm run lint
npm run test
npm run build
```

## Despliegue en Vercel con Gemini

1. Importa este repositorio desde Vercel.
2. Usa la configuracion por defecto de Vite:
   - Build command: `npm run build`
   - Output directory: `dist`
3. En Vercel, agrega las variables de entorno:
   - `GEMINI_API_KEY`: clave gratuita creada en Google AI Studio.
   - `GEMINI_MODEL`: `gemini-3.5-flash-lite`
4. Despliega el proyecto.

La ruta `/api/sugerir-mensajes` es una funcion serverless de Vercel. El navegador nunca recibe la API key; solo envia nombre, grupo y notas del contacto al backend.

## Funcionalidades implementadas

- CRUD completo con SQLite y consultas parametrizadas.
- Separacion entre `database`, repositorio, hook y componentes.
- Tabla de grupos con `FOREIGN KEY` y listado con `JOIN`.
- Campo de cumpleanos en formato ISO y visualizacion dd/mm/aaaa.
- Busqueda, filtros por grupo y ordenamiento resuelto en SQL.
- Confirmacion personalizada antes de eliminar o importar una copia.
- WhatsApp con numero normalizado para Peru y mensaje codificado.
- Historial de mensajes enviados por contacto.
- Compartir contacto con `navigator.share` o portapapeles.
- Descarga de contacto como archivo `.vcf` con saltos CRLF.
- Exportacion e importacion del archivo real `agenda.db`.
- Panel de estadisticas con `COUNT`, `GROUP BY` y `MIN`.
- Plantillas de mensaje con variables `{nombre}`, `{apellido}`, `{grupo}` y `{telefono}`.
- Detector de posibles duplicados con similitud de Levenshtein.
- Boton "Sugerir mensaje" conectado a Gemini 3.5 Flash-Lite con prompt JSON y manejo de carga/error.
- Interfaz responsiva desde 360 px, foco visible y etiquetas accesibles.

## Prompt usado para sugerir mensajes

```text
Responde unicamente con un arreglo JSON de tres objetos { "tono": string, "mensaje": string }.
Propón mensajes de WhatsApp para este contacto usando tres tonos: formal, cercano y breve.
No incluyas texto adicional fuera del JSON.
```

En produccion la aplicacion llama a `/api/sugerir-mensajes`, que usa Gemini mediante `GEMINI_API_KEY`. En desarrollo local, si no configuras un endpoint, muestra tres sugerencias locales para que el flujo siga funcionando durante la evaluacion.

## Reflexion sobre datos enviados a IA

Para redactar sugerencias basta enviar nombre, grupo y notas generales del contacto. No es recomendable enviar telefono, correo, direccion, cumpleanos ni historial de mensajes, porque son datos personales que no son necesarios para componer un saludo. El usuario siempre debe poder revisar y editar la propuesta antes de abrir WhatsApp.
