import Moment from 'moment';
import {extendMoment} from 'moment-range';

const moment = extendMoment(Moment);

/**
 * Get the next n days from a given date
 * @param  {Date} date
 * @param  {Number} [range=7]
 * @return {Object}
 */
export default function getNextDays (date, range = 7) {
  // the rangeFromInterval of moment-range lib start the count
  // after the first given interval
  const next = moment.rangeFromInterval('day', range - 1, date);

  return Array.from(next.by('day')).map(m => m.toDate());
}
