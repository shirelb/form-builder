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
    let submissionsFromJson = submissionsJson.data;
    let formJson = formsJson.data[7];
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
                form: formJson
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
        expect(componentInstance.state.submissions.length).toEqual(submissionsFromJson.length);
    });

    test("render with table", async () => {
        wrapper.update();

        expect(wrapper.find('Container')).toHaveLength(1);
        expect(wrapper.find('Header')).toHaveLength(1);
        expect(wrapper.find('Header').get(0).props.children).toEqual(constants.titles.FORM_SUBMISSIONS_PAGE_TITLE);
        expect(wrapper.find('Table')).toHaveLength(1);
        expect(wrapper.find('TableHeader')).toHaveLength(1);
        expect(wrapper.find('TableHeaderCell')).toHaveLength(4);
        expect(wrapper.find('TableHeaderCell').at(1).props().children).toEqual(formJson.fields[0].label);
        expect(wrapper.find('TableHeaderCell').at(2).props().children).toEqual(formJson.fields[1].label);
        expect(wrapper.find('TableHeaderCell').at(3).props().children).toEqual(formJson.fields[2].label);
        expect(wrapper.find('TableRow')).toHaveLength(1 + submissionsFromJson.length);
        expect(wrapper.find('TableCell')).toHaveLength(4 * submissionsFromJson.length + 4);
    });

});
