// ============================================================
// PRÁCTICA 3 - PNT: Frontend para Sistema de Compras
// ============================================================
// Este frontend maneja 3 secciones: Usuarios, Productos, Compras.
// Cada sección tiene su propio formulario y tabla.
//
// ESTRUCTURA DEL CÓDIGO:
// 1. Utilidades compartidas (fetchAPI, notificaciones, etc.)
// 2. Módulo de Usuarios (CRUD)
// 3. Módulo de Productos (CRUD)
// 4. Módulo de Compras (crear, listar, eliminar)
// 5. Navegación por pestañas
// 6. Inicialización
//
// EVOLUCIÓN DESDE P2:
// - Múltiples recursos (no solo usuarios)
// - Selects dinámicos (llenar opciones desde la API)
// - Navegación por pestañas sin recargar página (SPA-like)
// ============================================================

// ============================================================
// 1. UTILIDADES COMPARTIDAS
// ============================================================

// Panel de estado de la API
const apiMetodo = document.getElementById('api-metodo');
const apiUrl = document.getElementById('api-url');
const apiCodigo = document.getElementById('api-codigo');
const notificacionDiv = document.getElementById('notificacion');

const URL_BACKEND = 'http://localhost:3000';

// Fetch wrapper con logging (evolución de P2)

async function fetchAPI(url, opciones = {}) {
    const method = opciones.method || 'GET';

    apiMetodo.textContent = method;
    apiMetodo.className = `badge badge-${method.toLowerCase()}`;
    apiUrl.textContent = url;
    apiCodigo.textContent = '...';
    apiCodigo.className = 'badge badge-neutral';

    try {

        const urlCompleta = `${URL_BACKEND}${url}`;

        const respuesta = await fetch(urlCompleta, opciones);
        apiCodigo.textContent = `${respuesta.status}`;
        apiCodigo.className = `badge ${respuesta.ok ? 'badge-success' : 'badge-error'}`;

        const datos = await respuesta.json();
        if (!respuesta.ok) {
            throw new Error(datos.message || `Error ${respuesta.status}`);
        }
        return datos;
    } catch (error) {
        if (apiCodigo.textContent === '...') {
            apiCodigo.textContent = 'ERROR';
            apiCodigo.className = 'badge badge-error';
        }
        throw error;
    }
}

function mostrarNotificacion(mensaje, tipo) {
    notificacionDiv.textContent = mensaje;
    notificacionDiv.className = `notificacion ${tipo}`;
    notificacionDiv.style.display = 'block';
    setTimeout(() => { notificacionDiv.style.display = 'none'; }, 3000);
}

function escapeHtml(texto) {
    const div = document.createElement('div');
    div.textContent = texto;
    return div.innerHTML;
}

function formatearFechaHora(fechaISO) {
    if (!fechaISO) return '-';
    return new Date(fechaISO).toLocaleString('es-ES', {
        day: '2-digit', month: '2-digit', year: 'numeric',
        hour: '2-digit', minute: '2-digit'
    });
}

// ============================================================
// 2. MÓDULO DE USUARIOS
// ============================================================
const formUsuario = document.getElementById('form-usuario');
const inputUsuarioId = document.getElementById('usuario-id');
const inputUsuarioNombre = document.getElementById('usuario-nombre');
const inputUsuarioEmail = document.getElementById('usuario-email');
const formTituloUsuario = document.getElementById('form-titulo-usuario');
const btnGuardarUsuario = document.getElementById('btn-guardar-usuario');
const btnCancelarUsuario = document.getElementById('btn-cancelar-usuario');
const tbodyUsuarios = document.getElementById('tbody-usuarios');
const tablaUsuarios = document.getElementById('tabla-usuarios');
const cargaUsuarios = document.getElementById('carga-usuarios');
const contadorUsuarios = document.getElementById('contador-usuarios');
const errorUsuarioNombre = document.getElementById('error-usuario-nombre');
const errorUsuarioEmail = document.getElementById('error-usuario-email');

