/**
 * 将数组每项中间插入分隔项
 * @param arr 原数组
 * @param item 插入的分隔项
 * @returns {*[]} 新数组
 */

export function join(arr, item) {
  const arr2 = []
  arr.forEach((i) => arr2.push(i, item))
  arr2.pop()
  return arr2
}
