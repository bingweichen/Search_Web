import React, { Component, PropTypes } from 'react';
import { Router, Route, IndexRoute, Link } from 'react-router';
import styles from './MainLayout.less';

const MainLayout = ({ children }) => {
  return (
    <div className={styles.normal}>
      <div className={styles.head}>
        <h1>Search system</h1>
      </div>
      <div className={styles.content}>
        <div className={styles.side}>
          <h2>Route: </h2>
          <Link to="/">Search</Link><br />
          <Link to="/graph">Graph</Link><br />
          <Link to="/testd3">testd3</Link><br />

        </div>
        <div className={styles.main}>
          {children}
        </div>
      </div>

    </div>
  );
};

MainLayout.propTypes = {
  children: PropTypes.element.isRequired,
};

export default MainLayout;

/*
 <div className={styles.foot}>
 Built with react, react-router, ant-tool, css-modules, antd...
 </div>
 */
