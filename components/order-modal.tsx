"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/hooks/use-toast"
import type { Order } from "@/lib/types"

interface OrderModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSubmit: (order: Omit<Order, "id" | "dataEntrada">) => void
  editingOrder?: Order | null
}

export function OrderModal({ open, onOpenChange, onSubmit, editingOrder }: OrderModalProps) {
  const { toast } = useToast()
  const [formData, setFormData] = useState({
    nomeCliente: "",
    contatoCliente: "",
    tipo: "",
    descricao: "",
    valor: "",
    status: "Pendente",
  })

  // Reset form when modal opens/closes or when editing order changes
  useEffect(() => {
    if (editingOrder) {
      setFormData({
        nomeCliente: editingOrder.nomeCliente,
        contatoCliente: editingOrder.contatoCliente,
        tipo: editingOrder.tipo,
        descricao: editingOrder.descricao,
        valor: editingOrder.valor.toString(),
        status: editingOrder.status,
      })
    } else {
      setFormData({
        nomeCliente: "",
        contatoCliente: "",
        tipo: "",
        descricao: "",
        valor: "",
        status: "Pendente",
      })
    }
  }, [editingOrder, open])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    // Validation
    if (!formData.nomeCliente.trim()) {
      toast({
        title: "Erro",
        description: "Nome do cliente é obrigatório.",
        variant: "destructive",
      })
      return
    }

    if (!formData.contatoCliente.trim()) {
      toast({
        title: "Erro",
        description: "Contato do cliente é obrigatório.",
        variant: "destructive",
      })
      return
    }

    if (!formData.tipo) {
      toast({
        title: "Erro",
        description: "Tipo da ordem é obrigatório.",
        variant: "destructive",
      })
      return
    }

    if (!formData.descricao.trim()) {
      toast({
        title: "Erro",
        description: "Descrição é obrigatória.",
        variant: "destructive",
      })
      return
    }

    if (!formData.valor || Number.parseFloat(formData.valor) <= 0) {
      toast({
        title: "Erro",
        description: "Valor deve ser maior que zero.",
        variant: "destructive",
      })
      return
    }

    // Submit the form
    onSubmit({
      nomeCliente: formData.nomeCliente.trim(),
      contatoCliente: formData.contatoCliente.trim(),
      tipo: formData.tipo as "Serviço" | "Venda",
      descricao: formData.descricao.trim(),
      valor: Number.parseFloat(formData.valor),
      status: formData.status as Order["status"],
    })
  }

  const getDescriptionPlaceholder = () => {
    if (formData.tipo === "Serviço") {
      return "Ex: iPhone 13 Pro, IMEI 123456789012345 - Tela não liga"
    } else if (formData.tipo === "Venda") {
      return "Ex: iPhone 15 Pro 256GB Novo - Azul"
    }
    return "Descreva o serviço ou produto..."
  }

  const getDescriptionLabel = () => {
    if (formData.tipo === "Serviço") {
      return "Descrição (Modelo, IMEI e Problema)"
    } else if (formData.tipo === "Venda") {
      return "Descrição (Produto Vendido)"
    }
    return "Descrição"
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>{editingOrder ? "Editar Ordem" : "Nova Ordem"}</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="nomeCliente">Nome do Cliente *</Label>
              <Input
                id="nomeCliente"
                placeholder="Digite o nome do cliente"
                value={formData.nomeCliente}
                onChange={(e) => setFormData({ ...formData, nomeCliente: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="contatoCliente">Contato (Telefone/Email) *</Label>
              <Input
                id="contatoCliente"
                placeholder="(11) 99999-9999 ou email@exemplo.com"
                value={formData.contatoCliente}
                onChange={(e) => setFormData({ ...formData, contatoCliente: e.target.value })}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="tipo">Tipo da Ordem *</Label>
              <Select value={formData.tipo} onValueChange={(value) => setFormData({ ...formData, tipo: value })}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o tipo" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Serviço">Serviço</SelectItem>
                  <SelectItem value="Venda">Venda</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="status">Status</Label>
              <Select value={formData.status} onValueChange={(value) => setFormData({ ...formData, status: value })}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Pendente">Pendente</SelectItem>
                  <SelectItem value="Em Andamento">Em Andamento</SelectItem>
                  <SelectItem value="Aguardando Pagamento">Aguardando Pagamento</SelectItem>
                  <SelectItem value="Concluído">Concluído</SelectItem>
                  <SelectItem value="Cancelado">Cancelado</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="descricao">{getDescriptionLabel()} *</Label>
            <Textarea
              id="descricao"
              placeholder={getDescriptionPlaceholder()}
              value={formData.descricao}
              onChange={(e) => setFormData({ ...formData, descricao: e.target.value })}
              rows={3}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="valor">Valor Total (R$) *</Label>
            <Input
              id="valor"
              type="number"
              step="0.01"
              min="0"
              placeholder="0.00"
              value={formData.valor}
              onChange={(e) => setFormData({ ...formData, valor: e.target.value })}
            />
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancelar
            </Button>
            <Button type="submit">{editingOrder ? "Atualizar" : "Criar"} Ordem</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
