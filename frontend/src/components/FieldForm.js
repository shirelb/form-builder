import React, {Component} from 'react';
import {Dropdown, Form, Input, Message} from 'semantic-ui-react';

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

        const {} = props;

        this.state = {
            field: {},
            formError: false,
            formErrorHeader: "",
            formErrorContent: "",
            formComplete: false,
            isAlertModal: false,
        };

        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleSubmit(e) {
        e.preventDefault();

        const {field} = this.state;
        const {handleSubmit} = this.props;

        //todo complete validations
        handleSubmit(field)
    }

    handleChange(e, {name, value}) {
        const {field} = this.state;

        this.setState({formError: false, formErrorHeader: '', formErrorContent: '', formComplete: false});
        this.setState({field: {...field, [name]: value}});
    }

    handleClear = (e) => {
        e.preventDefault();
        this.setState({
            field: {
                label:'',
                name:'',
                type:'',
            },
            formError: false,
            formErrorHeader: "",
            formErrorContent: "",
            formComplete: false,
        });
    };

    render() {
        const {field, formError, formErrorHeader, formErrorContent, formComplete} = this.state;
        const {handleCancel, submitText} = this.props;

        return (
            <Form onSubmit={this.handleSubmit} error={formError}>
                <Form.Field
                    control={Input}
                    label='Field Label'
                    placeholder='Field Label'
                    fluid
                    // value={field.label}
                    onChange={this.handleChange}
                    name='label'
                    required
                />
                <Form.Field
                    control={Input}
                    label='Input Name'
                    placeholder='Input Name'
                    fluid
                    // value={field.name}
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
                {formComplete ?
                    <Message success header='פרטי תור הושלמו' content="התור נקבע בהצלחה"/>
                    : null
                }

                <Form.Group style={{marginTop: 20}}>
                    <Form.Button positive type="submit">{submitText}</Form.Button>
                    <Form.Button negative onClick={handleCancel}>Cancel</Form.Button>
                    <Form.Button onClick={this.handleClear}>Clear</Form.Button>
                </Form.Group>
            </Form>
        )
    }
}