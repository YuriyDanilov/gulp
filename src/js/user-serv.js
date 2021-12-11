const User = require('./user')

class UserServices {

    getAll() {
        return fetch(UserServices.BASE_URL + 'users')
            .then(response => response.json())
            .then(response => response.users)
            .then(users => users.map(user => User.create(user)));
    }

    register(user) {
        return fetch(UserServices.BASE_URL + 'register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                login: user.login,
                date_born: user.bornDate,
                password: user.password
            })
        }).then(response => response.json())
    }

    login(user) {
        return fetch(UserServices.BASE_URL + 'login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                login: user.login,
                password: user.password
            })
        }).then(response => response.json());
    }
}
UserServices.BASE_URL = 'https://mag-contacts-api.herokuapp.com/';

module.exports = UserServices;