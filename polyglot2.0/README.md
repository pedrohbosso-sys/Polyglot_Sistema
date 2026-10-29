# Polyglot — Sistema de Gestão Acadêmica

Sistema acadêmico para curso de idiomas, desenvolvido com Next.js App Router, MongoDB/Mongoose, JWT, bcrypt e SCSS.

## Requisitos
- Node.js LTS
- MongoDB em execução

## Instalação
1. Extraia o projeto e abra a pasta `polyglot2.0` no VS Code.
2. Execute `npm install`.
3. Crie `.env.local` com:
   ```
   MONGODB_URI=mongodb://127.0.0.1:27017/polyglot
   JWT_SECRET=coloque_uma_chave_longa_e_aleatoria
   ```
4. Execute `node criar-coordenador.js` para criar/atualizar a conta coordenadora.
5. Execute `npm run dev` e acesse `http://localhost:3000`.

Conta inicial: `coordenador@polyglot.com` / `Polyglot@2026`.

## Módulos
- Autenticação e cadastro de alunos
- Painel
- Cursos
- Professores
- Turmas
- Alunos
- Matrículas
- Notas e faltas
- Boletim acadêmico

## Perfis
- Coordenador: acesso administrativo aos cadastros.
- Professor: consulta turmas e registra notas/faltas.
- Aluno: consulta seu boletim e informações acadêmicas.

## Observações
Este é um projeto acadêmico inicial. Antes de uso real, revise a segurança, regras de matrícula, auditoria, recuperação de senha e tratamento de dados pessoais. Nunca publique `.env.local`.
