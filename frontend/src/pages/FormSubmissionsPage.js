import React, {Component} from 'react';
import {Helmet} from "react-helmet";
import {Container, Header, Table} from "semantic-ui-react";
import constants from "../shared/constants";
import submissionsStorage from "../storage/submissions";

export default class FormSubmissionsPage extends Component {
    constructor(props) {
        super(props);

        this.state = {
            submissions: [],
        };

        this.loadSubmissions();
    }

    loadSubmissions = () => {
        submissionsStorage.getFormSubmissions(this.props.location.state.form._id)
            .then(submissions => {
                this.setState({submissions})
            })
    };

    render() {
        const {form} = this.props.location.state;
        const {submissions} = this.state;

        return (
            <div className="FormsListPage">
                <Helmet>
                    <title>Form Builder | Form Submissions</title>
                </Helmet>

                <Container>
                    <Header as="h1">{constants.titles.FORM_SUBMISSIONS_PAGE_TITLE}</Header>

                    <Table celled striped selectable sortable textAlign='center'>
                        <Table.Header>
                            <Table.Row>
                                {form.fields.map(field =>
                                    (
                                        <Table.HeaderCell key={field.id} singleLine>{field.label}</Table.HeaderCell>
                                    )
                                )}
                            </Table.Row>
                        </Table.Header>

                        <Table.Body>
                            {submissions.map(submission =>
                                (<Table.Row key={submission.id}>
                                    {submission.fields ?
                                        submission.fields.map(field =>
                                            (<Table.Cell key={field.id} singleLine> {field.value} </Table.Cell>)
                                        )
                                        : null
                                    }
                                </Table.Row>)
                            )}
                        </Table.Body>
                    </Table>
                </Container>
            </div>
        );
    }
}