import { queryDictDetailList } from '@/api/system/dict'
import type { DictDetailValueTypeEnum, DictDetailValueType, DictCache, DictDetail } from '@i/utils/dict'

// 数据字典缓存map
const dictCacheMap: Map<number, DictCache> = new Map()

/**
 * 通过数据字典类型ID获取数据字典明细
 * valueType 可以定制 value 的类型，默认为 string
 * sxh 2023-6-1
 */
export async function getDictDetails<T extends DictDetailValueType<K>, K extends DictDetailValueTypeEnum>(
  dictTypeId: number,
  valueType?: K
): Promise<DictDetail<T>[]> {
  //数据转化方法
  const valueConvert = (res: DictDetail<string>[]) => {
    const details: DictDetail<T>[] = res.map((i) => {
      let value: any = i.value
      //转为布尔型
      if (valueType === 'boolean') {
        if (value === '0') value = false
        else if (value === 'false') value = false
        else value = Boolean(value)
      }
      //转为数字型
      if (valueType === 'number') value = Number(value)
      return {
        ...i,
        value: value as T
      }
    })
    return details
  }

  let dict: DictCache | void = dictCacheMap.get(dictTypeId)
  //如果已缓存直接取缓存数据即可
  if (dict) {
    if (dict.details) return Promise.resolve(dict.details).then(valueConvert)
    if (dict.fetch) return dict.fetch.then(valueConvert)
  }
  dict = {
    sysDictTypeId: dictTypeId,
    fetch: queryDictDetailList({ isPage: false, param: { dictTypeId } })
      .then((res) => {
        const binary = res.data.list
        dict!.details = binary
        return binary
      })
      .catch(() => {
        delete dict!.fetch
      })
  }
  dictCacheMap.set(dictTypeId, dict)
  return dict.fetch!.then(valueConvert)
}

export default getDictDetails

export { dictCacheMap }
