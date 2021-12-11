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