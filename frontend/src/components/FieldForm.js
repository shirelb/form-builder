import React, {Component} from 'react';
import {Dropdown, Form, Input, Message} from 'semantic-ui-react';
import constants from '../shared/constants';

const inputTypeOptions = [
    {key: 'text', text: 'text', value: 'text'},
    {key: 'color', text: 'color', value: 'color'},
    {key: 'date', text: 'date', value: 'date'},
    {key: 'email', text: 'email', value: 'email'},
    {key: 'tel', text: 'tel', value: 'tel'},
    {key: 'number', text: 'number', value: 'number'},
];

export default class FieldForm extends Component {

    constructor(props) {
        super(props);

        this.state = {
            field: {},

            formError: false,
            formErrorHeader: "",
            formErrorContent: "",
        };

    }

    handleSubmit = (e) => {
        e.preventDefault();

        const {field} = this.state;
        const {handleSubmit} = this.props;

        //todo complete validations
        handleSubmit(field)
    };

    handleChange = (e, {name, value}) => {
        const {field} = this.state;

        this.setState({formError: false, formErrorHeader: '', formErrorContent: ''});
        this.setState({field: {...field, [name]: value}});
    };

    handleClear = (e) => {
        e.preventDefault();
        this.setState({
            field: {
                label: '',
                name: '',
                type: '',
            },
            formError: false,
            formErrorHeader: "",
            formErrorContent: "",
        });
    };

    render() {
        const {field, formError, formErrorHeader, formErrorContent} = this.state;
        const {handleCancel, submitText} = this.props;

        return (
            <Form onSubmit={this.handleSubmit} error={formError}>
                <Form.Field
                    control={Input}
                    label='Field Label'
                    placeholder='Field Label'
                    fluid
                    onChange={this.handleChange}
                    name='label'
                    required
                />
                <Form.Field
                    control={Input}
                    label='Input Name'
                    placeholder='Input Name'
                    fluid
                    onChange={this.handleChange}
                    name='name'
                    required
                />
                <Form.Field
                    control={Dropdown}
                    label='Input Type'
                    placeholder='Input Type'
                    fluid
                    search
                    selection
                    autoComplete='on'
                    options={inputTypeOptions}
                    value={field.type}
                    onChange={this.handleChange}
                    name='type'
                    required
                    noResultsMessage='No Types Found'
                />

                {formError ?
                    <Message
                        error
                        header={formErrorHeader}
                        content={formErrorContent}
                    />
                    : null
                }

                <Form.Group style={{marginTop: 20}}>
                    <Form.Button positive type="submit">{submitText}</Form.Button>
                    <Form.Button negative onClick={handleCancel}>{constants.buttons.CANCEL}</Form.Button>
                    <Form.Button onClick={this.handleClear}>{constants.buttons.CLEAR}</Form.Button>
                </Form.Group>
            </Form>
        )
    }
}