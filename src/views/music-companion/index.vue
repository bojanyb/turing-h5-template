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

  const musicItems = [];

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