async function cargarUsuarios() {
    try {
        const resp = await fetchAPI('/api/usuarios');
        cargaUsuarios.style.display = 'none';

        if (resp.data.length === 0) {
            tablaUsuarios.style.display = 'none';
            cargaUsuarios.textContent = 'No hay usuarios registrados.';
            cargaUsuarios.style.display = 'block';
        } else {
            tablaUsuarios.style.display = 'table';
            tbodyUsuarios.innerHTML = '';
            resp.data.forEach(u => {
                const fila = document.createElement('tr');
                fila.innerHTML = `
                    <td>${u.id}</td>
                    <td>${escapeHtml(u.nombre)}</td>
                    <td>${escapeHtml(u.email)}</td>
                    <td>
                        <button class="btn-ver" onclick="verComprasUsuario(${u.id})">Compras</button>
                        <button class="btn-editar" onclick="editarUsuario(${u.id})">Editar</button>
                        <button class="btn-eliminar" onclick="confirmarEliminarUsuario(${u.id}, '${escapeHtml(u.nombre)}')">Eliminar</button>
                    </td>
                `;
                tbodyUsuarios.appendChild(fila);
            });
        }
        contadorUsuarios.textContent = `${resp.count}`;
    } catch (error) {
        mostrarNotificacion('Error al cargar usuarios: ' + error.message, 'error');
    }
}

function validarFormUsuario() {
    let ok = true;
    const nombre = inputUsuarioNombre.value.trim();
    const email = inputUsuarioEmail.value.trim();

    if (!nombre || nombre.length < 2) {
        errorUsuarioNombre.textContent = 'Mínimo 2 caracteres';
        inputUsuarioNombre.classList.add('input-error');
        ok = false;
    } else {
        errorUsuarioNombre.textContent = '';
        inputUsuarioNombre.classList.remove('input-error');
    }

    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        errorUsuarioEmail.textContent = 'Email no válido';
        inputUsuarioEmail.classList.add('input-error');
        ok = false;
    } else {
        errorUsuarioEmail.textContent = '';
        inputUsuarioEmail.classList.remove('input-error');
    }

    return ok;
}

function limpiarFormUsuario() {
    formUsuario.reset();
    inputUsuarioId.value = '';
    formTituloUsuario.textContent = 'Agregar Usuario';
    btnGuardarUsuario.textContent = 'Guardar';
    btnCancelarUsuario.style.display = 'none';
    errorUsuarioNombre.textContent = '';
    errorUsuarioEmail.textContent = '';
    inputUsuarioNombre.classList.remove('input-error');
    inputUsuarioEmail.classList.remove('input-error');
}

