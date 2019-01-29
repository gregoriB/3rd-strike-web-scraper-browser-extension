const moveSet  = document.querySelectorAll('li'),
      charName = document.querySelector('#topTitle');

let charData = {}

function buildObject(type) {
  charData = {}
  charData.name = charName.innerText;
  charData.category = type;
  const th = document.querySelectorAll('th'),
        tr = document.querySelectorAll('tr'),
        dd = document.querySelectorAll('dd');
  if (dd.length > 0) {
    dd.forEach(data => {
      const p = data.querySelector('p');
      charData[p.innerText] = data.innerText.split(': ')[1]; // splitting at ': ' because data.innerText pulls the text from the <p> as well
    });
  } 
  else if (tr.length > 0) {
    tr.forEach(row => {
      const obj = {},
             td = row.querySelectorAll('td');
      for (let i = 2; i < th.length; i++) {
        if(td[i]) {
          obj[th[i].innerText] = td[i].innerText.trim();
        }
      }
      if (td[1]) charData[td[1].innerText] = obj; // push temp object into the main charData object
    });
  } 
}

const downloadFile = () => {
  const file   = new Blob([JSON.stringify(charData, null, '\t')], {type: 'application/json'}),
        a      = document.createElement('a'),
        name   = charData.name.split(' ')[0] + ' ' + charData.category + '.json';
  document.body.appendChild(a); // download doesn't work in firefox unless the <a> exists in the body
  a.style.display = 'none';
  a.href = URL.createObjectURL(file);
  a.download = name;
  a.click();
}

function exportObject() {
  if (this.id === 'general_basic' || this.id === 'general_moves') return;
 
  setTimeout(() => {
    buildObject(this.innerText);
    downloadFile();
  }, 1000); // setTimeout gives the webpage time to fetch the data from the database
}

moveSet.forEach(li => li.addEventListener('click', exportObject));