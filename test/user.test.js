const assert = require('assert');
const {describe,it} = require('mocha');
const chai = require('chai');
const chaiHttp = require('chai-http');
const server = require('../src/server');
let should = chai.should();


chai.use(chaiHttp);

describe('User', () => {
    describe('Login: first time', () => {
        it ('should return success', () => {
            chai.request(server)
                .post('/user/login')
                .send({username:'mclark',password:'password'})
                .end((err,res) => {
                    res.should.have.status(200);
                    res.should.have.property('text');
                });
        });
    });

    describe('Logout: ', () => {
        it ('should return success', () => {
            chai.request(server)
                .post('/user/logout')
                .send({username:'mclark'})
                .end((err,res) => {
                    res.should.have.status(200);
                    res.should.have.property('text');
                });
        });
    });

    describe('Login: bad password', () => {
        it ('should return failed', () => {
            chai.request(server)
                .post('/user/login')
                .send({username:'mclark',password:'password2'})
                .end((err,res) => {
                    res.should.have.status(200);
                    res.should.have.property('text');
                });
        });
    });


});
