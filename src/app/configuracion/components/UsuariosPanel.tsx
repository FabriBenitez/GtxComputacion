'use client'

import { useState } from 'react'
import { toast } from 'sonner'
import { Eye, MoreVertical, Package, Shield, User, UserPlus } from 'lucide-react'

interface TeamMember {
  id: string
  nombre: string
  email: string
  rol: 'admin' | 'vendedor' | 'stock' | 'solo-lectura'
  estado: 'activo' | 'inactivo'
  ultimoAcceso: string
  iniciales: string
  color: string
}

const members: TeamMember[] = [
  { id: '1', nombre: 'Martin Rodriguez', email: 'martin@techops.store', rol: 'admin', estado: 'activo', ultimoAcceso: 'Hoy, 13:53 hs', iniciales: 'MR', color: 'bg-primary/10 text-primary' },
  { id: '2', nombre: 'Sofia Paredes', email: 'sofia@techops.store', rol: 'vendedor', estado: 'activo', ultimoAcceso: 'Hoy, 12:21 hs', iniciales: 'SP', color: 'bg-success/10 text-success' },
  { id: '3', nombre: 'Lucas Mendoza', email: 'lucas@techops.store', rol: 'stock', estado: 'activo', ultimoAcceso: 'Hoy, 09:44 hs', iniciales: 'LM', color: 'bg-warning/10 text-warning' },
]

const rolConfig = {
  admin: { label: 'Admin', icon: Shield, badge: 'badge-primary' },
  vendedor: { label: 'Vendedor', icon: User, badge: 'badge-success' },
  stock: { label: 'Stock', icon: Package, badge: 'badge-warning' },
  'solo-lectura': { label: 'Solo Lectura', icon: Eye, badge: 'badge-muted' },
}

export default function UsuariosPanel() {
  const [showInvite, setShowInvite] = useState(false)
  const [inviteEmail, setInviteEmail] = useState('')
  const [inviteRol, setInviteRol] = useState('vendedor')

  function sendInvite() {
    if (!inviteEmail) return
    toast.success(`Invitacion enviada a ${inviteEmail}`, {
      description: `Rol asignado: ${rolConfig[inviteRol as keyof typeof rolConfig].label}`,
    })
    setInviteEmail('')
    setShowInvite(false)
  }

  return (
    <div className="space-y-5">
      <div className="overflow-hidden rounded-xl border border-border bg-white">
        <div className="flex items-center justify-between border-b border-border px-6 py-4">
          <div>
            <h3 className="text-sm font-semibold text-foreground">Equipo</h3>
            <p className="mt-0.5 text-xs text-muted-foreground">{members.length} miembros activos</p>
          </div>
          <button onClick={() => setShowInvite((current) => !current)} className="btn-primary px-3 py-2 text-xs">
            <UserPlus size={13} />
            Invitar usuario
          </button>
        </div>

        {showInvite ? (
          <div className="border-b border-primary/10 bg-primary/5 px-6 py-4">
            <p className="mb-3 text-sm font-semibold text-foreground">Invitar nuevo miembro</p>
            <div className="flex items-end gap-3">
              <div className="flex-1">
                <label className="mb-1.5 block text-xs font-semibold text-muted-foreground">Email</label>
                <input value={inviteEmail} onChange={(event) => setInviteEmail(event.target.value)} className="w-full rounded-lg border border-border px-3 py-2 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20" />
              </div>
              <div className="w-40">
                <label className="mb-1.5 block text-xs font-semibold text-muted-foreground">Rol</label>
                <select value={inviteRol} onChange={(event) => setInviteRol(event.target.value)} className="w-full rounded-lg border border-border px-3 py-2 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20">
                  <option value="vendedor">Vendedor</option>
                  <option value="stock">Gestion Stock</option>
                  <option value="solo-lectura">Solo Lectura</option>
                  <option value="admin">Admin</option>
                </select>
              </div>
              <button onClick={sendInvite} className="btn-primary px-4 py-2 text-sm">Enviar</button>
              <button onClick={() => setShowInvite(false)} className="btn-secondary px-4 py-2 text-sm">Cancelar</button>
            </div>
          </div>
        ) : null}

        <div className="divide-y divide-border">
          {members.map((member) => {
            const role = rolConfig[member.rol]
            const Icon = role.icon
            return (
              <div key={member.id} className="group flex items-center gap-4 px-6 py-4 transition-colors hover:bg-muted/20">
                <div className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-xs font-bold ${member.color}`}>{member.iniciales}</div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-semibold text-foreground">{member.nombre}</p>
                    {member.estado === 'inactivo' ? <span className="badge badge-muted text-[10px]">Inactivo</span> : null}
                  </div>
                  <p className="font-mono text-xs text-muted-foreground">{member.email}</p>
                </div>
                <div className="flex shrink-0 items-center gap-2">
                  <span className={`badge ${role.badge} flex items-center gap-1`}><Icon size={10} />{role.label}</span>
                </div>
                <div className="hidden shrink-0 text-xs text-muted-foreground xl:block">{member.ultimoAcceso}</div>
                <button className="rounded-lg p-1.5 text-muted-foreground opacity-0 transition-colors group-hover:opacity-100 hover:bg-muted hover:text-foreground">
                  <MoreVertical size={15} />
                </button>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
