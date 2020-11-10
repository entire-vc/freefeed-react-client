/* global CONFIG */
import { encode as qsEncode } from 'querystring';
import React, { useEffect, useMemo } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link } from 'react-router';

import { signedIn } from '../redux/action-creators';
import ErrorBoundary from './error-boundary';
import { providerTitle, useExtAuthProviders } from './ext-auth-helpers';
import { CookiesBanner } from './cookies-banner';
import { ExtAuthButtons } from './ext-auth-buttons';

export default React.memo(function SignInPage() {
  return (
    <div className="box">
      <div className="box-header-timeline">Sign in</div>
      <div className="box-body">
        <div className="col-md-12">
          <h2 className="p-signin-header"> </h2>
          <CookiesBanner />
          <ErrorBoundary>
            <ExtAuthSignIn />
          </ErrorBoundary>
        </div>
      </div>
      <div className="box-footer" />
    </div>
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
