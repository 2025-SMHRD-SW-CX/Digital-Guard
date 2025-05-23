<!-- 
 
다른파일에서 사용 예시


<template>
    ...

    속성들은 Optional임

    <SlotBox
        background="#f6f8fa"
        borderColor="royalblue"
        :borderWidth="4"
        borderRadius="2rem"
        padding="2rem"
    >
    ...
</template>

<script setup>
    import CardView from '@/components/CardView.vue';

</script>

-->

<template>
  <div
    class="slot-wrap"
    :style="slotStyle"
  >
    <slot></slot>
  </div>
</template>

<script setup>
import { computed } from 'vue'

// prop 기본값 및 타입 선언
const props = defineProps({
  background:    { type: String, default: '#fff' },
  borderColor:   { type: String, default: 'gray' },
  borderWidth:   { type: [String, Number], default: '2px' },
  borderRadius:  { type: [String, Number], default: '0.25rem' },
  padding:       { type: [String, Number], default: '0.5rem' },
})

// 동적 스타일 객체 생성
const slotStyle = computed(() => ({
  background: props.background,
  border: `${typeof props.borderWidth === 'number' ? props.borderWidth + 'px' : props.borderWidth} solid ${props.borderColor}`,
  borderRadius: typeof props.borderRadius === 'number' ? props.borderRadius + 'px' : props.borderRadius,
  padding: typeof props.padding === 'number' ? props.padding + 'px' : props.padding,
}))
</script>

<style lang="scss" scoped>
.slot-wrap {
  box-sizing: border-box;
  transition: border 0.2s, background 0.2s;
}
</style>
