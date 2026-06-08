const express = require('express');
const router = express.Router();
const db = require('../DB/database'); // Ajusta esta ruta si tu conexión a la BD está en otro lado

// ============================================================
// FUNCIÓN: Validar datos del agente
// ============================================================
function validarAgente(datos) {
    const errores = [];

    if (!datos.nombre || datos.nombre.trim().length < 2) {
        errores.push('El nombre es obligatorio (mínimo 2 caracteres)');
    }
    if (!datos.rol || datos.rol.trim().length < 2) {
        errores.push('El rol es obligatorio');
    }
    if (!datos.habilidad_definitiva || datos.habilidad_definitiva.trim().length < 2) {
        errores.push('La habilidad definitiva es obligatoria');
    }

    return errores;
}

// ============================================================
// GET /api/valorant — Listar todos los agentes
// ============================================================
router.get('/', async (req, res) => {
    try {
        const [agentes] = await db.execute(
            'SELECT id, nombre, rol, habilidad_definitiva, created_at FROM agentes_valorant ORDER BY id ASC'
        );

        res.json({
            status: 'success',
            data: agentes,
            count: agentes.length
        });
    } catch (error) {
        console.error('Error al listar agentes:', error.message);
        res.status(500).json({ status: 'error', message: 'Error interno del servidor' });
    }
});

// ============================================================
// POST /api/valorant — Registrar nuevo agente
// ============================================================
router.post('/', async (req, res) => {
    try {
        const errores = validarAgente(req.body);
        if (errores.length > 0) {
            return res.status(400).json({ status: 'error', message: errores.join('; ') });
        }

        const { nombre, rol, habilidad_definitiva } = req.body;

        const [resultado] = await db.execute(
            'INSERT INTO agentes_valorant (nombre, rol, habilidad_definitiva) VALUES (?, ?, ?)',
            [nombre.trim(), rol.trim(), habilidad_definitiva.trim()]
        );

        const [nuevoAgente] = await db.execute(
            'SELECT * FROM agentes_valorant WHERE id = ?',
            [resultado.insertId]
        );

        res.status(201).json({ status: 'success', data: nuevoAgente[0] });
    } catch (error) {
        console.error('Error al crear agente:', error.message);
        res.status(500).json({ status: 'error', message: 'Error interno del servidor' });
    }
});

// ============================================================
// DELETE /api/valorant/:id — Eliminar un agente
// ============================================================
router.delete('/:id', async (req, res) => {
    try {
        const { id } = req.params;

        const [agente] = await db.execute('SELECT id, nombre FROM agentes_valorant WHERE id = ?', [id]);

        if (agente.length === 0) {
            return res.status(404).json({ status: 'error', message: `Agente con ID ${id} no encontrado` });
        }

        await db.execute('DELETE FROM agentes_valorant WHERE id = ?', [id]);

        res.json({ status: 'success', data: { mensaje: `Agente ${agente[0].nombre} eliminado exitosamente` } });
    } catch (error) {
        console.error('Error al eliminar agente:', error.message);
        res.status(500).json({ status: 'error', message: 'Error interno del servidor' });
    }
});

router.put('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { nombre, rol, habilidad_definitiva } = req.body;
        
        await db.execute(
            'UPDATE agentes_valorant SET nombre = ?, rol = ?, habilidad_definitiva = ? WHERE id = ?',
            [nombre, rol, habilidad_definitiva, id]
        );
        
        res.json({ status: 'success', message: 'Agente actualizado' });
    } catch (error) {
        res.status(500).json({ status: 'error', message: 'Error al actualizar' });
    }
});

module.exports = router;