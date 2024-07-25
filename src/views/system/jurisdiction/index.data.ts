const jurisdiction = {
  ios: [
    {
      tit: '系统权限使用清单',
      list: [
        {
          name: '系统权限',
          value: 'NSPhotoLibraryAddUsageDescription',
        },
        {
          name: '权限功能说明',
          value: '向相册中添加内容',
        },
        {
          name: '使用使用场景与目的',
          value: '允许App写入/下载/保存/修改/删除图片、文件、崩溃日志等信息',
        },
      ],
    },
    {
      tit: '系统权限使用清单',
      list: [
        {
          name: '系统权限',
          value: 'NSPhotoLibraryUsageDescription',
        },
        {
          name: '权限功能说明',
          value: '读取相册中内容',
        },
        {
          name: '使用使用场景与目的',
          value: '允许App读取存储中的图片、文件等内容，主要用于帮助您发布信息等功能',
        },
      ],
    },
    {
      tit: '系统权限使用清单',
      list: [
        {
          name: '系统权限',
          value: 'NSMicrophoneUsageDescription',
        },
        {
          name: '权限功能说明',
          value: '使用麦克风',
        },
        {
          name: '使用使用场景与目的',
          value: '用于帮助您完成连麦功能',
        },
      ],
    },
    {
      tit: '系统权限使用清单',
      list: [
        {
          name: '系统权限',
          value: 'NSUserTrackingUsageDescription',
        },
        {
          name: '权限功能说明',
          value: '获取设备标识，以识别设备信息',
        },
        {
          name: '使用使用场景与目的',
          value: '仅用于标识设备并保障服务安全与提升浏览体验',
        },
      ],
    },
  ],
  android: [
    {
      tit: '系统权限使用清单',
      list: [
        {
          name: '系统权限',
          value: '读取SD卡中的内容（读取存储空间/照片权限）',
        },
        {
          name: '权限功能说明',
          value: '提供读取手机储存空间内数据的功能',
        },
        {
          name: '使用使用场景与目的',
          value: '允许App读取存储中的图片等内容，主要用于帮助您发布信息，上传头像等图片、在本地记录崩溃日志信息等功能',
        },
      ],
    },
    {
      tit: '系统权限使用清单',
      list: [
        {
          name: '系统权限',
          value: '写入/删除SD卡中的内容（写入/删除/存储空间/照片权限）',
        },
        {
          name: '权限功能说明',
          value: '提供写入外部储存功能',
        },
        {
          name: '使用使用场景与目的',
          value: '允许App写入/下载/保存/缓存/修改/删除图片、文件、崩溃日志等信息',
        },
      ],
    },
    {
      tit: '系统权限使用清单',
      list: [
        {
          name: '系统权限',
          value: '读取手机状态和身份（电话权限、设备权限）',
        },
        {
          name: '权限功能说明',
          value: '提供读取手机设备标识等信息，请您放心该权限无法监听、获取您的任何通话内容与信息',
        },
        {
          name: '使用使用场景与目的',
          value: '读取设备通话状态和识别码，识别设备ID，保证运营商网络免流服务，用于完成音视频、信息展示、账号登录、安全保障等主要功能',
        },
      ],
    },
    {
      tit: '系统权限使用清单',
      list: [
        {
          name: '系统权限',
          value: '录音 android.permission.RECORD_AUDIO',
        },
        {
          name: '权限功能说明',
          value: '使用麦克风录制音频',
        },
        {
          name: '使用使用场景与目的',
          value: '用于帮助您完成音视频信息发布、进行直播、完成搜索（如有）等需要使用该权限的相关功能',
        },
      ],
    },
    {
      tit: '系统权限使用清单',
      list: [
        {
          name: '系统权限',
          value: '拍摄照片和视频 android.permission.CAMERA',
        },
        {
          name: '权限功能说明',
          value: '使用拍摄照片和视频',
        },
        {
          name: '使用使用场景与目的',
          value: '用于聊天、上传头像、背景图片、发动态等场景',
        },
      ],
    },
  ],
};

export default jurisdiction;
