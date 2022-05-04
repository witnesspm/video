<template>
  <div>
   
    <div id="container">



    </div>

    <div class="qianjing">
<div class="juzhong"> 
  <el-card shadow="always" class="box-card">
 
      <el-row>
  <el-col :span="24">  <h2 class="bt">"观"影实验室</h2></el-col>
</el-row>

  <el-row  :gutter="20" id="zongxiangjuzhong">

   <el-col :span="24">
<el-button class="anniu" type="primary" @click="tzsxt" round>立马体验</el-button>
  </el-col>
</el-row>
    </el-card>
</div>

     </div> 
  <div>
    
  </div>
  </div>
</template>

<script>
import * as THREE from 'three'
	import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader.js';
  
	import { MTLLoader } from 'three/examples/jsm/loaders/MTLLoader.js'
import angry from '../../public/img/angry.jpg'
import disgusted from '../../public/img/disgusted.jpg'
import happy from '../../public/img/happy.jpg'
import neutral from '../../public/img/neutral.jpg'
import sad from '../../public/img/sad.jpg'
import sad2 from '../../public/img/sad2.jpg'

import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
export default {
  data () {
    return {
      vertexShader: '',
      shaderMaterials: {},
      cube2: null,
      cube3: null,
      cube4: null,
      cube5: null,
      camera: null,
      scene: null,
      renderer: null,
      controls: null
    }
  },
  mounted () {
    this.init()
  },
  methods: {
  
    tzsxt(){
      this.$router.push({name:'观影实验室'}) 
    },
    // 初始化
    init () {
      this.createScene() // 创建场景
      this.createMesh() // 创建网格模型
      this.createLight() // 创建光源
      this.createCamera() // 创建相机
      this.createRender() // 创建渲染器
      this.createControls() // 创建控件对象
      this.render() // 渲染
    },
  
    // 创建场景
    createScene () {
      this.scene = new THREE.Scene()
    },
    // 创建网格模型
    createMesh () {
  



      var geometry = new THREE.BoxGeometry(20,20,20); //矩形平面
      var texture = new THREE.TextureLoader();
      let cubeTexture1=texture.load(angry);
      let cubeMaterial1=new THREE.MeshPhongMaterial({map:cubeTexture1});
      let cubeTexture2=texture.load(disgusted);
      let cubeMaterial2=new THREE.MeshPhongMaterial({map:cubeTexture2});
      let cubeTexture3=texture.load(happy);
      let cubeMaterial3=new THREE.MeshPhongMaterial({map:cubeTexture3});
       let cubeTexture4=texture.load(neutral);
      let cubeMaterial4=new THREE.MeshPhongMaterial({map:cubeTexture4});
       let cubeTexture5=texture.load(sad);
      let cubeMaterial5=new THREE.MeshPhongMaterial({map:cubeTexture5});
       let cubeTexture6=texture.load(sad2);
      let cubeMaterial6=new THREE.MeshPhongMaterial({map:cubeTexture6});
      let materials=[cubeMaterial1,cubeMaterial2,cubeMaterial3,cubeMaterial4,cubeMaterial5,cubeMaterial6];


      this.cube2=new THREE.Mesh(geometry,materials);
      this.cube3=new THREE.Mesh(geometry,materials);
      this.cube4=new THREE.Mesh(geometry,materials);
      this.cube5=new THREE.Mesh(geometry,materials);

this.cube2.translateX(30);
this.cube2.translateY(20);

this.cube3.translateX(30);
this.cube3.translateY(-20);
this.cube3.rotateY(180);

this.cube4.translateX(-30);
this.cube4.translateY(20);
this.cube4.rotateX(180);

this.cube5.translateX(-30);
this.cube5.translateY(-20);
this.cube5.rotateY(-180);

      // 方块添加到场景
      this.scene.add(this.cube2)
      this.scene.add(this.cube3)
      this.scene.add(this.cube4)
      this.scene.add(this.cube5)

				var objLoader = new OBJLoader();
				var mtlLoader = new MTLLoader();
	        mtlLoader.load("/moxing/444.mtl",(materials)=>{
             console.log(materials);
					objLoader.setMaterials(materials);
					objLoader.load('/moxing/444.obj',(res)=>{
						let obj = res
						obj.scale.set(0.1,0.1,0.1);
						obj.position.set(0,0,0)
						this.scene.add(obj)
					})
				})
				


    },


    // 创建光源
    createLight () {
      // 环境光
      const ambientLight = new THREE.AmbientLight(0xffffff, 1) // 创建环境光
      this.scene.add(ambientLight) // 将环境光添加到场景

   
    },
    // 创建相机
    createCamera () {
      const element = document.getElementById('container')
      const width = element.clientWidth // 窗口宽度
      const height = element.clientHeight // 窗口高度
      const k = width / height // 窗口宽高比
      // PerspectiveCamera( fov, aspect, near, far )
      this.camera = new THREE.PerspectiveCamera(35, k, 0.1, 1000)
      this.camera.position.set(0,0 , 100) // 设置相机位置

      this.camera.lookAt(new THREE.Vector3(0, 0, 0)) // 设置相机方向
      this.scene.add(this.camera)
    },
    // 创建渲染器
    createRender () {
      const element = document.getElementById('container')
      this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true })
      this.renderer.setSize(element.clientWidth, element.clientHeight) // 设置渲染区域尺寸
      this.renderer.shadowMap.enabled = true // 显示阴影
      this.renderer.shadowMap.type = THREE.PCFSoftShadowMap
      element.appendChild(this.renderer.domElement)
    },

    // 更新属性
    updateFun () {
  
          this.cube2.rotation.y += 0.01
      this.cube2.rotation.x += 0.01
      this.cube2.rotation.z += 0.01

    this.cube3.rotation.y += 0.01
      this.cube3.rotation.x += 0.01
      this.cube3.rotation.z += 0.01

        this.cube4.rotation.y += 0.01
      this.cube4.rotation.x += 0.01
      this.cube4.rotation.z += 0.01

        this.cube5.rotation.y += 0.01
      this.cube5.rotation.x += 0.01
      this.cube5.rotation.z += 0.01
   
    },
    render () {
      this.updateFun()
      this.renderer.render(this.scene, this.camera)
      requestAnimationFrame(this.render)
    },
    // 创建控件对象
    createControls () {
      this.controls = new OrbitControls(this.camera, this.renderer.domElement)
    }
  }
}
</script>
<style scoped>
#container {
  position: absolute;
  width: 100%;
  height: 95.2%;
  
  background-color: #c4e0e5; /* 浏览器不支持的时候显示 */
  background-image: linear-gradient(to bottom right, #c2e59c, #64b3f4);
}
.qianjing{
  position: absolute;
  
}
.box-card {
   
     position: fixed;
  top: 50%;
  left: 50%;

  width:50%;
  height: 50%;
  -webkit-transform: translateX(-50%) translateY(-50%);
  }
  .bt{
    text-align: center;
    font-size: 50px;
    
  }
  .anniu{
    width: 100%;
    height: 100px;
    font-size: 30px;
  }
  #zongxiangjuzhong{
    margin-top: 10%;
  }
</style>

