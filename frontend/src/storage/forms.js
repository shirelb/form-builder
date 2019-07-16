import axios from "axios";
import {server} from "../shared/constants";

const getForms = () => {
    return axios.get(`${server.URL}/api/forms`,
        {}
    )
        .then(response => {
            return response.data;
        })
        .catch(error => {
            console.log('get forms error ', error);
            return error.response.data;
        });
};

const getFormById = (formId) => {
    return axios.get(`${server.URL}/api/forms/${formId}`,
        {}
    )
        .then(response => {
            return response.data;
        })
        .catch(error => {
            console.log('get forms error ', error);
            return error.response.data;
        });
};

const deleteForm = (formId) => {
    return axios.delete(`${server.URL}/api/forms/${formId}`,
        {}
    )
        .then(response => {
            return response.data;
        })
        .catch(error => {
            console.log('delete form by id error ', error);
            return error.response.data;
        });
};

const saveForm = (form) => {
    return axios.post(`${server.URL}/api/forms/build`,
        form
    )
        .then(response => {
            return response.data;
        })
        .catch(error => {
            console.log('post form error ', error);
            return error.response.data;
        });
};

export default {getForms, saveForm, getFormById, deleteForm}