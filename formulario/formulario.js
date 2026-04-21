function validar(formulario) {
    if (formulario.nombre.value.trim().length < 3) {
        alert("Por favor, ingresa al menos 3 caracteres en el campo nombre.");
        formulario.nombre.focus();
        return false;
    }

    var abcOK = "ABCDEFGHIJKLMNÑOPQRSTUVWXYZÁÉÍÓÚÜabcdefghijklmnopqrstuvwxyzáéíóúü ";
    var checkString = formulario.nombre.value;
    
    for (var i = 0; i < checkString.length; i++) {
        var caracter = checkString.charAt(i);
        if (abcOK.indexOf(caracter) == -1) {
            alert("Por favor, ingresa solo letras en el campo nombre.");
            formulario.nombre.focus();
            return false;
        }
    }

    var edad = parseInt(formulario.edad.value);
    if (isNaN(edad) || edad < 18 || edad > 99) {
        alert("Por favor, ingresa una edad válida (entre 18 y 99 años).");
        formulario.edad.focus();
        return false;
    }

    var txtEmail = formulario.email.value;
    var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    
    if (!re.test(txtEmail)) {
        alert("Por favor, ingresa un correo electrónico válido.");
        formulario.email.focus();
        return false;
    }

    alert("Formulario validado con éxito. Enviando datos...");
    return true;
}