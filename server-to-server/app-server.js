const Hapi = require('hapi');
const Oz = require('oz');
const Scarecrow = require('scarecrow');

const server = new Hapi.Server();
server.connection();

server.register(Scarecrow, (err) => {

    expect(err).to.not.exist();

    const encryptionPassword = 'password';

    const apps = {
        social: {
            id: 'social',
            scope: ['a', 'b', 'c'],
            key: 'werxhqb98rpaxn39848xrunpaw3489ruxnpa98w4rxn',
            algorithm: 'sha256'
        },
        network: {
            id: 'network',
            scope: ['b', 'x'],
            key: 'witf745itwn7ey4otnw7eyi4t7syeir7bytise7rbyi',
            algorithm: 'sha256'
        }
    };

    const grant = {
        id: 'a1b2c3d4e5f6g7h8i9j0',
        app: 'social',
        user: 'john',
        exp: Oz.hawk.utils.now() + 60000
    };

    const options = {
        oz: {
            encryptionPassword: encryptionPassword,

            loadAppFunc: function (id, callback) {

                callback(null, apps[id]);
            },

            loadGrantFunc: function (id, callback) {

                const ext = {
                    public: 'everybody knows',
                    private: 'the the dice are loaded'
                };

                callback(null, grant, ext);
            }
        }
    };

    // Add strategy

    server.auth.strategy('oz', 'oz', true, options);

    // Add a protected resource

    server.route({
        path: '/protected',
        method: 'GET',
        config: {
            auth: {
                entity: 'user'
            },
            handler: function (request, reply) {

                reply(request.auth.credentials.user + ' your in!');
            }
        }
    });

    server.start(function(a) {
      console.log(a)
    });
  });
