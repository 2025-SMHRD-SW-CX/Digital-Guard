<template>

    <div class="wrapper">
        <CardView class="survey-card">
            <p class="survey-title" @click="handleTitleClick">{{ targetData.title }}</p>
            <p class="survey-detail">{{ targetSurvey.detail }}</p>
            <div class="indicator-wrap">
                <!-- 리워드 획득량 -->
                <div class="icon-value-wrap">
                    <img src="/images/coin_icon.png">
                    <p>보상 +{{ targetData.reward }}P</p>
                </div>
            </div>
            <div class="indicator-wrap">
                <!-- 리워드 획득량 -->
                <!-- 소요시간 -->
                <div class="icon-value-wrap">
                    <img src="/images/survey/sandclock_icon.png">
                    <p>소요시간 {{ targetData.time }}</p>
                </div>
                <!-- 난이도 -->
                <div class="icon-value-wrap">
                    <img :src="`/images/survey/star_${targetData.feelLevel[0]}.png`">
                    <p>난이도 {{ targetData.feelLevel[1] }}</p>
                </div>
            </div>
            <div class="indicator-wrap">
                <!-- 섹션 수 -->
                <div class="icon-value-wrap">
                    <img src="/images/survey/sections_icon.png">
                    <p>섹션 {{ sectionCount }}개</p>
                </div>
                <!-- 문항 수 -->
                <div class="icon-value-wrap">
                    <img src="/images/survey/questions_icon.png">
                    <p>총 문항 {{ totalQuestionCount }}개</p>
                </div>
            </div>
            <p class="be-honest">여러분의 응답은 정부나 기관의 정책 수립과 피해 예방 활동에 귀중한 자료가 됩니다.
                <br><b>솔직한 답변 부탁드리며, 모든 응답은 익명으로 처리되어 개인 정보는 절대 공개되지 않습니다.</b>
            </p>
        </CardView>

        <!-- 각 섹션 반복 -->
        <CardView v-for="(section, sIdx) in targetSurvey.section" :key="sIdx" class="survey-section">
            <p class="section-title">{{ section.title }}</p>
            <ul class="questions-list">
                <li v-for="(question, qIdx) in section.questions" :key="qIdx" class="question-item"
                    :ref="el => setQuestionRef(el, sIdx, qIdx)">
                    <div class="question-row">
                        <span class="question-no">{{ qIdx + 1 }}.</span>
                        <span class="question-title">{{ question.title }}</span>
                    </div>
                    <!-- SINGLE CHOICE (라디오) -->
                    <div v-if="question.type === 'single'" class="select-options">
                        <label v-for="(sel, selIdx) in question.selectables" :key="selIdx" class="select-btn"
                            :class="{ selected: answers[sIdx][qIdx].single === sel }">
                            <input type="radio" :name="`single-${sIdx}-${qIdx}`" :value="sel"
                                v-model="answers[sIdx][qIdx].single" @change="onSingleOtherChange(sIdx, qIdx, sel)" />
                            {{ sel }}
                        </label>
                        <!-- 기타(직접입력) -->
                        <div v-if="hasOtherOption(question)" class="other-input">
                            <input v-if="answers[sIdx][qIdx].single === '기타'" type="text"
                                v-model="answers[sIdx][qIdx].other" placeholder="직접 입력" />
                        </div>
                    </div>
                    <!-- MULTIPLE CHOICE (체크박스) -->
                    <div v-else-if="question.type === 'multiple'" class="select-options">
                        <label v-for="(sel, selIdx) in question.selectables" :key="selIdx" class="select-btn"
                            :class="{ selected: answers[sIdx][qIdx].multiple.includes(sel) }">
                            <input type="checkbox" :value="sel" v-model="answers[sIdx][qIdx].multiple"
                                @change="onMultipleOtherChange(sIdx, qIdx, sel)" />
                            {{ sel }}
                        </label>
                        <div v-if="hasOtherOption(question)" class="other-input">
                            <input v-if="answers[sIdx][qIdx].multiple.includes('기타')" type="text"
                                v-model="answers[sIdx][qIdx].other" placeholder="직접 입력" />
                        </div>
                    </div>
                    <!-- TEXT -->
                    <div v-else-if="question.type === 'text'" class="select-options">
                        <textarea ref="textareas" v-model="answers[sIdx][qIdx].text" placeholder="입력하세요"
                            @input="autoResize($event)" />
                    </div>
                </li>
            </ul>
        </CardView>

        <!-- 설문 동의 & 제출 -->
        <CardView class="survey-consent-card">
            <div class="consent-submit-wrap">
                <label class="consent-label">
                    <input type="checkbox" v-model="isAgreed" />
                    <span>
                        <b>설문 결과 활용 및 개인정보 수집·이용(익명) 동의</b>에 동의합니다.
                    </span>
                </label>
                <button class="submit-btn" :disabled="!isAgreed" @click="submitSurvey">
                    제출하기
                </button>
            </div>
        </CardView>

    </div>


    <ModalView v-model="showCompleteModal" title="설문조사 완료!" confirmText="야호!" @confirm="gotoSurveyList">

        <p>설문조사를 완료했어요!</p>
        <p>보상 +{{ targetData.reward }}P 획득!</p>

    </ModalView>

