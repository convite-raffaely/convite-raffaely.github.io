(function () {
  "use strict";

  const C = window.CONFIG;
  const DEMO = !C.apiUrl;
  const $ = (sel, root = document) => root.querySelector(sel);

  /* ---------------- Preenche textos da configuração ---------------- */
  document.querySelectorAll("[data-cfg]").forEach((el) => {
    const v = C[el.dataset.cfg];
    if (v) el.textContent = v;
  });
  if (C.mapsUrl) {
    const a = $("#maps-link");
    a.href = C.mapsUrl;
    a.hidden = false;
  }
  if (C.foto) {
    const img = $("#hero-foto");
    img.src = C.foto;
    img.alt = C.nome;
    img.hidden = false;
  }
  if (DEMO) $("#demo-banner").hidden = false;

  /* ---------------- Contagem regressiva ---------------- */
  const target = new Date(C.dataISO).getTime();
  const pad = (n) => String(n).padStart(2, "0");
  function tick() {
    const diff = target - Date.now();
    if (isNaN(diff)) return;
    if (diff <= 0) {
      $("#countdown").hidden = true;
      const done = $("#countdown-done");
      done.hidden = false;
      const umDiaDepois = diff < -24 * 3600 * 1000;
      done.textContent = umDiaDepois ? "Obrigada por celebrar comigo! 💖" : "Hoje é o grande dia! ✨";
      return;
    }
    const s = Math.floor(diff / 1000);
    $("#cd-dias").textContent = Math.floor(s / 86400);
    $("#cd-horas").textContent = pad(Math.floor((s % 86400) / 3600));
    $("#cd-min").textContent = pad(Math.floor((s % 3600) / 60));
    $("#cd-seg").textContent = pad(s % 60);
    setTimeout(tick, 1000);
  }
  tick();

  /* ---------------- Toast ---------------- */
  let toastTimer;
  function toast(text) {
    let t = $(".toast");
    if (!t) {
      t = document.createElement("div");
      t.className = "toast";
      document.body.appendChild(t);
    }
    t.textContent = text;
    t.classList.add("show");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => t.classList.remove("show"), 2400);
  }

  /* ---------------- API (Google Apps Script) ou modo demo ---------------- */
  const store = {
    get(k, d) {
      try { return JSON.parse(localStorage.getItem("rafa15:" + k)) ?? d; } catch (e) { return d; }
    },
    set(k, v) {
      try { localStorage.setItem("rafa15:" + k, JSON.stringify(v)); } catch (e) {}
    },
  };

  async function withTimeout(promise, ms = 15000) {
    let timer;
    const timeout = new Promise((_, rej) => { timer = setTimeout(() => rej(new Error("timeout")), ms); });
    try { return await Promise.race([promise, timeout]); } finally { clearTimeout(timer); }
  }

  const api = {
    async load() {
      if (DEMO) {
        return { gifts: store.get("gifts", []), messages: store.get("messages", []) };
      }
      const r = await withTimeout(fetch(C.apiUrl + "?t=" + Date.now()));
      const data = await r.json();
      if (!data.ok) throw new Error(data.error || "erro");
      return data;
    },
    async send(payload) {
      if (DEMO) {
        await new Promise((r) => setTimeout(r, 400));
        if (payload.action === "gift") {
          const gifts = store.get("gifts", []);
          if (gifts.includes(payload.giftId)) return { ok: false, error: "reservado" };
          gifts.push(payload.giftId);
          store.set("gifts", gifts);
        } else if (payload.action === "message") {
          const msgs = store.get("messages", []);
          msgs.unshift({ nome: payload.nome, recado: payload.recado, data: new Date().toISOString() });
          store.set("messages", msgs);
        }
        return { ok: true };
      }
      const r = await withTimeout(
        fetch(C.apiUrl, {
          method: "POST",
          headers: { "Content-Type": "text/plain;charset=utf-8" },
          body: JSON.stringify(payload),
        })
      );
      return r.json();
    },
  };

  function setMsg(el, text, kind) {
    el.textContent = text;
    el.className = "form-msg" + (kind ? " " + kind : "");
  }

  function requireFields(form, names) {
    let ok = true;
    names.forEach((n) => {
      const f = form.elements[n];
      const empty = !f.value.trim();
      f.classList.toggle("invalid", empty);
      if (empty && ok) { f.focus(); ok = false; }
    });
    return ok;
  }

  /* ---------------- Confirmação de presença ---------------- */
  const rsvpForm = $("#rsvp-form");
  rsvpForm.addEventListener("change", () => {
    const vai = rsvpForm.elements.presenca.value === "Sim";
    $("#rsvp-extra").hidden = !vai;
  });
  rsvpForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const msg = $(".form-msg", rsvpForm);
    if (!requireFields(rsvpForm, ["nome"])) return setMsg(msg, "Por favor, preencha seu nome.", "err");
    const f = rsvpForm.elements;
    const vai = f.presenca.value === "Sim";
    const payload = {
      action: "rsvp",
      nome: f.nome.value.trim(),
      presenca: f.presenca.value,
      pessoas: vai ? Number(f.pessoas.value) : 0,
      telefone: f.telefone.value.trim(),
      obs: f.obs.value.trim(),
    };
    const btn = $("button[type=submit]", rsvpForm);
    btn.disabled = true;
    setMsg(msg, "Enviando…");
    try {
      const res = await api.send(payload);
      if (!res.ok) throw new Error(res.error);
      const firstName = payload.nome.split(" ")[0];
      rsvpForm.innerHTML = "";
      rsvpForm.classList.add("success");
      const box = document.createElement("div");
      box.innerHTML = vai
        ? '<p class="big">🎉</p><h3></h3><p>Sua presença está confirmada. Mal podemos esperar para celebrar com você!</p>'
        : '<p class="big">💌</p><h3></h3><p>Que pena! Obrigada por avisar — você pode deixar um recado no mural.</p>';
      $("h3", box).textContent = vai ? "Oba, " + firstName + "!" : "Obrigada, " + firstName + "!";
      const again = document.createElement("a");
      again.href = vai ? "#presentes" : "#recados";
      again.className = "btn btn-ghost";
      again.textContent = vai ? "Ver presentes" : "Deixar um recado";
      box.appendChild(again);
      rsvpForm.appendChild(box);
    } catch (err) {
      btn.disabled = false;
      setMsg(msg, "Não foi possível enviar agora. Tente novamente em instantes.", "err");
    }
  });

  /* ---------------- Pix ---------------- */
  $("#pix-qr").src = C.pix.qr;
  $("#pix-chave").textContent = C.pix.chave;
  $("#pix-titular").textContent = C.pix.titular;
  $("#pix-banco").textContent = C.pix.banco;

  async function copy(text) {
    try {
      await navigator.clipboard.writeText(text);
      return true;
    } catch (e) {
      const ta = document.createElement("textarea");
      ta.value = text;
      ta.setAttribute("readonly", "");
      ta.style.position = "fixed";
      ta.style.opacity = "0";
      document.body.appendChild(ta);
      ta.select();
      let ok = false;
      try { ok = document.execCommand("copy"); } catch (e2) {}
      ta.remove();
      return ok;
    }
  }
  $("#copy-key").addEventListener("click", async () => {
    const ok = await copy(C.pix.chaveCopia);
    toast(ok ? "Chave Pix copiada! 💖" : "Copie manualmente: " + C.pix.chave);
  });
  $("#copy-code").addEventListener("click", async () => {
    const ok = await copy(C.pix.copiaECola);
    toast(ok ? "Código copia e cola copiado!" : "Não foi possível copiar");
    if (ok) setMsg($("#pix-msg"), "No app do banco, escolha Pix → Copia e Cola e cole o código.", "ok");
  });

  /* ---------------- Lista de presentes ---------------- */
  let reserved = new Set();
  const grid = $("#gift-grid");

  function renderGifts() {
    grid.innerHTML = "";
    C.presentes.forEach((g) => {
      const taken = reserved.has(g.id);
      const card = document.createElement("article");
      card.className = "gift" + (taken ? " taken" : "");

      const emoji = document.createElement("div");
      emoji.className = "gift-emoji";
      emoji.textContent = g.emoji || "🎁";
      emoji.setAttribute("aria-hidden", "true");
      const h = document.createElement("h4");
      h.textContent = g.nome;
      const p = document.createElement("p");
      p.textContent = g.detalhe || "";
      card.append(emoji, h, p);

      if (g.link && !taken) {
        const a = document.createElement("a");
        a.className = "link";
        a.href = g.link;
        a.target = "_blank";
        a.rel = "noopener";
        a.textContent = "Ver sugestão →";
        card.appendChild(a);
      }

      if (taken) {
        const t = document.createElement("div");
        t.className = "gift-taken-label";
        t.textContent = "Já escolhido 💝";
        card.appendChild(t);
      } else {
        const b = document.createElement("button");
        b.className = "btn btn-small";
        b.type = "button";
        b.textContent = "Vou dar este";
        b.addEventListener("click", () => openGiftDialog(g));
        card.appendChild(b);
      }
      grid.appendChild(card);
    });
  }

  const dialog = $("#gift-dialog");
  const giftForm = $("#gift-form");
  let currentGift = null;

  function openGiftDialog(g) {
    currentGift = g;
    $("#gift-dialog-name").textContent = g.nome.toLowerCase();
    setMsg($(".form-msg", giftForm), "");
    giftForm.elements.nome.classList.remove("invalid");
    $("button[type=submit]", giftForm).disabled = false;
    if (typeof dialog.showModal === "function") dialog.showModal();
    else dialog.setAttribute("open", "");
    giftForm.elements.nome.focus();
  }
  function closeGiftDialog() {
    if (typeof dialog.close === "function") dialog.close();
    else dialog.removeAttribute("open");
  }
  $("#gift-cancel").addEventListener("click", closeGiftDialog);

  giftForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const msg = $(".form-msg", giftForm);
    if (!requireFields(giftForm, ["nome"])) return setMsg(msg, "Por favor, preencha seu nome.", "err");
    const btn = $("button[type=submit]", giftForm);
    btn.disabled = true;
    setMsg(msg, "Enviando…");
    try {
      const res = await api.send({
        action: "gift",
        giftId: currentGift.id,
        giftNome: currentGift.nome,
        nome: giftForm.elements.nome.value.trim(),
      });
      if (!res.ok && res.error === "reservado") {
        reserved.add(currentGift.id);
        renderGifts();
        setMsg(msg, "Ops! Alguém acabou de escolher este presente. Escolha outro 💕", "err");
        return;
      }
      if (!res.ok) throw new Error(res.error);
      reserved.add(currentGift.id);
      renderGifts();
      closeGiftDialog();
      toast("Obrigada! Presente reservado 🎁");
    } catch (err) {
      btn.disabled = false;
      setMsg(msg, "Não foi possível enviar agora. Tente novamente.", "err");
    }
  });

  /* ---------------- Mural de recados ---------------- */
  const list = $("#msg-list");
  let messages = [];

  function fmtDate(iso) {
    const d = new Date(iso);
    if (isNaN(d)) return "";
    return d.toLocaleDateString("pt-BR", { day: "2-digit", month: "short" });
  }

  function renderMessages() {
    list.innerHTML = "";
    if (!messages.length) {
      const p = document.createElement("p");
      p.className = "msg-empty";
      p.textContent = "Seja a primeira pessoa a deixar um recado! ✍️";
      list.appendChild(p);
      return;
    }
    messages.forEach((m) => {
      const el = document.createElement("article");
      el.className = "msg";
      const p = document.createElement("p");
      p.textContent = m.recado;
      const f = document.createElement("footer");
      const s = document.createElement("strong");
      s.textContent = m.nome;
      f.append("— ", s);
      const when = fmtDate(m.data);
      if (when) f.append(" · " + when);
      el.append(p, f);
      list.appendChild(el);
    });
  }

  const msgForm = $("#msg-form");
  msgForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const msg = $(".form-msg", msgForm);
    if (!requireFields(msgForm, ["nome", "recado"])) return setMsg(msg, "Preencha seu nome e o recado.", "err");
    const payload = {
      action: "message",
      nome: msgForm.elements.nome.value.trim(),
      recado: msgForm.elements.recado.value.trim(),
    };
    const btn = $("button[type=submit]", msgForm);
    btn.disabled = true;
    setMsg(msg, "Enviando…");
    try {
      const res = await api.send(payload);
      if (!res.ok) throw new Error(res.error);
      messages.unshift({ nome: payload.nome, recado: payload.recado, data: new Date().toISOString() });
      renderMessages();
      msgForm.elements.recado.value = "";
      setMsg(msg, "Recado enviado! Obrigada pelo carinho 💖", "ok");
    } catch (err) {
      setMsg(msg, "Não foi possível enviar agora. Tente novamente.", "err");
    } finally {
      btn.disabled = false;
    }
  });

  ["input", "change"].forEach((ev) =>
    document.addEventListener(ev, (e) => {
      if (e.target.classList && e.target.classList.contains("invalid") && e.target.value.trim())
        e.target.classList.remove("invalid");
    })
  );

  /* ---------------- Carregamento inicial ---------------- */
  renderGifts();
  list.innerHTML = '<p class="msg-empty">Carregando recados…</p>';
  api
    .load()
    .then((data) => {
      reserved = new Set(data.gifts || []);
      messages = data.messages || [];
      renderGifts();
      renderMessages();
    })
    .catch(() => {
      list.innerHTML = "";
      const p = document.createElement("p");
      p.className = "msg-empty";
      p.textContent = "Não foi possível carregar os recados agora.";
      list.appendChild(p);
    });
})();
