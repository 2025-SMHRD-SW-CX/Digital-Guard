<template>
    <!-- 헤더 -->
    <div class="header-wrap">
        <img src="/images/header/brand.png" v-if="!header.title" @click="goToMain" style="cursor: pointer;">
        <div class="title-indicator" v-else>
            <img @click="clickBackBtn" src="/images/prev_page.png">
            <p>{{ header.title }}</p>
        </div>

        <div class="indicator-wrap" v-if="header.show">
            <div id="user" class="key-icon-wrap">
                <div class="icon">
                    <img src="/images/header/user_icon.png">
                </div>
                <div class="value">
                    <p>{{ user.nickname }}</p>
                </div>
            </div>

            <div id="point" class="key-icon-wrap">
                <div class="icon">
                    <img src="/images/coin_icon.png">
                </div>
                <div class="value">
                    <p>{{ formattedReward }}</p>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { watch, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useHeaderStore, TITLE_MAP } from '@/stores/header'
import { useUserStore } from '@/stores/user'
import { usePathToken } from '@/composables/usePathToken'
import { db } from '@/services/supabase' // supabase 연동 추가

const router = useRouter()
const header = useHeaderStore()
const user = useUserStore()
const { firstToken } = usePathToken()

const formattedReward = computed(() => {
  const value = Number(user.totalReward) || 0
  return value.toLocaleString('ko-KR') + 'P'
})

const clickBackBtn = () => {
  const depth = router.currentRoute.value.path.split('/').filter(Boolean).length
  depth === 1 ? router.push('/main') : router.back()
}
const goToMain = () => {
  router.push('/main')
}

// Supabase에서 포인트 실시간 반영
onMounted(async () => {
  if (!user.id) return
  const { data, error } = await db.from('user').select('total_reward').eq('id', user.id).single()
  if (!error && data) {
    user.totalReward = data.total_reward
  }
})

watch(firstToken, (token) => {
  if (!(token in TITLE_MAP)) {
    header.setShow(false)
    header.setTitle(null)
  } else {
    header.setShow(true)
    header.setTitle(TITLE_MAP[token] || null)
  }
}, { immediate: true })
</script>

<style lang="scss" scoped>
.header-wrap {
    border-bottom: 1px solid #c0c0c0;
    padding: 1rem;
    width: 100%;
    display: flex;
    justify-content: space-between;
    align-items: center;
    z-index: $z-header;
    min-height: 5rem;

    img {
        width: 10rem;
        object-fit: scale-down;
    }

    .title-indicator {
        display: flex;
        align-items: center;
        gap: 1rem;

        img {
            width: 2.5rem;
            height: 3rem;
            object-fit: scale-down;
        }

        p {
            margin: 0;
            font-size: 1.5rem;
            position: relative;
            bottom: 0.1rem;
            font-weight: 350;
        }
    }
}

.indicator-wrap {
    height: 3.5rem;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;

    #point {
        gap: 7%;
    }

    .key-icon-wrap {
        display: flex;
        align-items: center;
        height: 100%;
        width: 100%;
        gap: 1rem;

        .icon {
            width: 2em;
            opacity: 0.9;
        }

        .value {
            flex-grow: 1;
            height: 100%;
            width: 100%;
            min-width: 4rem;

            p {
                font-size: 1.1em;
                margin: 0;
                font-weight: bold;
                position: relative;
                top: 2%;
                color: $color-text;
                text-align: end;
            }
        }
    }
}
</style>