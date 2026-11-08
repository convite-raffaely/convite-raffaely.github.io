/**
 * Backend do site dos 15 anos — Google Apps Script ligado a uma Planilha Google.
 * Veja o README.md para o passo a passo de instalação.
 *
 * Abas criadas na planilha:
 *  - Confirmações : quem vai / não vai
 *  - Recados      : mural de recados (escreva qualquer coisa na coluna "Ocultar" para esconder um recado)
 */

const ABA_RSVP = "Confirmações";
const ABA_RECADOS = "Recados";

const CABECALHOS = {
  [ABA_RSVP]: ["Data", "Nome", "Vai?", "Pessoas", "Telefone", "Observação"],
  [ABA_RECADOS]: ["Data", "Nome", "Recado", "Ocultar"],
};

/** Rode esta função uma vez pelo editor para criar as abas. */
function setup() {
  Object.keys(CABECALHOS).forEach(aba);
}

function aba(nome) {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let sh = ss.getSheetByName(nome);
  if (!sh) {
    sh = ss.insertSheet(nome);
    sh.appendRow(CABECALHOS[nome]);
    sh.setFrozenRows(1);
    sh.getRange(1, 1, 1, CABECALHOS[nome].length).setFontWeight("bold");
  }
  return sh;
}

function linhas(sh) {
  const n = sh.getLastRow();
  if (n < 2) return [];
  return sh.getRange(2, 1, n - 1, sh.getLastColumn()).getValues();
}

function json(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(ContentService.MimeType.JSON);
}

/** Limpa texto e evita que a planilha interprete como fórmula. */
function limpo(v, max) {
  let s = String(v == null ? "" : v).trim().slice(0, max);
  if (/^[=+\-@]/.test(s)) s = "'" + s;
  return s;
}

function doGet() {
  try {
    const recados = linhas(aba(ABA_RECADOS))
      .filter((r) => r[2] && !String(r[3]).trim())
      .map((r) => ({
        data: r[0] instanceof Date ? r[0].toISOString() : String(r[0]),
        nome: String(r[1]),
        recado: String(r[2]),
      }))
      .reverse()
      .slice(0, 300);

    return json({ ok: true, messages: recados });
  } catch (err) {
    return json({ ok: false, error: String(err) });
  }
}

function doPost(e) {
  const lock = LockService.getScriptLock();
  try {
    lock.waitLock(15000);
    const d = JSON.parse(e.postData.contents);
    const agora = new Date();

    if (d.action === "rsvp") {
      if (!d.nome) return json({ ok: false, error: "nome" });
      aba(ABA_RSVP).appendRow([
        agora,
        limpo(d.nome, 80),
        d.presenca === "Não" ? "Não" : "Sim",
        Math.max(0, Math.min(20, Number(d.pessoas) || 0)),
        limpo(d.telefone, 20),
        limpo(d.obs, 300),
      ]);
      return json({ ok: true });
    }

    if (d.action === "message") {
      if (!d.nome || !d.recado) return json({ ok: false, error: "dados" });
      aba(ABA_RECADOS).appendRow([agora, limpo(d.nome, 60), limpo(d.recado, 600), ""]);
      return json({ ok: true });
    }

    return json({ ok: false, error: "acao" });
  } catch (err) {
    return json({ ok: false, error: String(err) });
  } finally {
    lock.releaseLock();
  }
}
