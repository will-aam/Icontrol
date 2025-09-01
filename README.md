# iControl Simplificado - Sistema de Gestão de Ordens

Este é um sistema de gestão de ordens de serviço e vendas para uma loja de iPhones, desenvolvido para simplificar o controle e o acompanhamento de cada transação.

## Funcionalidades

- **Gestão de Ordens:** Crie, edite, visualize e exclua ordens de serviço e vendas de forma intuitiva.
- **Filtragem Avançada:** Filtre as ordens por cliente, contato, descrição, tipo, status ou período.
- **Interface Responsiva:** Acesse o sistema em qualquer dispositivo, seja no desktop ou no celular.
- **Notificações:** Receba confirmações visuais para cada ação realizada no sistema.

## Como Começar

Siga os passos abaixo para executar o projeto em seu ambiente de desenvolvimento local.

### Pré-requisitos

- [Node.js](https://nodejs.org/) (versão 22 ou superior)
- [pnpm](https://pnpm.io/) (gerenciador de pacotes)

### Instalação

1. Clone o repositório:
   ```bash
   git clone https://github.com/seu-usuario/seu-repositorio.git
   ```
2. Navegue até o diretório do projeto:
   ```bash
   cd seu-repositorio
   ```
3. Instale as dependências:
   ```bash
   pnpm install
   ```

### Executando o Projeto

Para iniciar o servidor de desenvolvimento, execute o comando:

```bash
pnpm dev
```

Abra [http://localhost:3000](http://localhost:3000) em seu navegador para ver o resultado.

## Tecnologias Utilizadas

- **[Next.js](https://nextjs.org/):** Framework React para desenvolvimento web.
- **[React](https://react.dev/):** Biblioteca para construir interfaces de usuário.
- **[TypeScript](https://www.typescriptlang.org/):** Superset de JavaScript que adiciona tipagem estática.
- **[Tailwind CSS](https://tailwindcss.com/):** Framework de CSS para estilização rápida e utilitária.
- **[shadcn/ui](https://ui.shadcn.com/):** Coleção de componentes de UI reusáveis.
- **[Radix UI](https://www.radix-ui.com/):** Primitivos de UI para componentes acessíveis.

## Estrutura do Projeto

O projeto segue a estrutura de diretórios do Next.js App Router:

- **/app:** Contém as páginas e layouts da aplicação.
- **/components:** Armazena os componentes React, incluindo os de UI da `shadcn/ui`.
- **/lib:** Guarda as funções utilitárias, tipos e dados mockados.
- **/public:** Diretório para arquivos estáticos como imagens e fontes.
- **/styles:** Arquivos de estilo global.
