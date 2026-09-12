/* ============================================================
   ADS.JS — Social Bar + OnClick/Popunder (Miner / Monetag)
   ------------------------------------------------------------
   Trocamos o Vignette pelo OnClick (Popunder). Esse formato é
   diferente do Vignette: ele É feito pra disparar por ação do
   usuário, então bater no "próxima camada" abrindo o anúncio
   na hora é exatamente o uso pretendido — sem gambiarra.

   COMPORTAMENTO ATUAL: sem cooldown, cada clique em "próxima
   camada" dispara o script de novo. Isso é o que foi pedido.
   Vale saber: scripts de Popunder desse tipo geralmente já têm
   frequência própria controlada do lado da rede (ex: não abrir
   mais de uma aba nova por período de tempo pro mesmo
   visitante), então na prática o comportamento visível pro
   jogador pode não ser "uma aba nova a cada clique" mesmo sem
   cooldown nosso — quem decide isso por último é o script da
   Monetag, não o nosso código.

   COMO EDITAR
   - Pra trocar a zona, troque o "scriptHtml" do ONCLICK abaixo.
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
  // ONCLICK / POPUNDER — dispara a cada clique em "próxima camada"
  // ---------------------------------------------------------
  const ONCLICK = {
    ativo: true,
    scriptHtml: `
      <script>(function(s){s.dataset.zone='11784531',s.src='https://al5sm.com/tag.min.js'})([document.documentElement, document.body].filter(Boolean).pop().appendChild(document.createElement('script')))</script>
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

  // Chame isso a cada clique em "próxima camada". Sem cooldown — dispara
  // toda vez que for chamada, contanto que ONCLICK.ativo seja true.
  window.dispararPopunder = function () {
    if (!ONCLICK.ativo) return;
    injetarScript(document.body, ONCLICK);
  };

  document.addEventListener("DOMContentLoaded", () => {
    iniciarSocialBar();
  });
})();
