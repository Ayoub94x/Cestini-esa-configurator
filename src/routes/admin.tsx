import React, { useEffect, useMemo, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Separator } from '@/components/ui/separator'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { Toaster } from '@/components/ui/toaster'
import { useToast } from '@/hooks/use-toast'

type ProductRow = {
  id: string
  model_id: string
  size: string
  name: string
  base_price: number
  prod_days: number
  base_image: string
  max_per_truck: number
}

type OptionRow = {
  code: string
  label: string
  price: number
  is_percentage: boolean
  available_for: string[] | null
}

function useSession() {
  const [session, setSession] = useState<import('@supabase/supabase-js').Session | null>(null)
  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => setSession(data.session))
    const { data: sub } = supabase.auth.onAuthStateChange((_e, s) => setSession(s))
    return () => sub.subscription.unsubscribe()
  }, [])
  return session
}

function useIsAdmin(session: import('@supabase/supabase-js').Session | null): boolean {
  return useMemo(() => {
    const role = (session?.user.user_metadata as any)?.role || (session?.user.app_metadata as any)?.role
    return role === 'admin'
  }, [session])
}

function SignInForm() {
  const { toast } = useToast()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  async function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    setLoading(false)
    if (error) {
      toast({ title: 'Errore di accesso', description: error.message, variant: 'destructive' })
    }
  }
  return (
    <Card className="max-w-md w-full">
      <CardHeader>
        <CardTitle>Area Riservata</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={onSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
          </div>
          <Button type="submit" className="w-full" disabled={loading}>{loading ? 'Accesso...' : 'Accedi'}</Button>
        </form>
      </CardContent>
    </Card>
  )
}

export function AdminPage(): JSX.Element {
  const session = useSession()
  const isAdmin = useIsAdmin(session)
  const { toast } = useToast()

  const [products, setProducts] = useState<ProductRow[]>([])
  const [options, setOptions] = useState<OptionRow[]>([])
  const [filter, setFilter] = useState('')
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    if (!isAdmin) return
    ;(async () => {
      const [{ data: p }, { data: o }] = await Promise.all([
        supabase.from('products').select('*').order('model_id').order('size'),
        supabase.from('product_options').select('*').order('label'),
      ])
      setProducts((p ?? []) as ProductRow[])
      setOptions((o ?? []) as OptionRow[])
    })()
  }, [isAdmin])

  function setProductPrice(id: string, price: number) {
    setProducts((prev) => prev.map((p) => (p.id === id ? { ...p, base_price: price } : p)))
  }
  function setOptionPrice(code: string, price: number) {
    setOptions((prev) => prev.map((o) => (o.code === code ? { ...o, price } : o)))
  }

  async function saveAll() {
    try {
      setSaving(true)
      const up1 = products.map((p) => supabase.from('products').update({ base_price: p.base_price }).eq('id', p.id))
      const up2 = options.map((o) => supabase.from('product_options').update({ price: o.price }).eq('code', o.code))
      await Promise.all([...up1, ...up2])
      toast({ title: 'Salvato', description: 'Prezzi aggiornati con successo.' })
    } catch (e) {
      toast({ title: 'Errore', description: (e as Error).message, variant: 'destructive' })
    } finally {
      setSaving(false)
    }
  }

  if (!session) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <SignInForm />
        <Toaster />
      </div>
    )
  }

  if (!isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background p-4">
        <Card className="max-w-md w-full">
          <CardHeader>
            <CardTitle>Accesso Negato</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm">Sei autenticato come <Badge variant="outline">{session.user.email}</Badge>, ma non hai i permessi admin.</p>
            <Button variant="secondary" onClick={() => supabase.auth.signOut()}>Esci</Button>
          </CardContent>
        </Card>
        <Toaster />
      </div>
    )
  }

  const filteredProducts = products.filter((p) => {
    const q = filter.toLowerCase()
    return (
      p.name.toLowerCase().includes(q) ||
      p.model_id.toLowerCase().includes(q) ||
      p.size.toLowerCase().includes(q)
    )
  })

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b sticky top-0 bg-background/70 backdrop-blur z-10">
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
          <div>
            <h1 className="text-xl font-semibold">Amministrazione Prezzi</h1>
            <p className="text-sm text-muted-foreground -mt-0.5">Gestisci in modo sicuro e veloce prezzi prodotti e opzioni.</p>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" onClick={() => supabase.auth.signOut()}>Esci</Button>
            <Button onClick={saveAll} disabled={saving}>{saving ? 'Salvataggio...' : 'Salva'}</Button>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-6 space-y-8">
        <section className="space-y-3">
          <div className="flex flex-col sm:flex-row gap-3 sm:items-center sm:justify-between">
            <div className="w-full sm:w-80">
              <Label htmlFor="filter">Cerca</Label>
              <Input id="filter" placeholder="Cerca per modello, nome o volume" value={filter} onChange={(e) => setFilter(e.target.value)} />
            </div>
            <div className="text-sm text-muted-foreground">Utente: <Badge variant="outline">{session.user.email}</Badge></div>
          </div>
          <Separator />
        </section>

        <section className="space-y-4">
          <h2 className="text-lg font-medium">Prodotti</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredProducts.map((p) => (
              <Card key={p.id} className="hover:shadow-sm transition-shadow">
                <CardHeader>
                  <CardTitle className="text-base">{p.name} {p.size}L <span className="text-muted-foreground">({p.model_id})</span></CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="space-y-2">
                    <Label>Prezzo base (€)</Label>
                    <Input type="number" step="0.01" value={p.base_price} onChange={(e) => setProductPrice(p.id, Number(e.target.value))} />
                  </div>
                  <div className="grid grid-cols-2 gap-3 text-xs text-muted-foreground">
                    <div>Lead time: {p.prod_days} gg</div>
                    <div>Per camion: {p.max_per_truck}</div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        <section className="space-y-4">
          <h2 className="text-lg font-medium">Opzioni</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {options.map((o) => (
              <Card key={o.code} className="hover:shadow-sm transition-shadow">
                <CardHeader>
                  <CardTitle className="text-base">{o.label}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="space-y-2">
                    <Label>Prezzo {o.is_percentage ? '(%)' : '(€)'}</Label>
                    <Input type="number" step="0.01" value={o.price} onChange={(e) => setOptionPrice(o.code, Number(e.target.value))} />
                  </div>
                  {o.available_for && (
                    <div className="text-xs text-muted-foreground">Disponibile per: {o.available_for.join(', ')}</div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </section>
      </main>
      <Toaster />
    </div>
  )
}


