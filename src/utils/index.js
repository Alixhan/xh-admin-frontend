/**
 * 将剩余毫秒计算出剩余天数，小时，分钟，秒
 * @param cz 剩余的毫秒数
 * @returns {string}
 */
export function getTimeLeftInfo (cz) {
  const leftsecond = parseInt(cz / 1000)
  let day = Math.floor(leftsecond / (60 * 60 * 24))
  let hour = Math.floor((leftsecond - day * 24 * 60 * 60) / 3600)
  let minute = Math.floor((leftsecond - day * 24 * 60 * 60 - hour * 3600) / 60)
  let second = Math.floor(leftsecond - day * 24 * 60 * 60 - hour * 3600 - minute * 60)
  if (day < 10) { day = '0' + day }
  if (hour < 10) { hour = '0' + hour }
  if (minute < 10) { minute = '0' + minute }
  if (second < 10) { second = '0' + second }
  return {
    day,
    hour,
    minute,
    second
  }
}
