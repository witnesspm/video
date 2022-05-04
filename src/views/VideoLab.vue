<template>
  <div>
    <div id="container"></div>
<!-- 高光时刻，将视频中搞笑最多的地方单独截取下来，然后配上文字，例如这一段是你笑的最多的地方，您要分享给别人吗等等-->

    <el-row
      v-loading.fullscreen.lock="loading"
      element-loading-text="功能加载中"
      element-loading-spinner="el-icon-loading"
      element-loading-background="rgba(255, 255, 255, 0.8)"
    >
      <el-col :md="18" :xl="14" class="shipinhang">
        <div class="tubiaojiashipin">
          <el-popover placement="right" popper-class="popoverclass" trigger="click" >
            <div class="lishibiaoqing">
            <div>
            <div class="bqlstb" ref="main" ></div>
            <div class="bqlsjdt" ref="main2" ></div> 
            </div>
            <div class="dianyingxinxi">
            <h3>观影实验室</h3> 
            <p style="font-style: italic">祝您看得开心</p> 
            <el-divider></el-divider>
            <el-button type="info" plain @click="czbt">重置图表</el-button>
            </div>
            </div>
            <el-button class="shuanniu" slot="reference"
              >历<br />史<br />表<br />情<br />记<br />录</el-button
            >
          </el-popover>

          <video
            ref="video"
            id="myshipin"
            src="videos/handou.mp4"
            controls
          ></video>
        </div>
      </el-col>
      <el-col :md="4" :xl="4" class="renlianhang">
        <div class="video-mask">
          <div class="see">
            <video
              id="myVideo"
              poster="https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png"
              muted
              loop
              playsinline
              @loadedmetadata="fnRun"
            ></video>
            <canvas id="myCanvas" />
          </div>
        </div>
     <div>
        <el-switch
          v-model="bqjckg"
          active-text="开启表情检查"
          inactive-text="关闭表情检测"
        >
        </el-switch>
           <el-popover
    placement="left"
    title="表情检查"
    width="300"
    trigger="hover"
    content="开启表情检查后，会记录下您的喜怒哀乐，生成图表，以供您留下纪念哦！">
    <el-button type="primary" icon="el-icon-chat-line-square" circle size="mini" slot="reference"></el-button>
  </el-popover>
</div>

        <el-divider></el-divider>
        <div>
        <el-switch
          v-model="yyjckg"
          active-text="开启语音控制"
          inactive-text="关闭语音控制"
        >
        </el-switch>

    <el-popover
    placement="left"
    title="语音控制"
    width="300"
    trigger="hover"
    content="开启语音控制后，可以呼叫”小影小影“的名字哦！然后可以对小影小影下达命令，目前命令为《播放》、《暂停》">
    <el-button type="primary" icon="el-icon-microphone" circle size="mini" slot="reference"></el-button>
  </el-popover>
</div>


        <el-divider></el-divider>
        <div class="upload-wrap anticon" nv-file-drop="" uploader="uploader">
          <input
            class="file-ele"
            type="file"
            accept="video/mp4, video/ogg, video/webm"
            @change="fnChange($event)"
          />
          <div class="file-open">观看本地视频</div>
        </div>
      </el-col>
      <el-col :md="2" :xl="6"> </el-col>
    </el-row>
    <el-dialog
      title="情感分析"
      :visible.sync="dialogVisible"
      width="50%"
      :before-close="handleClose"
    >
      <el-row>
        <el-col :md="24">
          <div ref="main3" style="width: 600px; height: 400px"></div>
        </el-col>
      </el-row>

      <el-row :gutter="20">
        <el-col :md="11">
          <p>这场电影/视频中，您最多的表请为：</p>
          <h1>{{ max_expression }}</h1>
        </el-col>
        <el-col :md="2">
          
        </el-col>
        <el-col :md="11">
          小影分析该视频类型为：<h3>{{biaoqingpingyu.leixing}}</h3>
根据您的表情数据，我们为该电影评分为：
          <el-rate
  v-model="biaoqingpingyu.pingfen"

  show-score
  text-color="#ff9900"
  score-template="{value}">
</el-rate>
(系统分析可能出现偏差，可以手动评分)
<br/>
<h3>赠语：</h3>
<h2>{{biaoqingpingyu.pingyu}}</h2>

        </el-col>
      </el-row>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="dialogVisible = false"
          >确 定</el-button
        >
      </span>
    </el-dialog>
    <!-- <div class="option">
          <div>
            <span style="margin-right: 20px"
              >前置后置切换（重新启动摄像头）：</span
            >
            <label>
              前置
              <input
                type="radio"
                v-model="constraints.video.facingMode"
                value="user"
              />
            </label>
            <label>
              后置
              <input
                type="radio"
                v-model="constraints.video.facingMode"
                value="environment"
              />
            </label>
          </div>
        </div> -->

    <!-- <div>
      开心：{{ happy_number }} 惊讶：{{ surprised_number }} 平淡：{{
        neutral_number
      }}
      难过：{{ sad_number }} 讨厌：{{ disgusted_number }} 害怕：{{
        fearful_number
      }}
      生气：{{ angry_number }}
    </div> -->

    <!-- <button @click="gxtb">重置图表</button> -->
  </div>
