import React from 'react';

import {configure, mount} from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import FormBuilderPage from '../pages/FormBuilderPage';
import {createMemoryHistory} from 'history';
import formsStorage from "../storage/forms";
import {MemoryRouter} from "react-router-dom";
import constants from "../shared/constants";

const formsJson = require("./jsons/forms");

configure({adapter: new Adapter()});

jest.mock("../storage/forms");


describe("FormBuilderPage should", () => {
    let wrapper = null;
    let componentInstance = null;
    const path = '/formBuilder';
    const history = createMemoryHistory({
        initialEntries: ['/forms', path],
        initialIndex: 1,
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
    formsStorage.saveForm = jest.fn().mockResolvedValue(formsJson);

    beforeAll(async (done) => {
        wrapper = await mount(<MemoryRouter initialEntries={[path]} history={history}>
                <FormBuilderPage {...props}/>
            </MemoryRouter>
        );
        componentInstance = wrapper.find(FormBuilderPage).instance();
        done();
    });

    test("renders FormBuilderPage for " + path, async () => {
        expect(wrapper.find(FormBuilderPage)).toHaveLength(1);
    });

    test("mounted with the right data", async () => {
        expect(componentInstance.state.form.name).toEqual(constants.titles.FORM_BUILDER_PAGE_TITLE);
        expect(componentInstance.state.form.fields).toEqual([]);
        expect(componentInstance.state.fieldAddModalVisible).toBeFalsy();
        expect(componentInstance.state.formNameInputVisible).toBeFalsy();
    });

    test("render with table", async () => {
        wrapper.update();

        expect(wrapper.find('Grid')).toHaveLength(1);
        expect(wrapper.find('GridRow')).toHaveLength(3);
        expect(wrapper.find('Header')).toHaveLength(1);
        expect(wrapper.find('Header').props().children.props.children).toEqual(constants.titles.FORM_BUILDER_PAGE_TITLE);
        expect(wrapper.find('Icon')).toHaveLength(2);
        expect(wrapper.find('Button')).toHaveLength(2);
        expect(wrapper.find('Button').first().props().children[1]).toEqual(constants.buttons.ADD_FIELD);
        expect(wrapper.find('FieldAdd')).toHaveLength(1);
        expect(wrapper.find('Form')).toHaveLength(1);
        expect(wrapper.find('FormField')).toHaveLength(1);
        expect(wrapper.find('FormButton')).toHaveLength(1);
        expect(wrapper.find('FormButton').props().children).toEqual(constants.buttons.SAVE_FORM);
    });

    test("open add field modal on button click", async () => {
        const link = wrapper.find('FormBuilderPage').find('Button').first();
        await link.simulate('click', {button: 0});

        expect(componentInstance.state.fieldAddModalVisible).toBeTruthy();
    });

    test("add New Field", async () => {
        const field = {
            "label": "label 1",
            "name": "name1",
            "type": "text"
        };

        componentInstance.addNewField(field);

        expect(componentInstance.state.form.fields.length).toEqual(1);
        expect(componentInstance.state.form.fields[0].id).toEqual(0);
        expect(componentInstance.state.form.fields[0].label).toEqual(field.label);
        expect(componentInstance.state.form.fields[0].name).toEqual(field.name);
        expect(componentInstance.state.form.fields[0].type).toEqual(field.type);

        expect(componentInstance.state.fieldAddModalVisible).toBeFalsy();
    });


    test("change Form Name after click on edit", async () => {
        const updateName = 'New Name';

        const icon = wrapper.find('FormBuilderPage').find('Icon').at(0);
        await icon.simulate('click', {button: 0});

        expect(wrapper.find('Input')).toHaveLength(1);

        await wrapper.find('Input').props().onChange({}, {value: updateName});

        await icon.simulate('click', {button: 0});

        expect(wrapper.find('Input')).toHaveLength(0);

        expect(componentInstance.state.form.name).toEqual(updateName);
    });

    test("open Submissions page on link click", async () => {
        await wrapper.find('FormBuilderPage').find('Form').simulate('submit', {
            preventDefault() {
            }
        });

        expect(componentInstance.props.history.location.pathname).toEqual('/forms');
    });

});
