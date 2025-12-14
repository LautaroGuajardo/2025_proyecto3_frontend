export const Priority = {
  LOW: 'LOW',
  MEDIUM: 'MEDIUM',
  HIGH: 'HIGH',
  URGENT: 'URGENT',
} as const;

export type Priority = (typeof Priority)[keyof typeof Priority];

export const isValidPriority = (status: string): status is Priority => {
  return Object.values(Priority).includes(status as Priority);
};