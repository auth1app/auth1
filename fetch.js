const fetchLib = require('cross-fetch');
const debug = require('debug')('fetch');
const fetch = async function(url, options = {}) {
  const headers = {
    ...options.headers
  };
  if (options.body && !options.method) {
    options.method = 'POST';
  }
  if(!options.method || options.method=== 'GET'){
    // do nothing
  }else{
    headers['Content-Type'] = 'application/json'
  }
  const finalOptions = {
    ...options,
    headers
  };
  debug('fetch url: %s, options: %o', url, finalOptions);
  const res = await fetchLib(url, finalOptions);
  debug('response status: %s', res.status);
  debug('response headers: %s', res.headers);

  if (res.status >= 400) {
    const errorBodyRaw = await res.text();
    let errorBody;
    try {
      errorBody = JSON.parse(errorBodyRaw);
    } catch (error) {
      throw new Error(
        errorBodyRaw || `Bad response from third party server, statusCode: ${res.status}`
      );
    }
    // eslint-disable-next-line no-console
    console.error('errorBodyRaw:', errorBodyRaw);
    throw new Error(
      errorBody.message || `Bad response from third party server, statusCode: ${res.status}`
    );
  }
  // check is yaml
  let result = await res.text();
  
    try {
      result = JSON.parse(result);
    } catch (error) {
      // do nothing
    }
  
  debug('fetch result: %o', result);
  return result;
};

exports.fetch = fetch