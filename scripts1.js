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
            // fill: jq('#img-buffer')[0],

            text: jq('#text'+linenum).val(),
            id: jq('#text'+linenum).attr('qrcon_seq'),
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

    function download() {
        // jq('#download').attr('href', jq('canvas')[0].toDataURL('image/png'));

        var zip = new JSZip();
        zip.file("Hello.txt", "Hello World\n");
        var img = zip.folder("images");

        var filename = "dec";
        var j = 1;
        $('#trqrtable').find('canvas').each(function() {

            console.log("canvas");
            var mycanvasid = jq(this).attr('id');
            console.log("url " + mycanvasid);

            var canvas = document.getElementById(mycanvasid);
            var imageData = canvas.toDataURL('image/png');
            var imgsrc = imageData.split(',');
            var imgData = imgsrc[1];
            var imgname = filename+j+'.png';
            img.file(imgname, imgData, {base64: true});
            // console.log("mycanvasid " + imageData);
            j++;
        });

        zip.generateAsync({type:"blob"})
        .then(function(content) {
            saveAs(content, "archive.zip");
        });

    }

    function init() {
        var linenum = 0;

        jq('#download').on('click', download);
        jq('#image').on('change', onImageInput);

        jq('textarea').on('input change', function(){

            linenum = jq(this).attr('qrcon_seq');
            update(linenum);
        });
            
        

        jq('input,  select').on('input change', update(linenum));



        jq(window).load(update(linenum));
         
        update(linenum);
    }

    jq(init);
}());
