# 🐛 Correção: Erro "Style is not done loading" no Mapbox

## Problema Original

```
Uncaught Error: Style is not done loading
    at To._checkLoaded (mapbox-gl.js:23436:38)
    at To.addSource (mapbox-gl.js:23627:22)
```

## Causa Raiz

O código estava tentando adicionar **sources** e **layers** ao mapa **antes** do estilo do mapa (`mapbox://styles/mapbox/satellite-streets-v12`) terminar de carregar completamente.

### Fluxo com problema ❌:
```
1. Map inicializa
2. Event 'load' dispara → setMapLoaded(true)
3. useEffect dos talhões dispara
4. Tenta adicionar source/layer IMEDIATAMENTE
5. ❌ ERRO: Estilo ainda está carregando (assíncrono)
```

## Solução Implementada ✅

Adicionada verificação com `map.isStyleLoaded()` e listener para o evento `style.load`:

```typescript
// Adiciona os talhões ao mapa
useEffect(() => {
  if (!map.current || !mapLoaded || talhoes.length === 0) return;

  const addTalhoesLayers = () => {
    // ✅ Verifica se o estilo está REALMENTE carregado
    if (!map.current || !map.current.isStyleLoaded()) {
      console.warn('⚠️ Estilo do mapa ainda não carregado, aguardando...');
      return;
    }

    try {
      // Adiciona sources e layers...
      map.current.addSource('talhoes', {...});
      map.current.addLayer({...});
      // ...
    } catch (err) {
      console.error('❌ Erro:', err);
      setError(`Erro: ${err.message}`);
    }
  };

  // ✅ Verifica ANTES de adicionar
  if (map.current.isStyleLoaded()) {
    addTalhoesLayers();
  } else {
    // ✅ Aguarda o estilo carregar completamente
    map.current.once('style.load', addTalhoesLayers);
  }
}, [mapLoaded, talhoes, onTalhaoClick]);
```

### Fluxo corrigido ✅:
```
1. Map inicializa
2. Event 'load' dispara → setMapLoaded(true)
3. useEffect dos talhões dispara
4. ✅ VERIFICA: isStyleLoaded()?
   - Se SIM → adiciona imediatamente
   - Se NÃO → aguarda evento 'style.load'
5. ✅ Source/layer adicionados após estilo carregar
```

## Melhorias Adicionadas

### 1. **Tratamento de Erros com Try-Catch**
```typescript
try {
  // Operações do mapa
} catch (err) {
  console.error('❌ Erro:', err);
  setError(`Erro: ${err.message}`);
}
```

### 2. **Mensagens de Debug no Console**
```typescript
console.log('✅ Talhões adicionados ao mapa com sucesso');
console.warn('⚠️ Estilo do mapa ainda não carregado');
```

### 3. **Verificação de Layers Existentes**
```typescript
// Remove layers existentes ANTES de adicionar novos
if (map.current.getSource('talhoes')) {
  if (map.current.getLayer('talhoes-fill')) {
    map.current.removeLayer('talhoes-fill');
  }
  if (map.current.getLayer('talhoes-outline')) {
    map.current.removeLayer('talhoes-outline');
  }
  map.current.removeSource('talhoes');
}
```

### 4. **Type Safety para Callbacks**
```typescript
talhoes.forEach((talhao: Talhao) => {
  // ...
});

talhoes.find((t: Talhao) => t.properties.id === feature.properties?.id);
```

## Como Testar

1. **Abra o DevTools (F12) → Console**
2. **Recarregue a página** (Ctrl+R / Cmd+R)
3. **Verifique as mensagens**:
   - ✅ `✅ Talhões adicionados ao mapa com sucesso` → Funcionou!
   - ⚠️ `⚠️ Estilo do mapa ainda não carregado` → Aguardando...
   - ❌ Erros → Consulte [MAPBOX_TROUBLESHOOTING.md](./MAPBOX_TROUBLESHOOTING.md)

## Eventos do Mapbox Relacionados

| Evento | Quando dispara | Uso |
|--------|---------------|-----|
| `load` | Mapa inicializado e pronto para uso | Controles, configurações gerais |
| `style.load` | Estilo (tiles, camadas base) carregado completamente | ✅ Adicionar sources/layers |
| `sourcedata` | Dados de uma source carregados | Monitorar carregamento de dados |
| `render` | Frame renderizado | Animações |

## Referências

- [Mapbox GL JS - Map Events](https://docs.mapbox.com/mapbox-gl-js/api/map/#map-events)
- [Mapbox GL JS - isStyleLoaded()](https://docs.mapbox.com/mapbox-gl-js/api/map/#map#isstyleloaded)
- [Error Handling in React](https://react.dev/reference/react/Component#catching-rendering-errors-with-an-error-boundary)

## Commit Message Sugerido

```
fix(MapLayout): aguardar estilo carregar antes de adicionar layers

- Adiciona verificação com isStyleLoaded()
- Usa evento 'style.load' para aguardar carregamento completo
- Adiciona try-catch para tratamento de erros
- Melhora mensagens de debug no console
- Fix: "Style is not done loading" error

Closes #issue-number
```
