const radioStylesForm = document.body.querySelector(".select-style-form");
const radioStylesLabels = document.body.querySelectorAll(".style-label");
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

stylize_radioStylesLabels();

//******* update style from local storage or default to bold sans
const lastClickedStyle = localStorage.getItem("style");
//select style
radioStylesForm.styles.value = lastClickedStyle || "bold sans";

//update checkbox from local storage
autoReadWriteClipboard_checkbox.checked = localStorage.getItem(
  "auto-read-write-clipboard"
)
  ? true
  : false;

//if above checkbox is checked, disable textareas and clear them, else enable textarea1
disableAndClearTextareas_enableTextarea1(
  autoReadWriteClipboard_checkbox.checked
);

//---------------------------------------------------
//************** ADD EVENT LISTENERS ***************/
//---------------------------------------------------

//listen for click event on each radioStyleLabel, then conditionally feed clipboard contents into textarea1, populate textarea2.value with unicoded textarea1.value, conditionally copy textarea2.value to clipboard
radioStylesLabels.forEach((radioStyleLabel) => {
  radioStyleLabel.addEventListener("click", onClick_radioStylesLabel);
});

//listen for input event on textarea1, then populate textarea2 with unicoded textarea1
textarea1.addEventListener("input", function () {
  populateTextarea2_with_textToBeUnicoded(this.value);
});

//listen for change on checkbox (autoReadWriteClipboard), then store the checkbox state to local storage
autoReadWriteClipboard_checkbox.addEventListener("change", function () {
  console.log("hi");
  localStorage.setItem("auto-read-write-clipboard", this.checked ? "1" : "");
  disableAndClearTextareas_enableTextarea1(this.checked);
});

//listen for click on copy-to-clipboard-button, then copy textarea2.value to clipboard and reset clipboard icon
copyToClipboardBtn.addEventListener("click", onClick_copyToClipboardBtn);

//listen for click on clearTextareasBtn, then clear textareas
clearTextareasBtn.addEventListener("click", clearTextareas);

//---------------------------------------------------
//******************* FUNCTIONS ********************/
//---------------------------------------------------

async function onClick_radioStylesLabel(e) {
  await sleep(5); //wait for radioNodeList to update with selected value

  //save clicked style to local storage
  localStorage.setItem("style", getStyle());

  if (autoReadWriteClipboard_checkbox.checked) {
    //****** populate textarea1 with clipboard contents
    textarea1.value = convertToPlainText(await navigator.clipboard.readText());
    //if textarea1 only contains white space, alert user
    const textarea1OnlyHasWhiteSpace =
      textarea1.value.replace(/\s/g, "") === "";
    if (textarea1OnlyHasWhiteSpace) {
      textarea1.value = "NO TEXT DETECTED ON CLIPBOARD.";
      return;
    }
  }

  populateTextarea2_with_textToBeUnicoded(textarea1.value);

  if (autoReadWriteClipboard_checkbox.checked) {
    //copy textarea2.value to clipboard
    onClick_copyToClipboardBtn();
  }

  //focus textarea1
  textarea1.focus();
}

function populateTextarea2_with_textToBeUnicoded(textToBeUnicoded) {
  textarea2.value = convertToUnicodeText(textToBeUnicoded, getStyle());
  //reset clipboard icon
  copyToClipboardIcon.setAttribute("class", "bi-clipboard");

  //enable or disable clearTextAreasBtn based on whether textarea1 has content
  enableDisable_clearTextAreasBtn();
}

function getStyle() {
  return radioStylesForm.styles.value;
}

function stylize_radioStylesLabels() {
  radioStylesLabels.forEach((l) => {
    //stylize text of each label according to its text content
    l.textContent = convertToUnicodeText(l.textContent, l.textContent);
  });
}

async function onClick_copyToClipboardBtn() {
  if (!textarea2.value) return;
  //copy textarea2.value to clipboard
  await navigator.clipboard.writeText(textarea2.value);
  fillClipboardIcon();
  animateJump(copyToClipboardBtn);

  // local functions:
  function fillClipboardIcon() {
    copyToClipboardIcon.setAttribute("class", "bi-clipboard-check-fill");
  }
}

function sleep(ms) {
  return new Promise((resolve, reject) => {
    setTimeout(resolve, ms);
  });
}

function animateJump(ele) {
  //listen to 'transitionend" event
  ele.addEventListener("transitionend", function () {
    //reset translation
    ele.style.transform = "translateY(0)";
  });
  //enable animation
  ele.style.transition = "transform 0.1s";
  //translate element
  ele.style.transform = "translateY(-10px)";
  //after a delay, transitionend event fires and translation is reset
}

function disableAndClearTextareas_enableTextarea1(checked) {
  if (checked) {
    textarea1.disabled = true;
    clearTextareas();
  } else {
    textarea1.disabled = false;
    textarea1.focus();
  }
}
//----------------------------------------------------
// *************** functions for clearTextAreasBtn
//----------------------------------------------------

function enableDisable_clearTextAreasBtn() {
  if (textarea1.value) enable();
  else disable();

  function enable() {
    clearTextareasBtn.classList.remove("disabled");
  }
  function disable() {
    clearTextareasBtn.classList.add("disabled");
    textarea1.focus();
  }
}

function clearTextareas() {
  //clear textareas
  textarea1.value = "";
  textarea2.value = "";

  enableDisable_clearTextAreasBtn();
}
