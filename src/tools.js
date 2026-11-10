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

// ── CALENDARIO DE 360 DÍAS — AÑOS DE GRACIA ──
// Base: 29 d.C. (muerte y resurrección de Cristo = inicio de los 2000 años de gracia)
// Lógica: contar los días transcurridos desde el 1 de abril del año 29 d.C.
// y dividir entre 360 para obtener el año de gracia actual.
// 2000 años × 360 días = 720,000 días desde el año 29 d.C.

const MESES_BABILONICOS = [
  'Nisanu','Aiaru','Simanu','Duzu',
  'Abu','Ululu','Tashritu','Arakhsamna',
  'Kislimu','Tebetu','Shabatu','Addaru'
];

// Calcular número de día juliano (JDN) para cualquier fecha gregoriana
function toJDN(year, month, day) {
  const a = Math.floor((14 - month) / 12);
  const y = year + 4800 - a;
  const m = month + 12 * a - 3;
  return day + Math.floor((153*m+2)/5) + 365*y +
         Math.floor(y/4) - Math.floor(y/100) + Math.floor(y/400) - 32045;
}

// Época: calculada desde el fin de la gracia hacia atrás
// Fin de la gracia = 11 de abril de 2029 = último día del año 2000
// Inicio día 0 = 11 abril 2029 - (2000 × 360 - 1) días
const JDN_FIN_GRACIA = toJDN(2029, 4, 11);
const JDN_EPOCA = JDN_FIN_GRACIA - (2000 * 360 - 1);

window.calcularBabilonico = function() {
  const val = document.getElementById('cal-input').value;
  const resDiv = document.getElementById('cal-result');
  if (!val) { resDiv.style.display='none'; return; }

  const [yyyy, mm, dd] = val.split('-').map(Number);
  const jdnFecha = toJDN(yyyy, mm, dd);

  const diasTranscurridos = jdnFecha - JDN_EPOCA;

  if (diasTranscurridos < 0) {
    resDiv.innerHTML = '<div style="color:var(--gris)">Fecha anterior al inicio de la era de Gracia (año 29 d.C.).</div>';
    resDiv.style.display = 'block';
    return;
  }

  // Año de gracia (0-based: año 0 = nacimiento de Jesús)
  const anioGracia = Math.floor(diasTranscurridos / 360);
  const diasEnAnio = diasTranscurridos % 360;          // 0-based dentro del año
  const mesBab     = Math.floor(diasEnAnio / 30) + 1; // 1–12
  const diaBab     = (diasEnAnio % 30) + 1;            // 1–30
  const nombreMes  = MESES_BABILONICOS[mesBab - 1];

  // Días restantes para los 2000 años de gracia
  const totalGracia    = 2000 * 360;          // 720,000 días
  const diasRestantes  = totalGracia - diasTranscurridos;
  const aniosRestantes = (diasRestantes / 360).toFixed(1);

  const fechaStr = new Date(yyyy, mm-1, dd).toLocaleDateString('es-ES', {
    day:'numeric', month:'long', year:'numeric'
  });

  const progreso = Math.min(100, ((diasTranscurridos / totalGracia) * 100)).toFixed(2);

  resDiv.innerHTML = `
    <div style="color:var(--gris);font-size:.78rem;margin-bottom:.6rem">${fechaStr}</div>
    <div class="result-num">${anioGracia}</div>
    <div class="result-detail">Año de Gracia <strong style="color:var(--dorado)">${anioGracia}</strong> de 2000 — fin: 11 abril 2029</div>

    <div style="margin:.8rem 0;background:rgba(255,255,255,.06);border-radius:2px;height:6px;">
      <div style="height:6px;background:var(--dorado);width:${progreso}%;border-radius:2px;"></div>
    </div>
    <div style="font-size:.72rem;color:var(--gris);margin-bottom:.8rem">${progreso}% del tiempo de Gracia transcurrido</div>

    <div style="padding-top:.8rem;border-top:1px solid rgba(201,168,76,.2)">
      <div class="result-detail">
        Mes babilónico: <strong style="color:var(--dorado)">${mesBab} — ${nombreMes}</strong>
      </div>
      <div class="result-detail" style="margin-top:.3rem">
        Día del mes: <strong style="color:var(--dorado)">${diaBab} de 30</strong>
      </div>
      <div class="result-detail" style="margin-top:.3rem">
        Días transcurridos desde el año 29 d.C.: <strong style="color:var(--blanco)">${diasTranscurridos.toLocaleString('es-ES')}</strong>
      </div>
      <div class="result-detail" style="margin-top:.3rem">
        Tiempo restante de Gracia: <strong style="color:var(--dorado2)">${diasRestantes > 0 ? '~' + aniosRestantes + ' años de 360 días' : '¡Tiempo cumplido!'}</strong>
      </div>
    </div>`;
  resDiv.style.display = 'block';
};
