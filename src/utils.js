import {extendMoment} from 'moment-range';
import Moment from 'moment';

const moment = extendMoment(Moment);

/**
 * Flatten an array
 * @param  {Array} source
 * @return {Array}
 */
export function flatten (source) {
  return [].concat(...source);
}

/**
 * Subtract a set of ranges for a given range source
 * @example https://github.com/rotaready/moment-range/issues/159
 * @param  {Date} source
 * @param  {Array} ranges
 * @return {Array}
 */
export function subtractRanges (source, ranges) {
  if (! Array.isArray(source)) {
    source = [source];
  }

  return flatten(source.map(s => {
    let remaining = [s];

    flatten(ranges).forEach(range => {
      remaining = flatten(remaining.map(r => r.subtract(range)));
    });

    return remaining;
  }));
}

/**
 * Convert an event to a range
 * @param  {Object} event
 * @return {Range}
 */
export function toRange (event) {
  return moment.range(event.starts_at, event.ends_at);
}
