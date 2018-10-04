import getNextDays from './get-next-days';
import knex from 'knexClient';
import moment from 'moment';
import 'moment-recur-ts';

/**
 * Get - by filtering - all recurring openings for a range a date
 * by date. It helps us to parse and find appointments overlaps and sub
 * @param  {Date} date
 * @return {Object}
 */
export default async function getRecurring (date) {
  const next = getNextDays(date);
  const end = next[next.length - 1].valueOf();

  const events = await knex('events')
    .where('ends_at', '<=', end)
    .andWhere('weekly_recurring', true);

  // parse all weekly recurring events that matches a date from the range
  const recurrent = events.map(event => {
    const interval = moment.utc(event.starts_at).recur().every(1).weeks();
    const matched = next.find(n => interval.matches(n));

    // now we found a matched date from the weekly recurring event
    // we just replace the event with the current date (year, month, day)
    const current = moment(matched);
    const option = {'year': current.year(), 'month': current.month(), 'date': current.date()};
    const startsAt = moment(event.starts_at).set(option);
    const endsAt = moment(event.ends_at).set(option);

    return {
      'kind': 'opening',
      'starts_at': startsAt,
      'ends_at': endsAt
    };
  });

  return recurrent;
}
