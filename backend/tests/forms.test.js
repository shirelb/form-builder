process.dbMode = 'inMemory';

let chai = require('chai');
let chaiHttp = require('chai-http');
const expect = chai.expect;
const sinon = require("sinon");

let server = require('../server');
let db = require('../db/setup');
let formStorage = require('../db/controllers/form');
let formJson = require('./jsons/formTest');
const constants = require('../shared/constants');

chai.use(chaiHttp);


describe('forms route should', function () {

    before((done) => {
        formStorage.deleteAll();
        done();
    });

    after((done) => {
        formStorage.deleteAll();
        db.disconnectDB().then(done());
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

    step('not POST a non valid form with empty name', (done) => {
        let invalidFormJson = JSON.parse(JSON.stringify(formJson));
        invalidFormJson.name = '';
        chai.request(server)
            .post('/api/forms/build')
            .send(invalidFormJson)
            .end((err, res) => {
                expect(res).to.have.status(400);
                expect(res.body).to.be.a('object');
                expect(res.body.success).to.be.false;
                expect(res.body.error).to.be.a('object');
                expect(res.body.error.name).to.eq('ValidationError');
                expect(res.body.error.message).to.eq('Form validation failed: name: ' + constants.validation.fields.FORM_NAME + constants.validation.messages.NOT_EMPTY);
                done();
            });
    });

    step('not POST a non valid form with no fields', (done) => {
        let invalidFormJson = JSON.parse(JSON.stringify(formJson));
        invalidFormJson.fields = [];
        chai.request(server)
            .post('/api/forms/build')
            .send(invalidFormJson)
            .end((err, res) => {
                expect(res).to.have.status(400);
                expect(res.body).to.be.a('object');
                expect(res.body.success).to.be.false;
                expect(res.body.error).to.be.a('object');
                expect(res.body.error.name).to.eq('ValidationError');
                expect(res.body.error.message).to.eq('Form validation failed: fields: ' + constants.validation.fields.FORM_FIELDS + constants.validation.messages.NO_FIELDS);
                done();
            });
    });

    step('not POST a non valid form with field with empty attributes', (done) => {
        let invalidFormJson = JSON.parse(JSON.stringify(formJson));
        invalidFormJson.fields[0].label = '';
        invalidFormJson.fields[0].name = '';
        invalidFormJson.fields[0].type = '';
        chai.request(server)
            .post('/api/forms/build')
            .send(invalidFormJson)
            .end((err, res) => {
                expect(res).to.have.status(400);
                expect(res.body).to.be.a('object');
                expect(res.body.success).to.be.false;
                expect(res.body.error).to.be.a('object');
                expect(res.body.error.name).to.eq('ValidationError');
                expect(res.body.error.errors).to.be.a('object');
                expect(Object.keys(res.body.error.errors).length).to.be.eql(3);
                expect(res.body.error.message).to.eq(`Form validation failed: fields.0.label: ${constants.validation.fields.FIELD_LABEL + constants.validation.messages.NOT_EMPTY}, fields.0.name: ${constants.validation.fields.FIELD_NAME + constants.validation.messages.NOT_EMPTY}, fields.0.type: ${constants.validation.fields.FIELD_TYPE + constants.validation.messages.NOT_EMPTY}`);
                done();
            });
    });

    step('not POST a non valid form with field with name with spaces', (done) => {
        let invalidFormJson = JSON.parse(JSON.stringify(formJson));
        invalidFormJson.fields[0].name = 'some name';
        chai.request(server)
            .post('/api/forms/build')
            .send(invalidFormJson)
            .end((err, res) => {
                expect(res).to.have.status(400);
                expect(res.body).to.be.a('object');
                expect(res.body.success).to.be.false;
                expect(res.body.error).to.be.a('object');
                expect(res.body.error.name).to.eq('ValidationError');
                expect(res.body.error.message).to.eq('Form validation failed: fields.0.name: ' + constants.validation.fields.FIELD_NAME + constants.validation.messages.NO_SPACES);
                done();
            });
    });

    step('not POST a non valid form with non exist type', (done) => {
        let invalidFormJson = JSON.parse(JSON.stringify(formJson));
        invalidFormJson.fields[0].type = 'notValid';
        chai.request(server)
            .post('/api/forms/build')
            .send(invalidFormJson)
            .end((err, res) => {
                expect(res).to.have.status(400);
                expect(res.body).to.be.a('object');
                expect(res.body.success).to.be.false;
                expect(res.body.error).to.be.a('object');
                expect(res.body.error.name).to.eq('ValidationError');
                expect(res.body.error.message).to.eq('Form validation failed: fields.0.type: ' + constants.validation.fields.FIELD_TYPE + constants.validation.messages.NOT_CONTAINS + constants.fieldType.join(','));
                done();
            });
    });

    step('GET array with 1 form', (done) => {
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

});