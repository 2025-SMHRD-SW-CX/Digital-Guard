// src/services/supabase.js
import { createClient } from '@supabase/supabase-js'

export const db = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_SECRET_KEY
)

/*
아래는 사용 예시코드

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

*/