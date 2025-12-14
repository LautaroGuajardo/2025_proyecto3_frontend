export const Criticality = {
  MINOR: 'MINOR',
  MAJOR: 'MAJOR',
  CRITICAL: 'CRITICAL',
  BLOCKER: 'BLOCKER',
} as const;

export type Criticality = (typeof Criticality)[keyof typeof Criticality];

export const isValidCriticality = (status: string): status is Criticality => {
  return Object.values(Criticality).includes(status as Criticality);
};
