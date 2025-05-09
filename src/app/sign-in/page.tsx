import SocialSignIn from "@/components/custom/social-sign-in";
import SignInForm from "@/components/forms/sign-in";

export default function SignInPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4">
      <div className="p-15 bg-base-200 rounded-lg shadow-md w-full max-w-sm">
        <h1>Sign In</h1>
        <p>Sign in to your account</p>
        {/* Add your sign-in form here */}
        <SignInForm />
        <div className="divider">ou você pode logar com</div>
          {/* Add your social sign-in component here */}
          <SocialSignIn />
      </div>
    </div>
  );
}