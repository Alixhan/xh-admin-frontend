import { queryDictDetailList } from '@/api/system/dict'

export interface DictDetail {
  readonly sysDictTypeId: number
  readonly parentId: number
  readonly value: string
  readonly label: string
}

export interface Dict {
  readonly sysDictTypeId: number
  details?: DictDetail[]
  fetch?: Promise<DictDetail[]>
}

const dictMap: Map<number, Dict> = new Map()

/**
 * 通过数据字典类型ID获取数据字典明细
 * valueType可以定制value的类型，默认为string
 * sunxh 2023-6-1
 */
export function getDictDetails(dictTypeId: number, valueType?: 'boolean' | 'number'): Promise<DictDetail[]> | undefined {
  const valueConvert = (res) => {
    res.forEach((i) => {
      if (valueType === 'boolean') {
        if (i.value === '0') i.value = false
        else if (i.value === 'false') i.value = false
        else i.value = Boolean(i.value)
      }
      if (valueType === 'number') i.value = Number(i.value)
    })
    return res
  }

  let dict: Dict | undefined = dictMap.get(dictTypeId)
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
  dictMap.set(dictTypeId, dict)
  return dict.fetch!.then(valueConvert)
}

export default getDictDetails

export { dictMap }
