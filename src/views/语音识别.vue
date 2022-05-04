<template>
  <div>
     <button   @click="bfsp($event)">小影小影</button>
     <button  @click="bfsp($event)">背景噪音</button>
     <button  @click="bfsp($event)">未知</button>
     <button @click="save()">保存</button>
     <pre ref="count"></pre>
     <button @click="xunlian()">训练模型</button>
     <br/>
     开启监听：<input type="checkbox" @change="toggle($event.target.checked)">
  </div>
</template>

<script>

import * as speechCommands from '@tensorflow-models/speech-commands'
import * as tfvis from '@tensorflow/tfjs-vis'
export default {
  
  data () {
    return {
        MODEL_PATH:'http://127.0.0.1:8080/speech',
        transferRecognizer:null
     
    }
  },
  mounted () {
  
   this.xunlianshuju()
    
  },
  methods: {

    async xunlianshuju(){

        const recognizer = speechCommands.create(
        'BROWSER_FFT',
        null,
        this.MODEL_PATH + '/model.json',
        this.MODEL_PATH + '/metadata.json'
    );
        await recognizer.ensureModelLoaded();
        this.transferRecognizer=recognizer.createTransfer('视频播放器');

    },

    async bfsp(btn){
        btn.target.disabled = true;
        const label=btn.target.innerText;
        await this.transferRecognizer.collectExample(
            label ==='背景噪音'?'_background_noise_':label
        );
         btn.target.disabled = false;
         console.log(this.transferRecognizer.countExamples());
         this.$refs.count.innerHTML=JSON.stringify(this.transferRecognizer.countExamples(),null,2)
    },

    async xunlian(){
        await this.transferRecognizer.train({
            epochs:30,
            callback:tfvis.show.fitCallbacks(
                {name:'训练效果'},
                ['loss','acc'],
                {callbacks:["onEpochEnd"]}
            )
        })
        
    },

    async toggle(checked){
        if(checked){
            await this.transferRecognizer.listen(result=>{
                const {scores}=result;
                const labels=this.transferRecognizer.wordLabels();
                const index=scores.indexOf(Math.max(...scores));
                console.log(labels[index]);
            },{
                overlapFactor:0,
                probabilityThreshole:0.75
            });
        }else{
            this.transferRecognizer.stopListening();
        }
    },

    save(){//点击后保存成二进制文件
        const arrayBuffer= this.transferRecognizer.serializeExamples();
        const blob=new Blob([arrayBuffer]);
        const link=document.createElement('a');
        link.href=window.URL.createObjectURL(blob);
        link.download='data.bin';
        link.click();
    },
       

  }
}
</script>
<style>

</style>

