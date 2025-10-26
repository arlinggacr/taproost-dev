import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { SERVER_AUTHORIZATION } from 'src/constant';
import { JwtPayload } from '../interface/jwt-definition.interface';

@Injectable()
export class JwtAccessStrategy extends PassportStrategy(Strategy, 'access') {
  logger: Logger;

  constructor(private configService: ConfigService) {
    super({
      secretOrKey: configService.get('JWT_ACCESS_SECRET_KEY'),
      ignoreExpiration: false,
      jwtFromRequest: ExtractJwt.fromExtractors([
        ExtractJwt.fromAuthHeaderAsBearerToken(),
        (req: Record<string, any>) => {
          if (req.cookies && SERVER_AUTHORIZATION in req.cookies) {
            return req.cookies[SERVER_AUTHORIZATION];
          }
          return null;
        },
      ]),
    });
    this.logger = new Logger(JwtAccessStrategy.name);
  }

  async validate(payload: JwtPayload): Promise<JwtPayload> {
    this.logger.log('Validate jwt token');
    return payload;
  }
}
