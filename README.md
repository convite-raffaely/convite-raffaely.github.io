# Site dos 15 anos da Raffaely 👑

Site de uma página com:

- **Informações da festa** e contagem regressiva
- **Confirmação de presença**
- **Presentes via Pix**: QR Code e chave para qualquer valor, e uma lista de sugestões com valor de referência — cada item abre um QR Code Pix já com o valor
- **Galeria** com fotos da aniversariante e **mapa** do local
- **Mural de recados** para a aniversariante

As respostas vão para uma **Planilha Google**, que a família pode abrir para ver quem confirmou presença e os recados.

## 1. Editar as informações

Tudo o que muda fica em [`js/config.js`](js/config.js): data, horário, local, link do mapa, traje, prazo para confirmar, foto e lista de presentes.

Para usar uma foto, coloque o arquivo na pasta `assets/` e coloque o caminho em `foto` (retrato do topo) ou em `galeria`.

Os valores das sugestões de presente ficam em `presentes` → `valor`.

## 2. Ligar a Planilha Google (confirmações e recados)

Sem este passo o site funciona em **modo demonstração** (aparece uma faixa amarela no topo e as respostas ficam salvas só no navegador de quem testou).

1. Crie uma planilha nova em <https://sheets.new> (ex.: "15 anos Raffaely").
2. No menu, vá em **Extensões → Apps Script**.
3. Apague o código que aparece e cole todo o conteúdo de [`apps-script/Code.gs`](apps-script/Code.gs). Salve (💾).
4. No seletor de funções no topo, escolha **`setup`** e clique em **Executar**. Autorize com sua conta Google (em "O Google não verificou este app", clique em *Avançado → Acessar*). As abas *Confirmações* e *Recados* aparecem na planilha.
5. Clique em **Implantar → Nova implantação** → ícone de engrenagem → **App da Web**:
   - *Executar como*: **Eu**
   - *Quem pode acessar*: **Qualquer pessoa**
6. Clique em **Implantar** e copie a **URL do app da Web** (termina em `/exec`).
7. Cole essa URL em `apiUrl` no `js/config.js`.

> Se mudar o `Code.gs` depois, use **Implantar → Gerenciar implantações → Editar → Nova versão** para manter a mesma URL.

### Administrar pela planilha

- **Esconder um recado**: escreva qualquer coisa (ex.: `x`) na coluna *Ocultar*.
- **Total de convidados**: na aba *Confirmações*, some a coluna *Pessoas* das linhas com *Sim*.

## 3. Publicar no GitHub Pages (grátis)

1. Envie esta pasta para um repositório no GitHub (pode ser pelo GitHub Desktop).
2. No repositório: **Settings → Pages → Build and deployment → Source: Deploy from a branch**, branch `main`, pasta `/ (root)`. Salve.
3. Em 1–2 minutos o site fica em `https://SEU-USUARIO.github.io/NOME-DO-REPOSITORIO/`.

## Testar no computador

Abra o `index.html` no navegador, ou rode na pasta:

```bash
npx serve .
```

## Créditos das imagens

- Fotos das sugestões de presente: [Unsplash](https://unsplash.com) (licença Unsplash, uso gratuito), em `assets/presentes/`.
- Ícones: [Phosphor Icons](https://phosphoricons.com) (licença MIT), em `assets/icons/`.
