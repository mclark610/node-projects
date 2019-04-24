const assert = require('assert');
const {describe,it} = require('mocha');
const chai = require('chai');
const chaiHttp = require('chai-http');
const server = require('../server');
let should = chai.should();

const logger = require('../modules/logger.js');

let login = {
    'username': 'mclark',
    'password': 'password'
};

let todo = {
    'name':"Hub Bearings",
    'description':"repack hub bearings",
    'maintain_id':1
};

chai.use(chaiHttp);

describe('Todo', () => {

    describe('Login: first time', () => {
/*
        it ('should return success', () => {
            chai.request(server)
                .post('/user/login')
                .send(login)
                .end((err,results) => {
                    if (err) {
                        throw err;
                    }
                    results.should.have.status(200);
                    results.should.have.property('text');
                });
        });

        it ('login:todo: fetch data: status: 200 - objects should be 3', () => {
            let agent = chai.request.agent(server);
            agent
                .post('/user/login')
                .send(login)
                .then(() => {
                    return agent
                        .get('/todo/')
                        .then( (results) => {
                            logger.info('-----results----' + JSON.stringify(results));
                            results.should.have.status(200);
                            let obj = JSON.parse(results.text);
                            let num = obj.length;
                            logger.info("num: " + num);
                            chai.expect(obj.length).to.equal(4);
                            //logger.info('results maintainId: ' + JSON.stringify(obj[0].id));
                        });
                });
        });
*/
        it('login:insert: insert data', () => {

            let agent = chai.request.agent(server);
            agent
                .post('/user/login')
                .send(login)
                .then(() => {
                    return agent
                        .post('/todo')
                        .send(todo)
                        .then( (results) => {
                            logger.info('-----results----' + JSON.stringify(results));
                            results.should.have.status(200);
                            let obj = JSON.parse(results.text);
                            let num = obj.length;
                            logger.info("num: " + num);
                            chai.expect(obj.length).to.equal(3);
                            //logger.info('results maintainId: ' + JSON.stringify(obj[0].id));
                        });
                });
        });
    });

});