formUsuario.addEventListener('submit', async (e) => {
    e.preventDefault();
    if (!validarFormUsuario()) return;

    const datos = {
        nombre: inputUsuarioNombre.value.trim(),
        email: inputUsuarioEmail.value.trim()
    };
    const id = inputUsuarioId.value;

    try {
        if (id) {
            await fetchAPI(`/api/usuarios/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(datos)
            });
            mostrarNotificacion('Usuario actualizado', 'exito');
        } else {
            await fetchAPI('/api/usuarios', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(datos)
            });
            mostrarNotificacion('Usuario creado', 'exito');
        }
        limpiarFormUsuario();
        cargarUsuarios();
        cargarSelectUsuarios(); // Actualizar select de compras
    } catch (error) {
        mostrarNotificacion(error.message, 'error');
    }
});

async function editarUsuario(id) {
    try {
        const resp = await fetchAPI(`/api/usuarios/${id}`);
        inputUsuarioId.value = resp.data.id;
        inputUsuarioNombre.value = resp.data.nombre;
        inputUsuarioEmail.value = resp.data.email;
        formTituloUsuario.textContent = 'Editar Usuario';
        btnGuardarUsuario.textContent = 'Actualizar';
        btnCancelarUsuario.style.display = 'inline-block';
        cambiarSeccion('usuarios');
        formUsuario.scrollIntoView({ behavior: 'smooth' });
    } catch (error) {
        mostrarNotificacion(error.message, 'error');
    }
}

function confirmarEliminarUsuario(id, nombre) {
    if (confirm(`¿Eliminar a "${nombre}" y todas sus compras?`)) {
        eliminarUsuario(id);
    }
}

async function eliminarUsuario(id) {
    try {
        await fetchAPI(`/api/usuarios/${id}`, { method: 'DELETE' });
        mostrarNotificacion('Usuario eliminado', 'exito');
        if (inputUsuarioId.value === String(id)) limpiarFormUsuario();
        cargarUsuarios();
        cargarSelectUsuarios();
        cargarCompras();
    } catch (error) {
        mostrarNotificacion(error.message, 'error');
    }
}

// Ver compras de un usuario específico
async function verComprasUsuario(id) {
    try {
        const resp = await fetchAPI(`/api/compras/usuario/${id}`);
        const { usuario, compras, total_compras, total_gastado } = resp.data;

        let mensaje = `${usuario.nombre} tiene ${total_compras} compra(s).\nTotal gastado: $${total_gastado}\n\n`;
        compras.forEach(c => {
            mensaje += `- ${c.producto} x${c.cantidad} = $${parseFloat(c.total).toFixed(2)}\n`;
        });

        alert(mensaje);
    } catch (error) {
        mostrarNotificacion(error.message, 'error');
    }
}

btnCancelarUsuario.addEventListener('click', limpiarFormUsuario);

// ============================================================
// 3. MÓDULO DE PRODUCTOS
// ============================================================
const formProducto = document.getElementById('form-producto');
const inputProductoId = document.getElementById('producto-id');
const inputProductoNombre = document.getElementById('producto-nombre');
const inputProductoPrecio = document.getElementById('producto-precio');
const formTituloProducto = document.getElementById('form-titulo-producto');
const btnGuardarProducto = document.getElementById('btn-guardar-producto');
const btnCancelarProducto = document.getElementById('btn-cancelar-producto');
const tbodyProductos = document.getElementById('tbody-productos');
const tablaProductos = document.getElementById('tabla-productos');
const cargaProductos = document.getElementById('carga-productos');
const contadorProductos = document.getElementById('contador-productos');
const errorProductoNombre = document.getElementById('error-producto-nombre');
const errorProductoPrecio = document.getElementById('error-producto-precio');

async function cargarProductos() {
    try {
        const resp = await fetchAPI('/api/productos');
        cargaProductos.style.display = 'none';

        if (resp.data.length === 0) {
            tablaProductos.style.display = 'none';
            cargaProductos.textContent = 'No hay productos registrados.';
            cargaProductos.style.display = 'block';
        } else {
            tablaProductos.style.display = 'table';
            tbodyProductos.innerHTML = '';
            resp.data.forEach(p => {
                const fila = document.createElement('tr');
                fila.innerHTML = `
                    <td>${p.id}</td>
                    <td>${escapeHtml(p.nombre)}</td>
                    <td>$${parseFloat(p.precio).toFixed(2)}</td>
                    <td>
                        <button class="btn-editar" onclick="editarProducto(${p.id})">Editar</button>
                        <button class="btn-eliminar" onclick="confirmarEliminarProducto(${p.id}, '${escapeHtml(p.nombre)}')">Eliminar</button>
                    </td>
                `;
                tbodyProductos.appendChild(fila);
            });
        }
        contadorProductos.textContent = `${resp.count}`;
    } catch (error) {
        mostrarNotificacion('Error al cargar productos: ' + error.message, 'error');
    }
}

function validarFormProducto() {
    let ok = true;
    const nombre = inputProductoNombre.value.trim();
    const precio = inputProductoPrecio.value;

    if (!nombre || nombre.length < 2) {
        errorProductoNombre.textContent = 'Mínimo 2 caracteres';
        inputProductoNombre.classList.add('input-error');
        ok = false;
    } else {
        errorProductoNombre.textContent = '';
        inputProductoNombre.classList.remove('input-error');
    }

    if (!precio || parseFloat(precio) <= 0) {
        errorProductoPrecio.textContent = 'Precio debe ser mayor que 0';
        inputProductoPrecio.classList.add('input-error');
        ok = false;
    } else {
        errorProductoPrecio.textContent = '';
        inputProductoPrecio.classList.remove('input-error');
    }

    return ok;
}

function limpiarFormProducto() {
    formProducto.reset();
    inputProductoId.value = '';
    formTituloProducto.textContent = 'Agregar Producto';
    btnGuardarProducto.textContent = 'Guardar';
    btnCancelarProducto.style.display = 'none';
    errorProductoNombre.textContent = '';
    errorProductoPrecio.textContent = '';
    inputProductoNombre.classList.remove('input-error');
    inputProductoPrecio.classList.remove('input-error');
}

formProducto.addEventListener('submit', async (e) => {
    e.preventDefault();
    if (!validarFormProducto()) return;

    const datos = {
        nombre: inputProductoNombre.value.trim(),
        precio: parseFloat(inputProductoPrecio.value)
    };
    const id = inputProductoId.value;

    try {
        if (id) {
            await fetchAPI(`/api/productos/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(datos)
            });
            mostrarNotificacion('Producto actualizado', 'exito');
        } else {
            await fetchAPI('/api/productos', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(datos)
            });
            mostrarNotificacion('Producto creado', 'exito');
        }
        limpiarFormProducto();
        cargarProductos();
        cargarSelectProductos();
    } catch (error) {
        mostrarNotificacion(error.message, 'error');
    }
});

