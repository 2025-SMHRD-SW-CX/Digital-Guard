<template>
  <div class="dashboard-page">
    <h2>대시보드<span><small class="its-dummy">시연을 위한 더미데이터임을 알립니다</small></span></h2>
    <div class="dashboard-grid">
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
      <!-- 체감 위험도 조사 -->
      <section>
        <v-chart class="chart" :option="dangerFeelingOption" />
        <p class="insight">{{ insights.dangerFeeling }}</p>
      </section>
      <!-- 월별 주요 유해 이슈 추이 -->
      <section>
        <v-chart class="chart" :option="issueTrendOption" />
        <p class="insight">{{ insights.issueTrend }}</p>
      </section>
    </div>
    <!-- 총평 -->
    <section>
      <h3>총평</h3>
      <div class="summary">
        <p v-for="(line, i) in summaryLines" :key="i">{{ line }}</p>
      </div>
    </section>
  </div>
</template>

<script setup>
import { use } from 'echarts/core'
import VChart from 'vue-echarts'
import { CanvasRenderer } from 'echarts/renderers'
import { BarChart, PieChart, RadarChart, LineChart } from 'echarts/charts'
import { TooltipComponent, LegendComponent, GridComponent, TitleComponent } from 'echarts/components'

use([
  CanvasRenderer,
  BarChart,
  PieChart,
  RadarChart,
  LineChart,
  TooltipComponent,
  LegendComponent,
  GridComponent,
  TitleComponent
])

// 그래프 option과 insights는 기존 코드 그대로 사용
// (생략 가능, 위에서 쓰던 그대로 복붙 사용 가능)
const surveyParticipationOption = {
    title: { text: '설문별 참여율 현황', left: 10 },
    tooltip: {},
    xAxis: { data: ['위험콘텐츠', '사이버도박', 'SNS 혐오폭력', '성착취', '자살유도'] },
    yAxis: {},
    series: [{ type: 'bar', data: [230, 180, 160, 120, 110] }]
}
const contentExposureOption = {
    title: { text: '유해 콘텐츠 유형별 노출 빈도', left: 10, top: 0 },
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
const dangerFeelingOption = {
    title: { text: '체감 위험도 조사', left: 10},
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
const issueTrendOption = {
    title: { text: '월별 주요 유해 이슈 추이', left: 10, top: 0 },
    tooltip: { trigger: 'axis' },
    legend: { data: ['사이버도박', '성착취', '혐오', '자살유도', '딥페이크'], top: 25, left: 'center', itemGap: 1, textStyle: { fontSize: 10 } },
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

const insights = {
  surveyParticipation: "사이버 도박 관련 설문이 가장 높은 참여율을 보였습니다. 청소년들이 도박 콘텐츠에 많이 노출되고 있음을 알 수 있습니다.",
  contentExposure: "청소년들이 가장 빈번하게 접한 유해 콘텐츠는 사이버 도박과 성착취 콘텐츠였습니다. 이에 대한 강력한 대응책이 필요합니다.",
  dangerFeeling: "체감 위험도가 가장 높은 콘텐츠는 성착취 및 자살유도 콘텐츠로 나타났으며, 적극적인 심리 상담 및 교육 프로그램의 도입이 필요합니다.",
  issueTrend: "성착취·도박 이슈가 꾸준히 증가하고 있어, 집중 모니터링이 시급합니다.",
  summary: [
    "최근 청소년들은 다양한 경로를 통해 유해 콘텐츠에 노출되고 있으며, 그 중에서도 사이버 도박과 성착취, 자살유도 콘텐츠의 위험성이 두드러지고 있습니다.",
    "특히 16-18세 연령대에서의 노출 비율과 심리적 불안 경험이 높아, 집중적인 모니터링 및 심리 지원 강화가 필요합니다.",
    "정책적으로는 자동필터, 신고제도 강화와 함께 심층 교육·상담, 플랫폼별 모니터링을 종합적으로 추진해야 하며, 유해 노출 시간 관리 및 자기조절 역량 강화를 위한 프로그램 도입도 시급합니다.",
    "데이터에 기반한 실효적 대응을 통해 청소년의 디지털 안전을 실질적으로 개선할 수 있을 것입니다."
  ]
}

const summaryLines = insights.summary
</script>

<style lang="scss" scoped>
.dashboard-page {
  padding: 1.2rem 1.5rem;
  display: flex;
  flex-direction: column;
  gap: 2.5rem;
  background: #f9fafb;
  min-height: 100vh;
  h2, h3 { margin: 0 0 1rem 0; }

  h2 {
    border-bottom: 1px solid $color-secondary;
    padding-bottom: 0.75rem;
  }
}
.dashboard-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-gap: 2rem;
  margin-bottom: 2rem;
}
.chart {
  height: 260px;
  margin-bottom: 0.4rem;
}
.insight {
  font-size: 0.9rem;
  color: #555;
  background: #f5faff;
  border-left: 4px solid #3182ce;
  padding: 0.6rem 0.9rem;
  margin: 0;
}
.summary {
  font-size: 1rem;
  color: #222;
  background: #eaf6ff;
  border-radius: 8px;
  padding: 1.3rem 1.3rem;
  margin-top: 0.7rem;
  border-left: 6px solid #3182ce;
  font-weight: 400;
  p { margin: 0 0 0.7em 0; }
}

.its-dummy {
    font-size: 0.7rem;
    font-weight: 400;
    color: rgb(165, 165, 165);
    margin-left: 1rem;
}
</style>
