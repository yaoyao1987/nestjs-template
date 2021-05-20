import { Injectable } from '@nestjs/common'
import { PassportStrategy } from '@nestjs/passport'
import { Strategy, ExtractJwt } from 'passport-jwt'
import { ConfigService } from '@nestjs/config'

import { AuthService } from './auth.service'
import { ApiErrorCode } from '@/common/enums/api-error-code.enum';
import { ApiException } from '@/common/exceptions/api-exception';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  /**
 * 这里的构造函数向父类传递了授权时必要的参数，在实例化时，父类会得知授权时，客户端的请求必须使用 Authorization 作为请求头，
 * 而这个请求头的内容前缀也必须为 Bearer，在解码授权令牌时，使用秘钥 secretOrKey: 'secretKey' 来将授权令牌解码为创建令牌时的 payload。
 */
  constructor(private readonly authService: AuthService, private readonly config: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: config.get('jwt').secretKey
    });
  }

  /**
 * validate 方法实现了父类的抽象方法，在解密授权令牌成功后，即本次请求的授权令牌是没有过期的，
 * 此时会将解密后的 payload 作为参数传递给 validate 方法，这个方法需要做具体的授权逻辑，比如这里我使用了通过用户名查找用户是否存在。
 * 当用户不存在时，说明令牌有误，可能是被伪造了，此时需抛出 UnauthorizedException 未授权异常。
 * 当用户存在时，会将 user 对象添加到 req 中，在之后的 req 对象中，可以使用 req.user 获取当前登录用户。
 */
  async validate(payload: { id: number }, done: any) {
    const user = await this.authService.validateUser(payload)
    // 如果用用户信息，代表 token 没有过期，没有则 token 已失效
    // if (!user) throw new UnauthorizedException()
    if(!user) {
      return done(new ApiException('token无效', ApiErrorCode.TOKEN_FAIL, 30001), false)
    }
    done(null, user)
  }
}