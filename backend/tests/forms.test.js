process.dbMode = 'inMemory';

let chai = require('chai');
let chaiHttp = require('chai-http');
const expect = chai.expect;
const sinon = require("sinon");

let server = require('../server');
let db = require('../db/setup');
let formStorage = require('../db/controllers/form');
let formJson = require('./jsons/formTest');

chai.use(chaiHttp);


describe('forms route should', function () {

    before((done) => {
        formStorage.deleteAll();
        done();
    });

    after((done) => {
        formStorage.deleteAll();
        db.disconnectDB().then(done())
    });

    step('POST a form', (done) => {
        chai.request(server)
            .post('/api/forms/build')
            .send(formJson)
            .end((err, res) => {
                expect(res).to.have.status(200);
                expect(res.body).to.be.a('object');
                expect(res.body.success).to.be.true;
                expect(res.body.data).to.be.a('object');
                expect(res.body.data.id).to.eq(0);
                expect(res.body.data.name).to.eq(formJson.name);
                expect(res.body.data.fields).to.be.a('array');
                expect(res.body.data.fields).to.have.length(2);
                done();
            });
    });

    step('GET all the forms', (done) => {
        chai.request(server)
            .get('/api/forms')
            .end((err, res) => {
                expect(res).to.have.status(200);
                expect(res.body).to.be.a('object');
                expect(res.body.success).to.be.true;
                expect(res.body.data).to.be.a('array');
                expect(res.body.data.length).to.be.eql(1);
                done();
            });
    });

    step('GET the form with id 0', (done) => {
        chai.request(server)
            .get('/api/forms/0')
            .end((err, res) => {
                expect(res).to.have.status(200);
                expect(res.body).to.be.a('object');
                expect(res.body.success).to.be.true;
                expect(res.body.data).to.be.a('object');
                expect(res.body.data.id).to.eq(0);
                expect(res.body.data.name).to.eq(formJson.name);
                expect(res.body.data.fields).to.be.a('array');
                expect(res.body.data.fields).to.have.length(2);
                done();
            });
    });

    step('GET 404 for non exist form with id 2', (done) => {
        chai.request(server)
            .get('/api/forms/2')
            .end((err, res) => {
                expect(res).to.have.status(404);
                expect(res.body).to.be.a('object');
                expect(res.body.success).to.be.false;
                expect(res.body.error).to.eq("Form not found with id 2");
                done();
            });
    });

    step('DELETE form with id 0', (done) => {
        chai.request(server)
            .delete('/api/forms/0')
            .end((err, res) => {
                expect(res).to.have.status(200);
                expect(res.body).to.be.a('object');
                expect(res.body.success).to.be.true;
                done();
            });
    });

});