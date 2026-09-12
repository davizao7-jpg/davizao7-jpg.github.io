/* ============================================================
   ADS.JS — Social Bar + Vignette Banner (Miner / Monetag)
   ------------------------------------------------------------
   Trocamos o sistema de "20 banners" por um único Vignette
   Banner, disparado UMA vez por transição real do jogador
   (o botão "Descer para a próxima camada"). Isso é o uso que
   a própria Monetag desenhou esse formato pra atender.

   NÃO EMPILHE VÁRIOS VIGNETTE NO MESMO CLIQUE. Vignette é um
   modal centralizado com overlay — dois ou mais na mesma hora
   (mesma zona ou zonas diferentes) significa impressão cobrada
   sem visualização real por trás, que é o padrão mais direto de
   tráfego inválido que existe. Por isso o motor abaixo só
   permite 1 por vez, respeitando também um intervalo mínimo
   entre disparos (mesmo que o jogador clique muito rápido).

   COMO EDITAR
   - Pra trocar de zona (testar outra configuração no painel da
     Monetag), troque só o "scriptHtml" do VIGNETTE abaixo.
   - "intervaloSegundos" é o tempo mínimo entre um disparo e
     outro, mesmo que o jogador clique mais rápido que isso.
   - "ativo: false" desliga sem apagar o código.
   ============================================================ */

(function () {

  // ---------------------------------------------------------
  // SOCIAL BAR — carrega uma vez, ao abrir a página
  // ---------------------------------------------------------
  const SOCIAL_BAR = {
    ativo: true,
    containerId: "social-bar-slot",
    scriptSrc: "",
    scriptHtml: `
      <!-- COLE AQUI O CÓDIGO DO SOCIAL BAR / IN-PAGE PUSH, SE FOR USAR -->
    `,
  };

  // ---------------------------------------------------------
  // VIGNETTE BANNER — dispara 1x por transição real do jogo
  // ---------------------------------------------------------
  const VIGNETTE = {
    ativo: true,
    // ⚠️ TEMPORÁRIO PRA TESTE — volte pra 20 (ou mais) antes de publicar
    // pra visitantes de verdade. Com 2s você vai ver o anúncio disparar
    // em quase todo clique, só pra confirmar que o script funciona.
    intervaloSegundos: 2,
    scriptHtml: `
      <script>(function(s){s.dataset.zone='11779950',s.src='https://n6wxm.com/vignette.min.js'})([document.documentElement, document.body].filter(Boolean).pop().appendChild(document.createElement('script')))</script>
    `,
  };

  /* =========================================================
     DAQUI PRA BAIXO É SÓ O MOTOR — não precisa mexer
     ========================================================= */

  function injetarScript(container, slot) {
    if (slot.scriptSrc && slot.scriptSrc.trim()) {
      const s = document.createElement("script");
      s.src = slot.scriptSrc.trim();
      s.async = true;
      container.appendChild(s);
      return;
    }
    if (slot.scriptHtml && slot.scriptHtml.trim()) {
      const temp = document.createElement("div");
      temp.innerHTML = slot.scriptHtml;
      const scripts = temp.querySelectorAll("script");
      scripts.forEach((oldScript) => {
        const newScript = document.createElement("script");
        for (const attr of oldScript.attributes) {
          newScript.setAttribute(attr.name, attr.value);
        }
        newScript.text = oldScript.textContent;
        container.appendChild(newScript);
      });
    }
  }

  function iniciarSocialBar() {
    if (!SOCIAL_BAR.ativo) return;
    const container = document.getElementById(SOCIAL_BAR.containerId);
    if (!container) return;
    injetarScript(container, SOCIAL_BAR);
  }

  let ultimoDisparoVignette = 0;

  function podeDispararVignette() {
    if (!VIGNETTE.ativo) return false;
    const minimo = VIGNETTE.intervaloSegundos || 0;
    if (minimo <= 0) return true;
    return Date.now() - ultimoDisparoVignette >= minimo * 1000;
  }

  // Chame isso quando o jogador fizer uma transição real (ex: descer de
  // camada). Dispara NO MÁXIMO 1 Vignette por chamada, respeitando o
  // intervalo mínimo configurado acima.
  window.dispararVignette = function () {
    if (!podeDispararVignette()) return;
    injetarScript(document.body, VIGNETTE);
    ultimoDisparoVignette = Date.now();
  };

  document.addEventListener("DOMContentLoaded", () => {
    iniciarSocialBar();
  });
})();
