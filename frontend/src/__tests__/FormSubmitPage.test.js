import React from 'react';

import {configure, mount} from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import FormSubmitPage from '../pages/FormSubmitPage';
import {createMemoryHistory} from 'history';
import formsStorage from "../storage/forms";
import submissionsStorage from "../storage/submissions";
import {MemoryRouter} from "react-router-dom";
import constants from "../shared/constants";

const formsJson = require("./jsons/forms");

configure({adapter: new Adapter()});

jest.mock("../storage/forms");
jest.mock("../storage/submissions");


describe("FormSubmitPage should", () => {
    let wrapper = null;
    let componentInstance = null;
    const path = `/forms/${formsJson[4].id}/submit`;
    const history = createMemoryHistory({
        initialEntries: ['/forms', path],
        initialIndex: 1,
        keyLength: 10,
        getUserConfirmation: null
    });
    const props = {
        history: history,
        location: {
            pathname: path,
            state: {
                form: formsJson[4]
            }
        },
        match: {
            isExact: true,
            path: path,
            url: path,
        }
    };

    formsStorage.getForms = jest.fn().mockResolvedValue(formsJson);
    formsStorage.saveForm = jest.fn().mockResolvedValue();
    submissionsStorage.submitForm = jest.fn().mockResolvedValue();
    submissionsStorage.getFormSubmissions = jest.fn().mockResolvedValue();

    beforeAll(async (done) => {
        wrapper = await mount(<MemoryRouter initialEntries={[path]} history={history}>
                <FormSubmitPage {...props}/>
            </MemoryRouter>
        );
        componentInstance = wrapper.find(FormSubmitPage).instance();
        done();
    });

    test("renders FormSubmitPage for " + path, async () => {
        expect(wrapper.find(FormSubmitPage)).toHaveLength(1);
    });

    test("mounted with the right data", async () => {
        expect(componentInstance.state.submission.form).toEqual(formsJson[4]._id);
        expect(componentInstance.state.submission.fields).toEqual([]);
    });

    test("render with table", async () => {
        wrapper.update();

        expect(wrapper.find('Grid')).toHaveLength(1);
        expect(wrapper.find('GridRow')).toHaveLength(2);
        expect(wrapper.find('Header')).toHaveLength(1);
        expect(wrapper.find('Header').props().children).toEqual(formsJson[4].name);
        expect(wrapper.find('Form')).toHaveLength(1);
        expect(wrapper.find('FormField')).toHaveLength(4);
        expect(wrapper.find('FormButton')).toHaveLength(1);
        expect(wrapper.find('FormButton').props().children).toEqual(constants.buttons.SUBMIT_FORM);
    });

    test("change Field Name", async () => {
        const updateName = 'New Name';

        await wrapper.find('input').first().props().onChange({target: {value: updateName}}, formsJson[4].fields[0]);

        expect(componentInstance.state.submission.fields[0].value).toEqual(updateName);
    });

    test("open Submissions page on link click", async () => {
        await wrapper.find('FormSubmitPage').find('Form').simulate('submit', {
            preventDefault() {
            }
        });

        expect(componentInstance.props.history.location.pathname).toEqual('/forms/' + formsJson[4].id + '/submissions');
    });

});
