const maskBase = document.getElementById('baseInput');
const maskTo = document.getElementById('toInput');

const baseValue = document.getElementById('baseValue');
const toValue = document.getElementById('toValue');

const form = document.getElementById("myForm");

let base = 'RUB';
let symbol = 'USD';



var baseText = IMask(maskBase, {
  mask: "num",
  blocks: {
    num: {
      // nested masks are available!
      mask: Number,
      thousandsSeparator: " ",
      radix: ".",
      scale: 4,
      max: Number.MAX_VALUE,
      padFractionalZeros: false,
      normalizeZeros: true
    },
  },
});

var toText = IMask(maskTo, {
  mask: "num",
  blocks: {
    num: {
      // nested masks are available!
      mask: Number,
      thousandsSeparator: " ",
      radix: ".",
      scale: 4,
      max: Number.MAX_VALUE,
      padFractionalZeros: false,
      normalizeZeros: true
    },
  },
});



function setData() {
  const arr = [];
  const myForm = new FormData(form);
  if (base !== myForm.get("btnbase") || symbol !== myForm.get("btnTo")) {
    base = myForm.get("btnbase");
    symbol = myForm.get("btnTo");
  }
  const url = new URL('https://api.exchangerate.host/lates');
  url.searchParams.set("base", base);
  url.searchParams.set("symbols", symbol);
  arr.push(url);
  arr.push(base);
  arr.push(symbol);
  return arr;
}



function getData() {
  const url = setData();
  fetch(url[0].href)
    .then(response => response.json())
    .then(data => {
      baseValue.innerHTML = `1 ${url[1]} = ${(data.rates[symbol]).toFixed(2)} ${url[2]}`;
      toValue.innerHTML = `1 ${url[2]} = ${(1 / data.rates[symbol]).toFixed(2)} ${url[1]}`
      console.log(url[0].href)
    })
}

const defValue = (t = true) => {
  if (!navigator.onLine) {
    return;
  }
  const url = setData();
  fetch(url[0].href)
    .then(response => response.json())
    .then(data => {
      if (t) {
        toText.value = (+baseText.unmaskedValue * data.rates[symbol]).toFixed(2);
      }
      else baseText.value = (+toText.unmaskedValue * (1 / data.rates[symbol])).toFixed(2);
    });
}

form.addEventListener('input', (inp) => {
  if (inp.target.name === 'toInput') {
    defValue(false);
  }
  defValue();
  getData();
});
