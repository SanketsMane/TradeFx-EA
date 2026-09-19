import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Role } from '@prisma/client';
import { ROLES_KEY } from '../decorators/roles.decorator';
import { IS_PUBLIC_KEY } from '../decorators/public.decorator';
import { AuthPayload } from '../decorators/current-user.decorator';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(ctx: ExecutionContext): boolean {
    // A @Public() route carries no authenticated user, so role checks cannot
    // apply — including any class-level @Roles it inherits.
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      ctx.getHandler(),
      ctx.getClass(),
    ]);
    if (isPublic) return true;

    const required = this.reflector.getAllAndOverride<Role[]>(ROLES_KEY, [
      ctx.getHandler(),
      ctx.getClass(),
    ]);

    const req = ctx.switchToHttp().getRequest<{ user?: AuthPayload }>();
    const user = req.user;

    /*
     * Default-deny for customers.
     *
     * Most staff controllers declare no @Roles at all, which used to mean
     * "any authenticated user". That was harmless while every account was
     * staff, but a CUSTOMER reaching /accounts or /copiers would be able to
     * read and control other clients' trading accounts. So an undeclared
     * route is staff-only, and customer-facing routes have to opt in with an
     * explicit @Roles(Role.CUSTOMER).
     */
    if (!required || required.length === 0) {
      if (user?.role === Role.CUSTOMER) {
        throw new ForbiddenException('Insufficient role');
      }
      return true;
    }

    if (!user || !required.includes(user.role)) {
      throw new ForbiddenException('Insufficient role');
    }
    return true;
  }
}
