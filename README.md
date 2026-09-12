# Miner

Jogo simples de mineração: clique nos blocos pra escavar, ganhe ouro, desça de camada e compre equipamentos (picareta, carrinho automático, dinamite) pra minerar mais rápido. O progresso salva sozinho no navegador (localStorage).

## Arquivos

- `index.html` — estrutura da página do jogo (obrigatório)
- `style.css` — visual do jogo
- `game.js` — lógica do jogo
- `ads.js` — controle do Social Bar + OnClick/Popunder (veja os comentários dentro do arquivo)
- `ads-test.html` — página separada só pra testar o Popunder + o Social Bar sem precisar jogar

Só o `index.html` é obrigatório pra funcionar no GitHub Pages — mas ele já está referenciando os outros dois (`style.css`, `game.js`) e também `ads.js`, então **suba pelo menos esses 4 juntos, na mesma pasta, sem renomear nenhum**. O `ads-test.html` é opcional (só serve pra você testar); pode subir junto ou deixar de fora depois que terminar os testes.

## Publicar no GitHub Pages

1. Crie um repositório (ou use um que já exista) e suba esses arquivos na raiz dele.
2. No repositório: `Settings` → `Pages` → em "Source" escolha a branch (geralmente `main`) e a pasta `/ (root)`.
3. Salve. Em alguns minutos o GitHub te dá o link (algo como `https://seu-usuario.github.io/nome-do-repo/`).

Não precisa de build, servidor ou configuração extra — é tudo HTML/CSS/JS estático, então funciona direto no GitHub Pages.

## Editando o anúncio (`ads.js`)

Agora é OnClick/Popunder (Monetag), disparado sem cooldown a cada clique em "Descer para a próxima camada". Ele abre uma aba nova por trás da aba atual — não cobre a tela do jogo nem redireciona o jogador na hora do clique.

Pra trocar de zona (testar outra configuração), substitua o conteúdo de `scriptHtml` do `ONCLICK` pelo novo código.

Pra testar sem jogar, abra o `ads-test.html` e use o botão "simular troca de terreno".
