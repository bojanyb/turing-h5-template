/* eslint-disable */
import { GameConfigModel, SudFSMMGDecorator, SudFSTAPPDecorator, SudFSMMGListener } from 'sudmgp-sdk-js-wrapper';
import { SudMGP } from 'sudmgp-sdk-js';
import { getCode, getConfig } from '@/api/modules/game'; // 短期令牌code接口
import type { ISudMGP, ISudFSTAPP } from 'sudmgp-sdk-js/type';
import type { ISudFSMStateHandle } from 'sudmgp-sdk-js-wrapper/type/core';
import { js_sync_app } from '@/utils/index';
import {
  IMGCommonKeyWordToHit,
  IMGCommonPlayerPlaying,
  IMGCommonSelfHeadphone,
  IMGCommonSelfMicrophone,
} from 'sudmgp-sdk-js-wrapper/state/ISudMGPMGState';

const SudMGPSDK = SudMGP as ISudMGP;
interface IInitSDKParam {
  userId: string;
  code: string;
  appId: string;
  appKey: string;
  isTestEnv: boolean;
}

interface ILoadGameParam {
  userId: string;
  code: string;
}

interface IBaseGameViewModelConstru {
  root: HTMLElement;
  userId: string;
  gameRoomId: string;
  gameId: string;
  language?: string;
}

export class SDKGameView {
  private gameRoomId: string; // 游戏房间id，房间隔离，同一房间才能一起游戏
  private language: string = 'zh-CN'; /** 游戏的语言代码 */
  private gameId: string; // 游戏id
  private isPlay: boolean; // 是否能够web玩游戏

  public root: HTMLElement; // 绑定到元素上
  /** 使用的UserId。这里随机生成作演示，开发者将其修改为业务使用的唯一userId */
  public userId = '100668'; // Math.floor((Math.random() + 1) * 10000).toString()
  /** Sud平台申请的appId */
  // eslint-disable-next-line camelcase
  public SudMGP_APP_ID = '1774983938616459265'; // '1461564080052506636' // "1498868666956988417"
  /** Sud平台申请的appKey */
  // eslint-disable-next-line camelcase
  public SudMGP_APP_KEY = 'wKy7sqoOEXYRPe0nskcLUs8JZqqS8zfI'; // '1461564080052506636' //"E9Lj2Cg61pUgiSESou6WDtxntoTXH7Gf"

  /** true 加载游戏时为测试环境 false 加载游戏时为生产环境 */
  public GAME_IS_TEST_ENV = import.meta.env.MODE !== 'production';

  // app调用sdk的封装类
  public sudFSTAPPDecorator = new SudFSTAPPDecorator();
  // 用于处理游戏SDK部分回调业务
  public sudFSMMGDecorator = new SudFSMMGDecorator();

  public customSudFSMMGListener: Partial<SudFSMMGListener> | undefined;

  public iSudFSTAPP: ISudFSTAPP | null = null;

  public gameIsStarted: boolean = false;

  // 游戏关键词
  private keyword: IMGCommonKeyWordToHit | null = null;

  // 初始化数据

  // 初始化数据
  constructor({ root, gameRoomId, language = 'zh-CN', gameId, userId, isPlay }: IBaseGameViewModelConstru) {
    this.gameRoomId = gameRoomId;
    this.gameId = gameId;
    this.userId = userId;
    this.root = root;
    language && (this.language = language);
    this.isPlay = isPlay;
  }

  /**
   * 获取游戏配置
   */
  public getConfig() {
    return new Promise<void>((resolve, reject) => {
      const params = {
        room_number: this.gameRoomId,
      };
      getConfig(params)
        .then((res) => {
          this.SudMGP_APP_ID = res.app_id;
          this.SudMGP_APP_KEY = res.app_key;
          resolve();
        })
        .catch((err) => {
          console.log('[ 获取游戏配置错误 ] >', err);
          reject(err);
        });
    });
  }

  /**
   * 第1步，获取短期令牌code，用于换取游戏Server访问APP Server的长期ssToken
   * 接入方客户端 调用 接入方服务端 login 获取 短期令牌code
   * 参考文档时序图：sud-mgp-doc(https://docs.sud.tech/zh-CN/app/Client/StartUp-Android.html)
   */
  public login() {
    return new Promise(() => {
      const data = {
        user_id: this.userId,
        // app_id: this.SudMGP_APP_ID,
      };
      // 获取code
      getCode(data).then(async (res) => {
        console.log('[ code res ] >', res);
        const code = res.code;
        console.log(code);
        (await this.beforeInitSdk) && this.beforeInitSdk(SudMGP);
        // this.getConfig();
        this.initSdk({
          userId: this.userId,
          code,
          appId: this.SudMGP_APP_ID,
          appKey: this.SudMGP_APP_KEY,
          isTestEnv: this.GAME_IS_TEST_ENV,
        });
      });
    });
  }

