import React, {Component} from 'react';
import submissionsStorage from "../storage/submissions";
import {Helmet} from "react-helmet";
import {Form, Grid, Header} from "semantic-ui-react";

export default class FormSubmitPage extends Component {
    constructor(props) {
        super(props);

        this.state = {
            submission: {
                formId: this.props.location.state.form.id,
                fields: []
            },
        };
    }

    handleChange = (e, formField) => {
        const {name, value} = e.target;
        const {submission} = this.state;

        this.setState({formError: false, formErrorHeader: '', formErrorContent: '', formComplete: false});

        let fields = submission.fields;
        fields[formField.id] = {id: formField.id, name: name, value: value};
        this.setState({submission});
    };

    handleSubmitForm = () => {
        const {form} = this.props.location.state;
        const {submission} = this.state;

        submissionsStorage.submitForm(form.id, submission)
            .then(response => {
                this.props.history.replace(`/form/${form.id}/submissions`, {
                    form: form,
                })
            })
    };

    render() {
        const {form} = this.props.location.state;
        const {submission} = this.state;

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
                            {form.fields.map((field) =>
                                (
                                    /*<Form.Input
                                        inline
                                        name={field.name}
                                        key={field.id}
                                        label={field.label}
                                        placeholder={field.label}
                                        type={field.type}
                                        onChange={(e, data) => this.handleChange(e, data, field)}
                                        style={{width:200}}
                                    />*/
                                    <Form.Field inline name={field.name} key={field.id}>
                                        <label>{field.label}</label>
                                        <input placeholder={field.label} name={field.name} type={field.type}
                                               onChange={(e) => this.handleChange(e, field)}
                                               style={{width: 200}}/>
                                    </Form.Field>
                                )
                            )}

                            <Form.Button type='submit' disabled={form.fields.length === 0}>Save</Form.Button>
                        </Form>
                    </Grid.Row>
                </Grid>
            </div>
        )
    }
}