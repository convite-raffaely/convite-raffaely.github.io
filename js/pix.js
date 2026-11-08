/* Gera o código "Pix copia e cola" (BR Code estático), com ou sem valor. */
(function (root) {
  "use strict";

  function campo(id, valor) {
    return id + String(valor.length).padStart(2, "0") + valor;
  }

  // CRC16-CCITT (polinômio 0x1021, valor inicial 0xFFFF), exigido pelo padrão Pix
  function crc16(str) {
    let crc = 0xffff;
    for (let i = 0; i < str.length; i++) {
      crc ^= str.charCodeAt(i) << 8;
      for (let b = 0; b < 8; b++) {
        crc = crc & 0x8000 ? (crc << 1) ^ 0x1021 : crc << 1;
        crc &= 0xffff;
      }
    }
    return crc.toString(16).toUpperCase().padStart(4, "0");
  }

  function semAcento(s) {
    return s.normalize("NFD").replace(/[̀-ͯ]/g, "");
  }

  function brCode({ chave, nome, cidade, valor, txid = "***" }) {
    let p =
      campo("00", "01") +
      campo("01", "11") +
      campo("26", campo("00", "br.gov.bcb.pix") + campo("01", chave)) +
      campo("52", "0000") +
      campo("53", "986");
    if (valor && valor > 0) p += campo("54", Number(valor).toFixed(2));
    p +=
      campo("58", "BR") +
      campo("59", semAcento(nome).slice(0, 25)) +
      campo("60", semAcento(cidade).slice(0, 15)) +
      campo("62", campo("05", txid)) +
      "6304";
    return p + crc16(p);
  }

  root.Pix = { brCode, crc16 };
  if (typeof module !== "undefined") module.exports = root.Pix;
})(typeof window !== "undefined" ? window : globalThis);
