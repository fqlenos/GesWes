/* jshint esversion: 6 */
/* jshint bitwise:false */

/**
 * @author Iñaki Ruiz <ruiz.117069@e.unavarra.es>
 * @author Pedro del Pino <delpino127445@e.unavarra.es>
 */

/* index.js:

únicamente disponible en index.html.

{ siempre que se haga scroll en la página web, mediante window.onscroll se lanza la función shrink }

este archivo incluye las siguientes funciones:
- shrink => fija o elimina los apellidos de los autores de la página web

*/

let doMore = true; // le doy valor 'true' para que se cumpla la primera condición
let doLess = true; // le doy valor 'true' para que se cumpla la primera condición

function shrink() {

    if (window.scrollY >= 180 && doMore) {

        // cuando el eje Y de la página web sobrepase 180px se accede (&& true)
        let li = document.createElement('li');
        li.setAttribute('class', 'nav-center');
        li.setAttribute('id', 'middle');

        let a = document.createElement('a');
        a.setAttribute("class", "button");
        a.setAttribute("href", "#jumbotron");
        let a_text = document.createTextNode("del Pino Gómez + Ruiz Manzanos");
        a.appendChild(a_text);

        li.appendChild(a);

        document.getElementById("nav-ul").appendChild(li);
        doMore = false; // así ya no es capaz de entrar de nuevo aquí hasta que no entre en la función opuesta
        doLess = true;

    } else if (window.scrollY < 180 && doLess) {

        if (document.getElementById("middle")) {
            document.getElementById("middle").remove();
        }

        doLess = false; // así ya no es capaz de entrar de nuevo aquí hasta que no entre en la función opuesta
        doMore = true;
    }
}

window.onscroll = shrink;