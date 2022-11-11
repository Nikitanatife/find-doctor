import { UserRoles } from '../../../constants';
import { CanActivate, ExecutionContext, mixin } from '@nestjs/common';

export const RoleGuard = (role: UserRoles) => {
  class RoleGuardMixin implements CanActivate {
    canActivate(context: ExecutionContext) {
      const req = context.switchToHttp().getRequest();

      return req.user && req.user.role === role;
    }
  }

  return mixin(RoleGuardMixin);
};
