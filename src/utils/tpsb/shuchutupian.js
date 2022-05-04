const loadImg = (src)=>{
    return new Promise(resolve=>{
        const img = new Image();
        img.crossOrigin = 'anonymous';//正确识别跨域
        img.src = src;
        img.width = 224;
        img.height = 224;
        img.onload=()=>resolve(img);
    })
}
export const getInputs =async()=>{
    const loadImgs=[];
    const labels=[];
    for(let i = 0;i<30;i++){
        ['ok','stop','magnify'].forEach(label=>{//修改图片名字
            const imgP=loadImg(`http://127.0.0.1:8080/brand/shoushi/${label}-${i}.jpg`);
            loadImgs.push(imgP);
            labels.push([
                label ==='ok'?1:0,
                label ==='stop'?1:0,
                label ==='magnify'?1:0,
            ]);
        })
    }
    const inputs =await Promise.all(loadImgs);
    return{
        inputs,
        labels,
    }
}