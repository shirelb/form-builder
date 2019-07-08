import React from 'react';
import {Helmet} from 'react-helmet';
import FieldForm from "./FieldForm";
import {Grid, Header, Modal} from "semantic-ui-react";
import constants from '../shared/constants'

export default class FieldAdd extends React.Component {

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
                            submitText={constants.buttons.SAVE_FIELD}
                            handleSubmit={handleSubmit}
                            handleCancel={this.props.closeModal}
                        />
                    </Grid.Column>
                </Grid>
            </Modal>
        );
    }
}