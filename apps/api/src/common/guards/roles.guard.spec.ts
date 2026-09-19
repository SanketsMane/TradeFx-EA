import { ExecutionContext, ForbiddenException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Role } from '@prisma/client';
import { RolesGuard } from './roles.guard';
import { ROLES_KEY } from '../decorators/roles.decorator';
import { IS_PUBLIC_KEY } from '../decorators/public.decorator';
import { AuthPayload } from '../decorators/current-user.decorator';

/**
 * These cover the rule that keeps customers out of the staff API: a route
 * that declares no @Roles is staff-only. Before the CUSTOMER role existed an
 * undeclared route meant "any signed-in user", which would have let a client
 * read and control other clients' trading accounts.
 */
function contextFor(user?: AuthPayload): ExecutionContext {
  return {
    switchToHttp: () => ({ getRequest: () => ({ user }) }),
    getHandler: () => () => undefined,
    getClass: () => class {},
  } as unknown as ExecutionContext;
}

/** A Reflector stubbed to answer the two metadata keys the guard reads. */
function reflectorWith(meta: { roles?: Role[]; isPublic?: boolean }): Reflector {
  return {
    getAllAndOverride: (key: string) =>
      key === ROLES_KEY ? meta.roles : key === IS_PUBLIC_KEY ? meta.isPublic : undefined,
  } as unknown as Reflector;
}

const staff = (role: Role): AuthPayload => ({ sub: 'u1', email: 'a@b.com', role });
const customer: AuthPayload = { sub: 'c1', email: 'c@b.com', role: Role.CUSTOMER };

describe('RolesGuard', () => {
  describe('routes that declare no @Roles', () => {
    const guard = new RolesGuard(reflectorWith({}));

    it('denies a customer', () => {
      expect(() => guard.canActivate(contextFor(customer))).toThrow(ForbiddenException);
    });

    it.each([Role.ADMIN, Role.SUPER_ADMIN])('allows %s', (role) => {
      expect(guard.canActivate(contextFor(staff(role)))).toBe(true);
    });
  });

  describe('routes that declare @Roles', () => {
    it('allows a customer on a customer route', () => {
      const guard = new RolesGuard(reflectorWith({ roles: [Role.CUSTOMER] }));
      expect(guard.canActivate(contextFor(customer))).toBe(true);
    });

    it('denies an admin on a customer-only route', () => {
      const guard = new RolesGuard(reflectorWith({ roles: [Role.CUSTOMER] }));
      expect(() => guard.canActivate(contextFor(staff(Role.ADMIN)))).toThrow(ForbiddenException);
    });

    it('denies a customer on a super-admin route', () => {
      const guard = new RolesGuard(reflectorWith({ roles: [Role.SUPER_ADMIN] }));
      expect(() => guard.canActivate(contextFor(customer))).toThrow(ForbiddenException);
    });

    it('denies an unauthenticated request', () => {
      const guard = new RolesGuard(reflectorWith({ roles: [Role.ADMIN] }));
      expect(() => guard.canActivate(contextFor(undefined))).toThrow(ForbiddenException);
    });
  });

  describe('@Public() routes', () => {
    it('lets an anonymous request through even under a class-level @Roles', () => {
      // AuthController carries @Roles(...) for its session routes, but /login
      // is public and has no user to check — it must not 403.
      const guard = new RolesGuard(
        reflectorWith({ isPublic: true, roles: [Role.SUPER_ADMIN, Role.ADMIN, Role.CUSTOMER] }),
      );
      expect(guard.canActivate(contextFor(undefined))).toBe(true);
    });
  });
});
