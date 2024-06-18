---
title: "만일 당신이 이 BigQuery 이메일을 놓쳤다면 SQL 쿼리를 잃을 수도 있습니다"
description: ""
coverImage: "/assets/img/2024-06-19-IfYouMissedThisBigQueryEmailYouCouldLoseYourSQLQueries_0.png"
date: 2024-06-19 05:23
ogImage: 
  url: /assets/img/2024-06-19-IfYouMissedThisBigQueryEmailYouCouldLoseYourSQLQueries_0.png
tag: Tech
originalTitle: "If You Missed This BigQuery Email You Could Lose Your SQL Queries"
link: "https://medium.com/pipeline-a-data-engineering-resource/if-you-missed-this-bigquery-email-you-could-lose-your-sql-queries-30f7a0ee1ca7"
---


클라우드 및 데이터 엔지니어링의 세계를 처음 접하고 계신가요? 전문가로서의 여정을 시작할 때 포트폴리오로 시작해보세요. 무료 5페이지 프로젝트 아이데이션 가이드를 받아보세요.

본 게시물에는 제휴 링크가 포함되어 있지 않습니다.

기업 자산을 보호하는 것 외에도 좋은 기업 사이버 보안 팀은 필요한 교육과 함께 미끄러지면 피싱 테스트에 실패할 수 있다는 사실로 무장하고 하나의 일을 정말 잘 할 수 있습니다: 이메일을 열 때 정말로 걱정스럽게 만든다. 나는 현재 가짜 CEO가 와이어 이체를 요청하거나 "스타벅스"가 비트코인으로 기프트 카드를 다시로드하도록 하려는 메시지를 방어하는 데 패배한 적이 없어서, 아무런 필요하지 않은 긴급함을 전달하는 이메일에 대해 당연히 회의적이다.

그래서 “조치 권장”이라는 자격요건이 담긴 이메일을 개인 인박스로 받았을 때 나는 내 조직의 보안팀이 초과 근무 중이라고 생각했다. 블록 버튼 위에 손가락을 두며 이메시지를 훑어보니 보통의 "여기를 클릭하세요" 함정이 있는지 확인했습니다.

<div class="content-ad"></div>

다행히도, 이것은 Google Cloud로부터 온 메시지로, BigQuery에 중요하면서도 섬세한 변경 사항에 관한 내용이었습니다.

![이미지](/assets/img/2024-06-19-IfYouMissedThisBigQueryEmailYouCouldLoseYourSQLQueries_0.png)

구체적으로, 저장된 쿼리의 저장, 액세스 및 유지 관리 프로세스에 대한 변경 사항이 자세히 설명되어 있었는데, 저는 이 프로세스를 자주 실행하기 때문에 주목하게 되었습니다.

따라서 이는 BigQuery 쿼리가 갑자기 양자 컴퓨트 리소스상에서 실행된다는 뉴스와 같이 혁신적인 발표는 아니지만, 나와 같이 BigQuery 쿼리를 만들고는 잊어버리는 경향이 있는 전문가들에게 영향을 미칠 것으로 생각되는 바입니다.

<div class="content-ad"></div>

<img src="/assets/img/2024-06-19-IfYouMissedThisBigQueryEmailYouCouldLoseYourSQLQueries_1.png" />

2024년은 Google의 데이터 관련 제품에게 중요한 해가 될 것으로 예상됩니다. 출판사들과 콘텐츠 제작자들을 위한 기타 Google 제품 소식은 Google의 유니버설 애널리틱스(UA)의 폐기와 Google 애널리틱스 4 (GA4)로의 이주가 그림자를 드리웠습니다. 더 자세히 살펴보면, Google Cloud 기능은 조용히 Python 버전 3.8 미만의 지원을 폐지했고, 이로 인해 제가 소유한 비즈니스 지원 영역의 거의 50개 클라우드 기능을 이주하는 데 몇 시간과 많은 PR을 투자하게 되었습니다. 동시에 BigQuery는 오직 SQL 환경에서 제공되던 것에서 "데이터를 AI로 가속화하는 협업 분석 공간"인 BigQuery Studio로 이동하고 있습니다.

<img src="/assets/img/2024-06-19-IfYouMissedThisBigQueryEmailYouCouldLoseYourSQLQueries_2.png" />

이 변경의 일환으로, 현재 고객들을 위해(저와 같은 경우 — 저는 엔터프라이즈 계정을 사용하며 개인 이메일과 연결된 계정을 유지합니다) 마이그레이션 날짜에 GCP가 이 새로운 "협업 분석 공간"을 지원하는 6개의 새로운 API를 자동으로 활성화할 것입니다.

<div class="content-ad"></div>

- Dataform
- Dataplex
- 빅쿼리 데이터 정책
- 빅쿼리 연결
- 분석 허브
- 예약

