const express = require('express');
const router = express.Router();
const db = require('../DB/database');

// ============================================================
// FUNCIÓN: Validar datos del rango
// ============================================================
function validarRango(datos) {
    const errores = [];
    if (!datos.nombre || datos.nombre.trim().length < 2) {
        errores.push('El nombre es obligatorio (mínimo 2 caracteres)');
    }
    if (!datos.tier || isNaN(datos.tier) || datos.tier < 1 || datos.tier > 3) {
        errores.push('El tier debe ser un número entre 1 y 3');
    }
    return errores;
}

// ============================================================
// GET /api/rangos — Listar todos los rangos
// ============================================================
router.get('/', async (req, res) => {
    try {
        const [rangos] = await db.execute(
            'SELECT * FROM rangos_valorant ORDER BY id ASC'
        );
        res.json({
            status: 'success',
            data: rangos,
            count: rangos.length
        });
    } catch (error) {
        console.error('Error al listar rangos:', error.message);
        res.status(500).json({ status: 'error', message: 'Error interno del servidor' });
    }
});

// ============================================================
// POST /api/rangos — Registrar nuevo rango
// ============================================================
router.post('/', async (req, res) => {
    try {
        const errores = validarRango(req.body);
        if (errores.length > 0) {
            return res.status(400).json({ status: 'error', message: errores.join('; ') });
        }

        const { nombre, tier, descripcion } = req.body;

        const [resultado] = await db.execute(
            'INSERT INTO rangos_valorant (nombre, tier, descripcion) VALUES (?, ?, ?)',
            [nombre.trim(), tier, descripcion ? descripcion.trim() : '']
        );

        res.status(201).json({ status: 'success', data: { id: resultado.insertId, nombre, tier, descripcion } });
    } catch (error) {
        console.error('Error al crear rango:', error.message);
        res.status(500).json({ status: 'error', message: 'Error interno del servidor' });
    }
});

// ============================================================
// DELETE /api/rangos/:id — Eliminar un rango
// ============================================================
router.delete('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const [rango] = await db.execute('SELECT nombre FROM rangos_valorant WHERE id = ?', [id]);

        if (rango.length === 0) {
            return res.status(404).json({ status: 'error', message: 'Rango no encontrado' });
        }

        await db.execute('DELETE FROM rangos_valorant WHERE id = ?', [id]);
        res.json({ status: 'success', data: { mensaje: `Rango ${rango[0].nombre} eliminado` } });
    } catch (error) {
        console.error('Error al eliminar rango:', error.message);
        res.status(500).json({ status: 'error', message: 'Error interno del servidor' });
    }
});

module.exports = router;