import React, {Component} from 'react';
import 'semantic-ui-css/semantic.min.css';
import {Button, Header, Icon, Menu, Sidebar} from 'semantic-ui-react';
import {BrowserRouter as Router, NavLink, Redirect, Route, Switch} from 'react-router-dom';
import {CSSTransition, TransitionGroup} from "react-transition-group";
import constants from './shared/constants';
import FormSubmissionsPage from './pages/FormSubmissionsPage';
import FormSubmitPage from './pages/FormSubmitPage';
import FormBuilderPage from './pages/FormBuilderPage';
import FormsListPage from './pages/FormsListPage';

export default class MainPage extends Component {

    constructor(props) {
        super(props);

        this.state = {
            menuVisible: false
        };
    }

    componentDidMount() {

    }

    toggleMenuVisibility = () => this.setState({menuVisible: !this.state.menuVisible});

    render() {
        const {menuVisible} = this.state;

        return (
            <Router>
                <Route
                    render={({location}) => (
                        <div style={styles.fill}>
                            <Route
                                exact
                                path="/"
                                render={() => <Redirect to={constants.routs.FORM_LIST_PAGE}/>}
                            />

                            <Button color='facebook' size='large' icon labelPosition='left' disabled={menuVisible}
                                    onClick={this.toggleMenuVisibility}>
                                <Icon name='bars'/>
                                Menu
                            </Button>

                            <Sidebar as={Menu} inverted onHide={this.toggleMenuVisibility} visible={menuVisible}
                                     animation='push' width="thin" icon="labeled" direction="top">
                                <Menu.Item name="formsList" as={NavLink} to={constants.routs.FORM_LIST_PAGE}>
                                    <Icon name={constants.pagesIconsNames["formsList"]}/>
                                    {constants.titles.FORM_LIST_PAGE_TITLE}
                                </Menu.Item>
                                <Menu.Item name="formBuilder" as={NavLink} to={constants.routs.FORM_BUILDER_PAGE}>
                                    <Icon name={constants.pagesIconsNames["formBuilder"]}/>
                                    {constants.titles.FORM_BUILDER_PAGE_TITLE}
                                </Menu.Item>
                            </Sidebar>

                            <div style={styles.content}>
                                <TransitionGroup>
                                    <CSSTransition
                                        key={location.key}
                                        classNames="fade"
                                        timeout={300}
                                    >
                                        <Switch location={location}>
                                            <Route exec path={constants.routs.FORM_BUILDER_PAGE}
                                                   component={FormBuilderPage}/>
                                            <Route exec path={constants.routs.FORM_SUBMIT_PAGE}
                                                   component={FormSubmitPage}/>
                                            <Route exec path={constants.routs.FORM_SUBMISSIONS_PAGE}
                                                   component={FormSubmissionsPage}/>
                                            <Route exec path={constants.routs.FORM_LIST_PAGE}
                                                   component={FormsListPage}/>
                                            <Route render={() =>
                                                <Header as="h1"> {constants.titles.PAGE_NOT_FOUND_TITLE}</Header>}
                                            />
                                        </Switch>
                                    </CSSTransition>
                                </TransitionGroup>
                            </div>
                        </div>
                    )}
                />
            </Router>
        );
    }
}

const styles = {};

styles.fill = {
    position: "absolute",
    left: 0,
    right: 0,
    top: 0,
    bottom: 0
};

styles.content = {
    ...styles.fill,
    top: "40px",
    textAlign: "center"
};