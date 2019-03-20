const pbkdf2 = require('pbkdf2');
const uuid   = require('uuid');
// This is how it will work.  
// 1. user enters userid & password
// 2. return decrypted uuid
// 3. encrypt and compare with original encrypted string

let derivedKey = pbkdf2.pbkdf2Sync('helloworld','salt',1,32,'sha512');
let decrypted = 

console.log("derivedKey: " + derivedKey.toString());
