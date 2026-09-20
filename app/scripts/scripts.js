let rowCount = 0;
const container = document.getElementById('rows-container');
const totalVolumeEl = document.getElementById('total-volume');
const totalCbuqEl = document.getElementById('total-cbuq');

function readValue(input){
  const raw = (input.value || '').replace(',', '.');
  return parseFloat(raw) || 0;
}

function truncate(n, decimals){
  const factor = Math.pow(10, decimals);
  return Math.trunc(n * factor) / factor;
}

function formatNum(n){
  return truncate(n, 4).toLocaleString('pt-BR', {minimumFractionDigits:4, maximumFractionDigits:4});
}

function addRow(){
  const card = document.createElement('div');
  card.className = 'row-card';
  card.innerHTML = `
    <div class="row-head">
      <span class="row-title">Estaca</span>
      <button class="remove-btn" type="button">Remover</button>
    </div>
    <div class="fields">
      <div class="field">
        <label>Bordo Esq.</label>
        <input type="text" inputmode="decimal" class="bordo-pos" placeholder="0,000">
      </div>
      <div class="field">
        <label>Eixo</label>
        <input type="text" inputmode="decimal" class="eixo" placeholder="0,000">
      </div>
      <div class="field">
        <label>Bordo Dir.</label>
        <input type="text" inputmode="decimal" class="bordo-neg" placeholder="0,000">
      </div>
    </div>
    <div class="row-result">
      <span>Área: <b class="row-area">0,000 m²</b></span>
      <span>Vol. acum.: <b class="row-vol">0,000 m³</b></span>
      <span>CBUQ acum.: <b class="row-cbuq">0,000 ton</b></span>
    </div>
  `;
  container.appendChild(card);

  card.querySelectorAll('input').forEach(inp => {
    inp.addEventListener('input', calculateAll);
  });
  card.querySelector('.remove-btn').addEventListener('click', () => {
    card.remove();
    calculateAll();
  });

  calculateAll();
}

function calculateAll(){
  const densidade = readValue(document.getElementById('cfg-densidade'));
  const espacamento = 20;
  const distB = 2;
  const distN = 1.6;
  const semiDist = espacamento / 2;

  let prevArea = null;
  let volumeAcumulado = 0;
  const cards = document.querySelectorAll('.row-card');

  cards.forEach((card, idx) => {
    card.querySelector('.row-title').textContent = 'Estaca ' + idx;

    const bordoPos = readValue(card.querySelector('.bordo-pos'));
    const eixo = readValue(card.querySelector('.eixo'));
    const bordoNeg = readValue(card.querySelector('.bordo-neg'));

    const areaParcial = (bordoPos + eixo) / 2 * distB + (eixo + bordoNeg) / 2 * distN;

    if (prevArea !== null){
      const areaAcumulada = prevArea + areaParcial;
      const volumeParcial = areaAcumulada * semiDist;
      volumeAcumulado += volumeParcial;
    }
    prevArea = areaParcial;

    card.querySelector('.row-area').textContent = formatNum(areaParcial) + ' m²';
    card.querySelector('.row-vol').textContent = formatNum(volumeAcumulado) + ' m³';
    card.querySelector('.row-cbuq').textContent = formatNum(volumeAcumulado * densidade) + ' ton';
  });

  totalVolumeEl.textContent = formatNum(volumeAcumulado) + ' m³';
  totalCbuqEl.textContent = formatNum(volumeAcumulado * densidade) + ' ton';
}

document.getElementById('cfg-densidade').addEventListener('input', calculateAll);

const addBtn = document.createElement('button');
addBtn.className = 'add-btn';
addBtn.type = 'button';
addBtn.textContent = '+ Adicionar estaca';
addBtn.addEventListener('click', addRow);
document.querySelector('main').appendChild(addBtn);

addRow();
addRow();