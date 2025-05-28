<template>
    <div class="insight-page">
        <h2>그래프<span><small class="its-dummy">시연을 위한 더미데이터임을 알립니다</small></span></h2>


        <!-- 설문별 참여율 현황 -->
        <section>
            <v-chart class="chart" :option="surveyParticipationOption" />
            <p class="insight">{{ insights.surveyParticipation }}</p>
        </section>

        <!-- 유해 콘텐츠 유형별 노출 빈도 -->
        <section>
            <v-chart class="chart" :option="contentExposureOption" />
            <p class="insight">{{ insights.contentExposure }}</p>
        </section>

        <!-- 퀴즈 문항별 정답률 -->
        <section>
            <v-chart class="chart" :option="quizCorrectOption" />
            <p class="insight">{{ insights.quizCorrect }}</p>
        </section>

        <!-- 유해 콘텐츠 접촉 경로 -->
        <section>
            <v-chart class="chart" :option="exposurePathOption" />
            <p class="insight">{{ insights.exposurePath }}</p>
        </section>

        <!-- 체감 위험도 조사 결과 -->
        <section>
            <v-chart class="chart" :option="dangerFeelingOption" />
            <p class="insight">{{ insights.dangerFeeling }}</p>
        </section>

        <!-- 1. 월별 유형별 유해 이슈 변화 -->
        <section>
            <v-chart class="chart" :option="issueTrendOption" />
            <p class="insight">{{ insights.issueTrend }}</p>
        </section>

        <!-- 2. 예방/대처 행동 실천 비율 -->
        <section>
            <v-chart class="chart" :option="preventionOption" />
            <p class="insight">{{ insights.prevention }}</p>
        </section>

        <!-- 3. 영상 퀴즈별 정답률 -->
        <section>
            <v-chart class="chart" :option="videoQuizOption" />
            <p class="insight">{{ insights.videoQuiz }}</p>
        </section>

        <!-- 4. 연령/성별별 유해 콘텐츠 노출 -->
        <section>
            <v-chart class="chart" :option="exposureDemographicOption" />
            <p class="insight">{{ insights.exposureDemographic }}</p>
        </section>

        <!-- 5. 하루 평균 노출 시간 -->
        <section>
            <v-chart class="chart" :option="dailyExposureTimeOption" />
            <p class="insight">{{ insights.dailyExposureTime }}</p>
        </section>

        <!-- 6. 유형별 불안/우울감 호소 비율 -->
        <section>
            <v-chart class="chart" :option="anxietyRateOption" />
            <p class="insight">{{ insights.anxietyRate }}</p>
        </section>

        <!-- 7. 청소년이 생각하는 가장 효과적 정책 Top 5 -->
        <section>
            <v-chart class="chart" :option="policyOption" />
            <p class="insight">{{ insights.policy }}</p>
        </section>

        <!-- 총평(요약 인사이트) -->
        <section>
            <h3>총평</h3>
            <p class="summary">{{ insights.summary }}</p>
        </section>
    </div>
</template>

<script setup>
import { use } from 'echarts/core'
import VChart from 'vue-echarts'
import { CanvasRenderer } from 'echarts/renderers'
import { BarChart, PieChart, RadarChart } from 'echarts/charts'
import {
    TooltipComponent, LegendComponent, GridComponent, TitleComponent
} from 'echarts/components'

use([
    CanvasRenderer,
    BarChart,
    PieChart,
    RadarChart,
    TooltipComponent,
    LegendComponent,
    GridComponent,
    TitleComponent
])

// 1️⃣ 설문별 참여율 현황 (더미 데이터)
const surveyParticipationOption = {
    title: { text: '설문별 참여율 현황', left: 10 },
    tooltip: {},
    xAxis: { data: ['위험콘텐츠', '사이버도박', 'SNS 혐오폭력', '성착취', '자살유도'] },
    yAxis: {},
    series: [{ type: 'bar', data: [230, 180, 160, 120, 110] }]
}

// 2️⃣ 유해 콘텐츠 유형별 노출 빈도
const contentExposureOption = {
    title: { text: '유해 콘텐츠 유형별 노출 빈도', left: 10 },
    tooltip: { trigger: 'item' },
    series: [{
        type: 'pie',
        data: [
            { value: 335, name: '사이버 도박' },
            { value: 310, name: '성착취 콘텐츠' },
            { value: 274, name: '혐오·폭력 콘텐츠' },
            { value: 235, name: '자살유도 콘텐츠' },
            { value: 200, name: '딥페이크' }
        ]
    }]
}

// 3️⃣ 퀴즈 문항별 정답률 (더미)
const quizCorrectOption = {
    title: { text: '퀴즈 문항별 정답률', left: 10 },
    tooltip: {},
    xAxis: { data: ['유해 콘텐츠 차단', '불법웹툰 처벌'] },
    yAxis: { max: 100 },
    series: [{ type: 'bar', data: [85, 70] }]
}

