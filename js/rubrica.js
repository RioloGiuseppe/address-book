Rubrica = function() {
	var _persona;//, _cognome, _data, _matricola, _indirizzo, _emails, _telefoni;
	this._persona = [];

	function _cerca(k){
		var ps = [];
		var keys = k.split(" ");
		if (keys.length>2){
			throw "Non è possibile inserire più di due campi di ricerca!"
		}
		else {
			for (i=0; i<this._persona.length;i++){
				if((this._persona[i].Nome.toLowerCase().startsWith(keys[0]) && 
					this._persona[i].Cognome.toLowerCase().startsWith(keys[1]))||
					(this._persona[i].Nome.toLowerCase().startsWith(keys[1]) && 
					this._persona[i].Cognome.toLowerCase().startsWith(keys[0]))){
						ps.push(this._persona[i]);
				}
			}
		}
		return ps;
	}
	
	return {
		Persone: this._persona,
		Cerca: function(key){
			return _cerca(key);
		}
	}
};