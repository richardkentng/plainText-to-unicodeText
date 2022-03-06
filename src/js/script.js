addRadioInputsAndLabelsToHTML();

//---------------------------------------------------
//************** QUERY SELECT ELEMENTS ***************/
//---------------------------------------------------
const radioStylesForm = document.body.querySelector(".select-style-form");
const radioStylesLabels = document.body.querySelectorAll(".radio-styles-label");
const textarea1 = document.body.querySelector(".textarea-1");
const textarea2 = document.body.querySelector(".textarea-2");
const copyToClipboardBtn = document.body.querySelector(
  ".copy-to-clipboard-btn"
);
const copyToClipboardIcon = copyToClipboardBtn.querySelector("i");
const autoReadWriteClipboard_checkbox = document.body.querySelector(
  ".auto-read-write-clipboard-cb"
);
const clearTextareasBtn = document.body.querySelector(".clear-textareas-btn");

//update style from local storage
setStyle(getLocalStorage("style") || "bold sans");

//update checkbox from local storage
autoReadWriteClipboard_checkbox.checked = getLocalStorage(
  "auto-read-write-clipboard"
)
  ? true
  : false;

// disable/enable & clear textareas conditionally
renovateTextareas(autoReadWriteClipboard_checkbox.checked);

//---------------------------------------------------
//************** ADD EVENT LISTENERS ***************/
//---------------------------------------------------

//listen for click event on each radioStyleLabel, then conditionally feed clipboard contents into textarea1, populate textarea2.value with unicoded textarea1.value, conditionally copy textarea2.value to clipboard
radioStylesLabels.forEach((radioStyleLabel) => {
  radioStyleLabel.addEventListener("click", onClick_radioStylesLabel);
});

//listen for input event on textarea1, then populate textarea2 with unicoded textarea1
textarea1.addEventListener("input", function () {
  populateTextarea2_w_textToUnicode(this.value);
});

//listen for change on checkbox (autoReadWriteClipboard), then store the checkbox state to local storage
autoReadWriteClipboard_checkbox.addEventListener("change", function () {
  setLocalStorage("auto-read-write-clipboard", this.checked ? "1" : "");
  renovateTextareas(this.checked);
});

//listen for click on copy-to-clipboard-button, then copy textarea2.value to clipboard and reset clipboard icon
copyToClipboardBtn.addEventListener("click", () => {
  copyToClipboard(textarea2.value);
});

//listen for click on clearTextareasBtn, then clear textareas
clearTextareasBtn.addEventListener("click", clearTextareas);

//---------------------------------------------------
//******************* FUNCTIONS ********************/
//---------------------------------------------------

async function onClick_radioStylesLabel(e) {
  animateJump(e.target);
  await sleep(5); //wait for radioNodeList to update with selected value
  setLocalStorage("style", getStyle());
  if (autoReadWriteClipboard_checkbox.checked) {
    textarea1.value = convertToPlainText(await readClipboard());
    populateTextarea2_w_textToUnicode(textarea1.value);
    if (isWhiteSpace(textarea1.value)) {
      return showToast("No text detected on clipboard!");
    }
  }
  populateTextarea2_w_textToUnicode(textarea1.value);

  if (autoReadWriteClipboard_checkbox.checked) {
    copyToClipboard(textarea2.value);
  }
  textarea1.focus();
}

function populateTextarea2_w_textToUnicode(textToBeUnicoded) {
  textarea2.value = convertToUnicodeText(textToBeUnicoded, getStyle());
  resetClipboardIcon();
}

function getStyle() {
  return radioStylesForm.styles.value;
}

function setStyle(style) {
  radioStylesForm.styles.value = style;
}

//----------------------------------------------------
// *************** visual functions
//----------------------------------------------------

function renovateTextareas(checked) {
  if (checked) {
    textarea1.disabled = true;
  } else {
    textarea1.disabled = false;
  }
  clearTextareas();
}

function clearTextareas() {
  textarea1.value = "";
  textarea2.value = "";
  resetClipboardIcon();
  textarea1.focus();
}

function animateJump(ele) {
  ele.addEventListener("transitionend", resetTranslation);
  //enable animation
  ele.style.transition = "transform 0.1s";
  //translate element
  ele.style.transform = "translateY(-10px)";
  //after a delay, transitionend event fires and translation is reset
  function resetTranslation() {
    ele.style.transform = "translateY(0)";
  }
}

function resetClipboardIcon() {
  copyToClipboardIcon.setAttribute("class", "bi-clipboard");
}

//----------------------------------------------------
// *************** utility functions
//----------------------------------------------------

async function copyToClipboard(content) {
  if (isWhiteSpace(content)) return showToast("There is nothing to copy!");
  await navigator.clipboard.writeText(content);
  fillClipboardIcon();
  animateJump(copyToClipboardBtn);

  function fillClipboardIcon() {
    copyToClipboardIcon.setAttribute("class", "bi-clipboard-check-fill");
  }
}

function readClipboard() {
  return navigator.clipboard.readText();
}

function showToast(message, headerMessage = "ALERT") {
  const toast = document.body.querySelector(".toast");
  toast.querySelector(".toast-body").textContent = message;
  toast.querySelector(".toast-header-text-cont").textContent = headerMessage;
  const bsToast = new bootstrap.Toast(toast);
  bsToast.show();
}

function isWhiteSpace(text) {
  return text.replace(/\s/g, "") === "";
}

function getLocalStorage(key) {
  return localStorage.getItem(key);
}

function setLocalStorage(key, value) {
  localStorage.setItem(key, value);
}

function sleep(ms) {
  return new Promise((resolve, reject) => {
    setTimeout(resolve, ms);
  });
}

//----------------------------------------------------
// *************** function to populate HTML
//----------------------------------------------------

function addRadioInputsAndLabelsToHTML() {
  const styles = Object.keys(get_style_unicodeChars());

  const inputPairs = styles
    .map((style) => {
      const unicodedText = convertToUnicodeText(style, style); //text content for label
      return `<div class="input-pair">
  <input type="radio" name="styles" value="${style}" class="radio-styles-input" id="${style}">
  <label class="radio-styles-label" for="${style}">${unicodedText}</label>
  </div>`;
    })
    .join("");

  document.body.querySelector(".select-style-input-groups").innerHTML =
    inputPairs;
}
