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