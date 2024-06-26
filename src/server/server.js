require('dotenv').config();

const Hapi = require('@hapi/hapi');
const routes = require('../server/routes');
const InputError = require('../exceptions/InputError');

const init = async () => {
    const server = Hapi.server({
        port: 3000,
        host: process.env.NODE_ENV !== 'production' ? 'localhost': '0.0.0.0',
        routes: {
            cors: {
                origin: ['*'],
            },
        },

    });
    
    server.route(routes);

    server.ext('onPreResponse', function (request, h) {
        const response = request.response;

        if (response instanceof InputError) {
            const newResponse = h.response({
                statusCode: 400,
                status: 'fail',
                message: 'Something is wrong !'
            })
            newResponse.code(400)
            return newResponse;
        }

        if (response.isBoom) {
            const newResponse = h.response({
                status: 'fail',
                message: response.message
            })
            newResponse.code(response.output.statusCode)
            return newResponse;
        }

        return h.continue;
    });


    await server.start();
    console.log('Server running on %s', server.info.uri);
};

process.on('unhandledRejection', (err) => {
    console.log(err);
    process.exit(1);
});

init();