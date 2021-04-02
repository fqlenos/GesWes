/* jshint esversion: 6 */
/* jshint bitwise:false */

/**
 * @author Iñaki Ruiz <ruiz.117069@e.unavarra.es>
 * @author Pedro del Pino <delpino127445@e.unavarra.es>
 */

/* buttons.js:

archivo dedicado a las funciones llamadas desde botones clave; se llama en la página gestor.html puesto que es en la que se encuentran dichos botones.

este archivo incluye los siguientes botones que al 'click' lanza funciones propias:
- show_btn => muestra un campo oculto { se crea la función show() a parte porque puede interesar usarlo desde otra función }
- hide_btn => oculta el campo anterior
- reset_btn => resetea el formulario entero { se crea la función reset() a parte porque puede interesar usarlo desde otra función }
- empty_storage_btn => vacía el LocalStorage
- delete_btn => elimina del LocalStorage el card seleccionado
- edit_btn => funciona diferente si está o no encriptado, crea botones y otros EventListener-s dentro de la función
- save_btn => guarda en LocalStorage el fichero 

*/

// variables usadas en todo el documento:
let storage;

// necesario para MOSTRAR el campo de contraseña
const show_btn = document.getElementById("encrypt");
show_btn.addEventListener('click', show);

// creo la función fuera del EventListener porque en algún momento puedo necesitar llamarla desde fuera del botón
function show() {
    document.getElementById('password').type = "password";
    document.getElementById('password').setAttribute("placeholder", "Contraseña para encriptar");
    document.getElementById('password').required = true;
}

// necesario para OCULTAR el campo de contraseña
const hide_btn = document.getElementById("no-encrypt");
hide_btn.addEventListener('click', function() {
    document.getElementById('password').type = "hidden";
    document.getElementById('password').removeAttribute("placeholder", "Contraseña para encriptar");
    document.getElementById('password').required = false;

    // elimino errores o información irrelevante en "no encrypt"
    if (document.getElementById("_info")) {
        document.getElementById("_info").remove();
    }
    if (document.getElementById("info_encriptado")) {
        document.getElementById("info_encriptado").remove();
    }

});

// reset = coloca en blanco todo el formulario
const reset_btn = document.getElementById("reset");
reset_btn.addEventListener('click', reset);

// creo la función fuera del EventListener porque en algún momento puedo necesitar llamarla desde fuera del botón
function reset() {
    document.getElementById("form").reset();
    document.getElementById("name").disabled = false; // me aseguro de que el botón esté habilitado
    document.getElementById("password").type = "hidden";
}

// empty_btn = vacía la memoria del navegador (localStorage)
const empty_storage_btn = document.getElementById("empty");
empty_storage_btn.addEventListener('click', function() {

    storage = getLocalStorage();
    let answer;

    if (storage.length > 0) {

        if (storage.length === 1) {
            answer = window.confirm("¿Estás seguro de que quieres borrar 1 fichero de la memoria del navegador?");
        } else if (storage.length > 1) {
            answer = window.confirm("¿Estás seguro de que quieres borrar " + storage.length + " ficheros de la memoria del navegador?");
        }

        if (answer) {
            localStorage.clear();
            reset();
            location.reload();
        } else {
            location.reload();
        }
    } else {
        alert("La memoria ya está vacía");
    }
});

// elimina el card seleccionado del LocalStorage, se lanza desde la función display 
function delete_btn() {
    // recojo todos los botones con clase 'js-button' en un Array, 'js-button' solo se ha creado para esta función
    const delete_card_btns = document.getElementsByClassName('js-delete');

    if (delete_card_btns != null) {

        Array.from(delete_card_btns).forEach(function(delete_card_btn) {
            delete_card_btn.addEventListener('click', function() {

                let _id = delete_card_btn.value;
                localStorage.removeItem(_id);
                location.reload();

            });
        });
    }
}