async function editarProducto(id) {
    try {
        const resp = await fetchAPI(`/api/productos/${id}`);
        inputProductoId.value = resp.data.id;
        inputProductoNombre.value = resp.data.nombre;
        inputProductoPrecio.value = resp.data.precio;
        formTituloProducto.textContent = 'Editar Producto';
        btnGuardarProducto.textContent = 'Actualizar';
        btnCancelarProducto.style.display = 'inline-block';
        cambiarSeccion('productos');
        formProducto.scrollIntoView({ behavior: 'smooth' });
    } catch (error) {
        mostrarNotificacion(error.message, 'error');
    }
}

function confirmarEliminarProducto(id, nombre) {
    if (confirm(`¿Eliminar "${nombre}"?\nSi tiene compras asociadas, no se podrá eliminar.`)) {
        eliminarProducto(id);
    }
}

async function eliminarProducto(id) {
    try {
        await fetchAPI(`/api/productos/${id}`, { method: 'DELETE' });
        mostrarNotificacion('Producto eliminado', 'exito');
        if (inputProductoId.value === String(id)) limpiarFormProducto();
        cargarProductos();
        cargarSelectProductos();
    } catch (error) {
        mostrarNotificacion(error.message, 'error');
    }
}

btnCancelarProducto.addEventListener('click', limpiarFormProducto);

// ============================================================
// 4. MÓDULO DE COMPRAS
// ============================================================
const formCompra = document.getElementById('form-compra');
const selectUsuario = document.getElementById('compra-usuario');
const selectProducto = document.getElementById('compra-producto');
const inputCantidad = document.getElementById('compra-cantidad');
const tbodyCompras = document.getElementById('tbody-compras');
const tablaCompras = document.getElementById('tabla-compras');
const cargaCompras = document.getElementById('carga-compras');
const contadorCompras = document.getElementById('contador-compras');
const errorCompraUsuario = document.getElementById('error-compra-usuario');
const errorCompraProducto = document.getElementById('error-compra-producto');
const errorCompraCantidad = document.getElementById('error-compra-cantidad');

