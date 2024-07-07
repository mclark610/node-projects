const bcrypt = require('bcryptjs');

const checkPassword = (plain_text_password,hash_password) => {
    return bcrypt.compareSync(plain_text_password,hash_password);
}

const genHash = (password) => {
    let salt = bcrypt.genSaltSync(10);
    return bcrypt.hashSync(password,salt);
};

module.exports = {
    checkPassword,
    genHash
};
