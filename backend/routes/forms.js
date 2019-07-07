var express = require('express');
var router = express.Router();
const Form = require('../db/models/form');
const formStorage = require('../db/controllers/form');

router.get('/', async function (req, res, next) {
    await formStorage.findAll(req, res);
});

router.get('/:formId', async function (req, res, next) {
    await formStorage.findOne(req, res);
});

router.post('/build', async function (req, res, next) {
    const {name, fields} = req.body;

    //TODO complete validations
    /*    if ((!id && id !== 0)) {
            return res.json({
                success: false,
                error: 'INVALID INPUTS',
            });
        }*/
    await formStorage.create(req, res);
});

router.delete('/:formId', async function (req, res, next) {
    await formStorage.delete(req, res);
});

//todo complete update
router.patch('/:formId', async function (req, res, next) {
    // Validate Request
    if (!req.body.content) {
        return res.status(400).send({
            message: "Form content can not be empty"
        });
    }
    await formStorage.update(req, res);
});

module.exports = router;
