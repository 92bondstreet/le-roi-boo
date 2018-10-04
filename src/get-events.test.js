/*eslint-disable*/
import knex from 'knexClient'
import getEvents from './get-events'

describe('getEvents', () => {
  beforeEach(() => knex('events').truncate())

  describe('unique events', () => {
    beforeEach(async () => {
      await knex('events').insert([
        {
          kind: 'opening',
          starts_at: new Date('2018-10-01 09:30'),
          ends_at: new Date('2018-10-01 12:30')
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
      const events = await getEvents(date);
      const current = events[date];

      expect(Object.keys(events).length).toBe(1)
      expect(current.opening.length).toEqual(1)
      expect(current.appointment.length).toEqual(1);
    })
  })

  describe('multiple events on same day', () => {
    beforeEach(async () => {
      await knex('events').insert([
        {
          kind: 'opening',
          starts_at: new Date('2018-10-01 09:30'),
          ends_at: new Date('2018-10-01 11:30'),
        },
        {
          kind: 'opening',
          starts_at: new Date('2018-10-01 14:30'),
          ends_at: new Date('2018-10-01 16:30'),
        },
        {
          kind: 'appointment',
          starts_at: new Date('2018-10-01 10:30'),
          ends_at: new Date('2018-10-01 12:30'),
        },
        {
          kind: 'appointment',
          starts_at: new Date('2018-10-01 14:30'),
          ends_at: new Date('2018-10-01 18:00'),
        },
        {
          kind: 'appointment',
          starts_at: new Date('2018-10-01 16:00'),
          ends_at: new Date('2018-10-01 18:00'),
        },
      ])
    })

    it('should query correctly the next days events', async () => {
      const date = new Date('2018-10-01');
      const events = await getEvents(date);
      const current = events[date];

      expect(Object.keys(events).length).toBe(1)
      expect(current.opening.length).toEqual(2)
      expect(current.appointment.length).toEqual(3);
    })
  })

  describe('agenda between 2 months', () => {
    beforeEach(async () => {
      await knex('events').insert([
        {
          kind: 'opening',
          starts_at: new Date('2018-10-29 09:30'),
          ends_at: new Date('2018-10-29 10:30'),
        },
        {
          kind: 'opening',
          starts_at: new Date('2018-11-02 09:30'),
          ends_at: new Date('2018-11-02 10:30'),
        }
      ])
    })

    it('should query correctly the next days events', async () => {
      const date = new Date('2018-10-29');
      const events = await getEvents(date);
      const current = events[String(date)];

      expect(Object.keys(events).length).toBe(2)
      expect(current.opening.length).toEqual(1)
    })
  })
})
