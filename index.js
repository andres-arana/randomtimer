let mainTimeoutId = null;
const formElement = document.getElementById('form');
const fromInput = document.getElementById('from');
const toInput = document.getElementById('to');
const loaderElement = document.getElementById('loader');
const timeoutElement = document.getElementById('timeout');

const timeoutSound = new Howl({
  src: ['timeout.wav'],
});

const noSleep = new NoSleep();
function enableNoSleep() {
  noSleep.enable();
  document.removeEventListener('touchstart', enableNoSleep, false);
}
document.addEventListener('touchstart', enableNoSleep, false);

function parseHumanTime(value) {
  const parseValue = /^(\d+\D+)?(\d+\D+)?(\d+\D+)?$/g;
  const parseEntry = /(\d+)(\D+)/;
  const multipliers = {
    d: 3600 * 24,
    day: 3600 * 24,
    days: 3600 * 24,
    h: 3600,
    hour: 3600,
    hours: 3600,
    m: 60,
    minute: 60,
    minutes: 60,
    s: 1,
    second: 1,
    seconds: 1,
  };

  const match = value.replace(/\s/g, '').match(parseValue);

  if (value.length === 0 || !match) {
    return null;
  }

  return match
    .map(m => {
      const v = m.match(parseEntry);
      return parseFloat(v[1], 10) * multipliers[v[2]];
    })
    .reduce((r, v) => r + v);
}

function validateInput(element) {
  const value = parseHumanTime(element.value)
  if (!value) {
    element.classList.add('error');
  } else {
    element.classList.remove('error');
  }
  return value;
}

function showOnly(element) {
  formElement.classList.add('hidden');
  loaderElement.classList.add('hidden');
  timeoutElement.classList.add('hidden');
  element.classList.remove('hidden');
}

document.getElementById('go').addEventListener('click', function() {
  const from = validateInput(fromInput);
  const to = validateInput(toInput);

  if (!from || !to) {
    return;
  }

  const min = Math.min(from, to);
  const interval = Math.abs(from - to);
  const timeToWait = Math.floor(min + Math.random() * interval);

  showOnly(loaderElement);

  mainTimeoutId = setTimeout(function () {
    timeoutSound.play();
    showOnly(timeoutElement);
  }, timeToWait * 1000);

});

document.getElementById('cancel').addEventListener('click', function() {
  clearTimeout(mainTimeoutId);
  showOnly(formElement);
});

document.getElementById('restart').addEventListener('click', function() {
  showOnly(formElement);
});