// 4️⃣ 청소년이 유해 콘텐츠를 접한 경로 분포 (더미)
const exposurePathOption = {
    title: { text: '유해 콘텐츠 접촉 경로', left: 10 },
    tooltip: {},
    xAxis: { data: ['SNS', '유튜브', '게임 내 광고', '지인 추천', '웹서핑'] },
    yAxis: {},
    series: [{ type: 'bar', data: [120, 200, 90, 40, 70] }]
}

// 5️⃣ 체감 위험도 조사 결과 (더미)
const dangerFeelingOption = {
    title: { text: '체감 위험도 조사', left: 10 },
    tooltip: {},
    radar: {
        indicator: [
            { name: '사이버도박', max: 100 },
            { name: '혐오·폭력', max: 100 },
            { name: '성착취', max: 100 },
            { name: '자살유도', max: 100 },
            { name: '딥페이크', max: 100 }
        ],
    },
    series: [{
        type: 'radar',
        data: [{ value: [80, 75, 90, 85, 70], name: '위험도(%)' }]
    }]
}

// 1️⃣ 월별 유형별 유해 이슈 변화 (Stacked Line)
const issueTrendOption = {
    title: { text: '월별 주요 유해 이슈 추이', left: 10, top: 0 },
    tooltip: { trigger: 'axis' },
    legend: { data: ['사이버도박', '성착취', '혐오', '자살유도', '딥페이크'], top: 30, left: 'center' },
    xAxis: { type: 'category', data: ['1월', '2월', '3월', '4월', '5월'] },
    yAxis: { type: 'value' },
    series: [
        { name: '사이버도박', type: 'line', stack: 'total', areaStyle: {}, data: [32, 45, 61, 75, 80] },
        { name: '성착취', type: 'line', stack: 'total', areaStyle: {}, data: [18, 26, 35, 48, 55] },
        { name: '혐오', type: 'line', stack: 'total', areaStyle: {}, data: [12, 18, 27, 32, 35] },
        { name: '자살유도', type: 'line', stack: 'total', areaStyle: {}, data: [6, 9, 14, 18, 20] },
        { name: '딥페이크', type: 'line', stack: 'total', areaStyle: {}, data: [5, 7, 10, 13, 15] }
    ]
}

// 2️⃣ 예방/대처 행동 실천 비율
const preventionOption = {
    title: { text: '예방/대처 행동 실천 비율', left: 10 },
    tooltip: {},
    xAxis: { type: 'value' },
    yAxis: { type: 'category', data: ['신고', '차단', '상담', '플랫폼 탈퇴', '무대응'] },
    series: [{ type: 'bar', data: [55, 40, 20, 5, 30], label: { show: true, position: 'right' } }]
}

// 3️⃣ 영상 퀴즈별 정답률
const videoQuizOption = {
    title: { text: '교육영상 퀴즈별 정답률', left: 10 },
    tooltip: {},
    legend: { data: ['영상1', '영상2', '영상3'], top: 30 },
    xAxis: { type: 'category', data: ['퀴즈1', '퀴즈2', '퀴즈3'] },
    yAxis: { max: 100 },
    series: [
        { name: '영상1', type: 'bar', data: [92, 88, 84] },
        { name: '영상2', type: 'bar', data: [85, 83, 80] },
        { name: '영상3', type: 'bar', data: [78, 75, 72] }
    ]
}

// 4️⃣ 연령/성별별 노출 비율
const exposureDemographicOption = {
    title: { text: '연령/성별별 유해 콘텐츠 노출', left: 10 },
    tooltip: {},
    legend: { data: ['남학생', '여학생'], top: 30 },
    xAxis: { type: 'category', data: ['13-15세', '16-18세', '19세 이상'] },
    yAxis: {},
    series: [
        { name: '남학생', type: 'bar', data: [62, 80, 40] },
        { name: '여학생', type: 'bar', data: [55, 75, 38] }
    ]
}

// 5️⃣ 하루 평균 유해노출 시간(분)
const dailyExposureTimeOption = {
    title: { text: '1일 평균 유해노출 시간(분)', left: 10 },
    tooltip: {},
    xAxis: { type: 'category', data: ['1월', '2월', '3월', '4월', '5월'] },
    yAxis: {},
    series: [{ type: 'line', data: [25, 32, 35, 44, 46], smooth: true }]
}

// 6️⃣ 유형별 불안/우울감 호소 비율
const anxietyRateOption = {
    title: { text: '유형별 불안·우울감 경험률', left: 10, top: 0 },
    tooltip: { trigger: 'item' },
    legend: { data: ['도박', '성착취', '혐오', '자살유도', '딥페이크'], bottom: 0, left: 'center' },
    series: [{
        type: 'pie',
        data: [
            { value: 35, name: '성착취' },
            { value: 25, name: '자살유도' },
            { value: 18, name: '혐오' },
            { value: 12, name: '도박' },
            { value: 10, name: '딥페이크' }
        ]
    }]
}


