"use client"

import { SidebarTrigger } from "@/components/ui/sidebar"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"

export default function ProductsPage() {
  return (
    <div className="flex flex-col">
      <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
        <SidebarTrigger />
        <div className="flex flex-1 items-center justify-between">
          <h1 className="text-xl font-semibold">Produtos</h1>
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Novo Produto
          </Button>
        </div>
      </header>

      <div className="flex-1 space-y-6 p-6">
        <Card>
          <CardHeader>
            <CardTitle>Gestão de Produtos</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center py-12">
              <p className="text-muted-foreground mb-4">
                Esta seção está em desenvolvimento. Aqui você poderá gerenciar:
              </p>
              <ul className="text-sm text-muted-foreground space-y-2 max-w-md mx-auto">
                <li>• Inventário de iPhones para venda</li>
                <li>• Estoque de peças para manutenção</li>
                <li>• Controle de entrada e saída</li>
                <li>• Preços e margens de lucro</li>
              </ul>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
