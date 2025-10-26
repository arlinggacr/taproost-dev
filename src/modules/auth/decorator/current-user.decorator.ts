import { ExecutionContext, createParamDecorator } from '@nestjs/common';
import { FastifyRequest } from 'fastify';

export const CurrentUser = createParamDecorator(
  (_data: any, context: ExecutionContext) => {
    const request = context.switchToHttp().getRequest<FastifyRequest>();
    return request.user;
  },
);
