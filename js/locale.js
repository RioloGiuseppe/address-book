Locale = function(l) {
	var lcl = this;
	var langs = [];
	lcl.data = {};
	langs["it"]= {
		title:"Rubrica",
		contacts: "Contatti",
		export: "Esporta",
		import: "Importa",
		new: "Nuovo",
		close: "Chiudi",
		save: "Salva",
		delete: "Elimina",
		search: "Cerca",
		details: "Dettagli",
		name: "Nome:",
		surname: "Cognome:",
		id: "Matricola:",
		birthday: "Data di nascita:",
		addresses: "Indirizzi:",
		telephones: "Telefoni:",
		emails: "E-mail:",
		error: "Si è verificato un errore!",
		searchTooltip: "Inserisci nome, cognome o parti di essi.",
		messageWarning: "Rubrica - Attenzione",
		messageInfo: "Rubrica - Info",
		messageSearchBody: "Non è possibile inserire più di due campi di ricerca!",
		messageAddWarning: "E' possibile inserire solo un contatto per volta",
		messageSaveBodyUpdate: "Le informazioni relative all'utente {name} {surname} sono state aggiornate.",
		messageSaveBodyInsert: "L'utente {name} {surname} e' stato inserito nella lista contatti.",
		messageDeleteBodySuccess: "L'utente {name} {surname} e' stato rimosso dalla lista contatti.",
		messageDeleteBodyError: "Non e' stato trovato alcun contatto con matricola: {id}!",
		mapWarning: "Non è stato possibile trovare l'indirizzo <i>{addr}</i> sulla mappa."
	};
	langs["en"]= {
		title:"Address book",
		contacts: "Contacts",
		export: "Export",
		import: "Import",
		new: "New",
		close: "Close",
		save: "Save",
		delete: "Delete",
		search: "Search",
		details: "Details",
		name: "Name:",
		surname: "Surname:",
		id: "Id:",
		birthday: "Day of birth:",
		addresses: "Addresses:",
		telephones: "Telephones:",
		emails: "E-mails:",
		error: "An error occurred!",
		searchTooltip: "Insert name, surname or parts.",
		messageWarning: "Address Book - Warning",
		messageInfo: "Address Book - Info",
		messageSearchBody: "Non è possibile inserire più di due campi di ricerca!",
		messageAddWarning: "E' possibile inserire solo un contatto per volta",
		messageSaveBodyUpdate: "Le informazioni relative all'utente <i>{name} {surname}</i> sono state aggiornate.",
		messageSaveBodyInsert: "L'utente <i>{name} {surname}</i> e' stato inserito nella lista contatti.",
		messageDeleteBodySuccess: "L'utente <i>{name} {surname}</i> e' stato rimosso dalla lista contatti.",
		messageDeleteBodyError: "Non e' stato trovato alcun contatto con matricola: <i>{id}</i>!",
		mapWarning: "Non è stato possibile trovare l'indirizzo <i>{addr}</i> sulla mappa."
	};
	switch(l){
		case 'it': 	lcl.data = langs["it"]; break;
		default: 	lcl.data = langs["en"]; break;	
	}
}
String.prototype.applyData = function (o) {
    return this.replace(/{([^{}]*)}/g,
        function (a, b) {
            var r = o[b];
            return r;
        }
    );
}