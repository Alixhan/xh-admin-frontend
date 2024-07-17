/**
 * 数据字典工具类类型定义
 */
interface TypeMap {
  string: string
  number: number
  boolean: boolean
}

/**
 * 数据字典值类型枚举
 */
export type DictDetailValueTypeEnum = keyof TypeMap

/**
 * 数据字典值类型
 */
export type DictDetailValueType<T extends DictDetailValueTypeEnum> = TypeMap[T]

/**
 * 数据字典缓存类型定义
 */
export declare type DictCache = Promise<DictDetail<string>[]>

/**
 * 数据字典明细类型定义
 */
export interface DictDetail<T extends DictDetailValueType<DictDetailValueTypeEnum>> {
  //字典类型id
  readonly sysDictTypeId: number
  //上级字典id
  readonly parentId: number
  //字典key值
  readonly value: T
  //字典展示名称
  readonly label: string
}
