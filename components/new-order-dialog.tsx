"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/hooks/use-toast"

interface Customer {
  id: string
  name: string
  phone: string
  email: string
}

interface NewOrderDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  customers: Customer[]
}

const iphoneModels = [
  "iPhone 8",
  "iPhone 8 Plus",
  "iPhone X",
  "iPhone XR",
  "iPhone XS",
  "iPhone XS Max",
  "iPhone 11",
  "iPhone 11 Pro",
  "iPhone 11 Pro Max",
  "iPhone 12 mini",
  "iPhone 12",
  "iPhone 12 Pro",
  "iPhone 12 Pro Max",
  "iPhone 13 mini",
  "iPhone 13",
  "iPhone 13 Pro",
  "iPhone 13 Pro Max",
  "iPhone 14",
  "iPhone 14 Plus",
  "iPhone 14 Pro",
  "iPhone 14 Pro Max",
  "iPhone 15",
  "iPhone 15 Plus",
  "iPhone 15 Pro",
  "iPhone 15 Pro Max",
]

export function NewOrderDialog({ open, onOpenChange, customers }: NewOrderDialogProps) {
  const { toast } = useToast()
  const [orderType, setOrderType] = useState<"Manutenção" | "Venda" | "">("")
  const [formData, setFormData] = useState({
    customerId: "",
    priority: "",
    estimatedValue: "",
    // Maintenance specific
    deviceModel: "",
    imei: "",
    problemDescription: "",
    // Sale specific
    productSold: "",
    productCondition: "",
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    // Basic validation
    if (!formData.customerId || !orderType || !formData.priority) {
      toast({
        title: "Erro",
        description: "Por favor, preencha todos os campos obrigatórios.",
        variant: "destructive",
      })
      return
    }

    // Here you would create the new order
    console.log("Creating new order:", { orderType, ...formData })

    toast({
      title: "Sucesso",
      description: "Nova ordem criada com sucesso!",
    })

    // Reset form and close dialog
    setFormData({
      customerId: "",
      priority: "",
      estimatedValue: "",
      deviceModel: "",
      imei: "",
      problemDescription: "",
      productSold: "",
      productCondition: "",
    })
    setOrderType("")
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Nova Ordem de Serviço</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="customer">Cliente *</Label>
              <Select
                value={formData.customerId}
                onValueChange={(value) => setFormData({ ...formData, customerId: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o cliente" />
                </SelectTrigger>
                <SelectContent>
                  {customers.map((customer) => (
                    <SelectItem key={customer.id} value={customer.id}>
                      {customer.name} - {customer.phone}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="type">Tipo de Ordem *</Label>
              <Select value={orderType} onValueChange={(value: "Manutenção" | "Venda") => setOrderType(value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o tipo" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Manutenção">Manutenção</SelectItem>
                  <SelectItem value="Venda">Venda</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="priority">Prioridade *</Label>
              <Select
                value={formData.priority}
                onValueChange={(value) => setFormData({ ...formData, priority: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione a prioridade" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Baixa">Baixa</SelectItem>
                  <SelectItem value="Média">Média</SelectItem>
                  <SelectItem value="Alta">Alta</SelectItem>
                  <SelectItem value="Urgente">Urgente</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="estimatedValue">Valor Orçado</Label>
              <Input
                id="estimatedValue"
                type="number"
                step="0.01"
                placeholder="0.00"
                value={formData.estimatedValue}
                onChange={(e) => setFormData({ ...formData, estimatedValue: e.target.value })}
              />
            </div>
          </div>

          {/* Maintenance specific fields */}
          {orderType === "Manutenção" && (
            <>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="deviceModel">Modelo do Aparelho</Label>
                  <Select
                    value={formData.deviceModel}
                    onValueChange={(value) => setFormData({ ...formData, deviceModel: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione o modelo" />
                    </SelectTrigger>
                    <SelectContent>
                      {iphoneModels.map((model) => (
                        <SelectItem key={model} value={model}>
                          {model}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="imei">IMEI / Número de Série</Label>
                  <Input
                    id="imei"
                    placeholder="Digite o IMEI"
                    value={formData.imei}
                    onChange={(e) => setFormData({ ...formData, imei: e.target.value })}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="problemDescription">Descrição do Problema</Label>
                <Textarea
                  id="problemDescription"
                  placeholder="Descreva o problema relatado pelo cliente..."
                  value={formData.problemDescription}
                  onChange={(e) => setFormData({ ...formData, problemDescription: e.target.value })}
                />
              </div>
            </>
          )}

          {/* Sale specific fields */}
          {orderType === "Venda" && (
            <>
              <div className="space-y-2">
                <Label htmlFor="productSold">Produto Vendido</Label>
                <Input
                  id="productSold"
                  placeholder="Ex: iPhone 15 Pro 256GB - Azul"
                  value={formData.productSold}
                  onChange={(e) => setFormData({ ...formData, productSold: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="productCondition">Condição do Produto</Label>
                <Select
                  value={formData.productCondition}
                  onValueChange={(value) => setFormData({ ...formData, productCondition: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione a condição" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Novo">Novo</SelectItem>
                    <SelectItem value="Seminovo">Seminovo</SelectItem>
                    <SelectItem value="Usado">Usado</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </>
          )}

          <div className="flex justify-end gap-2 pt-4">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancelar
            </Button>
            <Button type="submit">Criar Ordem</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
