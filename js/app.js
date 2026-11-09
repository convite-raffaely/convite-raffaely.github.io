(function () {
  "use strict";

  const C = window.CONFIG;
  const DEMO = !C.apiUrl;
  const $ = (sel, root = document) => root.querySelector(sel);
  const el = (tag, cls, text) => {
    const e = document.createElement(tag);
    if (cls) e.className = cls;
    if (text != null) e.textContent = text;
    return e;
  };

  const bigIcon = (name) => {
    const wrap = el("div", "big");
    const img = el("img");
    img.src = "assets/icons/" + name + ".svg";
    img.alt = "";
    wrap.appendChild(img);
    return wrap;
  };
  const giftImg = (item) => {
    const img = el("img", "gift-img");
    img.src = item.imagem;
    img.alt = "";
    img.loading = "lazy";
    img.width = 320;
    img.height = 320;
    return img;
  };

  /* ---------------- Preenche textos da configuração ---------------- */
  document.querySelectorAll("[data-cfg]").forEach((node) => {
    const v = C[node.dataset.cfg];
    if (v) node.textContent = v;
  });
  if (C.foto) {
    const img = $("#hero-foto");
    img.src = C.foto;
    img.alt = C.nome;
    $("#hero-frame").hidden = false;
  }
  if (C.mapaBusca || C.mapsUrl) {
    $("#map-wrap").hidden = false;
    if (C.mapaBusca) {
      $("#map").src = "https://www.google.com/maps?q=" + encodeURIComponent(C.mapaBusca) + "&output=embed";
    } else {
      $("#map").remove();
    }
    $("#maps-link").href =
      C.mapsUrl || "https://www.google.com/maps/search/?api=1&query=" + encodeURIComponent(C.mapaBusca);
  }
  if (C.galeria && C.galeria.length) {
    const g = $("#gallery");
    C.galeria.forEach((src, i) => {
      const fig = el("figure");
      const img = el("img");
      img.src = src;
      img.alt = C.nome + " — foto " + (i + 1);
      img.loading = "lazy";
      fig.appendChild(img);
      g.appendChild(fig);
    });
    g.hidden = false;
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
      done.textContent = diff < -24 * 3600 * 1000 ? "Obrigada por celebrar comigo!" : "Hoje é o grande dia!";
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
      t = el("div", "toast");
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
      try { return JSON.parse(localStorage.getItem("raffa15:" + k)) ?? d; } catch (e) { return d; }
    },
    set(k, v) {
      try { localStorage.setItem("raffa15:" + k, JSON.stringify(v)); } catch (e) {}
    },
  };

  async function withTimeout(promise, ms = 15000) {
    let timer;
    const timeout = new Promise((_, rej) => { timer = setTimeout(() => rej(new Error("timeout")), ms); });
    try { return await Promise.race([promise, timeout]); } finally { clearTimeout(timer); }
  }

  const api = {
    async load() {
      if (DEMO) return { messages: store.get("messages", []) };
      const r = await withTimeout(fetch(C.apiUrl + "?t=" + Date.now()));
      const data = await r.json();
      if (!data.ok) throw new Error(data.error || "erro");
      return data;
    },
    async send(payload) {
      if (DEMO) {
        await new Promise((r) => setTimeout(r, 400));
        if (payload.action === "message") {
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

  function setMsg(node, text, kind) {
    node.textContent = text;
    node.className = "form-msg" + (kind ? " " + kind : "");
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
    $("#rsvp-extra").hidden = rsvpForm.elements.presenca.value !== "Sim";
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
      rsvpForm.append(
        bigIcon(vai ? "confetti" : "envelope-simple-open"),
        el("h3", null, (vai ? "Oba, " : "Obrigada, ") + firstName + "!"),
        el(
          "p",
          null,
          vai
            ? "Sua presença está confirmada. Mal podemos esperar para celebrar com você!"
            : "Que pena! Obrigada por avisar — você pode deixar um recado no mural."
        )
      );
      const next = el("a", "btn btn-ghost", vai ? "Ver presentes" : "Deixar um recado");
      next.href = vai ? "#presentes" : "#recados";
      rsvpForm.appendChild(next);
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
    toast((await copy(C.pix.chaveCopia)) ? "Chave Pix copiada!" : "Copie manualmente: " + C.pix.chave);
  });
  $("#copy-code").addEventListener("click", async () => {
    toast((await copy(C.pix.copiaECola)) ? "Código Pix copiado! Use Pix → Copia e Cola" : "Não foi possível copiar");
  });

  /* ---------------- Sugestões de presente (Pix com valor) ---------------- */
  const brl = (v) => v.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
  const giftList = $("#gift-list");
  const dialog = $("#gift-dialog");
  let currentCode = "";

  function codeFor(valor) {
    return window.Pix.brCode({
      chave: C.pix.chaveCopia,
      nome: C.pix.nomeRecebedor,
      cidade: C.pix.cidade,
      valor,
    });
  }

  function qrSvg(text) {
    if (typeof window.qrcode !== "function") return null;
    const qr = window.qrcode(0, "M");
    qr.addData(text);
    qr.make();
    return qr.createSvgTag({ cellSize: 5, margin: 0, scalable: true });
  }

  function openGift(item) {
    currentCode = codeFor(item.valor);
    const gi = $("#gd-img");
    gi.src = item.imagem;
    gi.alt = item.nome;
    $("#gd-nome").textContent = item.nome;
    $("#gd-valor").textContent = brl(item.valor);
    $("#gd-chave").textContent = C.pix.chave;
    const box = $("#gd-qr");
    const svg = qrSvg(currentCode);
    if (svg) {
      box.innerHTML = svg;
      box.hidden = false;
    } else {
      box.hidden = true;
    }
    if (typeof dialog.showModal === "function") dialog.showModal();
    else dialog.setAttribute("open", "");
  }
  function closeGift() {
    if (typeof dialog.close === "function") dialog.close();
    else dialog.removeAttribute("open");
  }
  $("#gift-close").addEventListener("click", closeGift);
  dialog.addEventListener("click", (e) => { if (e.target === dialog) closeGift(); });
  $("#gd-copy").addEventListener("click", async () => {
    toast((await copy(currentCode)) ? "Código copiado! Use Pix → Copia e Cola" : "Não foi possível copiar");
  });

  C.presentes.forEach((grupo) => {
    giftList.appendChild(el("h4", "gift-cat", grupo.categoria));
    const grid = el("div", "gift-grid");
    grupo.itens.forEach((item) => {
      const card = el("button", "gift");
      card.type = "button";
      card.setAttribute("aria-label", item.nome + ", " + brl(item.valor) + ". Presentear via Pix");
      card.append(
        giftImg(item),
        el("span", "gift-name", item.nome),
        el("span", "gift-price", brl(item.valor)),
        el("span", "gift-cta", "Presentear via Pix →")
      );
      card.addEventListener("click", () => openGift(item));
      grid.appendChild(card);
    });
    giftList.appendChild(grid);
  });

  /* ---------------- Música ---------------- */
  if (C.musica && C.musica.youtubeId) {
    const box = $("#music");
    const player = $("#music-player");
    const frame = $("#music-frame");
    const btn = $("#music-btn");
    $("#music-title").textContent = C.musica.titulo;
    $("#music-artist").textContent = C.musica.artista;
    box.hidden = false;

    const play = () => {
      const f = document.createElement("iframe");
      f.src =
        "https://www.youtube-nocookie.com/embed/" + encodeURIComponent(C.musica.youtubeId) +
        "?autoplay=1&rel=0&playsinline=1&modestbranding=1";
      f.title = C.musica.titulo + " — " + C.musica.artista;
      f.allow = "autoplay; encrypted-media; picture-in-picture";
      f.referrerPolicy = "strict-origin-when-cross-origin";
      f.allowFullscreen = true;
      frame.innerHTML = "";
      frame.appendChild(f);
      player.hidden = false;
      btn.hidden = true;
    };
    const stop = () => {
      frame.innerHTML = "";
      player.hidden = true;
      btn.hidden = false;
    };
    btn.addEventListener("click", play);
    $("#music-close").addEventListener("click", stop);
  }

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
      list.appendChild(el("p", "msg-empty", "Seja a primeira pessoa a deixar um recado!"));
      return;
    }
    messages.forEach((m) => {
      const card = el("article", "msg");
      const foot = el("footer");
      foot.append("— ", el("strong", null, m.nome));
      const when = fmtDate(m.data);
      if (when) foot.append(" · " + when);
      card.append(el("p", null, m.recado), foot);
      list.appendChild(card);
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
      setMsg(msg, "Recado enviado! Obrigada pelo carinho.", "ok");
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
  list.appendChild(el("p", "msg-empty", "Carregando recados…"));
  api
    .load()
    .then((data) => {
      messages = data.messages || [];
      renderMessages();
    })
    .catch(() => {
      list.innerHTML = "";
      list.appendChild(el("p", "msg-empty", "Não foi possível carregar os recados agora."));
    });
})();
