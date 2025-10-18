/**
 * 驼峰转小写下划线
 */
export function toLowerUnderscore(str: string) {
  return str.replace(/([A-Z])/g, '_$1').toLowerCase()
}

/**
 * 将下划线命名的字符串转换为驼峰式命名（小写开头）
 * @param str 下划线命名的字符串（如：user_name、user_info_detail）
 * @returns 驼峰式命名的字符串（如：userName、userInfoDetail）
 */
export function underscoreToCamelCase(str: string): string {
  // 处理空字符串或非字符串输入
  if (typeof str !== 'string' || str.trim() === '') {
    return str;
  }

  // 分割下划线，过滤空字符，然后转换为驼峰
  return str
    .split('_')
    .filter(part => part !== '') // 处理连续下划线的情况（如：user__name -> userName）
    .map((part, index) => {
      // 第一个部分保持小写，后续部分首字母大写，其余小写
      if (index === 0) {
        return part.toLowerCase();
      }
      return part.charAt(0).toUpperCase() + part.slice(1).toLowerCase();
    })
    .join('');
}
