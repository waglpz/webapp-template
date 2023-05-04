const options2HttpQuery = (options) => {
  const queryOptions = new URLSearchParams();
  Object.keys(options).forEach((key) => {
    if (options[key]) {
      queryOptions.append(key, options[key]);
    }
  });

  return `?${queryOptions.toString()}`;
};

export default options2HttpQuery;
