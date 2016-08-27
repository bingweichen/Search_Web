import React, { PropTypes } from 'react';
import { Router, Route, IndexRoute, Link } from 'react-router';
import App from '../components/App';
import NotFound from '../components/NotFound';

import SearchTable from "../components/SearchTable";
import Graph from "../components/Graph"

import Testd3 from "../components/Testd3"


const Routes = ({ history }) =>
  <Router history={history}>
    <Route path="/" component={App} >
      <IndexRoute component={SearchTable}/>
      <Route path="/graph" component={Graph} />
      <Route path="/testd3" component={Testd3} />


    </Route>




    <Route path="*" component={NotFound}/>
  </Router>;

Routes.propTypes = {
  history: PropTypes.any,
};

export default Routes;
