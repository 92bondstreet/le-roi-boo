import {extendMoment} from 'moment-range';
import Moment from 'moment';
import {NEXT_DAYS} from './constants';

const moment = extendMoment(Moment);

/**
 * Get the next n days from a given date
 * @param  {Date} date
 * @param  {Number} [range=NEXT_DAYS]
 * @return {Object}
 */
export default function getNextDays (date, range = NEXT_DAYS) {
  // the rangeFromInterval of moment-range lib start the count
  // after the first given interval: that why we remove 1
  const next = moment.rangeFromInterval('day', range - 1, date);

  return Array.from(next.by('day')).map(m => m.toDate());
}
