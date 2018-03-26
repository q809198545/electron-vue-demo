<template>
  <div id="wrapper">
    <input type="file" multiple="false" id="sheetjs-input" accept="xls,xlsx" @change="onchange" />
    <br/>
    <button type="button" id="export-table" v-show="data.length>0" @click="onexportByHtml">根据Html导出Excel</button>
    <br/>
    <button type="button" id="export-table" v-show="data.length>0" @click="onexportByJson">根据Json导出Excel</button>
    <br/>
    <div id="out-table"></div>
  </div>
  
</template>

<script>
  import XLSX from 'xlsx'
  export default {
    data(){
      return{
          data:[]
      }
    },
    methods: {
      onchange: function (evt) {
        var file;
        var files = evt.target.files;
        var self = this;

        if (!files || files.length == 0) return;

        file = files[0];

        var reader = new FileReader();
        reader.onload = function (e) {
          // 数据预处理
          var binary = "";
          var bytes = new Uint8Array(e.target.result);
          var length = bytes.byteLength;
          for (var i = 0; i < length; i++) {
            binary += String.fromCharCode(bytes[i]);
          }

          /* 读取 workbook */
          var wb = XLSX.read(binary, {
            type: 'binary'
          });

          /* 选择第一个sheet */
          var wsname = wb.SheetNames[0];
          var ws = wb.Sheets[wsname];

          /* excel转换json数组,加上{header:1}是普通数组，不写是对象数组 */
          self.data = XLSX.utils.sheet_to_json(ws);
          console.log(self.data);

          /* 生成html表格 */
          var HTML = XLSX.utils.sheet_to_html(ws);
         
          document.getElementById('out-table').innerHTML = HTML;
          /* 显示导出Excel按钮 */
          document.getElementById('export-table').style.visibility = "visible";
        };

        reader.readAsArrayBuffer(file);
      },
      onexportByHtml: function () {
        /* html表格转excel */
        var wb = XLSX.utils.table_to_book(document.getElementById('out-table'));
        /* 生成文件，导出D盘 */
        XLSX.writeFile(wb, "D://sheetjs_html.xlsx");
      },
      onexportByJson: function () {
          /* json数组转换excel */
          var worksheet = XLSX.utils.aoa_to_sheet(this.data);
          var new_workbook = XLSX.utils.book_new();
          XLSX.utils.book_append_sheet(new_workbook, worksheet, "sheetjs");
          /* 生成文件，导出D盘 */
          XLSX.writeFile(new_workbook, "D://sheetjs_json.xlsx");
      }
    }
  };
</script>