# Sistema de Saude Web

Sistema web para gerenciamento de profissionais de saude, atendimentos e exames laboratoriais.

## Tecnologias

- **Backend**: Java 17 + Spring Boot 3.2 + PostgreSQL
- **Frontend**: React 18 + Axios + React Router
- **Infra**: Docker + Docker Compose + GitHub Actions

## Entidades

### ProfissionalSaude
- id, nome, telefone, endereco
- categoria: `MEDICO`, `FISIOTERAPEUTA`, `PSICOLOGO`

### Atendimento
- id, data, horario, problema_tex, receita_saude
- Vinculado a um ProfissionalSaude

### ExameLab
- id, descricao, resultado
- Vinculado a um Atendimento

## Como rodar localmente

```bash
# Com Docker Compose
docker-compose up --build

# Backend em http://localhost:8080
# Frontend em http://localhost:3000
# Swagger em http://localhost:8080/swagger-ui.html
```

## Endpoints da API

### Profissionais de Saude
| Metodo | Rota | Descricao |
|--------|------|-----------|
| POST | /api/profissionais | Inserir |
| GET | /api/profissionais | Listar todos |
| GET | /api/profissionais/{id} | Consultar por ID |
| GET | /api/profissionais/buscar?nome= | Consultar por Nome |
| GET | /api/profissionais/categoria/{cat} | Consultar por Categoria |
| PUT | /api/profissionais/{id} | Alterar |
| DELETE | /api/profissionais/{id} | Excluir |

### Atendimentos
| Metodo | Rota | Descricao |
|--------|------|-----------|
| POST | /api/atendimentos | Criar |
| GET | /api/atendimentos | Listar todos |
| GET | /api/atendimentos/{id} | Buscar por ID |
| PUT | /api/atendimentos/{id} | Atualizar |
| DELETE | /api/atendimentos/{id} | Deletar |

### Exames Lab
| Metodo | Rota | Descricao |
|--------|------|-----------|
| POST | /api/exames | Criar |
| GET | /api/exames | Listar todos |
| GET | /api/exames/{id} | Buscar por ID |
| PUT | /api/exames/{id} | Atualizar |
| DELETE | /api/exames/{id} | Deletar |

## Link da aplicacao em producao

> [App no Render](https://saude-web-frontend.onrender.com)

## Autores

- Lucas Souza
