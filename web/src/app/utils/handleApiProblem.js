export const handleApiProblem = (error, callback) => {
  const errorData = (error && error.response && error.response.data);
  const errorStatus = errorData ? errorData.status : error.response.status;

  if (errorStatus >= 400) {
    if (errorStatus === 401) {
      callback({title: 'Unauthorized', detail: ''})
    } else if (errorStatus === 403) {
      callback({title: 'Forbidden', detail: ''})
    } else {
      callback(errorData);
    }
  }
};
