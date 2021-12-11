
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