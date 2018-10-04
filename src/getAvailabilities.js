import {flatten, subtractRanges, toRange} from './utils';
import getEvents from './get-events';
import getNextDays from './get-next-days';

/**
 * To compute a substraction, we search first overlapped appointment
 * @param  {Object} opening      [description]
 * @param  {[type]} appointments [description]
 * @return {[type]}              [description]
 */
const findOverlappedAppointment = (opening, appointments) => {
  return appointments.filter(appointment => {
    const range1 = toRange(opening);
    const range2 = toRange(appointment);

    return range1.overlaps(range2);
  });
};

/**
 * Substract open slot with busy slot
 * @param  {Date} opening
 * @param  {Array} overlapped
 * @return {Date}
 */
const subtract = (opening, overlapped) => {
  const open = toRange(opening);
  const appointments = overlapped.map(toRange);

  return subtractRanges(open, appointments);
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
