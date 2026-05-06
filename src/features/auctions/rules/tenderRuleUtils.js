function createLocalId() {
  if (globalThis.crypto?.randomUUID) {
    return globalThis.crypto.randomUUID()
  }

  return `rule-${Date.now()}-${Math.random().toString(16).slice(2)}`
}

function readField(source, ...keys) {
  if (!source || typeof source !== 'object') {
    return undefined
  }

  for (const key of keys) {
    if (source[key] !== undefined && source[key] !== null) {
      return source[key]
    }
  }

  return undefined
}

export function createTenderRuleDraft(rule = {}) {
  return {
    localId: createLocalId(),
    title: readField(rule, 'title', 'Title') || '',
    description: readField(rule, 'description', 'Description') || '',
    isRequired: readField(rule, 'isRequired', 'IsRequired') ?? true,
  }
}

export function normalizeTenderRules(payload) {
  const rules = readField(payload, 'rules', 'Rules') || []

  return Array.isArray(rules) ? rules.map(createTenderRuleDraft) : []
}

export function buildTenderRulePayload(rules) {
  return rules.map((rule, index) => {
    const title = rule.title.trim()
    const description = rule.description.trim()

    if (!title || !description) {
      throw new Error(`${index + 1}. kural için başlık ve açıklama gir.`)
    }

    return {
      title,
      description,
      isRequired: Boolean(rule.isRequired),
    }
  })
}
