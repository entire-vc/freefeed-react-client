import React from 'react';
import { Link } from 'react-router';

export default () => (
  <div className="box-body">
    <p>
      Entire VC is an open community for the exchange of knowledge, information and communications
      for those people who create companies, products and new ideas. We are focused on
      entrepreneurship, science and technology.
    </p>

    <p>
      <a href="https://in.entire.vc/" target="blank">
        Learn more about us and our principles.
      </a>
    </p>

    <p>
      <b>
        <Link to="/signup" className="inline-header">
          Sign up
        </Link>
      </b>{' '}
      now or{' '}
      <Link to="/signin" className="inline-header">
        sign in
      </Link>{' '}
      if you already have an account.
    </p>
  </div>
);
