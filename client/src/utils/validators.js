export const required = value => (value || typeof value === 'number' ? undefined : 'Required')

const maxLength = max => value =>
  value && value.length > max ? `Must be ${max} characters or less` : undefined
const minLength = min => value =>
  value && value.length < min ? `Must be ${min} characters or more` : undefined

export const maxLength32 = maxLength(32)
export const maxLength100 = maxLength(100)
export const maxLength300 = maxLength(300)
export const maxLength4096 = maxLength(4096)

export const minLength6 = minLength(6)

