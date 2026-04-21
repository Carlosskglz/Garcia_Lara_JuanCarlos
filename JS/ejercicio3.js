function aplicarDescuento() {
    const totalCompra = parseFloat(document.getElementById('compra').value);
    if (isNaN(totalCompra) || totalCompra <= 0) {
        alert("Monto de compra no válido.");
        return;
    }
    const pagoFinal = totalCompra * 0.85; // 100% - 15% = 85%
    document.getElementById('resultado').innerText = `Total con descuento: $${pagoFinal.toFixed(2)}`;
}