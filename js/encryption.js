/* jshint esversion: 6 */
/* jshint bitwise:false */

/**
 * @author Iñaki Ruiz <ruiz.117069@e.unavarra.es>
 * @author Pedro del Pino <delpino127445@e.unavarra.es>
 */

/* encrypt.js:

disponible en gestor.html; este archivo contiene las funciones relacionadas con la encriptación, desencriptación y el resumen (hash de 32 bits)

este archivo incluye las siguientes funciones:
- encrypt() [encripta el texto con una clave indicada por el usuario]
- decrypt() [desencripta el cifrado con una clave indicada por el usuario, recoge el parámetro _id únicamente para representar un mensaje en el Nodo de HTML con id = _id]
- encryptDinamic() [dentro incluye la función encrypt() anterior, ésta logra mostrar por pantalla la encriptación a tiempo real, según se escriben carácteres en el espacio "resumen" o "contraseña"]
- pad() [se encarga de introducir cero padding automáticamente en el resultado del hash]
- resumen() [se encarga de crear un hash de 32 bits partiendo del texto plano escrito en el espacio "resumen"]

*/

// alfabeto a usar para encriptar posteriormente
const alfabeto = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'Ñ', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z', 'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'ñ', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z', 'á', 'é', 'í', 'ó', 'ú', 'ü', 'Á', 'É', 'Í', 'Ó', 'Ú', 'Ü', '0', '1', '2', '3', '4', '5', '6', '7', '8', '9', ' ', '.', ',', '¿', '?', '¡', '!', '-', '_', ';', ':', '+', '%', '&', '=', '"'];

function encrypt(text, clave) {

    // compruebo primero si existen todos los carácteres en el alfabeto
    for (let x = 0; x < clave.length; x++) {
        if (!alfabeto.includes(clave[x])) {
            document.getElementById("password").value = ''; // me aseguro de que cambie la contraseña y no se envíe con esa clave inválida
            return false; // salgo, y dejo la función sin correr
        }
    }

    let pos = 0;
    let claveNumerico = [];
    let textoNumerico = [];
    let textoCifradoArray = [];

    for (let i = 0; i < text.length; i++) {

        // compruebo el tamaño de la clave para replicarla o acortarla si hiciera falta
        if (pos > clave.length - 1) {
            pos = 0;
        }

        if (!alfabeto.includes(text[i])) {
            textoNumerico.push("x");
            claveNumerico.push("x"); // // guardo la posición numérica en el alfabeto de cada letra del texto    
        } else {
            textoNumerico.push(alfabeto.indexOf(text[i])); // // guardo la posición numérica en el alfabeto de cada letra del texto
            claveNumerico.push(alfabeto.indexOf(clave[pos])); // guardo la posición numérica en el alfabeto de cada letra de la clave
        }

        let diferencia = (textoNumerico[i] - claveNumerico[i]); // le resto al texto las posiciones que hay que desplazar indicadas por la clave

        if (diferencia >= 0 && !isNaN(diferencia)) {
            textoCifradoArray.push(alfabeto[diferencia]); // guardo la letra que corresponde, en el alfabeto, a esa posición 
        } else if (diferencia < 0 && !isNaN(diferencia)) {
            diferencia = (diferencia + alfabeto.length); // así logro un array circular...
            textoCifradoArray.push(alfabeto[diferencia]);
        } else if (isNaN(diferencia)) {
            textoCifradoArray.push(text[i]);
        }


        pos++;
    }

    // paso el Array a un string
    const textoCifrado = textoCifradoArray.join("");
    return textoCifrado;
}

function decrypt(text, clave, _id) {

    // nota: para desencriptar aplico proceso inverso a la encriptación 
    let error = false;
    // compruebo primero si existen todos los carácteres en el alfabeto
    for (let x = 0; x < clave.length; x++) {
        if (!alfabeto.includes(clave[x])) {
            document.getElementById("clave-input-" + _id).value = ''; // me aseguro de que cambie la contraseña y no se envíe con esa clave inválida
            //return false; // salgo, y dejo la función sin correr
            error = true;
            break;
        }
    }

    if (!error) {

        let pos = 0;
        let textoNumerico = [];
        let claveNumerico = [];
        let textoDescifradoArray = [];

        for (let j = 0; j < text.length; j++) {

            // compruebo el tamaño de la clave para replicarla o acortarla si hiciera falta
            if (pos > clave.length - 1) {
                pos = 0;
            }

            if (!alfabeto.includes(text[j])) {
                textoNumerico.push("x");
                claveNumerico.push("x"); // // guardo la posición numérica en el alfabeto de cada letra del texto    
            } else {
                textoNumerico.push(alfabeto.indexOf(text[j])); // // guardo la posición numérica en el alfabeto de cada letra del texto
                claveNumerico.push(alfabeto.indexOf(clave[pos])); // guardo la posición numérica en el alfabeto de la clave
            }

            let suma = (claveNumerico[j] + textoNumerico[j]); // ahora sumamos porque el desplazamiento es contrario

            if (suma < alfabeto.length && !isNaN(suma)) {
                textoDescifradoArray.push(alfabeto[suma]);
            } else if (suma >= alfabeto.length && !isNaN(suma)) {
                suma = suma - alfabeto.length;
                textoDescifradoArray.push(alfabeto[suma]);
            } else if (isNaN(suma)) {
                textoDescifradoArray.push(text[j]);
            }

            pos++;
        }

        // paso el Array a un string
        const textoDescifrado = textoDescifradoArray.join("");
        return textoDescifrado;

    } else {
        if (document.getElementById("error_clave")) {
            document.getElementById("error_clave").remove();
        }

        // con el if(){} me aseguro de no mostrar muchas veces el mismo mensaje de error
        if (!document.getElementById("error_clave_card")) {
            let message = document.createElement("p");
            message.setAttribute("id", "error_clave_card");
            message.setAttribute("style", "color: red");
            message.setAttribute("class", "error");
            let text_message = document.createTextNode("Error: algún carácter de la clave no se encuentra en el alfabeto.");
            message.appendChild(text_message);

            let _find = document.getElementById("div-" + _id);

            insertAfter(message, _find);

        }
        return;
    }

}


