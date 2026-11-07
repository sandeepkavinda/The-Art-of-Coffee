import { createContext, useCallback, useContext, useMemo, useRef, useState } from 'react'
import { Check } from 'lucide-react'

const OrderCtx = createContext(null)

/** Lightweight front-end order bag (count + toast). No network. */
export function OrderProvider({ children }) {
  const [items, setItems] = useState([])
  const [toast, setToast] = useState(null)
  const timer = useRef()

  const add = useCallback((product) => {
    setItems((list) => [...list, product])
    setToast({ id: Date.now(), name: product.name })
    clearTimeout(timer.current)
    timer.current = setTimeout(() => setToast(null), 2600)
  }, [])

  const value = useMemo(
    () => ({
      items,
      count: items.length,
      total: items.reduce((sum, p) => sum + p.price, 0),
      add,
    }),
    [items, add],
  )

  return (
    <OrderCtx.Provider value={value}>
      {children}
      <div
        aria-live="polite"
        className="pointer-events-none fixed bottom-6 left-1/2 z-[70] -translate-x-1/2"
      >
        {toast && (
          <div
            key={toast.id}
            className="flex items-center gap-3 rounded-full bg-cream px-5 py-3 text-sm text-espresso shadow-2xl shadow-black/40 [animation:toast_2.6s_var(--ease-out-expo)_both]"
          >
            <span className="grid size-6 place-items-center rounded-full bg-caramel text-espresso">
              <Check size={14} strokeWidth={2.5} />
            </span>
            <span>
              <strong className="font-semibold">{toast.name}</strong> added to your order
            </span>
          </div>
        )}
      </div>
      <style>{`@keyframes toast{0%{opacity:0;transform:translateY(20px) scale(.96)}12%{opacity:1;transform:none}85%{opacity:1;transform:none}100%{opacity:0;transform:translateY(10px)}}`}</style>
    </OrderCtx.Provider>
  )
}

// eslint-disable-next-line react/only-export-components
export const useOrder = () => useContext(OrderCtx)
