let rowCount = 0;
const container = document.getElementById('rows-container');
const totalEl = document.getElementById('total-value');

function readValue(input){
  const raw = (input.value || '').replace(',', '.');
  return parseFloat(raw) || 0;
}

function formatNum(n){
  return n.toLocaleString('pt-BR', {minimumFractionDigits:2, maximumFractionDigits:2});
}

function addRow(){
  rowCount++;
  const id = rowCount;
  const card = document.createElement('div');
  card.className = 'row-card';
  card.dataset.id = id;
  card.innerHTML = `
    <div class="row-head">
      <span>Linha ${id}</span>
      <button class="remove-btn" type="button">Remover</button>
    </div>
    <div class="fields">
      <div class="field">
        <label>Bordo Esq.</label>
        <input type="text" inputmode="decimal" class="bordo" placeholder="0,00">
      </div>
      <div class="field">
        <label>Eixo</label>
        <input type="text" inputmode="decimal" class="eixo" placeholder="0,00">
      </div>
      <div class="field">
        <label>Bordo Dir.</label>
        <input type="text" inputmode="decimal" class="valor3" placeholder="0,00">
      </div>
    </div>
    <div class="row-result">Resultado: <b class="row-val">0.00</b></div>
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
  let total = 0;
  document.querySelectorAll('.row-card').forEach(card => {
    const eixo = readValue(card.querySelector('.eixo'));
    const bordo = readValue(card.querySelector('.bordo'));
    const valor3 = readValue(card.querySelector('.valor3'));
    const result = eixo * bordo * valor3 * 20;
    card.querySelector('.row-val').textContent = formatNum(result);
    total += result;
  });
  totalEl.textContent = formatNum(total);
}

const addBtn = document.createElement('button');
addBtn.className = 'add-btn';
addBtn.type = 'button';
addBtn.textContent = '+ Adicionar linha';
addBtn.addEventListener('click', addRow);
container.appendChild(addBtn);

addRow();