// Llenar el <select> de usuarios con datos de la API
// Los <select> se llenan dinámicamente cada vez que cambian
// los datos, para mantenerlos sincronizados con la BD.
async function cargarSelectUsuarios() {
    try {
        const resp = await fetchAPI('/api/usuarios');
        selectUsuario.innerHTML = '<option value="">-- Seleccionar usuario --</option>';
        resp.data.forEach(u => {
            // createElement es más seguro que innerHTML para datos dinámicos
            const option = document.createElement('option');
            option.value = u.id;
            option.textContent = `${u.nombre} (${u.email})`;
            selectUsuario.appendChild(option);
        });
    } catch (error) {
        console.error('Error cargando select usuarios:', error);
    }
}

async function cargarSelectProductos() {
    try {
        const resp = await fetchAPI('/api/productos');
        selectProducto.innerHTML = '<option value="">-- Seleccionar producto --</option>';
        resp.data.forEach(p => {
            const option = document.createElement('option');
            option.value = p.id;
            option.textContent = `${p.nombre} — $${parseFloat(p.precio).toFixed(2)}`;
            selectProducto.appendChild(option);
        });
    } catch (error) {
        console.error('Error cargando select productos:', error);
    }
}

async function cargarCompras() {
    try {
        const resp = await fetchAPI('/api/compras');
        cargaCompras.style.display = 'none';

        if (resp.data.length === 0) {
            tablaCompras.style.display = 'none';
            cargaCompras.textContent = 'No hay compras registradas.';
            cargaCompras.style.display = 'block';
        } else {
            tablaCompras.style.display = 'table';
            tbodyCompras.innerHTML = '';
            resp.data.forEach(c => {
                const fila = document.createElement('tr');
                fila.innerHTML = `
                    <td>${c.id}</td>
                    <td>${escapeHtml(c.usuario_nombre)}</td>
                    <td>${escapeHtml(c.producto_nombre)}</td>
                    <td>$${parseFloat(c.producto_precio).toFixed(2)}</td>
                    <td>${c.cantidad}</td>
                    <td><strong>$${parseFloat(c.total).toFixed(2)}</strong></td>
                    <td>${formatearFechaHora(c.fecha_compra)}</td>
                    <td>
                        <button class="btn-eliminar" onclick="confirmarEliminarCompra(${c.id})">Eliminar</button>
                    </td>
                `;
                tbodyCompras.appendChild(fila);
            });
        }
        contadorCompras.textContent = `${resp.count}`;
    } catch (error) {
        mostrarNotificacion('Error al cargar compras: ' + error.message, 'error');
    }
}

function validarFormCompra() {
    let ok = true;

    if (!selectUsuario.value) {
        errorCompraUsuario.textContent = 'Selecciona un usuario';
        selectUsuario.classList.add('input-error');
        ok = false;
    } else {
        errorCompraUsuario.textContent = '';
        selectUsuario.classList.remove('input-error');
    }

    if (!selectProducto.value) {
        errorCompraProducto.textContent = 'Selecciona un producto';
        selectProducto.classList.add('input-error');
        ok = false;
    } else {
        errorCompraProducto.textContent = '';
        selectProducto.classList.remove('input-error');
    }

    const cant = parseInt(inputCantidad.value);
    if (!cant || cant < 1) {
        errorCompraCantidad.textContent = 'Mínimo 1';
        inputCantidad.classList.add('input-error');
        ok = false;
    } else {
        errorCompraCantidad.textContent = '';
        inputCantidad.classList.remove('input-error');
    }

    return ok;
}

formCompra.addEventListener('submit', async (e) => {
    e.preventDefault();
    if (!validarFormCompra()) return;

    try {
        const resp = await fetchAPI('/api/compras', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                usuario_id: parseInt(selectUsuario.value),
                producto_id: parseInt(selectProducto.value),
                cantidad: parseInt(inputCantidad.value)
            })
        });

        mostrarNotificacion(
            `Compra registrada: ${resp.data.usuario} compró ${resp.data.cantidad}x ${resp.data.producto} ($${resp.data.total})`,
            'exito'
        );
        formCompra.reset();
        inputCantidad.value = '1';
        cargarCompras();
    } catch (error) {
        mostrarNotificacion(error.message, 'error');
    }
});

