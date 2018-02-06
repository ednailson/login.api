# KOFRE nTopus

> API para login

### Requisitos

#### [Docker](https://docs.docker.com/install/)
É necessário possuir [docker](https://docs.docker.com/install/) e [docker-compose](https://docs.docker.com/compose/install/)

### Running

``` bash
docker-compose up
```

#### Servidor rodando em http://localhost:8080/

### API Acesso

#### Cadastro de Usuário
##### metodo: POST

http://localhost:8080/api/signup

``` bash
# BODY KEYS
name: String
password: String
email: String
about: String
age: Int
phone: String
```

#### Autenticação
##### metodo: POST

http://localhost:8080/api/authenticate

``` bash
# INPUT BODY KEYS
name: String
password: String
```
``` bash
# OUTPUT
success: Boolean
token: String
```

A `token` será necessária para pegar **informações** do usuário, então, se isto desejar salve toda a `token`

#### Usuário informações
##### metodo: GET

http://localhost:8080/api/userinfo

``` bash
# HEARDER KEY
Authorization
# VALUE
token (gerada na autenticação)
```
``` bash
# OUTPUT
success: Boolean
msg: String
user: JSON
```

#### Inativando Usuários e Ações
##### metodo: POST

http://localhost:8080/api/inactivate/user - Inativa usuário

http://localhost:8080/api/inactivate/post - Inativa a ação de post

http://localhost:8080/api/inactivate/sendEmail - Inativa a ação de enviar e-mail

http://localhost:8080/api/inactivate/edit - Inativa a ação de editar o usuário

``` bash
# HEARDER KEY
Authorization
# VALUE
token (gerada na autenticação)
```

#### Ativando Usuários e Ações
##### metodo: POST

http://localhost:8080/api/active/user - Ativa usuário

http://localhost:8080/api/active/post - Ativa a ação de post

http://localhost:8080/api/active/sendEmail - Ativa a ação de enviar e-mail

http://localhost:8080/api/active/edit - Ativa a ação de editar o usuário

``` bash
# HEARDER
# KEY
Authorization
# VALUE
token (gerada na autenticação)
```

#### Editando usuário
##### metodo: PUT

http://localhost:8080/api/edit

``` bash
# BODY KEYS
email: String
about: String
age: String
phone: String
# HEARDER
# KEY
Authorization
# VALUE
token (gerada na autenticação)
```

### Desenvolvedor

[Júnior](https://www.github.com/juniorvbc)

#### Versão

0.4.0
