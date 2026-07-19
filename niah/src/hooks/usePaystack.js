import { useCallback } from 'react'

const API_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:8080'
const PAYSTACK_PUBLIC_KEY = import.meta.env.VITE_PAYSTACK_PUBLIC_KEY ?? ''

export function usePaystack() {
  const openPaystack = useCallback(({ email, amountInKobo, metadata = {}, onSuccess, onClose }) => {
    if (!PAYSTACK_PUBLIC_KEY) {
      onSuccess?.({ verified: false, error: 'Payment configuration error. Please contact us.' })
      return Promise.resolve()
    }
    if (!window.PaystackPop) {
      onSuccess?.({ verified: false, error: 'Payment provider unavailable. Please refresh and try again.' })
      return Promise.resolve()
    }
    return new Promise((resolve) => {
      const handler = window.PaystackPop.setup({
        key: PAYSTACK_PUBLIC_KEY,
        email,
        amount: amountInKobo,
        currency: 'NGN',
        metadata,
        // NOTE: must be a plain function — Paystack's inline.js rejects async functions
        // with "Attribute callback must be a valid function"
        callback: function (response) {
          verifyPayment(response, onSuccess).finally(resolve)
        },
        onClose: () => { onClose?.(); resolve() },
      })
      handler.openIframe()
    })
  }, [])
  return openPaystack
}

async function verifyPayment(response, onSuccess) {
  try {
    const res = await fetch(`${API_URL}/api/payments/verify`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ reference: response.reference }),
    })
    const data = await res.json()
    if (!res.ok) {
      onSuccess?.({ verified: false, reference: response.reference, error: data.error })
    } else {
      onSuccess?.({ verified: true, payment: data })
    }
  } catch {
    onSuccess?.({ verified: false, reference: response.reference, error: 'Network error during verification.' })
  }
}