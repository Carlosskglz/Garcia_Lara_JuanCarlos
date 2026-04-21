function calcularFinal() {
    const p1 = parseFloat(document.getElementById('p1').value);
    const p2 = parseFloat(document.getElementById('p2').value);
    const p3 = parseFloat(document.getElementById('p3').value);
    const examen = parseFloat(document.getElementById('examen').value);
    const trabajo = parseFloat(document.getElementById('trabajo').value);

    if ([p1, p2, p3, examen, trabajo].some(n => isNaN(n) || n < 0 || n > 10)) {
        alert("Asegúrate de que todas las notas estén entre 0 y 10.");
        return;
    }

    const promedioParciales = (p1 + p2 + p3) / 3;
    const notaFinal = (promedioParciales * 0.55) + (examen * 0.30) + (trabajo * 0.15);

    document.getElementById('resultado').innerText = `Calificación Final: ${notaFinal.toFixed(2)}`;
}