</template>

<script setup>
import CardView from '@/components/CardView.vue';
import ModalView from '@/components/ModalView.vue';
import { useSurveyStore, SURVEYS } from '@/stores/survey';
import { reactive, ref, onMounted, nextTick } from 'vue';
import { useAlertStore } from '@/stores/alert';
import { useUserStore } from '@/stores/user';
import { useRouter } from 'vue-router';

const alertStore = useAlertStore();
const userStore = useUserStore();
const surveyStore = useSurveyStore();
const router = useRouter();

// 라우터가 surveyId 를 prop 으로 넘겨줌
const props = defineProps({
    surveyId: {
        type: String,
        required: true
    }
})

const targetData = surveyStore.data.find(i => i.id == props.surveyId);
const targetSurvey = SURVEYS.find(i => i.surveyId == props.surveyId)

const sectionCount = SURVEYS[0].section.length;

const totalQuestionCount = SURVEYS[0].section
    .map(sec => sec.questions.length)
    .reduce((a, b) => a + b, 0);



const textareas = ref([]);

// 자동 리사이즈 함수
function autoResize(e) {
    const el = e.target;
    el.style.height = 'auto';
    el.style.height = el.scrollHeight + 'px';
}

// 기존 답변값이 있을 때도 리사이즈 (선택)
onMounted(() => {
    isIntervalAvailble()

    nextTick(() => {
        textareas.value.forEach(el => {
            if (el) {
                el.style.height = 'auto';
                el.style.height = el.scrollHeight + 'px';
            }
        });
    });
});

function isIntervalAvailble() {
    console.log('pin1', targetData)
    // lastComplete 및 interval 체크
    if (targetData.lastComplete && targetData.intervalDays) {
        const last = new Date(targetData.lastComplete);
        const intervalDays = targetData.intervalDays;
        const now = new Date();
        const nextAvailable = new Date(last);
        nextAvailable.setDate(last.getDate() + intervalDays);

        console.log('pin2')

        if (now < nextAvailable) {
            // 접근 불가: 아직 재참여 불가
            const remain = Math.ceil((nextAvailable - now) / (1000 * 60 * 60 * 24));
            alertStore.danger(
                `이미 참여하셨습니다.\n다음 참여까지 남은 대기일: ${remain}일`,
                2500
            );

            router.replace('/survey');
        }
    }
}


function getInitialAnswers(targetSurvey) {
    return targetSurvey.section.map(section =>
        section.questions.map(q => ({
            single: '',          // single 타입
            multiple: [],        // multiple 타입
            text: '',            // text 타입
            other: ''            // 기타 직접입력
        }))
    );
}

// 기타 옵션이 있는지 판별
function hasOtherOption(question) {
    return question.selectables && question.selectables.includes('기타');
}

// 기타 선택지에 따른 입력창 제어용 핸들러 (single)
function onSingleOtherChange(sIdx, qIdx, value) {
    if (value !== '기타') answers[sIdx][qIdx].other = '';
}

// 기타 선택지에 따른 입력창 제어용 핸들러 (multiple)
function onMultipleOtherChange(sIdx, qIdx, value) {
    if (!answers[sIdx][qIdx].multiple.includes('기타')) {
        answers[sIdx][qIdx].other = '';
    }
}

const answers = reactive(getInitialAnswers(targetSurvey));

const isAgreed = ref(false);

