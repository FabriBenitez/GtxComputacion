import BrandPanel from './components/BrandPanel'
import LoginForm from './components/LoginForm'

export default function SignUpLoginPage() {
  return (
    <div className="flex min-h-screen bg-background">
      <BrandPanel />
      <div className="flex flex-1 items-center justify-center bg-white px-6 py-12">
        <div className="w-full max-w-md">
          <LoginForm />
        </div>
      </div>
    </div>
  )
}
