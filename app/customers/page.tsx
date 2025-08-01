"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Plus, Search, Phone, Mail } from "lucide-react"
import { mockCustomers, mockOrders } from "@/lib/mock-data"
import Link from "next/link"

export default function CustomersPage() {
  const [customers] = useState(mockCustomers)
  const [orders] = useState(mockOrders)
  const [searchTerm, setSearchTerm] = useState("")

  // Filter customers based on search term
  const filteredCustomers = customers.filter(
    (customer) =>
      customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      customer.phone.includes(searchTerm) ||
      customer.email.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  // Get order count for each customer
  const getCustomerOrderCount = (customerId: string) => {
    return orders.filter((order) => order.customerId === customerId).length
  }

  return (
    <div className="flex flex-col">
      <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
        <SidebarTrigger />
        <div className="flex flex-1 items-center justify-between">
          <h1 className="text-xl font-semibold">Clientes</h1>
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Novo Cliente
          </Button>
        </div>
      </header>

      <div className="flex-1 space-y-6 p-6">
        {/* Search */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Search className="h-4 w-4" />
              Buscar Clientes
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <Search className="h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar por nome, telefone ou email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="max-w-md"
              />
            </div>
          </CardContent>
        </Card>

        {/* Customers Table */}
        <Card>
          <CardHeader>
            <CardTitle>Lista de Clientes ({filteredCustomers.length})</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nome</TableHead>
                  <TableHead>Contato</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Total de Ordens</TableHead>
                  <TableHead>Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredCustomers.map((customer) => {
                  const orderCount = getCustomerOrderCount(customer.id)

                  return (
                    <TableRow key={customer.id}>
                      <TableCell>
                        <Link href={`/customers/${customer.id}`} className="font-medium hover:underline">
                          {customer.name}
                        </Link>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Phone className="h-4 w-4 text-muted-foreground" />
                          <span>{customer.phone}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Mail className="h-4 w-4 text-muted-foreground" />
                          <span>{customer.email}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="secondary">{orderCount} ordens</Badge>
                      </TableCell>
                      <TableCell>
                        <Button variant="outline" size="sm" asChild>
                          <Link href={`/customers/${customer.id}`}>Ver Detalhes</Link>
                        </Button>
                      </TableCell>
                    </TableRow>
                  )
                })}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
