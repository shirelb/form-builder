import React from 'react';
import {Helmet} from 'react-helmet';
import FieldForm from "./FieldForm";
import {Grid, Header, Modal} from "semantic-ui-react";
import constants from '../shared/constants'

export default class FieldAdd extends React.Component {
    constructor(props) {
        super(props);

        this.handleCancel = this.handleCancel.bind(this);
    }

    componentDidMount() {
    }

    handleCancel(e) {
        e.preventDefault();

        this.props.closeModal();
    }

    render() {
        const {visible, handleSubmit} = this.props;

        return (
            <Modal size='tiny' open={visible} dimmer="blurring" closeIcon onClose={this.props.closeModal}>
                <Helmet>
                    <title>Form Builder | Add Field</title>
                </Helmet>

                <Grid padded>
                    <Grid.Column>

                        <Header as="h1">{constants.buttons.ADD_FIELD}</Header>

                        <FieldForm
                            submitText="Add"
                            handleSubmit={handleSubmit}
                            handleCancel={this.handleCancel}
                        />
                    </Grid.Column>
                </Grid>
            </Modal>
        );
    }
}