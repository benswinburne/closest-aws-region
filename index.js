const data = require('./data.json');

function closest(averages) {
  return Object.keys(averages).reduce((key, v) =>
    averages[v] < averages[key] ? v : key
  );
}

function findClosestAWSRegion(to, options) {
  options = options || {};
  options.data = options.data || data;
  options.filters = options.filters || [];
  options.default = options.default || options.filters[0] || 'us-east-1';

  const current = options.data[to];

  if (!current) {
    return options.default;
  }

  if (options.excludeTo) {
    delete current[to];
  }

  const filtered = options.filters.length
    ? Object.entries(current).reduce((prev, [region, ping]) => {
        return options.filters.includes(region)
          ? { ...prev, [region]: ping }
          : prev;
      }, {})
    : current;

  return Object.keys(filtered).length ? closest(filtered) : options.default;
}

module.exports = findClosestAWSRegion;
