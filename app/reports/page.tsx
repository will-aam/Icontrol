"use client"

import { SidebarTrigger } from "@/components/ui/sidebar"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { BarChart3 } from "lucide-react"

export default function ReportsPage() {
  return (
    <div className="flex flex-col">
      <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
        <SidebarTrigger />
        <div className="flex flex-1 items-center gap-2">
          <h1 className="text-xl font-semibold">Relatórios</h1>
        </div>
      </header>

      <div className="flex-1 space-y-6 p-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-4 w-4" />
              Relatórios e Análises
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center py-12">
              <p className="text-muted-foreground mb-4">Esta seção está em desenvolvimento. Aqui você terá acesso a:</p>
              <ul className="text-sm text-muted-foreground space-y-2 max-w-md mx-auto">
                <li>• Relatório de faturamento mensal/anual</li>
                <li>• Análise de performance por técnico</li>
                <li>• Relatório de peças mais utilizadas</li>
                <li>• Tempo médio de reparo por modelo</li>
                <li>• Satisfação do cliente</li>
              </ul>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
