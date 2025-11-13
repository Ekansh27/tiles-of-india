import React from 'react'
import { cn } from '@/lib/utils'

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'default' | 'secondary' | 'success' | 'outline'
  children: React.ReactNode
}

export function Button({ 
  children, 
  variant = 'default', 
  className = '', 
  disabled, 
  ...props 
}: ButtonProps) {
  const variants = {
    default: 'bg-indigo-600 hover:bg-indigo-700 text-white',
    secondary: 'bg-gray-200 hover:bg-gray-300 text-gray-900',
    success: 'bg-green-600 hover:bg-green-700 text-white',
    outline: 'border-2 border-indigo-600 text-indigo-600 hover:bg-indigo-50'
  }
  
  return (
    <button
      disabled={disabled}
      className={cn(
        'px-6 py-3 rounded-lg font-semibold transition-all duration-200',
        'disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-105',
        'active:scale-95 flex items-center justify-center gap-2',
        variants[variant],
        className
      )}
      {...props}
    >
      {children}
    </button>
  )
}