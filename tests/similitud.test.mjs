import assert from 'node:assert/strict'
import { distanciaLevenshtein, similitud } from '../src/utils/similitud.js'

assert.equal(distanciaLevenshtein('Ana Rios', 'Ana Ríos'), 0)
assert.equal(distanciaLevenshtein('casa', 'caso'), 1)
assert.ok(similitud('Ana Rios', 'Ana Ríos') >= 0.85)
assert.ok(similitud('+51 965 123 456', '965123456') >= 0.85)

console.log('Pruebas de similitud completadas')
