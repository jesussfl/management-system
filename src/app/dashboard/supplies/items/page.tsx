import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { columns } from './columns'
import { Payment } from '@/utils/types/types'
import { DataTable } from '@/components/ui/data-table'

async function getData(): Promise<Payment[]> {
  return [
    {
      id: '1',
      amount: 100,
      status: 'pending',
      email: 'w9HrQ@example.com',
    },
  ]
}
export default async function Page() {
  const data = await getData()
  return <DataTable columns={columns} data={data} />
}
