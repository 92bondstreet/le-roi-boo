/*eslint-disable*/
import knex from 'knexClient'
import getAvailabilities from './getAvailabilities'

describe('getAvailabilities', () => {
  beforeEach(() => knex('events').truncate())

  /*describe('simple case', () => {
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
  })*/

  describe('multiple openings on same day', () => {
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
          starts_at: new Date('2018-10-01 16:00'),
          ends_at: new Date('2018-10-01 18:00'),
        },
      ])
    })

    it('should fetch availabilities correctly', async () => {
      const availabilities = await getAvailabilities(new Date('2018-10-01'))

      expect(availabilities.length).toBe(7)

      expect(availabilities[0].slots).toEqual([
        '9:30',
        '10:00',
        '10:30',
        '11:00',
        '14:30',
        '15:00',
        '15:30'
      ]);
    })
  })

  describe('multiple appointments on same day', () => {
    beforeEach(async () => {
      await knex('events').insert([
        {
          kind: 'opening',
          starts_at: new Date('2018-10-01 09:30'),
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
      ])
    })

    it('should fetch availabilities correctly', async () => {
      const availabilities = await getAvailabilities(new Date('2018-10-01'))

      expect(availabilities.length).toBe(7)

      expect(availabilities[0].slots).toEqual([
        '9:30',
        '10:00',
        '12:30',
        '13:00',
        '13:30',
        '14:00'
      ]);
    })
  })

  describe('appointments that completely overlap an open slot', () => {
    beforeEach(async () => {
      await knex('events').insert([
        {
          kind: 'opening',
          starts_at: new Date('2018-10-01 09:30'),
          ends_at: new Date('2018-10-01 10:30'),
        },
        {
          kind: 'appointment',
          starts_at: new Date('2018-10-01 08:00'),
          ends_at: new Date('2018-10-01 12:30'),
        }
      ])
    })

    it('should fetch availabilities correctly', async () => {
      const availabilities = await getAvailabilities(new Date('2018-10-01'))

      expect(availabilities.length).toBe(7)

      expect(availabilities[0].slots).toEqual([]);
    })
  })

  describe('appointments that partially overlap an open slot', () => {
    beforeEach(async () => {
      await knex('events').insert([
        {
          kind: 'opening',
          starts_at: new Date('2018-10-01 09:30'),
          ends_at: new Date('2018-10-01 11:00'),
        },
        {
          kind: 'appointment',
          starts_at: new Date('2018-10-01 08:00'),
          ends_at: new Date('2018-10-01 10:00'),
        },
        {
          kind: 'appointment',
          starts_at: new Date('2018-10-01 10:30'),
          ends_at: new Date('2018-10-01 12:00'),
        }
      ])
    })

    it('should fetch availabilities correctly', async () => {
      const availabilities = await getAvailabilities(new Date('2018-10-01'))

      expect(availabilities.length).toBe(7)

      expect(availabilities[0].slots).toEqual(['10:00']);
    })
  })

  /*describe('recurring opening really really in the past', () => {
    beforeEach(async () => {
      await knex('events').insert([
        {
          kind: 'opening',
          starts_at: new Date('2018-08-19 09:30'),
          ends_at: new Date('2018-08-19 10:30'),
          weekly_recurring: true
        }
      ])
    })

    it('should fetch availabilities correctly', async () => {
      const availabilities = await getAvailabilities(new Date('2018-10-01'))

      expect(availabilities.length).toBe(7)

      expect(availabilities[0].slots).toEqual([
        '9:30',
        '10:00'
      ]);
    })
  })

  describe('multiple recurring opening in the past', () => {
    beforeEach(async () => {
      await knex('events').insert([
        {
          kind: 'opening',
          starts_at: new Date('2018-09-17 09:30'),
          ends_at: new Date('2018-09-17 10:30'),
          weekly_recurring: true
        },
        {
          kind: 'opening',
          starts_at: new Date('2018-09-19 14:00'),
          ends_at: new Date('2018-09-19 16:00'),
          weekly_recurring: true
        },
        {
          kind: 'appointment',
          starts_at: new Date('2018-09-19 15:00'),
          ends_at: new Date('2018-09-19 18:00'),
        },
      ])
    })

    it('should fetch availabilities correctly', async () => {
      const availabilities = await getAvailabilities(new Date('2018-10-01'))

      expect(availabilities.length).toBe(7)

      expect(String(availabilities[0].date)).toBe(
        String(new Date('2018-10-01')),
      )

      expect(availabilities[0].slots).toEqual([
        '9:30',
        '10:00'
      ]);

      expect(String(availabilities[2].date)).toBe(
        String(new Date('2018-10-03')),
      )

      expect(availabilities[2].slots).toEqual([
        '14:00',
        '14:30'
      ]);
    })
  })*/

  describe('multiple openings after the given date', () => {
    beforeEach(async () => {
      await knex('events').insert([
        {
          kind: 'opening',
          starts_at: new Date('2018-10-04 09:30'),
          ends_at: new Date('2018-10-04 11:30'),
        },
        {
          kind: 'opening',
          starts_at: new Date('2018-10-04 14:30'),
          ends_at: new Date('2018-10-04 16:30'),
        },
        {
          kind: 'appointment',
          starts_at: new Date('2018-10-04 16:00'),
          ends_at: new Date('2018-10-04 18:00'),
        },
      ])
    })

    it('should fetch availabilities correctly', async () => {
      const availabilities = await getAvailabilities(new Date('2018-10-01'))

      expect(availabilities.length).toBe(7)

      expect(String(availabilities[3].date)).toBe(
        String(new Date('2018-10-04')),
      )

      expect(availabilities[3].slots).toEqual([
        '9:30',
        '10:00',
        '10:30',
        '11:00',
        '14:30',
        '15:00',
        '15:30'
      ]);
    })
  })

  describe('multiple appointments after the given date', () => {
    beforeEach(async () => {
      await knex('events').insert([
        {
          kind: 'opening',
          starts_at: new Date('2018-10-04 09:30'),
          ends_at: new Date('2018-10-04 16:30'),
        },
        {
          kind: 'appointment',
          starts_at: new Date('2018-10-04 10:30'),
          ends_at: new Date('2018-10-04 12:30'),
        },
        {
          kind: 'appointment',
          starts_at: new Date('2018-10-04 14:30'),
          ends_at: new Date('2018-10-04 18:00'),
        },
      ])
    })

    it('should fetch availabilities correctly', async () => {
      const availabilities = await getAvailabilities(new Date('2018-10-01'))

      expect(availabilities.length).toBe(7)

      expect(String(availabilities[3].date)).toBe(
        String(new Date('2018-10-04')),
      )

      expect(availabilities[3].slots).toEqual([
        '9:30',
        '10:00',
        '12:30',
        '13:00',
        '13:30',
        '14:00'
      ]);
    })
  })

  /*describe('recurring opening after the given date', () => {
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

    it('should fetch availabilities correctly', async () => {
      const availabilities = await getAvailabilities(new Date('2018-10-01'))

      expect(availabilities.length).toBe(7)

      expect(String(availabilities[3].date)).toBe(
        String(new Date('2018-10-04')),
      )

      expect(availabilities[3].slots).toEqual([
        '9:30',
        '10:00'
      ]);
    })
  })

  describe('multiple recurring after the given date', () => {
    beforeEach(async () => {
      await knex('events').insert([
        {
          kind: 'opening',
          starts_at: new Date('2018-10-03 09:30'),
          ends_at: new Date('2018-10-03 10:30'),
          weekly_recurring: true
        },
        {
          kind: 'opening',
          starts_at: new Date('2018-10-05 14:00'),
          ends_at: new Date('2018-10-05 16:00'),
          weekly_recurring: true
        },
        {
          kind: 'appointment',
          starts_at: new Date('2018-10-05 15:00'),
          ends_at: new Date('2018-10-05 18:00'),
        },
      ])
    })

    it('should fetch availabilities correctly', async () => {
      const availabilities = await getAvailabilities(new Date('2018-10-01'))

      expect(availabilities.length).toBe(7)

      expect(String(availabilities[2].date)).toBe(
        String(new Date('2018-10-03')),
      )

      expect(availabilities[2].slots).toEqual([
        '9:30',
        '10:00'
      ]);

      expect(String(availabilities[4].date)).toBe(
        String(new Date('2018-10-05')),
      )

      expect(availabilities[4].slots).toEqual([
        '14:00',
        '14:30'
      ]);
    })
  })*/

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

    it('should fetch availabilities correctly', async () => {
      const availabilities = await getAvailabilities(new Date('2018-10-29'))
      expect(availabilities.length).toBe(7)

      expect(String(availabilities[0].date)).toBe(
        String(new Date('2018-10-29')),
      )

      expect(availabilities[0].slots).toEqual([
        '9:30',
        '10:00'
      ])

      expect(String(availabilities[4].date)).toBe(
        String(new Date('2018-11-02')),
      )

      expect(availabilities[4].slots).toEqual([
        '9:30',
        '10:00'
      ])
    })
  })

  describe('agenda between 2 years', () => {
    beforeEach(async () => {
      await knex('events').insert([
        {
          kind: 'opening',
          starts_at: new Date('2018-12-31 09:30'),
          ends_at: new Date('2018-12-31 10:30'),
        },
        {
          kind: 'opening',
          starts_at: new Date('2019-01-02 09:30'),
          ends_at: new Date('2019-01-02 10:30'),
        }
      ])
    })

    it('should fetch availabilities correctly', async () => {
      const availabilities = await getAvailabilities(new Date('2018-12-31'))
      expect(availabilities.length).toBe(7)

      expect(String(availabilities[0].date)).toBe(
        String(new Date('2018-12-31')),
      )

      expect(availabilities[0].slots).toEqual([
        '9:30',
        '10:00'
      ])

      expect(String(availabilities[2].date)).toBe(
        String(new Date('2019-01-02')),
      )

      expect(availabilities[2].slots).toEqual([
        '9:30',
        '10:00'
      ])
    })
  })
})
