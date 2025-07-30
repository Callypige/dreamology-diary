// src/__tests__/utils/dateUtils.test.ts
import { formatDate } from '@/utils/dateTimeUtils';

describe('formatDate - avec vraies données MongoDB', () => {
  test('formats main dream date correctly', () => {

    const dreamDate = '2025-07-16T00:00:00.000+00:00';
    const result = formatDate(dreamDate);
    
    expect(result).toMatch(/16\/07\/2025/);
    expect(result).toMatch(/\d{2}:\d{2}/);
    expect(result).not.toBe('Date invalide');
  });

  test('formats sleepTime correctly', () => {
    const sleepTime = '2025-07-16T21:30:00.000+00:00';
    const result = formatDate(sleepTime);
    
    expect(result).toMatch(/16\/07\/2025/);
    expect(result).toMatch(/23:30/); // 21:30 UTC + 2h = 23:30
  });

  test('formats wokeUpTime correctly', () => {
    const wokeUpTime = '2025-07-16T07:30:00.000+00:00';
    const result = formatDate(wokeUpTime);
    
    expect(result).toMatch(/16\/07\/2025/);
    expect(result).toMatch(/09:30/); // 07:30 UTC + 2h = 09:30
  });

  test('formats createdAt timestamp correctly', () => {
    const createdAt = '2025-07-22T09:09:36.740+00:00';
    const result = formatDate(createdAt);
    
    expect(result).toMatch(/22\/07\/2025/);
    expect(result).toMatch(/11:09/); // 09:09 UTC + 2h = 11:09
  });

  test('handles different dream dates from your data', () => {
    const dates = [
      '2025-07-16T00:00:00.000+00:00', 
      '2025-07-10T00:00:00.000+00:00',   
      '2025-07-23T00:00:00.000+00:00', 
      '2025-07-09T00:00:00.000+00:00', 
      '2025-07-24T00:00:00.000+00:00'  
    ];

    dates.forEach(date => {
      const result = formatDate(date);
      
      expect(result).toMatch(/^\d{2}\/\d{2}\/2025 \d{2}:\d{2}$/);
      expect(result).not.toBe('Date invalide');
    });
  });

  test('handles the strange dream sleep/wake times', () => {
    const sleepTime = '2025-07-17T23:40:00.000+00:00';
    const wokeUpTime = '2025-07-17T09:00:00.000+00:00';
    
    const sleepResult = formatDate(sleepTime);
    const wakeResult = formatDate(wokeUpTime);
    
    // 23:40 UTC + 2h = 01:40 
    expect(sleepResult).toMatch(/18\/07\/2025 01:40/);
    
    // 09:00 UTC + 2h = 11:00 
    expect(wakeResult).toMatch(/17\/07\/2025 11:00/);
  });

  test('formats today date like MongoDB would', () => {
    const today = '2025-07-29T00:00:00.000+00:00';
    const result = formatDate(today);
    
    expect(result).toMatch(/29\/07\/2025 02:00/); // UTC+2
  });

  test('handles MongoDB millisecond precision', () => {
    const preciseDate = '2025-07-22T09:09:36.740+00:00';
    const result = formatDate(preciseDate);
    
    expect(result).toMatch(/22\/07\/2025 11:09/);
    expect(result).not.toContain('36');
  });
});