  // before init生命周期
  public beforeInitSdk(SudMGP: ISudMGP) {
    return new Promise<void>((resolve) => {
      resolve();
    });
  }

  // 注册通信桥接，页面自身有window.onmessage事件时，需要在定义window.onmessage后执行该方法
  public _registerCustomCommandEvent() {
    SudMGPSDK._registerCustomCommandEvent();
  }

  /**
   * 第2步，初始化SudMGP sdk
   *
   */
  public initSdk({ userId, appId, code, appKey, isTestEnv }: IInitSDKParam) {
    const bundleId = this.getBundleId();
    const self = this;
    const version = SudMGPSDK.getVersion();
    console.log('[ appId ] >', appId);
    console.log('[ appKey ] >', appKey);
    console.log('[ version ] >', version);
    SudMGPSDK.initSDK(appId, appKey, bundleId, isTestEnv, {
      onSuccess() {
        self.loadGame({ userId, code });
      },
      onFailure(errCode: number, errMsg: string) {
        // TODO: 2022/6/13 下面可以根据业务需要决定是否保留
        if (isTestEnv) {
          console.error(`${bundleId}, initSDK onFailure:${errMsg} (${errCode})`);
        }
      },
    });
  }

  /**
   * 第3步，加载游戏
   *
   */
  public loadGame({ userId, code }: ILoadGameParam) {
    const gameRoomId = this.gameRoomId;
    const gameId = this.gameId;
    const language = this.language;
    const self = this;
    const customSudFSMMGListener = this.customSudFSMMGListener || {};
    this.sudFSMMGDecorator.setSudFSMMGListener({
      // 默认监听事件
      onGameStarted() {
        console.log('game started');
        self.gameIsStarted = true;
      },
      onGameCustomerStateChange(handle, state, dataJson) {
        console.log('======onGameCustomerStateChange====', 'state', state, dataJson);
        switch (state) {
          case 'mg_common_click_user_profile':
            console.log('handle mg_common_click_user_profile');
            break;
          case 'mg_avatar_get_avatar':
            console.log('mg_avatar_get_avatar');
            // handle.success(JSON.stringify({ gender: "Male", avatar: "Role_Male_T19_Hair_01_M_Face_01_T_T19_UB_01_M_T19_LB_01_M_T19_Shoe_01_M" }))
            handle.success(JSON.stringify({ gender: 'Male', avatar: '' }));
            break;
        }
      },
      // 监听玩家加入状态改变
      onPlayerMGCommonPlayerIn(handle, userId, model) {
        // 获取游戏人数
        const size = self.sudFSMMGDecorator.getPlayerInNumber();
        console.log(`=======sud h5 getPlayerInNumber======= size: ${size}, userId: ${userId}, model: ${JSON.stringify(model)}`);
        handle.success(JSON.stringify({ res_code: 0, msg: '' }));
        // 加入游戏
        js_sync_app('js_sync_joinedgame', { type: 'joinedgame' }, 'type');
      },
      onGameMGCommonGameBackLobby(handle, dataJson) {
        // 游戏通知app回到大厅
        // 自定义实现页面跳转或者回到大厅的操作
      },
      onGameMGCommonPlayerRoleId(handle, dataJson) {
        console.log('[ onGameMGCommonPlayerRoleId ] >', dataJson);
      },
      onGameLog(dataJson) {
        console.log('=======sud h5 onGameLog======= ', dataJson);
      },
      onGetGameViewInfo(handle: ISudFSMStateHandle, dataJson: string) {
        const width = self.root.clientWidth;
        const height = self.root.clientHeight;
        const data = JSON.parse(dataJson);
        const dpr = data.ratio || 1;
        console.log(width, height, 'width,height', dataJson, 'dataJson', 'dpr', dpr);
        // TODO: 修改数据
        const gameViewInfo = {
          ret_code: 0,
          ret_msg: 'success',
          view_size: {
            width: width * dpr,
            height: height * dpr,
          },
          view_game_rect: {
            left: 0,
            right: 0,
            top: 50,
            bottom: 50,
          },
        };

        console.log(gameViewInfo, 'gameViewInfo');

        handle.success(JSON.stringify(gameViewInfo));
      },
      onGameMGCommonSelfClickJoinBtn(handle, res) {
        console.log('[ onGameMGCommonSelfClickJoinBtn ] >', handle, res);
        // 加入游戏前检测
        js_sync_app('js_sync_joingamecheck', { seatIndex: res.seatIndex || 0 }, 'seatIndex');

        // handle.success(JSON.stringify(res));
        if (self.isPlay) {
          self.sudFSTAPPDecorator.notifyAPPCommonSelfIn(true);
        }
      },
      onGetGameCfg(handle: ISudFSMStateHandle, dataJson: string): void {
        let config = new GameConfigModel();
        // const gameConf = localStorage.getItem('gameconfig');
        config.ui.join_btn.custom = true;
        config.ui.lobby_players.custom = true;
        // config.ui.block_change_seat.custom = true;
        // config.ui.join_btn.hide = true
        // if (gameConf) {
        //   // @ts-ignore
        //   config = gameConf;
        //   // @ts-ignore
        //   handle.success(config);
        //   return;
        // }
        handle.success(JSON.stringify(config));
      },
      // 关键词状态
      onGameMGCommonKeyWordToHit(handle: ISudFSMStateHandle, model: IMGCommonKeyWordToHit): void {
        console.log('[ 关键词状态 ] >', handle, model);
        self.keyword = model;
      },
      // 麦克风状态
      onGameMGCommonSelfMicrophone(handle: ISudFSMStateHandle, model: IMGCommonSelfMicrophone): void {
        console.log('[ 麦克风状态 ] >', handle, model);
        js_sync_app('js_sync_self_mic', { isOn: model.isOn }, 'isOn');
      },
      // 耳机（听筒，扬声器）状态
      onGameMGCommonSelfHeadphone(handle: ISudFSMStateHandle, model: IMGCommonSelfHeadphone): void {
        console.log('[ 耳机（听筒，扬声器）状态 ] >', handle, model);
        js_sync_app('js_sync_self_audio', { isOn: model.isOn }, 'isOn');
      },
      // 游戏状态
      onPlayerMGCommonPlayerPlaying(handle: ISudFSMStateHandle, userId: string, model: IMGCommonPlayerPlaying): void {
        console.log('[ 游戏状态 ] >', handle, userId, model);
        const params = {
          userId,
          isPlaying: model.isPlaying,
        };
        js_sync_app('js_sync_player_playing', { params }, 'params');
      },
      ...customSudFSMMGListener, // 外部传入自定义listener可覆盖
    });
    console.log(userId, gameRoomId, code, gameId, language, this.sudFSMMGDecorator);

    // 调用游戏sdk加载游戏
    this.iSudFSTAPP = SudMGPSDK.loadMG(userId, gameRoomId, code, gameId, language, this.sudFSMMGDecorator, this.root);
    // APP调用游戏接口的装饰类设置
    if (this.iSudFSTAPP) {
      // @ts-ignore
      this.sudFSTAPPDecorator.setISudFSTAPP(this.iSudFSTAPP);
    }
  }

