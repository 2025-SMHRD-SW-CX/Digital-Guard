// src/services/supabase.js
import { createClient } from '@supabase/supabase-js'

// 임시로 직접 url, key 기재. 나중에 .env로 뺄수 있는지 볼것임
const supabaseUrl = 'https://ljrpsrahxfwgayetsuil.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxqcnBzcmFoeGZ3Z2F5ZXRzdWlsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDc2MTU5NjAsImV4cCI6MjA2MzE5MTk2MH0.q-UAlXW9bvI5wqxqPFYn0tpCcBjgDL-JQroAaF6Bi7Y'

// Supabase 클라이언트 인스턴스
export const db = createClient(supabaseUrl, supabaseKey)

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