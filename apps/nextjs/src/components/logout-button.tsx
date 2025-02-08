import type { ComponentPropsWithoutRef } from "react";
import { useFormState } from "react-dom";

import { logout } from "~/actions/auth";
import { SubmitButton } from "~/components/ui/submit-button";

type LogoutButtonProps = ComponentPropsWithoutRef<typeof SubmitButton> & {
  onLogoutSuccess?: () => void;
};

export function LogoutButton({
  className,
  onLogoutSuccess,
  ...props
}: LogoutButtonProps) {
  const [, formAction] = useFormState(async (prevState: null) => {
    await logout();
    onLogoutSuccess?.();
    return prevState;
  }, null);

  return (
    <form action={formAction}>
      <SubmitButton variant="ghost" className={className} {...props}>
        Logout
      </SubmitButton>
    </form>
  );
}
