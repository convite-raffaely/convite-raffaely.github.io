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
  // Fotos: Unsplash (licença gratuita), em assets/presentes/.
  // "valor" em reais (use ponto para centavos, ex.: 79.90).
  presentes: [
    {
      categoria: "Acessórios e beleza",
      itens: [
        { nome: "Colar com pingente", valor: 120, imagem: "assets/presentes/colar.webp" },
        { nome: "Pulseira", valor: 90, imagem: "assets/presentes/pulseira.webp" },
        { nome: "Brincos", valor: 70, imagem: "assets/presentes/brincos.webp" },
        { nome: "Relógio feminino", valor: 200, imagem: "assets/presentes/relogio.webp" },
        { nome: "Bolsa de festa", valor: 150, imagem: "assets/presentes/bolsa-festa.webp" },
        { nome: "Perfume", valor: 180, imagem: "assets/presentes/perfume.webp" },
        { nome: "Kit de maquiagem", valor: 150, imagem: "assets/presentes/maquiagem.webp" },
        { nome: "Necessaire", valor: 60, imagem: "assets/presentes/necessaire.webp" },
        { nome: "Óculos de sol", valor: 120, imagem: "assets/presentes/oculos.webp" },
      ],
    },
    {
      categoria: "Roupas e calçados",
      itens: [
        { nome: "Tênis casual", valor: 250, imagem: "assets/presentes/tenis.webp" },
        { nome: "Sandália", valor: 120, imagem: "assets/presentes/sandalia.webp" },
        { nome: "Bolsa feminina", valor: 180, imagem: "assets/presentes/bolsa.webp" },
        { nome: "Vestido", valor: 200, imagem: "assets/presentes/vestido.webp" },
        { nome: "Conjunto de roupas", valor: 150, imagem: "assets/presentes/conjunto.webp" },
        { nome: "Pijama bonito", valor: 90, imagem: "assets/presentes/pijama.webp" },
        { nome: "Jaqueta", valor: 200, imagem: "assets/presentes/jaqueta.webp" },
        { nome: "Carteira", valor: 80, imagem: "assets/presentes/carteira.webp" },
      ],
    },
  ],
};
