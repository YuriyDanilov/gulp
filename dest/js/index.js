(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
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
},{}],2:[function(require,module,exports){
const ContactServices = require('./cont-serv');
const LoginForm = require('./log-form');
const UserServices = require('./user-serv');

class Contact {
    constructor(value, name, type, id) {
        this.value = value;
        this.name = name;
        this.type = type;
        this.id = id;
    }

    createContact(contact) {
        let contactElem = document.createElement('div');
        contactElem.classList.add('contact-item');
        contactElem.dataset.index = contact.id;
        contactElem.insertAdjacentHTML('beforeend', '<img class="contact-img" src="img/phonebook.png" alt="X">');

        contactElem.append(`${contact.name}`);

        if (contact.id == activeContact) {
            contactElem.classList.add('active');
        }

        return contactElem;
    }

    showContact() {
        document.querySelector('.contacts-list').innerHTML = '';
        let elem = this.contact.map(contact => this.createContact(contact));
        document.querySelector('.contacts-list').append(...elem);
    }

    createContactInfo(contact) {
        let contactElem = document.createElement('div');
        contactElem.classList.add('none');

        if (contact.id == activeContact) {
            contactElem.classList.remove('none');
            contactElem.classList.add('activeContact');
        }

        let name = document.createElement('div');
        name.innerHTML = 'Имя: ' + contact.name;

        let type = document.createElement('div');
        type.innerHTML = 'Тип: ' + contact.type;

        let value = document.createElement('div');
        value.innerHTML = 'Контакт: ' + contact.value;


        contactElem.append(name, type, value);
        contactElem.classList.add('contact-item');

        return contactElem;
    }

    showContactInfo() {
        document.querySelector('.contacts-show').innerHTML = '';
        let elem = this.contact.map((c) => this.createContactInfo(c));
        document.querySelector('.contacts-show').append(...elem);
    }

    update() {
        contactService.getAll().then(contact => {
            this.contact = contact;
            this.showContact(this.contact);
            this.showContactInfo(this.contact);
        });
    }
}

class AddContact {
    constructor(selector, contactService) {
        this.selector = selector;
        this.contactService = contactService;
        this.onAdd = () => { }
        document.addEventListener(
            "DOMContentLoaded",
            () => {
                this.init();
                this.binds();
            }
        );
    }

    init() {
        this.container = document.querySelector(this.selector);
        this.name = this.container.querySelector('#name');
        this.type = this.container.querySelector('#type');
        this.value = this.container.querySelector('#value');
        this.addBtn = this.container.querySelector('.btn');
    }

    binds() {
        this.addBtn.addEventListener('click', (e) => {
            e.preventDefault();
            this.add()
        });
    }

    add() {
        if (this.value.value == '' || this.name.value == '' || this.type.value == '') {
            alert('Заполните поля');
            return;
        };

        let contact = new Contact(
            this.value.value,
            this.name.value,
            this.type.value
        )
        this.contactService.addContact(contact).then(response => {
            if (response.status === "error") this.addError(response.error);
            this.successAdd();
        })
    }

    addError(text) {
        alert(text);
    }

    successAdd() {
        this.clearForm();
        this.onAdd();
    }

    clearForm() {
        this.name.value = ''
        this.value.value = ''
    }
}


let activeContact = null;

document.addEventListener('click', (e) => {
    if (!e.target.matches('.contact-item')) return;
    let index = e.target.dataset.index;
    activeContact = index;
    contact.showContact();
    contact.showContactInfo();
    activeContact = null;
})

let contact = new Contact();
let userService = new UserServices();
let contactService = new ContactServices();
let loginForm = new LoginForm('.login', userService);
loginForm.onLogin = () => {
    contact.update()
}
let addContact = new AddContact('.contacts-info', contactService);
addContact.onAdd = () => {
    contact.update()
}

module.exports = Contact;
},{"./cont-serv":1,"./log-form":4,"./user-serv":6}],3:[function(require,module,exports){

const LoginForm = require('./log-form');
const UserServices = require('./user-serv');
const ContactServices = require('./cont-serv');
const RegisterForm = require('./reg-form');
const Contact = require('./contacts');



window.addEventListener('DOMContentLoaded', () => {

    let exit = document.querySelector('.btn-exit');
    exit.addEventListener('click', () => {
        document.querySelector('.contacts').style.display = 'none';
        document.querySelector('.container').style.display = 'flex';
        exit.style.display = 'none'
    })
})
},{"./cont-serv":1,"./contacts":2,"./log-form":4,"./reg-form":5,"./user-serv":6}],4:[function(require,module,exports){
const User = require('./user');

class LoginForm {
    constructor(selector, userService) {
        this.selector = selector;
        this.userService = userService;
        this.onLogin = () => { };
        document.addEventListener('DOMContentLoaded', () => {
            this.init();
            this.bind();
        })
    }

    init() {
        this.wrapper = document.querySelector('.container');
        this.exit = document.querySelector('.btn-exit');
        this.container = document.querySelector(this.selector);
        this.loginInput = this.container.querySelector('#login-log');
        this.passwordInput = this.container.querySelector('#password-log');
        this.button = this.container.querySelector('.btn-login');
    }

    bind() {
        this.button.addEventListener('click', (e) => {
            e.preventDefault();
            this.login()
        })
    }

    login() {
        if (this.loginInput.value == '' || this.passwordInput.value == '') {
            alert('Заполните поля');
            return;
        }
        let user = new User(
            this.loginInput.value,
            null,
            this.passwordInput.value
        );
        this.userService.login(user).then(response => {
            if (response.status == 'error') {
                this.loginError(response.error);
                return;
            }
            localStorage.setItem('token', response.token);
            this.succsessLogin();
        })
    }

    loginError(text) {
        alert(text);
    }

    clearForm() {
        this.loginInput.value = null;
        this.passwordInput.value = null;
    }

    succsessLogin() {
        this.wrapper.style.display = 'none';
        this.exit.style.display = 'block';
        document.querySelector('.contacts').style.display = 'flex';
        this.clearForm();
        this.onLogin();
    }
}

module.exports = LoginForm;
},{"./user":7}],5:[function(require,module,exports){
const User = require('./user');
const UserServices = require('./user-serv');

class RegisterForm {
    constructor(selector, userService) {
        this.selector = selector;
        this.userService = userService;
        document.addEventListener('DOMContentLoaded', () => {
            this.init();
            this.bind();
        })
    }

    init() {
        this.wrapper = document.querySelector('.container')
        this.container = document.querySelector(this.selector);
        this.loginInput = this.container.querySelector('#login-reg');
        this.bornInput = this.container.querySelector('#date_born-reg');
        this.passwordInput = this.container.querySelector('#password-reg');
        this.button = this.container.querySelector('.btn');
        this.exit = document.querySelector('.btn-exit');
    }

    bind() {
        this.button.addEventListener('click', () => this.register())
    }

    register() {
        if (
            this.loginInput.value == ''
            || this.bornInput.value == ''
            || this.passwordInput.value == ''
        ) {
            alert('Заполните поля');
            return;
        }
        let user = new User(
            this.loginInput.value,
            this.bornInput.value,
            this.passwordInput.value
        );
        this.userService.register(user).then(response => {
            if (response.status == 'error')
                this.registerError(response.error);
            else this.succsessRegister();
        })

    }

    registerError(text) {
        alert(text);
    }

    succsessRegister() {
        this.clearForm();
        this.wrapper.style.display = 'none';
        this.exit.style.display = 'block';
    }

    clearForm() {
        this.loginInput.value = '';
        this.bornInput.value = '';
        this.passwordInput.value = '';
    }
}

let userService = new UserServices();
let registerForm = new RegisterForm('.register', userService);

module.exports = RegisterForm;
},{"./user":7,"./user-serv":6}],6:[function(require,module,exports){
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
},{"./user":7}],7:[function(require,module,exports){
class User {
    constructor(login, date_born, password) {
        this.login = login;
        this.date_born = date_born;
        this.password = password;
    }
    static create(user) {
        return new User(user.login, user['date_born'], null)
    }
}

module.exports = User;
},{}]},{},[3])