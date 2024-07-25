<template>
  <div class="invite-share-box">
    <div class="headerBox">
      <img v-if="status" class="tit" :src="computedTit" alt="" />
    </div>
    <div class="mainBox">
      <div class="share-box">
        <div class="upBox">
          <span>房间号&nbsp;&nbsp;:</span>
          <van-field v-model="room_number" placeholder="输入房间ID号邀请好友进入房间" />
        </div>
        <div class="centerBox">
          <span
            >我的邀请码：<span>{{ invite_code }}</span></span
          >
          <div class="btnBox" @click="toCopy(invite_code, '邀请码')">复制</div>
        </div>
        <div class="downBox">
          <div class="leftBox" @click="toCopy(invite_href, '邀请链接')">
            <img src="@/assets/images/invite/link.png" alt="" />
          </div>
          <div class="rightBox" @click="qrFunc">
            <img src="@/assets/images/invite/qr.png" alt="" />
          </div>
        </div>
      </div>
      <div class="earnings-box">
        <div class="titBox">
          <span>我如何获得收益</span>
          <img src="@/assets/images/invite/line.png" alt="" />
        </div>
        <div class="conBox">
          <ul>
            <li>
              <div class="circleBox">1</div>
              <p>复制邀请码<br />分享链接或二维码</p>
            </li>
            <li>
              <div class="imgBox">
                <img src="@/assets/images/invite/you.png" alt="" />
              </div>
            </li>
            <li>
              <div class="circleBox">2</div>
              <p>邀请人下载APP<br />注册时填写您的邀请码</p>
            </li>
            <li>
              <div class="imgBox">
                <img src="@/assets/images/invite/you.png" alt="" />
              </div>
            </li>
            <li>
              <div class="circleBox">3</div>
              <p v-html="computedExplain"></p>
            </li>
          </ul>
        </div>
      </div>
      <div class="my-earnings-box">
        <div class="titBox">
          <span>我的收益</span>
          <img src="@/assets/images/invite/line.png" alt="" />
        </div>
        <div class="conBox">
          <div>
            <span class="tit">累计推荐人数</span>
            <span class="con">{{ ruleForm.count || 0 }}&nbsp;<span>人</span></span>
          </div>
          <div>
            <span class="tit">累计推荐收益</span>
            <span class="con">{{ ruleForm.in || 0 }}&nbsp;<span>饭团</span></span>
          </div>
        </div>
      </div>
    </div>

    <div class="rule-box" @click="ruleFunc">
      <img src="@/assets/images/invite/rule.png" alt="" />
    </div>

    <!-- 邀请规则组件 -->
    <rulesComp ref="rulesCompRef" />

    <!-- 二维码分享 -->
    <qrComp ref="qrCompRef" />
  </div>
</template>

<script setup lang="ts">
  import { statistics } from '/@/api/modules/invite';
  import rulesComp from './rulesComp.vue';
  import qrComp from './qrComp.vue';
  import { useClipboard } from '@vueuse/core';
  import { showToast } from 'vant';
  import referrer from '/@/assets/images/invite/referrer.png';
  import userReferrer from '/@/assets/images/invite/userReferrer.png';

  const { copy } = useClipboard();
  // 邀请规则组件
  const rulesCompRef = ref(null);
  // 二维码分享
  const qrCompRef = ref(null);

  // 变量
  const room_number = ref(null);
  const status = ref(null);
  const invite_code = ref('');
  const ruleForm = ref({}); // 统计数据

  // 计算属性
  const computedTit = computed(() => {
    // 推荐人
    if (!status.value) return '';
    if (status.value === 1) {
      return referrer;
    }
    if (status.value === 2) {
      return userReferrer;
    }
  });
  const computedExplain = computed(() => {
    if (!status.value) return '';
    // 我如何获得收益
    if (status.value === 1) {
      return '享受主播<br>收益的永久分成';
    }
    if (status.value === 2) {
      return '享受用户<br>充值的永久分成';
    }
  });
  const invite_href = computed(() => {
    // 分享链接
    // let url = `https://mmxq.aiyi.live/?nav=3&invite_code=${invite_code.value}&room_number=${room_number.value}`
    let url = `${import.meta.env.VITE_INVITE_URL}?nav=3&invite_code=${invite_code.value}&room_number=${room_number.value}`;
    return url || '';
  });

  // 复制操作
  const toCopy = (text, title) => {
    copy(text)
      .then(() => {
        showToast(`${title}已复制`);
      })
      .catch((err) => {
        console.error('[ err ] >', err);
        showToast(`${title}复制失败`);
      });
  };

  const statisticsFunc = async () => {
    let res = await statistics();
    ruleForm.value = res;
  };

  const loadParams = (row: any) => {
    status.value = row.setting_flg;
    invite_code.value = String(row.user_number) || '';
    statisticsFunc();
    setTimeout(() => {
      qrCompRef.value.show = false;
    }, 500);
  };

  const ruleFunc = () => {
    rulesCompRef.value.loadParams(1);
  };

  const qrFunc = () => {
    let params = invite_href.value.split('nav=3&');
    let url = params[1].split('&');
    let back = {};
    url.forEach((item) => {
      let data = item.split('=');
      back[data[0]] = data[1];
    });

    qrCompRef.value.loadParams(back, invite_href.value);
  };

  onMounted(() => {
    qrCompRef.value.isHide = true;
    qrCompRef.value.show = true;
  });

  defineExpose({
    loadParams,
  });
