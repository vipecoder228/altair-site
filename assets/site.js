(function () {
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---- Starfield (static, drawn once per resize) ---- */
  var stars = document.getElementById('stars');
  if (stars) {
    var sctx = stars.getContext('2d');
    var drawStars = function () {
      var hero = stars.parentElement;
      var dpr = Math.min(window.devicePixelRatio || 1, 2);
      var w = hero.clientWidth;
      var h = hero.clientHeight;
      stars.width = Math.round(w * dpr);
      stars.height = Math.round(h * dpr);
      sctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      sctx.clearRect(0, 0, w, h);
      var n = Math.round((w * h) / 9000);
      for (var i = 0; i < n; i++) {
        var x = Math.random() * w;
        var y = Math.random() * h;
        var r = Math.random() * 1.4 + 0.4;
        var a = Math.random() * 0.6 + 0.15;
        var blue = Math.random() < 0.28;
        sctx.beginPath();
        sctx.fillStyle = blue
          ? 'rgba(150,170,255,' + a + ')'
          : 'rgba(255,255,255,' + a + ')';
        sctx.arc(x, y, r, 0, Math.PI * 2);
        sctx.fill();
      }
    };
    drawStars();
    window.addEventListener('resize', drawStars);
    if (document.fonts && document.fonts.ready) {
      document.fonts.ready.then(drawStars);
    }
  }

  /* ---- Commands table (ticker + chat + terminal share it) ---- */
  var isEN = (document.documentElement.lang || '').toLowerCase().indexOf('en') === 0;
  var L = isEN ? {
    micIdle: 'Click — the wave will catch your voice',
    micOn: 'Listening… go ahead',
    micOnShort: 'Listening…',
    micNoDevice: 'The browser blocked the microphone',
    micFail: 'Microphone unavailable',
    micAriaOn: 'Toggle listening demo',
    micAriaOff: 'Turn off listening demo'
  } : {
    micIdle: 'Нажми — и волна поймает твой голос',
    micOn: 'Слушаю… говори',
    micOnShort: 'Слушаю…',
    micNoDevice: 'Браузер не дал доступ к микрофону',
    micFail: 'Микрофон недоступен',
    micAriaOn: 'Включить демонстрацию прослушивания',
    micAriaOff: 'Выключить демонстрацию прослушивания'
  };
  var COMMANDS = isEN ? [
    ['Jarvis, play music for work', 'Done, playing music'],
    ['Jarvis, set a timer for 25 minutes', 'Timer set: 25 minutes'],
    ['Jarvis, show heavy processes', 'Opening the task manager'],
    ['Jarvis, work mode', 'Everything you need is open'],
    ['Jarvis, analyze my screen', 'Screenshot taken — here is what is on it'],
    ['Jarvis, movie scene', 'Movie scene is on'],
    ['Jarvis, close the window', 'Done, the window is closed'],
    ['Jarvis, remember how I make presentations', 'Saved it as a skill'],
    ['Jarvis, play Spotify', 'Playing Spotify'],
    ['Jarvis, remind me in an hour', 'I will remind you in an hour'],
    ['Jarvis, take a screenshot', 'Screenshot taken — ask me to analyze it'],
    ['Jarvis, what is on my schedule', 'Showing today’s schedule'],
    ['Jarvis, open downloads', 'Opening your downloads folder'],
    ['Jarvis, play the charts', 'Playing the charts'],
    ['Jarvis, turn on the kitchen light', 'Kitchen light is on'],
    ['Jarvis, set 23 degrees in the bedroom', 'Bedroom set to 23 degrees'],
    ['Jarvis, turn everything off', 'Everything is off'],
    ['Jarvis, if battery drops below 20% — enable quiet mode', 'Rule saved: below 20% — quiet mode'],
    ['Jarvis, when I plug in the charger — open the desktop', 'Rule saved: charger connected — desktop opens'],
    ['Jarvis, if I don’t move the mouse for 10 minutes — lock the PC', 'Rule saved: idle 10 minutes — PC locked'],
    ['Jarvis, weather', 'Weather is ready — showing it on screen'],
    ['Jarvis, dollar rate', 'Dollar rate — showing it on screen'],
    ['Jarvis, briefing', 'Briefing ready: weather, rates, news']
  ] : [
    ['Джарвис, включи музыку для работы', 'Готово, включаю музыку'],
    ['Джарвис, поставь таймер на 25 минут', 'Таймер поставлен — 25 минут'],
    ['Джарвис, покажи тяжёлые процессы', 'Открываю диспетчер задач'],
    ['Джарвис, режим работы', 'Всё нужное открыто'],
    ['Джарвис, разбери экран', 'Скриншот готов — вот что на нём'],
    ['Джарвис, сцена кино', 'Сцена «Кино» включена'],
    ['Джарвис, закрой окно', 'Готово, окно закрыто'],
    ['Джарвис, запомни, как я делаю презентацию', 'Записал — сохранил в навыки'],
    ['Джарвис, включи Spotify', 'Включаю Spotify'],
    ['Джарвис, напомни через час', 'Напомню через час'],
    ['Джарвис, сделай скриншот', 'Скриншот готов — попроси «разбери экран»'],
    ['Джарвис, что у меня в расписании', 'Показываю расписание на сегодня'],
    ['Джарвис, открой загрузки', 'Открываю папку загрузок'],
    ['Джарвис, включи чарт', 'Включаю чарт'],
    ['Джарвис, включи свет на кухне', 'Свет на кухне включён'],
    ['Джарвис, поставь 23 градуса в спальне', 'В спальне 23 градуса'],
    ['Джарвис, выключи всё', 'Всё выключено'],
    ['Джарвис, если заряд ниже 20% — включи тихий режим', 'Правило готово: заряд ниже 20% — тихий режим'],
    ['Джарвис, когда подключу зарядку — открой рабочий стол', 'Правило готово: зарядка подключена — рабочий стол'],
    ['Джарвис, если я не двигаю мышь 10 минут — заблокируй компьютер', 'Правило готово: простой 10 минут — блокировка'],
    ['Джарвис, погода', 'Погода готова — покажу на экране'],
    ['Джарвис, курс доллара', 'Курс доллара — покажу на экране'],
    ['Джарвис, брифинг', 'Брифинг готов: погода, курсы, новости']
  ];
  window.altairCommands = COMMANDS;

  /* ---- Live chat demo (typing bubbles) ---- */
  var chat = document.getElementById('chat');
  if (chat) {
    var userEl = document.getElementById('chatUser');
    var altEl = document.getElementById('chatAlt');
    var AUTO = [0, 1, 3];
    var chatTimers = [];
    var pairIdx = 0;
    var chatStopped = false;
    var chatBusy = false;
    var later = function (fn, ms) { chatTimers.push(setTimeout(fn, ms)); };
    var clearChatTimers = function () {
      chatTimers.forEach(clearTimeout);
      chatTimers = [];
    };
    var typeUser = function (text, done) {
      var i = 0;
      userEl.textContent = '';
      (function step() {
        if (chatStopped) return;
        i++;
        userEl.textContent = text.slice(0, i);
        if (i < text.length) later(step, 32 + Math.random() * 42);
        else done();
      })();
    };
    /* types query, thinks, shows reply, holds, clears — then calls done() */
    var showExchange = function (q, a, holdMs, done) {
      chat.classList.remove('is-out', 'is-thinking');
      altEl.textContent = '';
      typeUser(q, function () {
        later(function () {
          chat.classList.add('is-thinking');
          later(function () {
            chat.classList.remove('is-thinking');
            altEl.textContent = a;
            later(function () {
              chat.classList.add('is-out');
              later(function () {
                userEl.textContent = '';
                altEl.textContent = '';
                chat.classList.remove('is-out');
                chatBusy = false;
                done();
              }, 480);
            }, holdMs);
          }, 950);
        }, 520);
      });
    };
    var chatCycle = function () {
      if (chatStopped || chatBusy) return;
      chatBusy = true;
      var pair = COMMANDS[AUTO[pairIdx % AUTO.length]];
      showExchange(pair[0], pair[1], 2300, function () {
        pairIdx++;
        later(chatCycle, 380);
      });
    };
    var chatRun = function (q, a) {
      if (chatStopped) return;
      clearChatTimers();
      chatBusy = true;
      chat.classList.remove('is-thinking', 'is-out');
      showExchange(q, a, 3400, function () { pairIdx = 0; chatCycle(); });
    };
    window.altairChat = { run: chatRun };
    if (!reduce) {
      userEl.textContent = '';
      altEl.textContent = '';
      chatCycle();
      document.addEventListener('visibilitychange', function () {
        if (document.hidden) {
          chatStopped = true;
          clearChatTimers();
        } else if (chatStopped) {
          chatStopped = false;
          clearChatTimers();
          chat.classList.remove('is-out', 'is-thinking');
          chatBusy = false;
          chatCycle();
        }
      });
    }
  }

  /* ---- Command chips drive the chat (ticker + categories section) ---- */
  var onCmdClick = function (e) {
    var chip = e.target.closest ? e.target.closest('.cmd') : null;
    if (!chip || chip.tagName !== 'BUTTON' && !chip.dataset.i) return;
    var i = parseInt(chip.dataset.i, 10);
    var pair = COMMANDS[i];
    if (!pair) return;
    var hero = document.querySelector('.hero');
    if (hero) hero.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth', block: 'start' });
    window.altairChat.run(pair[0], pair[1]);
  };
  if (window.altairChat) {
    var ticker = document.querySelector('.ticker');
    if (ticker) ticker.addEventListener('click', onCmdClick);
    var cmdSec = document.getElementById('commands');
    if (cmdSec) cmdSec.addEventListener('click', onCmdClick);
  }

  /* ---- Lightbox for screenshots ---- */
  var lb = document.getElementById('lightbox');
  if (lb) {
    var figures = Array.prototype.slice.call(document.querySelectorAll('.shots figure'));
    var lbImg = document.getElementById('lbImg');
    var lbCap = document.getElementById('lbCap');
    var lbCur = 0;
    var lbLastFocus = null;
    var lbOpen = function (i) {
      lbCur = (i + figures.length) % figures.length;
      var img = figures[lbCur].querySelector('img');
      var cap = figures[lbCur].querySelector('figcaption');
      lbImg.src = img.getAttribute('src');
      lbImg.alt = img.getAttribute('alt') || '';
      lbCap.textContent = cap ? cap.textContent : '';
      lb.hidden = false;
      document.body.classList.add('lb-open');
      lb.querySelector('.lb-close').focus();
    };
    var lbClose = function () {
      lb.hidden = true;
      document.body.classList.remove('lb-open');
      if (lbLastFocus) lbLastFocus.focus();
    };
    figures.forEach(function (fig, i) {
      var img = fig.querySelector('img');
      img.style.cursor = 'zoom-in';
      img.addEventListener('click', function () {
        lbLastFocus = img;
        lbOpen(i);
      });
    });
    lb.addEventListener('click', function (e) {
      if (e.target.closest('[data-lb-close]') || e.target === lb) lbClose();
      else if (e.target.closest('[data-lb-prev]')) lbOpen(lbCur - 1);
      else if (e.target.closest('[data-lb-next]')) lbOpen(lbCur + 1);
    });
    document.addEventListener('keydown', function (e) {
      if (lb.hidden) return;
      if (e.key === 'Escape') lbClose();
      else if (e.key === 'ArrowLeft') lbOpen(lbCur - 1);
      else if (e.key === 'ArrowRight') lbOpen(lbCur + 1);
    });
  }

  /* ---- Practice terminal ---- */
  var termForm = document.getElementById('termForm');
  if (termForm) {
    var termLog = document.getElementById('termLog');
    var termInput = document.getElementById('termInput');
    var termAnswer = function (raw) {
      var q = raw.toLowerCase();
      var rules = isEN ? [
        [/timer/, 'Timer set: 25 minutes'],
        [/music|spotify|song/, 'Done, playing music'],
        [/scene|movie/, 'Movie scene is on'],
        [/remember|save/, 'Saved — wrote it to your skills'],
        [/process|task/, 'Opening the task manager'],
        [/screenshot|screen/, 'Screenshot taken — ask me to analyze it'],
        [/hello|hi\b/, 'Hello. Ready when you are.'],
        [/help|command/, 'Commands: timer, music, scene, screenshot, remember, processes'],
        [/version/, 'Altair 1.6.4'],
        [/who are you|what are you/, 'I am Altair, a voice assistant for Windows'],
        [/jarvis/, 'Listening.']
      ] : [
        [/таймер|таймер/, 'Таймер поставлен — 25 минут'],
        [/музык|спотиф|песн/, 'Готово, включаю музыку'],
        [/сцена|кино/, 'Сцена «Кино» включена'],
        [/запомн|помни|сохрани/, 'Записал — сохранил в навыки'],
        [/процесс|диспетчер/, 'Открываю диспетчер задач'],
        [/скриншот|снимок/, 'Скриншот готов — попроси «разбери экран»'],
        [/привет|здоров/, 'Привет. Готов к работе.'],
        [/помощ|help|команд/, 'Команды: таймер, музыка, сцена, скриншот, запомни, процессы'],
        [/версия/, 'Altair 1.6.4'],
        [/кто ты|что ты/, 'Я Altair — голосовой ассистент для Windows'],
        [/джарвис|jarvis/, 'Слушаю.']
      ];
      for (var r = 0; r < rules.length; r++) {
        if (rules[r][0].test(q)) return rules[r][1];
      }
      return isEN
        ? 'I do not know that one yet — but I can learn: say «remember…»'
        : 'Такой команды я пока не знаю — но могу научиться: скажи «запомни…»';
    };
    termForm.addEventListener('submit', function (e) {
      e.preventDefault();
      var v = termInput.value.trim();
      if (!v) return;
      var u = document.createElement('p');
      u.className = 'term-line term-user';
      u.textContent = v;
      termLog.appendChild(u);
      var a = document.createElement('p');
      a.className = 'term-line term-ans';
      a.textContent = termAnswer(v);
      termLog.appendChild(a);
      termInput.value = '';
      termLog.scrollTop = termLog.scrollHeight;
    });
  }

  /* ---- Steps connector: draw when in view ---- */
  var steps = document.querySelector('.steps');
  if (steps) {
    if ('IntersectionObserver' in window) {
      var stepsIO = new IntersectionObserver(function (entries) {
        entries.forEach(function (e) {
          if (e.isIntersecting) {
            steps.classList.add('drawn');
            stepsIO.disconnect();
          }
        });
      }, { threshold: 0.3 });
      stepsIO.observe(steps);
    } else {
      steps.classList.add('drawn');
    }
  }

  /* ---- Starfield parallax ---- */
  if (!reduce && stars) {
    var starTick = false;
    window.addEventListener('scroll', function () {
      if (starTick) return;
      starTick = true;
      requestAnimationFrame(function () {
        var y = Math.min(window.scrollY || 0, window.innerHeight);
        stars.style.transform = 'translateY(' + (y * 0.22) + 'px)';
        starTick = false;
      });
    }, { passive: true });
  }

  /* ---- FAQ: one item open at a time ---- */
  var faqItems = document.querySelectorAll('.faq-item');
  Array.prototype.forEach.call(faqItems, function (item) {
    item.addEventListener('toggle', function () {
      if (item.open) {
        Array.prototype.forEach.call(faqItems, function (other) {
          if (other !== item) other.open = false;
        });
      }
    });
  });

  /* ---- Listening wave (dock) ---- */
  var canvas = document.getElementById('wave');
  var btn = document.getElementById('micBtn');
  var label = document.getElementById('micLabel');
  if (!canvas || !btn) return;

  var ctx = canvas.getContext('2d');
  var mode = 'idle';
  var stream = null;
  var audioCtx = null;
  var analyser = null;
  var buf = null;
  var smoothAmp = 0;
  var prevY = null;
  var raf = 0;
  var start = performance.now();
  var W = 0, H = 0;

  function resize() {
    var dpr = Math.min(window.devicePixelRatio || 1, 2);
    W = canvas.clientWidth;
    H = canvas.clientHeight;
    canvas.width = Math.round(W * dpr);
    canvas.height = Math.round(H * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    prevY = null;
  }

  function wakeEnv(now) {
    var t = (now - start) / 1000;
    if (t < 1.1) {
      var r = t / 1.1;
      return 0.34 + 0.66 * (r * r * (3 - 2 * r));
    }
    return 0.34 + 0.66 * Math.exp(-(t - 1.1) * 1.7);
  }

  function draw(now) {
    var mid = H / 2;
    var half = H / 2 - 5;
    var n = Math.max(70, Math.floor(W / 6));
    var t = now / 1000;
    var amp;

    if (mode === 'mic' && analyser) {
      analyser.getByteTimeDomainData(buf);
      var sum = 0;
      for (var k = 0; k < buf.length; k++) {
        var d = (buf[k] - 128) / 128;
        sum += d * d;
      }
      var rms = Math.sqrt(sum / buf.length);
      amp = Math.min(1, Math.max(0.08, rms * 2.6));
    } else {
      amp = wakeEnv(now);
    }
    smoothAmp += (amp - smoothAmp) * 0.16;

    if (!prevY) {
      prevY = new Float32Array(n + 1);
      for (var i0 = 0; i0 <= n; i0++) prevY[i0] = mid;
    }

    ctx.clearRect(0, 0, W, H);

    ctx.beginPath();
    ctx.strokeStyle = 'rgba(150, 165, 255, 0.16)';
    ctx.lineWidth = 1;
    ctx.moveTo(0, mid);
    ctx.lineTo(W, mid);
    ctx.stroke();

    ctx.beginPath();
    ctx.lineWidth = 2.6;
    ctx.lineJoin = 'round';
    ctx.lineCap = 'round';
    if (mode === 'mic') {
      ctx.strokeStyle = '#FFC53D';
      ctx.shadowColor = 'rgba(255, 197, 61, 0.6)';
    } else {
      ctx.strokeStyle = 'rgba(200, 210, 255, 0.95)';
      ctx.shadowColor = 'rgba(46, 68, 255, 0.55)';
    }
    ctx.shadowBlur = 10;

    for (var i = 0; i <= n; i++) {
      var x = (i / n) * W;
      var y;
      if (mode === 'mic' && buf) {
        var idx = Math.floor((i / n) * (buf.length - 1));
        y = mid + ((buf[idx] - 128) / 128) * half;
      } else {
        var v = Math.sin(x * 0.045 + t * 2.1) * 0.55 +
                Math.sin(x * 0.013 - t * 1.3) * 0.3 +
                Math.sin(x * 0.09 + t * 3.4) * 0.15;
        y = mid + v * half * smoothAmp;
      }
      prevY[i] += (y - prevY[i]) * 0.38;
      if (i === 0) ctx.moveTo(x, prevY[i]);
      else ctx.lineTo(x, prevY[i]);
    }
    ctx.stroke();
    ctx.shadowBlur = 0;
  }

  function loop() {
    if (mode === 'mic') {
      draw(performance.now());
      raf = requestAnimationFrame(loop);
    }
  }

  function startMic() {
    if (reduce) {
      mode = 'mic';
      btn.setAttribute('aria-pressed', 'true');
      label.textContent = L.micOnShort;
      return;
    }
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      label.textContent = L.micNoDevice;
      return;
    }
    navigator.mediaDevices.getUserMedia({ audio: true }).then(function (s) {
      stream = s;
      var AC = window.AudioContext || window.webkitAudioContext;
      audioCtx = new AC();
      var src = audioCtx.createMediaStreamSource(stream);
      analyser = audioCtx.createAnalyser();
      analyser.fftSize = 1024;
      buf = new Uint8Array(analyser.fftSize);
      src.connect(analyser);
      mode = 'mic';
      btn.setAttribute('aria-pressed', 'true');
      btn.setAttribute('aria-label', L.micAriaOff);
      label.textContent = L.micOn;
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(loop);
    }).catch(function () {
      label.textContent = L.micFail;
    });
  }

  function stopMic() {
    if (stream) {
      stream.getTracks().forEach(function (tr) { tr.stop(); });
      stream = null;
    }
    if (audioCtx) {
      audioCtx.close();
      audioCtx = null;
    }
    analyser = null;
    mode = 'idle';
    btn.setAttribute('aria-pressed', 'false');
    btn.setAttribute('aria-label', L.micAriaOn);
    label.textContent = L.micIdle;
    cancelAnimationFrame(raf);
    raf = 0;
    if (!reduce) draw(performance.now());
  }

  btn.addEventListener('click', function () {
    if (mode === 'mic') stopMic();
    else startMic();
  });

  document.addEventListener('visibilitychange', function () {
    if (document.hidden) {
      cancelAnimationFrame(raf);
      raf = 0;
    } else if (mode === 'mic' && !reduce) {
      raf = requestAnimationFrame(loop);
    }
  });

  resize();
  window.addEventListener('resize', function () {
    resize();
    draw(performance.now());
  });

  if (reduce) {
    draw(start + 4000);
  } else {
    (function idle() {
      if (mode === 'idle') draw(performance.now());
      requestAnimationFrame(idle);
    })();
  }
})();
