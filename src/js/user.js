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