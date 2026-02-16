import { get } from 'lodash-es'

/**
 * 定义排序顺序类型
 */
export type SortOrder = 'ascending' | 'descending' | null

/**
 * TableColumnCtx 上下文接口
 */
export interface TableColumnCtx<T> {
  prop?: string // 对应数据中的键名
  sortBy?: string | string[] | ((row: T, index: number) => string) | ((row: T, index: number) => number)
  sortMethod?: (a: T, b: T) => number
}

/**
 * 比较函数
 */
const compareValues = (a: unknown, b: unknown, order: SortOrder): number => {
  const modifier = order === 'descending' ? -1 : 1

  if (a === b) return 0

  // 空值处理 (null/undefined 视为最小)
  if (a === null || a === undefined) return 1 * modifier
  if (b === null || b === undefined) return -1 * modifier

  // 字符串本地化比较 (支持中文)
  if (typeof a === 'string' && typeof b === 'string') {
    return a.localeCompare(b, 'zh-CN') * modifier
  }

  // 数字/布尔值比较
  if (a > b) {
    return 1 * modifier
  }

  return -1 * modifier
}

/**
 * 主排序函数 (直接修改原数组)
 * @param data 原始数据数组 (将被直接排序)
 * @param column 列配置对象
 * @param order 排序方向
 */
export function sortData<T>(data: T[], column: TableColumnCtx<T>, order: SortOrder): void {
  // 如果没有指定排序顺序，不做任何操作 (因为是原地修改，无法恢复未排序状态，除非外部自行备份)
  if (!order) {
    return
  }

  // 优先使用 sortMethod (自定义排序方法)
  if (column.sortMethod) {
    data.sort((a, b) => {
      const result = column.sortMethod!(a, b)
      return order === 'ascending' ? result : -result
    })
    return
  }

  // 确定排序规则 (sortBy > prop)
  let sortRules: Array<string | ((row: T, index: number) => unknown)> = []

  if (column.sortBy) {
    if (Array.isArray(column.sortBy)) {
      sortRules = column.sortBy
    } else {
      sortRules = [column.sortBy]
    }
  } else if (column.prop) {
    // 默认兜底：如果没有 sortBy，必须使用 prop
    sortRules = [column.prop]
  }

  // 如果连 prop 都没有，无法排序，直接返回
  if (sortRules.length === 0) {
    return
  }

  // 准备索引 Map (仅当 sortRules 中包含函数时才需要)
  // 因为 data.sort 过程中无法直接获取元素的原始索引，通过 Map 辅助查找
  // 注意：如果 data 中存在完全相同的对象引用，索引可能会指向同一个，但在 Table 数据中通常对象是唯一的
  let indexMap: Map<T, number> | null = null
  const hasFunctionRule = sortRules.some((rule) => typeof rule === 'function')

  if (hasFunctionRule) {
    indexMap = new Map<T, number>()
    data.forEach((item, index) => {
      indexMap!.set(item, index)
    })
  }

  // 执行原地排序
  data.sort((a, b) => {
    for (const rule of sortRules) {
      let valA: unknown
      let valB: unknown

      if (typeof rule === 'function') {
        const indexA = indexMap!.get(a) ?? 0
        const indexB = indexMap!.get(b) ?? 0
        valA = rule(a, indexA)
        valB = rule(b, indexB)
      } else {
        valA = get(a, rule)
        valB = get(b, rule)
      }

      const compareResult = compareValues(valA, valB, order)
      if (compareResult !== 0) {
        return compareResult
      }
    }
    return 0
  })
}
