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
- Boton "Sugerir mensaje" con prompt JSON y manejo de carga/error.
- Interfaz responsiva desde 360 px, foco visible y etiquetas accesibles.

## Prompt usado para sugerir mensajes

```text
Responde unicamente con un arreglo JSON de tres objetos { "tono": string, "mensaje": string }.
Propón mensajes de WhatsApp para este contacto usando tres tonos: formal, cercano y breve.
No incluyas texto adicional fuera del JSON.
```

La aplicacion usa `VITE_AI_ENDPOINT` si se configura un endpoint externo compatible. Si no existe, muestra tres sugerencias locales para que el flujo siga funcionando durante la evaluacion.

## Reflexion sobre datos enviados a IA

Para redactar sugerencias basta enviar nombre, grupo y notas generales del contacto. No es recomendable enviar telefono, correo, direccion, cumpleanos ni historial de mensajes, porque son datos personales que no son necesarios para componer un saludo. El usuario siempre debe poder revisar y editar la propuesta antes de abrir WhatsApp.
