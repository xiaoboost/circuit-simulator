import browserEnv from 'browser-env';

import './mock/require';

browserEnv(['localStorage', 'sessionStorage'], {
  url: "http://localhost"
});
