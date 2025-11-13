import React, { ReactNode } from 'react'

interface AlertProps {
  children: ReactNode
  variant?: 'success' | 'error' | 'warning' | 'info' | 'default'
}

export function Alert({ children, variant = 'default' }: AlertProps) {
  const variants = {
    success: 'alert-success',
    error: 'alert-error',
    warning: 'alert-warning',
    info: 'alert-info',
    default: 'alert-default'
  }

  return (
    <div className={`alert ${variants[variant]}`}>
      {children}
    </div>
  )
}
