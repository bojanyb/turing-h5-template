<template>
  <div class="music-container">
    <header class="header-image"></header>
    <!-- Music List -->
    <div class="music-list">
      <div class="list-inner" v-for="item in musicItems" :key="item.id">
        <div class="user-box">
          <img class="user-avatar" :src="item.avatar" />
          <div class="user-details">
            <div class="user-name">{{ item.userName }}</div>
            <div class="room-id">{{ item.roomId }}</div>
            <div class="user-description">
              {{ item.description }}
            </div>
          </div>
        </div>
        <div class="bottom-box">
          <MusicPlayer
            :id="item.id"
            :audio-src="item.audioSrc"
            :currentPlayingId="currentPlayingId"
            :info="item"
            @update-current-playing="handleUpdateCurrentPlaying"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  import MusicPlayer from './components/MusicPlayer.vue';

  const musicItems = [
    {
      id: 1,
      userName: '郡主 ID: 100280126',
      roomId: '房间ID: 115945',
      description: '擅长流行/古风/民谣 ，爱好唱歌/游戏，原创音乐人，性格活泼开朗，希望结交志同道合的朋友。',
      songTitle: '坚如磐石',
      artist: '-郡主',
      source: '团团语音',
      avatar: `https://photo.tuantuan.live/h5/activity/avatars/100280126.jpg`,
      audioSrc: 'https://photo.tuantuan.live/h5/activity/musics/1坚如磐石-郡主.wav',
    },
    {
      id: 2,
      userName: '杨言 ID: 100242070',
      roomId: '房间ID: 1995',
      description: '你们好，我叫杨言，来自海屿你的歌手，唱流行、苦情，说唱多点，希望我的歌声可以走进你心里。',
      songTitle: '最美的太阳',
      artist: '-杨言',
      source: '团团语音',
      avatar: `https://photo.tuantuan.live/h5/activity/avatars/100242070.jpg`,
      audioSrc: 'https://photo.tuantuan.live/h5/activity/musics/2最美的太阳-杨言.wav',
    },
    {
      id: 3,
      userName: '凯特琳 ID: 100287945',
      roomId: '房间ID: 102730',
      description: '大家好，我是凯特琳，一个性格开朗的小姐姐，可燃歌，可配音，欢迎大家来找我玩本。',
      songTitle: '盛夏光年',
      artist: '-凯特琳',
      source: '团团语音',
      avatar: `https://photo.tuantuan.live/h5/activity/avatars/100287945.jpg`,
      audioSrc: 'https://photo.tuantuan.live/h5/activity/musics/3盛夏光年-凯特琳.WAV',
    },
    {
      id: 4,
      userName: '沐青 ID: 98989',
      roomId: '房间ID: 9599',
      description: '我，沐青，时光传媒的古风歌手，来自江西，青年音，如果声音不能打动你，希望可以把我唱给你听。',
      songTitle: '游山恋',
      artist: '-沐青',
      source: '团团语音',
      avatar: `https://photo.tuantuan.live/h5/activity/avatars/98989.jpg`,
      audioSrc: 'https://photo.tuantuan.live/h5/activity/musics/4游山恋-沐青.mp3',
    },
    {
      id: 5,
      userName: '蜡笔 ID: 100304024',
      roomId: '房间ID: 101898',
      description: '我是蜡笔，一个美貌与实力并肩的歌手，犹豫就会败北，选我绝不后悔！家住快乐星球，来找我玩吧。',
      songTitle: '去大理',
      artist: '-蜡笔',
      source: '团团语音',
      avatar: `https://photo.tuantuan.live/h5/activity/avatars/100304024.jpg`,
      audioSrc: 'https://photo.tuantuan.live/h5/activity/musics/5去大理-蜡笔.mp3',
    },
    {
      id: 6,
      userName: '牌牌 ID: 100236100',
      roomId: '房间ID: 107552',
      description: '大家好，我叫牌牌！是一个来自东北的帅帅大男孩儿，爱好唱歌，  希望能用我的歌声征服你。',
      songTitle: 'Always Online',
      artist: '-牌牌',
      source: '团团语音',
      avatar: `https://photo.tuantuan.live/h5/activity/avatars/100236100.jpg`,
      audioSrc: 'https://photo.tuantuan.live/h5/activity/musics/6Always Online-牌牌.mp3',
    },
    {
      id: 7,
      userName: '咪哆 ID: 100238023',
      roomId: '房间ID: 103579',
      description: '大家好，我叫咪哆，热爱唱歌，音域宽广，情感细腻，能完美演绎多种风格歌曲，歌声极具感染力。',
      songTitle: '回马枪',
      artist: '-咪哆',
      source: '团团语音',
      avatar: `https://photo.tuantuan.live/h5/activity/avatars/100238023.jpg`,
      audioSrc: 'https://photo.tuantuan.live/h5/activity/musics/7回马枪-咪哆.mp3',
    },
    {
      id: 8,
      userName: 'T4 ID: 100232087',
      roomId: '房间ID: 102730',
      description: 'hello！我是T4，一个成熟的说唱歌手！歌曲百种，总有一首是你喜欢的，让我们在歌声中寻找自己吧',
      songTitle: '离别',
      artist: '-T4',
      source: '团团语音',
      avatar: `https://photo.tuantuan.live/h5/activity/avatars/100232087.jpg`,
      audioSrc: 'https://photo.tuantuan.live/h5/activity/musics/8离别-T4.wav',
    },
    {
      id: 9,
      userName: '阿秋 ID: 100267940',
      roomId: '房间ID: 124778',
      description: 'hello！这里是阿秋，一个百变全能型歌手！可甜可御，你想听的音色我都有！来听听我的歌声吧~',
      songTitle: '念念',
      artist: '-阿秋',
      source: '团团语音',
      avatar: `https://photo.tuantuan.live/h5/activity/avatars/100267940.jpg`,
      audioSrc: 'https://photo.tuantuan.live/h5/activity/musics/9念念-阿秋.mp3',
    },
    {
      id: 10,
      userName: '九三 ID 100244233',
      roomId: '房间ID: 108053',
      description: '我是93，就是不能与你分散，你是我在茫茫人海中遇到的奇女子，我的世界一切因你而不同。',
      songTitle: '沈园外',
      artist: '-九三',
      source: '团团语音',
      avatar: `https://photo.tuantuan.live/h5/image/6c5e64455d756333000dbdfb099b8d84.jpg`,
      audioSrc: 'https://photo.tuantuan.live/h5/activity/musics/10沈园外-九三.MP3',
    },
    {
      id: 11,
      userName: '陈世圈 ID: 100236930',
      roomId: '房间ID: 124788',
      description: '我是陈世圈，一个可爱机灵的大女主，喜欢我就来和我一起玩吧，会唱歌，全能业余小歌手。',
      songTitle: '不能说的秘密',
      artist: '-陈世圈',
      source: '团团语音',
      avatar: `https://photo.tuantuan.live/h5/activity/avatars/100236930.jpg`,
      audioSrc: 'https://photo.tuantuan.live/h5/activity/musics/11不能说的秘密-陈世圈.mp3',
    },
    {
      id: 12,
      userName: '抖抖 ID: 100232186',
      roomId: '房间ID: 2233',
      description: '擅长流行/苦情/民谣，爱好唱歌/聊天/游戏，性格活泼开朗，热情大方。希望能跟你认识一下！',
      songTitle: '庐州月',
      artist: '-抖抖',
      source: '团团语音',
      avatar: `https://photo.tuantuan.live/h5/activity/avatars/100232186.jpg`,
      audioSrc: 'https://photo.tuantuan.live/h5/voice/12庐州月-抖抖.mp3',
    },
    {
      id: 13,
      userName: 'yoyo ID: 100230433',
      roomId: '房间ID: 102730',
      description: 'Hi，我是yoyo，一个温柔可人的小姐姐，擅长各种英文歌曲，希望能认识更多喜欢音乐的朋友。',
      songTitle: 'problem',
      artist: '-yoyo',
      source: '团团语音',
      avatar: `https://photo.tuantuan.live/h5/activity/avatars/100230433.jpg`,
      audioSrc: 'https://photo.tuantuan.live/h5/activity/musics/13problem-yoyo.wav',
    },
    {
      id: 14,
      userName: '诗 ID: 100238217',
      roomId: '房间ID: 127529',
      description: 'Hi，我是小诗，各种类型的歌曲都可以驾驭，主打流行音乐，声音多变，希望能跟你认识一下。',
      songTitle: '交换余生',
      artist: '-诗',
      source: '团团语音',
      avatar: `https://photo.tuantuan.live/h5/activity/avatars/100238217.jpg`,
      audioSrc: 'https://photo.tuantuan.live/h5/activity/musics/14交换余生-诗.mp3',
    },
  ];

  const currentPlayingId = ref<number | null>(null);

  const handleUpdateCurrentPlaying = (id: number) => {
    currentPlayingId.value = id;
  };
