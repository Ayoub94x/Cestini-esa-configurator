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
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Textarea } from '@/components/ui/textarea'
import { Switch } from '@/components/ui/switch'

type ProductRow = {
  id: string
  model_id: string
  size: string
  name: string
  base_price: number
  prod_days: number
  base_image: string
  max_per_truck: number
  is_active?: boolean
  description?: string | null
  sku?: string | null
  metadata?: Record<string, unknown> | null
}

type OptionRow = {
  code: string
  label: string
  price: number
  is_percentage: boolean
  available_for: string[] | null
  is_active?: boolean
  metadata?: Record<string, unknown> | null
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
  const [loading, setLoading] = useState(false)

  const [productDialogOpen, setProductDialogOpen] = useState(false)
  const [optionDialogOpen, setOptionDialogOpen] = useState(false)

  const [editingProduct, setEditingProduct] = useState<Partial<ProductRow> | null>(null)
  const [editingOption, setEditingOption] = useState<Partial<OptionRow> | null>(null)

  async function loadAll(): Promise<void> {
    try {
      setLoading(true)
      const [{ data: p, error: pe }, { data: o, error: oe }] = await Promise.all([
        supabase.from('products').select('*').order('model_id').order('size'),
        supabase.from('product_options').select('*').order('label'),
      ])
      if (pe) throw pe
      if (oe) throw oe
      setProducts((p ?? []) as ProductRow[])
      setOptions((o ?? []) as OptionRow[])
    } catch (e) {
      toast({ title: 'Errore caricamento', description: (e as Error).message, variant: 'destructive' })
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (!isAdmin) return
    void loadAll()
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
      toast({ title: 'Salvato', description: 'Modifiche salvate con successo.' })
    } catch (e) {
      toast({ title: 'Errore', description: (e as Error).message, variant: 'destructive' })
    } finally {
      setSaving(false)
    }
  }

  function openNewProduct() {
    setEditingProduct({
      id: undefined,
      name: '',
      model_id: '',
      size: '',
      base_price: 0,
      prod_days: 0,
      base_image: '',
      max_per_truck: 0,
      is_active: true,
    })
    setProductDialogOpen(true)
  }

  function openEditProduct(p: ProductRow) {
    setEditingProduct({ ...p })
    setProductDialogOpen(true)
  }

  function openNewOption() {
    setEditingOption({
      code: '',
      label: '',
      price: 0,
      is_percentage: false,
      available_for: null,
      is_active: true,
    })
    setOptionDialogOpen(true)
  }

  function openEditOption(o: OptionRow) {
    setEditingOption({ ...o })
    setOptionDialogOpen(true)
  }

  async function upsertProduct(values: Partial<ProductRow>) {
    try {
      const payload: Record<string, unknown> = {
        name: values.name,
        model_id: values.model_id,
        size: values.size,
        base_price: values.base_price,
        prod_days: values.prod_days,
        base_image: values.base_image,
        max_per_truck: values.max_per_truck,
      }
      if (typeof values.is_active === 'boolean') payload.is_active = values.is_active

      if (values.metadata) {
        try {
          const { error } = values.id
            ? await supabase.from('products').update({ ...payload, metadata: values.metadata }).eq('id', values.id)
            : await supabase.from('products').insert({ ...payload, metadata: values.metadata })
          if (error) throw error
        } catch {
          const { error } = values.id
            ? await supabase.from('products').update(payload).eq('id', values.id)
            : await supabase.from('products').insert(payload)
          if (error) throw error
        }
      } else {
        const { error } = values.id
          ? await supabase.from('products').update(payload).eq('id', values.id)
          : await supabase.from('products').insert(payload)
        if (error) throw error
      }

      toast({ title: 'Prodotto salvato' })
      setProductDialogOpen(false)
      setEditingProduct(null)
      await loadAll()
    } catch (e) {
      toast({ title: 'Errore salvataggio prodotto', description: (e as Error).message, variant: 'destructive' })
    }
  }

  async function removeProduct(p: ProductRow) {
    if (!confirm(`Eliminare definitivamente "${p.name} ${p.size}L"?`)) return
    const { error } = await supabase.from('products').delete().eq('id', p.id)
    if (error) {
      toast({ title: 'Errore eliminazione', description: error.message, variant: 'destructive' })
      return
    }
    toast({ title: 'Prodotto eliminato' })
    await loadAll()
  }

  async function toggleProductActive(p: ProductRow, active: boolean) {
    const { error } = await supabase.from('products').update({ is_active: active }).eq('id', p.id)
    if (error) {
      toast({ title: 'Errore aggiornamento', description: error.message, variant: 'destructive' })
      return
    }
    setProducts((prev) => prev.map((it) => (it.id === p.id ? { ...it, is_active: active } : it)))
  }

  async function upsertOption(values: Partial<OptionRow>) {
    try {
      const payload: Record<string, unknown> = {
        code: values.code,
        label: values.label,
        price: values.price,
        is_percentage: values.is_percentage,
        available_for: values.available_for,
      }
      if (typeof values.is_active === 'boolean') payload.is_active = values.is_active

      if (values.metadata) {
        try {
          const { error } = await supabase
            .from('product_options')
            .upsert({ ...payload, metadata: values.metadata }, { onConflict: 'code' })
          if (error) throw error
        } catch {
          const { error } = await supabase.from('product_options').upsert(payload, { onConflict: 'code' })
          if (error) throw error
        }
      } else {
        const { error } = await supabase.from('product_options').upsert(payload, { onConflict: 'code' })
        if (error) throw error
      }

      toast({ title: 'Opzione salvata' })
      setOptionDialogOpen(false)
      setEditingOption(null)
      await loadAll()
    } catch (e) {
      toast({ title: 'Errore salvataggio opzione', description: (e as Error).message, variant: 'destructive' })
    }
  }

  async function removeOption(o: OptionRow) {
    if (!confirm(`Eliminare definitivamente l'opzione "${o.label}"?`)) return
    const { error } = await supabase.from('product_options').delete().eq('code', o.code)
    if (error) {
      toast({ title: 'Errore eliminazione', description: error.message, variant: 'destructive' })
      return
    }
    toast({ title: 'Opzione eliminata' })
    await loadAll()
  }

  async function toggleOptionActive(o: OptionRow, active: boolean) {
    const { error } = await supabase.from('product_options').update({ is_active: active }).eq('code', o.code)
    if (error) {
      toast({ title: 'Errore aggiornamento', description: error.message, variant: 'destructive' })
      return
    }
    setOptions((prev) => prev.map((it) => (it.code === o.code ? { ...it, is_active: active } : it)))
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
            <h1 className="text-xl font-semibold">Amministrazione Catalogo</h1>
            <p className="text-sm text-muted-foreground -mt-0.5">Gestisci prodotti e optional: creazione, modifica, attivazione e eliminazione.</p>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" onClick={() => supabase.auth.signOut()}>Esci</Button>
            <Button onClick={saveAll} disabled={saving}>{saving ? 'Salvataggio...' : 'Salva prezzi'}</Button>
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
            <div className="flex items-center gap-2">
              <Button size="sm" variant="secondary" onClick={openNewProduct}>Nuovo Prodotto</Button>
              <Button size="sm" variant="secondary" onClick={openNewOption}>Nuova Opzione</Button>
              <div className="text-sm text-muted-foreground">Utente: <Badge variant="outline">{session.user.email}</Badge></div>
            </div>
          </div>
          <Separator />
        </section>

        <section className="space-y-4">
          <h2 className="text-lg font-medium">Prodotti</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredProducts.map((p) => (
              <Card key={p.id} className="hover:shadow-sm transition-shadow">
                <CardHeader>
                  <CardTitle className="text-base flex items-center justify-between">
                    <span>{p.name} {p.size}L <span className="text-muted-foreground">({p.model_id})</span></span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label>Prezzo base (€)</Label>
                    <Input type="number" step="0.01" value={p.base_price} onChange={(e) => setProductPrice(p.id, Number(e.target.value))} />
                  </div>
                  <div className="grid grid-cols-2 gap-3 text-xs text-muted-foreground">
                    <div>Lead time: {p.prod_days} gg</div>
                    <div>Per camion: {p.max_per_truck}</div>
                  </div>
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <Switch checked={p.is_active ?? true} onCheckedChange={(v) => toggleProductActive(p, Boolean(v))} />
                      <span className="text-sm">{(p.is_active ?? true) ? 'Attivo' : 'Disattivato'}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button size="sm" variant="outline" onClick={() => openEditProduct(p)}>Modifica</Button>
                      <Button size="sm" variant="destructive" onClick={() => void removeProduct(p)}>Elimina</Button>
                    </div>
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
                  <CardTitle className="text-base flex items-center justify-between">
                    <span>{o.label}</span>
                    <Badge variant="outline" className="text-[11px]">{o.code}</Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label>Prezzo {o.is_percentage ? '(%)' : '(€)'}</Label>
                    <Input type="number" step="0.01" value={o.price} onChange={(e) => setOptionPrice(o.code, Number(e.target.value))} />
                  </div>
                  {o.available_for && (
                    <div className="text-xs text-muted-foreground">Disponibile per: {o.available_for.join(', ')}</div>
                  )}
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <Switch checked={o.is_active ?? true} onCheckedChange={(v) => toggleOptionActive(o, Boolean(v))} />
                      <span className="text-sm">{(o.is_active ?? true) ? 'Attiva' : 'Disattivata'}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button size="sm" variant="outline" onClick={() => openEditOption(o)}>Modifica</Button>
                      <Button size="sm" variant="destructive" onClick={() => void removeOption(o)}>Elimina</Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>
      </main>
      <Toaster />
      {/* Product dialog */}
      <Dialog open={productDialogOpen} onOpenChange={setProductDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>{editingProduct?.id ? 'Modifica prodotto' : 'Nuovo prodotto'}</DialogTitle>
          </DialogHeader>
          {editingProduct && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Nome</Label>
                <Input value={editingProduct.name ?? ''} onChange={(e) => setEditingProduct({ ...editingProduct, name: e.target.value })} />
              </div>
              <div className="space-y-2">
                <Label>Model ID</Label>
                <Input placeholder="es. branca, cesto, city" value={editingProduct.model_id ?? ''} onChange={(e) => setEditingProduct({ ...editingProduct, model_id: e.target.value })} />
              </div>
              <div className="space-y-2">
                <Label>Volume (size)</Label>
                <Input placeholder="es. 50/60, 80, 110" value={editingProduct.size ?? ''} onChange={(e) => setEditingProduct({ ...editingProduct, size: e.target.value })} />
              </div>
              <div className="space-y-2">
                <Label>Prezzo base (€)</Label>
                <Input type="number" step="0.01" value={Number(editingProduct.base_price ?? 0)} onChange={(e) => setEditingProduct({ ...editingProduct, base_price: Number(e.target.value) })} />
              </div>
              <div className="space-y-2">
                <Label>Lead time (giorni)</Label>
                <Input type="number" value={Number(editingProduct.prod_days ?? 0)} onChange={(e) => setEditingProduct({ ...editingProduct, prod_days: Number(e.target.value) })} />
              </div>
              <div className="space-y-2">
                <Label>Base image URL</Label>
                <Input value={editingProduct.base_image ?? ''} onChange={(e) => setEditingProduct({ ...editingProduct, base_image: e.target.value })} />
              </div>
              <div className="space-y-2">
                <Label>Max per camion</Label>
                <Input type="number" value={Number(editingProduct.max_per_truck ?? 0)} onChange={(e) => setEditingProduct({ ...editingProduct, max_per_truck: Number(e.target.value) })} />
              </div>
              <div className="space-y-2">
                <Label>SKU (facoltativo)</Label>
                <Input value={editingProduct.sku ?? ''} onChange={(e) => setEditingProduct({ ...editingProduct, sku: e.target.value })} />
              </div>
              <div className="sm:col-span-2 space-y-2">
                <Label>Descrizione (facoltativa)</Label>
                <Textarea value={editingProduct.description ?? ''} onChange={(e) => setEditingProduct({ ...editingProduct, description: e.target.value })} />
              </div>
              <div className="sm:col-span-2 space-y-2">
                <Label>Metadata aggiuntivi (JSON, facoltativo)</Label>
                <Textarea
                  placeholder='{"materials":["acciaio","plastica"],"colors":["RAL 7016"],"images":["https://..."]}'
                  value={editingProduct.metadata ? JSON.stringify(editingProduct.metadata, null, 2) : ''}
                  onChange={(e) => {
                    try {
                      const parsed = e.target.value ? JSON.parse(e.target.value) : null
                      setEditingProduct({ ...editingProduct, metadata: parsed ?? undefined })
                    } catch {
                      // ignore JSON invalido durante digitazione
                    }
                  }}
                />
                <p className="text-xs text-muted-foreground">Se il campo non è supportato a livello DB, verrà ignorato automaticamente.</p>
              </div>
              <div className="sm:col-span-2 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Switch checked={editingProduct.is_active ?? true} onCheckedChange={(v) => setEditingProduct({ ...editingProduct, is_active: Boolean(v) })} />
                  <span className="text-sm">Attivo</span>
                </div>
                <div className="space-x-2">
                  <Button variant="outline" onClick={() => { setProductDialogOpen(false); setEditingProduct(null) }}>Annulla</Button>
                  <Button onClick={() => void upsertProduct(editingProduct)}>Salva</Button>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Option dialog */}
      <Dialog open={optionDialogOpen} onOpenChange={setOptionDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>{editingOption?.code ? 'Modifica opzione' : 'Nuova opzione'}</DialogTitle>
          </DialogHeader>
          {editingOption && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Codice</Label>
                <Input disabled={Boolean(options.find(o => o.code === editingOption.code))} value={editingOption.code ?? ''} onChange={(e) => setEditingOption({ ...editingOption, code: e.target.value })} />
              </div>
              <div className="space-y-2">
                <Label>Etichetta</Label>
                <Input value={editingOption.label ?? ''} onChange={(e) => setEditingOption({ ...editingOption, label: e.target.value })} />
              </div>
              <div className="space-y-2">
                <Label>Prezzo</Label>
                <Input type="number" step="0.01" value={Number(editingOption.price ?? 0)} onChange={(e) => setEditingOption({ ...editingOption, price: Number(e.target.value) })} />
              </div>
              <div className="space-y-2">
                <Label>Tipo prezzo</Label>
                <div className="flex items-center gap-3 h-10">
                  <Button size="sm" variant={editingOption.is_percentage ? 'secondary' : 'outline'} onClick={() => setEditingOption({ ...editingOption, is_percentage: false })}>€</Button>
                  <Button size="sm" variant={editingOption.is_percentage ? 'outline' : 'secondary'} onClick={() => setEditingOption({ ...editingOption, is_percentage: true })}>%</Button>
                </div>
              </div>
              <div className="sm:col-span-2 space-y-2">
                <Label>Disponibile per volumi (lista separata da virgola)</Label>
                <Input
                  placeholder="50/60,80,110"
                  value={(editingOption.available_for ?? []).join(',')}
                  onChange={(e) => {
                    const list = e.target.value
                      .split(',')
                      .map((s) => s.trim())
                      .filter(Boolean)
                    setEditingOption({ ...editingOption, available_for: list.length ? list : null })
                  }}
                />
              </div>
              <div className="sm:col-span-2 space-y-2">
                <Label>Metadata aggiuntivi (JSON, facoltativo)</Label>
                <Textarea
                  placeholder='{"note":"Solo per 50/60L","color":"nero"}'
                  value={editingOption.metadata ? JSON.stringify(editingOption.metadata, null, 2) : ''}
                  onChange={(e) => {
                    try {
                      const parsed = e.target.value ? JSON.parse(e.target.value) : null
                      setEditingOption({ ...editingOption, metadata: parsed ?? undefined })
                    } catch {
                      // ignore JSON non valido durante digitazione
                    }
                  }}
                />
                <p className="text-xs text-muted-foreground">Se il campo non è supportato a livello DB, verrà ignorato automaticamente.</p>
              </div>
              <div className="sm:col-span-2 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Switch checked={editingOption.is_active ?? true} onCheckedChange={(v) => setEditingOption({ ...editingOption, is_active: Boolean(v) })} />
                  <span className="text-sm">Attiva</span>
                </div>
                <div className="space-x-2">
                  <Button variant="outline" onClick={() => { setOptionDialogOpen(false); setEditingOption(null) }}>Annulla</Button>
                  <Button onClick={() => void upsertOption(editingOption)}>Salva</Button>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

    </div>
  )
}


