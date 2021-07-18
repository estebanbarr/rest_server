let user = null;
let socket = null;

const url = (window.location.hostname.includes('localhost'))
            ? 'http://localhost:8080/api/auth/'
            : 'http://estebanapi.net/api/auth/';

// Referencias HTML...
const btnSalir   = document.querySelector('#btnSalir');

const validateJWT = async() => {
    // Obtengo el token de la local storage...
    const token = localStorage.getItem('token') || '';

    if (token.length <= 10) {
        window.location = 'index.html';
        throw new Error("No hay token...");
    }

    // Pregunto al backend si el JWT es correcto de paso obtengo uno nuevo renovado...
    const resp = await fetch(url, {
        headers: { 'x-token': token }
    });
    const { user: userBack, jwt } = await resp.json();

    // Actualizo el JWT...
    localStorage.setItem('token', jwt);
    user = userBack;

    // Actualizo el title de la pagina...
    document.title = 'Bienvenido ' + user.name;
}

btnSalir.addEventListener('click', () => {
    localStorage.removeItem('token');
    localStorage.removeItem('google');
    window.location = 'index.html?logout=true';
});

const main = async() => {
    // Validar el jwt...
    await validateJWT();
}

main();