// edita la información del LocalStorage, se lanza desde la función display, dentro se crean más botones...
function edit_btn() {

    // recojo todos los botones con clase 'js-button' en un Array, 'js-button' solo se ha creado para esta función
    const edit_btns = document.getElementsByClassName('js-button');

    if (edit_btns != null) {

        Array.from(edit_btns).forEach(function(edit_btn) {
            edit_btn.addEventListener('click', function() {

                reset(); // dejo a 0 el formulario

                // el <button></button> con clase js-button tiene guardado en el valor el id
                let _id = edit_btn.value; // recojo el id
                let _card = JSON.parse(localStorage.getItem(_id)); // guardo todo el card
                let _resumen = _card.resumen; // saco el resumen almacenado
                let _cifrado = _card.cifrado; // saco el cifrado almacenado

                let _div = document.getElementById("i-" + _id); // identifico el botón
                let _code = document.getElementById("code-" + _id); // identifico el <code></code>

                if (_code !== null && _code.textContent !== "Fichero sin encriptar") {

                    var form_decode = document.createElement('form'); // 'var' para poder cogerla en el siguiente if
                    form_decode.setAttribute("id", "decode_form");

                    // creo <input></input> para la contraseña
                    let input_decode = document.createElement('input');
                    input_decode.setAttribute("id", "clave-input-" + _id);
                    input_decode.setAttribute("name", "clave");
                    input_decode.setAttribute("class", "inline-card-item clave");
                    input_decode.setAttribute("type", "password");
                    input_decode.setAttribute("placeholder", "Contraseña");

                    form_decode.appendChild(input_decode);


                    // sustituyo el <code></code> por el nuevo <input></input>
                    _code.parentNode.replaceChild(form_decode, _code);
                }

                if (_div !== null && _code.textContent !== "Fichero sin encriptar") {

                    // creo <button></button> con el que se enviará la clave
                    let btn_decode = document.createElement("button");
                    btn_decode.setAttribute("id", "a-editar-" + _id);
                    btn_decode.setAttribute("class", "inline-card-item");
                    btn_decode.setAttribute("type", "clave");
                    btn_decode.setAttribute("title", "Editar");
                    let btn_text = document.createTextNode("Probar");
                    btn_decode.appendChild(btn_text);

                    // creo <button></button> para volver atrás
                    let btn_cancel = document.createElement("button");
                    btn_cancel.setAttribute("id", "cancel-" + _id);
                    btn_cancel.setAttribute("class", "inline-card-item");
                    btn_cancel.setAttribute("type", "cancel");
                    btn_cancel.setAttribute("title", "Cancelar");
                    let btn_text_cancel = document.createTextNode("Atrás");
                    btn_cancel.appendChild(btn_text_cancel);

                    // creo <div></div> para poner los botones en línea
                    let div_inline = document.createElement("div");
                    div_inline.setAttribute("class", "inline-card");

                    // meto los dos botones en el <div></div>
                    div_inline.appendChild(btn_decode);
                    div_inline.appendChild(btn_cancel);

                    // sustituyo el <div></div> viejo por el nuevo <div></div> con los dos <button></button> dentro
                    _div.parentNode.replaceChild(div_inline, _div);

                    // cancelar edit/volver atrás
                    const cancel_btn = document.getElementById("cancel-" + _id); // dentro de este if porque solo funciona SI EXISTE el button con id="cancel-_id" y variables locales
                    cancel_btn.addEventListener('click', function() {

                        reset(); // vacío el formulario y lo dejo a 0

                        div_inline.parentNode.replaceChild(_div, div_inline);
                        form_decode.parentNode.replaceChild(_code, form_decode);

                        // no salta error así, no puede eliminar nada si no existe...
                        if (document.getElementById("info_encriptado")) {
                            document.getElementById("info_encriptado").remove();
                        }
                        if (document.getElementById("error_clave")) {
                            document.getElementById("error_clave").remove();
                        }
                        if (document.getElementById("error_clave_card")) {
                            document.getElementById("error_clave_card").remove();
                        }
                    });

                    // ir a editar
                    const go_edit_btn = document.getElementById('a-editar-' + _id); // dentro de este if porque solo funciona SI EXISTE el button con id="a-editar-_id" y variables locales
                    go_edit_btn.addEventListener('click', function() {

                        let _pass = document.getElementById('clave-input-' + _id).value;
                        let _descifrado = decrypt(_cifrado, _pass, _id); // función en encrypt.js

                        // únicamente si el descifrado es correcto entrará aquí, si contiene carácteres inválidos _descrifrado será === undefined
                        if (_descifrado !== undefined) {

                            let _resumen_del_descifrado = resumen(_descifrado);
                            // si los resúmenes coinciden
                            if (_resumen === _resumen_del_descifrado) {

                                if (document.getElementById("error_clave")) {
                                    document.getElementById("error_clave").remove();
                                }

                                //me aseguro que el campo de encriptar esté en "encriptar"
                                document.getElementById("encrypt").checked = true;

                                try {
                                    show(); // saco el input de la contraseña del formulario
                                } catch (e) {}

                                let _name = document.getElementById("name");
                                _name.value = _id; // escribo en el <input> con id "name" el valor que ya tiene el fichero
                                _name.disabled = true; // lo deshabilito para no poder cambiar el "key"
                                document.getElementById("description").value = _descifrado;

                                document.getElementById("password").value = '';

                            } else {

                                if (document.getElementById("error_clave_card")) {
                                    document.getElementById("error_clave_card").remove();
                                }
                                // con el if(){} me aseguro de no mostrar muchas veces el mismo mensaje de error
                                if (!document.getElementById("error_clave")) {

                                    let message = document.createElement("p");
                                    message.setAttribute("id", "error_clave");
                                    message.setAttribute("style", "color: red;");
                                    message.setAttribute("class", "error");
                                    let text_message = document.createTextNode("La clave no es correcta.");
                                    message.appendChild(text_message);

                                    let _find = document.getElementById("div-" + _id);

                                    insertAfter(message, _find); // llamo a la función de añadir en el siguiente Nodo
                                }
                            }
                        }

                    });

                }

                if (_code !== null && _code.textContent === "Fichero sin encriptar") {

                    //me aseguro que el campo de encriptar esté en "sin encriptar"
                    document.getElementById("no-encrypt").checked = true;

                    let _name = document.getElementById("name");
                    _name.value = _id; // escribo en el <input> con id "name" el valor que ya tiene el fichero
                    _name.disabled = true; // lo deshabilito para no poder cambiar el "key"
                    document.getElementById("description").value = _resumen; // escribo en el <input> el valor del resumen

                }

            });
        });
    }
}

