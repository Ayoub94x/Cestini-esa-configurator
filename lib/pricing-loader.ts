import { supabase } from '@/lib/supabase'
import { bins, options, type Bin, type Option, type BinSize } from '@/lib/data'

function mapProductRowToBin(row: any): Bin {
  return {
    size: row.size as BinSize,
    modelId: row.model_id,
    name: row.name,
    basePrice: Number(row.base_price),
    prodDays: Number(row.prod_days),
    baseImage: row.base_image,
    maxPerTruck: Number(row.max_per_truck),
  }
}

function mapOptionRowToOption(row: any): Option {
  return {
    code: row.code,
    label: row.label,
    price: Number(row.price),
    percentage: Boolean(row.is_percentage),
    availableFor: row.available_for ?? undefined,
  }
}

export async function loadPricingData(): Promise<void> {
  const [{ data: products }, { data: dbOptions }] = await Promise.all([
    supabase.from('products').select('*').eq('is_active', true),
    supabase.from('product_options').select('*'),
  ])

  if (products && Array.isArray(products)) {
    const newBins = products.map(mapProductRowToBin)
    bins.length = 0
    bins.push(...newBins)
  }

  if (dbOptions && Array.isArray(dbOptions)) {
    const existingByCode = new Map(options.map(o => [o.code, o]))
    const newOptions = dbOptions.map((row) => {
      const mapped = mapOptionRowToOption(row)
      const prev = existingByCode.get(mapped.code)
      return prev ? { ...mapped, icon: prev.icon } : mapped
    })
    options.length = 0
    options.push(...newOptions)
  }

  // Realtime updates for products
  supabase
    .channel('prices-products')
    .on('postgres_changes', { event: '*', schema: 'public', table: 'products' }, async () => {
      const { data } = await supabase.from('products').select('*').eq('is_active', true)
      if (data) {
        bins.length = 0
        bins.push(...data.map(mapProductRowToBin))
      }
    })
    .subscribe()

  // Realtime updates for options
  supabase
    .channel('prices-options')
    .on('postgres_changes', { event: '*', schema: 'public', table: 'product_options' }, async () => {
      const { data } = await supabase.from('product_options').select('*')
      if (data) {
        options.length = 0
        options.push(...data.map(mapOptionRowToOption))
      }
    })
    .subscribe()
}


