"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";



import { createClient } from "~/utils/supabase/server";


export async function login(formData: FormData) {
  const supabase = await createClient();

  const data = {
    email: formData.get("email") as string,
    password: formData.get("password") as string,
  };

  const { error, data: authData } =
    await supabase.auth.signInWithPassword(data);

  console.log("Login attempt:", {
    email: data.email,
    error: error?.message,
    authData,
  });

  if (error) {
    switch (error.message) {
      case "Email not confirmed":
        return redirect("/auth/verify-email");
      case "Invalid login credentials":
        return redirect("/sign-in?message=Invalid email or password");
      case "User not found":
        return redirect("/sign-in?message=Account does not exist");
      default:
        return redirect(
          `/sign-in?message=${encodeURIComponent(error.message)}`,
        );
    }
  }

  revalidatePath("/", "layout");
  redirect("/");
}

export async function signup(formData: FormData) {
  const supabase = await createClient();

  const data = {
    email: formData.get("email") as string,
    password: formData.get("password") as string,
  };

  const { error, data: authData } = await supabase.auth.signUp({
    ...data,
    options: {
      emailRedirectTo: `${process.env.NEXT_PUBLIC_APP_URL}/auth/callback`,
    },
  });

  console.log("Signup attempt:", {
    email: data.email,
    error: error?.message,
    authData,
  });

  if (error) {
    switch (error.message) {
      case "User already registered":
        return redirect("/sign-up?message=This email is already registered");
      case "Password should be at least 6 characters":
        return redirect(
          "/sign-up?message=Password must be at least 6 characters",
        );
      case "Unable to validate email address":
        return redirect("/sign-up?message=Please enter a valid email address");
      case "A user with this email address has already been registered":
        return redirect("/sign-up?message=This email is already registered");
      case "Signup requires a valid password":
        return redirect("/sign-up?message=Please enter a valid password");
      default:
        console.log("Unexpected signup error:", error);
        return redirect(
          `/sign-up?message=${encodeURIComponent(error.message)}`,
        );
    }
  }

  // Check if user was created but needs to verify email
  if (authData.user?.identities?.length === 0) {
    return redirect("/sign-up?message=This email is already registered");
  }

  redirect("/auth/verify-email");
}

export async function logout() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  revalidatePath("/", "layout");
  redirect("/sign-in");
}