// save_btn es necesario para guardar el texto en LocalStorage
const save_btn = document.getElementById("save");

save_btn.addEventListener('click', function() {

    let _nombre = document.getElementById("name").value;
    let _resumen = document.getElementById("description").value;

    // recojo el valor del select (radio) {si encrypt o no-encrypt}
    let _encrypt = document.querySelectorAll('input[name="select-encrypt"]');
    let selected;

    for (let encrypt of _encrypt) {
        if (encrypt.checked) {
            selected = encrypt.value;
            break;
        }
    }

    if (_nombre != '' && _resumen != '') {

        // compruebo si existe ya el key: _nombre
        if (localStorage.getItem(_nombre) === null || document.getElementById("name").disabled) {

            if (selected == "no-encrypt") {

                // creo un objeto con los valores que creo oportunos guardar
                let text = {
                    nombre: _nombre,
                    resumen: _resumen,
                    cifrado: undefined,
                    encriptado: false
                };

                // guardo el objeto en el LocalStorage
                localStorage.setItem(_nombre, JSON.stringify(text));

            } else {

                let _clave = document.getElementById("password").value;

                if (_clave != '') {

                    let _cifrado = encryptDinamic(); // función en encrypt.js
                    let _hash = resumen(_resumen);

                    // creo un objeto con los valores que creo oportunos guardar
                    let text = {
                        nombre: _nombre,
                        resumen: _hash,
                        cifrado: _cifrado,
                        encriptado: true
                    };

                    // guardo el objeto en el LocalStorage
                    localStorage.setItem(_nombre, JSON.stringify(text));



                } else {

                    if (document.getElementById("error_campos")) {
                        document.getElementById("error_campos").remove();
                    }

                    // con el if(){} me aseguro de no mostrar muchas veces el mismo mensaje de error
                    if (!document.getElementById("error_contraseña")) {

                        let message = document.createElement("p");
                        message.setAttribute("id", "error_contraseña");
                        message.setAttribute("style", "color: red;");
                        message.setAttribute("class", "error");
                        let text_message = document.createTextNode("Debes indicar una contraseña.");
                        message.appendChild(text_message);

                        document.getElementById("form").appendChild(message);
                    }
                }
            }
        } else {

            document.getElementById("name").value = '';

            // con el if(){} me aseguro de no mostrar muchas veces el mismo mensaje de error
            if (!document.getElementById("existe_key")) {

                if (document.getElementById("error_contraseña")) {
                    document.getElementById("error_contraseña").remove();
                }
                if (document.getElementById("error_campos")) {
                    document.getElementById("error_campos").remove();
                }

                let message = document.createElement("p");
                message.setAttribute("id", "error_contraseña");
                message.setAttribute("style", "color: red");
                message.setAttribute("class", "error");
                let text_message = document.createTextNode("Este nombre ya existe.");
                message.appendChild(text_message);

                document.getElementById("form").appendChild(message);
            }
        }

    } else {

        // con el if(){} me aseguro de no mostrar muchas veces el mismo mensaje de error
        if (!document.getElementById("error_campos")) {

            if (document.getElementById("error_contraseña")) {
                document.getElementById("error_contraseña").remove();
            }

            if (document.getElementById("existe_key")) {
                document.getElementById("existe_key").remove();
            }

            let message = document.createElement("p");
            message.setAttribute("style", "color: red;");
            message.setAttribute("class", "error");
            message.setAttribute("id", "error_campos");
            let text_message = document.createTextNode("Debes rellenar todos los campos.");
            message.appendChild(text_message);

            document.getElementById("form").appendChild(message);
        }

    }

});