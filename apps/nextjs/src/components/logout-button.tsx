import type { ComponentPropsWithoutRef } from "react";

import { logout } from "~/actions/auth";
import { SubmitButton } from "~/components/ui/submit-button";

type LogoutButtonProps = ComponentPropsWithoutRef<typeof SubmitButton>;

export function LogoutButton({ className, ...props }: LogoutButtonProps) {
  return (
    <form>
      <SubmitButton
        formAction={logout}
        variant="ghost"
        className={className}
        {...props}
      >
        Logout
      </SubmitButton>
    </form>
  );
}