  /** 加入游戏 */
  public joinGame(seatIndex: number = 0) {
    console.log('[ 座位号 ] >', seatIndex);
    this.sudFSTAPPDecorator.notifyAPPCommonSelfIn(true, seatIndex, true);
  }

  /** 结束游戏 */
  public endGame() {
    this.sudFSTAPPDecorator.notifyAPPCommonSelfEnd();
  }

  /** 退出游戏 */
  public exitGame() {
    this.sudFSTAPPDecorator.notifyAPPCommonSelfIn(false);
  }

  /** 发送文本到游戏（你画我猜） */
  public sendText(text: string = '') {
    const isHit = text === this.keyword?.word;
    this.sudFSTAPPDecorator.notifyAPPCommonSelfTextHitState(
      isHit,
      this.keyword?.word || '',
      text,
      this.keyword?.wordType || 'text',
      this.keyword?.wordList || [],
      [],
    );
  }

  // region 生命周期相关

  /** 页面销毁的时候调用 */
  public onDestroy() {
    this.sudFSTAPPDecorator.notifyAPPCommon('app_common_self_exit_game', JSON.stringify({}), {
      onSuccess() {},
      onFailure() {},
    });
    this.destroyMG();
  }

  public setSudFSMMGListener(listener: Partial<SudFSMMGListener>) {
    this.customSudFSMMGListener = listener;
  }

  // end region 生命周期相关

  /** 销毁游戏 */
  private destroyMG() {
    if (this.gameIsStarted) {
      this.iSudFSTAPP && SudMGPSDK.destroyMG(this.iSudFSTAPP);
    }
    this.sudFSTAPPDecorator.destroyMG();
    this.sudFSMMGDecorator.destroyMG();
  }

  // 根据域名生成bundleId
  public getBundleId() {
    // return location.hostname;
    return '';
  }
}
