import { logout } from "~/actions/auth";
import { SubmitButton } from "~/components/ui/submit-button";

export function LogoutButton() {
  return (
    <form className="absolute right-4 top-4">
      <SubmitButton
        formAction={logout}
        variant="ghost"
        className="text-sm text-muted-foreground hover:text-foreground"
      >
        Logout
      </SubmitButton>
    </form>
  );
}
