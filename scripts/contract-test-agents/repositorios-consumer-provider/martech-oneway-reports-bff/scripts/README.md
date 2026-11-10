# Scripts de Teste

## test_concurrent_requests.sh

Script para testar requests simultâneas ao servidor BFF.

### Como executar:

#### 1. Navegar para o diretório do projeto:
```bash
cd /Users/leonardocarnieri/Projects/GHQ_DaVinci/temp-martech-oneway-reports-bff
```

#### 2. Executar o script:

**Padrão (5 requests):**
```bash
./scripts/test_concurrent_requests.sh
```

**Customizado (10 requests):**
```bash
./scripts/test_concurrent_requests.sh 10
```

**Customizado (50 requests):**
```bash
./scripts/test_concurrent_requests.sh 50
```

### Parâmetros:

- **Primeiro parâmetro**: Número de requests simultâneas (padrão: 5)
- **Sem parâmetros**: Usa 5 requests

### Exemplos de uso:

```bash
# 5 requests (padrão)
./scripts/test_concurrent_requests.sh

# 10 requests
./scripts/test_concurrent_requests.sh 10

# 30 requests
./scripts/test_concurrent_requests.sh 30

# 100 requests
./scripts/test_concurrent_requests.sh 100
```

### O que o script faz:

1. **Executa requests simultâneas** para o endpoint do BFF
2. **Mede tempo de resposta** de cada request
3. **Conta sucessos e falhas** (HTTP 200 vs outros)
4. **Gera relatório** com estatísticas
5. **Retorna código de saída** (0 = sucesso, 1 = falha)

### Endpoint testado:

```
http://localhost:8080/v1/views/portfolio-brand_brand-power-book_power-book_overview?filter[viewtype]=global&filter[page_filter]=All&filter[zone]=ABI&filter[country]=ABI&filter[dt_end]=2025-06-01
```

### Pré-requisitos:

- Servidor BFF rodando na porta 8080
- Docker containers ativos
- Conectividade com Databricks
