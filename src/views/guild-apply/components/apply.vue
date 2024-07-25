<template>
  <div class="guild-apply-box">
    <div class="headerBox">
      <img class="bg" src="@/assets/images/guild/banner.png" alt="" />
    </div>
    <div class="mainBox">
      <div class="preface">
        <h6>前言：</h6>
        <p>感谢您关注团团语音平台，请完整填写如下信息，方才转交相关工作人员，会由相应的运营人员负责对接沟通【相关政策以及入驻条件】</p>
      </div>
      <div class="formBox">
        <van-form @submit="onSubmit" label-width="300px">
          <van-field
            class="requiredBox"
            v-model="ruleForm.user_number"
            type="number"
            label="1.团团ID"
            placeholder="请输入团团ID"
            maxlength="9"
            :rules="[{ required: true, message: '请输入团团ID' }]"
          />
          <van-field class="requiredBox" name="radio" label="2.公会类型">
            <template #input>
              <van-radio-group v-model="ruleForm.guild_type" direction="horizontal">
                <van-radio v-for="item in guildTypeList" :key="item.type" :name="item.type">{{ item.remark }}</van-radio>
              </van-radio-group>
            </template>
          </van-field>
          <van-field
            class="requiredBox"
            v-model="ruleForm.guild_name"
            label="3.公会名称"
            placeholder="请输入公会名称"
            :rules="[{ required: true, message: '请输入公会名称' }]"
          />
          <van-field
            class="requiredBox"
            v-model="ruleForm.question.question1"
            label="4.主播数量"
            :rules="[{ required: true, message: '请输入主播数量' }]"
          />
          <van-field
            class="requiredBox"
            v-model="ruleForm.question.question2"
            label="5.曾经的合作平台"
            placeholder="最多150字"
            type="textarea"
            rows="3"
            maxlength="150"
            :rules="[{ required: true, message: '请输入曾经的合作平台' }]"
          />
          <van-field
            class="requiredBox"
            v-model="ruleForm.contact_way"
            label="6.联系方式：手机号/微信号"
            placeholder="请输入联系方式"
            :rules="[{ required: true, message: '请输入联系方式' }]"
          />
          <van-field v-if="!is_guild_user" class="requiredBox" readonly label="7.签署协议：为了保证双方权益需签署以下协议方可提交申请">
            <template #input>
              <div class="contract-box">
                <div class="contract-item" @click="viewAgreement(2)">
                  <img class="icon" src="@/assets/images/guild/document.png" alt="" />
                  <div class="name">《公会入驻协议》</div>
                  <van-button
                    class="btn"
                    :class="{ disabled: sign_guild === 1 }"
                    round
                    size="mini"
                    color="#1ACBFD"
                    @click.stop="handleSign(2)"
                    >{{ sign_guild === 1 ? '已签署' : '去签署' }}</van-button
                  >
                </div>
                <div class="contract-item" @click="viewAgreement(1)">
                  <img class="icon" src="@/assets/images/guild/document.png" alt="" />
                  <div class="name">《主播入驻协议》</div>
                  <van-button
                    class="btn"
                    :class="{ disabled: sign_anchor === 1 }"
                    round
                    size="mini"
                    color="#1ACBFD"
                    @click.stop="handleSign(1)"
                    >{{ sign_anchor === 1 ? '已签署' : '去签署' }}</van-button
                  >
                </div>
              </div>
            </template>
          </van-field>
          <div class="btnBox">
            <van-button round block native-type="submit" color="#1ACBFD">提交申请</van-button>
          </div>
        </van-form>
      </div>
    </div>

    <!-- loading -->
    <div class="loadingBox" v-if="isShow">
      <van-loading size="24px">加载中...</van-loading>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { showToast } from 'vant';
  import { newGuildApply, getGuildType, getSignStatus, createWithTemplate } from '/@/api/modules/guild';

  const ruleForm = reactive({
    user_number: '',
    guild_name: '',
    question: {
      question1: '',
      question2: '',
    },
    guild_type: 2,
    contact_way: '',
  });
  // 是否是公会成员，公会成员不显示签署协议
  const is_guild_user = ref<boolean>(true);
  const sign_guild = ref<number>(0);
  const guild_agreement_url = ref<string>('');
  const sign_anchor = ref<number>(0);
  const anchor_agreement_url = ref<string>('');
  const isShow = ref(false);
  const guildTypeList = ref<any>([]);

  const emit = defineEmits(['next']);

  // 提交
  const onSubmit = async () => {
    // 不是公会成员，并且存在协议未签署，则不允许提交
    if (!is_guild_user.value && (sign_guild.value !== 1 || sign_anchor.value !== 1)) {
      showToast('请先签署协议');
      return;
    }
    isShow.value = true;
    let params = { ...ruleForm };
    let res = await newGuildApply(params).catch(() => {
      isShow.value = false;
    });
    if (!res) return;
    emit('next');
    showToast('申请成功');
    isShow.value = false;
    // 移除缓存数据
    localStorage.removeItem('guild-apply-data');
  };

  // 获取公会类型
  const getGuildTypeSource = async () => {
    const res = await getGuildType();
    console.log('[ res ] >', res);
    guildTypeList.value = res.list;
  };

  // 获取签署协议状态
  const getAgreementStatus = async () => {
    // 查询公会协议签署状态，签署类型（1主播协议 2公会协议 3公司协议）
    const res = await getSignStatus({ type: '1,2' });
    console.log('[ res ] >', res);
    if (!res) return;
    is_guild_user.value = res.is_guild_user || false;
    sign_guild.value = res.guild_agreement || 0;
    guild_agreement_url.value = res.guild_agreement_url || '';
    sign_anchor.value = res.anchor_agreement || 0;
    anchor_agreement_url.value = res.anchor_agreement_url || '';
  };

  // 签署协议
  const handleSign = async (type: number) => {
    isShow.value = true;
    // 查询公会协议签署状态，签署类型（1主播协议 2公会协议 3公司协议）
    // 请求来源 cash_h5=h5提现，cash_pc=pc提现，guild_join=公会入驻 默认是主播申请加入
    const res = await createWithTemplate({ type, request_from: 'guild_join' }).catch((err) => {
      console.log('[ err ] >', err);
      isShow.value = false;
    });
    console.log('[ res ] >', res);
    if (!res) return;
    isShow.value = false;
    // 签署前保存填写信息
    localStorage.setItem('guild-apply-data', JSON.stringify(ruleForm));
    window.location.href = res.actorSignTaskEmbedUrl;
  };

  // 查看协议
  const viewAgreement = (type: number) => {
    // 主播协议未签署
    if (type === 1 && sign_anchor.value !== 1) {
      return;
    }

    // 公会协议未签署
    if (type === 2 && sign_guild.value !== 1) {
      return;
    }

    window.location.href = type === 1 ? anchor_agreement_url.value : guild_agreement_url.value;
  };

  onMounted(() => {
    document.title = '创建公会';
    // 获取历史缓存的数据自动填充表单
    const guildInfo = localStorage.getItem('guild-apply-data');
    if (guildInfo) {
      const data = JSON.parse(guildInfo);
      Object.assign(ruleForm, data);
      console.log('[ ruleForm ] >', ruleForm);
    }
    getGuildTypeSource();
    getAgreementStatus();
  });
