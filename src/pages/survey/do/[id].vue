<template>

{{ targetSurvey }}

</template>

<script setup>
import { useRoute } from "vue-router";

const route = useRoute();
const id = route.params.id

//설문조사 가져오기

import { SURVEYS } from "@/stores/survey";
const targetSurvey = SURVEYS[id];



</script>

<style lang="scss" scoped>

</style>