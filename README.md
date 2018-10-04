# Le roi boo

[![Build Status](https://travis-ci.org/92bondstreet/le-roi-boo.svg?branch=master)](https://travis-ci.org/92bondstreet/le-roi-boo)
[![Coverage Status](https://coveralls.io/repos/github/92bondstreet/le-roi-boo/badge.svg?branch=master)](https://coveralls.io/github/92bondstreet/le-roi-boo?branch=master)


> Checks the availabilities of an agenda with Le Roi Boo alias BooKing.

## Installation

```sh
❯ yarn add 92bondstreet/le-roi-boo
```

## Usage

```js
import getAvailabilities from 'le-roi-boo';

async print () => {
  const availabilities = await getAvailabilities(new Date('2018-10-01'))

  console.log(availabilities);
}

print();
```

## Objective

The goal is to write an algorithm that checks the availabilities of an agenda depending of the events attached to it. The main method has a start date for input and is looking for the availabilities of the next 7 days.

## MDD (Moleskine Driven Development)

![mdd](./mdd.jpg)

## Analysis

It's  - only - a 200 characters objective but behind this simple description working with date and time could be a quirk thing. ([Timezones](http://tantek.com/2015/218/b1/use-timezone-offsets) are a good example of quirk things).

To be ready to release in production, we have to take care to code expected behaviours and not personal interpretation.

### Hypothesis

To build the library to check the availabilities of an agenda, we need to confirm or refute some hypotheses.

So, could we make the hypothesis that

- [x] An opening slot has a duration of 30 minutes

- [x] The opening slot events are always a multiple of 30 min: I mean 30, 60, 90... minutes

```js
[
  {
    kind: 'opening',
    starts_at: new Date('2018-10-01 08:30'),
    ends_at: new Date('2018-10-01 09:00'),
  },
  {
    kind: 'opening',
    starts_at: new Date('2018-10-01 10:00'),
    ends_at: new Date('2018-10-01 11:30'),
  }
]
```

- [x] An appointment slot has a duration of 30 minutes

- [x] The appointment slot events are always a multiple of 30 min: I mean 30, 60, 90... minutes

```js
[
  {
    kind: 'appointment',
    starts_at: new Date('2018-10-01 08:00'),
    ends_at: new Date('2018-10-01 08:30'),
  },
  {
    kind: 'appointment',
    starts_at: new Date('2018-10-01 09:00'),
    ends_at: new Date('2018-10-01 11:30'),
  }
]
```

- [x] The opening slots start always at `x:00` or `x:30`

The hypothesis is related to the start time.

```js
[
  {
    kind: 'opening',
    starts_at: new Date('2018-10-01 08:30'),
    ends_at: new Date('2018-10-01 09:00'),
  },
  {
    kind: 'opening',
    starts_at: new Date('2018-10-01 10:30'),
    ends_at: new Date('2018-10-01 11:00'),
  }
]
```

- [x] The appointment slots start always at `x:00` or `x:30`

The hypothesis is related to the start time.

```js
[
  {
    kind: 'appointment',
    starts_at: new Date('2018-10-01 08:00'),
    ends_at: new Date('2018-10-01 08:30'),
  },
  {
    kind: 'appointment',
    starts_at: new Date('2018-10-01 09:00'),
    ends_at: new Date('2018-10-01 11:30'),
  }
]
```

#### edge cases: deal not required  

* We can schedule an appointment on the Saturday, Sunday and France public bank holidays

The hypothesis is related to the **weekly_recurring** value.

What's the deal about opening slots available on Sunday and public bank holidays.


* The start and end date time of an opening slot is always on the same day

It means that an opening/appointment slot could not be between 2 days.
The following event should not be valid:

```js
[
  {
    kind: 'opening',
    starts_at: new Date('2018-09-30 22:30'),
    ends_at: new Date('2018-10-01 01:00'),
  }
]
```

* The start and end date time of an appointment slot is always on the same day

It means that opening/appointment could not be between 2 days.
The following event should not be valid:


```js
[
  {
    kind: 'appointment',
    starts_at: new Date('2018-09-30 22:30'),
    ends_at: new Date('2018-10-01 01:00'),
  }
]
```

* The timezone is Paris CET.

Some these hypotheses - confirmed or not - may be considered as edge cases.
