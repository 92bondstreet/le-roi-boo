import knex from 'knexClient'
import getAvailabilities from './getAvailabilities'

describe('getAvailabilities', () => {
  beforeEach(() => knex('events').truncate())

  describe('simple case', () => {
    beforeEach(async () => {
      await knex('events').insert([
        {
          kind: 'opening',
          starts_at: new Date('2014-08-04 09:30'),
          ends_at: new Date('2014-08-04 12:30'),
          weekly_recurring: true,
        },
        {
          kind: 'appointment',
          starts_at: new Date('2014-08-11 10:30'),
          ends_at: new Date('2014-08-11 11:30'),
        },
      ])
    })

    it('should fetch availabilities correctly', async () => {
      const availabilities = await getAvailabilities(new Date('2014-08-10'))
      expect(availabilities.length).toBe(7)

      expect(String(availabilities[0].date)).toBe(
        String(new Date('2014-08-10')),
      )
      expect(availabilities[0].slots).toEqual([])

      expect(String(availabilities[1].date)).toBe(
        String(new Date('2014-08-11')),
      )
      expect(availabilities[1].slots).toEqual([
        '9:30',
        '10:00',
        '11:30',
        '12:00',
      ])

      expect(availabilities[2].slots).toEqual([])

      expect(String(availabilities[6].date)).toBe(
        String(new Date('2014-08-16')),
      )
    })
  })
})
