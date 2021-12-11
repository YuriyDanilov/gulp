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