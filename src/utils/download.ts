// 保存成png格式的图片
export function saveAsPNG(canvas:any, fileName:any) {

    downLoad(canvas.toDataURL("image/png"), fileName);
}

// 保存成jpg格式的图片
export function saveAsJPG(canvas:any, fileName:any) {
    downLoad(canvas.toDataURL("image/jpeg"), fileName);
}

export function saveImg(dataUrl: any, fileName:any) {
  downLoad(dataUrl, fileName)
}

function downLoad(url:any, fileName:any){
   var link = document.createElement('a');
   link.href = url;
   link.download = fileName || '下载';
   link.click();
}
