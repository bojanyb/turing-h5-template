<template>
  <div class="music-player">
    <audio ref="audioRef" @timeupdate="updateProgress" @ended="handleEnded" @loadedmetadata="updateDuration">
      <source :src="audioSrc" type="audio/mpeg" />
    </audio>
    <!-- 控制面板 -->
    <div class="controls">
      <div class="controls-details">
        <div class="song-player">
          <!-- 播放/暂停按钮 -->
          <button
            class="controls-button"
            :style="{ background: `url( ${isPlaying ? pauseIcon : playIcon}) center center / 100% 100% no-repeat` }"
            @click="togglePlay"
          ></button>
          <div class="song-title">
            {{ info.songTitle }} <span>{{ info.artist }}</span></div
          >
        </div>

        <div class="song-time">
          <!-- 当前时间和总时间 -->
          <span>{{ formatTime(currentTime) }} / {{ formatTime(duration) }}</span>
        </div>
      </div>
      <div class="controls-progress">
        <van-slider
          v-model="currentTime"
          :max="duration"
          button-size="8"
          bar-height="6"
          active-color="#FF6CA9"
          inactive-color="#FFFFFF"
          @update:model-value="seek"
          @drag-start="handleSeekStart"
          @drag-end="handleSeekEnd"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { ref, watch, onMounted, nextTick } from 'vue';
  import { isIosFun } from '/@/utils/index';

  const props = defineProps<{
    audioSrc: string;
    id: number;
    currentPlayingId: number | null;
    info: any;
  }>();

  const emit = defineEmits<{
    (e: 'updateCurrentPlaying', id: number): void;
  }>();

  // 引用音频元素
  const audioRef = ref<HTMLAudioElement | null>(null);
  // 播放状态
  const isPlaying = ref(false);
  // 当前播放时间
  const currentTime = ref(0);
  // 音频总时长
  const duration = ref(0);
  // 音量大小
  const volume = ref(1);

  // 播放和暂停按钮的图标路径
  const playIcon = new URL('@/assets/images/music/music_player.png', import.meta.url).href;
  const pauseIcon = new URL('@/assets/images/music/music_pause.png', import.meta.url).href;

  /**
   * 将秒数格式化为 mm:ss 格式
   * @param seconds - 秒数
   * @returns 格式化后的时间字符串
   */
  const formatTime = (seconds: number): string => {
    if (isNaN(seconds) || seconds === 0) return '00:00';
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  /**
   * 切换播放和暂停状态
   */
  const togglePlay = () => {
    if (audioRef.value) {
      if (isPlaying.value) {
        audioRef.value.pause();
      } else {
        audioRef.value?.play().catch((error) => {
          console.error('播放错误:', error);
        });
        // 通知父组件当前播放的音频 ID
        emit('updateCurrentPlaying', props.id);
      }
      isPlaying.value = !isPlaying.value;
    }
  };

  /**
   * 更新进度条和当前时间
   */
  const updateProgress = () => {
    if (audioRef.value) {
      currentTime.value = audioRef.value.currentTime;
    }
  };

  /**
   * 更新音频总时长
   */
  const updateDuration = () => {
    nextTick(() => {
      setTimeout(() => {
        if (isIosFun()) {
          if (audioRef.value) {
            duration.value = audioRef.value.duration;
            if (isNaN(duration.value) || duration.value === 0) {
              retryUpdateDuration();
            }
          }
        } else {
          if (audioRef.value) {
            duration.value = audioRef.value.duration;
            console.log('安卓音频总时长:', duration.value, audioRef.value);
          }
        }
      }, 200);
    });
  };

  /**
   * 重试获取音频总时长
   */
  const retryUpdateDuration = () => {
    const retries = 5;
    let attempts = 0;

    const retryInterval = setInterval(() => {
      if (audioRef.value && (isNaN(audioRef.value.duration) || audioRef.value.duration === 0)) {
        attempts += 1;
        if (attempts > retries) {
          clearInterval(retryInterval);
        } else {
          audioRef.value.load();
          console.log('重试获取音频总时长:', attempts, audioRef.value);
        }
      } else {
        if (audioRef.value) {
          duration.value = audioRef.value.duration;
        }
        clearInterval(retryInterval);
      }
    }, 500);
  };

  /**
   * 更新进度条
   */
  const seek = () => {
    if (audioRef.value) {
      audioRef.value.currentTime = currentTime.value;
      // IOS拖动会资源丢失需重新赋值
      audioRef.value.src = props.audioSrc;
    }
  };

  /**
   * 进度条拖动开始
   */
  const handleSeekStart = () => {
    if (audioRef.value && isPlaying.value) {
      audioRef.value.pause();
    }
  };

  /**
   * 进度条拖动结束
   */
  const handleSeekEnd = () => {
    if (audioRef.value) {
      const wasPlaying = isPlaying.value;
      seek();
      if (wasPlaying) {
        audioRef.value.play().catch((error) => {
          console.error('播放错误:', error);
        });
      }
    }
  };

  /**
   * 处理音频播放结束事件
   */
  const handleEnded = () => {
    isPlaying.value = false;
    currentTime.value = 0;
    // 强制重新加载音频源
    if (audioRef.value) {
      audioRef.value.src = props.audioSrc;
      audioRef.value.load();
    }
  };

  // 组件挂载后设置初始音量
  onMounted(() => {
    if (audioRef.value) {
      audioRef.value.volume = volume.value;
    }
  });

  watch(
    () => props.currentPlayingId,
    (newId) => {
      if (audioRef.value && newId !== props.id && isPlaying.value) {
        audioRef.value.pause();
        isPlaying.value = false;
      }
    },
  );

  watch(
    () => props.id,
    async () => {
      nextTick(() => {
        if (audioRef.value) {
          setTimeout(() => {
            updateProgress();
            updateDuration();
          }, 200);
        }
      });
    },
    { immediate: true },
  );
</script>

<style scoped lang="scss">
  .music-player {
    background: url('@/assets/images/music/music_bottom.png') no-repeat center;
    background-size: 100% 100%;
    padding: 28px;
    width: 100%;
    height: 142px;

    .controls {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 10px;

      .controls-details {
        width: 100%;
        display: flex;
        justify-content: space-between;
        align-items: flex-end;
        margin-bottom: 6px;

        .song-player {
          display: flex;
          align-items: center;

          .controls-button {
            margin-right: 10px;
            width: 62px;
            height: 62px;
            background-size: 100% 100%;
            border: none;
            cursor: pointer;
          }

          .song-title {
            color: #ff4290;
            font-size: 36px;
            font-weight: 600;

            span {
              font-size: 24px;
              color: #ff4290;
            }
          }
        }

        .song-time {
          font-size: 24px;
          color: #ff4290;
        }
      }

      .controls-progress {
        width: 100%;

        ::v-deep(.van-slider__button-wrapper) {
          width: 42px; /* 调整触发区域的宽度 */
          height: 42px; /* 调整触发区域的高度 */
          display: flex;
          justify-content: center;
          align-items: center;
        }
      }
    }
  }
</style>
