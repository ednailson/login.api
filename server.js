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

//Pasta: WWW
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
        // se não há usuário e/ou senha
        console.log('Usuario e/ou senha faltando');
        // resposta
        res.json({
            success: false,
            msg: 'Passe usuario e senha'
        });
    } else {
        // inserindo informações do 'request' a 'newUser' para salva-lo no banco
        let newUser = new User({
            name: req.body.name,
            password: req.body.password,
            email: req.body.email,
            about: req.body.about,
            age: req.body.age,
            active: true,
            phone: req.body.phone
        });
        // salvando newUser
        newUser.save(function(err) {
            if (err) {
                //indica que o usuário já existe, o que não pode ocorrer.
                return res.json({
                    success: false,
                    msg: 'Usuario ja existente'
                });
            } else {
                // sucesso ao criar o usuário
                res.json({
                    success: true,
                    msg: 'Usuario criado com sucesso'
                });
            }
        });
    }
});

//Autenticação (verificação do usuário e da senha)
apiRoutes.post('/authenticate', function(req, res) {
    //verificando se há algum usuário com o usuário enviado
    User.findOne({
        name: req.body.name
    }, function(err, user) {
        //se houve algum erro
        if (err) throw err;
        //verificando se o usuário foi encontrado, se não, entra nesse if
        if (!user) {
            res.send({
                success: false,
                msg: 'Usuário não encontrado'
            });
        } else {
            // verificando se as senhas coincidem, isso é feito no metodo comparePassword em user.js
            user.comparePassword(req.body.password, function(err, isMatch) {
                if (isMatch && !err) {
                    // se as senhas se coincidem nós criamos uma token, para o acesso na api
                    let token = jwt.encode(user, config.secret);
                    // retorna a token e a informação que a autenticação foi realizada com sucesso
                    res.json({
                        success: true,
                        token: 'JWT ' + token
                    });
                } else {
                    //caso a senha informada não coincida
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

    //separando a token
    let token = getToken(req.headers);

    // se alguma token foi enviada
    if (token) {

        //descodificando a token, verificando-a e dando a 'decoded' todas as informações do usuário referente a tal token
        let decoded = jwt.decode(token, config.secret);
        //verificando se existe o usuário
        User.findOne({
            name: decoded.name
        }, function(err, user) {
            if (err) throw err;
            //caso o usuário não seja encontrado
            if (!user) {
                return res.status(403).send({
                    success: false,
                    msg: 'Falha na autenticação!'
                });
            } else {
                //se o usuário foi encontrado nós verificamos aqui se ele está ativo
                if (user.active) {
                    //caso o usuário esteja ativo nós retornamos suas informações
                    res.json({
                        success: true,
                        msg: 'Bem vindo a area dos membros' + user.name + '!',
                        user: user
                    });
                }
                else{
                  //caso o usuário esteja inativo
                  res.json({
                      success: true,
                      msg: 'Usuario ' + user.name + ' está inativo! Ative-o para buscar suas informações'
                  });
                }
            }
        });
    } else {
        //caso nenhuma token tenha sido enviada
        return res.status(403).send({
            success: false,
            msg: 'Nenhuma token foi enviada'
        });
    }
});


//inativando usuário
apiRoutes.post('/inactivate', passport.authenticate('jwt', {
    session: false
}), function(req, res) {
  //separando a token
    let token = getToken(req.headers);

    //verificando se alguma token foi enviada
    if (token) {
        //descodificando a token, verificando-a e dando a 'decoded' todas as informações do usuário referente a tal token
        let decoded = jwt.decode(token, config.secret);
        //verificando o usuário
        User.findOne({
            name: decoded.name
        }, function(err, user) {
            if (err) throw err;
            //verificando se o usuário foi encontrado
            if (!user) {
                // se não enviamos a falha de autenticação pois a token enviada não é referente a nenhum usuário
                return res.status(403).send({
                    success: false,
                    msg: 'Falha na autenticação!'
                });
            } else {
                // caso a token é referente ao usuário nós inativamos ele
                user.active = false;
                //e salvamos-o
                user.save(function() {
                    return res.status(200).send({
                        success: true,
                        msg: 'Usuário foi inativado' + user
                    });
                });
            }
        });
    } else {
        //caso nenhuma token tenha sido enviada
        return res.status(403).send({
            success: false,
            msg: 'Nenhuma token foi enviada'
        });
    }
});


//inativando usuário
apiRoutes.post('/active', passport.authenticate('jwt', {
    session: false
}), function(req, res) {
  //separando a token
    let token = getToken(req.headers);

    //verificando se alguma token foi enviada
    if (token) {
        //descodificando a token, verificando-a e dando a 'decoded' todas as informações do usuário referente a tal token
        let decoded = jwt.decode(token, config.secret);
        //verificando o usuário
        User.findOne({
            name: decoded.name
        }, function(err, user) {
            if (err) throw err;
            //verificando se o usuário foi encontrado
            if (!user) {
                // se não enviamos a falha de autenticação pois a token enviada não é referente a nenhum usuário
                return res.status(403).send({
                    success: false,
                    msg: 'Falha na autenticação!'
                });
            } else {
                // caso a token é referente ao usuário nós inativamos ele
                user.active = true;
                //e salvamos-o
                user.save(function() {
                    return res.status(200).send({
                        success: true,
                        msg: 'Usuário foi inativado' + user
                    });
                });
            }
        });
    } else {
        //caso nenhuma token tenha sido enviada
        return res.status(403).send({
            success: false,
            msg: 'Nenhuma token foi enviada'
        });
    }
});

apiRoutes.put('/edit', passport.authenticate('jwt', {
    session: false
}), function(req, res) {
  //separando a token
    let token = getToken(req.headers);
    if (token) {
        //descodificando a token, verificando-a e dando a 'decoded' todas as informações do usuário referente a tal token
        let decoded = jwt.decode(token, config.secret);
        //procurando o usuário referente a token
        User.findOne({
            name: decoded.name
        }, function(err, user) {
            if (err) throw err;
            if (!user) {
                //caso a token não seja referente a nenhum usuário
                return res.status(403).send({
                    success: false,
                    msg: 'Falha na autenticação!'
                });
            } else {
                //atribuindo os atributos ao usuário referente a token
                //o if é para verificar se tal atributo foi passado, se não, o usuário não é editado em tal atributo
                if (req.body.email) user.email = req.body.email;
                if (req.body.about) user.about = req.body.about;
                if (req.body.age) user.age = req.body.age;
                if (req.body.phone) user.phone = req.body.phone;
                //salvando o usuário com as novas informações
                user.save(function() {
                    return res.status(200).send({
                        success: true,
                        msg: 'Usuário ' + user.name + ' foi editado'
                    });
                });
            }
        });
    } else {
        //caso nenhuma token tenha sido enviada
        return res.status(403).send({
            success: false,
            msg: 'Nenhuma token foi enviada'
        });
    }
});

//função para separar a token, já que ela vem com o JWT antes
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
