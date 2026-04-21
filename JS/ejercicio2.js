function calcularSueldo() {
    const sueldoBase = parseFloat(document.getElementById('sueldoBase').value);
    const v1 = parseFloat(document.getElementById('v1').value);
    const v2 = parseFloat(document.getElementById('v2').value);
    const v3 = parseFloat(document.getElementById('v3').value);

    if ([sueldoBase, v1, v2, v3].some(val => isNaN(val) || val < 0)) {
        alert("Todos los campos deben ser números positivos.");
        return;
    }

    const totalVentas = v1 + v2 + v3;
    const comisiones = totalVentas * 0.10;
    const totalMes = sueldoBase + comisiones;

    document.getElementById('resultado').innerText = 
        `Comisiones: $${comisiones.toFixed(2)} | Total del mes: $${totalMes.toFixed(2)}`;
}