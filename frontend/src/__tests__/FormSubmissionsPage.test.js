import React from 'react';

import {configure, mount} from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import FormSubmissionsPage from '../pages/FormSubmissionsPage';
import {createMemoryHistory} from 'history';
import submissionsStorage from "../storage/submissions";
import {MemoryRouter} from "react-router-dom";
import constants from "../shared/constants";

const formsJson = require("./jsons/forms");
const submissionsJson = require("./jsons/submissions");

configure({adapter: new Adapter()});

jest.mock("../storage/forms");


describe("FormSubmissionsPage should", () => {
    let wrapper = null;
    let componentInstance = null;
    const path = '/form';
    const history = createMemoryHistory({
        initialEntries: [path],
        initialIndex: 0,
        keyLength: 10,
        getUserConfirmation: null
    });
    const props = {
        history: history,
        location: {
            pathname: path,
            state: {
                form: formsJson[7]
            }
        },
        match: {
            isExact: true,
            path: path,
            url: path,
        }
    };

    submissionsStorage.getFormSubmissions = jest.fn().mockResolvedValue(submissionsJson);

    beforeAll(async (done) => {
        wrapper = await mount(<MemoryRouter initialEntries={[path]} history={history}>
                <FormSubmissionsPage {...props}/>
            </MemoryRouter>
        );
        componentInstance = wrapper.find(FormSubmissionsPage).instance();
        done();
    });

    test("renders FormSubmissionsPage for /", async () => {
        expect(wrapper.find(FormSubmissionsPage)).toHaveLength(1);
    });

    test("mounted with the right data", async () => {
        expect(componentInstance.state.submissions.length).toEqual(submissionsJson.length);
    });

    test("render with table", async () => {
        wrapper.update();

        expect(wrapper.find('Container')).toHaveLength(1);
        expect(wrapper.find('Header')).toHaveLength(1);
        expect(wrapper.find('Header').get(0).props.children).toEqual(constants.titles.FORM_SUBMISSIONS_PAGE_TITLE);
        expect(wrapper.find('Table')).toHaveLength(1);
        expect(wrapper.find('TableHeader')).toHaveLength(1);
        expect(wrapper.find('TableHeaderCell')).toHaveLength(3);
        expect(wrapper.find('TableHeaderCell').at(0).props().children).toEqual(formsJson[7].fields[0].label);
        expect(wrapper.find('TableHeaderCell').at(1).props().children).toEqual(formsJson[7].fields[1].label);
        expect(wrapper.find('TableHeaderCell').at(2).props().children).toEqual(formsJson[7].fields[2].label);
        expect(wrapper.find('TableRow')).toHaveLength(1 + submissionsJson.length);
        expect(wrapper.find('TableCell')).toHaveLength(3 * submissionsJson.length + 3);
    });

});
