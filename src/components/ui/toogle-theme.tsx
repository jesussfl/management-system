'use client'
import React from 'react'
import { useTheme } from 'next-themes'
import { Sun, Moon, LogOut } from 'lucide-react'
import { Switch } from '@/modules/common/components/switch/switch'

const ToogleTheme = () => {
  const { setTheme, theme } = useTheme()
  const defaultForeColor = theme === 'dark' ? 'white' : 'gray'

  return (
    <div className="flex flex-row gap-3">
      {theme === 'dark' ? (
        <Moon size={20} color={defaultForeColor} />
      ) : (
        <Sun size={20} color={defaultForeColor} />
      )}
      <Switch
        onCheckedChange={(checked) => setTheme(checked ? 'dark' : 'light')}
      />
    </div>
  )
}

export default ToogleTheme
