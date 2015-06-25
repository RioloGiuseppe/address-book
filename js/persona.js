Persona = function(nome) {
	var _nome, _cognome, _data, _matricola, _indirizzo, _emails, _telefoni;

	function addind(n){
		_indirizzo.push(n);
	}
	function addemaill(n){
		_emails.push(n);
	}
	function _addtelefono(n){
		_telefoni.push(n);
	}

	this.nome=nome;
	this._indirizzo = [];
	this._emails = [];
	this._telefoni = [];

	return {
		Nome: this._nome,
		Cognome: this._cognome,
		Data: this._data,
		Matricola: this._matricola,
		Indirizzi: this._indirizzo,
		Email: this._emails,
		Telefoni: this._telefoni,
		addIndirizzo: function(indirizzo) {
			addind(indirizzo);
		},	
		addEmail: function(email) {
			addemaill(email);
		},	
		addTelefono: function(telefono) {
			_addtelefono(telefono);
		},	
		toString: function() {
			return JSON.stringify(this);
		}
	}
};