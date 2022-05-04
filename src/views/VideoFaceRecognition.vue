<template>
  <div class="video_face_recognition">
    <div id="container"></div>
 

<el-row>
  <el-col :md="10" class="anniuzu">
    <div>
      <div class="upload-wrap anticon" nv-file-drop="" uploader="uploader">
          <input
            class="file-ele"
            type="file"
            accept="video/mp4, video/ogg, video/webm"
            @change="fnChange($event)"
          />
        <el-button class="file-open">上传视频</el-button>
        </div>
    </div>


       <div>
      <el-button  type="primary" ref="kaishianniu" @click="fnPaused">开始检查</el-button>
    </div>

    </el-col >
 <el-col :md="14" >
   <el-popover
    placement="bottom-end"
    title="提示"
    width="300"
    trigger="hover"
    content="请先上传需要检查表情的视频，然后点击开始检查，检查完成后会生成表情描点视频，可以将描点视频播放一遍后进行下载！">
    <el-button class="tishi" type="primary" icon="el-icon-ice-cream-round" circle size="mini" slot="reference"></el-button>
  </el-popover>

 </el-col >
</el-row>

<el-row>

   <el-col :md="10" >
     <div class="zuolie">
 <div >
    <video
      ref="myVideo"
      id="myVideo"
      src="videos/test.mp4"
      muted
      playsinline
    ></video>
   </div>


  <div>
    <canvas v-show="canvasif" id="myCanvas" />
        <video
        id="huizhivideo"
        v-show="!canvasif"
      ref="huizhivideo"
      width="320"
      height="180"
      controls="true"
      autoplay="true"
    ></video>

    </div>
</div>
 </el-col >
   <el-col :md="14" class="youlie">
    <div class="main" ref="main"></div>
</el-col >
</el-row>


  </div>
</template>

