export const SECTIONS = {
  grants: {
    title: 'Grants', blurb: 'Small, fast money. No equity.',
    note: { text: 'Global no-strings microgrants (Emergent Ventures, Z Fellows, Pollination Project…) are on the 1517 list.', link: 'https://www.1517fund.com/grants', label: 'See the 1517 grants page ↗' },
    categories: ['Open','Entrepreneurship','Research','Policy/Civic','Creative/Humanities'],
    tags: ['AI','Neurotech','Bio','Hardware/Robotics','Deep science','Public good/Open source','Creative/Arts/Writing','Climate','Civic/Policy','Open/Any','equity-linked'],
  },
  communities: {
    title: 'Communities', blurb: 'Residencies, fellowships, cohorts.',
    tags: ['Residency','Fellowship','Cohort','Community','Volunteer org','Hacker house','Conference','Pop-up village','Directory'],
  },
} as const;
export type Section = keyof typeof SECTIONS;
export const STATUSES = ['open','rolling','between cycles','closed','unknown'] as const;
export const STALE_DAYS = 60;
export const SOON_DAYS = 14;

// Hard rule: nothing government-backed.
export const GOVT_PATTERNS = [
  /\.gov(\.|$|\/)/i, /\.nic\.in/i, /\bgov(ernmen)?t\b/i, /\bDST\b/, /\bBIRAC\b/i, /\bMeitY\b/i,
  /startup ?india/i, /\bSERB\b/, /\bDBT\b/, /\bICMR\b/, /\bCSIR\b/, /\bNITI\b/i, /\bPSU\b/,
  /European Commission/i, /\bNSF\b/, /\bDOE\b/, /\bAIM\b.*Atal/i, /\bAtal\b/i,
];
