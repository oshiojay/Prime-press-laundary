const swagger = require('swagger-jsdoc')

const options = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'Primepress Laundry',
            version: '1.0.0',
            description: 'API documentation for Primepress Laundry'
        },
        servers: [
        {
            url: 'https://prime-press-laundary.onrender.com',
            description: 'The hosted route'
        },
        {
            url: 'http://localhost:1110',
            description: 'Localhost'
        }
        ],
        components: {
            securitySchemas: {
                bearerAuth: {
                    type: 'http',
                    scheme: 'bearer',
                    bearerFormat: 'JWT'
                }
            }
        }
    },
    apis: [
        "./docs/admin.yaml", "./docs/booking.yaml"
    ]
}

module.exports = swagger(options)