// muestro la encriptación automáticamente por pantalla
const input_textarea = document.getElementById("description");
const input_clave = document.getElementById("password");

input_textarea.addEventListener('keyup', encryptDinamic);
input_clave.addEventListener('keyup', encryptDinamic);

function encryptDinamic() {

    // recojo el valor del select (radio) {si encrypt o no-encrypt}
    let _encrypt = document.querySelectorAll('input[name="select-encrypt"]');
    let selected;

    for (let encrypt of _encrypt) {
        if (encrypt.checked) {
            selected = encrypt.value;
            break;
        }
    }

    if (input_clave.value != '' && input_textarea.value != '' && selected == "encrypt") {

        if (document.getElementById("_info")) {
            document.getElementById("_info").remove();
        }

        let text = input_textarea.value;
        let clave = input_clave.value;

        // llamo a la función encriptar
        let textoCifradoDinamico = encrypt(text, clave);

        // si hay algún error en los carácteres de la clave, textoCifradoDinamico devuelve "false"
        if (textoCifradoDinamico === false) {

            // con el if(){} me aseguro de no mostrar muchas veces el mismo mensaje de error
            if (!document.getElementById("error_clave")) {

                if (document.getElementById("info_encriptado")) {
                    document.getElementById("info_encriptado").remove();
                }

                let message = document.createElement("p");
                message.setAttribute("id", "error_clave");
                message.setAttribute("style", "color: red");
                message.setAttribute("class", "error");

                let text_message = document.createTextNode("Error: algún carácter de la clave no se encuentra en el alfabeto.");
                message.appendChild(text_message);

                document.getElementById("form").appendChild(message);
            }

        } else {
            // con el if(){} me aseguro de no mostrar muchas veces el mismo mensaje de error
            if (!document.getElementById("info_encriptado")) {
                if (document.getElementById("error_clave")) {
                    document.getElementById("error_clave").remove();
                }
                if (document.getElementById("error_campos")) {
                    document.getElementById("error_campos").remove();
                }
                let message = document.createElement("p");
                message.setAttribute("id", "info_encriptado");
                message.setAttribute("style", "color: rgb(91, 148, 235)");
                message.setAttribute("class", "error");
                let text_message = document.createTextNode("El texto encriptado es: " + textoCifradoDinamico);
                message.appendChild(text_message);

                document.getElementById("form").appendChild(message);

            } else {
                // como existe el id, lo borro y creo uno nuevo encima
                document.getElementById("info_encriptado").remove();

                if (document.getElementById("error_clave")) {
                    document.getElementById("error_clave").remove();
                }
                if (document.getElementById("error_campos")) {
                    document.getElementById("error_campos").remove();
                }

                let message = document.createElement("p");
                message.setAttribute("id", "info_encriptado");
                message.setAttribute("style", "color: rgb(91, 148, 235)");
                message.setAttribute("class", "error");
                let text_message = document.createTextNode("El texto encriptado es: " + textoCifradoDinamico);
                message.appendChild(text_message);

                document.getElementById("form").appendChild(message);
            }

            return textoCifradoDinamico;
        }

    } else if (selected == "encrypt" && input_clave.value == '' && input_textarea.value == '') {


        // borro el span si existe para luego crear otro encima
        if (document.getElementById("info_encriptado")) {
            document.getElementById("info_encriptado").remove();
        }

        if (document.getElementById("_info")) {
            document.getElementById("_info").remove();
        }

        if (!document.getElementById("_info")) {
            let message = document.createElement("p");
            message.setAttribute("id", "_info");
            message.setAttribute("style", "color: red");
            message.setAttribute("class", "error");
            let text_message = document.createTextNode("Error: es necesario un resumen y una contraseña para encriptar.");
            message.appendChild(text_message);

            document.getElementById("form").appendChild(message);
        }
    }
}

// función para hacer zero padding dinámico en el resumen()
function pad(hash, length) {

    let hashHexPad = '' + hash;
    while (hashHexPad.length < length) {
        hashHexPad = '0' + hashHexPad;
    }
    hashHexPad = '0x' + hashHexPad;

    return hashHexPad;

}

// compruebo si son iguales
function resumen(text) {

    let hash = 0;
    for (let i = 0; i < text.length; i++) {
        let res_uno = (hash << 5);
        let res_dos = res_uno - hash;
        let res_tres = res_dos + text.charCodeAt(i);
        hash = Math.abs(res_tres | 0); // '| 0' fuerza a ser 32 bits
    }
    //hash = '0x00' + (hash + 0x10000).toString(16).substr(-4).toUpperCase();
    hash = hash.toString(16).toUpperCase(); // paso a formato hexadecimal
    let hashHex = pad(hash, 8); // introduzo 8 porque son los números después de 0x que deben aparecer

    return hashHex;
}