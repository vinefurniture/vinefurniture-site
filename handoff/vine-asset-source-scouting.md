# Vine asset source scouting

이번 점검에서는 현재 머신에서 바인퍼니처 실자산 후보가 이미 내려받아져 있는지 우선 확인했습니다.

## 확인한 경로
- `/home/hansa`
- `/mnt/c/Users/hansa/Downloads`
- `/mnt/c/Users/hansa/Documents`
- `/mnt/c/Users/hansa/OneDrive`

## 결과
- 바인퍼니처/실자산으로 바로 식별 가능한 파일은 찾지 못했습니다.
- Windows Downloads 안에서는 일반 이미지 파일 일부만 보였고, 바인퍼니처 관련 파일명/압축파일은 확인되지 않았습니다.
- 따라서 다음 단계는 **실자산을 전달받는 즉시 바로 넣을 수 있도록 intake 시트 기준으로 수집/정리**하는 방식이 가장 빠릅니다.

## 바로 사용할 파일
- `handoff/vine-asset-intake.csv`
- `handoff/vine-asset-intake.md`
- `handoff/vine-phase1-priority-pack.md`
- `handoff/vine-assets.md`

## 권장 다음 액션
1. 우선 `P1` 자산 3개 + 로고 1개를 먼저 수집
2. 파일명을 intake 시트의 `target_path` 기준으로 맞춤
3. `public/images/vine/` 아래에 배치
4. `npm run assets:check`
5. `npm run build && npm run preview:check`
