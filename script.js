/*const fromText = document.querySelector(".from-text");
const toText = document.querySelector(".to-text");
const charCount = document.getElementById("charCount");
const fromLang = document.getElementById("fromLang");
const toLang = document.getElementById("toLang");
const exchangeIcon = document.querySelector(".exchange");
const translateBtn = document.querySelector(".translate-btn");
const loading = document.querySelector(".loading");
const historyList = document.getElementById("historyList");
const clearHistory = document.getElementById("clearHistory");
const toggleMode = document.getElementById("toggleMode");
const toast = document.getElementById("toast");

// Fill dropdowns
for (const code in countries) {
  fromLang.insertAdjacentHTML("beforeend", `<option value="${code}">${countries[code]}</option>`);
  toLang.insertAdjacentHTML("beforeend", `<option value="${code}">${countries[code]}</option>`);
}
fromLang.value = "auto";
toLang.value = "en";

// Char counter
fromText.addEventListener("input", () => charCount.textContent = fromText.value.length);

// Swap
exchangeIcon.addEventListener("click", () => {
  [fromLang.value, toLang.value] = [toLang.value, fromLang.value];
  [fromText.value, toText.value] = [toText.value, fromText.value];
});

// History
let history = JSON.parse(localStorage.getItem("translations")) || [];
function renderHistory() {
  historyList.innerHTML = "";
  history.forEach(item => historyList.innerHTML += `<li>${item.original} → ${item.translated}</li>`);
}
renderHistory();
clearHistory.addEventListener("click", () => {
  history = [];
  localStorage.removeItem("translations");
  renderHistory();
});

// Translate
translateBtn.addEventListener("click", () => {
  let text = fromText.value.trim();
  if (!text) return alert("Please enter text");
  loading.classList.remove("hidden");
  let api = `https://api.mymemory.translated.net/get?q=${encodeURIComponent(text)}&langpair=${fromLang.value}|${toLang.value}`;
  fetch(api).then(res => res.json()).then(data => {
    toText.value = data.responseData.translatedText;
    loading.classList.add("hidden");
    history.push({ original: text, translated: toText.value });
    localStorage.setItem("translations", JSON.stringify(history));
    renderHistory();
  }).catch(() => {
    loading.classList.add("hidden");
    alert("Error fetching translation");
  });
});

// Copy & Speak
document.getElementById("copyFrom").addEventListener("click", () => copyText(fromText.value));
document.getElementById("copyTo").addEventListener("click", () => copyText(toText.value));
document.getElementById("speakFrom").addEventListener("click", () => speakText(fromText.value, fromLang.value));
document.getElementById("speakTo").addEventListener("click", () => speakText(toText.value, toLang.value));

function copyText(text) {
  if (text.trim()) {
    navigator.clipboard.writeText(text).then(() => showToast());
  }
}
function speakText(text, lang) {
  if (text.trim()) {
    let utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = lang;
    speechSynthesis.speak(utterance);
  }
}
function showToast() {
  toast.classList.add("show");
  setTimeout(() => toast.classList.remove("show"), 1500);
}

// Dark mode
toggleMode.addEventListener("click", () => document.body.classList.toggle("dark-mode"));
*/
const fromText = document.querySelector(".from-text");
const toText = document.querySelector(".to-text");
const charCount = document.getElementById("charCount");
const fromLang = document.getElementById("fromLang");
const toLang = document.getElementById("toLang");
const exchangeIcon = document.querySelector(".exchange");
const translateBtn = document.querySelector(".translate-btn");
const loading = document.querySelector(".loading");
const historyList = document.getElementById("historyList");
const clearHistory = document.getElementById("clearHistory");
const toggleMode = document.getElementById("toggleMode");
const toast = document.getElementById("toast");

// Fill dropdowns
for (const code in countries) {
  fromLang.insertAdjacentHTML("beforeend", `<option value="${code}">${countries[code]}</option>`);
  toLang.insertAdjacentHTML("beforeend", `<option value="${code}">${countries[code]}</option>`);
}
fromLang.value = "auto";
toLang.value = "en";

// Char counter
fromText.addEventListener("input", () => charCount.textContent = fromText.value.length);

// Swap
exchangeIcon.addEventListener("click", () => {
  [fromLang.value, toLang.value] = [toLang.value, fromLang.value];
  [fromText.value, toText.value] = [toText.value, fromText.value];
});

// ---- HISTORY ----
let history = JSON.parse(localStorage.getItem("translations")) || [];

function renderHistory() {
  historyList.innerHTML = "";
  history.forEach((item, index) => {
    let li = document.createElement("li");
    li.innerHTML = `<strong>${item.original}</strong> → ${item.translated} 
                    <button class="delete-btn" data-index="${index}">x</button>`;
    historyList.appendChild(li);
  });

  // Attach delete handlers
  document.querySelectorAll(".delete-btn").forEach(btn => {
    btn.addEventListener("click", (e) => {
      let index = e.target.dataset.index;
      history.splice(index, 1);
      localStorage.setItem("translations", JSON.stringify(history));
      renderHistory();
    });
  });
}
renderHistory();

clearHistory.addEventListener("click", () => {
  history = [];
  localStorage.removeItem("translations");
  renderHistory();
});

// ---- TRANSLATE ----
translateBtn.addEventListener("click", () => {
  let text = fromText.value.trim();
  if (!text) return alert("Please enter text");
  loading.classList.remove("hidden");
  let api = `https://api.mymemory.translated.net/get?q=${encodeURIComponent(text)}&langpair=${fromLang.value}|${toLang.value}`;
  fetch(api)
    .then(res => res.json())
    .then(data => {
      toText.value = data.responseData.translatedText;
      loading.classList.add("hidden");
      history.unshift({ original: text, translated: toText.value });
      if (history.length > 20) history.pop(); // keep latest 20
      localStorage.setItem("translations", JSON.stringify(history));
      renderHistory();
    })
    .catch(() => {
      loading.classList.add("hidden");
      alert("Error fetching translation");
    });
});

// ---- COPY ----
function copyText(text) {
  if (text.trim()) {
    navigator.clipboard.writeText(text).then(() => showToast());
  }
}
document.getElementById("copyFrom").addEventListener("click", () => copyText(fromText.value));
document.getElementById("copyTo").addEventListener("click", () => copyText(toText.value));

// ---- SPEAK ----
function speakText(text, lang) {
  if (text.trim()) {
    let utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = lang;
    speechSynthesis.speak(utterance);
  }
}
document.getElementById("speakFrom").addEventListener("click", () => speakText(fromText.value, fromLang.value));
document.getElementById("speakTo").addEventListener("click", () => speakText(toText.value, toLang.value));

// ---- TOAST ----
function showToast() {
  toast.classList.add("show");
  setTimeout(() => toast.classList.remove("show"), 1500);
}

// ---- DARK MODE ----
toggleMode.addEventListener("click", () => document.body.classList.toggle("dark-mode"));
