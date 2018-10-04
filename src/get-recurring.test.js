/*eslint-disable*/
import knex from 'knexClient'
import getRecurring from './get-recurring'

describe('getRecurring', () => {
  beforeEach(() => knex('events').truncate())

  describe('unique recurring events', () => {
    beforeEach(async () => {
      await knex('events').insert([
        {
          kind: 'opening',
          starts_at: new Date('2018-09-17 09:30'),
          ends_at: new Date('2018-09-17 12:30'),
          weekly_recurring: true
        },
        {
          kind: 'appointment',
          starts_at: new Date('2018-10-01 10:30'),
          ends_at: new Date('2018-10-01 11:30')
        },
      ])
    })

    it('should query correctly the next days events', async () => {
      const date = new Date('2018-10-01');
      const events = await getRecurring(date);

      expect(events.length).toBe(1)
    })
  })

  describe('recurring opening really really in the past', () => {
    beforeEach(async () => {
      await knex('events').insert([
        {
          kind: 'opening',
          starts_at: new Date('2018-08-13 09:30'),
          ends_at: new Date('2018-08-13 10:30'),
          weekly_recurring: true
        }
      ])
    })

    it('should query correctly the next days events', async () => {
      const date = new Date('2018-10-01');
      const events = await getRecurring(date);

      expect(events.length).toBe(1)
    })
  })

  describe('multiple recurring events', () => {
    beforeEach(async () => {
      await knex('events').insert([
        {
          kind: 'opening',
          starts_at: new Date('2018-09-17 09:30'),
          ends_at: new Date('2018-09-17 12:30'),
          weekly_recurring: true
        },
        {
          kind: 'opening',
          starts_at: new Date('2018-09-19 14:00'),
          ends_at: new Date('2018-09-19 16:00'),
          weekly_recurring: true
        },
        {
          kind: 'opening',
          starts_at: new Date('2018-10-05 09:30'),
          ends_at: new Date('2018-10-05 12:30'),
          weekly_recurring: true
        },
        {
          kind: 'opening',
          starts_at: new Date('2018-12-01 09:30'),
          ends_at: new Date('2018-12-01 12:30'),
          weekly_recurring: true
        },
        {
          kind: 'appointment',
          starts_at: new Date('2018-10-01 10:30'),
          ends_at: new Date('2018-10-01 11:30')
        },
      ])
    })

    it('should query correctly the next days events', async () => {
      const date = new Date('2018-10-01');
      const events = await getRecurring(date);

      expect(events.length).toBe(3);
    })
  })

  describe('recurring opening after the given date', () => {
    beforeEach(async () => {
      await knex('events').insert([
        {
          kind: 'opening',
          starts_at: new Date('2018-10-04 09:30'),
          ends_at: new Date('2018-10-04 10:30'),
          weekly_recurring: true
        }
      ])
    })

    it('should query correctly the next days events', async () => {
      const date = new Date('2018-10-01');
      const events = await getRecurring(date);

      expect(events.length).toBe(1);
    })
  })
})
