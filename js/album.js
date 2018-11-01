const album = new Vue({
  el: '#app',
  data: {
    albumData: [],
    albumMusicUrl: '',
    urlHref: '',
    allData: '',
    music: false,
    readyStatus: false
  },
  mounted: function() {
    let ID = this.GetUrlParam('id');
    let url = 'https://feiinterface.iflying.com:4443/XiaoLong/XLTest/GetTouristAlbum?id=' + ID;
    axios.get(url).then(res => {
      this.allData = res.data.data;
      this.urlHref = window.location.href;
      this.albumData = res.data.data.TouristAlbumSorts;
      let albumMusicId = res.data.data.TouristAlbums.Musicid;
      this.albumMusicUrl = 'http://pic.iflying.com/upFile/Void/2018-04-17/music' + albumMusicId + '.mp3';
      this.albumData.forEach(item => {
        switch(item.Template) {
          case(1):
            if (item.WrittenWords) {
              item.WrittenWords.Direction = 2;
            }
            if (item.Pics[0]) {
              item.Pics[0].Direction = 5;
            }
            break;
          case(2):
            if (item.WrittenWords) {
              item.WrittenWords.Direction = 7;
            }
            if (item.Pics[0]) {
              item.Pics[0].Direction = 8;
            }
            if (item.Pics[1]) {
              item.Pics[1].Direction = 9;
            }
            break;
          case(3):
            if (item.WrittenWords) {
              item.WrittenWords.Direction = 8;
            }
            if (item.Pics[0]) {
              item.Pics[0].Direction = 9;
            }
            if (item.Pics[1]) {
              item.Pics[1].Direction = 8;
            }
            break;
          case(4):
            if (item.WrittenWords) {
              item.WrittenWords.Direction = 7;
            }
            if (item.Pics[0]) {
              item.Pics[0].Direction = 6;
            }
            if (item.Pics[1]) {
              item.Pics[1].Direction = 8;
            }
            if (item.Pics[2]) {
              item.Pics[2].Direction = 9;
            }
            break;
          case(5):
            if (item.Pics[0]) {
              item.Pics[0].Direction = 8;
            }
            if (item.Pics[1]) {
              item.Pics[1].Direction = 9;
            }
            if (item.Pics[2]) {
              item.Pics[2].Direction = 8;
            }
            break;
          case(6):
            if (item.WrittenWords) {
              item.WrittenWords.Direction = 1;
            }
            if (item.Pics[0]) {
              item.Pics[0].Direction = 5;
            }
            break;
          case(7):
            if (item.Pics[0]) {
              item.Pics[0].Direction = 5;
            }
            break;
          case(8):
            if (item.WrittenWords) {
              item.WrittenWords.Direction = 10; 
            }
            if (item.Pics[0]) {
              item.Pics[0].Direction = 7;
            }
            break;
        }
      });
      this.$nextTick(() => {
        GetJsTicket(this.allData, this.urlHref);
        this.readyStatus = true;

        const myScroll = new IScroll('#wrapper', {
          scrollX: false, 
          scrollY: true, 
          snap: 'li',
          click: true,
          indicators: {
            el: '#indicator',
            fade: false,
            ignoreBoundaries: false,
            interactive: true,
            listenX: false,
            listenY: true,
            resize: false,
            shrink: false,
            speedRatioX: 0,
            speedRatioY: 0,
            preventDefault: false
         },
         momentum: false, //在用户快速触摸屏幕时，你可以开/关势能动画。关闭此功能将大幅度提升性能。
         useTransition: false,
         bounce: true, //当滚动器到达容器边界时他将执行一个小反弹动画
         mouseWheel: true //侦听鼠标滚轮事件。
        });

        let current = 0;
        myScroll.on('scrollEnd', function () {
          const list = document.querySelectorAll('.page');
          list[current].classList.remove('current');
          current = myScroll.currentPage.pageY;
          list[current].classList.add('current');
        });
      });

      const music = document.getElementById("music-audio"); 
      music.src = this.albumMusicUrl;
      music.play(); 

      function autoPlayAudio1() {
        wx.config({
            debug: false,
            appId: '',
            timestamp: 1,
            nonceStr: '',
            signature: '',
            jsApiList: []
        });
        wx.ready(function() {
            document.getElementById('music-audio').play();
        });
      }
      autoPlayAudio1();

    }).catch(err => {
      console.log(err);
    });
  },
  methods: {
    stopMusic() {
      this.music = this.music ? (this.music = false) : (this.music = true);
      const music = document.getElementById("music-audio");
      if (!this.music) {
        music.play();
      } else {
        music.pause();
      }
    }, 
    animation (name) {
      switch(name) {
        case 1:
          return 'bounceInUp';
        case 2:
          return 'bounceInLeft';
        case 3:
          return 'bounceInRight';
        case 4:
          return 'bounceInDown';
        case 5:
          return 'zoomIn';
        case 6:
          return 'rotateInDownLeft';
        case 7:
          return 'fadeInUp';
        case 8:
          return 'fadeInLeft';
        case 9:
          return 'fadeInRight';
        case 10:
          return 'fadeInDown';
      }
    },
    GetUrlParam(paraName) {
　　　　var url = window.location.href;
　　　　var arrObj = url.split("?");

　　　　if (arrObj.length > 1) {
　　　　　　var arrPara = arrObj[1].split("&");
　　　　　　var arr;

　　　　　　for (var i = 0; i < arrPara.length; i++) {
　　　　　　　　arr = arrPara[i].split("=");

　　　　　　　　if (arr != null && arr[0] == paraName) {
　　　　　　　　　　return arr[1];
　　　　　　　　}
　　　　　　}
　　　　　　return "";
　　　　}
　　　　else {
　　　　　　return "";
　　　　}
　　}
  },
  filters: {
    formatDate: time => {
      let d= new Date(time);
      let rightDate =d.getFullYear() + '.' + (d.getMonth() + 1) + '.' + d.getDate(); 
      return rightDate;
    }
  }
});

document.addEventListener('touchmove', e => {
  e.preventDefault();
}, {
  passive: false
});