</script>

<style lang="scss" scoped>
  .guild-apply-box {
    padding-bottom: 50px;
    background: #fff;
  }

  .headerBox {
    width: 100%;
    height: 280px;

    > img {
      width: 100%;
    }
  }

  .mainBox {
    padding: 60px 30px 0;
    color: #333;

    .preface {
      h6 {
        font-weight: bold;
        font-size: 24px;
      }

      p {
        font-size: 24px;
        line-height: 40px;
        margin-top: 17px;
      }
    }
  }

  .formBox {
    padding-top: 49px;

    :deep(.van-form) {
      .van-radio-group {
        margin-top: 29px;
        margin-bottom: 50px;

        .van-radio {
          .van-radio__icon {
            height: initial;

            .van-icon {
              width: 1em;
              height: 1em;
              line-height: initial;
            }
          }

          > span {
            font-size: 24px;
          }
        }
      }

      .van-cell {
        display: flex;
        flex-direction: column;
        padding: 0;
        margin-bottom: 50px;

        .van-cell__title {
          span {
            font-size: 28px;
          }
        }

        .van-field__body {
          margin-top: 29px;

          input {
            height: 89px;
            border: 1px solid #ccc;
            border-radius: 10px;
            background: rgb(255 255 255 / 100%);
            padding: 0 20px;
          }

          textarea {
            border: 1px solid #ccc;
            border-radius: 10px;
            background: rgb(255 255 255 / 100%);
            padding: 20px;
          }

          .van-radio-group {
            display: flex;
            align-items: center;
            justify-content: center;
            margin-left: 10px;

            .van-radio:nth-child(1) {
              margin-right: 100px;
            }
          }
        }
      }

      .van-cell::after {
        display: none;
      }
    }

    .requiredBox {
      :deep(.van-cell__title) {
        > label::before {
          content: '*';
          color: #ee0a24;
          margin-right: 4px;
        }
      }

      :deep(.van-cell__value) {
        .van-field__body {
          .img-icon {
            width: 43px;
            height: 43px;
          }
        }
      }
    }

    .btnBox {
      margin: 16px;

      :deep(.van-button) {
        height: 98px;
        font-size: 32px;
      }
    }
  }

  .loadingBox {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgb(0 0 0 / 50%);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 3;
  }

  .contract-box {
    width: 100%;
  }

  .contract-item {
    display: flex;
    align-items: center;
    width: 100%;
    padding: 16px 24px;
    background-color: #f6f7fa;
    border-radius: 16px;

    & + .contract-item {
      margin-top: 16px;
    }

    .icon {
      width: 68px;
      height: 68px;
    }

    .name {
      flex: 1;
      margin-left: 4px;
      // text-align: left;
      font-size: 28px;
      color: #242424;
    }

    .btn {
      padding: 10px 36px;
      font-size: 28px;
      line-height: 1.2;
      border: none;

      &.disabled {
        color: #666 !important;
        background: #dcdcdc !important;
        cursor: not-allowed;
        pointer-events: none;
      }
    }
  }
</style>
