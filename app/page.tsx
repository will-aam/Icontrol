"use client";

import { useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Plus, Search, Filter, Edit, Trash2, Wrench } from "lucide-react";
import { OrderModal } from "@/components/order-modal";
import { DeleteConfirmDialog } from "@/components/delete-confirm-dialog";
import { mockOrders } from "@/lib/mock-data";
import { formatCurrency, formatDate } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";
import type { Order } from "@/lib/types";

export default function HomePage() {
  const { toast } = useToast();
  const [orders, setOrders] = useState<Order[]>(mockOrders);
  const [showOrderModal, setShowOrderModal] = useState(false);
  const [editingOrder, setEditingOrder] = useState<Order | null>(null);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [orderToDelete, setOrderToDelete] = useState<Order | null>(null);

  // Filter states
  const [searchTerm, setSearchTerm] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState<string[]>([]);
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");

  // Filter orders in real-time
  const filteredOrders = useMemo(() => {
    return orders.filter((order) => {
      // Search filter - searches in customer name, contact, and description
      const searchMatch =
        !searchTerm ||
        order.nomeCliente.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.contatoCliente.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.descricao.toLowerCase().includes(searchTerm.toLowerCase());

      // Type filter
      const typeMatch = typeFilter === "all" || order.tipo === typeFilter;

      // Status filter (multiple selection)
      const statusMatch =
        statusFilter.length === 0 || statusFilter.includes(order.status);

      // Date range filter
      const orderDate = new Date(order.dataEntrada);
      const fromDate = dateFrom ? new Date(dateFrom) : null;
      const toDate = dateTo ? new Date(dateTo) : null;

      const dateMatch =
        (!fromDate || orderDate >= fromDate) &&
        (!toDate || orderDate <= toDate);

      return searchMatch && typeMatch && statusMatch && dateMatch;
    });
  }, [orders, searchTerm, typeFilter, statusFilter, dateFrom, dateTo]);

  const handleCreateOrder = (orderData: Omit<Order, "id" | "dataEntrada">) => {
    const newOrder: Order = {
      ...orderData,
      id: generateOrderId(orderData.tipo),
      dataEntrada: new Date().toISOString().split("T")[0],
    };

    setOrders([newOrder, ...orders]);
    setShowOrderModal(false);
    toast({
      title: "Sucesso",
      description: "Ordem criada com sucesso!",
    });
  };

  const handleEditOrder = (order: Order) => {
    setEditingOrder(order);
    setShowOrderModal(true);
  };

  const handleUpdateOrder = (orderData: Omit<Order, "id" | "dataEntrada">) => {
    if (!editingOrder) return;

    const updatedOrder: Order = {
      ...orderData,
      id: editingOrder.id,
      dataEntrada: editingOrder.dataEntrada,
    };

    setOrders(
      orders.map((order) =>
        order.id === editingOrder.id ? updatedOrder : order
      )
    );
    setEditingOrder(null);
    setShowOrderModal(false);
    toast({
      title: "Sucesso",
      description: "Ordem atualizada com sucesso!",
    });
  };

  const handleDeleteOrder = (order: Order) => {
    setOrderToDelete(order);
    setShowDeleteDialog(true);
  };

  const confirmDelete = () => {
    if (!orderToDelete) return;

    setOrders(orders.filter((order) => order.id !== orderToDelete.id));
    setOrderToDelete(null);
    setShowDeleteDialog(false);
    toast({
      title: "Sucesso",
      description: "Ordem excluída com sucesso!",
    });
  };

  const generateOrderId = (tipo: string): string => {
    const prefix = tipo === "Serviço" ? "OS" : "VENDA";
    const count = orders.filter((order) => order.tipo === tipo).length + 1;
    return `${prefix}-${count.toString().padStart(3, "0")}`;
  };

  const clearFilters = () => {
    setSearchTerm("");
    setTypeFilter("all");
    setStatusFilter([]);
    setDateFrom("");
    setDateTo("");
  };

  const getStatusColor = (status: string) => {
    const colors = {
      Pendente: "bg-yellow-100 text-yellow-800",
      "Em Andamento": "bg-blue-100 text-blue-800",
      "Aguardando Pagamento": "bg-orange-100 text-orange-800",
      Concluído: "bg-green-100 text-green-800",
      Cancelado: "bg-red-100 text-red-800",
    };
    return colors[status as keyof typeof colors] || "bg-gray-100 text-gray-800";
  };

  const getTypeIcon = (tipo: string) => {
    return tipo === "Serviço" ? (
      <Wrench className="h-4 w-4" />
    ) : (
      <Plus className="h-4 w-4" />
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto p-6 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              iControl Simplificado
            </h1>
            <p className="text-gray-600">
              Sistema de Gestão de Ordens - iPhone Store
            </p>
          </div>
          <Button onClick={() => setShowOrderModal(true)} size="lg">
            <Plus className="h-4 w-4 mr-2" />
            Nova Ordem
          </Button>
        </div>

        {/* Advanced Filters */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Filter className="h-5 w-5" />
              Filtros Avançados
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Search Bar */}
            <div className="flex items-center gap-2">
              <Search className="h-4 w-4 text-gray-500" />
              <Input
                placeholder="Buscar por cliente, contato ou descrição..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="flex-1"
              />
            </div>

            {/* Filter Controls */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Type Filter */}
              <div className="space-y-2">
                <label className="text-sm font-medium">Tipo</label>
                <Select value={typeFilter} onValueChange={setTypeFilter}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todos</SelectItem>
                    <SelectItem value="Serviço">Serviço</SelectItem>
                    <SelectItem value="Venda">Venda</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Status Filter */}
              <div className="space-y-2">
                <label className="text-sm font-medium">Status</label>
                <Select
                  value={
                    statusFilter.length > 0 ? statusFilter.join(",") : "all"
                  }
                  onValueChange={(value) => {
                    if (value === "all") {
                      setStatusFilter([]);
                    } else {
                      const statuses = value.split(",");
                      setStatusFilter(statuses);
                    }
                  }}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecionar status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todos os Status</SelectItem>
                    <SelectItem value="Pendente">Pendente</SelectItem>
                    <SelectItem value="Em Andamento">Em Andamento</SelectItem>
                    <SelectItem value="Aguardando Pagamento">
                      Aguardando Pagamento
                    </SelectItem>
                    <SelectItem value="Concluído">Concluído</SelectItem>
                    <SelectItem value="Cancelado">Cancelado</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Date From */}
              <div className="space-y-2">
                <label className="text-sm font-medium">Data De</label>
                <Input
                  type="date"
                  value={dateFrom}
                  onChange={(e) => setDateFrom(e.target.value)}
                />
              </div>

              {/* Date To */}
              <div className="space-y-2">
                <label className="text-sm font-medium">Data Até</label>
                <Input
                  type="date"
                  value={dateTo}
                  onChange={(e) => setDateTo(e.target.value)}
                />
              </div>
            </div>

            {/* Filter Summary and Clear */}
            <div className="flex items-center justify-between pt-2 border-t">
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <span>
                  Mostrando {filteredOrders.length} de {orders.length} ordens
                </span>
                {(searchTerm ||
                  typeFilter !== "all" ||
                  statusFilter.length > 0 ||
                  dateFrom ||
                  dateTo) && <Badge variant="secondary">Filtros ativos</Badge>}
              </div>
              <Button variant="outline" onClick={clearFilters} size="sm">
                Limpar Filtros
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Orders Table */}
        <Card>
          <CardHeader>
            <CardTitle>Lista de Ordens</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>ID</TableHead>
                    <TableHead>Cliente</TableHead>
                    <TableHead>Contato</TableHead>
                    <TableHead>Tipo</TableHead>
                    <TableHead>Descrição</TableHead>
                    <TableHead>Valor</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Data</TableHead>
                    <TableHead>Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredOrders.length > 0 ? (
                    filteredOrders.map((order) => (
                      <TableRow key={order.id} className="hover:bg-gray-50">
                        <TableCell className="font-medium">
                          {order.id}
                        </TableCell>
                        <TableCell>{order.nomeCliente}</TableCell>
                        <TableCell>{order.contatoCliente}</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            {getTypeIcon(order.tipo)}
                            <Badge variant="outline">{order.tipo}</Badge>
                          </div>
                        </TableCell>
                        <TableCell className="max-w-xs">
                          <div className="truncate" title={order.descricao}>
                            {order.descricao}
                          </div>
                        </TableCell>
                        <TableCell className="font-medium">
                          {formatCurrency(order.valor)}
                        </TableCell>
                        <TableCell>
                          <Badge className={getStatusColor(order.status)}>
                            {order.status}
                          </Badge>
                        </TableCell>
                        <TableCell>{formatDate(order.dataEntrada)}</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleEditOrder(order)}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleDeleteOrder(order)}
                              className="text-red-600 hover:text-red-700"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={9} className="text-center py-8">
                        <div className="text-gray-500">
                          {orders.length === 0 ? (
                            <div>
                              <p className="mb-2">
                                Nenhuma ordem cadastrada ainda.
                              </p>
                              <Button onClick={() => setShowOrderModal(true)}>
                                <Plus className="h-4 w-4 mr-2" />
                                Criar Primeira Ordem
                              </Button>
                            </div>
                          ) : (
                            <p>
                              Nenhuma ordem encontrada com os filtros aplicados.
                            </p>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Order Modal */}
      <OrderModal
        open={showOrderModal}
        onOpenChange={(open) => {
          setShowOrderModal(open);
          if (!open) {
            setEditingOrder(null);
          }
        }}
        onSubmit={editingOrder ? handleUpdateOrder : handleCreateOrder}
        editingOrder={editingOrder}
      />

      {/* Delete Confirmation Dialog */}
      <DeleteConfirmDialog
        open={showDeleteDialog}
        onOpenChange={setShowDeleteDialog}
        onConfirm={confirmDelete}
        orderToDelete={orderToDelete}
      />
    </div>
  );
}
