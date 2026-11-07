// Data pilihan. Nama file gambar = kode sol + kode upper, misal "1A.png".
const UPPERS = [
  { code: "A", name: "Blue Stripes" },
  { code: "B", name: "Circles" },
  { code: "C", name: "Curved Lines" },
];

const SOLES = [
  { code: "1", name: "Blue Fade",   swatch: "linear-gradient(135deg, #1f4f8f, #8cc4ec)" },
  { code: "2", name: "Sunset Fade", swatch: "linear-gradient(135deg, #e0763a, #f6dd9c)" },
  { code: "3", name: "Green Fade",  swatch: "linear-gradient(135deg, #2f6d45, #b4e0bb)" },
];

const state = { upper: "A", sole: "1" };

const imgA = document.getElementById("shoe-a");
const imgB = document.getElementById("shoe-b");
const comboName = document.getElementById("combo-name");
const upperLabel = document.getElementById("upper-label");
const soleLabel = document.getElementById("sole-label");
const upperWrap = document.getElementById("upper-options");
const soleWrap = document.getElementById("sole-options");

const fileFor = (sole, upper) => `${sole}${upper}.png`;
const byCode = (list, code) => list.find((item) => item.code === code);

// Muat semua gambar di awal supaya pergantian terasa instan.
SOLES.forEach((s) => UPPERS.forEach((u) => { new Image().src = fileFor(s.code, u.code); }));

function makeOption(group, item, content) {
  const btn = document.createElement("button");
  btn.type = "button";
  btn.className = `option option--${group}`;
  btn.dataset.code = item.code;
  btn.setAttribute("role", "radio");
  btn.setAttribute("aria-label", item.name);
  btn.innerHTML = content + `<span class="option-name">${item.name}</span>`;
  btn.addEventListener("click", () => select(group, item.code));
  return btn;
}

UPPERS.forEach((u) => {
  upperWrap.appendChild(
    makeOption("upper", u, `<span class="thumb"><img src="${fileFor(state.sole, u.code)}" alt=""></span>`)
  );
});

SOLES.forEach((s) => {
  soleWrap.appendChild(
    makeOption("sole", s, `<span class="swatch" style="background:${s.swatch}"></span>`)
  );
});

// Transisi halus: dua gambar ditumpuk, yang baru di-fade in di atas yang lama.
let front = imgA;
let back = imgB;

function showShoe(src, alt) {
  if (front.getAttribute("src") === src) return;
  const swap = () => {
    back.onload = null;
    back.classList.add("is-visible");
    front.classList.remove("is-visible");
    back.alt = alt;
    back.removeAttribute("aria-hidden");
    front.alt = "";
    front.setAttribute("aria-hidden", "true");
    [front, back] = [back, front];
  };
  if (back.getAttribute("src") === src && back.complete) {
    swap(); // gambar ini sudah ada di lapisan belakang
  } else {
    back.onload = swap;
    back.src = src;
  }
}

function select(group, code) {
  state[group] = code;
  render();
}

function render() {
  const upper = byCode(UPPERS, state.upper);
  const sole = byCode(SOLES, state.sole);
  const name = `${upper.name} Upper + ${sole.name} Sole`;

  showShoe(fileFor(sole.code, upper.code), `Sepatu ClickSole: ${name}`);
  comboName.textContent = name;
  upperLabel.textContent = upper.name;
  soleLabel.textContent = sole.name;

  document.querySelectorAll(".option").forEach((btn) => {
    const group = btn.classList.contains("option--upper") ? "upper" : "sole";
    const active = state[group] === btn.dataset.code;
    btn.classList.toggle("is-active", active);
    btn.setAttribute("aria-checked", active);
  });

  // Thumbnail upper ikut memakai sol yang sedang dipilih.
  upperWrap.querySelectorAll(".option img").forEach((img, i) => {
    img.src = fileFor(sole.code, UPPERS[i].code);
  });
}

render();
