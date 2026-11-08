/* =========================================================
   CONFIGURAÇÃO DO SITE — edite só este arquivo
   ========================================================= */
window.CONFIG = {
  nome: "Raffaely",

  // Data e hora da festa (formato: AAAA-MM-DDTHH:MM:SS-03:00)
  dataISO: "2027-01-09T16:30:00-03:00",
  dataTexto: "Sábado, 9 de janeiro de 2027",
  horario: "16h30",

  // Local
  local: "Mansão Copacabana",
  endereco: "Estr. Fernando Nobre, 710 — Parque Rincão, Cotia/SP — 06705-490",
  mapsUrl: "https://maps.app.goo.gl/JuWpnW15Sf1jWWSZ9",
  mapaBusca: "Mansão Copacabana, Estr. Fernando Nobre, 710 - Parque Rincão, Cotia - SP, 06705-490",

  traje: "Fino",
  tema: "Cinderela",
  confirmarAte: "2 de janeiro de 2027",

  // Fotos
  foto: "assets/raffaely-retrato.webp",
  galeria: [
    "assets/raffaely-1.webp",
    "assets/raffaely-2.webp",
    "assets/raffaely-3.webp",
  ],

  // Link do Google Apps Script (veja o README.md).
  // Enquanto estiver vazio, o site funciona em "modo demonstração":
  // as respostas ficam salvas só no navegador de quem testou.
  apiUrl: "https://script.google.com/macros/s/AKfycbwp0av5-8xbA9PeM6apyAdeKaAofN60vyuxKJL1uWoHvhYxrGIImrEc6p_V_fi9UXQerg/exec",

  pix: {
    chave: "561.013.588-52",
    chaveCopia: "56101358852",
    titular: "Raffaely Otremba Sousa",
    banco: "Banco Inter",
    // Dados usados para gerar o QR Code com valor (não mude)
    nomeRecebedor: "RAFFAELY O SOUSA",
    cidade: "COTIA",
    copiaECola:
      "00020101021126330014br.gov.bcb.pix0111561013588525204000053039865802BR5916RAFFAELY O SOUSA6005COTIA62070503***63041B76",
    qr: "assets/pix-qr.png",
  },

  // Sugestões de presente — cada uma abre o Pix já com o valor de referência.
  // "valor" em reais (use ponto para centavos, ex.: 79.90).
  presentes: [
    {
      categoria: "Acessórios e beleza",
      itens: [
        { nome: "Colar com pingente", valor: 120, emoji: "📿" },
        { nome: "Pulseira", valor: 90, emoji: "💫" },
        { nome: "Brincos", valor: 70, emoji: "💎" },
        { nome: "Relógio feminino", valor: 200, emoji: "⌚" },
        { nome: "Bolsa de festa", valor: 150, emoji: "👛" },
        { nome: "Perfume", valor: 180, emoji: "🌸" },
        { nome: "Kit de maquiagem", valor: 150, emoji: "💄" },
        { nome: "Necessaire", valor: 60, emoji: "🧴" },
        { nome: "Óculos de sol", valor: 120, emoji: "🕶️" },
      ],
    },
    {
      categoria: "Roupas e calçados",
      itens: [
        { nome: "Tênis casual", valor: 250, emoji: "👟" },
        { nome: "Sandália", valor: 120, emoji: "👡" },
        { nome: "Bolsa feminina", valor: 180, emoji: "👜" },
        { nome: "Vestido", valor: 200, emoji: "👗" },
        { nome: "Conjunto de roupas", valor: 150, emoji: "👚" },
        { nome: "Pijama bonito", valor: 90, emoji: "🌙" },
        { nome: "Jaqueta", valor: 200, emoji: "🧥" },
        { nome: "Carteira", valor: 80, emoji: "💳" },
      ],
    },
  ],
};
