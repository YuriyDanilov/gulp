class ContactServices {
    getAll() {
        return fetch(ContactServices.BASE_URL, {
            method: 'GET',
            headers: {
                'Authorization': 'Bearer ' + localStorage.getItem('token'),
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            }
        })
            .then(r => r.json())
            .then(r => r.contacts)
    }

    addContact(con) {
        return fetch(ContactServices.BASE_URL + 'add', {
            method: 'POST',
            headers: {
                'Authorization': 'Bearer ' + localStorage.getItem('token'),
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                type: con.type,
                value: con.value,
                name: con.name
            })
        }).then(r => r.json())
    }
}

ContactServices.BASE_URL = 'https://mag-contacts-api.herokuapp.com/contacts/';

module.exports = ContactServices;