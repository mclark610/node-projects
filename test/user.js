const chai = require('chai');
const chaiHTTP = require('chai-http');
const assert = require('chai').assert;
//const should = chai.should();
//const User = require('../router/user.js');
const app = require('../server');

chai.use(chaiHTTP);
const expect = chai.expect;

describe('Array',() => {
    describe('#indexOf()', () => {
        it('should return -1 when the value is not present', () => {
            assert.equal([1,2,3].indexOf(4),-1);
        });
        it('array should return -1 if index is > 4', () => {
            assert.equal([1,2,3].indexOf(4),-1);
        });
    });
});

// Test login
describe('User', () => {
    // Send some JSON
    it('login test: valid login parameter', (done) => {
        chai.request(app)
            .post('/user/login')
            .send({ username: 'mclark', password: 'password' })
            .end( (err,res) => {
                //console.log("res: " + JSON.stringify(res));
                const data = JSON.parse(res.text);

                expect(res).to.have.status(200);
                expect(data['status']).equal('success');
                done();
            });
    });
    it('login test: invalid login parameter sent', (done) => {
        chai.request(app)
            .post('/user/login')
            .send({ username: 'mclark', password: 'password2' })
            .end( (err,res) => {
                //console.log("res: " + JSON.stringify(res));
                const data = JSON.parse(res.text);

                expect(res).to.have.status(200);
                expect(data['status']).equal('failed');
                done();
            });
    });

});
