import createAxios from '@/utils/request'
import { getCurrentLocales } from '@/i18n'
import { useSystemStore } from '@/stores/system'

const systemBaseUrl = import.meta.env.VITE_SYSTEM_BASE_URL

/**
 * 返回的图形码数据
 */
export interface ImageCaptcha {
  captchaKey: string
  imageBase64: string
}

/**
 * 获取图形验证码
 */
export function getImageCaptcha(captchaKey: string, option?: RequestOption): Promise<RestResponse<ImageCaptcha>> {
  return createAxios(option).get(`${systemBaseUrl}/api/system/user/captcha`, { params: { captchaKey } })
}

/**
 * 系统登录
 */
export function userLogin(params: { [prop: string]: string }, option?: RequestOption) {
  //携带上当前语言信息
  params.locale = useSystemStore().locale
  params.localeLabel = getCurrentLocales().label
  return createAxios(option).post(`${systemBaseUrl}/api/system/user/login`, params)
}

/**
 * 系统角色切换
 */
export function switchUserRole(params = {}, option?: RequestOption) {
  return createAxios(option).post(`${systemBaseUrl}/api/system/user/switchUserRole`, params)
}

/**
 * 语言切换
 */
export function switchLocale(params = {}, option?: RequestOption) {
  return createAxios(option).post(`${systemBaseUrl}/api/system/user/switchLocale`, params)
}

/**
 * 系统注销
 */
export function userLogout(option?: RequestOption) {
  return createAxios(option).post(`${systemBaseUrl}/api/system/user/logout`)
}

// 在线用户查询
export function queryOnlineUser(params = {}, option?: RequestOption) {
  return createAxios(option).post(`${systemBaseUrl}/api/system/user/queryOnlineUser`, params)
}

// 踢用户下线
export function kickOut(params = {}, option?: RequestOption) {
  return createAxios(option).post(`${systemBaseUrl}/api/system/user/kickOut`, params)
}

// 用户角色排序
export function roleSort(params = '', option?: RequestOption) {
  return createAxios(option).post(`${systemBaseUrl}/api/system/user/roleSort`, params)
}

// 保存系统用户
export function personalCenterSave(params = {}, option?: RequestOption) {
  return createAxios(option).post(`${systemBaseUrl}/api/system/user/personalCenterSave`, params)
}

// 获取用户详情
export function getPersonalCenterDetail() {
  return createAxios().get(`${systemBaseUrl}/api/system/user/getPersonalCenterDetail`)
}

// 用户列表查询
export function queryUserList(params = {}, option?: RequestOption) {
  return createAxios(option).post(`${systemBaseUrl}/api/system/user/query`, params)
}

// 保存系统用户
export function postSaveUser(params = {}, option?: RequestOption) {
  return createAxios(option).post(`${systemBaseUrl}/api/system/user/save`, params)
}

// 获取用户详情
export function getUserById(id: number) {
  return createAxios().get(`${systemBaseUrl}/api/system/user/get/${id}`)
}

// 批量删除用户
export function delUserByIds(ids: string, option: RequestOption) {
  return createAxios(option).delete(`${systemBaseUrl}/api/system/user/del`, { params: { ids } })
}

// 用户批量导入
export function importUsers(params: object[], option?: RequestOption) {
  return createAxios(option).post(`${systemBaseUrl}/api/system/user/imports`, params)
}

// 用户账号密码重置
export function postRestPassword(params: object, option?: RequestOption) {
  return createAxios(option).post(`${systemBaseUrl}/api/system/user/resetPassword`, params)
}

export interface UserJobsParam {
  //数据类型 1：用户，2：用户组
  type: 1 | 2
  // 用户id或用户组id
  userId: number
  // 用户岗位信息
  jobData?: any[]
}

// 获取用户或者用户组的岗位信息
export function getUserJobs(params: UserJobsParam) {
  return createAxios().get(`${systemBaseUrl}/api/system/user/getUserJobs`, { params })
}

// 保存系统用户
export function saveUserJobs(params: UserJobsParam, option?: RequestOption) {
  return createAxios(option).post(`${systemBaseUrl}/api/system/user/saveUserJobs`, params)
}

// 用户组列表查询
export function queryUserGroupList(params: PageQuery, option?: RequestOption) {
  return createAxios(option).post(`${systemBaseUrl}/api/system/user/queryUserGroupList`, params)
}

// 用户组保存
export function saveUserGroup(params = {}, option?: RequestOption) {
  return createAxios(option).post(`${systemBaseUrl}/api/system/user/saveUserGroup`, params)
}

// id获取用户组详情
export function getUserGroupById(id: number) {
  return createAxios().get(`${systemBaseUrl}/api/system/user/getUserGroup/${id}`)
}

// ids批量删除用户组
export function delUserGroupByIds(ids: string, option: RequestOption) {
  return createAxios(option).delete(`${systemBaseUrl}/api/system/user/delUserGroup`, { params: { ids } })
}

// 用户id获取用户所在的所有用户组信息
export function getUserGroups(id: number) {
  return createAxios().get(`${systemBaseUrl}/api/system/user/getUserGroups/${id}`)
}