</script>

<style lang="scss" scoped>
  .invite-share-box {
    background: #ff7c00;

    .headerBox {
      width: 100%;
      height: 438px;
      background: url('@/assets/images/invite/bg.png') center center;
      background-size: cover;
      display: flex;
      justify-content: center;
      padding-top: 106px;

      > img {
        width: 405px;
        height: 91px;
      }
    }

    > .mainBox {
      padding: 40px 30px 80px;

      .share-box {
        width: 100%;
        height: 424px;
        border-radius: 20px;
        background: rgb(255 255 255 / 100%);
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;

        .upBox {
          width: 600px;
          height: 80px;
          border-radius: 40px;
          background: rgb(255 255 255 / 100%);
          border: 1px solid #f98314;
          display: flex;
          align-items: center;
          overflow: hidden;
          padding-left: 30px;

          > span {
            color: #333;
            font-size: 28px;
            display: flex;
            width: 150px;
          }

          .van-cell {
            padding: 0;
            padding-left: 10px;
            line-height: 80px;
          }
        }

        .centerBox {
          display: flex;
          align-items: center;
          margin: 50px 0 59px;

          > span {
            font-size: 28px;
            color: #666;
          }

          .btnBox {
            width: 68px;
            height: 30px;
            border-radius: 15px;
            background: rgb(235 235 235 / 100%);
            font-size: 20px;
            color: #666;
            display: flex;
            align-items: center;
            justify-content: center;
            line-height: 30px;
            margin-left: 10px;
          }
        }

        .downBox {
          display: flex;
          align-items: center;

          > div {
            width: 270px;
            height: 108px;
            position: relative;

            > img {
              width: 100%;
              height: 100%;
              position: absolute;
              top: 0;
              left: 0;
            }
          }

          .leftBox {
            margin-right: 20px;
          }
        }
      }

      .earnings-box {
        width: 100%;
        height: 336px;
        border-radius: 20px;
        background: rgb(255 255 255 / 100%);
        margin: 30px 0;
        display: flex;
        flex-direction: column;
        align-items: center;
        padding-top: 60px;

        .titBox {
          width: 597px;
          height: 26px;
          position: relative;
          display: flex;
          align-items: center;
          justify-content: center;

          > img {
            width: 100%;
            height: 100%;
            position: absolute;
            top: 0;
            left: 0;
          }

          > span {
            font-size: 28px;
            color: #333;
          }
        }

        .conBox {
          margin-top: 60px;

          ul {
            display: flex;

            li {
              .imgBox {
                padding-top: 5px;

                > img {
                  width: 16px;
                  height: 16px;
                }
              }
            }

            li:nth-child(odd) {
              display: flex;
              flex-direction: column;
              align-items: center;

              .circleBox {
                width: 60px;
                height: 60px;
                background: rgb(255 203 140 / 100%);
                border-radius: 50%;
                font-weight: bold;
                font-size: 30px;
                color: #8a500a;
                display: flex;
                align-items: center;
                justify-content: center;
                line-height: 60px;
                margin-bottom: 20px;
              }

              > p {
                font-size: 20px;
                color: #999;
                text-align: center;
                line-height: 36px;
              }
            }

            li:nth-child(2) {
              margin-left: 10px;
            }

            li:nth-child(4) {
              margin-right: 25px;
            }
          }
        }
      }

      .my-earnings-box {
        width: 100%;
        height: 336px;
        border-radius: 20px;
        background: rgb(255 255 255 / 100%);
        display: flex;
        flex-direction: column;
        align-items: center;
        padding-top: 60px;

        .titBox {
          width: 597px;
          height: 26px;
          position: relative;
          display: flex;
          align-items: center;
          justify-content: center;

          > img {
            width: 100%;
            height: 100%;
            position: absolute;
            top: 0;
            left: 0;
          }

          > span {
            font-size: 28px;
            color: #333;
          }
        }

        .conBox {
          width: 100%;
          display: flex;
          margin-top: 70px;

          > div {
            flex: 1;
            display: flex;
            flex-direction: column;
            align-items: center;

            > span.tit {
              font-size: 24px;
              color: #666;
              margin-bottom: 15px;
            }

            > span.con {
              font-size: 36px;
              color: #333;

              > span {
                font-size: 20px;
                color: #333;
              }
            }
          }
        }
      }
    }

    .rule-box {
      width: 95px;
      height: 173px;
      position: absolute;
      top: 19px;
      right: 0;

      > img {
        width: 100%;
        height: 100%;
      }
    }
  }
</style>
