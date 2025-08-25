import React from 'react';
import { Helmet } from 'react-helmet-async';
import RequestView from '../../sections/requests/view';

const Requests = () => (
  <>
    <Helmet>
      <title> Requests Page </title>
    </Helmet>

    <RequestView />
  </>
);

export default Requests;
