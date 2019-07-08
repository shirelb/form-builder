import React, {Component} from 'react';

import {Button, Form, Grid, Header, Icon, Input} from 'semantic-ui-react'
import {Helmet} from "react-helmet";
import constants from "../shared/constants";
import FieldAdd from "../components/FieldAdd";
import formsStorage from "../storage/forms";


export default class FormBuilderPage extends Component {
    constructor(props) {
        super(props);

        this.state = {
            form: {
                name: constants.titles.FORM_BUILDER_PAGE_TITLE,
                fields: []
            },

            fieldAddModalVisible: false,
            formNameInputVisible: false,
        };
    }

    toggleNewFieldModalVisible = () => {
        this.setState({fieldAddModalVisible: !this.state.fieldAddModalVisible})
    };

    addNewField = (field) => {
        const {form} = this.state;

        let fields = form.fields;
        field.id = fields.length;
        fields.push(field);
        this.setState({form: form});
        this.toggleNewFieldModalVisible();
    };

    changeFormName = (e, formName) => {
        const {form} = this.state;
        this.setState({form: {...form, name: formName.value}});
    };

    handleSaveForm = () => {
        const {form} = this.state;

        formsStorage.saveForm(form)
            .then(response => {
                this.props.history.push('/formsList')
            })
    };

    render() {
        const {fieldAddModalVisible, formNameInputVisible, form} = this.state;

        return (
            <div className="FormBuilderPage">

                <Helmet>
                    <title>Form Builder | Form Builder</title>
                </Helmet>

                <Grid columns='equal' padded centered textAlign='center'>
                    <Grid.Row columns={2}>
                        <Grid.Column>
                            <Header as="h1" textAlign={'right'}>
                                {formNameInputVisible ?
                                    <Input value={form.name} onChange={this.changeFormName}/>
                                    :
                                    form.name
                                }
                            </Header>
                        </Grid.Column>
                        <Grid.Column>
                            <Icon name={formNameInputVisible ? 'check' : 'edit'}
                                  onClick={() => this.setState({formNameInputVisible: !formNameInputVisible})}/>
                        </Grid.Column>
                    </Grid.Row>
                    <Grid.Row>
                        <Button positive icon labelPosition='left' onClick={this.toggleNewFieldModalVisible}>
                            <Icon name='add'/>
                            {constants.buttons.ADD_FIELD}
                        </Button>
                        <FieldAdd
                            visible={fieldAddModalVisible}
                            closeModal={this.toggleNewFieldModalVisible}
                            handleSubmit={this.addNewField}
                        />
                    </Grid.Row>
                    <Grid.Row>
                        <Form onSubmit={this.handleSaveForm}>
                            {form.fields.map((field) =>
                                (
                                    <Form.Field inline name={field.name} key={field.id}>
                                        <label>{field.label}</label>
                                        <input placeholder={field.label} name={field.name} type={field.type} style={{width:200}}/>
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