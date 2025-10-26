import { User } from 'src/auth/entity/user.entity';

declare module 'fastify' {
  export interface FastifyRequest extends SignerMethods {
    cookies: { [cookieName: string]: string | undefined };
    user: User;
  }
  export interface FastifyReply {
    setCookie(
      name: string,
      value: string,
      options?: CookieSerializeOptions,
    ): this;

    clearCookie(name: string, options?: CookieSerializeOptions): this;
  }

  export interface SerializeOptions {
    domain?: string;
    encode?(val: string): string;
    expires?: Date;
    httpOnly?: boolean;
    maxAge?: number;
    path?: string;
    priority?: 'low' | 'medium' | 'high';
    sameSite?: 'lax' | 'none' | 'strict' | boolean;
    secure?: boolean;
  }

  export interface CookieSerializeOptions
    extends Omit<SerializeOptions, 'secure'> {
    secure?: boolean | 'auto';
    signed?: boolean;
  }

  export interface UnsignResult {
    valid: boolean;
    renew: boolean;
    value: string | null;
  }

  interface SignerMethods {
    signCookie(value: string): string;
    unsignCookie(value: string): UnsignResult;
  }
}
