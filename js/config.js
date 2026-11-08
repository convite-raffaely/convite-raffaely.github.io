/* =========================================================
   CONFIGURAÇÃO DO SITE — edite só este arquivo
   ========================================================= */
window.CONFIG = {
  nome: "Raffaely",

  // Data e hora da festa (formato: AAAA-MM-DDTHH:MM:SS-03:00)
  dataISO: "2026-12-12T20:00:00-03:00",
  dataTexto: "Sábado, 12 de dezembro de 2026",
  horario: "20h00",

  // Local
  local: "Nome do salão de festas",
  endereco: "Rua Exemplo, 123 — Bairro — Cotia/SP",
  mapsUrl: "", // cole aqui o link do Google Maps (opcional)

  traje: "Esporte fino",
  confirmarAte: "30 de novembro",

  // Foto da aniversariante (opcional). Ex.: "assets/rafaelly.jpg"
  foto: "",

  // Link do Google Apps Script (veja o README.md).
  // Enquanto estiver vazio, o site funciona em "modo demonstração":
  // as respostas ficam salvas só no navegador de quem testou.
  apiUrl: "",

  pix: {
    chave: "561.013.588-52",
    chaveCopia: "56101358852",
    titular: "Raffaely Otremba Sousa",
    banco: "Banco Inter",
    copiaECola:
      "00020101021126330014br.gov.bcb.pix0111561013588525204000053039865802BR5916RAFFAELY O SOUSA6005COTIA62070503***63041B76",
    qr: "assets/pix-qr.png",
  },

  // Lista de presentes — troque pelos itens que ela quer.
  // "id" precisa ser único e não deve mudar depois que o site estiver no ar.
  presentes: [
    { id: "perfume", nome: "Perfume", detalhe: "Floral ou frutado", emoji: "🌸", link: "" },
    { id: "maquiagem", nome: "Kit de maquiagem", detalhe: "Paleta de sombras + gloss", emoji: "💄", link: "" },
    { id: "skincare", nome: "Kit skincare", detalhe: "Hidratante, sérum e protetor", emoji: "🧴", link: "" },
    { id: "fone", nome: "Fone bluetooth", detalhe: "Cor rosa ou branca", emoji: "🎧", link: "" },
    { id: "bolsa", nome: "Bolsa", detalhe: "Transversal pequena", emoji: "👜", link: "" },
    { id: "colar", nome: "Colar delicado", detalhe: "Prata ou dourado", emoji: "📿", link: "" },
    { id: "livro", nome: "Livros", detalhe: "Romance ou fantasia", emoji: "📚", link: "" },
    { id: "secador", nome: "Secador / chapinha", detalhe: "Bivolt", emoji: "✨", link: "" },
  ],
};
