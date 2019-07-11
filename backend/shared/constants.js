exports.fieldType = ['text', 'color', 'date', 'email', 'tel', 'number',];

exports.validation = {
    fields: {
        FORM_NAME: 'Form name',
        FORM_FIELDS: 'Form fields',
        FIELD_LABEL: 'Field label',
        FIELD_NAME: 'Field name',
        FIELD_TYPE: 'Field type',
    },
    messages: {
        NO_FIELDS: 'Form without fields is invalid',
        NOT_EMPTY: ' should not be empty',
        NO_SPACES: ' should not have spaces',
        NOT_CONTAINS: ' should be one of the following: ',
        FORM_VALID: 'Form is valid :)',
    },
};