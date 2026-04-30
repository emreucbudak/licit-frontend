import { createTenderRuleDraft } from './tenderRuleUtils'

function TenderRulesEditor({
  disabled = false,
  embedded = false,
  onChange,
  rules,
  subtitle = 'Alicinin uymasi gereken sartlari ekle.',
  title = 'Ihale Kurallari',
}) {
  function addRule() {
    onChange([...rules, createTenderRuleDraft()])
  }

  function updateRule(localId, field, value) {
    onChange(
      rules.map((rule) =>
        rule.localId === localId
          ? {
              ...rule,
              [field]: value,
            }
          : rule,
      ),
    )
  }

  function removeRule(localId) {
    onChange(rules.filter((rule) => rule.localId !== localId))
  }

  const shellClassName = embedded
    ? 'border-t border-outline-variant/10 pt-5'
    : 'rounded-xl bg-surface-container-low p-6 shadow-sm sm:p-8'

  return (
    <section className={shellClassName}>
      <div className="mb-6 flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
        <div>
          <h2 className="flex items-center gap-2 text-xl font-bold text-white">
            <span className="material-symbols-outlined text-primary-container">
              rule
            </span>
            {title}
          </h2>
          <p className="mt-1 text-sm text-on-surface-variant">{subtitle}</p>
        </div>
        <button
          className="inline-flex items-center justify-center gap-2 rounded-lg border border-outline-variant/30 px-4 py-2 text-sm font-semibold text-on-surface transition-colors hover:bg-surface-container-high disabled:cursor-not-allowed disabled:opacity-60"
          disabled={disabled}
          onClick={addRule}
          type="button"
        >
          <span className="material-symbols-outlined text-base">add</span>
          Kural Ekle
        </button>
      </div>

      {rules.length === 0 ? (
        <div className="rounded-lg border border-dashed border-outline-variant/30 bg-surface-container-lowest/40 px-4 py-5 text-sm text-on-surface-variant">
          Henuz kural eklenmedi.
        </div>
      ) : (
        <div className="space-y-4">
          {rules.map((rule, index) => (
            <div
              className="rounded-lg border border-outline-variant/20 bg-surface-container-lowest p-4"
              key={rule.localId}
            >
              <div className="mb-4 flex items-center justify-between gap-3">
                <span className="text-xs font-bold uppercase tracking-wider text-on-surface-variant">
                  Kural {index + 1}
                </span>
                <button
                  aria-label={`${index + 1}. kurali sil`}
                  className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-error/30 text-error transition-colors hover:bg-error/10 disabled:cursor-not-allowed disabled:opacity-60"
                  disabled={disabled}
                  onClick={() => removeRule(rule.localId)}
                  type="button"
                >
                  <span className="material-symbols-outlined text-base">
                    delete
                  </span>
                </button>
              </div>

              <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
                <label className="space-y-2">
                  <span className="text-xs font-bold uppercase tracking-wider text-on-surface-variant">
                    Baslik
                  </span>
                  <input
                    className="w-full rounded-lg border-none bg-surface px-4 py-3 text-on-surface focus:ring-2 focus:ring-primary-container disabled:cursor-not-allowed disabled:opacity-60"
                    disabled={disabled}
                    maxLength="120"
                    onChange={(event) =>
                      updateRule(rule.localId, 'title', event.target.value)
                    }
                    placeholder="Orn. Odeme kosulu"
                    type="text"
                    value={rule.title}
                  />
                </label>

                <label className="flex items-end gap-3 rounded-lg bg-surface px-4 py-3">
                  <input
                    checked={rule.isRequired}
                    className="h-5 w-5 accent-primary"
                    disabled={disabled}
                    onChange={(event) =>
                      updateRule(rule.localId, 'isRequired', event.target.checked)
                    }
                    type="checkbox"
                  />
                  <span className="text-sm font-semibold text-on-surface">
                    Zorunlu kural
                  </span>
                </label>
              </div>

              <label className="mt-4 block space-y-2">
                <span className="text-xs font-bold uppercase tracking-wider text-on-surface-variant">
                  Aciklama
                </span>
                <textarea
                  className="w-full rounded-lg border-none bg-surface px-4 py-3 text-on-surface focus:ring-2 focus:ring-primary-container disabled:cursor-not-allowed disabled:opacity-60"
                  disabled={disabled}
                  maxLength="500"
                  onChange={(event) =>
                    updateRule(rule.localId, 'description', event.target.value)
                  }
                  placeholder="Kurali net ve kisa anlat."
                  rows="3"
                  value={rule.description}
                ></textarea>
              </label>
            </div>
          ))}
        </div>
      )}
    </section>
  )
}

export default TenderRulesEditor
