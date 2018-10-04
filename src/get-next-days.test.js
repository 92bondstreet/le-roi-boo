import getNextDays from './get-next-days';

describe('getNextDays', () => {
  describe('next days on the same month', () => {
    it('should get the 7 next days in a row', () => {
      const next = getNextDays(new Date('2018-10-01'));

      expect(next.length).toBe(7);

      expect(String(next[0])).toBe(
        String(new Date('2018-10-01'))
      );

      expect(String(next[6])).toBe(
        String(new Date('2018-10-07'))
      );
    });

    it('should get the 5 next days in a row', () => {
      const next = getNextDays(new Date('2018-10-01'), 5);

      expect(next.length).toBe(5);

      expect(String(next[0])).toBe(
        String(new Date('2018-10-01'))
      );

      expect(String(next[4])).toBe(
        String(new Date('2018-10-05'))
      );
    });
  });

  describe('next days between 2 months', () => {
    it('should get the 7 next days in a row', () => {
      const next = getNextDays(new Date('2018-10-29'));

      expect(next.length).toBe(7);

      expect(String(next[0])).toBe(
        String(new Date('2018-10-29'))
      );

      expect(String(next[6])).toBe(
        String(new Date('2018-11-04'))
      );
    });
  });

  describe('next days between 2 years', () => {
    it('should get the 7 next days in a row', () => {
      const next = getNextDays(new Date('2018-12-31'));

      expect(next.length).toBe(7);

      expect(String(next[0])).toBe(
        String(new Date('2018-12-31'))
      );

      expect(String(next[6])).toBe(
        String(new Date('2019-01-06'))
      );
    });
  });
});
