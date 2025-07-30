// src/__tests__/utils/dateTimeUtils.test.ts
import {
  formatDate,
  formatDateOnly,
  formatTimeOnly,
  formatDateForInput,
  formatTimeForInput,
  combineDateTime,
  validateSleepTimes,
  isToday,
  daysSince,
  calculateSleepDuration
} from '@/utils/dateTimeUtils';

describe('DateTime Utils', () => {
  // ===== TESTS DE FORMATAGE =====
  describe('formatDate (affichage complet)', () => {
    test('formats MongoDB date correctly', () => {
      const result = formatDate('2025-07-16T00:00:00.000+00:00');
      expect(result).toMatch(/16\/07\/2025 \d{2}:\d{2}/);
    });

    test('handles invalid date', () => {
      expect(formatDate('invalid')).toBe('Invalid Date');
    });
  });

  describe('formatDateOnly', () => {
    test('formats date without time', () => {
      const result = formatDateOnly('2025-07-16T10:30:00.000Z');
      expect(result).toBe('16/07/2025');
    });
  });

  describe('formatTimeOnly', () => {
    test('formats time without date', () => {
      const result = formatTimeOnly('2025-07-16T10:30:00.000Z');
      expect(result).toMatch(/\d{2}:\d{2}/);
    });
  });

  // ===== TESTS POUR FORMULAIRES =====
  describe('formatDateForInput', () => {
    test('formats for HTML date input', () => {
      const result = formatDateForInput('2025-07-16T10:30:00.000Z');
      expect(result).toBe('2025-07-16');
    });

    test('handles empty input', () => {
      expect(formatDateForInput('')).toBe('');
    });
  });

  describe('formatTimeForInput', () => {
    test('formats MongoDB time for HTML time input', () => {
      const mongoTime = '2025-07-17T21:40:00.000+00:00';
      const result = formatTimeForInput(mongoTime);
      
      expect(result).toBe('21:40');
    });

    test('handles wake up time correctly', () => {
      const mongoTime = '2025-07-17T07:30:00.000+00:00';
      const result = formatTimeForInput(mongoTime);
      
      expect(result).toBe('07:30');
    });
  });

  // ===== TESTS DE COMBINAISON =====
  describe('combineDateTime', () => {
    test('combines date and time correctly', () => {
      const result = combineDateTime('2025-07-17', '21:40');
      expect(result).toBe('2025-07-17T21:40:00.000Z');
    });

    test('handles invalid inputs', () => {
      expect(combineDateTime('', '21:40')).toBe('');
      expect(combineDateTime('2025-07-17', '')).toBe('');
    });
  });

  // ===== TESTS DE VALIDATION =====
  describe('validateSleepTimes', () => {
    test('detects problematic sleep pattern from your real data', () => {
      const result = validateSleepTimes('23:40', '09:00', '2025-07-17');
      
      expect(result.isValid).toBe(true); 
      expect(result.sleepDuration).toBeCloseTo(9.33, 1); // ~9h20
    });

    test('validates normal sleep pattern', () => {
      const result = validateSleepTimes('22:30', '07:00', '2025-07-17');
      
      expect(result.isValid).toBe(true);
      expect(result.errors).toHaveLength(0);
      expect(result.sleepDuration).toBe(8.5);
    });

    test('warns about very long sleep', () => {
      const result = validateSleepTimes('20:00', '12:00', '2025-07-17');
      
      expect(result.warnings).toContain('Durée de sommeil très longue (>12h)');
    });
  });

  // ===== TESTS UTILITAIRES =====
  describe('calculateSleepDuration', () => {
    test('calculates sleep duration correctly', () => {
      const duration = calculateSleepDuration('23:40', '09:00');
      expect(duration).toBeCloseTo(9.33, 1);
    });

    test('handles same-day sleep (nap)', () => {
      const duration = calculateSleepDuration('14:00', '15:30');
      expect(duration).toBe(1.5);
    });
  });

  describe('isToday', () => {
    test('detects today correctly', () => {
      const today = new Date().toISOString();
      expect(isToday(today)).toBe(true);
    });

    test('detects past date', () => {
      expect(isToday('2024-01-01T00:00:00Z')).toBe(false);
    });
  });

  describe('daysSince', () => {
    test('calculates days since date', () => {
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      
      const result = daysSince(yesterday.toISOString());
      expect(result).toBe(1);
    });
  });
});