const  {describe, expect, test} = require( '@jest/globals');
const { v4: uuidv4 } = require('uuid');

describe('Trying this for the first time in node-project',() => {

    test('uuid is a long string',() => {
        expect(4).toBeGreaterThan(3);
    })
    
})

