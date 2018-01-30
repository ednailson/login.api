const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const morgan = require('morgan');
const mongoose = require('mongoose');
const passport = require('passport');
const config = require('./config/database'); // Config do banco
const User = require('./app/models/user'); // get the mongoose model
const port = process.env.PORT || 8080;
const jwt = require('jwt-simple');

app.use(bodyParser.urlencoded({
    extended: false
}));
app.use(bodyParser.json());

// log to console
app.use(morgan('dev'));

// Passport para a senha
app.use(passport.initialize());

// rota de demostração (GET http://localhost:8080)
// app.get('/', function(req, res) {
//   res.send('A API está em http://localhost:' + port + '/api');
// });

//Pasta front-end: WWW
app.use('/', express.static(__dirname + '/www'));


// conectando com o banco
mongoose.connect(config.database);

// configuração para passport
require('./config/passport')(passport);

// rotas
let apiRoutes = express.Router();



// CADASTRO
apiRoutes.post('/signup', function(req, res) {
    if (!req.body.name || !req.body.password) {
        console.log('Usuario e/ou senha faltando');
        res.json({
            success: false,
            msg: 'Passe usuario, email e senha'
        });
    } else {
        let newUser = new User({
            name: req.body.name,
            password: req.body.password,
            email: req.body.email,
            about: req.body.about,
            age: req.body.age,
            active: true,
            phone: req.body.phone
        });
        // save the user
        newUser.save(function(err) {
            if (err) {
                return res.json({
                    success: false,
                    msg: 'Usuario ja existente'
                });
            } else {
                res.json({
                    success: true,
                    msg: 'Usuario criado com sucesso'
                });
            }
        });
    }
});


apiRoutes.post('/authenticate', function(req, res) {
    User.findOne({
        name: req.body.name
    }, function(err, user) {
        if (err) throw err;

        if (!user) {
            res.send({
                success: false,
                msg: 'Usuário não encontrado'
            });
        } else {
            // check if password matches
            user.comparePassword(req.body.password, function(err, isMatch) {
                if (isMatch && !err) {
                    // if user is found and password is right create a token
                    let token = jwt.encode(user, config.secret);
                    // return the information including token as JSON
                    res.json({
                        success: true,
                        token: 'JWT ' + token
                    });
                } else {
                    res.send({
                        success: false,
                        msg: 'Senha incorreta!'
                    });
                }
            });
        }
    });
});

apiRoutes.get('/userinfo', passport.authenticate('jwt', {
    session: false
}), function(req, res) {
    let token = getToken(req.headers);
    if (token) {
        let decoded = jwt.decode(token, config.secret);
        User.findOne({
            name: decoded.name
        }, function(err, user) {
            if (err) throw err;

            if (!user) {
                return res.status(403).send({
                    success: false,
                    msg: 'Falha na autenticação!'
                });
            } else {
                if (user.active) {
                    res.json({
                        success: true,
                        msg: 'Bem vindo a area dos membros' + user.name + '!',
                        user: user
                    });
                }
                else{
                  res.json({
                      success: true,
                      msg: 'Usuario ' + user.name + ' está inativo! Ative-o para buscar suas informações'
                  });
                }
            }
        });
    } else {
        return res.status(403).send({
            success: false,
            msg: 'Nenhuma token foi enviada'
        });
    }
});

apiRoutes.put('/inactivate', passport.authenticate('jwt', {
    session: false
}), function(req, res) {
    let token = getToken(req.headers);
    if (token) {
        let decoded = jwt.decode(token, config.secret);
        User.findOne({
            name: decoded.name
        }, function(err, user) {
            if (err) throw err;
            if (!user) {
                return res.status(403).send({
                    success: false,
                    msg: 'Falha na autenticação!'
                });
            } else {
                user.active = false;
                user.save(function() {
                    return res.status(200).send({
                        success: true,
                        msg: 'Usuário foi inativado' + user
                    });
                });
            }
        });
    } else {
        return res.status(403).send({
            success: false,
            msg: 'Nenhuma token foi enviada'
        });
    }
});


apiRoutes.put('/edit', passport.authenticate('jwt', {
    session: false
}), function(req, res) {
    let token = getToken(req.headers);
    if (token) {
        let decoded = jwt.decode(token, config.secret);
        User.findOne({
            name: decoded.name
        }, function(err, user) {
            if (err) throw err;
            if (!user) {
                return res.status(403).send({
                    success: false,
                    msg: 'Falha na autenticação!'
                });
            } else {
                if (req.body.email) user.email = req.body.email;
                if (req.body.about) user.about = req.body.about;
                if (req.body.age) user.age = req.body.age;
                if (req.body.phone) user.phone = req.body.phone;
                user.save(function() {
                    return res.status(200).send({
                        success: true,
                        msg: 'Usuário ' + user.name + ' foi editado'
                    });
                });
            }
        });
    } else {
        return res.status(403).send({
            success: false,
            msg: 'Nenhuma token foi enviada'
        });
    }
});


getToken = function(headers) {
    if (headers && headers.authorization) {
        let parted = headers.authorization.split(' ');
        if (parted.length === 2) {
            return parted[1];
        } else {
            return null;
        }
    } else {
        return null;
    }
};

// connect the api routes under /api/*
app.use('/api', apiRoutes);

// Start the server
app.listen(port);
console.log('A mágica está acontecendo em http://localhost:' + port);