</script>

<style scoped lang="scss">
  .music-container {
    width: 100vw;
    padding-bottom: 30px;
    background: linear-gradient(180deg, #5f52f8 0%, #c2b6f3 100%);

    .header-image {
      height: 878px;
      width: 100%;
      background: url('@/assets/images/music/music_header.png') no-repeat center;
      background-size: 100% 100%;
      margin-bottom: 40px;
    }

    .music-list {
      padding: 0 32px;

      .list-inner {
        width: 100%;
        height: 466px;
        margin-bottom: 10px;
        position: relative;

        .user-box {
          width: 100%;
          height: 350px;
          background: url('@/assets/images/music/music_item.png') no-repeat center;
          background-size: 100% 100%;
          display: flex;
          justify-content: space-between;
          padding-right: 30px;

          .user-avatar {
            width: 252px;
            height: 252px;
            border-radius: 20px;
            border: 1px solid #fff;
            margin: 36px 20px 20px;
          }

          .user-details {
            width: 360px;
            height: 204px;
            margin-top: 100px;
            font-size: 26px;
            display: flex;
            flex-direction: column;
            justify-content: space-between;

            .user-name {
              font-weight: 600;
              color: #9e00ff;
            }

            .room-id {
              width: 200px;
              height: 44px;
              border-radius: 8px;
              background: rgb(255 191 191 / 70%);
              line-height: 44px;
              text-align: center;
              color: #666;
            }

            .user-description {
              width: 360px;
              height: 102px;
              font-size: 24px;
              color: #666;
            }
          }
        }

        .bottom-box {
          position: absolute;
          top: 324px;
          width: 100%;
          height: 142px;
        }
      }
    }
  }
</style>
