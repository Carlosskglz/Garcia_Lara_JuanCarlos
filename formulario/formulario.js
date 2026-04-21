document.addEventListener("DOMContentLoaded", function() {
    
    const formulario = document.getElementById('formulario');

    formulario.addEventListener('submit', function(evento) {
        // Detenemos el envío automático para validar primero
        evento.preventDefault();

        // Obtenemos los valores de los inputs
        const nombre = document.getElementById('nombre').value.trim();
        const edad = document.getElementById('edad').value;
        const email = document.getElementById('email').value.trim();

        // 1. Validar Nombre (que no esté vacío y longitud mínima)
        if (nombre.length < 3) {
            alert("Por favor, escribe un nombre válido (mínimo 3 caracteres).");
            return;
        }

        // 2. Validar Edad (que sea un número positivo y razonable)
        if (edad <= 0 || edad > 120) {
            alert("Por favor, ingresa una edad válida.");
            return;
        }

        // 3. Validar Email (usando una Expresión Regular)
        const regexEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!regexEmail.test(email)) {
            alert("El formato del correo electrónico no es válido.");
            return;
        }

        // Si todo está bien, podemos proceder
        alert("Formulario validado con éxito. Enviando datos...");
        
        // Aquí podrías usar formulario.submit() si quieres enviarlo realmente
    });
});