function getSubmitResult() {
    return targetSurvey.section.map((section, sIdx) =>
        section.questions.map((q, qIdx) => {
            const a = answers[sIdx][qIdx];
            let value;
            if (q.type === 'single') {
                value = (a.single === '기타') ? a.other : a.single;
            } else if (q.type === 'multiple') {
                value = a.multiple.includes('기타')
                    ? [...a.multiple.filter(x => x !== '기타'), a.other]
                    : [...a.multiple];
            } else if (q.type === 'text') {
                value = a.text;
            }
            return {
                section: section.title,
                question: q.title,
                answer: value
            };
        })
    ).flat();
}

function submitSurvey() {
    if (!skipValidation.value) {
        const unans = findFirstUnanswered();
        if (unans) {
            alertStore.danger('답변하지 않은 문항이 있습니다.', 2000);
            nextTick(() => {
                const el = questionRefs.value?.[unans.sIdx]?.[unans.qIdx];
                if (el && el.scrollIntoView) {
                    el.scrollIntoView({ behavior: 'smooth', block: 'center' });
                }
            });
            return;
        }
    }
    if (!isAgreed.value) {
        alertStore.warning('정보 활용 동의가 필요합니다.', 3000)
        return;
    }
    const result = getSubmitResult();
    console.log(result);

    // ✅ 설문 완료 시간 기록
    const now = new Date().toISOString();
    surveyStore.data.forEach(item => {
        if (item.id == props.surveyId) {
            item.lastComplete = now;
        }
    });

    console.log(surveyStore.data)

    // 보상 지급
    userStore.addPoint(targetData.reward);

    // 완료 모달 띄우기
    showCompleteModal.value = true;

    alertStore.success('설문이 제출되었습니다!', 3000);
}


// 모든 질문 DOM 참조를 이중 배열로 관리: questionRefs[섹션][문항]
const questionRefs = ref([]);

// ref 셋팅 함수
function setQuestionRef(el, sIdx, qIdx) {
    if (!el) return;
    if (!questionRefs.value[sIdx]) questionRefs.value[sIdx] = [];
    questionRefs.value[sIdx][qIdx] = el;
}

function findFirstUnanswered() {
    for (let sIdx = 0; sIdx < targetSurvey.section.length; sIdx++) {
        const section = targetSurvey.section[sIdx];
        for (let qIdx = 0; qIdx < section.questions.length; qIdx++) {
            const q = section.questions[qIdx];
            const a = answers[sIdx][qIdx];
            if (q.type === 'single') {
                if (!a.single) return { sIdx, qIdx };
                if (hasOtherOption(q) && a.single === '기타' && !a.other.trim()) return { sIdx, qIdx };
            }
            else if (q.type === 'multiple') {
                if (!a.multiple.length) return { sIdx, qIdx };
                if (hasOtherOption(q) && a.multiple.includes('기타') && !a.other.trim()) return { sIdx, qIdx };
            }
            else if (q.type === 'text') {
                if (!a.text.trim()) return { sIdx, qIdx };
            }
        }
    }
    return null;
}

const skipValidation = ref(false);
let clickTimestamps = [];

function handleTitleClick() {
    const now = Date.now();
    clickTimestamps = clickTimestamps.filter(ts => now - ts < 2000); // 최근 2초 이내만 유지
    clickTimestamps.push(now);

    if (clickTimestamps.length >= 5) {
        skipValidation.value = !skipValidation.value;
        alertStore.info(
            skipValidation.value
                ? "입력값 검증이 비활성화되었습니다. 미입력 문항이 있어도 제출이 가능합니다."
                : "입력값 검증이 다시 활성화되었습니다. 미입력 문항이 있으면 제출할 수 없습니다.",
            2500
        );
        clickTimestamps = [];
    }
}

const showCompleteModal = ref(false);

function gotoSurveyList() {
    router.replace('/survey');
}


</script>

<style lang="scss" scoped>
p,
span {
    text-align: left;
}

// ------------------- Base -------------------
.wrapper {
    width: 100%;
    margin: 0 auto;
    box-sizing: border-box;
}

