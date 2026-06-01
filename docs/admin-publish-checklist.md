# 바인퍼니처 관리자 반영 체크리스트

## 1) `/admin`에서 수정
- 먼저 1~3번 항목만 확인
- 전화번호 / 운영시간 / 주소 확인
- 방문 안내 + 메인 / 오시는 길 / 문의 문구 확인
- 필요할 때만 접힌 항목(링크 / 현재 사용 중인 대표 사진) 펼치기

## 2) 미리보기 확인
- `/admin`에서 메인 / 오시는 길 / 문의 미리보기 버튼 열기
- 전화 버튼과 외부 링크가 올바른지 확인
- 홈 최근 사진 영역과 방문 안내 흐름이 어색하지 않은지 확인

## 3) 반영 파일 저장
- 문구만 바꿨으면 `문구 파일 저장` 클릭
- 링크만 바꿔도 `문구 파일 저장` 클릭
- `vine-admin-publish.json` 파일 저장
- 안내 문구에 "브라우저 임시 업로드" 경고가 보이면 대표 사진은 별도 자산 교체 필요

## 3-1) 대표 사진도 함께 바꿨다면
- `사진 파일 저장` 버튼 클릭
- `vine-admin-draft.json` 파일 저장
- 프로젝트 루트에서:

```bash
npm run admin:extract-assets -- ./vine-admin-draft.json --write
```

- 실행 결과:
  - 업로드한 대표 사진이 `public/images/vine/...` 경로에 저장됨
  - 같은 위치에 `vine-admin-publish.json` 생성됨
- 그 다음 아래 4)~7) 순서대로 진행

## 4) 반영 전 드라이런
프로젝트 루트에서:

```bash
npm run admin:validate -- ./vine-admin-publish.json
npm run admin:import -- ./vine-admin-publish.json
```

- 필수값/링크/브라우저 임시 업로드 잔여 여부 먼저 확인
- 변경 요약(JSON 출력) 확인
- 링크 값 / 대표 사진 슬롯 / 최근 사진 관련 안내 문구 확인

## 5) 실제 반영
문제가 없으면:

```bash
npm run admin:import -- ./vine-admin-publish.json --write
npm run build
npm run preview:check
```

## 6) 배포
```bash
git status
git add src/data/site-content.json src/data/vine-asset-manifest.json
git commit -m "chore: apply admin publish payload"
git push origin main
npx vercel deploy --prod --yes --token "$VERCEL_TOKEN"
```

## 7) 최종 확인
- `https://vinefurniture-site.vercel.app`
- 메인 / 오시는 길 / 문의 페이지
- 전화번호, 링크, 대표 사진 반영 여부 재확인

## 메모
- 평소에는 1~3번 항목만 수정해도 대부분 충분합니다.
- 대표 사진을 파일 업로드로만 바꾼 경우, 그 이미지는 현재 브라우저 초안에만 저장됩니다.
- 실제 사이트 반영까지 하려면 `public/images/vine/...` 경로에 맞춰 자산 교체를 따로 진행해야 합니다.
- 단순 링크/문구 변경은 publish JSON + import 스크립트만으로 반영됩니다.
