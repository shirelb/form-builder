import React, {Component} from 'react';
import {Helmet} from "react-helmet";
import {Button, Container, Header, Table} from "semantic-ui-react";
import constants from '../shared/constants';
import formsStorage from '../storage/forms';
import {Link} from "react-router-dom";


export default class FormsListPage extends Component {

    constructor(props) {
        super(props);

        this.state = {
            forms: [],
        };
    }

    componentDidMount() {
        this.loadForms();
    }

    loadForms = () => {
        formsStorage.getForms()
            .then(forms => {
                this.setState({forms});
            })
    };

    render() {
        const {forms} = this.state;

        return (
            <div className="FormsListPage">
                <Helmet>
                    <title>Form Builder | Forms</title>
                </Helmet>

                <Container>
                    <Header as="h1">{constants.titles.FORM_LIST_PAGE_TITLE}</Header>

                    <Link to={{pathname: constants.routs.FORM_BUILDER_PAGE}}>
                        <Button positive>{constants.buttons.ADD_FORM}</Button>
                    </Link>

                    <Table celled striped selectable sortable textAlign='center'>
                        <Table.Header>
                            <Table.Row>
                                <Table.HeaderCell singleLine>{constants.headers.FORM_ID_HEADER}</Table.HeaderCell>
                                <Table.HeaderCell>{constants.headers.FORM_NAME_HEADER}</Table.HeaderCell>
                                <Table.HeaderCell>{constants.headers.FORM_SUBMISSIONS_HEADER}</Table.HeaderCell>
                                <Table.HeaderCell>{constants.headers.FORM_SUBMIT_PAGE_HEADER}</Table.HeaderCell>
                                <Table.HeaderCell>{constants.headers.FORM_SUBMISSIONS_PAGE_HEADER}</Table.HeaderCell>
                            </Table.Row>
                        </Table.Header>

                        <Table.Body>
                            {forms.map(form =>
                                (<Table.Row key={form.id}>
                                    <Table.Cell singleLine> {form.id} </Table.Cell>
                                    <Table.Cell singleLine>
                                        <Header as='h3' textAlign='center'>
                                            {form.name}
                                        </Header>
                                    </Table.Cell>
                                    <Table.Cell singleLine>{form.submissionsNum}</Table.Cell>
                                    <Table.Cell>
                                        <Link to={{
                                            pathname: `/forms/${form.id}/submit`,
                                            state: {form: form}
                                        }}>
                                            View
                                        </Link>
                                    </Table.Cell>
                                    <Table.Cell>
                                        <Link to={{
                                            pathname: `/forms/${form.id}/submissions`,
                                            state: {form: form}
                                        }}>
                                            View
                                        </Link>
                                    </Table.Cell>
                                </Table.Row>)
                            )}
                        </Table.Body>
                    </Table>
                </Container>
            </div>
        )
    };
}

