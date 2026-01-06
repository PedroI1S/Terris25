# 🗺️ Troubleshooting do Mapbox

## Problema: "O mapa não carrega na página"

### ✅ Checklist de Verificação

#### 1. Verifique o token do Mapbox

Execute o script de diagnóstico:
```bash
node check-mapbox.cjs
```

Ou verifique manualmente:

**Arquivo `.env`** deve conter:
```env
VITE_MAPBOX_ACCESS_TOKEN=pk.eyJ1Ijoic2V1LXVzdWFyaW8iLCJhIjoic2V1LXRva2VuIn0.exemplo
```

⚠️ **Importante**: O token deve começar com `pk.`

#### 2. Verifique se `mapbox-gl` está instalado

```bash
npm list mapbox-gl
```

Deve mostrar: `terris@0.0.0 /path/to/terris` com `mapbox-gl@3.15.0` nas **dependencies**.

Se não estiver instalado:
```bash
npm install mapbox-gl
```

#### 3. Reinicie o servidor de desenvolvimento

Depois de qualquer alteração no `.env`:
```bash
# Pressione Ctrl+C para parar o servidor atual
npm run dev
```

#### 4. Verifique o console do navegador

Abra o DevTools (F12) e vá para a aba **Console**.

**Mensagens esperadas (✅ OK):**
- Nenhum erro relacionado ao Mapbox
- Mapa carrega normalmente

**Erros comuns (❌):**

| Erro | Solução |
|------|---------|
| `Token do Mapbox não encontrado` | Configure `VITE_MAPBOX_ACCESS_TOKEN` no `.env` |
| `401 Unauthorized` | Token inválido ou expirado. Gere novo token em [account.mapbox.com](https://account.mapbox.com/access-tokens/) |
| `Failed to fetch` | Problema de conexão com internet ou firewall bloqueando Mapbox |
| `mapbox-gl is not defined` | Execute `npm install mapbox-gl` |

#### 5. Verifique se o componente MapLayout está sendo usado

**Arquivo `src/App.tsx`** deve importar e usar `MapView`:

```tsx
import { MapView } from './pages/MapView';

function App() {
  return <MapView />;
}
```

Se quiser usar o Dashboard ao invés do mapa:
```tsx
import { Dashboard } from './pages/Dashboard';

function App() {
  return <Dashboard />;
}
```

### 🔧 Soluções Rápidas

#### Solução 1: Reinstalar dependências
```bash
rm -rf node_modules package-lock.json
npm install
npm run dev
```

#### Solução 2: Limpar cache do Vite
```bash
rm -rf node_modules/.vite
npm run dev
```

#### Solução 3: Gerar novo token do Mapbox

1. Acesse: https://account.mapbox.com/access-tokens/
2. Crie um novo token (Public scope)
3. Copie o token
4. Cole no arquivo `.env`:
   ```env
   VITE_MAPBOX_ACCESS_TOKEN=seu_novo_token_aqui
   ```
5. Reinicie o servidor: `npm run dev`

### 📊 Estrutura do Mapa

O componente `MapLayout` tem as seguintes funcionalidades:

- ✅ **Validação de token**: Mostra mensagem de erro se token não configurado
- ✅ **Tratamento de erros**: Captura erros de carregamento do mapa
- ✅ **Loading state**: Mostra spinner enquanto carrega
- ✅ **Renderização de talhões**: Polígonos GeoJSON com cores por status
- ✅ **Popups interativos**: Clique nos talhões para ver detalhes
- ✅ **Controles de navegação**: Zoom, rotação, pitch
- ✅ **Legenda**: Mostra cores de cada status
- ✅ **Auto-fit bounds**: Ajusta zoom para mostrar todos os talhões

### 🐛 Debug Avançado

#### Ver logs do Mapbox no console

Adicione no componente `MapLayout.tsx`:

```tsx
useEffect(() => {
  console.log('🗺️ Token do Mapbox:', MAPBOX_TOKEN?.substring(0, 20) + '...');
  console.log('🗺️ Centro do mapa:', center);
  console.log('🗺️ Zoom inicial:', zoom);
  console.log('🗺️ Número de talhões:', talhoes.length);
}, []);
```

#### Testar token do Mapbox via API

```bash
curl "https://api.mapbox.com/geocoding/v5/mapbox.places/london.json?access_token=SEU_TOKEN_AQUI"
```

Se retornar JSON com dados, o token está válido.

### 📞 Suporte

Se o problema persistir após todas as verificações:

1. Verifique se há atualizações do navegador
2. Teste em outro navegador
3. Desative extensões do navegador (ad blockers podem bloquear Mapbox)
4. Verifique se o firewall/proxy não está bloqueando `api.mapbox.com`

### ✅ Checklist Final

- [ ] Token configurado no `.env`
- [ ] `mapbox-gl` instalado nas dependencies
- [ ] Servidor reiniciado após alterações
- [ ] Console do navegador sem erros
- [ ] MapView sendo usado no `App.tsx`
- [ ] Conexão com internet funcionando
- [ ] Token válido (começa com `pk.`)

Se todos os itens estão marcados e o mapa ainda não carrega, execute:
```bash
node check-mapbox.cjs
```
