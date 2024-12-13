import { queryDictDetailList } from '@/api/system/dict'
import type { DictCache, DictDetail, DictDetailValueType, DictDetailValueTypeEnum } from '@i/utils/dict'
import type { Ref } from 'vue'
import { ref } from 'vue'

// 数据字典缓存map
export const dictCacheMap: Map<number, DictCache> = new Map()

/**
 * 通过数据字典类型ID获取数据字典明细
 * valueType 可以定制 value 的类型，默认为 string
 * sxh 2023-6-1
 */
export default function useDictDetails<T extends DictDetailValueType<K>, K extends DictDetailValueTypeEnum>(
  dictTypeId: number,
  valueType?: K
) {
  //数据转化方法
  const valueConvert = (data: DictDetail<string>[]) => {
    const details: DictDetail<T>[] = data.map((i) => {
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

  let fetch = dictCacheMap.get(dictTypeId)
  //如果已缓存直接取缓存数据即可
  if (!fetch) {
    fetch = queryDictDetailList({ isPage: false, param: { dictTypeId } })
      .then((res) => res.data.list)
      .catch(() => dictCacheMap.delete(dictTypeId))
    dictCacheMap.set(dictTypeId, fetch)
  }
  const dictDetails: Ref<DictDetail<T>[]> = ref([])
  fetch.then((data) => (dictDetails.value = valueConvert(data)))
  return dictDetails
}
