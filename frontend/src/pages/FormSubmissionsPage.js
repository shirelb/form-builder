import React, {Component} from 'react';
import {Helmet} from "react-helmet";
import {Button, Container, Header, Icon, Message, Table} from "semantic-ui-react";
import constants from "../shared/constants";
import submissionsStorage from "../storage/submissions";
import {Link} from "react-router-dom";
import formsStorage from "../storage/forms";

export default class FormSubmissionsPage extends Component {
    constructor(props) {
        super(props);

        this.state = {
            submissions: [],

            showError: false,
            errorHeader: '',
            errorContent: '',
        };
    }

    componentWillMount() {
        this.loadSubmissions();
    }

    loadSubmissions = () => {
        if (this.props.location.state) {
            if (this.props.location.state.form)
                submissionsStorage.getFormSubmissions(this.props.location.state.form.id)
                    .then(response => {
                        if (response.success) {
                            let submissions = response.data;
                            this.setState({submissions, form: this.props.location.state.form})
                        } else
                            this.showErrorMessage('Error getting submissions', response.error);
                    });
        } else {
            formsStorage.getFormById(this.props.match.params.formId)
                .then(response => {
                    if (response.success) {
                        let formRes = response.data;
                        this.setState({
                            form: formRes
                        });
                    } else
                        this.showErrorMessage('Error getting form', response.error);
                });
            submissionsStorage.getFormSubmissions(this.props.match.params.formId)
                .then(response => {
                    if (response.success) {
                        let submissions = response.data;
                        this.setState({submissions})
                    } else
                        this.showErrorMessage('Error getting submissions', response.error);
                })
        }
    };

    showErrorMessage = (errorHeader, errorMsg) => {
        this.setState({
            showError: true,
            errorHeader: errorHeader,
            errorContent: errorMsg,
        })
    };

    deleteSubmission = (submission) => {
        submissionsStorage.deleteSubmission(this.state.form.id, submission.id)
            .then(response => {
                this.setState({submissions: response.data});
            })
    };

    render() {
        const {form, submissions, showError, errorHeader, errorContent} = this.state;

        return (
            <div className="FormsListPage">
                <Helmet>
                    <title>Form Builder | Form Submissions</title>
                </Helmet>

                <Container>
                    <Header as="h1">{constants.titles.FORM_SUBMISSIONS_PAGE_TITLE}</Header>

                    {showError ?
                        <div>
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
                            <Table celled striped selectable sortable textAlign='center'>
                                <Table.Header>
                                    <Table.Row>
                                        <Table.HeaderCell singleLine/>
                                        {form.fields.sort((field1, field2) => field1.id - field2.id).map(field =>
                                            (
                                                <Table.HeaderCell key={field.id}
                                                                  singleLine>{field.label}</Table.HeaderCell>
                                            )
                                        )}
                                    </Table.Row>
                                </Table.Header>

                                <Table.Body>
                                    {submissions.map(submission =>
                                        (<Table.Row key={submission.id}>
                                            <Table.Cell singleLine>
                                                <Icon name={'delete'}
                                                      onClick={this.deleteSubmission.bind(this, submission)}/>
                                            </Table.Cell>
                                            {submission.fields ?
                                                submission.fields.sort((field1, field2) => field1.id - field2.id).map(field =>
                                                    (<Table.Cell key={field.id} singleLine> {field.value} </Table.Cell>)
                                                )
                                                : null
                                            }
                                        </Table.Row>)
                                    )}
                                </Table.Body>
                            </Table>
                            : null
                    }
                </Container>
            </div>
        );
    }
}