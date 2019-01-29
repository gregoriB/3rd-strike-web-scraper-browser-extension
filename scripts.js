const moveSet  = document.querySelectorAll('li'),
      charName = document.querySelector('#topTitle');

let charData = {}

function buildObject(type) {
  charData.name = charName.innerText;
  charData.category = type;
  const dd = document.querySelectorAll('dd'),
        tr = document.querySelectorAll('tr');
  if (dd.length > 0) mapDescriptionListData(dd);
  else if (tr.length > 0) mapTableData(tr);
}

const mapDescriptionListData = (dd) => {
  dd.forEach(data => {
    const p = data.querySelector('p');
    charData[p.innerText] = data.innerText.split(': ')[1]; // splitting at ': ' because data.innerText pulls the text from the <p> as well
  });
}

const mapTableData = (tr) => {
  const th = document.querySelectorAll('th');
  tr.forEach(row => {
    const obj = {},
           td = row.querySelectorAll('td');
    for (let i = 2; i < th.length; i++) {
      if (th[i].innerText === 'Cancel') obj['Cancel'] = mapCancelData(row); // the cancel data is its own list to go through
      else if (td[i]) obj[th[i].innerText] = td[i].innerText.trim();
    }
    if (td[1]) charData[td[1].innerText] = obj; // add temp object into the main charData object
  });
}

const mapCancelData = (row) => {
  const obj   = {},
      cancels = row.querySelectorAll('.BcancelBoxesDisplay');
  cancels.forEach(cancel => {
    const type = cancel.title.split(' cancellable')[0]; // to get rid of redundant text
    if (cancel) {
      cancel.classList.contains('BcancelBit_X') ? obj[type] = false : obj[type] = true;
    }
  });

  return obj;
}

const downloadFile = () => {
  const file = new Blob([JSON.stringify(charData, null, '\t')], {type: 'application/json'}),
        a    = document.createElement('a'),
        name = charData.name.split(' / ')[0] + ` - ${charData.category}.json`;
  document.body.appendChild(a); // download doesn't work in firefox unless the <a> exists in the body
  a.style.display = 'none';
  a.href = URL.createObjectURL(file);
  a.download = name;
  a.click();
  charData = {} // clear data when done
}

function exportObject() {
  if (this.id === 'general_basic' || this.id === 'general_moves') return;
 
  setTimeout(() => {
    // cleaning up innerText of category type
    let type = this.innerText.split('- ')[1];
    if (type[type.length - 1] === '.') type = type.split('.')[0];

    buildObject(type);
    downloadFile();
  }, 1000); // setTimeout gives the webpage time to fetch the data from the database
}

moveSet.forEach(li => li.addEventListener('click', exportObject));