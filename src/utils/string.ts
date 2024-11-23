/**
 * 驼峰转小写下划线
 */
export function toLowerUnderscore(str: string) {
  return str.replace(/([A-Z])/g, '_$1').toLowerCase()
}
