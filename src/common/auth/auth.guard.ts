import { AuthGuard } from '@nestjs/passport'
import { ExecutionContext, Injectable } from '@nestjs/common';

import { UsersService } from '@/system/users/users.service'
import { ApiErrorCode } from '@/common/enums/api-error-code.enum';
import { ApiException } from '@/common/exceptions/api-exception';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  constructor(
    private readonly usersService: UsersService
  ) { super() }

  async canActivate(
    context: ExecutionContext
  ): Promise<boolean> {
    const ctx = context.switchToHttp()
    const req = ctx.getRequest()
    const res = ctx.getResponse()

    try {
      // 获取 accessToken
      const accessToken = req.get('Authorization')
      if (!accessToken) throw new ApiException('请先登录', ApiErrorCode.BAD_REQUEST, 200);
      // 验证 accessToken 是否过期, 未过期，将请求交给下一级
      const isValidAccessToken = await this.usersService.verifyToken(accessToken.replace('Bearer ', ''))
      if (isValidAccessToken) return this.activate(context)
      // 获取 refreshToken
      const refreshToken = req.get('RefreshToken')
      if (!refreshToken) throw new ApiException('refreshToken 不存在', ApiErrorCode.BAD_REQUEST, 200);
      // 验证 当前 refreshToken 是否有效
      const isValidRefreshToken = await this.usersService.verifyToken(refreshToken)
      if (!isValidRefreshToken) throw new ApiException('refreshToken 过期', ApiErrorCode.BAD_REQUEST, 200);
      // 查询用户
      const user = await this.usersService.findOneById(isValidRefreshToken)
      if (user) {
        const tokens = await this.usersService.refreshToken(isValidRefreshToken)
        // request headers 对象 prop 属性全自动转成小写，
        // 所以 获取 request.headers['authorization'] 或 request.get('Authorization') 
        // 重置属性 request.headers[authorization] = value
        req.headers['authorization'] = tokens.accessToken
        req.headers['refreshtoken'] = tokens.refreshToken
        // 在响应头中加入新的token，客户端判断响应头有无 Authorization 字段，有则重置
        res.header('Authorization', tokens.accessToken)
        res.header('refreshToken', tokens.refreshToken)

        // 将 当前请求交给下一级
        return this.activate(context)
      } else {
        throw new ApiException('用户不存在', ApiErrorCode.UNAUTHORIZED, 200);
      }
    } catch (error) {
      return false
    }
  }

  async activate(context: ExecutionContext): Promise<boolean> {
    return super.canActivate(context) as Promise<boolean>
  }
}