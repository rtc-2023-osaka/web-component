const toCSV = arr => {
  var fields = Object.keys(arr[0])
  var replacer = function (key, value) { return value === null ? '' : value }
  var csv = arr.map(function (row) {
    return fields.map(function (fieldName) {
      return JSON.stringify(row[fieldName], replacer)
    }).join(',')
  })
  csv.unshift(fields.join(',')) // add header column
  csv = csv.join('\r\n');
  return csv
}

const fromCSV = (text, quoteChar = '"', delimiter = ',') => {
  var rows = text.split("\n");
  var headers = rows[0].split(",");

  const regex = new RegExp(`\\s*(${quoteChar})?(.*?)\\1\\s*(?:${delimiter}|$)`, 'gs');

  const match = line => [...line.matchAll(regex)]
    .map(m => m[2])
    .slice(0, -1);

  var lines = text.split('\n');
  const heads = headers ?? match(lines.shift());
  lines = lines.slice(1);

  return lines.map(line => {
    return match(line).reduce((acc, cur, i) => {
      // replace blank matches with `null`
      const val = cur.length <= 0 ? null : Number(cur) || cur;
      const key = heads[i] ?? `{i}`;
      return { ...acc, [key]: val };
    }, {});
  });
}

const downloadFile = (filename, type, csv) => {
  var hiddenElement = document.createElement('a');
  hiddenElement.href = `data:text/${type};charset=UTF-8,\uFEFF${encodeURIComponent(csv)}`;
  hiddenElement.target = '_blank';

  //provide the name for the CSV file to be downloaded  
  hiddenElement.download = filename;
  hiddenElement.click();
}