/**
 * JWT Error
 */
export enum JwtErrorName {
  JsonWebTokenError = "令牌无效",
  NotBeforeError = "令牌不在使用时间",
  TokenExpiredError = "令牌已过期",
}