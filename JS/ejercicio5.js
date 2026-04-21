function calcularPorcentajes() {
    const hombres = parseInt(document.getElementById('hombres').value);
    const mujeres = parseInt(document.getElementById('mujeres').value);

    if (isNaN(hombres) || isNaN(mujeres) || (hombres + mujeres) === 0) {
        alert("Ingrese cantidades válidas (mínimo un estudiante en total).");
        return;
    }

    const total = hombres + mujeres;
    const porcH = (hombres / total) * 100;
    const porcM = (mujeres / total) * 100;

    document.getElementById('resultado').innerText = 
        `Hombres: ${porcH.toFixed(1)}% | Mujeres: ${porcM.toFixed(1)}%`;
}