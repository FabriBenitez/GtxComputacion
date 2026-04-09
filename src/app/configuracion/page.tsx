import AppLayout from '@/components/AppLayout'
import SettingsLayout from './components/SettingsLayout'

export default function ConfiguracionPage() {
  return (
    <AppLayout>
      <div className="mx-auto max-w-screen-2xl px-6 py-6 lg:px-8 xl:px-10">
        <div className="mb-6">
          <h1 className="text-2xl font-bold tracking-tight text-foreground">Configuracion</h1>
          <p className="mt-0.5 text-sm text-muted-foreground">Ajusta los parametros del sistema, WhatsApp, metodos de pago y mas.</p>
        </div>
        <SettingsLayout />
      </div>
    </AppLayout>
  )
}
