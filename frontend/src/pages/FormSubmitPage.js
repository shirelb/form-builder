import React, {Component} from 'react';
import submissionsStorage from "../storage/submissions";
import formsStorage from "../storage/forms";
import {Helmet} from "react-helmet";
import {Button, Form, Grid, Header, Message} from "semantic-ui-react";
import constants from '../shared/constants';
import {Link} from "react-router-dom";

const globalName = "grecaptcha";

export default class FormSubmitPage extends Component {
    constructor(props) {
        super(props);

        this.state = {
            submission: {
                form: null,
                recaptchaResponse: null,
                fields: [],

                showError: false,
                errorHeader: '',
                errorContent: '',
            },
        };
    }

    componentWillMount() {
        this.loadForm();
    }

    loadForm = () => {
        if (this.props.location.state) {
            if (this.props.location.state.form)
                this.setState({
                    submission: {
                        form: this.props.location.state.form._id,
                        fields: []
                    },
                    form: this.props.location.state.form
                });
        } else
            formsStorage.getFormById(this.props.match.params.formId)
                .then(response => {
                    if (response.success) {
                        let formRes = response.data;
                        this.setState({
                            submission: {
                                form: formRes._id,
                                fields: []
                            },
                            form: formRes
                        });
                    } else
                        this.showErrorMessage('Error getting form', response.error);
                })
    };

    showErrorMessage = (errorHeader, errorMsg) => {
        this.setState({
            showError: true,
            errorHeader: errorHeader,
            errorContent: errorMsg,
        })
    };

    handleChange = (e, formField) => {
        const {value} = e.target;
        const {submission} = this.state;

        this.setState({
            formError: false,
            formErrorHeader: '',
            formErrorContent: '',
            formComplete: false,
            showLabel: false
        });

        let fields = submission.fields;
        fields[formField.id] = {id: formField.id, value: value};
        this.setState({submission});
    };

    handleSubmitForm = () => {
        const {form} = this.state;
        const {submission} = this.state;

        this.setState({showLabel: false});

        if (document.getElementById("recaptchaResponse").value !== null && document.getElementById("recaptchaResponse").value !== '') {
            submission.recaptchaResponse = document.getElementById("recaptchaResponse").value;

            submissionsStorage.submitForm(form.id, submission)
                .then(response => {
                    if (response.success)
                        this.props.history.push(`/forms/${form.id}/submissions`, {
                            form: form,
                        });
                    else
                        this.showErrorMessage('Error submitting', response.error);
                })
        } else {
            this.setState({showLabel: true})
        }
    };

    render() {
        const {form, showError, showLabel, errorHeader, errorContent} = this.state;

        return (
            <div className="FormBuilderPage">

                <Helmet>
                    <title>Form Builder | Form Submit</title>
                </Helmet>

                {showError ?
                    <div>
                        <Header as="h1">
                            Form Submit
                        </Header>
                        <Message
                            style={{marginTop: 20}}
                            error
                            header={errorHeader}
                            content={errorContent}
                        />
                        <Link to={{pathname: constants.routs.FORM_LIST_PAGE}}>
                            <Button positive>{constants.buttons.BACK_TO_FORMS_LISTS}</Button>
                        </Link>
                    </div>
                    :
                    form ?
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

                                    <Form.Field inline hidden name="recaptchaResponse">
                                        <input type='text' id='recaptchaResponse'/>
                                    </Form.Field>

                                    <div
                                        id="captcha_element"
                                    />

                                    {showLabel ?
                                        <label style={{color: 'red'}}>dont forget the captcha</label>
                                        : null
                                    }

                                    <Form.Button type='submit' positive
                                                 disabled={form.fields.length === 0}>{constants.buttons.SUBMIT_FORM}</Form.Button>
                                </Form>
                            </Grid.Row>
                        </Grid>
                        : null
                }
            </div>
        )
    }
}