<script>
import * as faceapi from "face-api.js";
import * as echarts from "echarts";
export default {
  name: "VideoAgeAndGenderRecognition",

  data() {
    return {
      canvasif:true,
      recorder: null,
      nets: "tinyFaceDetector", // 模型
      options: null, // 模型参数
      withBoxes: false, // 框or轮廓
      detectFace: "detectSingleFace", // 单or多人脸
      detection: "expression",
      videoEl: null,
      canvasEl: null,
      myChart: null,
      timeout: 0,
      angry: { may: 0, expression: "angry" }, //愤怒
      disgusted: { may: 0, expression: "disgusted" }, //厌烦
      fearful: { may: 0, expression: "fearful" }, //害怕
      happy: { may: 0, expression: "happy" }, //开心
      neutral: { may: 0, expression: "neutral" }, //平淡
      sad: { may: 0, expression: "sad" }, //难过
      surprised: { may: 0, expression: "surprised" }, //惊讶
      angry_number: 0,
      disgusted_number: 0,
      fearful_number: 0,
      happy_number: 0,
      neutral_number: 0,
      sad_number: 0,
      surprised_number: 0,
      timer: null,
      now_expression: "null",
    };
  },
  created: function () {
    // 每次进入界面时，先清除之前的所有定时器，然后启动新的定时器
  },
  destroyed: function () {
    // 每次离开当前界面时，清除定时器
  },

  watch: {
    nets(val) {
      this.nets = val;
      this.fnInit();
    },
    detection(val) {
      this.detection = val;
      if (!this.videoEl.paused) {
        this.videoEl.pause();
        setTimeout(() => {
          this.videoEl.play();
          setTimeout(() => this.fnRun(), 300);
        }, 300);
      }
    },
  },
  mounted() {
    this.$nextTick(() => {
      this.fnInit();
    });

    this.sctb();
    this.$refs.myVideo.addEventListener("ended", () => {
      console.log("电影播放完毕");
      this.canvasif=false
      this.videoEl.pause();
      clearInterval(this.timer);
      this.timer = null;
      this.recorder.stop();
      this.$refs.kaishianniu.disabled = false;
    });
  },
  methods: {




    //录制canvas
    lzcanvas() {
      const stream = this.canvasEl.captureStream();

      this.recorder = new MediaRecorder(stream, { mimeType: "video/webm" });
      var data = [];
      this.recorder.ondataavailable = function (event) {
        if (event.data && event.data.size) {
          data.push(event.data);
        }
      };

      this.recorder.onstop = () => {
        var url = URL.createObjectURL(new Blob(data, { type: "video/webm" }));
        this.$refs.huizhivideo.src = url;
        this.$refs.huizhivideo.pause();
      };
    },

    //生成图表
    sctb() {
      var data = [
        this.happy_number,
        this.surprised_number,
        this.neutral_number,
        this.sad_number,
        this.disgusted_number,
        this.fearful_number,
        this.angry_number,
      ];

      // 基于准备好的dom，初始化echarts实例
      this.myChart = echarts.init(this.$refs.main);
      // 绘制图表
      this.myChart.setOption({
        xAxis: {
          max: "dataMax",
          
        },
        yAxis: {
          type: "category",
          data: ["开心", "惊讶", "平淡", "难过", "厌烦", "害怕", "愤怒"],
          inverse: true,
          animationDuration: 300,
          animationDurationUpdate: 300,
          max: 6, // only the largest 3 bars will be displayed
        },
        series: [
          {
            realtimeSort: true,
            name: "X",
            type: "bar",
            data: data,
            label: {
              show: true,
              position: "right",
              valueAnimation: true,
            },
            color:'#fc8452'
          },
        ],
        title: {
          show: true,
          text: "表情检查",
          x: "center",
          subtext: "单位/秒(s)",
          textStyle: { fontSize: 18, fontWeight: "bolder", color: "#444" },
          subtextStyle: { fontSize: 12, color: "#666" },
        },
        animationDuration: 1000,
        animationDurationUpdate: 1000,
        animationEasing: "linear",
        animationEasingUpdate: "linear",
      });
    },
    //设置定时器
    setTimer() {
      if (this.timer == null) {
        this.timer = setInterval(() => {
          this.expression_number();

          //更新图表中的数据
          var data = [
            this.happy_number,
            this.surprised_number,
            this.neutral_number,
            this.sad_number,
            this.disgusted_number,
            this.fearful_number,
            this.angry_number,
          ];
          this.myChart.setOption({
            series: [
              {
                data: data,
              },
            ],
          });
        }, 1000);
      }
    },

    //获取表情次数
    expression_number() {
      switch (this.now_expression) {
        case "null":
          console.log("未识别到表情！");
          break;
        case "angry":
          this.angry_number++;
          break;
        case "disgusted":
          this.disgusted_number++;
          break;
        case "fearful":
          this.fearful_number++;
          break;
        case "happy":
          this.happy_number++;
          break;
        case "neutral":
          this.neutral_number++;
          break;
        case "sad":
          this.sad_number++;
          break;
        case "surprised":
          this.surprised_number++;
          break;
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
      // 根据模型参数识别调整结果
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
    // 人脸表情识别绘制
    async fnRunFaceExpression() {
      if (this.videoEl.paused) return clearTimeout(this.timeout);
      // 识别绘制人脸信息
      const result = await faceapi[this.detectFace](this.videoEl, this.options)
        .withFaceLandmarks()
        .withFaceExpressions();
      if (result) {
        const dims = faceapi.matchDimensions(this.canvasEl, this.videoEl, true);
        const resizeResult = faceapi.resizeResults(result, dims);

        this.now_expression = this.maxexpression(
          faceapi.resizeResults(result, dims).expressions
        );

        //绘制表情标签
        // faceapi.draw.drawFaceExpressions(this.canvasEl, resizeResult, 0.5);

        //绘制表情描点
        this.withBoxes
          ? faceapi.draw.drawDetections(this.canvasEl, resizeResult)
          : faceapi.draw.drawFaceLandmarks(this.canvasEl, resizeResult);
      } else {
        this.canvasEl
          .getContext("2d")
          .clearRect(0, 0, this.canvasEl.width, this.canvasEl.height);
      }
      this.timeout = setTimeout(() => this.fnRunFaceExpression());
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
    // 视频播放
    fnPaused() {
      if (this.videoEl.paused) {
        this.videoEl.play();
        clearInterval(this.timer);
        this.timer = null;
        this.setTimer();
        setTimeout(() => this.fnRun(), 300);

        //录制canvas
        this.canvasif=true
        this.lzcanvas();
        this.recorder.start();
        this.$refs.kaishianniu.disabled = true;
      }
    },
    // 更换视频,清空绘制
    fnChange(e) {
      if (!e.target.files.length) return;
      this.videoEl.pause();
      setTimeout(() => {
        this.canvasif=true
        this.canvasEl
          .getContext("2d")
          .clearRect(0, 0, this.canvasEl.width, this.canvasEl.height);
        this.videoEl.src = URL.createObjectURL(e.target.files[0]);
      }, 300);

    },
  },
  beforeDestroy() {
    this.videoEl.pause();
    clearTimeout(this.timeout);
  },
};
</script>

<style scoped>

#myVideo {
  width: 320px;
  height: 180px;
  border-radius:25px 0px 0px 0px;
}
#huizhivideo{
  margin-top: -4.5px;
  border-radius:0px 0px 0px 25px;
}
#myCanvas {
  margin-top: -4px;
  background-color: rgb(0, 0, 0);
  width: 320px;
  height: 180px;
  border-radius:0px 0px 0px 25px;
}
.main {
  width: 640px;
  height: 360px;
  background-color: aliceblue;
  border-radius:0px 25px 25px 0px
} 

#container {
  position: absolute;
  width: 100%;
    height: 95.2%;
z-index: -2;
  background-color: #c4e0e5; /* 浏览器不支持的时候显示 */
  background-image: linear-gradient(#c2e59c, #64b3f4);

  /* margin:0px;
background: url("../../public/img/bg2.jpg") no-repeat;
background-size:100% 100%;
background-attachment:fixed; */
}

.zuolie{
  display: flex;
  flex-direction:column;
  align-items:flex-end;
}


/* 修改上传视频按钮 */
.upload-wrap {
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

.anniuzu{
  margin-top: 5%;
  display: flex;
  justify-content:flex-end;
  
}

.tishi{
  margin-top: 10%;
  margin-left: 600px;
}

</style>
