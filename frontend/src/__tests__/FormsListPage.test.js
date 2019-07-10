import React from 'react';

import {configure, mount} from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import FormsListPage from '../pages/FormsListPage';
import {createMemoryHistory} from 'history';
import formsStorage from "../storage/forms";
import {MemoryRouter} from "react-router-dom";
import constants from "../shared/constants";

const formsJson = require("./jsons/forms");

configure({adapter: new Adapter()});

jest.mock("../storage/forms");


describe("FormsListPage should", () => {
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
            pathname: path
        },
        match: {
            isExact: true,
            path: path,
            url: path,
        }
    };

    formsStorage.getForms = jest.fn().mockResolvedValue(formsJson);

    beforeAll(async (done) => {
        wrapper = await mount(<MemoryRouter initialEntries={[path]} history={history}>
                <FormsListPage {...props}/>
            </MemoryRouter>
        );
        componentInstance = wrapper.find(FormsListPage).instance();
        done();
    });

    test("renders FormsListPage for /", async () => {
        expect(wrapper.find(FormsListPage)).toHaveLength(1);
    });

    test("mounted with the right data", async () => {
        expect(componentInstance.state.forms.length).toEqual(formsJson.length);
    });

    test("render with table", async () => {
        wrapper.update();

        expect(wrapper.find('Container')).toHaveLength(1);
        expect(wrapper.find('Header')).toHaveLength(1 + formsJson.length);
        expect(wrapper.find('Header').get(0).props.children).toEqual(constants.titles.FORM_LIST_PAGE_TITLE);
        expect(wrapper.find('Link')).toHaveLength(1 + 2 * formsJson.length);
        expect(wrapper.find('Link').first().find('Button')).toHaveLength(1);
        expect(wrapper.find('Link').first().find('Button').props().children).toEqual(constants.buttons.ADD_FORM);
        expect(wrapper.find('Table')).toHaveLength(1);
        expect(wrapper.find('TableHeader')).toHaveLength(1);
        expect(wrapper.find('TableHeaderCell')).toHaveLength(5);
        expect(wrapper.find('TableHeaderCell').at(0).props().children).toEqual(constants.headers.FORM_ID_HEADER);
        expect(wrapper.find('TableHeaderCell').at(1).props().children).toEqual(constants.headers.FORM_NAME_HEADER);
        expect(wrapper.find('TableHeaderCell').at(2).props().children).toEqual(constants.headers.FORM_SUBMISSIONS_NUM_HEADER);
        expect(wrapper.find('TableHeaderCell').at(3).props().children).toEqual(constants.headers.FORM_SUBMIT_PAGE_HEADER);
        expect(wrapper.find('TableHeaderCell').at(4).props().children).toEqual(constants.headers.FORM_SUBMISSIONS_PAGE_HEADER);
        expect(wrapper.find('TableRow')).toHaveLength(1 + formsJson.length);
        expect(wrapper.find('TableCell')).toHaveLength(5 * formsJson.length + 5);
    });

    test("open builder page on button click", async () => {
        const link = wrapper.find('FormsListPage').find('Link').first();
        await link.simulate('click', {button: 0});

        expect(wrapper.find('Router').prop('history').location.pathname).toEqual('/formsBuilder');
    });

    test("open submit page on link click", async () => {
        const link = wrapper.find('FormsListPage').find('Link').at(1);
        await link.simulate('click', {button: 0});

        expect(wrapper.find('Router').prop('history').location.pathname).toEqual('/forms/3/submit');
    });

    test("open Submissions page on link click", async () => {
        const link = wrapper.find('FormsListPage').find('Link').at(2);
        await link.simulate('click', {button: 0});

        expect(wrapper.find('Router').prop('history').location.pathname).toEqual('/forms/3/submissions');
    });

});
