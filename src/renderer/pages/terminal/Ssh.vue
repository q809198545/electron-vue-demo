<template>
  <div id="wrapper">
    <input type="file" multiple="false" id="sheetjs-input" accept="xls,xlsx" @change="onchange" />
    <br/>
    <button type="button" id="export-table"  @click="onexport">导出EXCEL</button>
    <br/>
    <div id="out-table"></div>
  </div>
  
</template>

<script>
  import XLSX from 'xlsx';
  export default {
    methods: {
      onchange: function (evt) {
        var file;
        var files = evt.target.files;

        if (!files || files.length == 0) return;

        file = files[0];

        var reader = new FileReader();
        reader.onload = function (e) {
          // pre-process data
          var binary = "";
          var bytes = new Uint8Array(e.target.result);
          var length = bytes.byteLength;
          for (var i = 0; i < length; i++) {
            binary += String.fromCharCode(bytes[i]);
          }

          /* read workbook */
          var wb = XLSX.read(binary, {
            type: 'binary'
          });

          /* grab first sheet */
          var wsname = wb.SheetNames[0];
          var ws = wb.Sheets[wsname];

          /* excel转换json数组 */
          var json = XLSX.utils.sheet_to_json(ws, {header:1});
          console.log(json);

          /* json数组转换excel */
          var worksheet = XLSX.utils.aoa_to_sheet(json);
          var new_workbook = XLSX.utils.book_new();
          XLSX.utils.book_append_sheet(new_workbook, worksheet, "sheetjs3");
          XLSX.writeFile(new_workbook, "D://sheetjs3.xlsx");

          /* generate HTML */
          var HTML = XLSX.utils.sheet_to_html(ws);
         
          /* update table */
          document.getElementById('out-table').innerHTML = HTML;
          /* show export button */
          document.getElementById('export-table').style.visibility = "visible";
        };

        reader.readAsArrayBuffer(file);
      },
      onexport: function (evt) {
        /* generate workbook object from table */
        var wb = XLSX.utils.table_to_book(document.getElementById('out-table'));
        /* generate file and force a download*/
        XLSX.writeFile(wb, "D://sheetjs2.xlsx");
      }
    }
  };
</script>