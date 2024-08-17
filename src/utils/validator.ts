export interface Rule {
  required?: boolean;
  digitsOnly?: boolean;
  length?: number;
  greaterThanZero?: boolean;
  notLessThanZero?: boolean;
}

export interface Rules {
  [key: string]: Rule;
}
export const validateObject = (
  filterParams: any,
  rules: Rules,
  labels: { [key: string]: string }
) => {
  for (const key in filterParams) {
    if (rules.hasOwnProperty(key)) {
      const value = filterParams[key];
      const rule = rules[key];
      const label = labels[key];

      if (rule.required && !value) {
        return `${label} is required.`;
      } else if (rule.digitsOnly && !/^\d+$/.test(value)) {
        return `${label} must contain only digits.`;
      } else if (rule.length && value.length !== rule.length) {
        return `${label} must be ${rule.length} characters long.`;
      } else if (rule.greaterThanZero && parseFloat(value) <= 0) {
        // Check if value is less than or equal to zero
        return `${label} must be greater than zero.`;
      } else if (rule.notLessThanZero && parseFloat(value) < 0) {
        // Check if value is less than zero
        return `${label} must be greater than zero.`;
      }
    }
  }
  
  return null;
};

export function validateEmail(email: string) {
  const regex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  return regex.test(email);
}
