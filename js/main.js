/* jshint esversion: 6 */
/* jshint bitwise:false */

/**
 * @author Iñaki Ruiz <ruiz.117069@e.unavarra.es>
 * @author Pedro del Pino <delpino127445@e.unavarra.es>
 */

/* main.js:

el archivo principal de la página web, disponible en gestor.html.
[ principal junto con buttons.js ]

{ siempre que se cargue la página web mediante window.onload se lanza la función display }

este archivo incluye las siguientes funciones:
- insertAfter() [incluye Nodos detrás de otro Nodo]
- getLocalStorage() [recoge toda la información del LocalStorage]
- display() [se lanza automáticamente y presenta toda la información del LocalStorage, así como llama a otras funciones]

*/

// creo función para insertar Nodo después de un Nodo previo
function insertAfter(nodo_nuevo, nodo_referencia) {
    nodo_referencia.parentNode.insertBefore(nodo_nuevo, nodo_referencia.nextSibling);
}

// recoger toda la info de LocalStorage
function getLocalStorage() {

    reset(); // vacío el formulario

    let storage = [];
    const ids = Object.keys(localStorage); // Object.keys() muestra todas las "key"-s de un objeto rápidamente

    let id;
    for (let num = 0; num < ids.length; num++) {
        id = ids[num];
        storage.push(localStorage.getItem(id));
    }
    storage = storage.sort(); // reordena el array para luego mostrar alfabéticamente ordenado
    return storage; // devuelve un Array con el LocalStorage en él
}

