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
 * sunxh 2023-6-1
 */
export function getDictDetails(dictTypeId: number): Promise<DictDetail[]> | undefined {
  console.info(dictTypeId)
  let dict: Dict | undefined = dictMap.get(dictTypeId)
  if (dict) {
    if (dict.details) return Promise.resolve(dict.details)
    if (dict.fetch) return dict.fetch
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
  return dict.fetch
}

export default getDictDetails

export { dictMap }
