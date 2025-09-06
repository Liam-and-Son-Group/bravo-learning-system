import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import { Label } from "@/shared/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/shared/components/ui/card";
import { Eye, EyeOff, Mail, Lock } from "lucide-react";
import { useLoginForm } from "./useLoginForm";

export default function LoginForm() {
  const [
    { register, formState, isSubmitingForm, showPassword },
    { handleSubmit, onSubmit, setShowPassword, redirectToSignup },
  ] = useLoginForm();

  return (
    <div className="flex items-center justify-center h-full mt-14 px-2">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-center">
            Welcome back
          </CardTitle>
          <CardDescription className="text-center">
            Enter your credentials to access your account
          </CardDescription>
        </CardHeader>

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="flex flex-col items-center justify-center"
        >
          <CardContent className="space-y-4 w-full">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  id="username"
                  type="email"
                  placeholder="Enter your email"
                  {...register("username")}
                  className={`pl-10 ${
                    formState.errors.username ? "border-red-500" : ""
                  }`}
                />
              </div>
              {formState.errors.username && (
                <p className="text-sm text-red-500">
                  {formState.errors.username.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  {...register("password")}
                  className={`pl-10 pr-10 ${
                    formState.errors.password ? "border-red-500" : ""
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>
              {formState.errors.password && (
                <p className="text-sm text-red-500">
                  {formState.errors.password.message}
                </p>
              )}
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="remember"
                  // {...register("remember")}
                  className="rounded border-gray-300"
                />
                <Label htmlFor="remember" className="text-sm font-normal">
                  Remember me
                </Label>
              </div>
              <button
                type="button"
                className="text-sm text-blue-600 hover:text-blue-500"
                onClick={() =>
                  alert("Password reset functionality would go here")
                }
              >
                Forgot password?
              </button>
            </div>
          </CardContent>

          <CardFooter className="flex flex-col space-y-4">
            <Button type="submit" className="w-full" disabled={isSubmitingForm}>
              {isSubmitingForm ? "Signing in..." : "Sign in"}
            </Button>

            <div className="text-center text-sm text-gray-600">
              Don't have an account?{" "}
              <button
                type="button"
                className="text-blue-600 hover:text-blue-500 font-medium"
                onClick={redirectToSignup}
              >
                Sign up
              </button>
            </div>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
