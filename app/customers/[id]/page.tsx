"use client"

import { useState } from "react"
import { useParams } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { ArrowLeft, Phone, Mail, User } from "lucide-react"
import { mockCustomers, mockOrders } from "@/lib/mock-data"
import { formatCurrency, formatDate } from "@/lib/utils"
import Link from "next/link"

export default function CustomerDetailsPage() {
  const params = useParams()
  const customerId = params.id as string

  const [customer] = useState(mockCustomers.find((c) => c.id === customerId))
  const [customerOrders] = useState(mockOrders.filter((order) => order.customerId === customerId))

  if (!customer) {
    return (
      <div className="flex flex-col">
        <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
          <SidebarTrigger />
          <div className="flex flex-1 items-center gap-2">
            <Button variant="outline" size="sm" asChild>
              <Link href="/customers">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Voltar
              </Link>
            </Button>
            <h1 className="text-xl font-semibold">Cliente não encontrado</h1>
          </div>
        </header>
        <div className="flex-1 flex items-center justify-center">
          <p className="text-muted-foreground">O cliente solicitado não foi encontrado.</p>
        </div>
      </div>
    )
  }

  const totalSpent = customerOrders
    .filter((order) => order.finalValue)
    .reduce((sum, order) => sum + (order.finalValue || 0), 0)

  const maintenanceOrders = customerOrders.filter((order) => order.type === "Manutenção").length
  const saleOrders = customerOrders.filter((order) => order.type === "Venda").length

  return (
    <div className="flex flex-col">
      <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
        <SidebarTrigger />
        <div className="flex flex-1 items-center justify-between">
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" asChild>
              <Link href="/customers">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Voltar
              </Link>
            </Button>
            <h1 className="text-xl font-semibold">{customer.name}</h1>
          </div>
          <Button>Editar Cliente</Button>
        </div>
      </header>

      <div className="flex-1 space-y-6 p-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Customer Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-4 w-4" />
                Informações do Cliente
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="text-sm text-muted-foreground">Nome Completo</p>
                <p className="font-medium">{customer.name}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Telefone / WhatsApp</p>
                <div className="flex items-center gap-2">
                  <Phone className="h-4 w-4 text-muted-foreground" />
                  <p className="font-medium">{customer.phone}</p>
                </div>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Email</p>
                <div className="flex items-center gap-2">
                  <Mail className="h-4 w-4 text-muted-foreground" />
                  <p className="font-medium">{customer.email}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Statistics */}
          <Card>
            <CardHeader>
              <CardTitle>Estatísticas</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="text-sm text-muted-foreground">Total de Ordens</p>
                <p className="text-2xl font-bold">{customerOrders.length}</p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Manutenções</p>
                  <p className="text-lg font-semibold">{maintenanceOrders}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Vendas</p>
                  <p className="text-lg font-semibold">{saleOrders}</p>
                </div>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total Gasto</p>
                <p className="text-xl font-bold text-green-600">{formatCurrency(totalSpent)}</p>
              </div>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Ações Rápidas</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button variant="outline" className="w-full justify-start bg-transparent">
                <Phone className="h-4 w-4 mr-2" />
                Ligar para Cliente
              </Button>
              <Button variant="outline" className="w-full justify-start bg-transparent">
                <Mail className="h-4 w-4 mr-2" />
                Enviar Email
              </Button>
              <Button className="w-full justify-start">Nova Ordem de Serviço</Button>
            </CardContent>
          </Card>
        </div>

        {/* Order History */}
        <Card>
          <CardHeader>
            <CardTitle>Histórico de Ordens</CardTitle>
          </CardHeader>
          <CardContent>
            {customerOrders.length > 0 ? (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>ID da Ordem</TableHead>
                    <TableHead>Tipo</TableHead>
                    <TableHead>Produto/Modelo</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Data</TableHead>
                    <TableHead>Valor</TableHead>
                    <TableHead>Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {customerOrders.map((order) => {
                    const status = order.type === "Manutenção" ? order.maintenanceStatus : order.saleStatus
                    const product = order.type === "Manutenção" ? order.deviceModel : order.productSold

                    return (
                      <TableRow key={order.id}>
                        <TableCell>
                          <Link href={`/orders/${order.id}`} className="font-medium hover:underline">
                            {order.id}
                          </Link>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline">{order.type}</Badge>
                        </TableCell>
                        <TableCell>{product}</TableCell>
                        <TableCell>
                          <Badge variant="secondary">{status}</Badge>
                        </TableCell>
                        <TableCell>{formatDate(order.openDate)}</TableCell>
                        <TableCell>{formatCurrency(order.finalValue || order.estimatedValue)}</TableCell>
                        <TableCell>
                          <Button variant="outline" size="sm" asChild>
                            <Link href={`/orders/${order.id}`}>Ver Detalhes</Link>
                          </Button>
                        </TableCell>
                      </TableRow>
                    )
                  })}
                </TableBody>
              </Table>
            ) : (
              <div className="text-center py-8">
                <p className="text-muted-foreground">Este cliente ainda não possui ordens de serviço.</p>
                <Button className="mt-4">Criar Primeira Ordem</Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
