<template>
  <div class="footer-wrap" v-if="showFooter">
    <button class="footer-btn" @click="go('/education')">
      <img :src="iconSrc('education')" alt="교육" />
    </button>

    <button class="footer-btn" @click="go('/survey')">
      <img :src="iconSrc('survey')" alt="설문" />
    </button>

    <div class="footer-logo-wrap" @click="go('/main')">
      <img src="/images/logo.png" class="footer-logo" alt="로고" />
    </div>

    <button class="footer-btn" @click="go('/shop')">
      <img :src="iconSrc('shop')" alt="상점" />
    </button>

    <button class="footer-btn" @click="go('/mypage')">
      <img :src="iconSrc('mypage')" alt="마이페이지" />
    </button>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { usePathToken } from '@/composables/usePathToken'

const router = useRouter()
const { firstToken, tokenDepth, isActive } = usePathToken()

const footerActiveTabs = ['main', 'education', 'survey', 'shop', 'mypage']
const showFooter = computed(() =>
  tokenDepth.value === 1 && footerActiveTabs.includes(firstToken.value)
)

const iconSrc = (tab) => {
  const base = `/images/footer/${tab}`
  return isActive(tab)
    ? `${base}-active.png`
    : `${base}.png`
}

const go = (path) => {
  router.push(path)
}
</script>

<style lang="scss" scoped>
.footer-wrap {
  background-color: $color-thin-sky;
  display: flex;
  justify-content: space-between;
  padding: 0 1rem;
  height: 3.5rem;
  position: relative;
  box-shadow: 0 0 0.5rem 0 rgba(0, 0, 0, 0.199);
}

.footer-logo-wrap {
  height: 4rem;
  position: relative;
  bottom: 0.6rem;
}

.footer-logo {
  height: 100%;
  width: 100%;
}

.footer-btn {
  background: none;
  border: none;
  padding: 0;
  height: 2.3rem;
  display: flex;
  align-items: center;
  transform: translateY(30%);

  img {
    width: 100%;
    height: 100%;
    display: block;
  }

  &:hover {
    cursor: pointer;
    opacity: 0.8;
  }
}
</style>
