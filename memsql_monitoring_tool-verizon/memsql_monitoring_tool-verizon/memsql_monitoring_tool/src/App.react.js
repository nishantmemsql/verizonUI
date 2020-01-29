import React, { useEffect } from "react";
import { connect } from "react-redux";
import * as filterActions from "./redux/actions/filterActions";

import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import {
  LoginPage,
  RegisterPage,
  Error400,
  Error401,
  Error403,
  Error404,
  Error500,
  Error503,
  ProfilePage,
} from "./pages";

import { getTimeWindow, convertTimestamp } from "./helpers";

import HomePage from "./HomePage.react";
import ChartsPage from "./interface/ChartsPage.react";
import LogPage from "./pages/LogPage.react";
import Tickets from "./pages/Tickets";
import Processlist from "./pages/Processlist";
import Ash from "./pages/ash";
import ClusterStats from "./pages/ClusterStats";

import "tabler-react/dist/Tabler.css";
import MvEvents from "./pages/MvEvents";
import Threads from "./pages/Threads";
import CustomSQL from "./pages/CustomSQL";

const App = props => {
  useEffect(() => {
    props.setFromTs(convertTimestamp(getTimeWindow()[0]));
    props.setToTs(convertTimestamp(getTimeWindow()[1]));
  }, []);

  return (
    <React.StrictMode>
      <Router>
        <Switch>
          <Route exact path="/logs" component={LogPage} />
          <Route exact path="/" component={HomePage} />
          <Route exact path="/400" component={Error400} />
          <Route exact path="/401" component={Error401} />
          <Route exact path="/403" component={Error403} />
          <Route exact path="/404" component={Error404} />
          <Route exact path="/500" component={Error500} />
          <Route exact path="/503" component={Error503} />
          <Route exact path="/charts" component={ChartsPage} />
          <Route exact path="/login" component={LoginPage} />
          <Route exact path="/profile" component={ProfilePage} />
          <Route exact path="/register" component={RegisterPage} />
          <Route exact path="/tickets" component={Tickets} />
          <Route exact path="/processlist" component={Processlist} />
          <Route exact path="/events" component={MvEvents} />
          <Route exact path="/threads" component={Threads} />
          <Route exact path="/custom" component={CustomSQL} />
          <Route exact path="/ash" component={Ash} />
          <Route exact path="/cluster-stats" component={ClusterStats} />
          <Route component={Error404} />
        </Switch>
      </Router>
    </React.StrictMode>
  );
};

const mapStateToProps = state => {
  return {
    fromTs: state.filters.fromTs,
    toTs: state.filters.toTs,
  };
};

const mapDispatchToProps = dispatch => {
  return {
    setFromTs: t => dispatch(filterActions.setFromTs(t)),
    setToTs: t => dispatch(filterActions.setToTs(t)),
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(App);
