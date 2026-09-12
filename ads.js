/* ============================================================
   ADS.JS — Social Bar + Banners (Miner)
   ------------------------------------------------------------
   Essa versão substitui a anterior (que era baseada em
   popunder e ficava esperando clique). Se você ainda quiser
   usar popunder TAMBÉM, me avisa que eu mesclo os dois no
   mesmo arquivo — por enquanto ficou só Social Bar + Banner.

   O QUE TEM AQUI
   - 1 espaço de Social Bar (a maioria das redes só permite uma
     por página, então não faz sentido ter vários).
   - 20 espaços de Banner, cada um com seu próprio contêiner na
     tela — cole um script de rede diferente (ou zona
     diferente) em cada um pra testar qual performa melhor.

   AVISO SOBRE O "intervaloSegundos" DO BANNER
   Esse número NÃO é mais um timer automático — ele virou um
   intervalo MÍNIMO entre recargas disparadas por uma AÇÃO REAL
   do jogador (o botão "Descer para a próxima camada" no
   game.js chama recarregarBanners() quando clicado). Isso é
   bem diferente de recarregar sozinho sem ninguém fazer nada:
   é o mesmo princípio de um anúncio trocar quando o visitante
   navega pra outra página — as redes aceitam isso numa boa.
   O intervaloSegundos aqui só existe pra evitar que, se o
   jogador ficar clicando o botão muito rápido em sequência,
   isso vire sem querer um "clique só pra gerar impressão"
   disfarçado — ele barra recargas antes do tempo mínimo
   passar, mesmo que o botão seja clicado de novo.
   ============================================================ */