function confirmarEliminarCompra(id) {
    if (confirm('¿Eliminar esta compra?')) {
        eliminarCompra(id);
    }
}

async function eliminarCompra(id) {
    try {
        await fetchAPI(`/api/compras/${id}`, { method: 'DELETE' });
        mostrarNotificacion('Compra eliminada', 'exito');
        cargarCompras();
    } catch (error) {
        mostrarNotificacion(error.message, 'error');
    }
}



// ============================================================
// 5. NAVEGACIÓN POR PESTAÑAS
// ============================================================
// Esta función muestra una sección y oculta las demás.
// También actualiza la pestaña activa visualmente.
// Es un patrón básico de SPA (Single Page Application):
// cambiar contenido sin recargar la página.
function cambiarSeccion(seccion) {
    // Ocultar todas las secciones
    document.querySelectorAll('.seccion').forEach(s => {
        s.style.display = 'none';
    });

    // Desactivar todas las pestañas
    document.querySelectorAll('.tab').forEach(t => {
        t.classList.remove('active');
    });

    // Mostrar la sección seleccionada
    document.getElementById(`seccion-${seccion}`).style.display = 'block';

    // Activar la pestaña correspondiente
    // Array.from convierte NodeList a Array para poder usar find()
    const tabs = Array.from(document.querySelectorAll('.tab'));
    const tabActiva = tabs.find(t => t.textContent.toLowerCase() === seccion);
    if (tabActiva) tabActiva.classList.add('active');

    // Si cambiamos a compras, recargar selects con datos actuales
    if (seccion === 'compras') {
        cargarSelectUsuarios();
        cargarSelectProductos();
        cargarCompras();
    }

    if (seccion === 'valorant') {
        cargarAgentes();
    }
    if (seccion === 'rangos') {
        document.getElementById('seccion-rangos').style.display = 'block';
        cargarRangos();
}
}

// ============================================================
// 6. INICIALIZACIÓN
// ============================================================
// Al cargar la página, cargamos todos los datos iniciales.
document.addEventListener('DOMContentLoaded', () => {
    cargarUsuarios();
    cargarProductos();
    cargarCompras();
    cargarSelectUsuarios();
    cargarSelectProductos();
    cargarAgentes();
});

// ============================================================
// 7. MÓDULO DE VALORANT
// ============================================================
const formAgente = document.getElementById('form-agente');
const inputAgenteNombre = document.getElementById('agente-nombre');
const selectAgenteRol = document.getElementById('agente-rol');
const inputAgenteHabilidad = document.getElementById('agente-habilidad');
const tbodyAgentes = document.getElementById('tbody-agentes');
const tablaAgentes = document.getElementById('tabla-agentes');
const cargaAgentes = document.getElementById('carga-agentes');
const contadorAgentes = document.getElementById('contador-agents');
const errorAgenteNombre = document.getElementById('error-agente-nombre');
const errorAgenteRol = document.getElementById('error-agente-rol');
const errorAgenteHabilidad = document.getElementById('error-agente-habilidad');

