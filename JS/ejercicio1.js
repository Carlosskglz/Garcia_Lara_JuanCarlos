function calcularInversion() {
    const capital = parseFloat(document.getElementById('capital').value);
    if (isNaN(capital) || capital <= 0) {
        alert("Por favor, ingrese un monto de capital válido.");
        return;
    }
    const ganancia = capital * 0.02;
    document.getElementById('resultado').innerText = `Ganancia después de un mes: $${ganancia.toFixed(2)}`;
}