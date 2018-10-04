import getNextDays from './get-next-days';
import getRecurring from './get-recurring';
import knex from 'knexClient';
import moment from 'moment';

/**
 * Save the event
 * @param  {Object} current
 * @param  {Object} event
 * @param  {Date} day     [description]
 * @return {Object}         [description]
 */
const save = (current, event, day) => {
  const {kind} = event;

  if (! current[day]) {
    current[day] = {
      'opening': [],
      'appointment': []
    };
  }

  current[day][kind].push(event);

  return current;
};

/**
 * Get - by reducing - all openings and appointments for a range a date
 * by date. It helps us to parse and find appointments overlaps and sub
 * @param  {Date} date
 * @return {Object}
 */
export default async function getEvents (date) {
  const next = getNextDays(date);
  const start = next[0].valueOf();
  const end = next[next.length - 1].valueOf();

  // Step 0. Get events from db
  // Step 1. Get recurring events from db
  // Step 2. Merge events

  const results = await knex('events')
    .where('starts_at', '>=', start)
    .andWhere('ends_at', '<=', end);
  const recurrent = await getRecurring(date);
  const events = [...results, ...recurrent];

  return events.reduce((current, event) => {
    const {starts_at} = event; //eslint-disable-line
    const day = moment.utc(starts_at).startOf('day').toDate();

    return save(current, event, day);
  }, {});
}
