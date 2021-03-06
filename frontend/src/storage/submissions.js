import axios from "axios";
import {server} from "../shared/constants";


const submitForm = (formId, submission) => {
    return axios.post(`${server.URL}/api/forms/${formId}/submissions/submit`,
        submission
    )
        .then(response => {
            return response.data;
        })
        .catch(error => {
            console.log('post form error ', error);
            return error.response.data;
            });
};

const getFormSubmissions = (formId) => {
    return axios.get(`${server.URL}/api/forms/${formId}/submissions`,
        {}
    )
        .then(response => {
            return response.data;
        })
        .catch(error => {
            console.log('post form error ', error);
            return error.response.data;
            });
};

export default {submitForm, getFormSubmissions}