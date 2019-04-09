const data = require('./data');

function closest(averages) {
  return averages.reduce((prev, curr) =>
    prev.average < curr.average ? prev : curr
  );
}

function findClosestAWSRegion(to, options) {
  options = options || {};
  options.data = options.data || data;
  options.filters = options.filters || [];
  options.default = options.default || options.filters[0] || 'us-east-1';

  const current = options.data.find(a => a.region === to);

  if (!current) {
    return options.default;
  }

  const values = options.filters.length
    ? Object.values(current.averages).filter(value =>
        options.filters.includes(value.regionTo)
      )
    : Object.values(current.averages);

  return closest(values).regionTo;
}

module.exports = findClosestAWSRegion;
