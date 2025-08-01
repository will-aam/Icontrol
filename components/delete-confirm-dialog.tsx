"use client"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { AlertTriangle } from "lucide-react"
import type { Order } from "@/lib/types"

interface DeleteConfirmDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onConfirm: () => void
  orderToDelete: Order | null
}

export function DeleteConfirmDialog({ open, onOpenChange, onConfirm, orderToDelete }: DeleteConfirmDialogProps) {
  if (!orderToDelete) return null

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-red-500" />
            Confirmar Exclusão
          </DialogTitle>
          <DialogDescription>
            Tem certeza que deseja excluir a ordem <strong>{orderToDelete.id}</strong> do cliente{" "}
            <strong>{orderToDelete.nomeCliente}</strong>?
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancelar
          </Button>
          <Button variant="destructive" onClick={onConfirm}>
            Excluir
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