(function () {

  // ---------------------------------------------------------
  // SOCIAL BAR — só um espaço
  // ---------------------------------------------------------
  const SOCIAL_BAR = {
    ativo: true,
    containerId: "social-bar-slot",
    scriptSrc: "",
    scriptHtml: `
      <!-- COLE AQUI O CÓDIGO COMPLETO DO SOCIAL BAR -->
    `,
  };

  // ---------------------------------------------------------
  // BANNERS — 20 espaços, cada um independente
  // Edite "ativo" (true/false), "intervaloSegundos" (0 = sem
  // refresh automático) e cole o script de cada um em
  // "scriptHtml" (ou só a URL em "scriptSrc").
  // ---------------------------------------------------------
  const BANNER_SLOTS = [
    // Banner 1
    { nome: "Banner 1", containerId: "banner-slot-1", ativo: true, intervaloSegundos: 20, scriptSrc: "", scriptHtml: `<!-- COLE AQUI O CÓDIGO DO BANNER 1 -->` },
    // Banner 2
    { nome: "Banner 2", containerId: "banner-slot-2", ativo: true, intervaloSegundos: 20, scriptSrc: "", scriptHtml: `<!-- COLE AQUI O CÓDIGO DO BANNER 2 -->` },
    // Banner 3
    { nome: "Banner 3", containerId: "banner-slot-3", ativo: true, intervaloSegundos: 20, scriptSrc: "", scriptHtml: `<!-- COLE AQUI O CÓDIGO DO BANNER 3 -->` },
    // Banner 4
    { nome: "Banner 4", containerId: "banner-slot-4", ativo: true, intervaloSegundos: 20, scriptSrc: "", scriptHtml: `<!-- COLE AQUI O CÓDIGO DO BANNER 4 -->` },
    // Banner 5
    { nome: "Banner 5", containerId: "banner-slot-5", ativo: true, intervaloSegundos: 20, scriptSrc: "", scriptHtml: `<!-- COLE AQUI O CÓDIGO DO BANNER 5 -->` },
    // Banner 6
    { nome: "Banner 6", containerId: "banner-slot-6", ativo: true, intervaloSegundos: 20, scriptSrc: "", scriptHtml: `<!-- COLE AQUI O CÓDIGO DO BANNER 6 -->` },
    // Banner 7
    { nome: "Banner 7", containerId: "banner-slot-7", ativo: true, intervaloSegundos: 20, scriptSrc: "", scriptHtml: `<!-- COLE AQUI O CÓDIGO DO BANNER 7 -->` },
    // Banner 8
    { nome: "Banner 8", containerId: "banner-slot-8", ativo: true, intervaloSegundos: 20, scriptSrc: "", scriptHtml: `<!-- COLE AQUI O CÓDIGO DO BANNER 8 -->` },
    // Banner 9
    { nome: "Banner 9", containerId: "banner-slot-9", ativo: true, intervaloSegundos: 20, scriptSrc: "", scriptHtml: `<!-- COLE AQUI O CÓDIGO DO BANNER 9 -->` },
    // Banner 10
    { nome: "Banner 10", containerId: "banner-slot-10", ativo: true, intervaloSegundos: 20, scriptSrc: "", scriptHtml: `<!-- COLE AQUI O CÓDIGO DO BANNER 10 -->` },
    // Banner 11
    { nome: "Banner 11", containerId: "banner-slot-11", ativo: true, intervaloSegundos: 20, scriptSrc: "", scriptHtml: `<!-- COLE AQUI O CÓDIGO DO BANNER 11 -->` },
    // Banner 12
    { nome: "Banner 12", containerId: "banner-slot-12", ativo: true, intervaloSegundos: 20, scriptSrc: "", scriptHtml: `<!-- COLE AQUI O CÓDIGO DO BANNER 12 -->` },
    // Banner 13
    { nome: "Banner 13", containerId: "banner-slot-13", ativo: true, intervaloSegundos: 20, scriptSrc: "", scriptHtml: `<!-- COLE AQUI O CÓDIGO DO BANNER 13 -->` },
    // Banner 14
    { nome: "Banner 14", containerId: "banner-slot-14", ativo: true, intervaloSegundos: 20, scriptSrc: "", scriptHtml: `<!-- COLE AQUI O CÓDIGO DO BANNER 14 -->` },
    // Banner 15
    { nome: "Banner 15", containerId: "banner-slot-15", ativo: true, intervaloSegundos: 20, scriptSrc: "", scriptHtml: `<!-- COLE AQUI O CÓDIGO DO BANNER 15 -->` },
    // Banner 16
    { nome: "Banner 16", containerId: "banner-slot-16", ativo: true, intervaloSegundos: 20, scriptSrc: "", scriptHtml: `<!-- COLE AQUI O CÓDIGO DO BANNER 16 -->` },
    // Banner 17
    { nome: "Banner 17", containerId: "banner-slot-17", ativo: true, intervaloSegundos: 20, scriptSrc: "", scriptHtml: `<!-- COLE AQUI O CÓDIGO DO BANNER 17 -->` },
    // Banner 18
    { nome: "Banner 18", containerId: "banner-slot-18", ativo: true, intervaloSegundos: 20, scriptSrc: "", scriptHtml: `<!-- COLE AQUI O CÓDIGO DO BANNER 18 -->` },
    // Banner 19
    { nome: "Banner 19", containerId: "banner-slot-19", ativo: true, intervaloSegundos: 20, scriptSrc: "", scriptHtml: `<!-- COLE AQUI O CÓDIGO DO BANNER 19 -->` },
    // Banner 20
    { nome: "Banner 20", containerId: "banner-slot-20", ativo: true, intervaloSegundos: 20, scriptSrc: "", scriptHtml: `<!-- COLE AQUI O CÓDIGO DO BANNER 20 -->` },
  ];

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
      // move elementos que não são <script> (ex: <div> de anúncio) também
      Array.from(temp.childNodes).forEach((node) => {
        if (node.tagName === "SCRIPT") {
          const newScript = document.createElement("script");
          for (const attr of node.attributes) {
            newScript.setAttribute(attr.name, attr.value);
          }
          newScript.text = node.textContent;
          container.appendChild(newScript);
        } else {
          container.appendChild(node.cloneNode(true));
        }
      });
    }
  }

  function iniciarSocialBar() {
    if (!SOCIAL_BAR.ativo) return;
    const container = document.getElementById(SOCIAL_BAR.containerId);
    if (!container) return;
    injetarScript(container, SOCIAL_BAR);
  }

  // guarda em memória (só dura enquanto a página está aberta) quando
  // cada slot recarregou pela última vez, pra respeitar o intervaloSegundos
  const ultimoCarregamento = {};

  function podeRecarregar(slot) {
    const minimo = slot.intervaloSegundos || 0;
    if (minimo <= 0) return true; // sem intervalo mínimo configurado
    const ultima = ultimoCarregamento[slot.containerId] || 0;
    return Date.now() - ultima >= minimo * 1000;
  }

  function carregarBanner(slot) {
    const container = document.getElementById(slot.containerId);
    if (!container || !slot.ativo) return;
    container.innerHTML = "";
    injetarScript(container, slot);
    ultimoCarregamento[slot.containerId] = Date.now();
  }

  function iniciarBanner(slot) {
    carregarBanner(slot); // primeira carga, ao abrir a página
  }

  // Chame essa função quando o jogador fizer uma ação real que muda o
  // "cenário" (ex: descer de camada no Miner). Só recarrega os banners
  // ativos cujo intervaloSegundos mínimo já passou desde a última troca.
  window.recarregarBanners = function () {
    BANNER_SLOTS.forEach((slot) => {
      if (slot.ativo && podeRecarregar(slot)) {
        carregarBanner(slot);
      }
    });
  };

  document.addEventListener("DOMContentLoaded", () => {
    iniciarSocialBar();
    BANNER_SLOTS.forEach(iniciarBanner);
  });
})();
