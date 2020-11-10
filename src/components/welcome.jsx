/* global CONFIG */
import { encode as qsEncode } from 'querystring';
import React, { useEffect, useCallback, useMemo } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link } from 'react-router';

import { signedIn } from '../redux/action-creators';
import ErrorBoundary from './error-boundary';
import SignupForm from './signup-form';
import { useExtAuthProviders, providerTitle } from './ext-auth-helpers';
import { ExtAuthButtons, SIGN_UP } from './ext-auth-buttons';

export default () => {
  const withExtProfile = useSelector((state) => state.extAuth.signInResult.status === 'continue');
  return (
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
      {withExtProfile ? <SignupForm /> : <ExtAuthSignup />}
      <p>
        <b>
          {/* <Link to="/signup" className="inline-header"> */}
          Sign up
          {/* </Link> */}
        </b>{' '}
        now or {/* <Link to="/signin" className="inline-header"> */}
        <b>sign in</b> {/* </Link>{' '} */}
        if you already have an account.
      </p>
      <ErrorBoundary>
        <ExtAuthSignIn />
      </ErrorBoundary>
    </div>
  );
};

const ExtAuthSignup = React.memo(function ExtAuthSignup() {
  const dispatch = useDispatch();
  const [providers] = useExtAuthProviders();
  const result = useSelector((state) => state.extAuth.signInResult);

  // No deps: we are specifically intresting in the initial value of result.
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const comeWithResult = useMemo(() => !!result.status, []);

  const doSignIn = useCallback(() => dispatch(signedIn(result.authToken)), [
    dispatch,
    result.authToken,
  ]);

  // Do not show anything if we open this page with auth result
  // or there are no allowed providers
  if (comeWithResult || providers.length === 0) {
    return null;
  }

  return (
    <>
      <ExtAuthButtons mode={SIGN_UP} />
      {result.status === 'signed-in' && (
        <div className="alert alert-success" role="alert">
          <p>
            This {providerTitle(result.profile.provider)} account is already connected to{' '}
            <strong>@{result.user.username}</strong> {CONFIG.siteTitle} account. Is it you?
          </p>
          <p>
            <button className="btn btn-success" onClick={doSignIn}>
              Sign in and continue as <strong>@{result.user.username}</strong>
            </button>
          </p>
        </div>
      )}
      {result.status === 'continue' && (
        <div className="alert alert-success" role="alert">
          <p>Excellent! Now you can edit the form above and create a new account.</p>
        </div>
      )}
      {result.status === 'user-exists' && (
        <div className="alert alert-warning" role="alert">
          <p>
            There is already a {CONFIG.siteTitle} account with the address{' '}
            <strong>{result.profile.email}</strong>.
          </p>
          <p>
            If this is you, you should <Link to="/signin">sign in</Link> with your username/email
            and password or in any other way allowed for your account.
          </p>
          <p>
            If you have forgotten your password, you can{' '}
            <Link to={`/restore?${qsEncode({ email: result.profile.email })}`}>
              reset it and set the new one
            </Link>
            .
          </p>
        </div>
      )}
    </>
  );
});

const ExtAuthSignIn = React.memo(function ExtAuthSignIn() {
  const dispatch = useDispatch();
  const [providers] = useExtAuthProviders();
  const result = useSelector((state) => state.extAuth.signInResult);

  const resultProfileProvider = useMemo(
    () => providers.find((p) => p.id === result?.profile?.provider),
    [providers, result],
  );

  useEffect(() => {
    result.status === 'signed-in' && dispatch(signedIn(result.authToken));
  }, [dispatch, result]);

  if (providers.length === 0) {
    // No allowed providers so do not show anything
    return null;
  }

  return (
    <>
      <ExtAuthButtons />
      {result.status === 'user-exists' && (
        <div className="alert alert-warning" role="alert">
          <p>
            There is a {CONFIG.siteTitle} account with the email address{' '}
            <strong>{result.profile.email}</strong>, but your account{' '}
            <strong>
              {providerTitle(resultProfileProvider, { withText: false })} {result.profile.name}
            </strong>{' '}
            is not connected to it.
          </p>
          <p>
            If this is you, you should login using the form above with your username/email and
            password or in any other way allowed for your account.
          </p>
          <p>
            If you have forgotten your password, you can{' '}
            <Link to={`/restore?${qsEncode({ email: result.profile.email })}`}>
              reset it and set the new one
            </Link>
            .
          </p>
        </div>
      )}
      {result.status === 'continue' && (
        <div className="alert alert-warning" role="alert">
          <p>
            The{' '}
            <strong>
              {providerTitle(resultProfileProvider, { withText: false })} {result.profile.name}
            </strong>{' '}
            account is not connected to any {CONFIG.siteTitle} account. Do you want to create a new{' '}
            {CONFIG.siteTitle} account based on its data? After creation you will be able to sign in
            using this {providerTitle(resultProfileProvider, { withText: true, withIcon: false })}{' '}
            account.
          </p>
          <p>
            <Link to="/signup" className="btn btn-success">
              Continue to create an account&hellip;
            </Link>
          </p>
        </div>
      )}
    </>
  );
});
