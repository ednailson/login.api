var ObjectID = require('mongodb').ObjectID

module.exports = function(app, db) {
	app.get('/users/:id', (req, res) => {
		const id = req.params.id;
		const details = {'_id': new ObjectID(id) };
		db.collection('users').findOne(details, (err, item) => {
			if (err) {
				res.send({ 'error': 'Ocorreu um erro' });
			} else {
				res.send("Usuario: " + item);
			}
		});
	});

	app.delete('/users/:id', (req, res) => {
		const id = req.params.id;
		const details = {'_id': new ObjectID(id) };
		db.collection('users').remove(details, (err, item) => {
			if (err) {
				res.send({ 'error': 'Ocorreu um erro' });
			} else {
				res.send('Usuario ' + id + ' deletado!');
			}
		});
	});

	app.put('/users/:id', (req, res) => {
		const id = req.params.id;
		const details = {'_id': new ObjectID(id) };
		const user = { text: req.body.body, title: req.body.title };
		db.collection('users').update(details, user, (err, item) => {
			if (err) {
				res.send({ 'error': 'Ocorreu um erro' });
			} else {
				res.send(item);
			}
		});
	});

	app.post('/users', (req, res) => {
		const user = req.body;
		db.collection('users').insert(user, (err, result) => {
			if (err) {
				res.send({ 'error': 'Ocorreu um erro' });
			} else {
				res.send(result.ops[0]);
			}
		});
	});
};
