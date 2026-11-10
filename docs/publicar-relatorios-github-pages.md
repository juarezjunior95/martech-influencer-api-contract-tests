# Publicar relatórios HTML (acesso público)

Os relatórios em `reports/` podem ser servidos gratuitamente pelo **GitHub Pages** do repositório
[`martech-influencer-api-contract-tests`](https://github.com/juarezjunior95/martech-influencer-api-contract-tests).

## Ativar (uma vez)

1. Abra **Settings** → **Pages** no GitHub.
2. Em **Build and deployment** → **Source**, escolha **GitHub Actions** (não “Deploy from branch”).
3. Faça push na `main` (ou rode o workflow **GitHub Pages — reports** em **Actions** → **Run workflow**).

## URLs públicas

Substitua se o nome do usuário/repo mudar:

| Página | URL |
|--------|-----|
| Índice | https://juarezjunior95.github.io/martech-influencer-api-contract-tests/ |
| Backlog endpoints | https://juarezjunior95.github.io/martech-influencer-api-contract-tests/pact-endpoint-backlog.html |

## Atualizar conteúdo

```bash
npm run pact:endpoint-backlog    # regera pact-endpoint-backlog.html
npm run pact:openapi-gap-report
npm run pact:backlog-report
git add reports/
git commit -m "chore: atualizar relatórios Pact"
git push
```

O workflow `.github/workflows/github-pages.yml` republica automaticamente após o push.

## Alternativas

- **Netlify / Vercel**: arraste a pasta `reports/` no dashboard (deploy estático).
- **Não usar** `file://` — navegadores bloqueiam ou limitam links locais; sempre hospede via HTTPS.