API 변경은 확실하게 흥미로운 일이지만, 여러분(또는 어떤 빅쿼리 사용자든)께서 이 이메일을 받게 된 이유는 중요한 리소스에 대한 액세스 손실 가능성이 있기 때문입니다. 특히 저장된 쿼리들에 대한 손실이요. 이 측면에서 긍정적인 소식은 상기 API가 2024년 3월 초에 자동으로 활성화될 것이지만, 사용자들은 2025년 3월까지 완전히 새로운 빅쿼리 스튜디오 설정으로 저장된 쿼리를 이전할 수 있다는 점입니다.

"내가 쓴 쿼리 초안들을 저장하기 위해서 이 정도까지 해야 한다니, 참 귀찮다"고 생각 중이라면, 아마 맞는 말일지도 모릅니다. 그러나 데이터 엔지니어로서 배운 가장 중요한 교훈 중 하나는 때로는 가장 거친 코드 조각조차도 때로는 향후 중요한 스크립트에 통합되거나 기초로 활용될 수도 있다는 것입니다.

저는 개인적으로 몇 가지 이유로 쿼리를 저장합니다.

<div class="content-ad"></div>

만약 제가 큰 쿼리나 뷰에 열을 추가하는 것과 같은 빠른 업데이트를 작업 중이라면,

또한, 스키마를 프로그래밍적으로 생성하는 것과 같은 작업을 자주 반복한다면 코드를 저장하곤 해요.

```js
SELECT column_name AS name,
CASE WHEN data_type = "FLOAT64" THEN "FLOAT" 
WHEN data_type = "INT64" THEN "INTEGER"
WHEN data_type = "BOOLEAN" THEN "BOOL"
ELSE END AS type,
"NULLABLE" AS mode
FROM `project.dataset.INFORMATION_SCHEMA`.COLUMNS
WHERE table_name = "target_table"
```

제가 데이터를 검증하는 QA를 수행할 때 쿼리를 저장하는 것도 자주 하죠. 위 예시처럼, 데이터 유효성을 검증하기 위해 사용하는 몇 가지 프로세스가 있는데, 제 분석 팀원들이 자신들만의 QA를 수행하기 전에도 이미 사용해요. 여러 테이블에서 특정 필드를 비교할 때, 수익 지표와 같은, 이러한 열, CTE 및 JOIN을 가능한 한 한 번만 작성하고 싶어해요.

<div class="content-ad"></div>

저는 수익과 같은 특정 민감한 데이터에 액세스할 수 있지만, BigQuery 액세스를 가진 모든 사람이 그러한 정보를 볼 수 있는 것은 아닙니다. 여기서 접근 제어와 권한이 매우 중요한 역할을 합니다.

따라서 BigQuery Studio 이관의 일환으로 BigQuery 사용자는 새로운 쿼리를 만들고 저장하기 위해 새 권한이 필요합니다. 구체적으로 다음과 같습니다:

![이미지](/assets/img/2024-06-19-IfYouMissedThisBigQueryEmailYouCouldLoseYourSQLQueries_3.png)

저와 같은 BigQuery 관리자들은 더 넓은 범위에서 프로젝트 수준의 자원을 관리할 수 있도록 데이터폼 관리자 역할이 부여될 것입니다.

<div class="content-ad"></div>

모든 제품 이관처럼, 플랫폼과 최종 사용자는 원활한 전환과 자산 보존을 위해 특정 역할을 수행해야 합니다.

### GCP

- 자동으로 6개의 새로운 API를 활성화합니다.
- 자동으로 BigQuery 사용자 및 BigQuery 관리자 계정을 필수 Dataform 권한으로 전환합니다.

### 사용자

<div class="content-ad"></div>

- 자동 API 활성화에서 선택하여 탈락하기 (2024년 3월 3일까지)
- 계정 권한을 기존 액세스 제어 정책과 일치하도록 조정하기
- 새 API에 의존하는 스크립트 및 액세스 범위가 있는 모든 스크립트 업데이트하기
- 새로운 쿼리를 저장하기 – 개별적으로 또는 24년 여름에 예정된 새 변환 도구를 사용하여

이 발표는 사용자들에게 충분한 시간을 제공한다고 인정하며(API 자동 활성화에 대해 거의 한 달, 새로운 저장된 쿼리 이전에는 1년), 제품 사용자의 중요한 책임을 강조합니다: 새로운 발전 사항을 항상 인식하고 폐기 대비 계획을 항상 갖도록하는 것입니다.

어떤 규모의 프로젝트던지 시작을 할수록 빨리 하는 것이 더 좋습니다. 이 방법은 때때로 스트레스를 유발하는 이주 과정을 완화시키고 제품의 폐기가 발생한 직후의 예기치 못한 문제 발생 가능성을 방지할 수 있습니다.

나는 데이터를 잃는 것보다 더 나쁜 것은 접근 권한을 잃는 것이기 때문에 내 개인 인스턴스에 저장된 쿼리를 매우 가까운 시일 내에 이전할 계획입니다.

<div class="content-ad"></div>

도와드릴게요. 이 블로그 외에 어떻게 도와드릴 수 있는지 알려주실 겸 3가지 질문 설문에 응답해주세요. 모든 응답자에게 무료 선물을 제공해드립니다.