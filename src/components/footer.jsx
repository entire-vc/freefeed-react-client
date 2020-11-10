/* global CONFIG */
import React from 'react';
import { Link } from 'react-router';
import { connect } from 'react-redux';

import {
  SCHEME_DARK,
  SCHEME_SYSTEM,
  SCHEME_LIGHT,
  systemColorSchemeSupported,
} from '../services/appearance';
import { setUserColorScheme } from '../redux/action-creators';
import { InvisibleSelect } from './invisibe-select';

const SideBarAppearance = connect(
  ({ userColorScheme }) => ({ userColorScheme }),
  (dispatch) => ({ onChange: (e) => dispatch(setUserColorScheme(e.target.value)) }),
)(({ userColorScheme, onChange }) => {
  let value = userColorScheme;
  if (!systemColorSchemeSupported && value === SCHEME_SYSTEM) {
    value = SCHEME_LIGHT;
  }
  const style = {
    float: 'right',
    paddingTop: '10px',
  };
  return (
    <div style={style}>
      Color Scheme:{' '}
      <InvisibleSelect value={value} onChange={onChange} className="color-scheme-selector">
        <option value={SCHEME_LIGHT}>Light</option>
        {systemColorSchemeSupported && <option value={SCHEME_SYSTEM}>Auto</option>}
        <option value={SCHEME_DARK}>Dark</option>
      </InvisibleSelect>{' '}
      <span className="color-scheme-hint">
        {value === SCHEME_LIGHT ? 'default' : value === SCHEME_SYSTEM ? 'as in your OS' : null}
      </span>
    </div>
  );
});

export default () => (
  <footer className="footer">
    &copy; {CONFIG.siteTitle}
    <br />
    <Link to="https://in.entire.vc/">About</Link>
    {' | '}
    <a href="https://in.entire.vc/faq/" target="_blank">
      FAQ
    </a>
    {' | '}
    <Link to="https://in.entire.vc/legal/terms">Terms</Link>
    {' | '}
    <Link to="https://in.entire.vc/legal/privacy-policy">Privacy</Link>
    {' | '}
    Powered by <a href="https://venture-crew.com">Venture Crew</a>
    <SideBarAppearance />
  </footer>
);