// 7️⃣ 청소년이 효과적이라 생각하는 정책 Top 5
const policyOption = {
    title: { text: '가장 효과적 정책 (Top 5)', left: 10 },
    tooltip: {},
    xAxis: { type: 'value' },
    yAxis: { type: 'category', data: ['자동필터', '신고제도', '상담/교육', '플랫폼 모니터링', '캠페인'] },
    series: [{ type: 'bar', data: [60, 50, 48, 44, 30], label: { show: true, position: 'right' } }]
}

// 자동 생성된 인사이트 더미데이터
const insights = {
    surveyParticipation: "사이버 도박 관련 설문이 가장 높은 참여율을 보였습니다. 청소년들이 도박 콘텐츠에 많이 노출되고 있음을 알 수 있습니다.",
    contentExposure: "청소년들이 가장 빈번하게 접한 유해 콘텐츠는 사이버 도박과 성착취 콘텐츠였습니다. 이에 대한 강력한 대응책이 필요합니다.",
    quizCorrect: "유해 콘텐츠 차단 방법에 대한 퀴즈 정답률이 높아, 청소년의 기본적인 인식은 양호하나 불법웹툰 처벌 관련 인식 개선이 추가로 필요합니다.",
    exposurePath: "청소년들은 주로 유튜브 및 SNS를 통해 유해 콘텐츠를 접하고 있어, 이 플랫폼들을 대상으로 한 정책적 접근이 필요합니다.",
    dangerFeeling: "체감 위험도가 가장 높은 콘텐츠는 성착취 및 자살유도 콘텐츠로 나타났으며, 적극적인 심리 상담 및 교육 프로그램의 도입이 필요합니다.",
    issueTrend: "성착취·도박 이슈가 꾸준히 증가하고 있어, 집중 모니터링이 시급합니다.",
    prevention: "신고와 차단이 가장 많이 실천되고 있지만, 상담 및 플랫폼 탈퇴 등 추가적 지원방안도 확대 필요.",
    videoQuiz: "영상별 퀴즈 정답률은 70~90%로, 교육 효과가 비교적 잘 나타나고 있습니다.",
    exposureDemographic: "16-18세 남학생, 여학생 모두 유해노출 비율이 가장 높아, 이 연령대 집중 대응 필요.",
    dailyExposureTime: "평균 유해노출 시간이 꾸준히 증가 중으로, 시간 관리 교육 및 자기조절 역량 강화 필요.",
    anxietyRate: "성착취와 자살유도 이슈에서 불안·우울감 호소 비율이 가장 높게 나타났습니다.",
    policy: "자동필터와 신고제도가 효과적 정책으로 인식되며, 상담·교육 및 플랫폼 모니터링 수요도 높음.",
    // ★ 총평
    summary: `\
최근 청소년들은 다양한 경로를 통해 유해 콘텐츠에 노출되고 있으며, 그 중에서도 사이버 도박과 성착취, 자살유도 콘텐츠의 위험성이 두드러지고 있습니다.
특히 16-18세 연령대에서의 노출 비율과 심리적 불안 경험이 높아, 집중적인 모니터링 및 심리 지원 강화가 필요합니다.
정책적으로는 자동필터, 신고제도 강화와 함께 심층 교육·상담, 플랫폼별 모니터링을 종합적으로 추진해야 하며, 유해 노출 시간 관리 및 자기조절 역량 강화를 위한 프로그램 도입도 시급합니다.
데이터에 기반한 실효적 대응을 통해 청소년의 디지털 안전을 실질적으로 개선할 수 있을 것입니다.\
`
}
</script>

<style lang="scss" scoped>
.insight-page {
    display: flex;
    flex-direction: column;
    gap: 3rem;

    h2,
    h3 {
        margin: 0;
    }

    h2 {
        border-bottom: 1px solid $color-secondary;
        padding-bottom: 0.75rem;
    }
}

.chart {
    height: 350px;
}

.insight {
    font-size: 0.9rem;
    color: #555;
    padding: 0.5rem;
    border-left: 4px solid #007bff;
    background-color: #f5faff;
}

.summary {
    font-size: 1rem;
    color: #222;
    background: #eaf6ff;
    border-radius: 8px;
    padding: 1.5rem 1.5rem;
    margin-top: 1rem;
    border-left: 6px solid #3182ce;
    font-weight: 400;
    white-space: pre-line;
}

.its-dummy {
    font-size: 0.7rem;
    font-weight: 400;
    color: rgb(165, 165, 165);
    margin-left: 1rem;
}
</style>