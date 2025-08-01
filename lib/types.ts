export interface Order {
  id: string
  nomeCliente: string
  contatoCliente: string
  tipo: "Serviço" | "Venda"
  descricao: string
  valor: number
  status: "Pendente" | "Em Andamento" | "Aguardando Pagamento" | "Concluído" | "Cancelado"
  dataEntrada: string
}