// ------------------- Survey Card (Intro) -------------------
.survey-card {
    .survey-title {
        font-size: 1.2rem;
        font-weight: 500;
        padding: 1rem 0 0.6rem 0;
        border-bottom: 3px solid $color-blue-60;
    }

    .survey-detail {
        padding: 1rem 0.25rem;
        font-size: 1.02rem;
        color: #333;
    }

    .be-honest {
        margin: 0.7rem 0.5rem;
        margin-top: 1.5rem;
        padding: 0.75rem;
        border: 1px solid $color-dark-gray;
        background: #f5f5f5;
        border-radius: 0.5rem;
        font-size: 0.9rem;
        font-weight: 300;
    }
}

// ------------------- Indicator Bar -------------------
.indicator-wrap {
    display: flex;
    gap: 1rem;
    padding: 0.25rem 0;

    .icon-value-wrap {
        display: flex;
        align-items: center;
        gap: 0.45rem;

        img {
            width: 1.4rem;
            object-fit: scale-down;
        }

        p {
            font-weight: 500;
            font-size: 0.92rem;
        }
    }
}

// ------------------- Section/Question List -------------------
.survey-section {
    margin-top: 1.5rem;

    .section-title {
        font-size: 1.09rem;
        font-weight: 600;
        margin-bottom: 1rem;
        border-left: 4px solid $color-blue-60;
        padding-left: 0.6rem;
    }

    .questions-list {
        list-style: none;
        margin: 0;
        padding: 0;

        .question-item {
            margin-bottom: 1.6rem;
            padding: 0.2rem 0;
            font-size: 1rem;
            transition: box-shadow 0.7s, border-color 0.7s, background 0.5s;
            border-radius: 1rem;

            .question-row {
                display: flex;
                align-items: flex-start;
                margin-bottom: 0.7rem;

                .question-no {
                    font-weight: bold;
                    color: $color-blue-60;
                    min-width: 2em;
                }

                .question-title {
                    flex: 1;
                    font-weight: 500;
                }
            }

            .select-options {
                display: flex;
                flex-direction: column;
                gap: 0.7rem;
                margin-left: 2em;
                margin-top: 0.2em;

                .select-btn {
                    display: flex;
                    align-items: center;
                    font-size: 0.95rem;
                    background: #f4f7fa;
                    border: 2px solid #c5d7ee;
                    border-radius: 0.75rem;
                    padding: 0.5rem 0.75rem;
                    cursor: pointer;
                    user-select: none;
                    min-height: 2.1em;
                    transition: border-color 0.22s, background 0.22s, color 0.22s;

                    input[type="radio"],
                    input[type="checkbox"] {
                        margin-right: 0.7em;
                        width: 1.18em;
                        height: 1.18em;
                        accent-color: $color-blue-60;
                    }

                    &.selected {
                        background: #e2f0ff;
                        border-color: $color-blue-60;
                        color: $color-blue-60;
                        font-weight: bold;
                    }
                }

                .other-input {
                    input {
                        width: 100%;
                        font-size: 0.99rem;
                        padding: 0.4em 0.8em;
                        border: 1.5px solid #c5d7ee;
                        border-radius: 6px;
                        margin-top: 0.2em;
                    }
                }
            }

            textarea {
                margin-top: 0.3rem;
                padding: 0.7em 1em;
                width: 96%;
                min-height: 2.3em;
                border: 1.5px solid #c5d7ee;
                border-radius: 9px;
                font-size: 1rem;
                resize: vertical;
                background: #f8fafb;
                transition: border-color 0.18s;
            }
        }
    }
}

// ------------------- 동의/제출 Card -------------------
.survey-consent-card {
    margin-top: 2.5rem;

    .consent-submit-wrap {
        display: flex;
        flex-direction: column;
        align-items: flex-start;
        width: 100%;

        .consent-label {
            display: flex;
            align-items: center;
            font-size: 1.04rem;
            gap: 0.8em;
            margin-bottom: 1.2em;

            input[type="checkbox"] {
                width: 1.2em;
                height: 1.2em;
                accent-color: $color-blue-60;
            }

            span {
                font-weight: 400;
                color: #333;
            }
        }

        .submit-btn {
            width: 100%;
            padding: 0.8em 2.1em;
            font-size: 1.05rem;
            font-weight: bold;
            color: #fff;
            background: $color-blue-60;
            border: none;
            border-radius: 0.8em;
            transition: background 0.2s;
            cursor: pointer;

            &:disabled {
                background: #c5d7ee;
                color: #8794a2;
                cursor: not-allowed;
            }
        }
    }
}

// ------------------- 유틸리티 -------------------
.hide {
    display: none !important;
}
</style>