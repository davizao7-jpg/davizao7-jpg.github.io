/* ============================================================
   ADS.JS — Vignette Banner (Monetag) — Miner
   ------------------------------------------------------------
   Versão simplificada: só 1 Vignette Banner, disparado quando
   o jogador clica em "Descer para a próxima camada" (ação real
   de transição no jogo — é literalmente pra isso que a Monetag
   desenhou esse formato).

   Por que só 1: o Vignette é um anúncio modal (centralizado,
   com uma camada cinza cobrindo a tela) — não existe "posição"
   diferente pra ele, e disparar mais de um da mesma zona no
   mesmo clique conta como impressão duplicada sem visualização
   real por trás, o que é o padrão mais comum de banimento por
   tráfego inválido. Então: 1 disparo por transição, sempre.

   COMO EDITAR (no Acode)
   - "ativo": true/false pra ligar/desligar sem apagar o código.
   - "intervaloSegundos": intervalo mínimo entre disparos, mesmo
     que o jogador clique o botão várias vezes seguidas rápido.
   - "scriptHtml": cole aqui o código que o Monetag te deu pra
     essa zona (o <script>...</script> inteiro).
   - Se um dia você quiser testar OUTRA zona, troque o conteúdo
     de "scriptHtml" por essa nova zona — não crie um segundo
     objeto pra rodar junto do primeiro.
   ============================================================ */

(function () {

  const VIGNETTE = {
    ativo: true,
    intervaloSegundos: 1,
    scriptHtml: `
      <script>(function(s){s.dataset.zone='11779950',s.src='https://n6wxm.com/vignette.min.js'})([document.documentElement, document.body].filter(Boolean).pop().appendChild(document.createElement('script')))</script>
    `,
  };

  /* =========================================================
     DAQUI PRA BAIXO É SÓ O MOTOR — não precisa mexer
     ========================================================= */

  let ultimoDisparo = 0;

  function podeDisparar() {
    const minimo = VIGNETTE.intervaloSegundos || 0;
    if (minimo <= 0) return true;
    return Date.now() - ultimoDisparo >= minimo * 1000;
  }

  function injetarScript(html) {
    const temp = document.createElement("div");
    temp.innerHTML = html;
    temp.querySelectorAll("script").forEach((oldScript) => {
      const newScript = document.createElement("script");
      for (const attr of oldScript.attributes) {
        newScript.setAttribute(attr.name, attr.value);
      }
      newScript.text = oldScript.textContent;
      document.body.appendChild(newScript);
    });
  }

  // Chame essa função quando o jogador fizer uma ação real de transição
  // (ex: descer de camada no Miner). Só dispara se estiver ativo e o
  // intervalo mínimo já tiver passado desde o último disparo real.
  window.recarregarAnuncios = function () {
    if (!VIGNETTE.ativo) return;
    if (!podeDisparar()) return;
    injetarScript(VIGNETTE.scriptHtml);
    ultimoDisparo = Date.now();
  };
})();
