"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Plus, Search, Filter, LayoutGrid, List } from "lucide-react"
import { mockOrders, mockCustomers } from "@/lib/mock-data"
import { formatCurrency, formatDate } from "@/lib/utils"
import { OrderKanban } from "@/components/order-kanban"
import { NewOrderDialog } from "@/components/new-order-dialog"
import Link from "next/link"

export default function OrdersPage() {
  const [orders] = useState(mockOrders)
  const [customers] = useState(mockCustomers)
  const [view, setView] = useState<"table" | "kanban">("table")
  const [showNewOrderDialog, setShowNewOrderDialog] = useState(false)

  // Filter states
  const [searchTerm, setSearchTerm] = useState("")
  const [typeFilter, setTypeFilter] = useState("all")
  const [statusFilter, setStatusFilter] = useState("all")
  const [priorityFilter, setPriorityFilter] = useState("all")
  const [paymentFilter, setPaymentFilter] = useState("all")

  // Filter orders based on current filters
  const filteredOrders = orders.filter((order) => {
    const customer = customers.find((c) => c.id === order.customerId)
    const searchMatch =
      !searchTerm ||
      order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      customer?.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      customer?.phone.includes(searchTerm) ||
      order.imei?.includes(searchTerm) ||
      order.productSold?.toLowerCase().includes(searchTerm.toLowerCase())

    const typeMatch = typeFilter === "all" || order.type === typeFilter

    const statusMatch =
      statusFilter === "all" ||
      (order.type === "Manutenção" && order.maintenanceStatus === statusFilter) ||
      (order.type === "Venda" && order.saleStatus === statusFilter)

    const priorityMatch = priorityFilter === "all" || order.priority === priorityFilter
    const paymentMatch = paymentFilter === "all" || order.paymentStatus === paymentFilter

    return searchMatch && typeMatch && statusMatch && priorityMatch && paymentMatch
  })

  const getStatusOptions = () => {
    if (typeFilter === "Manutenção") {
      return [
        "Aguardando Avaliação",
        "Aguardando Aprovação do Cliente",
        "Aguardando Peças",
        "Em Reparo",
        "Reparo Concluído",
        "Entregue ao Cliente",
        "Não Aprovado/Cancelado",
      ]
    } else if (typeFilter === "Venda") {
      return ["Reservado", "Aguardando Pagamento", "Pagamento Confirmado", "Pronto para Retirada/Envio", "Concluído"]
    }
    return []
  }

  return (
    <div className="flex flex-col">
      <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
        <SidebarTrigger />
        <div className="flex flex-1 items-center justify-between">
          <h1 className="text-xl font-semibold">Ordens de Serviço</h1>
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1 rounded-md border p-1">
              <Button variant={view === "table" ? "default" : "ghost"} size="sm" onClick={() => setView("table")}>
                <List className="h-4 w-4" />
              </Button>
              <Button variant={view === "kanban" ? "default" : "ghost"} size="sm" onClick={() => setView("kanban")}>
                <LayoutGrid className="h-4 w-4" />
              </Button>
            </div>
            <Button onClick={() => setShowNewOrderDialog(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Nova Ordem
            </Button>
          </div>
        </div>
      </header>

      <div className="flex-1 space-y-6 p-6">
        {/* Filters */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Filter className="h-4 w-4" />
              Filtros e Busca
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-2">
              <Search className="h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar por ID, cliente, telefone, IMEI, produto..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="max-w-md"
              />
            </div>

            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
              <Select value={typeFilter} onValueChange={setTypeFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Tipo de Ordem" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos os Tipos</SelectItem>
                  <SelectItem value="Manutenção">Manutenção</SelectItem>
                  <SelectItem value="Venda">Venda</SelectItem>
                </SelectContent>
              </Select>

              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos os Status</SelectItem>
                  {getStatusOptions().map((status) => (
                    <SelectItem key={status} value={status}>
                      {status}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={priorityFilter} onValueChange={setPriorityFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Prioridade" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todas as Prioridades</SelectItem>
                  <SelectItem value="Baixa">Baixa</SelectItem>
                  <SelectItem value="Média">Média</SelectItem>
                  <SelectItem value="Alta">Alta</SelectItem>
                  <SelectItem value="Urgente">Urgente</SelectItem>
                </SelectContent>
              </Select>

              <Select value={paymentFilter} onValueChange={setPaymentFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Pagamento" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos os Pagamentos</SelectItem>
                  <SelectItem value="Aguardando">Aguardando</SelectItem>
                  <SelectItem value="Pago Parcial">Pago Parcial</SelectItem>
                  <SelectItem value="Pago Total">Pago Total</SelectItem>
                </SelectContent>
              </Select>

              <Button
                variant="outline"
                onClick={() => {
                  setSearchTerm("")
                  setTypeFilter("all")
                  setStatusFilter("all")
                  setPriorityFilter("all")
                  setPaymentFilter("all")
                }}
              >
                Limpar Filtros
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Content */}
        {view === "table" ? (
          <Card>
            <CardHeader>
              <CardTitle>Lista de Ordens ({filteredOrders.length})</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>ID</TableHead>
                    <TableHead>Cliente</TableHead>
                    <TableHead>Tipo</TableHead>
                    <TableHead>Produto/Modelo</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Prioridade</TableHead>
                    <TableHead>Data Abertura</TableHead>
                    <TableHead>Valor</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredOrders.map((order) => {
                    const customer = customers.find((c) => c.id === order.customerId)
                    const status = order.type === "Manutenção" ? order.maintenanceStatus : order.saleStatus
                    const product = order.type === "Manutenção" ? order.deviceModel : order.productSold

                    const priorityColor =
                      {
                        Baixa: "bg-gray-100 text-gray-800",
                        Média: "bg-blue-100 text-blue-800",
                        Alta: "bg-orange-100 text-orange-800",
                        Urgente: "bg-red-100 text-red-800",
                      }[order.priority] || "bg-gray-100 text-gray-800"

                    return (
                      <TableRow key={order.id} className="cursor-pointer hover:bg-muted/50">
                        <TableCell>
                          <Link href={`/orders/${order.id}`} className="font-medium hover:underline">
                            {order.id}
                          </Link>
                        </TableCell>
                        <TableCell>{customer?.name}</TableCell>
                        <TableCell>
                          <Badge variant="outline">{order.type}</Badge>
                        </TableCell>
                        <TableCell>{product}</TableCell>
                        <TableCell>
                          <Badge variant="secondary">{status}</Badge>
                        </TableCell>
                        <TableCell>
                          <Badge className={priorityColor}>{order.priority}</Badge>
                        </TableCell>
                        <TableCell>{formatDate(order.openDate)}</TableCell>
                        <TableCell>{formatCurrency(order.finalValue || order.estimatedValue)}</TableCell>
                      </TableRow>
                    )
                  })}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        ) : (
          <OrderKanban orders={filteredOrders.filter((order) => order.type === "Manutenção")} customers={customers} />
        )}
      </div>

      <NewOrderDialog open={showNewOrderDialog} onOpenChange={setShowNewOrderDialog} customers={customers} />
    </div>
  )
}
