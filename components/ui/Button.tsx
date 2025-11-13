import React from 'react'

type Variant = 'primary' | 'ghost' | 'outline'

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: Variant
}

export default function Button({ children, className = '', variant = 'primary', ...rest }: ButtonProps) {
  const base = 'px-4 py-2 rounded font-medium '
  const classes =
    variant === 'primary'
      ? base + 'bg-sky-600 text-white hover:bg-sky-700'
      : variant === 'outline'
      ? base + 'border border-slate-200 text-slate-700 bg-white'
      : base + 'bg-transparent text-slate-700'
  return React.createElement(
    'button',
    {
      className: `${classes} ${className}`.trim(),
      ...rest
    },
    children
  )
}
