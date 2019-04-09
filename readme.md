# Find the Closest AWS Region

## Why?

Whilst using lambda@edge your code runs in any one of the available data
centres, which is not necessarily true for your data or other services perhaps.

For example, if I'm using Dynamodb global tables and my data exists in
`eu-west-1`, `us-east-2` and `ap-southeast-1`, when my lambda@edge function
runs and sets up a DocumentClient using `process.env.AWS_REGION`, the value of
this environment variable may be any of the available AWS regions, perhaps
`eu-central-1`.

What this means is that the DocumentClient will fail to retrieve the data as it
attempts to access it from Dynamodb at `eu-central-1` as it hasn't been
replicated to that region.

Rather than hard coding or chosing one of the three regions in which I've
stored my data, using this package I can determine which of the regions which
contains my data is closest to `process.env.AWS_REGION` (or at least has the
lowest latency).

## Installation

`npm install @benswinburne/closest-aws-region`

## Import/Require
### CommonJS:
`var closestAWSRegion = require('@benswinburne/closest-aws-region')`

### ES Modules:
`import * as closestAWSRegion from '@benswinburne/closest-aws-region'`

# Quick Start

```
const region = findClosestAWSRegion('eu-central-1', {
  filters: ['eu-west-1', 'us-east-1', 'ap-southeast-1'],
}); // eu-west-1
```

# API

## `closestAWSRegion(to, [options])`

Find the closest region to that specified in `to`.

_Note: If `options.filters` is not set, the closest region will always be `to`._

## Options

### `default`

The default region to select in the event that no region is found. This
defaults to `us-east-1` if not set.

### `filters`

Specify the region(s) to limit your search to.

```
const region = findClosestAWSRegion('eu-central-1', {
  filters: ['eu-west-1', 'us-east-1']
}); // eu-west-1
```

### `data`

This option allows for overwriting the static datasource. The format must
follow the structure used by cloudping.co.

_Note: it's not recommended that a remote datasource is used with lambda@edge
because the latency savings by finding the closest region are lost during the
roundtrip to an external source_

```
const response = await fetch('https://api.cloudping.co/averages');
const data = await response.json();
const region = findClosestAWSRegion('eu-west-1', {
  data: data
});
```
