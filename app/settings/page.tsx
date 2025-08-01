"use client"

import { SidebarTrigger } from "@/components/ui/sidebar"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Settings } from "lucide-react"

export default function SettingsPage() {
  return (
    <div className="flex flex-col">
      <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
        <SidebarTrigger />
        <div className="flex flex-1 items-center gap-2">
          <h1 className="text-xl font-semibold">Configurações</h1>
        </div>
      </header>

      <div className="flex-1 space-y-6 p-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Settings className="h-4 w-4" />
              Configurações do Sistema
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center py-12">
              <p className="text-muted-foreground mb-4">
                Esta seção está em desenvolvimento. Aqui você poderá configurar:
              </p>
              <ul className="text-sm text-muted-foreground space-y-2 max-w-md mx-auto">
                <li>• Dados da empresa</li>
                <li>• Usuários e permissões</li>
                <li>• Modelos de iPhone disponíveis</li>
                <li>• Templates de WhatsApp e Email</li>
                <li>• Backup e restauração</li>
              </ul>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
