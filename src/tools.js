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

// ── CALENDARIO DE 360 DÍAS ──
// Lógica: tomar la fecha gregoriana, calcular cuántos días han pasado
// desde el 1 de enero del mismo año, y convertirlos a un año de 360 días
// (12 meses × 30 días). El año base es el mismo año gregoriano.
//
// Ejemplo: si estamos en el día 180 del año gregoriano,
// en el calendario de 360 días sería el mes 6, día 30 de ese mismo año.

const MESES_BABILONICOS = [
  'Nisanu','Aiaru','Simanu','Duzu',
  'Abu','Ululu','Tashritu','Arakhsamna',
  'Kislimu','Tebetu','Shabatu','Addaru'
];

window.calcularBabilonico = function() {
  const val = document.getElementById('cal-input').value;
  const resDiv = document.getElementById('cal-result');
  if (!val) { resDiv.style.display='none'; return; }

  const [yyyy, mm, dd] = val.split('-').map(Number);
  const fecha = new Date(yyyy, mm-1, dd);

  // Día del año gregoriano (1 = 1 enero)
  const inicio = new Date(yyyy, 0, 1);
  const diffMs = fecha - inicio;
  const diaDelAnio = Math.floor(diffMs / (1000 * 60 * 60 * 24)); // 0-based

  // Total de días del año gregoriano
  const esBisiesto = (yyyy % 4 === 0 && yyyy % 100 !== 0) || (yyyy % 400 === 0);
  const diasAnioGreg = esBisiesto ? 366 : 365;

  // Proporción del año transcurrida, aplicada a 360 días
  // Día equivalente en año de 360 días (0-based)
  const diaEn360 = Math.floor((diaDelAnio / diasAnioGreg) * 360);

  const mesBab  = Math.floor(diaEn360 / 30) + 1;    // 1–12
  const diaBab  = (diaEn360 % 30) + 1;               // 1–30
  const nombreMes = MESES_BABILONICOS[mesBab - 1];

  // Día gregoriano del año (1-based para mostrar)
  const diaGreg = diaDelAnio + 1;

  const fechaStr = fecha.toLocaleDateString('es-ES', {
    day:'numeric', month:'long', year:'numeric'
  });

  resDiv.innerHTML = `
    <div style="color:var(--gris);font-size:.78rem;margin-bottom:.6rem">${fechaStr}</div>
    <div class="result-num">${yyyy}</div>
    <div class="result-detail">Año gregoriano <strong style="color:var(--dorado)">${yyyy}</strong> → equivale al año <strong style="color:var(--dorado)">${yyyy}</strong> en 360 días</div>
    <div style="margin-top:1rem;padding-top:1rem;border-top:1px solid rgba(201,168,76,.2)">
      <div class="result-detail">Día del año gregoriano: <strong style="color:var(--blanco)">${diaGreg} de ${diasAnioGreg}</strong></div>
      <div class="result-detail" style="margin-top:.4rem">Equivalente en año de 360 días: <strong style="color:var(--dorado)">día ${diaEn360 + 1} de 360</strong></div>
      <div class="result-detail" style="margin-top:.4rem">
        Mes babilónico: <strong style="color:var(--dorado)">${mesBab} — ${nombreMes}</strong>
      </div>
      <div class="result-detail" style="margin-top:.2rem">
        Día del mes: <strong style="color:var(--dorado)">${diaBab} de 30</strong>
      </div>
    </div>`;
  resDiv.style.display='block';
};
