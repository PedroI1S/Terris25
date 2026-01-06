# Terris — Interface do Agricultor# React + TypeScript + Vite



**Sistema de agricultura de precisão para visualização de dados de sensores, telemetria de máquinas e mapas de plantio.**This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.



---Currently, two official plugins are available:



## 📋 Visão Geral- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) (or [oxc](https://oxc.rs) when used in [rolldown-vite](https://vite.dev/guide/rolldown)) for Fast Refresh

- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

Terris é uma aplicação web SPA (Single Page Application) desenvolvida para agricultores que utilizam hardware de agricultura de precisão. A interface permite visualizar:

## React Compiler

- **Mapas de Plantio** por talhão com camadas de operações (plantio, pulverização, adubação, colheita)

- **Telemetria em tempo real** de máquinas e implementosThe React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

- **Leituras de sensores** (GPS, monitores de plantio, sensores de barra, umidade do solo, etc.)

- **Alertas em tempo real** (sensores offline, desvios de taxa, manutenção)## Expanding the ESLint configuration

- **Histórico de operações** e relatórios exportáveis

If you are developing a production application, we recommend updating the configuration to enable type-aware lint rules:

---

```js

## 🏗️ Arquitetura e Stackexport default defineConfig([

  globalIgnores(['dist']),

### Frontend  {

    files: ['**/*.{ts,tsx}'],

- **React 18** com **TypeScript**    extends: [

- **Vite** para build e dev server      // Other configs...

- **Tailwind CSS** para estilização com tokens de design system

- **Mapbox GL JS** para mapas interativos (alternativa: Leaflet)      // Remove tseslint.configs.recommended and replace with this

- **Recharts** para gráficos e séries temporais      tseslint.configs.recommendedTypeChecked,

- **Lucide React** para ícones      // Alternatively, use this for stricter rules

- **Radix UI** para componentes acessíveis      tseslint.configs.strictTypeChecked,

      // Optionally, add this for stylistic rules

### Estrutura de Componentes (Atomic Design)      tseslint.configs.stylisticTypeChecked,



```      // Other configs...

src/    ],

