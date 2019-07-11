exports.pagesIconsNames = {
    formsList: "list",
    formBuilder: "file alternate",
};

exports.titles = {
    FORM_LIST_PAGE_TITLE: "Forms List",
    FORM_BUILDER_PAGE_TITLE: "Form Builder",
    FORM_SUBMIT_PAGE_TITLE: "Submit Form",
    FORM_SUBMISSIONS_PAGE_TITLE: "Form Submissions",
    PAGE_NOT_FOUND_TITLE: "Page Not Found",
};

exports.headers = {
    FORM_ID_HEADER: "Form Id",
    FORM_NAME_HEADER: "Form Name",
    FORM_SUBMISSIONS_NUM_HEADER: "# Submissions",
    FORM_SUBMIT_PAGE_HEADER: "Submit Page",
    FORM_SUBMISSIONS_PAGE_HEADER: "Submissions Page",
};

exports.buttons = {
    ADD_FORM: "Build New Form",
    ADD_FIELD: "New Field",
    SAVE_FIELD: "Add",
    SAVE_FORM: "Save",
    SUBMIT_FORM: "Submit",
    CANCEL: "Cancel",
    CLEAR: "Clear",
};

exports.server = {
    URL: "http://localhost:3000",
};

exports.routs = {
    FORM_LIST_PAGE: "/forms",
    FORM_BUILDER_PAGE: "/formsBuilder",
    FORM_SUBMIT_PAGE: "/forms/:formId/submit",
    FORM_SUBMISSIONS_PAGE: "/forms/:formId/submissions",
};

exports.messages = {
    WARNING_FORM_NAME: "Is this the form name you want?",
};

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