async function cargarAgentes() {
    try {
        const resp = await fetchAPI('/api/valorant');
        cargaAgentes.style.display = 'none';

        if (resp.data.length === 0) {
            tablaAgentes.style.display = 'none';
            cargaAgentes.textContent = 'No hay agentes registrados.';
            cargaAgentes.style.display = 'block';
        } else {
            tablaAgentes.style.display = 'table';
            tbodyAgentes.innerHTML = '';
            resp.data.forEach(a => {
                const fila = document.createElement('tr');
                fila.innerHTML = `
                    <td>${a.id}</td>
                    <td><strong>${escapeHtml(a.nombre)}</strong></td>
                    <td><span class="badge badge-neutral">${escapeHtml(a.rol)}</span></td>
                    <td>${escapeHtml(a.habilidad_definitiva)}</td>
                    
                    
                    <td>
                    <button onclick="prepararEdicionAgente(${a.id}, '${a.nombre}', '${a.rol}', '${a.habilidad_definitiva}')">Editar</button>
                    <button class="btn-eliminar" onclick="confirmarEliminarAgente(${a.id}, '${a.nombre}')">Eliminar</button>
                    </td>
                `;
                tbodyAgentes.appendChild(fila);
            });
        }
        contadorAgentes.textContent = `${resp.count}`;
    } catch (error) {
        mostrarNotificacion('Error al cargar agentes: ' + error.message, 'error');
    }
}
// ============================================================
// 8. MÓDULO DE RANGOS
// ============================================================
async function cargarRangos() {
    try {
        const resp = await fetchAPI('/api/rangos');
        const tbody = document.getElementById('tbody-rangos');
        const carga = document.getElementById('carga-rangos');
        
        if (carga) carga.style.display = 'none';
        
        if (resp.data.length === 0) {
            document.getElementById('tabla-rangos').style.display = 'none';
            if (carga) {
                carga.textContent = 'No hay rangos registrados.';
                carga.style.display = 'block';
            }
        } else {
            document.getElementById('tabla-rangos').style.display = 'table';
            tbody.innerHTML = resp.data.map(r => `
                <tr>
                    <td>${r.id}</td>
                    <td>${escapeHtml(r.nombre)}</td>
                    <td>${r.tier}</td>
                    <td>${escapeHtml(r.descripcion || '')}</td>
                    <td><button class="btn-eliminar" onclick="eliminarRango(${r.id})">Eliminar</button></td>
                </tr>
            `).join('');
        }
    } catch (error) {
        mostrarNotificacion('Error al cargar rangos: ' + error.message, 'error');
    }
}

async function eliminarRango(id) {
    if (!confirm('¿Seguro que quieres eliminar este rango?')) return;
    try {
        await fetchAPI(`/api/rangos/${id}`, { method: 'DELETE' });
        mostrarNotificacion('Rango eliminado', 'exito');
        cargarRangos();
    } catch (error) {
        mostrarNotificacion(error.message, 'error');
    }
}

// Asegúrate de que el formulario de rangos tenga este listener
// Define el formulario una sola vez fuera de las funciones
const formRango = document.getElementById('form-rango');

formRango.addEventListener('submit', async (e) => {
    e.preventDefault(); 
    
    // Si la validación falla, no hacemos nada más
    if (!validarFormRango()) return;

    // Deshabilitar botón para evitar doble clic
    const btnGuardar = document.getElementById('btn-guardar-rango');
    btnGuardar.disabled = true;

    try {
        const datos = {
            nombre: document.getElementById('rango-nombre').value,
            tier: document.getElementById('rango-tier').value,
            descripcion: document.getElementById('rango-descripcion').value
        };

        const resp = await fetchAPI('/api/rangos', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(datos)
        });

        mostrarNotificacion('Rango registrado', 'exito');
        formRango.reset(); // Limpiamos formulario
        cargarRangos();    // Recargamos tabla
    } catch (error) {
        mostrarNotificacion('Error: ' + error.message, 'error');
    } finally {
        btnGuardar.disabled = false; // Reactivamos botón
    }
});
async function eliminarRango(id) {
    if (!confirm('¿Estás seguro de eliminar este rango?')) return;
    
    try {
        await fetchAPI(`/api/rangos/${id}`, { method: 'DELETE' });
        mostrarNotificacion('Rango eliminado correctamente', 'exito');
        cargarRangos(); // Recarga la tabla
    } catch (error) {
        mostrarNotificacion('Error al eliminar: ' + error.message, 'error');
    }
}
function validarFormAgente() {
    let ok = true;
    
    if (!inputAgenteNombre.value.trim() || inputAgenteNombre.value.trim().length < 2) {
        errorAgenteNombre.textContent = 'Mínimo 2 caracteres';
        inputAgenteNombre.classList.add('input-error');
        ok = false;
    } else {
        errorAgenteNombre.textContent = '';
        inputAgenteNombre.classList.remove('input-error');
    }

    if (!selectAgenteRol.value) {
        errorAgenteRol.textContent = 'Selecciona un rol';
        selectAgenteRol.classList.add('input-error');
        ok = false;
    } else {
        errorAgenteRol.textContent = '';
        selectAgenteRol.classList.remove('input-error');
    }

    if (!inputAgenteHabilidad.value.trim() || inputAgenteHabilidad.value.trim().length < 2) {
        errorAgenteHabilidad.textContent = 'Mínimo 2 caracteres';
        inputAgenteHabilidad.classList.add('input-error');
        ok = false;
    } else {
        errorAgenteHabilidad.textContent = '';
        inputAgenteHabilidad.classList.remove('input-error');
    }

    return ok;
}

