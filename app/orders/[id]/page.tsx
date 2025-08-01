"use client"

import { useState, useEffect } from "react"
import { useParams } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ArrowLeft, Save, History } from "lucide-react"
import { mockOrders, mockCustomers } from "@/lib/mock-data"
import { formatCurrency, formatDate } from "@/lib/utils"
import { useToast } from "@/hooks/use-toast"
import Link from "next/link"

export default function OrderDetailsPage() {
  const params = useParams()
  const { toast } = useToast()
  const orderId = params.id as string

  const [order, setOrder] = useState(mockOrders.find((o) => o.id === orderId))
  const [customer, setCustomer] = useState(mockCustomers.find((c) => c.id === order?.customerId))
  const [isEditing, setIsEditing] = useState(false)
  const [editedOrder, setEditedOrder] = useState(order)

  useEffect(() => {
    if (order) {
      setEditedOrder(order)
    }
  }, [order])

  if (!order || !customer) {
    return (
      <div className="flex flex-col">
        <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
          <SidebarTrigger />
          <div className="flex flex-1 items-center gap-2">
            <Button variant="outline" size="sm" asChild>
              <Link href="/orders">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Voltar
              </Link>
            </Button>
            <h1 className="text-xl font-semibold">Ordem não encontrada</h1>
          </div>
        </header>
        <div className="flex-1 flex items-center justify-center">
          <p className="text-muted-foreground">A ordem solicitada não foi encontrada.</p>
        </div>
      </div>
    )
  }

  const handleSave = () => {
    // Here you would save the changes to your data store
    setOrder(editedOrder)
    setIsEditing(false)
    toast({
      title: "Sucesso",
      description: "Ordem atualizada com sucesso!",
    })
  }

  const handleCancel = () => {
    setEditedOrder(order)
    setIsEditing(false)
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

  const getPaymentStatusColor = (status: string) => {
    const colors = {
      Aguardando: "bg-yellow-100 text-yellow-800",
      "Pago Parcial": "bg-orange-100 text-orange-800",
      "Pago Total": "bg-green-100 text-green-800",
    }
    return colors[status as keyof typeof colors] || "bg-gray-100 text-gray-800"
  }

  return (
    <div className="flex flex-col">
      <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
        <SidebarTrigger />
        <div className="flex flex-1 items-center justify-between">
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" asChild>
              <Link href="/orders">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Voltar
              </Link>
            </Button>
            <h1 className="text-xl font-semibold">{order.id}</h1>
            <Badge variant="outline">{order.type}</Badge>
            <Badge className={getPriorityColor(order.priority)}>{order.priority}</Badge>
          </div>

          <div className="flex items-center gap-2">
            {isEditing ? (
              <>
                <Button variant="outline" onClick={handleCancel}>
                  Cancelar
                </Button>
                <Button onClick={handleSave}>
                  <Save className="h-4 w-4 mr-2" />
                  Salvar
                </Button>
              </>
            ) : (
              <Button onClick={() => setIsEditing(true)}>Editar</Button>
            )}
          </div>
        </div>
      </header>

      <div className="flex-1 space-y-6 p-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Information */}
          <div className="lg:col-span-2 space-y-6">
            {/* Customer Information */}
            <Card>
              <CardHeader>
                <CardTitle>Informações do Cliente</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Nome</Label>
                    <p className="font-medium">{customer.name}</p>
                  </div>
                  <div>
                    <Label>Telefone</Label>
                    <p className="font-medium">{customer.phone}</p>
                  </div>
                </div>
                <div>
                  <Label>Email</Label>
                  <p className="font-medium">{customer.email}</p>
                </div>
              </CardContent>
            </Card>

            {/* Order Details */}
            <Card>
              <CardHeader>
                <CardTitle>Detalhes da Ordem</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Data de Abertura</Label>
                    <p className="font-medium">{formatDate(order.openDate)}</p>
                  </div>
                  {order.expectedCompletionDate && (
                    <div>
                      <Label>Previsão de Conclusão</Label>
                      <p className="font-medium">{formatDate(order.expectedCompletionDate)}</p>
                    </div>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Prioridade</Label>
                    {isEditing ? (
                      <Select
                        value={editedOrder?.priority}
                        onValueChange={(value) => setEditedOrder({ ...editedOrder!, priority: value as any })}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Baixa">Baixa</SelectItem>
                          <SelectItem value="Média">Média</SelectItem>
                          <SelectItem value="Alta">Alta</SelectItem>
                          <SelectItem value="Urgente">Urgente</SelectItem>
                        </SelectContent>
                      </Select>
                    ) : (
                      <Badge className={getPriorityColor(order.priority)}>{order.priority}</Badge>
                    )}
                  </div>
                  <div>
                    <Label>Status do Pagamento</Label>
                    {isEditing ? (
                      <Select
                        value={editedOrder?.paymentStatus}
                        onValueChange={(value) => setEditedOrder({ ...editedOrder!, paymentStatus: value as any })}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Aguardando">Aguardando</SelectItem>
                          <SelectItem value="Pago Parcial">Pago Parcial</SelectItem>
                          <SelectItem value="Pago Total">Pago Total</SelectItem>
                        </SelectContent>
                      </Select>
                    ) : (
                      <Badge className={getPaymentStatusColor(order.paymentStatus)}>{order.paymentStatus}</Badge>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Valor Orçado</Label>
                    {isEditing ? (
                      <Input
                        type="number"
                        step="0.01"
                        value={editedOrder?.estimatedValue}
                        onChange={(e) =>
                          setEditedOrder({ ...editedOrder!, estimatedValue: Number.parseFloat(e.target.value) })
                        }
                      />
                    ) : (
                      <p className="font-medium">{formatCurrency(order.estimatedValue)}</p>
                    )}
                  </div>
                  <div>
                    <Label>Valor Final</Label>
                    {isEditing ? (
                      <Input
                        type="number"
                        step="0.01"
                        value={editedOrder?.finalValue || ""}
                        onChange={(e) =>
                          setEditedOrder({
                            ...editedOrder!,
                            finalValue: Number.parseFloat(e.target.value) || undefined,
                          })
                        }
                      />
                    ) : (
                      <p className="font-medium">
                        {order.finalValue ? formatCurrency(order.finalValue) : "Não definido"}
                      </p>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Type-specific Information */}
            {order.type === "Manutenção" ? (
              <Card>
                <CardHeader>
                  <CardTitle>Informações da Manutenção</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label>Modelo do Aparelho</Label>
                      <p className="font-medium">{order.deviceModel}</p>
                    </div>
                    <div>
                      <Label>IMEI</Label>
                      <p className="font-medium">{order.imei}</p>
                    </div>
                  </div>

                  <div>
                    <Label>Status da Manutenção</Label>
                    {isEditing ? (
                      <Select
                        value={editedOrder?.maintenanceStatus}
                        onValueChange={(value) => setEditedOrder({ ...editedOrder!, maintenanceStatus: value as any })}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Aguardando Avaliação">Aguardando Avaliação</SelectItem>
                          <SelectItem value="Aguardando Aprovação do Cliente">
                            Aguardando Aprovação do Cliente
                          </SelectItem>
                          <SelectItem value="Aguardando Peças">Aguardando Peças</SelectItem>
                          <SelectItem value="Em Reparo">Em Reparo</SelectItem>
                          <SelectItem value="Reparo Concluído">Reparo Concluído</SelectItem>
                          <SelectItem value="Entregue ao Cliente">Entregue ao Cliente</SelectItem>
                          <SelectItem value="Não Aprovado/Cancelado">Não Aprovado/Cancelado</SelectItem>
                        </SelectContent>
                      </Select>
                    ) : (
                      <Badge variant="secondary">{order.maintenanceStatus}</Badge>
                    )}
                  </div>

                  <div>
                    <Label>Descrição do Problema</Label>
                    {isEditing ? (
                      <Textarea
                        value={editedOrder?.problemDescription || ""}
                        onChange={(e) => setEditedOrder({ ...editedOrder!, problemDescription: e.target.value })}
                      />
                    ) : (
                      <p className="font-medium">{order.problemDescription}</p>
                    )}
                  </div>

                  <div>
                    <Label>Diagnóstico Técnico</Label>
                    {isEditing ? (
                      <Textarea
                        value={editedOrder?.technicalDiagnosis || ""}
                        onChange={(e) => setEditedOrder({ ...editedOrder!, technicalDiagnosis: e.target.value })}
                      />
                    ) : (
                      <p className="font-medium">{order.technicalDiagnosis || "Não informado"}</p>
                    )}
                  </div>

                  <div>
                    <Label>Peças Necessárias</Label>
                    {isEditing ? (
                      <Textarea
                        value={editedOrder?.requiredParts || ""}
                        onChange={(e) => setEditedOrder({ ...editedOrder!, requiredParts: e.target.value })}
                      />
                    ) : (
                      <p className="font-medium">{order.requiredParts || "Não informado"}</p>
                    )}
                  </div>
                </CardContent>
              </Card>
            ) : (
              <Card>
                <CardHeader>
                  <CardTitle>Informações da Venda</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label>Produto Vendido</Label>
                    {isEditing ? (
                      <Input
                        value={editedOrder?.productSold || ""}
                        onChange={(e) => setEditedOrder({ ...editedOrder!, productSold: e.target.value })}
                      />
                    ) : (
                      <p className="font-medium">{order.productSold}</p>
                    )}
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label>Condição do Produto</Label>
                      {isEditing ? (
                        <Select
                          value={editedOrder?.productCondition}
                          onValueChange={(value) => setEditedOrder({ ...editedOrder!, productCondition: value as any })}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Novo">Novo</SelectItem>
                            <SelectItem value="Seminovo">Seminovo</SelectItem>
                            <SelectItem value="Usado">Usado</SelectItem>
                          </SelectContent>
                        </Select>
                      ) : (
                        <Badge variant="outline">{order.productCondition}</Badge>
                      )}
                    </div>
                    <div>
                      <Label>Status da Venda</Label>
                      {isEditing ? (
                        <Select
                          value={editedOrder?.saleStatus}
                          onValueChange={(value) => setEditedOrder({ ...editedOrder!, saleStatus: value as any })}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Reservado">Reservado</SelectItem>
                            <SelectItem value="Aguardando Pagamento">Aguardando Pagamento</SelectItem>
                            <SelectItem value="Pagamento Confirmado">Pagamento Confirmado</SelectItem>
                            <SelectItem value="Pronto para Retirada/Envio">Pronto para Retirada/Envio</SelectItem>
                            <SelectItem value="Concluído">Concluído</SelectItem>
                          </SelectContent>
                        </Select>
                      ) : (
                        <Badge variant="secondary">{order.saleStatus}</Badge>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Internal Notes */}
            <Card>
              <CardHeader>
                <CardTitle>Notas Internas</CardTitle>
              </CardHeader>
              <CardContent>
                {isEditing ? (
                  <Textarea
                    placeholder="Adicione notas internas sobre esta ordem..."
                    value={editedOrder?.internalNotes || ""}
                    onChange={(e) => setEditedOrder({ ...editedOrder!, internalNotes: e.target.value })}
                    rows={4}
                  />
                ) : (
                  <p className="text-sm">{order.internalNotes || "Nenhuma nota interna adicionada."}</p>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Change History */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <History className="h-4 w-4" />
                  Histórico de Alterações
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 text-sm">
                  <div className="border-l-2 border-blue-200 pl-3">
                    <p className="font-medium">Ordem criada</p>
                    <p className="text-muted-foreground">{formatDate(order.openDate)} 09:00</p>
                  </div>
                  {order.maintenanceStatus === "Reparo Concluído" && (
                    <div className="border-l-2 border-green-200 pl-3">
                      <p className="font-medium">Status alterado para "Reparo Concluído"</p>
                      <p className="text-muted-foreground">{formatDate(order.openDate)} 16:30</p>
                    </div>
                  )}
                  {order.paymentStatus === "Pago Total" && (
                    <div className="border-l-2 border-green-200 pl-3">
                      <p className="font-medium">Pagamento confirmado</p>
                      <p className="text-muted-foreground">{formatDate(order.openDate)} 17:00</p>
                    </div>
                  )}
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
                  Enviar WhatsApp para Cliente
                </Button>
                <Button variant="outline" className="w-full justify-start bg-transparent">
                  Gerar Orçamento PDF
                </Button>
                <Button variant="outline" className="w-full justify-start bg-transparent">
                  Imprimir Etiqueta
                </Button>
                <Button variant="outline" className="w-full justify-start bg-transparent">
                  Duplicar Ordem
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
