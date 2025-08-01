import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { Request } from 'express';

export const GetUser = createParamDecorator(
  (data: string | undefined, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest<Request>();

    // Ensure request.user is treated as any or a known type
    const user = request.user as any;

    if (data) {
      return user?.[data];  // Safely access the property
    }

    return user;
  },
);
