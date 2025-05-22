<template>
    <CardView>
        <p>컨텐츠입니다.</p>
        <p>컨텐츠입니다.</p>
        <p>컨텐츠입니다.</p>
        <p>컨텐츠입니다.</p>
        <p>컨텐츠입니다.</p>
        <p>컨텐츠입니다.</p>
    </CardView>

    <CardView>
        <p>광고영역입니다.</p>
        <p>광고영역입니다.</p>
        <p>광고영역입니다.</p>
        <p>광고영역입니다.</p>
        <p>광고영역입니다.</p>
        <p>광고영역입니다.</p>
    </CardView>
</template>

<script setup>
import CardView from '@/components/CardView.vue';

import { onMounted } from 'vue';
import { db } from '@/services/supabase'

const fecthData = async () => {
    const { data, error } = await db
        .from('user') //user테이블 조회
        .select('*');

    if (error) {
        console.error('데이터 조회 실패', error);
    } else {
        console.log(data);
    }
}

// 컴포넌트가 렌더링될 때 실행됨
onMounted(async () => {
    await fecthData();
})


</script>

<style lang="scss" scoped></style>