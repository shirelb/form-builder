process.dbMode = 'inMemory';

let chai = require('chai');
let chaiHttp = require('chai-http');
const expect = chai.expect;
const sinon = require("sinon");

let server = null;
let db = require('../db/setup');
let formStorage = null;
let submissionStorage = null;
let submissionJson = require('./jsons/submissionTest');
let formJson = require('./jsons/formTest');

chai.use(chaiHttp);


describe('submissions route should', function () {
    this.timeout(5000);

    let formDocId = 0;
    let formId = 0;

    before((done) => {
        server = require('../server');
        formStorage = require('../db/controllers/form');
        submissionStorage = require('../db/controllers/submission');
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

    step('GET error for submissions of non existent form ', (done) => {
        chai.request(server)
            .get(`/api/forms/0/submissions`)
            .end((err, res) => {
                expect(res).to.have.status(404);
                expect(res.body).to.be.a('object');
                expect(res.body.success).to.be.false;
                expect(res.body.error).to.eq("Form not found with id 0");
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
                expect(res.body.data.id).to.eq(1);
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

    step('GET all the submissions for form ' + formId, (done) => {
        chai.request(server)
            .get(`/api/forms/${formId}/submissions`)
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