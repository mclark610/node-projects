const db = require('../src/models/index.js');
const {fetchByNamePassword} = require("../src/modules/data_user.js");


test("user data fetchByNamePassword test.", async () => {
    await fetchByNamePassword("mclark", "password")
    .then( (results) => 
        console.log("User ID 1 is Results are : " + JSON.stringify(results))
    )
    .catch( (err) => {
        console.log("fetchUser:findAll error: " + err);
    })
})

  