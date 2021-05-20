/**
 * API 业务错误编码
 */
 export enum ApiErrorCode {
  TIMEOUT = -1, // 系统繁忙
  SUCCESS = 0, // 成功
  TOKEN_FAIL = 30001,
  NO_PERMISSION = 10011,
  BAD_REQUEST = 400, // 参数错误
  UNAUTHORIZED = 401, // 未授权
  FORBIDDEN = 403, // 被拒绝
  NOT_FOUND = 404, // 没有对应信息

  USER_ID_INVALID = 10001, // 用户ID无效
  USER_ACCOUNT_INVALID = 10002, // 用户ID无效
  USER_PASSWORD_INVALID = 10003, // 用户密码无效
  USER_NAME_INVALID = 10004, // 用户姓名无效
  USER_EMAIL_INVALID = 10005, // 用户邮箱无效
  USER_PHONE_INVALID = 10006, // 用户电话无效
  USER_ACCOUNT_PASSWORD_INVALID = 10007 // 用户账号获密码无效
}