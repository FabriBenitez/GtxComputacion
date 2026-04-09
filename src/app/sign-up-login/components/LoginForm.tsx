'use client'

import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { CheckCheck, Copy, Eye, EyeOff, Loader2, LogIn } from 'lucide-react'
import { toast } from 'sonner'
import AppLogo from '@/components/ui/AppLogo'

interface LoginFormData {
  email: string
  password: string
  remember: boolean
}

interface DemoCredential {
  role: string
  roleLabel: string
  email: string
  password: string
  color: string
}

const demoCredentials: DemoCredential[] = [
  {
    role: 'admin',
    roleLabel: 'Admin / Dueno',
    email: 'martin@techops.store',
    password: 'admin2026',
    color: 'text-primary',
  },
  {
    role: 'vendedor',
    roleLabel: 'Vendedor',
    email: 'sofia@techops.store',
    password: 'vendedor2026',
    color: 'text-success',
  },
  {
    role: 'stock',
    roleLabel: 'Gestion Stock',
    email: 'lucas@techops.store',
    password: 'stock2026',
    color: 'text-warning',
  },
]

export default function LoginForm() {
  const router = useRouter()
  const [formData, setFormData] = useState<LoginFormData>({
    email: '',
    password: '',
    remember: false,
  })
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [copiedField, setCopiedField] = useState<string | null>(null)

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setIsLoading(true)
    setError('')

    await new Promise((resolve) => setTimeout(resolve, 900))

    const valid = demoCredentials.find(
      (credential) =>
        credential.email === formData.email && credential.password === formData.password,
    )

    if (!valid) {
      setIsLoading(false)
      setError('Credenciales invalidas. Usa una de las cuentas demo.')
      return
    }

    toast.success(`Bienvenido, ${valid.roleLabel}`, {
      description: 'Redirigiendo al dashboard...',
    })

    setTimeout(() => {
      router.push('/dashboard')
    }, 700)
  }

  function autofill(credential: DemoCredential) {
    setFormData((current) => ({
      ...current,
      email: credential.email,
      password: credential.password,
    }))
    setError('')
    toast.info(`Credenciales de ${credential.roleLabel} cargadas`)
  }

  async function copyToClipboard(text: string, key: string) {
    await navigator.clipboard.writeText(text)
    setCopiedField(key)
    setTimeout(() => setCopiedField(null), 1800)
  }

  return (
    <div className="animate-fade-in">
      <div className="mb-8 flex items-center gap-2 lg:hidden">
        <AppLogo size={32} />
        <span className="text-lg font-bold text-foreground">TechOps</span>
      </div>

      <div className="mb-8">
        <h2 className="text-2xl font-bold tracking-tight text-foreground">Iniciar sesion</h2>
        <p className="mt-1.5 text-sm text-muted-foreground">
          Ingresa con tu cuenta del equipo TechOps.
        </p>
      </div>

      <form onSubmit={handleSubmit} noValidate className="space-y-5">
        <div>
          <label htmlFor="email" className="mb-1.5 block text-sm font-semibold text-foreground">
            Email
          </label>
          <input
            id="email"
            type="email"
            value={formData.email}
            onChange={(event) => setFormData((current) => ({ ...current, email: event.target.value }))}
            placeholder="tu@techops.store"
            className={`w-full rounded-lg border px-3.5 py-2.5 text-sm outline-none transition-colors focus:border-primary focus:ring-2 focus:ring-primary/20 ${error ? 'border-destructive bg-destructive/5' : 'border-border bg-white hover:border-primary/40'}`}
          />
        </div>

        <div>
          <div className="mb-1.5 flex items-center justify-between">
            <label htmlFor="password" className="block text-sm font-semibold text-foreground">
              Contrasena
            </label>
            <button type="button" className="text-xs font-medium text-primary transition-colors hover:text-primary/80">
              ¿Olvidaste tu contrasena?
            </button>
          </div>
          <div className="relative">
            <input
              id="password"
              type={showPassword ? 'text' : 'password'}
              value={formData.password}
              onChange={(event) => setFormData((current) => ({ ...current, password: event.target.value }))}
              placeholder="••••••••"
              className={`w-full rounded-lg border px-3.5 py-2.5 pr-10 text-sm outline-none transition-colors focus:border-primary focus:ring-2 focus:ring-primary/20 ${error ? 'border-destructive bg-destructive/5' : 'border-border bg-white hover:border-primary/40'}`}
            />
            <button
              type="button"
              onClick={() => setShowPassword((current) => !current)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground transition-colors hover:text-foreground"
              aria-label={showPassword ? 'Ocultar contrasena' : 'Mostrar contrasena'}
            >
              {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>
          {error ? <p className="mt-1.5 text-xs text-destructive">⚠ {error}</p> : null}
        </div>

        <div className="flex items-center gap-2.5">
          <input
            id="remember"
            type="checkbox"
            checked={formData.remember}
            onChange={(event) => setFormData((current) => ({ ...current, remember: event.target.checked }))}
            className="h-4 w-4 cursor-pointer rounded border-border accent-primary"
          />
          <label htmlFor="remember" className="cursor-pointer select-none text-sm text-muted-foreground">
            Recordarme en este dispositivo
          </label>
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="btn-primary w-full justify-center py-3 text-sm disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isLoading ? (
            <>
              <Loader2 size={16} className="animate-spin" />
              Verificando...
            </>
          ) : (
            <>
              <LogIn size={16} />
              Ingresar al sistema
            </>
          )}
        </button>
      </form>

      <div className="mt-8">
        <div className="mb-4 flex items-center gap-3">
          <div className="h-px flex-1 bg-border" />
          <span className="whitespace-nowrap text-xs font-medium text-muted-foreground">
            Cuentas de demostracion
          </span>
          <div className="h-px flex-1 bg-border" />
        </div>

        <div className="overflow-hidden rounded-xl border border-border">
          <div className="grid grid-cols-3 border-b border-border bg-muted/40 px-4 py-2 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
            <span>Rol</span>
            <span>Email</span>
            <span className="text-right">Accion</span>
          </div>
          {demoCredentials.map((credential) => (
            <div
              key={credential.role}
              className="grid grid-cols-3 items-center border-b border-border px-4 py-3 last:border-0 hover:bg-muted/20"
            >
              <span className={`text-xs font-semibold ${credential.color}`}>{credential.roleLabel}</span>
              <div className="flex items-center gap-1.5">
                <span className="truncate font-mono text-[11px] text-muted-foreground">{credential.email}</span>
                <button
                  type="button"
                  onClick={() => copyToClipboard(credential.email, credential.role)}
                  className="shrink-0 text-muted-foreground transition-colors hover:text-primary"
                  title="Copiar email"
                >
                  {copiedField === credential.role ? (
                    <CheckCheck size={11} className="text-success" />
                  ) : (
                    <Copy size={11} />
                  )}
                </button>
              </div>
              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={() => autofill(credential)}
                  className="rounded-md border border-primary/20 px-2.5 py-1 text-[11px] font-semibold text-primary transition-colors hover:border-primary/40 hover:bg-primary/5 hover:text-primary/80"
                >
                  Usar
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
