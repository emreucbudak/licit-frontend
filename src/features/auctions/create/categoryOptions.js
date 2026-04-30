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

function toId(value) {
  return value === undefined || value === null ? '' : String(value)
}

function getCategoryItems(payload) {
  const candidates = [
    payload?.categories,
    payload?.Categories,
    payload?.data?.categories,
    payload?.data?.Categories,
    payload?.data,
    payload?.items,
    payload?.Items,
    payload,
  ]

  return candidates.find((candidate) => Array.isArray(candidate)) || []
}

function readChildren(category) {
  const children = readField(
    category,
    'children',
    'Children',
    'subCategories',
    'SubCategories',
    'subcategories',
  )

  return Array.isArray(children) ? children : []
}

export function normalizeCategoryTree(payload) {
  const categories = getCategoryItems(payload)
  const categoriesById = new Map()
  const orderedIds = []

  function visitCategory(category, inheritedParentId = '') {
    const id = toId(readField(category, 'id', 'Id', 'categoryId', 'CategoryId'))

    if (!id) {
      return
    }

    if (!categoriesById.has(id)) {
      orderedIds.push(id)
    }

    const existingCategory = categoriesById.get(id) || {}
    const parentId =
      toId(
        readField(
          category,
          'parentId',
          'ParentId',
          'parentCategoryId',
          'ParentCategoryId',
        ),
      ) ||
      inheritedParentId ||
      existingCategory.parentId ||
      ''

    categoriesById.set(id, {
      id,
      name:
        readField(category, 'name', 'Name', 'title', 'Title') ||
        existingCategory.name ||
        'Adsiz kategori',
      parentId,
    })

    readChildren(category).forEach((childCategory) => {
      visitCategory(childCategory, id)
    })
  }

  categories.forEach((category) => visitCategory(category))

  const nodesById = new Map(
    orderedIds.map((id) => [
      id,
      {
        ...categoriesById.get(id),
        children: [],
      },
    ]),
  )
  const roots = []

  orderedIds.forEach((id) => {
    const category = nodesById.get(id)
    const parent = nodesById.get(category.parentId)

    if (parent && parent.id !== category.id) {
      parent.children.push(category)
      return
    }

    roots.push(category)
  })

  return roots
}

export function flattenSubCategoryOptions(categories, prefix = '') {
  return categories.flatMap((category) => {
    const label = prefix ? `${prefix} / ${category.name}` : category.name

    return [
      {
        ...category,
        label,
      },
      ...flattenSubCategoryOptions(category.children || [], label),
    ]
  })
}

export function findCategorySelection(categories, categoryId) {
  const selectedCategoryId = toId(categoryId)

  if (!selectedCategoryId) {
    return {
      mainCategoryId: '',
      categoryId: '',
    }
  }

  function findInTree(nodes, ancestors = []) {
    for (const category of nodes) {
      const nextAncestors = [...ancestors, category]

      if (category.id === selectedCategoryId) {
        if (ancestors.length === 0) {
          return {
            mainCategoryId: category.id,
            categoryId: '',
          }
        }

        return {
          mainCategoryId: ancestors[0].id,
          categoryId: category.id,
        }
      }

      const childSelection = findInTree(category.children || [], nextAncestors)

      if (childSelection) {
        return childSelection
      }
    }

    return null
  }

  return (
    findInTree(categories) || {
      mainCategoryId: '',
      categoryId: selectedCategoryId,
    }
  )
}
