const button   = document.querySelectorAll('li'),
      charName = document.querySelector('#topTitle');

let charData = {},
    th       = document.querySelectorAll('th'),
    tr       = document.querySelectorAll('tr');

function buildObject(type) {
  charData = {}
  charData.name = charName.innerText;
  charData.category = type;
  th = document.querySelectorAll('th');
  tr = document.querySelectorAll('tr');
  tr.forEach(row => {
    const td = row.querySelectorAll('td');
    let obj = {}
    for (let i = 2; i < th.length; i++) if(td[i]) obj[th[i].innerText] = td[i].innerText.trim();
    if (td[1]) charData[td[1].innerText] = obj;
  });
}

const downloadFile = () => {
  const file   = new Blob([JSON.stringify(charData, null, '\t')], {type: 'application/json'}),
        anchor = document.createElement('a'),
        name   = charData.name.split(' ')[0] + ' ' + charData.category + '.json';
  document.body.appendChild(anchor);
  anchor.style.display = 'none';
  anchor.href = URL.createObjectURL(file);
  anchor.download = name;
  anchor.click();
}

function exportObject() {
  setTimeout(() => {
    let type = this.innerText;
    buildObject(type);
    downloadFile();
  }, 1000);
}

button.forEach(li => li.addEventListener('click', exportObject));