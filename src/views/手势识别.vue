<template>
  <div>
     
       <input id="up_avatar" ref="up_avatar" type="file" @change="predict" />
 
  </div>
</template>

<script>
import * as tf from '@tensorflow/tfjs';
import {getInputs} from '../utils/tpsb/shuchutupian'
import * as tfvis from '@tensorflow/tfjs-vis'
//import {img2x}  from '../utils/tpsb/utils'
import {img2x,file2img}  from '../utils/tpsb/utils'
export default {
  
  data () {
    return {
       MOBILENET_MODEL_PATH:'http://127.0.0.1:8080/mobilenet/web_model/model.json',
       NUM_CLASSES:3,
       BRAND_CLASSES:['ok','stop','magnify'],
       truncatedMobilenet:null,
       model:null
    }
  },
  mounted () {
  
   this.xunlian()
    
  },
  methods: {

    async xunlian(){

        const {inputs,labels}=await getInputs();//将图片数据以模型需要的格式引入
        const surface=tfvis.visor().surface({
            name:'训练图片',
            styles:{height:200}
        })
        inputs.forEach(img =>{
            surface.drawArea.appendChild(img);
        })
        
        const mobilenet=await tf.loadLayersModel(this.MOBILENET_MODEL_PATH);
        mobilenet.summary();
        const layer = mobilenet.getLayer('conv_pw_13_relu');//截断上面模型的中间层

        //新建一个模型
        this.truncatedMobilenet = tf.model({
            inputs:mobilenet.inputs,
            outputs:layer.output
        });
        this.model=tf.sequential();
        this.model.add(tf.layers.flatten({
            inputShape:layer.outputShape.slice(1)

        }));
        this.model.add(tf.layers.dense({
            units:10,
            activation:'relu'
        }));
        this.model.add(tf.layers.dense({
            units:this.NUM_CLASSES,
            activation:'softmax'

        }));


        //添加损失函数和激活函数
        this.model.compile({
            loss:'categoricalCrossentropy',
            optimizer:tf.train.adam()
        });

        //将数据先喂给截断模型，然后转化为新模型需要的数据
        const {xs,ys}=tf.tidy(()=>{
            const xs=tf.concat(inputs.map(imgEl=>this.truncatedMobilenet.predict(img2x(imgEl))));
            const ys=tf.tensor(labels)
            return {xs,ys}
        });

        //训练模型
        this.model.fit(xs,ys,{
            epochs:20,
            callbacks:tfvis.show.fitCallbacks(
                {name:'训练效果'},
                ['loss'],
                {callbacks:['onEpochEnd']}
            )
        });
      },

        async predict(){
            const avatar = this.$refs.up_avatar;
            const files = avatar.files;
         

        const img = await file2img(files[0]);


        document.body.appendChild(img);
        const pred = tf.tidy(() => {
            const x = img2x(img);
            const input = this.truncatedMobilenet.predict(x);
            return this.model.predict(input);
        });

        const index = pred.argMax(1).dataSync()[0];
        setTimeout(() => {
            alert(`预测结果：${this.BRAND_CLASSES[index]}`);
        }, 0);
}
    
       

  }
}
</script>
<style>

</style>

