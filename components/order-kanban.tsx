"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { formatCurrency } from "@/lib/utils"
import { AlertTriangle } from "lucide-react"

interface Order {
  id: string
  customerId: string
  type: string
  priority: string
  maintenanceStatus?: string
  deviceModel?: string
  estimatedValue: number
  finalValue?: number
}

interface Customer {
  id: string
  name: string
}

interface OrderKanbanProps {
  orders: Order[]
  customers: Customer[]
}

const maintenanceStatuses = [
  "Aguardando Avaliação",
  "Aguardando Aprovação do Cliente",
  "Aguardando Peças",
  "Em Reparo",
  "Reparo Concluído",
  "Entregue ao Cliente",
]

export function OrderKanban({ orders, customers }: OrderKanbanProps) {
  const [draggedOrder, setDraggedOrder] = useState<Order | null>(null)

  const getOrdersByStatus = (status: string) => {
    return orders.filter((order) => order.maintenanceStatus === status)
  }

  const handleDragStart = (e: React.DragEvent, order: Order) => {
    setDraggedOrder(order)
    e.dataTransfer.effectAllowed = "move"
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    e.dataTransfer.dropEffect = "move"
  }

  const handleDrop = (e: React.DragEvent, newStatus: string) => {
    e.preventDefault()
    if (draggedOrder && draggedOrder.maintenanceStatus !== newStatus) {
      // Here you would update the order status in your data store
      console.log(`Moving order ${draggedOrder.id} to ${newStatus}`)
      // For demo purposes, we're just logging. In a real app, you'd update the state/database
    }
    setDraggedOrder(null)
  }

  const getPriorityIcon = (priority: string) => {
    if (priority === "Urgente") {
      return <AlertTriangle className="h-4 w-4 text-red-500" />
    }
    return null
  }

  const getPriorityColor = (priority: string) => {
    const colors = {
      Baixa: "bg-gray-100 text-gray-800",
      Média: "bg-blue-100 text-blue-800",
      Alta: "bg-orange-100 text-orange-800",
      Urgente: "bg-red-100 text-red-800",
    }
    return colors[priority as keyof typeof colors] || "bg-gray-100 text-gray-800"
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
      {maintenanceStatuses.map((status) => {
        const statusOrders = getOrdersByStatus(status)

        return (
          <Card key={status} className="min-h-[500px]">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium">
                {status}
                <Badge variant="secondary" className="ml-2">
                  {statusOrders.length}
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3" onDragOver={handleDragOver} onDrop={(e) => handleDrop(e, status)}>
              {statusOrders.map((order) => {
                const customer = customers.find((c) => c.id === order.customerId)

                return (
                  <Card
                    key={order.id}
                    className="cursor-move hover:shadow-md transition-shadow"
                    draggable
                    onDragStart={(e) => handleDragStart(e, order)}
                  >
                    <CardContent className="p-3">
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="font-medium text-sm">{order.id}</span>
                          {getPriorityIcon(order.priority)}
                        </div>

                        <div>
                          <p className="text-sm font-medium">{customer?.name}</p>
                          <p className="text-xs text-muted-foreground">{order.deviceModel}</p>
                        </div>

                        <div className="flex items-center justify-between">
                          <Badge className={getPriorityColor(order.priority)} variant="secondary">
                            {order.priority}
                          </Badge>
                          <span className="text-sm font-medium">
                            {formatCurrency(order.finalValue || order.estimatedValue)}
                          </span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )
              })}

              {statusOrders.length === 0 && (
                <div className="text-center text-muted-foreground text-sm py-8">Nenhuma ordem neste status</div>
              )}
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}
