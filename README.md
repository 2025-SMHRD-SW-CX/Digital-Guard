## 규칙
- master 브랜치에 직접 push 하지 말것. `git checkout -b [브랜치이름]` 명령어로 새로운 브랜치로 분기 한 뒤, 새로만든 브랜치를 push하세요.
- push 한 경우 무조건 보고하세요. 만약 저녁이나 새벽 등 업무외 시간이라면 보고를 보류하고 업무시간에 한번에 보고하세요.
- 보고가 생략될 수 있으니 각 작업자들은 작업을 마무리 하기 전에 <b>커밋로그가 새로 올라왔는지 확인</b>하세요. (push를 보고받지 않고 직접 확인하는 작업입니다.)

```
예)

# 브랜치를 새로 만들면서 바로 변경하기
git checkout -b dev_kjh

# 어느 브랜치에 있는지 확인
git branch

# 파일 스테이징
git add *

# 커밋
git commit -m "XX 기능 추가됨"

# 푸쉬
git push origin dev_kjh

```

이렇게 브랜치를 만들어서 푸쉬하고 난 뒤, GitHub 레포지토리로 가서 <b>Pull Request를 생성</b>하세요.


### __직접 master에 push한 경우 무조건 보고하세요__

