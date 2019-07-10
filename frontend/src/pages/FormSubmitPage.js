import React, {Component} from 'react';
import submissionsStorage from "../storage/submissions";
import {Helmet} from "react-helmet";
import {Form, Grid, Header} from "semantic-ui-react";
import constants from '../shared/constants';

export default class FormSubmitPage extends Component {
    constructor(props) {
        super(props);

        this.state = {
            submission: {
                form: this.props.location.state.form._id,
                fields: []
            },
        };
    }

    handleChange = (e, formField) => {
        const {value} = e.target;
        const {submission} = this.state;

        this.setState({formError: false, formErrorHeader: '', formErrorContent: '', formComplete: false});

        let fields = submission.fields;
        fields[formField.id] = {id: formField.id, value: value};
        this.setState({submission});
    };

    handleSubmitForm = () => {
        const {form} = this.props.location.state;
        const {submission} = this.state;

        submissionsStorage.submitForm(form.id, submission)
            .then(response => {
                this.props.history.push(`/forms/${form.id}/submissions`, {
                    form: form,
                })
            })
    };

    render() {
        const {form} = this.props.location.state;

        return (
            <div className="FormBuilderPage">

                <Helmet>
                    <title>Form Builder | Form Submit</title>
                </Helmet>

                <Grid columns='equal' padded centered textAlign='center'>
                    <Grid.Row>
                        <Header as="h1" textAlign={'right'}>
                            {form.name}
                        </Header>
                    </Grid.Row>
                    <Grid.Row>
                        <Form onSubmit={this.handleSubmitForm}>
                            {form.fields.sort((field1, field2) => field1.id - field2.id).map((field) =>
                                (
                                    <Form.Field inline name={field.name} key={field.id}>
                                        <label>{field.label}</label>
                                        <input placeholder={field.label} name={field.name} type={field.type}
                                               onChange={(e) => this.handleChange(e, field)}
                                               style={{width: 200}}/>
                                    </Form.Field>
                                )
                            )}

                            <Form.Button type='submit' positive
                                         disabled={form.fields.length === 0}>{constants.buttons.SUBMIT_FORM}</Form.Button>
                        </Form>
                    </Grid.Row>
                </Grid>
            </div>
        )
    }
}