├── components/    languageOptions: {

│   ├── atoms/        # Button, Card, Badge, etc.      parserOptions: {

│   ├── molecules/    # TalhaoCard, SensorItem, MachineCard, AlertItem        project: ['./tsconfig.node.json', './tsconfig.app.json'],

│   ├── organisms/    # DashboardKPIs, MapLayout, AlertsPanel, SensorList        tsconfigRootDir: import.meta.dirname,

│   └── templates/    # Layout structures      },

├── pages/            # Dashboard, MapView, TalhaoDetails, MachineDetails      // other options...

├── types/            # TypeScript interfaces    },

├── mocks/            # Mock data and MSW handlers  },

├── services/         # API clients])

├── hooks/            # Custom React hooks```

├── lib/              # Utility functions

└── i18n/             # Internationalization (pt-BR, en, es)You can also install [eslint-plugin-react-x](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-x) and [eslint-plugin-react-dom](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-dom) for React-specific lint rules:

```

```js

### Mock API// eslint.config.js

import reactX from 'eslint-plugin-react-x'

- **MSW (Mock Service Worker)** para interceptar requisições e simular APIimport reactDom from 'eslint-plugin-react-dom'

- Payloads JSON completos para todos os endpoints

- OpenAPI/Swagger spec disponívelexport default defineConfig([

  globalIgnores(['dist']),

### Testes  {

    files: ['**/*.{ts,tsx}'],

- **Vitest** para testes unitários    extends: [

- **React Testing Library** para testes de componentes      // Other configs...

- **Playwright** para testes E2E      // Enable lint rules for React

      reactX.configs['recommended-typescript'],

---      // Enable lint rules for React DOM

      reactDom.configs.recommended,

## 🚀 Como Rodar o Projeto    ],

    languageOptions: {

### Pré-requisitos      parserOptions: {

        project: ['./tsconfig.node.json', './tsconfig.app.json'],

- **Node.js** 20.19+ ou 22.12+        tsconfigRootDir: import.meta.dirname,

- **npm** 9.6.7+ (recomendado: 11.6.2)      },

      // other options...

### Instalação    },

  },

1. **Clone o repositório** (ou abra no VS Code):])

   ```bash```

   cd /Users/pedro_mariano/Documents/Terris
   ```

2. **Instale as dependências**:
   ```bash
   npm install
   ```

3. **Configure as variáveis de ambiente**:
   ```bash
   cp .env.example .env
   ```
   
   Edite `.env` e adicione seu token do Mapbox:
   ```
   VITE_MAPBOX_ACCESS_TOKEN=pk.eyJ1Ijoic2V1LXVzdWFyaW8iLCAi...
   ```
   
   Obtenha um token gratuito em: [https://account.mapbox.com/access-tokens/](https://account.mapbox.com/access-tokens/)

### Desenvolvimento

```bash
npm run dev
```

Acesse: [http://localhost:5173](http://localhost:5173)

### Build para Produção

```bash
npm run build
```

Os arquivos otimizados estarão em `dist/`.

### Preview do Build

```bash
npm run preview
```

---

## 🗺️ Mapas: Mapbox vs. Leaflet

Por padrão, o projeto usa **Mapbox GL JS** para mapas de alta performance. Para alternar para **Leaflet** (open-source):

1. Edite `.env`:
   ```
   VITE_USE_MAPBOX=false
   VITE_USE_LEAFLET=true
   ```

### 🔧 Troubleshooting do Mapbox

Se o mapa não carregar na página:

1. **Execute o diagnóstico**:
   ```bash
   node check-mapbox.cjs
   ```

2. **Verifique o token no `.env`**:
   - Deve começar com `pk.`
   - Não deve ser o placeholder `your_mapbox_access_token_here`

3. **Verifique se `mapbox-gl` está instalado**:
   ```bash
   npm list mapbox-gl
   ```

4. **Reinicie o servidor** após alterar o `.env`:
   ```bash
   npm run dev
   ```

5. **Consulte o guia completo**: [MAPBOX_TROUBLESHOOTING.md](./MAPBOX_TROUBLESHOOTING.md)

**Console do navegador (F12)** mostrará erros detalhados se houver problemas de token ou conectividade.

2. Instale dependências adicionais (se necessário):
   ```bash
   npm install leaflet react-leaflet @types/leaflet
   ```

3. Implemente `MapLayout` com Leaflet no lugar de Mapbox (TODO: adicionar wrapper).

---

## 📊 Dados e Mock API

### Endpoints Disponíveis (Mock)

- `GET /api/v1/farms/{farmId}/talhoes` — Lista de talhões (GeoJSON)
- `GET /api/v1/talhoes/{id}?start=&end=` — Detalhes do talhão e operações históricas
- `GET /api/v1/sensors/{sensorId}/telemetry?start=&end=` — Série temporal de sensor
- `WS /ws/telemetry` — Telemetria em tempo real (WebSocket)
- `POST /api/v1/exports/map` — Gerar PDF/PNG do mapa

### Exemplos de Payloads

**Talhão (GeoJSON)**
```json
{
  "type": "Feature",
  "geometry": { "type":"Polygon", "coordinates": [ [ [-53.0, -25.0], ... ] ] },
  "properties": {
    "id": "talhao-123",
    "name": "Talhão A",
    "area_ha": 12.34,
    "culture": "Soja",
    "sensors": ["sensor-789","sensor-456"],
    "status": "active"
  }
}
```

**Leitura de Sensor**
```json
{
  "sensor_id":"sensor-789",
  "type":"soil_moisture",
  "talhao_id":"talhao-123",
  "timestamp":"2025-10-07T12:34:56Z",
  "value": 23.5,
  "unit":"%",
  "geo": { "lat": -25.0, "lon": -53.0 },
  "status": "online"
}
```

**Operação de Plantio**
```json
{
  "operation_id":"op-555",
  "type":"planting",
  "machine_id":"tractor-11",
  "talhao_id":"talhao-123",
  "start":"2025-09-15T08:00:00Z",
  "end":"2025-09-15T11:25:00Z",
  "metrics": {
    "seed_count": 350000,
    "rate_per_ha": 28000
  }
}
```

---

## 🎨 Design System

### Paleta de Cores

```css
Primary (Terris green): #006b3c
Secondary (Accent terra): #b56a2a
Neutral dark: #0f1724
Neutral mid: #64748b
Background claro: #f7fafc
Success: #16a34a
Warning: #f59e0b
Danger: #ef4444
```

### Tipografia

- **Headlines**: Inter 600/700 (28–32px desktop)
- **Body**: Inter 400
- **Monospace** (logs/dados técnicos): Roboto Mono

### Espaçamento

- **Base**: 8px (use múltiplos: 16px, 24px, 32px, etc.)

---

## ✅ Critérios de Aceitação (QA)

1. **Dashboard carrega** com KPIs, alertas, talhões, máquinas e sensores.
2. **Mapa renderiza** pelo menos 1 talhão (polígono GeoJSON) com time slider.
3. **Clicar em talhão** abre painel lateral com histórico e sensores.
4. **Notificações em tempo real** aparecem via WebSocket simulado.
5. **Botão de export** gera PDF com legenda e mapa.
6. **Testes unitários** cobrem 80% dos componentes críticos (MapLayout, TalhaoCard, SensorList).
7. **Lighthouse**: Performance ≥ 90, Accessibility ≥ 90.

---

## 🧪 Testes

### Rodar Testes Unitários

```bash
npm run test
```

### Rodar Testes E2E (Playwright)

```bash
npm run test:e2e
```

---

## 🌐 Internacionalização

Idiomas suportados:

- **Português (pt-BR)** — padrão
- **Inglês (en)**
- **Espanhol (es)**

Para alterar o idioma, configure `i18next` em `src/i18n/index.ts`.

---

## 🔒 Segurança e Permissões

### Roles de Usuário

- **agricultor_admin** — Acesso total
- **operador_maquina** — Visualizar mapas e telemetria de suas máquinas
- **tecnico_terris** — Acesso a todos os sensores e logs
- **visualizador** — Apenas leitura

### Autenticação

- **OAuth2 / JWT** (implementação futura)
- Logs de auditoria para visualização e modificação de polígonos

---

## 📦 Dependências Principais

```json
{
  "react": "^18.3.1",
  "react-dom": "^18.3.1",
  "typescript": "~5.6.2",
  "vite": "^7.1.9",
  "tailwindcss": "^3.4.17",
  "mapbox-gl": "^3.10.0",
  "recharts": "^2.15.0",
  "lucide-react": "^0.468.0",
  "@radix-ui/react-dialog": "^1.1.4",
  "@radix-ui/react-toast": "^1.2.4",
  "msw": "^2.8.4",
  "react-router-dom": "^7.1.3",
  "i18next": "^24.2.1",
  "react-i18next": "^16.1.4"
}
```

---

## 📝 Licença

Propriedade de **Terris — Agricultura de Precisão**. Todos os direitos reservados.

---

## 🤝 Contribuições

Para contribuir, siga as diretrizes:

1. Fork o repositório
2. Crie uma branch (`git checkout -b feature/nova-feature`)
3. Commit suas alterações (`git commit -m 'Adiciona nova feature'`)
4. Push para a branch (`git push origin feature/nova-feature`)
5. Abra um Pull Request

---

## 📞 Contato

- **Site**: [terris.com.br](https://terris.com.br)
- **Email**: contato@terris.com.br

---

**Desenvolvido com ❤️ para o agronegócio brasileiro.**
