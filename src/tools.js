// ══════════════════════════════════════════════
//  ALFABETO ESPAÑOL CODIFICADO (imagen de referencia)
//  CH=4, LL=14, Ñ=17 — dígrafos procesados primero
// ══════════════════════════════════════════════
const ALFABETO = [
  // Dígrafos primero (orden importa para el parsing)
  { letra: 'CH', num: 4  },
  { letra: 'LL', num: 14 },
  // Letras simples
  { letra: 'A',  num: 1  },
  { letra: 'B',  num: 2  },
  { letra: 'C',  num: 3  },
  { letra: 'D',  num: 5  },
  { letra: 'E',  num: 6  },
  { letra: 'F',  num: 7  },
  { letra: 'G',  num: 8  },
  { letra: 'H',  num: 9  },
  { letra: 'I',  num: 10 },
  { letra: 'J',  num: 11 },
  { letra: 'K',  num: 12 },
  { letra: 'L',  num: 13 },
  { letra: 'M',  num: 15 },
  { letra: 'N',  num: 16 },
  { letra: 'Ñ',  num: 17 },
  { letra: 'O',  num: 18 },
  { letra: 'P',  num: 19 },
  { letra: 'Q',  num: 20 },
  { letra: 'R',  num: 21 },
  { letra: 'S',  num: 21 },  // S=21 según la tabla
  { letra: 'T',  num: 22 },
  { letra: 'U',  num: 23 },
  { letra: 'V',  num: 24 },
  { letra: 'W',  num: 25 },
  { letra: 'X',  num: 26 },
  { letra: 'Y',  num: 27 },
  { letra: 'Z',  num: 28 },
];

// Construir mapa rápido
const MAPA = {};
ALFABETO.forEach(e => { MAPA[e.letra] = e.num; });

// ── RENDERIZAR TABLA ──
document.addEventListener('DOMContentLoaded', () => {
  const tabla = document.getElementById('alfa-tabla');
  if (!tabla) return;
  ALFABETO.forEach(e => {
    const cell = document.createElement('div');
    cell.className = 'alfa-cell';
    cell.innerHTML = `<span class="alfa-letra">${e.letra}</span><span class="alfa-num">${e.num}</span>`;
    tabla.appendChild(cell);
  });

  // Fecha por defecto = hoy
  const calInput = document.getElementById('cal-input');
  if (calInput) {
    const hoy = new Date();
    calInput.value = hoy.toISOString().split('T')[0];
  }
});

// ── TRADUCTOR ──
window.traducir = function() {
  const input   = document.getElementById('traductor-input').value.toUpperCase();
  const resDiv  = document.getElementById('traductor-result');
  if (!input.trim()) { resDiv.style.display='none'; return; }

  let i = 0;
  const partes  = [];
  let   total   = 0;

  while (i < input.length) {
    // Intentar dígrafo primero
    const dos = input.substring(i, i+2);
    if (MAPA[dos] !== undefined) {
      partes.push({ letra: dos, num: MAPA[dos] });
      total += MAPA[dos];
      i += 2;
      continue;
    }
    const una = input[i];
    if (MAPA[una] !== undefined) {
      partes.push({ letra: una, num: MAPA[una] });
      total += MAPA[una];
    } else if (una === ' ') {
      partes.push({ letra: ' ', num: null });
    }
    i++;
  }

  // Generar desglose
  const desglose = partes
    .map(p => p.num !== null ? `<span style="color:var(--blanco)">${p.letra}</span>=<span style="color:var(--dorado)">${p.num}</span>` : '&nbsp;')
    .join(' + ');

  // Reducción a un dígito (opcional)
  let reduccion = '';
  let n = total;
  const pasos = [total];
  while (n > 9 && n !== 11 && n !== 22 && n !== 33) {
    n = String(n).split('').reduce((a,b) => a + parseInt(b), 0);
    pasos.push(n);
  }
  if (pasos.length > 1) {
    reduccion = `<div class="result-detail">Reducción: ${pasos.join(' → ')}</div>`;
  }

  resDiv.innerHTML = `
    <div style="font-size:.8rem;color:var(--gris);margin-bottom:.5rem">${desglose}</div>
    <div class="result-num">${total}</div>
    ${reduccion}`;
  resDiv.style.display = 'block';
};

// ── CALENDARIO BABILÓNICO (360 días/año, 12 meses × 30 días) ──
// Fecha base: 1 de enero de 539 a.C. (caída de Babilonia)
// Usamos como época el año 539 a.C. = año 1 del calendario
// En práctica: contamos días desde epoch gregoriano y dividimos por 360.

const MESES_BABILONICOS = [
  'Nisanu','Aiaru','Simanu','Duzu',
  'Abu','Ululu','Tashritu','Arakhsamna',
  'Kislimu','Tebetu','Shabatu','Addaru'
];

// Época: 23 de marzo de 539 a.C. (inicio del año nuevo babilónico en año de caída)
// Aproximación: usamos JDN (Julian Day Number) para precisión
function gregorioAJDN(year, month, day) {
  const a = Math.floor((14 - month) / 12);
  const y = year + 4800 - a;
  const m = month + 12 * a - 3;
  return day + Math.floor((153*m+2)/5) + 365*y + Math.floor(y/4) - Math.floor(y/100) + Math.floor(y/400) - 32045;
}

// Época babilónica: 23 de marzo de -538 (539 a.C. en astronomía = -538)
const EPOCA_JDN = gregorioAJDN(-538, 3, 23);

window.calcularBabilonico = function() {
  const val = document.getElementById('cal-input').value;
  const resDiv = document.getElementById('cal-result');
  if (!val) { resDiv.style.display='none'; return; }

  const [yyyy, mm, dd] = val.split('-').map(Number);
  const jdn = gregorioAJDN(yyyy, mm, dd);
  const diasDesdeEpoca = jdn - EPOCA_JDN;

  if (diasDesdeEpoca < 0) {
    resDiv.innerHTML = '<div style="color:var(--gris)">Fecha anterior a la época babilónica de referencia.</div>';
    resDiv.style.display='block';
    return;
  }

  const anioBab  = Math.floor(diasDesdeEpoca / 360) + 1;
  const diasRest = diasDesdeEpoca % 360;
  const mesBab   = Math.floor(diasRest / 30) + 1;
  const diaBab   = (diasRest % 30) + 1;
  const nombreMes = MESES_BABILONICOS[mesBab - 1];

  // Fecha gregoriana seleccionada formateada
  const fechaGreg = new Date(yyyy, mm-1, dd).toLocaleDateString('es-ES', {
    day:'numeric', month:'long', year:'numeric'
  });

  resDiv.innerHTML = `
    <div style="color:var(--gris);font-size:.78rem;margin-bottom:.4rem">${fechaGreg}</div>
    <div class="result-num">${anioBab}</div>
    <div class="result-detail">Año babilónico <strong style="color:var(--dorado)">${anioBab}</strong></div>
    <div class="result-detail" style="margin-top:.3rem">
      Mes: <strong style="color:var(--dorado)">${mesBab} — ${nombreMes}</strong>
    </div>
    <div class="result-detail">
      Día: <strong style="color:var(--dorado)">${diaBab}</strong>
    </div>
    <div class="result-detail" style="margin-top:.5rem;font-size:.78rem;opacity:.6">
      Días transcurridos desde época: ${diasDesdeEpoca.toLocaleString('es-ES')}
    </div>`;
  resDiv.style.display='block';
};
