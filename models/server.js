const express    = require('express');
const cors       = require('cors');
const fileUpload = require('express-fileupload');

const { connectDB } = require('../database/config');

class Server {
    constructor() {
        const validation = this.validateConfig();
        if (validation != null) {
            throw validation;
        }

        this.port = process.env.PORT;

        this.app    = express();

        this.path = {
            auth: '/api/auth'
        };

        // Conexion a la base de datos...
        this.connectDB();
        
        // Middlewares...
        this.middlewares();

        // Rutas de mi aplicacion...
        this.routes();
    }

    async connectDB() {
        await connectDB();
    }

    middlewares() {
        // CORS...
        this.app.use(cors());

        // Lectura y parseo del body...
        this.app.use(express.json());

        // Servir contenido estatico...
        this.app.use(express.static('public'));

        // Carga de archivos...
        this.app.use(fileUpload({
            useTempFiles    : true,
            tempFileDir     : '/tmp/',
            createParentPath: true
        }));
    }

    routes() {
        this.app.use(this.path.auth, require('../routes/auth'));
    }

    listen() {
        this.app.listen(this.port, () => {
            console.log(`Rest-Server listening at http://localhost:${this.port}`);
        });
    }

    validateConfig() {
        // Expresion regular para anaizar que strings sean enteros positivos.
        const regex = /^[0-9]*$/;

        if (!regex.test(process.env.JWT_TIMEOUT)) {
            return `El valor de la variable [JWT_TIMEOUT] debe ser numérico y no lo es: [${ process.env.JWT_TIMEOUT }]`;
        }

        return null;
    }
}

module.exports = Server;
