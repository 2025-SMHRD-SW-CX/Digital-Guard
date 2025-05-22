<template>
<!-- HTML 영역 -->
<p>{{ counter }}</p>
<button @click="increase">증가</button>

<!-- counter는 0, 1, 2, 0, 1, 2, ... 반복 -->
<!-- 그럼 red, blue, green 순으로 계속 colorList에서 가져온다. -->

<!-- 
    속성명(여기서는 class) 앞에 콜론(:)을 붙이면 변수를 이용해서 값을 할당하겠다는 뜻이다.
    즉, class뿐만 아니라 모든 속성 (id, src, href) 등 다양한 속성값을 동적으로 변경 가능하다.
-->
<p :class="colorlist[counter]">당근</p>

<!-- shopList는 쇼핑목록이 저장된 리스트 -->
<!-- item은 shopList에서 꺼낸 물건을 담을 변수이름 -->
<!-- in은 shopList에서 꺼내서 item에 담겠다 -->
<!-- v-for 태그를 for문 반복을 한다는 의미 -->
<p v-for="item in shopList">{{ item }}</p>

<ul>
    <!-- data는 객체(object)가 담겨있는 배열, 그래서 item에는 객체가 담긴다 -->
     <!-- 객체에서 값을 꺼내 쓰려면? 일반 JS문법처럼 '객체.이름'으로 접근 -->
    <li v-for="name_data in data" :class="name_data.color">이름:{{ name_data.name }}, 직책:{{ name_data.position }}</li>
</ul>

</template>

<script setup>
// JS 영역
import {ref} from "vue";
const counter = ref(1);

// 값을 증가시키는 함수를 만들자
const increase = () => {
    // counter.value++
    
    // 증가시키면 0,1,2,0,1,2, ... 반복됨
    counter.value = (counter.value + 1) % 3;
}

const colorlist = ['red','blue','green'];

// 리스트
const shopList = ['양파', '감자', '토마토', '당근'];

// 리스트 내 object
const data = [
    { name: '김주현', position: "팀장", color: "red"},
    { name: '나상록', position: "부팀장", color: "blue"},
    { name: '윤지우', position: "서기", color: "green"},
    { name: '오인경', position: "출결담당", color: "purple"}
]



</script>

<style lang="scss" scoped>
// CSS 영역

.red{
    background-color: red;
}
.blue{
    background-color: blue;
}
.green{
    background-color: green;
}
.purple{
    background-color: purple;
}

</style>