export function getPasswordChecks(password) {
  return [
    {
      id: 'length',
      label: 'En az 8 karakter',
      met: password.length >= 8,
    },
    {
      id: 'number',
      label: 'En az 1 rakam',
      met: /\d/.test(password),
    },
    {
      id: 'symbol',
      label: 'En az 1 sembol',
      met: /[^A-Za-z0-9]/.test(password),
    },
    {
      id: 'case',
      label: 'Büyük ve küçük harf',
      met: /[a-z]/.test(password) && /[A-Z]/.test(password),
    },
  ]
}

export function getPasswordStrengthMeta(score) {
  if (score <= 1) {
    return {
      label: 'Zayıf',
      textClass: 'text-error',
      barClass: 'bg-error',
    }
  }

  if (score === 2) {
    return {
      label: 'Orta',
      textClass: 'text-tertiary',
      barClass: 'bg-tertiary',
    }
  }

  if (score === 3) {
    return {
      label: 'İyi',
      textClass: 'text-primary',
      barClass: 'bg-primary',
    }
  }

  return {
    label: 'Güçlü',
    textClass: 'text-secondary',
    barClass: 'bg-secondary',
  }
}

export function passwordMeetsMinimumRules(password) {
  const checks = getPasswordChecks(password)

  return Boolean(
    checks.find((check) => check.id === 'length')?.met &&
    checks.find((check) => check.id === 'number')?.met &&
    checks.find((check) => check.id === 'symbol')?.met
  )
}
