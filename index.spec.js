const findClosestAWSRegion = require('./index');
const data = require('./data.json');

describe('when not limiting available regions', () => {
  test('it should find itself', () => {
    Object.entries(data).forEach(([region]) => {
      const closest = findClosestAWSRegion(region);

      expect(region).toBe(closest);
    });
  });
});

describe('when limiting available regions', () => {
  describe('and the filtered regions are eu-west-1 and us-east-1', () => {
    const tests = {
      'eu-west-1': ['ap-southeast-1', 'eu-central-1', 'eu-west-2'],
      'us-east-1': ['sa-east-1', 'us-east-2', 'us-west-2'],
    };

    Object.entries(tests).forEach(([target, regions]) => {
      regions.forEach(region => {
        test(`it should find ${target} when in ${region}`, () => {
          const closest = findClosestAWSRegion(region, {
            filters: Object.keys(tests),
          });

          expect(closest).toBe(target);
        });
      });
    });
  });

  describe('and the filtered regions are sa-east-1 and ap-northeast-1', () => {
    const tests = {
      'ap-northeast-1': ['ap-southeast-1', 'us-west-2', 'ap-southeast-2'],
      'sa-east-1': ['sa-east-1', 'eu-west-2', 'eu-central-1'],
    };

    Object.entries(tests).forEach(([target, regions]) => {
      regions.forEach(region => {
        test(`it should find ${target} when in ${region}`, () => {
          const closest = findClosestAWSRegion(region, {
            filters: Object.keys(tests),
          });

          expect(closest).toBe(target);
        });
      });
    });
  });
});

describe('using a custom data source', () => {
  function pretendAPICallToCloudping() {
    return new Promise(resolve => {
      resolve({
        'not-a-region': {
          'closest-fake-region': 7.14,
          'further-away': 153.81,
        },
      });
    });
  }

  test('it should search within the custom data rather than the static defaults', async () => {
    const closest = findClosestAWSRegion('not-a-region', {
      data: await pretendAPICallToCloudping(),
    });

    expect('closest-fake-region').toBe(closest);
  });
});

describe('when handling defaults in the case of missing/incorrect region', () => {
  test('it should fall back to the default option if present', () => {
    const closest = findClosestAWSRegion('not-a-region', {
      default: 'eu-west-1',
    });

    expect('eu-west-1').toBe(closest);
  });

  test('it should fall back to the first filter if present and no default is set', () => {
    const closest = findClosestAWSRegion('not-a-region', {
      filters: ['eu-central-1', 'eu-west-1'],
    });

    expect('eu-central-1').toBe(closest);
  });

  test('it should fall back to us-east-1 if no close region or default is found', () => {
    const closest = findClosestAWSRegion('not-a-region', {
      filters: [],
    });

    expect('us-east-1').toBe(closest);
  });
});
