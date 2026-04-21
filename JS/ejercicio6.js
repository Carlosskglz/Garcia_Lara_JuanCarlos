function calcularEdad() {
    const fechaNac = new Date(document.getElementById('fechaNac').value);
    const hoy = new Date();

    if (isNaN(fechaNac.getTime()) || fechaNac > hoy) {
        alert("Seleccione una fecha de nacimiento válida.");
        return;
    }

    let edad = hoy.getFullYear() - fechaNac.getFullYear();
    const mes = hoy.getMonth() - fechaNac.getMonth();
    
    // Ajuste si aún no ha cumplido años en el año actual
    if (mes < 0 || (mes === 0 && hoy.getDate() < fechaNac.getDate())) {
        edad--;
    }

    document.getElementById('resultado').innerText = `La edad es: ${edad} años.`;
}