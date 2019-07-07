import React, {Component} from 'react';
import 'semantic-ui-css/semantic.min.css';
import {Button, Icon, Menu, Sidebar} from 'semantic-ui-react';
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
            visible: false
        };
    }

    componentDidMount() {

    }

    handleHideClick = () => this.setState({visible: false})
    handleShowClick = () => this.setState({visible: true})
    handleSidebarHide = () => this.setState({visible: false})

    render() {
        const {visible} = this.state;

        return (
            <Router>
                <Route
                    render={({location}) => (
                        <div style={styles.fill}>
                            <Route
                                exact
                                path="/"
                                render={() => <Redirect to="/formsList"/>}
                            />

                            <Button.Group>
                                <Button disabled={visible} onClick={this.handleShowClick}>
                                    Show sidebar
                                </Button>
                                <Button disabled={!visible} onClick={this.handleHideClick}>
                                    Hide sidebar
                                </Button>
                            </Button.Group>

                            <Sidebar as={Menu} inverted onHide={this.handleSidebarHide}
                                     visible={visible} animation='push' width="thin" icon="labeled"
                                     direction="top">
                                <Menu.Item name="formsList" as={NavLink} to="/formsList">
                                    <Icon name={constants.pagesIconsNames["formsList"]}/>
                                    {constants.titles.FORM_LIST_PAGE_TITLE}
                                </Menu.Item>
                                <Menu.Item name="formBuilder" as={NavLink} to="/formBuilder">
                                    <Icon name={constants.pagesIconsNames["formBuilder"]}/>
                                    {constants.titles.FORM_BUILDER_PAGE_TITLE}
                                </Menu.Item>
                                <Menu.Item name="submitForm" as={NavLink} to="/submitForm">
                                    <Icon name={constants.pagesIconsNames["submitForm"]}/>
                                    {constants.titles.FORM_SUBMIT_PAGE_TITLE}
                                </Menu.Item>
                                <Menu.Item name="formSubmissions" as={NavLink} to="/formSubmissions">
                                    <Icon name={constants.pagesIconsNames["formSubmissions"]}/>
                                    {constants.titles.FORM_SUBMISSIONS_PAGE_TITLE}
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
                                            {/*<Route exact path="/hsl/:h/:s/:l" component={HSL}/>*/}
                                            {/*<Route exact path="/rgb/:r/:g/:b" component={RGB}/>*/}
                                            {/* Without this `Route`, we would get errors during
                    the initial transition from `/` to `/hsl/10/90/50`
                                        */}
                                            <Route exec path={`/formsList`} component={FormsListPage}/>
                                            <Route exec path={`/formBuilder`} component={FormBuilderPage}/>
                                            <Route exec path={`/form/:formId/submit`} component={FormSubmitPage}/>
                                            <Route exec path={`/form/:formId/submissions`} component={FormSubmissionsPage}/>
                                            {/*<Route component={PageNotFound}/>*/}
                                            <Route render={() => <div>Not Found</div>}/>
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