</template>

<script>
import * as speechCommands from "@tensorflow-models/speech-commands";
import * as faceapi from "face-api.js";
import * as echarts from "echarts";
import * as THREE from "three";
import { OBJLoader } from "three/examples/jsm/loaders/OBJLoader.js";
import { MTLLoader } from "three/examples/jsm/loaders/MTLLoader.js";
import {biaoqingpingyu} from "../utils/biaoqingpingyu"
export default {
  name: "WebRTCFaceRecognition",

  data() {
    return {
      //模型对象
      camera: null,
      scene: null,
      renderer: null,
      mesh: null,
      obj: null,
      //分割线
      biaoqingpingyu:{
        leixing:"加载中",
        pingyu:"加载中",
        pingfen:0
      },
      dialogVisible: false,
      sxtsm: false,
      lysm: false,
      loading: true,
      datazoomdsq: null,
      start: 0,
      end: 35,
      yyjckg: false,
      bqjckg: false,
      MODEL_PATH: "http://127.0.0.1:8080/data", //模型地址
      transferRecognizer: null,
      transferRecognizer2: null,
      nets: "tinyFaceDetector", // 模型
      options: null, // 模型参数
      withBoxes: false, // 框or轮廓
      detectFace: "detectSingleFace", // 单or多人脸
      detection: "expression",
      videoEl: null,
      canvasEl: null,
      timeout: 0,
      // 视频媒体参数配置
      constraints: {
        audio: false,
        video: {
          // ideal（应用最理想的）
          width: {
            min: 320,
            ideal: 1280,
            max: 1920,
          },
          height: {
            min: 240,
            ideal: 720,
            max: 1080,
          },
          // frameRate受限带宽传输时，低帧率可能更适宜
          frameRate: {
            min: 15,
            ideal: 30,
            max: 60,
          },
          // 显示模式前置后置
          facingMode: "user",
        },
      },
      angry: { may: 0, expression: "生气" }, //生气
      disgusted: { may: 0, expression: "讨厌" }, //讨厌
      fearful: { may: 0, expression: "害怕" }, //害怕
      happy: { may: 0, expression: "开心" }, //开心
      neutral: { may: 0, expression: "平淡" }, //平淡
      sad: { may: 0, expression: "难过" }, //难过
      surprised: { may: 0, expression: "惊讶" }, //惊讶
      angry_number: 0,
      disgusted_number: 0,
      fearful_number: 0,
      happy_number: 0,
      neutral_number: 0,
      sad_number: 0,
      surprised_number: 0,
      bqdsq: null,
      tbgx: null,
      max_expression: "",
      now_expression: "null",
      jishu: 0,
      myChart: null,
      myChart2: null, //控制datazoom
      myChart3: null, //视频结尾图表
      shijianzhou: [],
      shijianshuzu: new Array(),
      fullscreen: false, // 是否全屏
    };
  },
  created: function () {
    // 每次进入界面时，先清除之前的所有定时器，然后启动新的定时器
    this.datazoomdsq = null;
    this.yuyinshibie();
    this.yuyinshibie2();
  },
  destroyed: function () {
    clearInterval(this.setgxdatazoom);
    this.datazoomdsq = null;
  },
  watch: {
    //监听表情开关
    bqjckg(kg) {
      if (kg === true) {
        if (this.sxtsm === false) {
          this.$confirm(
            "此操作将开启摄像头，本网站承诺不会利用摄像头进行除捕捉表情外的其他操作，确定后将不再弹出此消息,同时请确保摄像头设备正常",
            "摄像头声明",
            {
              confirmButtonText: "确定",
              cancelButtonText: "取消",
              type: "warning",
            }
          )
            .then(() => {
              this.sxtsm = true;
              this.fnOpen();
            })
            .catch(() => {
              this.bqjckg = false;
            });
        } else this.fnOpen();
      } else if (kg === false) {
        this.fnClose();
      }
    },

    async yyjckg(kg) {
      if (kg === true) {



        if (this.lysm === false) {
          this.$confirm(
            `此操作将开启录音设备，本网站承诺不会利用录音设备进行除语音指令识别外的其他操作,确定后将不再弹出此消息,同时请确保音频输入设备正常`,
            "录像声明",
            {
              confirmButtonText: "确定",
              cancelButtonText: "取消",
              type: "warning",
            }
          )
            .then(async () => {
              this.lysm = true;

              await this.transferRecognizer2.listen(
                async (result) => {
                  const { scores } = result;
                  const labels = this.transferRecognizer2.wordLabels();
                  const index = scores.indexOf(Math.max(...scores));
                  console.log(labels[index]);
                  if (labels[index] == "小影小影") {
                    console.log("我在");
                    await this.transferRecognizer.listen(
                      (result) => {
                        const { scores } = result;
                        const labels = this.transferRecognizer.wordLabels();
                        const index = scores.indexOf(Math.max(...scores));
                        console.log(labels[index]);
                        if (labels[index] == "播放") {
                          this.$refs.video.play();
                          this.transferRecognizer.stopListening();
                        } else if (labels[index] == "暂停") {
                          this.$refs.video.pause();
                          this.transferRecognizer.stopListening();
                        }
                      },
                      {
                        overlapFactor: 0,
                        probabilityThreshole: 0.75,
                      }
                    );
                  }
                },
                {
                  overlapFactor: 0,
                  probabilityThreshole: 0.9,
                }
              );
            })
            .catch(() => {
              this.yyjckg = false;
            });
        } else
          await this.transferRecognizer2.listen(
            async (result) => {
              const { scores } = result;
              const labels = this.transferRecognizer2.wordLabels();
              const index = scores.indexOf(Math.max(...scores));
              console.log(labels[index]);
              if (labels[index] == "小影小影") {
                console.log("我在");
                await this.transferRecognizer.listen(
                  (result) => {
                    const { scores } = result;
                    const labels = this.transferRecognizer.wordLabels();
                    const index = scores.indexOf(Math.max(...scores));
                    console.log(labels[index]);
                    if (labels[index] == "播放") {
                      this.$refs.video.play();
                      this.transferRecognizer.stopListening();
                    } else if (labels[index] == "暂停") {
                      this.$refs.video.pause();
                      this.transferRecognizer.stopListening();
                    }
                  },
                  {
                    overlapFactor: 0,
                    probabilityThreshole: 0.75,
                  }
                );
              }
            },
            {
              overlapFactor: 0,
              probabilityThreshole: 0.9,
            }
          );
      } else if (kg === false) {
        this.transferRecognizer2.stopListening();
      }
    },
    nets(val) {
      this.nets = val;
      this.fnInit();
    },
    detection(val) {
      this.detection = val;
      this.videoEl.pause();
      setTimeout(() => {
        this.videoEl.play();
        setTimeout(() => this.fnRun(), 300);
      }, 300);
    },
  },
  mounted() {
    this.$nextTick(() => {
      this.fnInit();
    });

    // this.init();//加载模型
    //   this.animate()

    //监听视频加载完成
    this.$refs.video.addEventListener("loadedmetadata", () => {
      console.log("电影加载完成");
      this.cstb();
      this.csdatazoom();
      this.setgxdatazoom();
      this.loading = false;
    });
    
    

    this.$refs.video.addEventListener("ended", () => {
      console.log("电影播放完毕");
if(this.shijianshuzu.length==0){}
else{

      this.fnClose();
      this.bqjckg=false;
      //将每个表情的时长总结，找出排除平淡的最多的表情，给出针对该表情的评语
      const kong = this.shijianshuzu.filter((value) => {
        return value == "null";
      });

      const shengqi = this.shijianshuzu.filter((value) => {
        return value == "生气";
      });

      const kaixin = this.shijianshuzu.filter((value) => {
        return value == "开心";
      });

      const taoyan = this.shijianshuzu.filter((value) => {
        return value == "讨厌";
      });

      const pingdan = this.shijianshuzu.filter((value) => {
        return value == "平淡";
      });

      const haipa = this.shijianshuzu.filter((value) => {
        return value == "害怕";
      });

      const nanguo = this.shijianshuzu.filter((value) => {
        return value == "难过";
      });

      const jingya = this.shijianshuzu.filter((value) => {
        return value == "惊讶";
      });
      let biaoqing = {
        shengqi: {
          shijianshuzu: shengqi,
          ming: "生气",
        },
        kaixin: {
          shijianshuzu: kaixin,
          ming: "开心",
        },
        taoyan: {
          shijianshuzu: taoyan,
          ming: "讨厌",
        },
        pingdan: {
          shijianshuzu: pingdan,
          ming: "平淡",
        },
        haipa: {
          shijianshuzu: haipa,
          ming: "害怕",
        },
        nanguo: {
          shijianshuzu: nanguo,
          ming: "难过",
        },
        jingya: {
          shijianshuzu: jingya,
          ming: "惊讶",
        },
      };

      const maxvalue = Math.max(
        kaixin.length,
        jingya.length,
        nanguo.length,
        shengqi.length,
        taoyan.length,
        haipa.length
      );

      let biaoqingshuzu = new Array();

if(biaoqing.kaixin.shijianshuzu.length==maxvalue){
  biaoqingshuzu.push(biaoqing.kaixin.ming);
}
if(biaoqing.jingya.shijianshuzu.length==maxvalue){
  biaoqingshuzu.push(biaoqing.jingya.ming);
}

if(biaoqing.nanguo.shijianshuzu.length==maxvalue){
  biaoqingshuzu.push(biaoqing.nanguo.ming);
}
if(biaoqing.shengqi.shijianshuzu.length==maxvalue){
  biaoqingshuzu.push(biaoqing.shengqi.ming);
}

if(biaoqing.taoyan.shijianshuzu.length==maxvalue){
  biaoqingshuzu.push(biaoqing.taoyan.ming);
}
if(biaoqing.haipa.shijianshuzu.length==maxvalue){
  biaoqingshuzu.push(biaoqing.haipa.ming);
}




      this.max_expression = biaoqingshuzu.join(",");

      console.log(this.max_expression);

      this.dialogVisible = true;
      let shipinchangdu =this.hqdatezTime()
      this.biaoqingpingyu=biaoqingpingyu(biaoqing,shipinchangdu);
      setTimeout(() => {
        // 基于准备好的dom，初始化echarts实例

        this.endbiaoqingtubiao(biaoqing);
      }, 500);

      }
    });

    
  },

  methods: {
    //加载视频完结时表情图表
    endbiaoqingtubiao(biaoqing) { 
      this.myChart3 = echarts.init(this.$refs.main3);

      // 绘制图表
      this.myChart3.setOption({
        tooltip: {
          show: true, //显示提示框
          formatter: function (params) {
            var res =
              '这场电影/视频中，您"' +
              params.data.name +
              '"了' +
              params.data.value +
              "秒"; //可以在这个方法中做改变
            return res;
          },
        },
        series: [
          {
            type: "pie",
            data: [
              {
                value: biaoqing.kaixin.shijianshuzu.length,
                name: "开心",
                itemStyle:{color:'#f5f56e'}
              },
              {
                value: biaoqing.nanguo.shijianshuzu.length,
                name: "难过",
                itemStyle:{color:'#07f5e9'}
              },
              {
                value: biaoqing.taoyan.shijianshuzu.length,
                name: "讨厌",
                itemStyle:{color:'#3d372c'}
              },
              {
                value: biaoqing.haipa.shijianshuzu.length,
                name: "害怕",
                itemStyle:{color:'#bc67f5'}
              },
              {
                value: biaoqing.shengqi.shijianshuzu.length,
                name: "生气",
                itemStyle:{color:'#f52105'}
              },
              {
                value: biaoqing.jingya.shijianshuzu.length,
                name: "惊讶",
                itemStyle:{color:'#81f57b'} 
              },
            ],
            // roseType: "area",
          },
        ],
      });
    },

    //视频完结表情弹窗确认函数
    handleClose(done) {
      this.$confirm("确认关闭？")
        .then((_) => {
          done();
          this.max_expression = "";
        })
        .catch((_) => {
          this.max_expression = "";
        });
    },
    //模型方法
    init: function () {
      this.scene = new THREE.Scene();
      const ambientLight = new THREE.AmbientLight(0xffffff, 1); // 创建环境光
      this.scene.add(ambientLight); // 将环境光添加到场景

      const PointLight = new THREE.PointLight(0xffffff, 10);

      PointLight.position.set(0, 0, 0);
      this.scene.add(PointLight);

      const element = document.getElementById("container");
      const width = element.clientWidth; // 窗口宽度
      const height = element.clientHeight; // 窗口高度
      const k = width / height; // 窗口宽高比
      // PerspectiveCamera( fov, aspect, near, far )
      this.camera = new THREE.PerspectiveCamera(35, k, 0.1, 1000);
      this.camera.position.set(0, 100, 0); // 设置相机位置

      this.camera.lookAt(new THREE.Vector3(0, 0, 0)); // 设置相机方向
      this.scene.add(this.camera);

      let objLoader = new OBJLoader();
      let mtlLoader = new MTLLoader();
      mtlLoader.load("/moxing/444.mtl", (materials) => {
        console.log(materials);
        objLoader.setMaterials(materials);
        objLoader.load("/moxing/444.obj", (res) => {
          this.obj = res;
          this.obj.scale.set(0.5, 0.5, 0.5);
          this.obj.position.set(40, 0, 30);
          this.obj.rotation.x = -Math.PI / 2;
          this.scene.add(this.obj);
        });
      });

      this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
      this.renderer.setSize(element.clientWidth, element.clientHeight); // 设置渲染区域尺寸
      this.renderer.shadowMap.enabled = true; // 显示阴影
      this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
      element.appendChild(this.renderer.domElement);
    },

    animate: function () {
      requestAnimationFrame(this.animate);

      this.renderer.render(this.scene, this.camera);
    },

    // 更换视频,清空绘制
    fnChange(e) {
      this.loading = true;
      if (!e.target.files.length) return;
      this.$refs.video.pause();

      this.$refs.video.src = URL.createObjectURL(e.target.files[0]);
      //重新根据视频长度获取图表
      this.shijianzhou = [];
      this.shijianshuzu = [];
      let j = this.hqdatezTime();
      for (let i = 0; i < j - 1; i++) {
        this.shijianzhou[i] = this.formatSeconds(i + 1);
      }
      this.myChart.setOption({
        dataZoom: [
          {
            type: "slider", //slider表示有滑动块的，
            show: false,
            xAxisIndex: [0], //表示x轴折叠
            start: 0, //数据窗口范围的起始百分比,表示1%
            end: 35, //数据窗口范围的结束百分比,表示35%坐标
          },
        ],
        xAxis: {
          data: this.shijianzhou,
          // axisLabel :{
          //       interval:0
          //   },
        },
        series: [
          {
            type: "scatter",
            data: [],
          },
        ],
      });
    },

    //加载语音识别模型
    async yuyinshibie() {
      const recognizer = speechCommands.create(
        "BROWSER_FFT",
        null,
        this.MODEL_PATH + "/speech/model.json",
        this.MODEL_PATH + "/speech/metadata.json"
      );
      await recognizer.ensureModelLoaded();
      this.transferRecognizer = recognizer.createTransfer("视频播放器");
      const res = await fetch(this.MODEL_PATH + "/yuyinxunlianshuju/data.bin");
      const arrayBuffer = await res.arrayBuffer();
      this.transferRecognizer.loadExamples(arrayBuffer);
      await this.transferRecognizer.train({ epochs: 30 });
      console.log("语音识别加载完成");
    },

    //加载语音识别模型2-小影
    async yuyinshibie2() {
      const recognizer = speechCommands.create(
        "BROWSER_FFT",
        null,
        this.MODEL_PATH + "/speech/model.json",
        this.MODEL_PATH + "/speech/metadata.json"
      );
      await recognizer.ensureModelLoaded();
      this.transferRecognizer2 = recognizer.createTransfer("小影助手");
      const res = await fetch(
        this.MODEL_PATH + "/yuyinxunlianshuju/zhushou.bin"
      );
      const arrayBuffer = await res.arrayBuffer();
      this.transferRecognizer2.loadExamples(arrayBuffer);
      await this.transferRecognizer2.train({ epochs: 30 });
      console.log("小影助手加载完成");
    },

    formatSeconds(seconds) {
      //将数字转为时分秒
      let hour =
        Math.floor(seconds / 3600) >= 10
          ? Math.floor(seconds / 3600)
          : "0" + Math.floor(seconds / 3600);
      seconds -= 3600 * hour;
      let min =
        Math.floor(seconds / 60) >= 10
          ? Math.floor(seconds / 60)
          : "0" + Math.floor(seconds / 60);
      seconds -= 60 * min;
      let sec = seconds >= 10 ? seconds : "0" + seconds;
      return hour + ":" + min + ":" + sec;
    },

    //重置图表
    czbt(){
      this.shijianshuzu=[];
    },
    //产生图表
    cstb() {
      let j = this.hqdatezTime();

      for (let i = 0; i < j - 1; i++) {
        this.shijianzhou[i] = this.formatSeconds(i + 1);
      }

      // 基于准备好的dom，初始化echarts实例
      this.myChart = echarts.init(this.$refs.main);
      // 绘制图表
      this.myChart.setOption({
         tooltip: {
          show: true, //显示提示框
        
        },
        toolbox: {
          show: true,
          showTitle:false,

          feature: {
            saveAsImage: {
              show: true,
              name:"历史表情图表",
              type:'png',
              excludeComponents: ["toolbox"],
              pixelRatio: 2,
            },

            
          },


        },
        dataZoom: [
          {
            type: "slider", //slider表示有滑动块的，
            show: false,
            xAxisIndex: [0], //表示x轴折叠
            start: this.start, //数据窗口范围的起始百分比,表示1%
            end: this.end, //数据窗口范围的结束百分比,表示35%坐标
         
          },
        ],
        xAxis: {
          data: this.shijianzhou,
          // axisLabel :{
          //       interval:0
          //   },
        },
        yAxis: {
          data: [
            // "null",
            "开心",
            "惊讶",
            "平淡",
            "难过",
            "讨厌",
            "害怕",
            "生气",
          ],
        },
        series: [
          {
            type: "scatter",
            data: [],
            
          },
        ],
         title:{
          show:true,
          text: '表情历史',
          x:'center',
           subtext: '通过下方控制条调节图表哦！', 
            textStyle: { "fontSize": 18,"fontWeight": "bolder","color": "#444"},
            subtextStyle: {"fontSize": 12,"color": "#666"}
        },

        
      });
    },
    //产生图表控制条
    csdatazoom() {
      // 基于准备好的dom，初始化echarts实例
      this.myChart2 = echarts.init(this.$refs.main2);
      // 绘制图表
      this.myChart2.setOption({
        grid: {
          height: "10%", // 高度
        },
        xAxis: {
          axisLine: [false],
          data: this.shijianzhou,
          // axisLabel :{
          //       interval:0
          //   },
        },
        yAxis: {
          axisLine: [false],
          data: ["null"],
        },
        dataZoom: [
          {
            type: "slider", //slider表示有滑动块的，
            show: true,
            xAxisIndex: [0], //表示x轴折叠
            start: 0, //数据窗口范围的起始百分比,表示1%
            end: 35, //数据窗口范围的结束百分比,表示35%坐标
            
            borderColor:"rgba(0,0,0)",  
            backgroundColor:"rgba(255,255,255)",
            fillerColor:"rgba(49,190,255,0.7)",
          },
        ],
      });
    },

    //获取当前播放时间
    hqnowTime() {
      let s = this.$refs.video.currentTime; //获取当前播放时间

      return s;
    },

    //获取视频总时长
    hqdatezTime() {
      let x = this.$refs.video.duration; //获取视频的总时长
      return x;
    },

    //设置表情定时器
    setbqdsq() {
      if (this.bqdsq == null) {
        this.bqdsq = setInterval(() => {
          this.expression_number();
        }, 1000);
      }
    },

    //设置图表更新定时器
    setgxdatazoom() {
      if (this.datazoomdsq == null) {
        this.datazoomdsq = setInterval(() => {
          //刷新数据
          this.myChart.setOption({
            dataZoom: [
              {
                start: this.myChart2.getOption().dataZoom[0].start, //数据窗口范围的起始百分比,表示1%
                end: this.myChart2.getOption().dataZoom[0].end, //数据窗口范围的结束百分比,表示35%坐标
              },
            ],
          });
          (this.start = this.myChart2.getOption().dataZoom[0].start),
            (this.end = this.myChart2.getOption().dataZoom[0].end);
        }, 500);
      }
    },

    settbgx() {
      if (this.tbgx == null) {
        this.tbgx = setInterval(() => {
          let a = parseInt(this.hqnowTime());

          this.shijianshuzu[a] = this.now_expression;

          //刷新数据
          this.myChart.setOption({
            dataZoom: [],
            xAxis: [
              {
                data: this.shijianzhou,
              },
            ],
            series: [
              {
                data: this.shijianshuzu,
              },
            ],
          });
        }, 500);
      }
    },

    //获取表情次数
    expression_number() {
      switch (this.now_expression) {
        case "null":
          console.log("未识别到表情！");
          break;
        case "生气":
          this.angry_number++;
          break;
        case "讨厌":
          this.disgusted_number++;
          break;
        case "害怕":
          this.fearful_number++;
          break;
        case "开心":
          this.happy_number++;
          break;
        case "平淡":
          this.neutral_number++;
          break;
        case "难过":
          this.sad_number++;
          break;
        case "惊讶":
          this.surprised_number++;
          break;
        default:
          break;
      }
    },
    //获取最大概率表情
    maxexpression(expression) {
      this.angry.may = expression.angry;
      this.disgusted.may = expression.disgusted;
      this.fearful.may = expression.fearful;
      this.happy.may = expression.happy;
      this.neutral.may = expression.neutral;
      this.sad.may = expression.sad;
      this.surprised.may = expression.surprised;
      const max = Math.max(
        this.angry.may,
        this.disgusted.may,
        this.fearful.may,
        this.happy.may,
        this.neutral.may,
        this.sad.may,
        this.surprised.may
      );
      switch (max) {
        case this.angry.may:
          return this.angry.expression;

        case this.disgusted.may:
          return this.disgusted.expression;

        case this.fearful.may:
          return this.fearful.expression;

        case this.happy.may:
          return this.happy.expression;

        case this.neutral.may:
          return this.neutral.expression;

        case this.sad.may:
          return this.sad.expression;

        case this.surprised.may:
          return this.surprised.expression;

        default:
          break;
      }
    },

    // 初始化模型加载
    async fnInit() {
      await faceapi.nets[this.nets].loadFromUri("/models"); // 算法模型
      await faceapi.loadFaceLandmarkModel("/models"); // 轮廓模型
      await faceapi.loadFaceExpressionModel("/models"); // 表情模型
      await faceapi.loadAgeGenderModel("/models"); // 年龄模型
      // 根据算法模型参数识别调整结果
      switch (this.nets) {
        case "ssdMobilenetv1":
          this.options = new faceapi.SsdMobilenetv1Options({
            minConfidence: 0.5, // 0.1 ~ 0.9
          });
          break;
        case "tinyFaceDetector":
          this.options = new faceapi.TinyFaceDetectorOptions({
            inputSize: 512, // 160 224 320 416 512 608
            scoreThreshold: 0.5, // 0.1 ~ 0.9
          });
          break;
        case "mtcnn":
          this.options = new faceapi.MtcnnOptions({
            minFaceSize: 20, // 0.1 ~ 0.9
            scaleFactor: 0.709, // 0.1 ~ 0.9
          });
          break;
      }
      // 节点属性化
      this.videoEl = document.getElementById("myVideo");
      this.canvasEl = document.getElementById("myCanvas");
    },
    // 人脸面部勘探轮廓识别绘制
    async fnRunFaceLandmark() {
      console.log("RunFaceLandmark");
      if (this.videoEl.paused) return clearTimeout(this.timeout);
      // 识别绘制人脸信息
      const result = await faceapi[this.detectFace](
        this.videoEl,
        this.options
      ).withFaceLandmarks();
      if (result && !this.videoEl.paused) {
        const dims = faceapi.matchDimensions(this.canvasEl, this.videoEl, true);
        const resizeResult = faceapi.resizeResults(result, dims);
        this.withBoxes
          ? faceapi.draw.drawDetections(this.canvasEl, resizeResult)
          : faceapi.draw.drawFaceLandmarks(this.canvasEl, resizeResult);
      } else {
        this.canvasEl
          .getContext("2d")
          .clearRect(0, 0, this.canvasEl.width, this.canvasEl.height);
      }
      this.timeout = setTimeout(() => this.fnRunFaceLandmark());
    },
    // 人脸表情识别绘制
    async fnRunFaceExpression() {
      console.log("RunFaceExpression");
      if (this.videoEl.paused) return clearTimeout(this.timeout);
      // 识别绘制人脸信息
      const result = await faceapi[this.detectFace](this.videoEl, this.options)
        .withFaceLandmarks()
        .withFaceExpressions();
      if (result && !this.videoEl.paused) {
        const dims = faceapi.matchDimensions(this.canvasEl, this.videoEl, true);
        const resizeResult = faceapi.resizeResults(result, dims);

        this.now_expression = this.maxexpression(
          faceapi.resizeResults(result, dims).expressions
        );

        this.withBoxes
          ? faceapi.draw.drawDetections(this.canvasEl, resizeResult)
          : faceapi.draw.drawFaceLandmarks(this.canvasEl, resizeResult);
        faceapi.draw.drawFaceExpressions(this.canvasEl, resizeResult, 0.05);
      } else {
        this.canvasEl
          .getContext("2d")
          .clearRect(0, 0, this.canvasEl.width, this.canvasEl.height);
      }
      this.timeout = setTimeout(() => this.fnRunFaceExpression());
    },
    // 年龄性别识别绘制
    async fnRunFaceAgeAndGender() {
      console.log("RunFaceAgeAndGender");
      if (this.videoEl.paused) return clearTimeout(this.timeout);
      // 识别绘制人脸信息
      const result = await faceapi[this.detectFace](this.videoEl, this.options)
        .withFaceLandmarks()
        .withAgeAndGender();
      if (result && !this.videoEl.paused) {
        const dims = faceapi.matchDimensions(this.canvasEl, this.videoEl, true);
        const resizeResults = faceapi.resizeResults(result, dims);
        this.withBoxes
          ? faceapi.draw.drawDetections(this.canvasEl, resizeResults)
          : faceapi.draw.drawFaceLandmarks(this.canvasEl, resizeResults);
        if (Array.isArray(resizeResults)) {
          resizeResults.forEach((result) => {
            const { age, gender, genderProbability } = result;
            new faceapi.draw.DrawTextField(
              [
                `${Math.round(age, 0)} years`,
                `${gender} (${Math.round(genderProbability)})`,
              ],
              result.detection.box.bottomLeft
            ).draw(this.canvasEl);
          });
        } else {
          const { age, gender, genderProbability } = resizeResults;
          new faceapi.draw.DrawTextField(
            [
              `${Math.round(age, 0)} years`,
              `${gender} (${Math.round(genderProbability)})`,
            ],
            resizeResults.detection.box.bottomLeft
          ).draw(this.canvasEl);
        }
      } else {
        this.canvasEl
          .getContext("2d")
          .clearRect(0, 0, this.canvasEl.width, this.canvasEl.height);
      }
      this.timeout = setTimeout(() => this.fnRunFaceAgeAndGender());
    },
    // 执行检测识别类型
    fnRun() {
      if (this.detection === "landmark") {
        this.fnRunFaceLandmark();
        return;
      }
      if (this.detection === "expression") {
        this.fnRunFaceExpression();
        return;
      }
      if (this.detection === "age_gender") {
        this.fnRunFaceAgeAndGender();
        return;
      }
    },
    // 启动摄像头视频媒体
    fnOpen() {
      //启动定时器1
      this.bqdsq = null;
      this.setbqdsq();

      //启动定时器2
      this.tbgx = null;
      this.settbgx();

      if (typeof window.stream === "object") return;
      clearTimeout(this.timeout);
      this.timeout = setTimeout(() => {
        clearTimeout(this.timeout);
        navigator.mediaDevices
          .getUserMedia(this.constraints)
          .then(this.fnSuccess)
          .catch(this.fnError);
      }, 300);
    },
    // 成功启动视频媒体流
    fnSuccess(stream) {
      window.stream = stream; // 使流对浏览器控制台可用
      this.videoEl.srcObject = stream;
      this.videoEl.play();
    },
    // 失败启动视频媒体流
    fnError(error) {
    
      alert("视频媒体流获取错误" + error);
      this.fnClose();
      this.bqjckg=false;
    },
    // 结束摄像头视频媒体
    fnClose() {
      // 每次离开当前界面时，清除定时器
      clearInterval(this.bqdsq);
      this.bqdsq = null;

      clearInterval(this.tbgx);
      this.tbgx = null;

      this.now_expression = "null";
      this.canvasEl
        .getContext("2d")
        .clearRect(0, 0, this.canvasEl.width, this.canvasEl.height);
      this.videoEl.pause();
      clearTimeout(this.timeout);
      if (typeof window.stream === "object") {
        window.stream.getTracks().forEach((track) => track.stop());
        window.stream = "";
        this.videoEl.srcObject = null;
      } 
    },
  },
  beforeDestroy() {
    this.fnClose();
  },
};
</script>

