/**
 * Format a Date to ISO date string YYYY-MM-DD
 * @param date - Date to format
 * @returns Date string in YYYY-MM-DD format
 */
export const toISODate = (date: Date): string => date.toISOString().split('T')[0]
