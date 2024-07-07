const {checkPassword,genHash} = require("../src/modules/encrypt_data");

const val = genHash("password")
console.log(`password is <${val}>`)