formAgente.addEventListener('submit', async (e) => {
    e.preventDefault();
    if (!validarFormAgente()) return;

    const id = document.getElementById('agente-id').value;
    const datos = {
        nombre: inputAgenteNombre.value.trim(),
        rol: selectAgenteRol.value,
        habilidad_definitiva: inputAgenteHabilidad.value.trim()
    };

    try {
        if (id) {
            // Es una actualización (PUT)
            await fetchAPI(`/api/valorant/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(datos)
            });
            mostrarNotificacion('Agente actualizado', 'exito');
        } else {
            // Es una creación nueva (POST)
            await fetchAPI('/api/valorant', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(datos)
            });
            mostrarNotificacion('Agente registrado', 'exito');
        }
        
        // Limpiar formulario y recargar
        document.getElementById('btn-cancelar-agente').click();
        cargarAgentes();
    } catch (error) {
        mostrarNotificacion(error.message, 'error');
    }
});

function confirmarEliminarAgente(id, nombre) {
    if (confirm(`¿Estás seguro de eliminar a ${nombre}?`)) {
        eliminarAgente(id);
    }
}

async function eliminarAgente(id) {
    try {
        await fetchAPI(`/api/valorant/${id}`, { method: 'DELETE' });
        mostrarNotificacion('Agente eliminado', 'exito');
        cargarAgentes();
    } catch (error) {
        mostrarNotificacion(error.message, 'error');
    }
}

function prepararEdicionAgente(id, nombre, rol, habilidad) {
    document.getElementById('agente-id').value = id;
    inputAgenteNombre.value = nombre;
    selectAgenteRol.value = rol;
    inputAgenteHabilidad.value = habilidad;
    
    document.getElementById('form-titulo-agente').textContent = 'Editar Agente';
    document.getElementById('btn-guardar-agente').textContent = 'Actualizar Agente';
    document.getElementById('btn-cancelar-agente').style.display = 'inline-block';
}

// Función para cancelar la edición
document.getElementById('btn-cancelar-agente').addEventListener('click', () => {
    formAgente.reset();
    document.getElementById('agente-id').value = '';
    document.getElementById('form-titulo-agente').textContent = 'Agregar Agente';
    document.getElementById('btn-guardar-agente').textContent = 'Guardar';
    document.getElementById('btn-cancelar-agente').style.display = 'none';
});
document.getElementById('form-rango').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const nuevoRango = {
        nombre: document.getElementById('rango-nombre').value,
        tier: document.getElementById('rango-tier').value,
        descripcion: document.getElementById('rango-desc').value
    };

    try {
        await fetchAPI('/api/rangos', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(nuevoRango)
        });
        document.getElementById('form-rango').reset();
        cargarRangos();
        mostrarNotificacion('Rango agregado con éxito', 'exito');
    } catch (error) {
        mostrarNotificacion('Error al guardar: ' + error.message, 'error');
    }
});