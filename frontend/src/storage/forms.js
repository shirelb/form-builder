import axios from "axios";
import {server} from "../shared/constants";

const getForms = () => {
    return axios.get(`${server.URL}/api/forms`,
        {}
    )
        .then(response => {
            return response.data.data;
        })
        .catch(error => {
            console.log('get forms error ', error);
            return error;
        });
};

const saveForm = (form) => {
    return axios.post(`${server.URL}/api/forms/build`,
        form
    )
        .then(response => {
            return response.data.data;
        })
        .catch(error => {
            console.log('post form error ', error);
            return error;
        });
};

export default {getForms, saveForm}