<style scoped>
.see {
  position: relative;

  margin-left: -85px;
  margin-top: -15px;
}
.see canvas {
  position: absolute;
  top: 0;
  left: 0;
  width: 320px;
  height: 180px;
}
#myVideo {
  width: 320px;
  height: 180px;
}
#myshipin {
  width: 1024px;
  height: 576px;
  border-radius:25px 0px 0px 25px;
}
.shipinhang {
  margin-top: 50px;
  display: flex;
  flex-direction: column;
  align-items: flex-end;
}
.renlianhang {
  margin-top: 50px;
  width: 300px;
  display: flex;
  flex-direction: column;
  align-items: center;
  background-color: aliceblue;
  
  height: 576px;
  
  -webkit-box-reflect: below 10px -webkit-gradient(linear, left top, left bottom, from(transparent), to(rgba(250, 250, 250, 0.3)));
border-radius:0px 25px 25px 0px;
}

.renlianhang .el-switch {
  margin-top: 10%;
}
.video-mask {
  margin-top: 5%;
  width: 150px;
  height: 150px;
  -webkit-border-radius: 10px;
  -moz-border-radius: 50%;
  border-radius: 50%;
  overflow: hidden;
  border: 5px solid #ffc400;
}

/* 修改上传视频按钮 */
.upload-wrap {
  margin-top: 10%;
  position: relative;
  display: inline-block;
  overflow: hidden;
  border-radius: 3px;
}
.upload-wrap .file-ele {
  position: absolute;
  top: 0;
  right: 0;
  opacity: 0;
  height: 100%;
  width: 100%;
  cursor: pointer;
}
.upload-wrap .file-open {
  width: 220px;
  height: 30px;
  line-height: 30px;
  text-align: center;
  color: rgb(0, 0, 0);
  background: #ffc400;
}
#container {
  position: absolute;
  width: 100%;
    height: 95.2%;

  background-color: #c4e0e5; /* 浏览器不支持的时候显示 */
  background-image: linear-gradient(#c2e59c, #64b3f4);

  /* margin:0px;
background: url("../../public/img/bg2.jpg") no-repeat;
background-size:100% 100%;
background-attachment:fixed; */
}
.tubiaojiashipin {
  display: flex;

  flex-direction: row;
  align-items:center;
  /* 倒影 */
  -webkit-box-reflect: below 10px -webkit-gradient(linear, left top, left bottom, from(transparent), to(rgba(250, 250, 250, 0.3)));
}
.shuanniu {
  line-height: 20px;
}
.lishibiaoqing{
  display: flex;
}
.lishibiaoqing .dianyingxinxi{
  width: 225px;
  display: flex;
  flex-direction:column;
  align-items:center;
}
.dianyingxinxi h3{
  margin-top: 100px;
}
.dianyingxinxi .el-button{
  margin-top: 50px;
}

</style>
