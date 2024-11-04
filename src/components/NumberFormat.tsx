'use client'

interface NumberFormatProps {
  value: number
  minimumFractionDigits?: number
  maximumFractionDigits?: number
  currency?: boolean
}

export function NumberFormat({ 
  value, 
  minimumFractionDigits = 2, 
  maximumFractionDigits = 2,
  currency = true 
}: NumberFormatProps) {
  const formattedValue = value.toLocaleString('pt-BR', {
    minimumFractionDigits,
    maximumFractionDigits,
    style: currency ? 'currency' : 'decimal',
    currency: 'BRL'
  })

  return <span>{formattedValue}</span>
} 