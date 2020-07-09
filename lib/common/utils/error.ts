export function apolloErrorLog(err: any) {
  if (err?.name !== 'Invariant Violation') {
    console.error(err);
  } else {
    console.log('cache no query');
  }
}

export function errorFilter(err?: any) {
  let error;
  if (err && err.response && err.response && err.response.data && err.response.data.statusCode) {
    error = {
      statusCode: err.response.data.statusCode,
      message: err.response.data.message,
    };
  } else if (err && err.statusCode) {
    error = err;
  } else if (err && err.graphQLErrors) {
    if (err.graphQLErrors instanceof Array) {
      if (err.graphQLErrors[0]) {
        if (err.graphQLErrors[0]?.extensions?.exception) {
          error = {
            statusCode: err.graphQLErrors[0].extensions.exception.status,
            message: err.graphQLErrors[0].extensions.exception.message,
          };
        } else {
          error = err.graphQLErrors[0].message;
        }
      } else {
        error = {
          statusCode: 500,
        };
      }
    } else {
      error = {
        statusCode: 500,
      };
    }
  } else {
    error = {
      statusCode: 500,
    };
  }
  return { error };
}