// se lanza solo al cargar la página web; saca por pantalla el LocalStorage...
function display() {

    // siempre que la URL no esté limpia => la borro {el método get del form 'ensucia' la URL con parámetros}
    if ((location.href).includes("?")) {
        window.location.href = location.href.split("?")[0]; // posterior a ? son parámetros
    }

    // recojo toda la información de LocalStorage con la función definida antes
    let storage = getLocalStorage();

    if (storage.length != 0) {
        for (let i = 0; i < storage.length; i++) {

            // creo el nuevo html a mostrar en gestor.html
            // creo <div></div> necesarios con sus clases
            let div_card = document.createElement("div");
            div_card.setAttribute("class", "card");

            let div_container = document.createElement("div");
            div_container.setAttribute("class", "container");

            // creo nuevo <h4></h4> y le inserto texto (el nombre de un Array[i])
            let h4 = document.createElement("h4");
            let text_h4 = document.createTextNode(JSON.parse(storage[i]).nombre);
            h4.appendChild(text_h4);

            // creo nuevo <p></p> y le inserto texto (el texto guardado de un Array[i])
            let p = document.createElement("p");
            p.setAttribute("class", "resumen");
            let text_p = document.createTextNode(JSON.parse(storage[i]).resumen);
            p.appendChild(text_p);

            // creo un <div></div> más para crear un bloque inline y le meto los dos tags siguientes: <code></code> y <button></button>
            let div_inline_card = document.createElement("div");
            div_inline_card.setAttribute("class", "inline-card");
            div_inline_card.setAttribute("id", "div-" + JSON.parse(storage[i]).nombre);

            // creo un <code></code>
            let code = document.createElement("code");
            code.setAttribute("id", "code-" + JSON.parse(storage[i]).nombre);
            code.setAttribute("class", "inline-card-item js-code");
            code.setAttribute("value", JSON.parse(storage[i]).nombre);

            // creo el <button></button>
            let button_editar = document.createElement("button");
            button_editar.setAttribute("id", JSON.parse(storage[i]).nombre); // el nombre es único así que lo uso como id
            button_editar.setAttribute("class", "inline-card-item");
            button_editar.setAttribute("type", "edit");
            button_editar.setAttribute("title", "Edita el texto de este fichero");
            button_editar.setAttribute("value", JSON.parse(storage[i]).nombre); // de esta forma lo puedo recoger para editar

            let button_delete = document.createElement("button");
            button_delete.setAttribute("id", "delete"); // el nombre es único así que lo uso como id
            button_delete.setAttribute("class", "js-delete inline-card-item");
            button_delete.setAttribute("type", "cancel");
            button_delete.setAttribute("title", "Elimina este fichero");
            button_delete.setAttribute("value", JSON.parse(storage[i]).nombre); // de esta forma lo puedo recoger para editar
            let text_del = document.createTextNode("Eliminar");
            button_delete.appendChild(text_del);

            // comprobamos si el valor "encriptado" devuelve 'true' o 'false'
            if (JSON.parse(storage[i]).encriptado) {
                let text_code = document.createTextNode("Fichero encriptado");
                code.appendChild(text_code);

                let button_text = document.createTextNode("Ver");
                button_editar.setAttribute("class", "js-button inline-card-item desencriptar");
                button_editar.appendChild(button_text);

            } else {
                let text_code = document.createTextNode("Fichero sin encriptar");
                code.appendChild(text_code);

                let button_text = document.createTextNode("Editar");
                button_editar.setAttribute("class", "js-button inline-card-item");
                button_editar.appendChild(button_text);
            }

            // creo otro <div></div> para poner los botones en línea
            let div_inline = document.createElement("div");
            div_inline.setAttribute("id", "i-" + JSON.parse(storage[i]).nombre);
            div_inline.setAttribute("class", "inline-card");

            // meto los dos botones en el <div></div>
            div_inline.appendChild(button_editar);
            div_inline.appendChild(button_delete);

            // introduzco los dos tags
            div_inline_card.appendChild(code);
            div_inline_card.appendChild(div_inline);

            // añado los nuevos tags html al <div></div> inicial paso a paso
            div_container.appendChild(h4);
            div_container.appendChild(p);
            div_container.appendChild(div_inline_card);
            div_card.appendChild(div_container);

            // finalmente, presento en pantalla los resultados
            document.getElementById("navigator").appendChild(div_card);

            // llamo a la función para editar (se queda a la escucha de 'click'-s)
            edit_btn();
            delete_btn();
        }

    } else {

        // creo una plantilla para cuando el LocalStorage esté vacío del mismo método que antes
        let div_card = document.createElement("div");
        div_card.setAttribute("class", "card");

        let div_container = document.createElement("div");
        div_container.setAttribute("class", "container");

        let h4 = document.createElement("h4");
        let text_h4 = document.createTextNode("No hay ningún fichero guardado en memoria.");
        h4.appendChild(text_h4);

        let p = document.createElement("p");
        let text_p = document.createTextNode("Los ficheros guardados en el navegador se mostrarán aquí automáticamente.");
        p.appendChild(text_p);

        let p_next = document.createElement("p");
        let text_p_next = document.createTextNode("Para ello, simplemente tendrás que rellenar los campos del formulario con los valores que tú desees para verlos aquí almacenados automáticamente.");
        p_next.appendChild(text_p_next);

        let p_next_again = document.createElement("p");
        let text_p_next_again = document.createTextNode('Si seleccionas la opción "Sin encriptar", guardará el fichero como un texto plano; por otro lado, si seleccionas la opción "Encriptar", se guardará el fichero encriptado tal y como se explica en la ');
        let _span = document.createElement("span");
        let _a = document.createElement("a");
        _a.setAttribute("href", "index.html#more");
        let text_a = document.createTextNode("página principal.");
        _a.appendChild(text_a);
        _span.appendChild(_a);
        p_next_again.appendChild(text_p_next_again);
        p_next_again.appendChild(_span);

        div_container.appendChild(h4);
        div_container.appendChild(p);
        div_container.appendChild(p_next);
        div_container.appendChild(p_next_again);
        div_card.appendChild(div_container);

        document.getElementById("navigator").appendChild(div_card);
    }
}

// con window.onload cargo la función que desee al cargar la página
window.onload = display;