"use client"

import { useEffect, useMemo, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { bins, options, type Bin, type Option } from '@/lib/data'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Badge } from '@/components/ui/badge'

function useSession() {
  const [session, setSession] = useState<import('@supabase/supabase-js').Session | null>(null)
  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => setSession(data.session))
    const { data: sub } = supabase.auth.onAuthStateChange((_e, s) => setSession(s))
    return () => {
      sub.subscription.unsubscribe()
    }
  }, [])
  return session
}

function useIsAdmin(session: import('@supabase/supabase-js').Session | null): boolean {
  return useMemo(() => {
    const role = (session?.user.user_metadata as any)?.role || (session?.user.app_metadata as any)?.role
    return role === 'admin'
  }, [session])
}

export function PricingAdmin(): JSX.Element {
  const session = useSession()
  const isAdmin = useIsAdmin(session)

  const [productEdits, setProductEdits] = useState<Record<string, number>>({})
  const [optionEdits, setOptionEdits] = useState<Record<string, { price: number; is_percentage: boolean }>>({})
  const [loading, setLoading] = useState(false)

  async function signIn(email: string, password: string) {
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) alert(error.message)
  }

  function handleProductEdit(key: string, value: number) {
    setProductEdits((p) => ({ ...p, [key]: value }))
  }

  function handleOptionEdit(code: string, value: number) {
    setOptionEdits((p) => ({ ...p, [code]: { ...(p[code] ?? { is_percentage: options.find(o => o.code === code)?.percentage ?? false }), price: value } }))
  }

  async function saveChanges() {
    try {
      setLoading(true)
      const productUpdates = Object.entries(productEdits).map(([key, price]) => {
        const [model_id, size] = key.split('|')
        return supabase.from('products').update({ base_price: price }).eq('model_id', model_id).eq('size', size)
      })
      const optionUpdates = Object.entries(optionEdits).map(([code, v]) =>
        supabase.from('product_options').update({ price: v.price }).eq('code', code)
      )
      await Promise.all([...productUpdates, ...optionUpdates])
      setProductEdits({})
      setOptionEdits({})
    } catch (e) {
      alert('Errore nel salvataggio: ' + (e as Error).message)
    } finally {
      setLoading(false)
    }
  }

  if (!session) {
    let email = ''
    let password = ''
    return (
      <div className="space-y-3">
        <p className="text-sm">Accedi come amministratore</p>
        <Input placeholder="Email" onChange={(e) => (email = e.target.value)} />
        <Input placeholder="Password" type="password" onChange={(e) => (password = e.target.value)} />
        <Button onClick={() => signIn(email, password)}>Accedi</Button>
      </div>
    )
  }

  if (!isAdmin) {
    return (
      <div className="space-y-4">
        <p className="text-sm">Sei autenticato come <Badge>{session.user.email}</Badge></p>
        <p className="text-red-600 text-sm">Non hai i permessi admin.</p>
        <Button variant="secondary" onClick={() => supabase.auth.signOut()}>Esci</Button>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="text-sm">Autenticato come <Badge>{session.user.email}</Badge> <Badge variant="outline">admin</Badge></div>
        <div className="space-x-2">
          <Button variant="outline" onClick={() => supabase.auth.signOut()}>Esci</Button>
          <Button onClick={saveChanges} disabled={loading || (!Object.keys(productEdits).length && !Object.keys(optionEdits).length)}>
            {loading ? 'Salvataggio...' : 'Salva modifiche'}
          </Button>
        </div>
      </div>

      <div>
        <h3 className="font-semibold mb-2">Prodotti</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {bins.map((b) => {
            const key = `${b.modelId}|${b.size}`
            const value = productEdits[key] ?? b.basePrice
            return (
              <div key={key} className="border rounded p-3 space-y-2">
                <div className="text-sm font-medium">{b.name} {b.size}L</div>
                <div className="flex items-center gap-2">
                  <Input type="number" step="0.01" value={value} onChange={(e) => handleProductEdit(key, Number(e.target.value))} />
                  <span className="text-sm">€</span>
                </div>
              </div>
            )
          })}
        </div>
      </div>

      <div>
        <h3 className="font-semibold mb-2">Opzioni</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {options.map((o) => {
            const value = optionEdits[o.code]?.price ?? o.price
            return (
              <div key={o.code} className="border rounded p-3 space-y-2">
                <div className="text-sm font-medium">{o.label}</div>
                <div className="flex items-center gap-2">
                  <Input type="number" step="0.01" value={value} onChange={(e) => handleOptionEdit(o.code, Number(e.target.value))} />
                  <span className="text-sm">{o.percentage ? '%' : '€'}</span>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}

export function PricingAdminDialog(): JSX.Element {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">Admin</Button>
      </DialogTrigger>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle>Gestione Prezzi</DialogTitle>
        </DialogHeader>
        <PricingAdmin />
      </DialogContent>
    </Dialog>
  )
}


