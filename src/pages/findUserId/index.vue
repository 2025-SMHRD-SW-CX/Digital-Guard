<template>
    <div>
        <div class="findIdTitle">
            <h3>아이디를 찾을 방법을 선택해주세요.</h3>
        </div>

        <div>
            <div class="findWraper" @click="inputPhoneNumber">
                <span><svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path fill-rule="evenodd" clip-rule="evenodd"
                            d="M12.593 23.258L12.582 23.26L12.511 23.295L12.491 23.299L12.477 23.295L12.406 23.26C12.3953 23.2567 12.3873 23.2583 12.382 23.265L12.378 23.275L12.361 23.703L12.366 23.723L12.376 23.736L12.48 23.81L12.495 23.814L12.507 23.81L12.611 23.736L12.623 23.72L12.627 23.703L12.61 23.276C12.6073 23.2653 12.6017 23.2593 12.593 23.258ZM12.858 23.145L12.845 23.147L12.66 23.24L12.65 23.25L12.647 23.261L12.665 23.691L12.67 23.703L12.678 23.71L12.879 23.803C12.8917 23.8063 12.9013 23.8037 12.908 23.795L12.912 23.781L12.878 23.167C12.8747 23.155 12.868 23.1477 12.858 23.145ZM12.143 23.147C12.1386 23.1443 12.1333 23.1435 12.1283 23.1446C12.1233 23.1457 12.1189 23.1487 12.116 23.153L12.11 23.167L12.076 23.781C12.0767 23.793 12.0823 23.801 12.093 23.805L12.108 23.803L12.309 23.71L12.319 23.702L12.323 23.691L12.34 23.261L12.337 23.249L12.327 23.239L12.143 23.147Z"
                            fill="currentColor" />
                        <path fill-rule="evenodd" clip-rule="evenodd"
                            d="M8.172 15.829C12.017 19.674 15.58 20.095 16.626 20.134C17.89 20.18 19.18 19.148 19.738 18.091C18.848 17.047 17.689 16.237 16.42 15.359C15.671 16.107 14.748 17.497 13.519 16.999C12.82 16.718 11.094 15.923 9.586 14.414C8.078 12.905 7.283 11.18 7 10.482C6.502 9.251 7.896 8.326 8.645 7.577C7.767 6.287 6.971 5.098 5.929 4.253C4.857 4.813 3.819 6.093 3.866 7.374C3.905 8.42 4.326 11.983 8.172 15.829ZM16.552 22.133C15.112 22.08 11.031 21.516 6.757 17.243C2.484 12.969 1.921 8.889 1.867 7.448C1.787 5.252 3.469 3.119 5.412 2.286C5.64598 2.18497 5.9022 2.1465 6.15553 2.17438C6.40886 2.20225 6.65059 2.29551 6.857 2.445C8.465 3.618 9.574 5.395 10.527 6.787C10.7252 7.07645 10.8161 7.4261 10.7837 7.77545C10.7514 8.12479 10.598 8.45184 10.35 8.7L8.994 10.057C9.309 10.752 9.95 11.95 11 13C12.05 14.05 13.248 14.691 13.944 15.006L15.299 13.65C15.5478 13.401 15.8763 13.2474 16.2269 13.2161C16.5776 13.1848 16.9281 13.2779 17.217 13.479C18.637 14.463 20.305 15.556 21.521 17.113C21.6826 17.3209 21.7854 17.5684 21.8187 17.8296C21.8519 18.0909 21.8144 18.3562 21.71 18.598C20.873 20.551 18.755 22.214 16.552 22.133Z"
                            fill="currentColor" />
                    </svg>
                </span>
                <h4>전화번호로 찾기</h4>
            </div>
            <div class="line"></div>
            <div class="findWraper" @click="inputEmail">
                <span><svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path
                            d="M22 7L13.009 12.727C12.7039 12.9042 12.3573 12.9976 12.0045 12.9976C11.6517 12.9976 11.3051 12.9042 11 12.727L2 7"
                            stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                        <path
                            d="M20 4H4C2.89543 4 2 4.89543 2 6V18C2 19.1046 2.89543 20 4 20H20C21.1046 20 22 19.1046 22 18V6C22 4.89543 21.1046 4 20 4Z"
                            stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                    </svg>

                </span>
                <h4>이메일로 찾기</h4>
            </div>
        </div>
    </div>

</template>

<script setup>

import { useRouter } from "vue-router";

const router = useRouter();

const inputPhoneNumber = () => {
    setTimeout(() => {
    alert("전화번호로 찾기 선택됨");
  }, 10);
}

const inputEmail = () => {
    setTimeout(() => {
    router.push('/findUserId/findUserIdEmail');
  }, 10);
}
</script>

<style lang="scss" scoped>
.findIdTitle {
    padding-top: 20px;
}

.findWraper {
    display: flex;
    align-items: center;
    padding: 10px;
    cursor: pointer;
    color: $color-text; // 기본 아이콘 + 글씨 색

    &:hover {
        color: $color-primary; // hover 시 아이콘 + 글씨 색
    }
}

.findWraper svg {
    width: 40px;
    height: 40px;
    padding: 5px;
}

.findWraper h4 {
    margin: 10px;
    font-size: 23px;
}

.line {
    height: 1px;
    background-color: #ccc;
}
</style>