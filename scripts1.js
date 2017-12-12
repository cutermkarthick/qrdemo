
$(document).ready(function(){
(function () {
    'use strict';

    var jq = window.jQuery;
    var guiValuePairs = [
        ['size', 'px'],
        ['minversion', ''],
        ['quiet', ' modules'],
        ['radius', '%'],
        ['msize', '%'],
        ['mposx', '%'],
        ['mposy', '%']
    ];

    function updateGui() {

        jq.each(guiValuePairs, function (idx, pair) {

            var $label = jq('label[for="' + pair[0] + '"]');
            $label.text($label.text().replace(/:.*/, ': ' + jq('#' + pair[0]).val() + pair[1]));
        });
    }

    function updateQrCode(linenum) {

        var options = {
            render: jq('#render').val(),
            ecLevel: jq('#eclevel').val(),
            minVersion: parseInt(jq('#minversion').val(), 10),

            fill: jq('#fill').val(),
            background: jq('#background').val(),

            text: jq('#qrcontent'+linenum).val(),
            id: jq('#qrcontent'+linenum).attr('qrcon_seq'),
            size: parseInt(jq('#size').val(), 10),
            radius: parseInt(jq('#radius').val(), 10) * 0.01,
            quiet: parseInt(jq('#quiet').val(), 10),

            mode: parseInt(jq('#mode').val(), 10),

            mSize: parseInt(jq('#msize').val(), 10) * 0.01,
            mPosX: parseInt(jq('#mposx').val(), 10) * 0.01,
            mPosY: parseInt(jq('#mposy').val(), 10) * 0.01,

            label: jq('#label').val(),
            fontname: jq('#font').val(),
            fontcolor: jq('#fontcolor').val(),

            image: jq('#img-buffer')[0]

        };

        jq('#container'+linenum).empty().qrcode(options);

        var j = 0;
        $('#trqrtable').find('canvas').each(function() {
            j++;
        });

        document.getElementById('qrcount').value = j;
    }

    function update(linenum) {
        
        updateGui();
        updateQrCode(linenum);
    }

    function onImageInput() {

        var input = jq('#image')[0];

        if (input.files && input.files[0]) {
            var reader = new FileReader();
            reader.onload = function (event) {
                jq('#img-buffer').attr('src', event.target.result);
                jq('#mode').val('4');
                setTimeout(update, 250);
            };
            reader.readAsDataURL(input.files[0]);
        }
    }

    function isEmpty(obj) {
    for(var key in obj) {
        if(obj.hasOwnProperty(key))
            return false;
    }
    return true;
}


    function download() {

        var zip = new JSZip();
        zip.file("README.txt", "QR Code Images Generated.\n");
        var img = zip.folder("images");

        var filename = "dec";
        var j = 1;
        $('#trqrtable').find('canvas').each(function() {


            var mycanvasid = jq(this).attr('id');

            var line = jq(this).attr('canvascnt');
            var qrval = jq('#qrid'+line).val();

            var canvas = document.getElementById(mycanvasid);
            var imageData = canvas.toDataURL('image/png');
            var imgsrc = imageData.split(',');
            var imgData = imgsrc[1];
            var imgname = qrval+'.png';
            img.file(imgname, imgData, {base64: true});

            j++;
        });


        $('#trqrtable1').empty();
        var linecnt =  document.getElementById('linecnt').value;

        var i = 1;
        while(i <= linecnt)
        {
            var qridval = $('#qrid'+i).val();
            var qrcontval = $('#qrcontent'+i).val(); 



            var tbody = document.getElementById('trqrtable1');

            

            if (qrcontval !="" ) 
            {   
                var row = document.createElement("TR");

                var cell1 = document.createElement("TD");
                cell1.innerHTML=qridval;

                var cell2 = document.createElement("TD");
                cell2.innerHTML=qrcontval;
                
                

                var canvas = document.getElementById("mycanvas"+i);
                var imageData = canvas.toDataURL('image/png');
                var imgsrc = imageData.split(',');
                var imgData = imgsrc[1];


                var cell3 = document.createElement("TD");
                cell3.innerHTML="<center><img src=\""+imageData+"\"> </center>";

                row.appendChild(cell1);
                row.appendChild(cell2);
                row.appendChild(cell3);

                tbody.appendChild(row);

            } 

            


            i++;
        }
        
        var doc = new jsPDF('p', 'pt', 'ledger');
        doc.text("Left aligned text",2,25);
        // doc.myText("Centered text",{align: "center"},0,1);


        var elem = document.getElementById('qrtable1');
        var imgElements = document.querySelectorAll('#trqrtable1 tr td img');


        var data = doc.autoTableHtmlToJson(elem);
        var images = [];
        var i = 0;
        doc.autoTable(data.columns, data.rows, {
        bodyStyles: {rowHeight: 100},
        drawRow:function(row, data) {
            if (row.cells[1].text != "") 
            {
                row.height = 100;
            }
        },
        drawCell: function(cell, opts) {
            

            if (opts.column.dataKey === 2) {
                
                if (opts.row.cells[1].text != "") 
                {
                    images.push({
                    url: imgElements[i].src,
                    x: cell.textPos.x,
                    y: cell.textPos.y
                    }); 
                }
                       
                 
                i++;
            }

            

        },
        addPageContent: function() {
            
          for (var i = 0; i < images.length; i++) {
            doc.addImage(images[i].url, images[i].x, images[i].y, 100, 100);

          }
        }
        });

        
       
        
        zip.file("QRsummary.pdf", doc.output('blob'));
        // doc.save("QRsummary.pdf");


        zip.generateAsync({type:"blob"})
        .then(function(content) {
            saveAs(content, "archive.zip");
        });


    }

    
    function printQR() 
    {

        $('#trqrtable1').empty();
        var linecnt =  document.getElementById('linecnt').value;

        var i = 1;
        while(i <= linecnt)
        {
            var qridval = $('#qrid'+i).val();
            var qrcontval = $('#qrcontent'+i).val(); 




            var tbody = document.getElementById('trqrtable1');
            var row = document.createElement("TR");

            var cell1 = document.createElement("TD");
            cell1.innerHTML=qridval;

            var cell2 = document.createElement("TD");
            cell2.innerHTML=qrcontval;
            
            row.appendChild(cell1);
            row.appendChild(cell2);

            if (qrcontval !="" ) 
            {
                var canvas = document.getElementById("mycanvas"+i);
                var imageData = canvas.toDataURL('image/png');
                var imgsrc = imageData.split(',');
                var imgData = imgsrc[1];


                var cell3 = document.createElement("TD");
                cell3.innerHTML="<center><img src=\""+imageData+"\"> </center>";

                row.appendChild(cell3);

            } 

            tbody.appendChild(row);


            i++;
        }

        var divToPrint=document.getElementById("qrtable1");
        var newWin= window.open("");
        newWin.document.write(divToPrint.outerHTML);
        newWin.print();
        newWin.close();
    }

    function addrow(index){
        var x=index;
        x++;
        var qrid = "qrid"+x;
        var qrcontent = "qrcontent"+x;
        var container = "container" +x;
        var text = "text" +x;
        var row_close = "row_close" +x;
        var tablerow = "tablerow" +x;


        var tbody = document.getElementById('trqrtable');
        var row = document.createElement("TR");
        row.setAttribute("id",tablerow);

        var cell1 = document.createElement("TD");
        var inp1 =  document.createElement("INPUT");
        inp1.setAttribute("type","text");
        inp1.setAttribute("name",qrid);
        inp1.setAttribute("id",qrid);
        inp1.setAttribute("qrid_seq",x);
        inp1.setAttribute("value","QR-"+ x);
        inp1.setAttribute("class",'qridclass');
        cell1.appendChild(inp1);

        var img1 = document.createElement("img");
        img1.setAttribute("src","images/close1.png");
        img1.setAttribute("alt","Cancel");
        img1.setAttribute("id",row_close);
        img1.style.display = "block";
        img1.style.cursor = "pointer";
        img1.onclick = function(){DeleteRow(x);};
        cell1.appendChild(inp1);
        cell1.appendChild(img1);


        var cell2 = document.createElement("TD");
        cell2.innerHTML='<textarea id='+qrcontent+' name='+qrcontent+' id='+qrcontent+' qrcon_seq='+x+' class=qrconclass  ></textarea>';

        var cell3 = document.createElement("TD");
        cell3.innerHTML='<div id='+container+'></div>';

        


        row.appendChild(cell1);
        row.appendChild(cell2);
        row.appendChild(cell3);

        tbody.appendChild(row);
           


        document.myForm.linecnt.value=x;

        if (x > 3) {
            $('#row_close'+index).css('display','none');
        }


    }

    function DeleteRow(line)
    {   

        $('#tablerow'+line).remove();
        if (line >= 3) {
            var id = parseInt(line) - 1;
            $("#qrid"+id).attr('class','qridclass');
            // $("#qrcontent"+id).attr('class','qrconclass');
            // $("#qrcontent"+id).text();
            // $("#container"+id).html();
            $('#row_close'+id).css('display','block');
        }

        var j = 0;
        $('#trqrtable').find('canvas').each(function() {
            j++;
        });

        document.getElementById('qrcount').value = j;
    }

    function GeneratePDF() {

        $('#trqrtable1').empty();
        var linecnt =  document.getElementById('linecnt').value;

        var i = 1;
        while(i <= linecnt)
        {
            var qridval = $('#qrid'+i).val();
            var qrcontval = $('#qrcontent'+i).val(); 




            var tbody = document.getElementById('trqrtable1');
            

            if (qrcontval !="" ) 
            {   
                var row = document.createElement("TR");

                var cell1 = document.createElement("TD");
                cell1.innerHTML=qridval;

                var cell2 = document.createElement("TD");
                cell2.innerHTML=qrcontval;
                
                

                var canvas = document.getElementById("mycanvas"+i);
                var imageData = canvas.toDataURL('image/png');
                var imgsrc = imageData.split(',');
                var imgData = imgsrc[1];


                var cell3 = document.createElement("TD");
                cell3.innerHTML="<center><img src=\""+imageData+"\"> </center>";

                row.appendChild(cell1);
                row.appendChild(cell2);
                row.appendChild(cell3);

                tbody.appendChild(row);

            } 

            


            i++;
        }
        
        var doc = new jsPDF('p', 'pt', 'ledger');

        var elem = document.getElementById('qrtable1');
        var imgElements = document.querySelectorAll('#trqrtable1 tr td img');

        var data = doc.autoTableHtmlToJson(elem);
        var images = [];
        var i = 0;
        doc.autoTable(data.columns, data.rows, {
        bodyStyles: {rowHeight: 100},
        drawRow:function(row, data) {
            row.height = 100;
        },
        drawCell: function(cell, opts) {
            if (opts.column.dataKey === 2) {
                images.push({
                url: imgElements[i].src,
                x: cell.textPos.x,
                y: cell.textPos.y
                }); 
                i++;
            }
        },
        addPageContent: function() {
          for (var i = 0; i < images.length; i++) {
            doc.addImage(images[i].url, images[i].x, images[i].y, 100, 100);
          }
        }
      });




      doc.save("QRsummary.pdf");


        // var pdf = new jsPDF('p', 'pt', 'ledger');

        // var source = $('#qrsummary1').html(); 
       
        // var specialElementHandlers = {
        //     '#bypassme' : function(element, renderer) {
        //         return true
        //     }
        // };
        // var margins = {
        //     top : 80,
        //     bottom : 60,
        //     left : 60,
        //     width : 522
        // };
        // pdf.fromHTML(source, // HTML string or DOM elem ref.
        //     margins.left, // x coord
        //     margins.top, { // y coord
        //     'width' : margins.width, // max width of content on PDF
        //     'elementHandlers' : specialElementHandlers
        // },
        // function(dispose) {
        //     pdf.save('qrsummary.pdf');
        // }, margins);


        



    }

    function init() {

        jq('#img-buffer').attr('src', 'images/logo-large-solid-pink.png');
        jq('#mode').val('4');

        var linenum = 0;

        jq('#download').on('click', function(){
           var compname =  jq('#compname').val();
           if (compname == "") { alert("Please Enter Company Name \n"); return false;}
            download()
        });

        jq('#image').on('change', onImageInput);

        jq('textarea').on('input change', function(){

            linenum = jq(this).attr('qrcon_seq');
            var textval = jq(this).val();
            jq(this).attr('value', textval);
            update(linenum);
        });

        $(document).on('input change','textarea', function()
        { 
            linenum = jq(this).attr('qrcon_seq');
            var textval = jq(this).val();
            jq(this).attr('value', textval);
            update(linenum);
        });

        $(document).on('input change','.qrconclass', function()
        {   
            linenum = jq(this).attr('qrcon_seq');
            update(linenum);       

        });

        // $(document).on('input focus','.qrconclass', function()
        // {

        //     var qrcon_seq = jq(this).attr('qrcon_seq');
        //     $("#qrcontent"+qrcon_seq).removeAttr("class");
        //     if (qrcon_seq != "1") 
        //     {
                
        //         addrow(qrcon_seq);
        //         update(linenum);
        //     }
        // });

        $(document).on('input focus','.qridclass', function()
        {

            var qrid_seq = jq(this).attr('qrid_seq');
            $("#qrid"+qrid_seq).removeAttr("class");
            if (qrid_seq != "1") 
            {
                
                addrow(qrid_seq);
                update(linenum);
            }
        });

        jq('input,  select').on('input change', update(linenum));


        jq('#GeneratePDF').on('click', function(){

            GeneratePDF()
        });

        jq('#printQR').on('click', function(){
            printQR()
        });
                    
        jq(window).load(update(linenum));
        // jq(window).on("load",update(linenum));
         
        update(linenum);
    }



    jq(init);
}());



});

