import React, { useEffect } from "react";
const Howtouse = () => {
  useEffect(() => {
    loadTSVFile("TSV/all.tsv");
  }, []);

  const loadTSVFile = (filename) => {
    var xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function() {
      if (xhr.readyState === 4 && xhr.status === 200) {
        var data = xhr.responseText;
        var rows = data.split('\n');
        var headers = rows[0].split('\t');
        var table = document.getElementById('table');
        table.innerHTML = '';
        var thead = table.createTHead();
        var headerRow = thead.insertRow();
        for (var i = 0; i < headers.length; i++) {
          var th = document.createElement('th');
          th.textContent = headers[i];
          headerRow.appendChild(th);
        }
        var tbody = table.createTBody();
        for (i = 1; i < rows.length; i++) {
          var row = tbody.insertRow();
          var cells = rows[i].split('\t');
          for (var j = 0; j < cells.length; j++) {
            var cell = row.insertCell();
            cell.textContent = cells[j];
          }
        }
      }
    };
    xhr.open('GET', filename, true);
    xhr.send();
  }

  return (
    <div>
      <h1>How to use</h1>
      <p>Pick the opening to train from the table below, choose them in the "Main Board" and begin training.</p>
      <table id="table"></table>
    </div>
  );
};

export default Howtouse;
