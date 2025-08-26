import { useNavigate } from "react-router-dom"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useState } from "react"
import { signInUser } from "@/services/signin-service"
import type { DrfValidationError } from "@/services/signin-service"

// A simple comment to trigger a reload
export function LoginForm({
  className,
  onToggleForm,
  ...props
}: React.ComponentProps<"div"> & { onToggleForm: () => void }) {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [apiError, setApiError] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const navigate = useNavigate()

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value)
  }

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value)
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setApiError("") // Clear previous errors
    setIsLoading(true)

    try {
      const result = await signInUser({ email, password })
      console.log("Welcome!", result.user.username)
      if (result.user.is_superuser) {
        navigate("/adminpanel")
      } else if (result.user.is_staff) {
        navigate("/teacherpanel")
      } else {
        navigate("/userpanel")
      }
    } catch (error) {
      if (error instanceof Error) {
        setApiError(error.message)
      } else {
        const validationErrors = error as DrfValidationError
        // Handle specific field errors if needed, though for login, often a single non_field_errors is returned
        if (validationErrors.non_field_errors) {
          setApiError(validationErrors.non_field_errors[0])
        } else {
          setApiError("An unexpected error occurred during login.")
        }
      }
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card>
        <CardHeader>
          <CardTitle>Login to your account</CardTitle>
          <CardDescription>
            Enter your email below to login to your account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit}>
            <div className="flex flex-col gap-6">
              <div className="grid gap-3">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="m@example.com"
                  required
                  value={email}
                  onChange={handleEmailChange}
                />
              </div>
              <div className="grid gap-3">
                <div className="flex items-center">
                  <Label htmlFor="password">Password</Label>
                  <a
                    href="#"
                    className="ml-auto inline-block text-sm underline-offset-4 hover:underline"
                  >
                    Forgot your password?
                  </a>
                </div>
                <Input
                  id="password"
                  type="password"
                  required
                  value={password}
                  onChange={handlePasswordChange}
                />
              </div>
              {apiError && <p className="text-red-500 text-sm text-center">{apiError}</p>}
              <div className="flex flex-col gap-3">
                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? 'Logging In...' : 'Login'}
                </Button>
                {/* <Button variant="outline" className="w-full">
                  Login with Google
                </Button> */}
              </div>
            </div>
            
            <div className="mt-4 text-center text-sm">
              Don&apos;t have an account?{" "}
              <button type="button" onClick={onToggleForm} className="underline underline-offset-4">
                Sign up
              </button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
