import {extendMoment} from 'moment-range';
import getEvents from './get-events';
import getNextDays from './get-next-days';
import Moment from 'moment';

const moment = extendMoment(Moment);

const flatten = source => {
  return [].concat(...source);
};

/**
 * To compute a substraction, we search first overlapped appointment
 * @param  {Object} opening      [description]
 * @param  {[type]} appointments [description]
 * @return {[type]}              [description]
 */
const findOverlappedAppointment = (opening, appointments) => {
  return appointments.filter(appointment => {
    const range1 = moment.range(opening.starts_at, opening.ends_at);
    const range2 = moment.range(appointment.starts_at, appointment.ends_at);

    return range1.overlaps(range2);
  });
};

/**
 * [subtractRanges description]
 * @example https://github.com/rotaready/moment-range/issues/159
 * @param  {[type]} source [description]
 * @param  {[type]} others [description]
 * @return {[type]}        [description]
 */
const subtractRanges = (source, others) => {
  if (! Array.isArray(source)) {
    source = [source];
  }

  return flatten(source.map(s => {
    let remaining = [s];

    flatten(others).forEach(other => {
      remaining = flatten(remaining.map(r => r.subtract(other)));
    });

    return remaining;
  }));
};

/**
 * Substract open slot with busy slot
 * @param  {Date} opening
 * @param  {Array} overlapped
 * @return {Date}
 */
const subtract = (opening, overlapped) => {
  return subtractRanges(moment.range(opening.starts_at, opening.ends_at),
    overlapped.map(busy => moment.range(busy.starts_at, busy.ends_at)));
};

/**
 * Find available slots by diffing opening slots and appointment
 * @param  {Object} [event={}]
 * @return {Array}
 */
const findSlots = (event = {}) => {
  const {appointment = [], opening = []} = event;

  const slots = opening.map(open => {
    const overlapped = findOverlappedAppointment(open, appointment);
    const freeSlots = subtract(open, overlapped);
    const times = freeSlots.map(slot => {
      return Array
        .from(slot.by('minutes', {'excludeEnd': true, 'step': 30}))
        .map(m => m.format('H:mm'));
    });

    return flatten(times);
  });

  return flatten(slots);
};

/**
 * Get availabilities of an agenda depending of the events attached to it
 * @param  {Date} date
 * @return {Array}
 */
export default async function getAvailabilities (date) {
  const next = getNextDays(date);
  const events = await getEvents(date);

  // Step 0. Parse each next n date
  // Step 1. For a given date, parse all opening slots
  // step 2. For each date, set the slots

  return next.map(n => {
    return {
      'date': n,
      'slots': findSlots(events[n])
    };
  });
}
