import { useWatch } from 'react-hook-form'

import { getPasswordChecks, getPasswordStrengthMeta } from '../utils/passwordRules'

export function PasswordStrengthBars({
  hideEmptyLabel = false,
  hideHelperText = false,
  hideStrengthLabel = false,
  hideTitle = false,
  password,
}) {
  const checks = getPasswordChecks(password)
  const strengthScore = checks.filter((check) => check.met).length
  const strength = getPasswordStrengthMeta(strengthScore)
  const strengthLabel =
    password.length > 0 ? strength.label : hideEmptyLabel ? '' : 'Hazır değil'
  const showHeader = !hideTitle || (!hideStrengthLabel && strengthLabel.length > 0)

  return (
    <div className="space-y-2 pt-1">
      {showHeader ? (
        <div className="mb-1 flex items-center justify-between">
          {hideTitle ? <span /> : (
            <span className="font-label text-xs font-medium text-on-surface-variant">
              Şifre Gücü
            </span>
          )}
          {hideStrengthLabel ? null : (
            <span className={`font-label text-xs font-medium ${strength.textClass}`}>
              {strengthLabel}
            </span>
          )}
        </div>
      ) : null}

      <div className="flex h-1.5 gap-1.5">
        {Array.from({ length: 4 }).map((_, index) => (
          <div
            key={`strength-bar-${index + 1}`}
            className={`h-full flex-1 rounded-full ${
              index < strengthScore ? strength.barClass : 'bg-surface-container-low'
            }`}
          />
        ))}
      </div>

      {hideHelperText ? null : (
        <p className="mt-2 font-label text-xs text-on-surface-variant/70">
          En az 8 karakter, bir rakam ve bir sembol içermeli.
        </p>
      )}
    </div>
  )
}

export function PasswordRuleChecklist({ checks }) {
  return (
    <div className="grid gap-2 rounded-lg border border-outline-variant/15 bg-surface-container-lowest/70 p-4">
      {checks.map((check) => (
        <div
          key={check.id}
          className="flex items-center gap-2 text-xs text-on-surface-variant"
        >
          <span
            className={`material-symbols-outlined text-sm ${
              check.met ? 'text-secondary' : 'text-outline'
            }`}
          >
            {check.met ? 'check_circle' : 'radio_button_unchecked'}
          </span>
          <span>{check.label}</span>
        </div>
      ))}
    </div>
  )
}

function PasswordStrengthPanel({
  className = '',
  control,
  hideEmptyLabel = false,
  hideHelperText = false,
  hideStrengthLabel = false,
  hideTitle = false,
  name = 'password',
  spacingClass = 'space-y-4',
}) {
  const password = useWatch({ control, name }) || ''
  const checks = getPasswordChecks(password)

  return (
    <div className={`${spacingClass} ${className}`.trim()}>
      <PasswordStrengthBars
        hideEmptyLabel={hideEmptyLabel}
        hideHelperText={hideHelperText}
        hideStrengthLabel={hideStrengthLabel}
        hideTitle={hideTitle}
        password={password}
      />
      <PasswordRuleChecklist checks={checks} />
    </div>
  )
}

export default PasswordStrengthPanel
