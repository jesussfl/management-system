// components/StatisticCard.tsx

import React from 'react'
import {
  Card,
  CardHeader,
  CardContent,
  CardTitle,
} from '@/modules/common/components/card/card'

interface StatisticCardProps {
  number: number
  title: string
  Icon: React.ReactNode
}

const StatisticCard: React.FC<StatisticCardProps> = ({
  number,
  title,
  Icon,
}) => {
  return (
    <Card>
      <CardHeader className="flex flex-row h-full items-center justify-between space-y-0">
        <div>
          <CardTitle className="text-sm font-medium">{title}</CardTitle>
          <div className="text-2xl font-bold">{number}</div>
        </div>
        <div className="flex justify-center items-center ml-8 w-10 h-10 rounded-full bg-slate-100">
          {Icon}
        </div>
      </CardHeader>
    </Card>
  )
}

export default StatisticCard
