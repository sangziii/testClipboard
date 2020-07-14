// selection 초기화
function clearSelection() {
  const sel = document.selection;
  if (sel && sel.empty) {
    sel.empty();
  } else {
    if (window.getSelection) window.getSelection().removeAllRanges();
    const activeEl = document.activeElement;
    if (activeEl) {
      const tagName = activeEl.nodeName.toLowerCase();
      if (tagName === "textarea" || (tagName === "input" && activeEl.type === "text")) {
        activeEl.selectionStart = activeEl.selectionEnd;
      }
    }
  }
};

const defaultMessage = "Copy to clipboard: #{key}, Enter";

function format(message) {
  const copyKey = `${/mac os x/i.test(navigator.userAgent) ? "⌘" : "Ctrl"} C`;
  return message.replace(/#{\s*key\s*}/g, copyKey);
};

function copyToClipboard(text) {
  var message;
  var range;
  var selection;
  var mark;
  var success = false;

  try {
    clearSelection();
    range = document.createRange();
    selection = document.getSelection();
    mark = document.createElement("span");
    mark.textContent = text;
    // reset user styles for span element
    mark.style.all = "unset";
    // prevents scrolling to the end of the page
    mark.style.position = "fixed";
    mark.style.top = "0";
    mark.style.clip = "rect(0, 0, 0, 0)";
    // used to preserve spaces and line breaks
    mark.style.whiteSpace = "pre";
    // do not inherit user-select (it may be `none`)
    mark.style.webkitUserSelect = "text";
    mark.style.MozUserSelect = "text";
    mark.style.msUserSelect = "text";
    mark.style.userSelect = "text";
    mark.addEventListener("copy", (e) => {
      e.stopPropagation();
      e.preventDefault();
      if (typeof e.clipboardData === "undefined") {
        // IE 11
        console.warn("unable to use e.clipboardData");
        console.warn("trying IE specific stuff");
        window.clipboardData.clearData();
        window.clipboardData.setData("Text", text);
      } else {
        // all other browsers
        e.clipboardData.clearData();
        e.clipboardData.setData("Text", text);
      }
      alert("클립보드에 복사하였습니다.");
    });

    document.body.appendChild(mark);
    range.selectNodeContents(mark);
    selection.addRange(range);

    const successful = document.execCommand("copy");
    if (!successful) {
      throw new Error("copy command was unsuccessful");
    }
    success = true;
  } catch (err) {
    console.error("unable to copy using execCommand: ", err);
    console.warn("trying IE specific stuff");

    try {
      window.clipboardData.setData("text", text);
      alert("클립보드에 복사하였습니다.");
      success = true;
    } catch (err2) {
      console.error("unable to copy using clipboardData: ", err2);
      console.error("falling back to prompt");
      message = format(defaultMessage);
      window.prompt(message, text);
    }
  } finally {
    if (selection) clearSelection();
    if (mark) document.body.removeChild(mark);
  }
  return success;
};

const txt = document.getElementById("targetTxt").textContent;
const btn = document.getElementById("btn");

btn.addEventListener("click", (e) => {
  console.log("click!!!");
  e.preventDefault();
  copyToClipboard(txt);
});
