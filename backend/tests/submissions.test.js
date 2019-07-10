process.dbMode = 'inMemory';

let chai = require('chai');
let chaiHttp = require('chai-http');
const expect = chai.expect;
const sinon = require("sinon");

let server = require('../server');
let db = require('../db/setup');
let formStorage = require('../db/controllers/form');
let submissionStorage = require('../db/controllers/submission');
let submissionJson = require('./jsons/submissionTest');
let formJson = require('./jsons/formTest');
const constants = require('../shared/constants');

chai.use(chaiHttp);


describe('submissions route should', function () {
    let formDocId = 0;
    let formId = 0;

    before((done) => {
        formStorage.deleteAll();
        submissionStorage.deleteAll();
        done();
    });

    after((done) => {
        formStorage.deleteAll();
        submissionStorage.deleteAll();
        db.disconnectDB().then(done())
    });

    step('not POST a submission for non existent form', (done) => {
        chai.request(server)
            .post('/api/forms/0/submissions/submit')
            .send(submissionJson)
            .end((err, res) => {
                expect(res).to.have.status(400);
                expect(res.body).to.be.a('object');
                expect(res.body.success).to.be.false;
                expect(res.body.error).to.be.a('object');
                expect(res.body.error.name).to.eq('ValidationError');
                expect(res.body.error.message).to.eq(`Submission validation failed: form: form with id 5d22ec2156ed8a26033bbfe3 does not exists`);
                done();
            });
    });

    step('GET empty array of submissions', (done) => {
        chai.request(server)
            .get(`/api/forms/${submissionJson.form}/submissions`)
            .end((err, res) => {
                expect(res).to.have.status(200);
                expect(res.body).to.be.a('object');
                expect(res.body.success).to.be.true;
                expect(res.body.data).to.be.a('array');
                expect(res.body.data.length).to.be.eql(0);
                done();
            });
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
                formDocId = res.body.data._id;
                formId = res.body.data.id;
                done();
            });
    });

    step('POST a submission for form ' + formId, (done) => {
        submissionJson.form = formDocId;
        chai.request(server)
            .post(`/api/forms/${formId}/submissions/submit`)
            .send(submissionJson)
            .end((err, res) => {
                expect(res).to.have.status(200);
                expect(res.body).to.be.a('object');
                expect(res.body.success).to.be.true;
                expect(res.body.data).to.be.a('object');
                expect(res.body.data.form).to.eq(formDocId);
                expect(res.body.data.fields).to.be.a('array');
                expect(res.body.data.fields).to.have.length(2);
                done();
            });
    });

    step('GET all the submissions for form ' + formDocId, (done) => {
        chai.request(server)
            .get(`/api/forms/${formDocId}/submissions`)
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