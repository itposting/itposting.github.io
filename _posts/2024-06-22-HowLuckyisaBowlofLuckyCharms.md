---
title: "럭키 참스 시리얼, 얼마나 행운을 가져다줄까"
description: ""
coverImage: "/assets/img/2024-06-22-HowLuckyisaBowlofLuckyCharms_0.png"
date: 2024-06-22 16:40
ogImage: 
  url: /assets/img/2024-06-22-HowLuckyisaBowlofLuckyCharms_0.png
tag: Tech
originalTitle: "How Lucky is a Bowl of Lucky Charms?"
link: "https://medium.com/towards-data-science/how-lucky-is-a-bowl-of-lucky-charms-9040fe2cc560"
---


tl;dr 버전: 학생 팀이 럭키참스 시리얼 그릇이 박스 전체에 걸쳐 동일하게 "운이 좋은지"를 결정하기 위한 실험을 디자인하고 수행하는 데 도움을 주었습니다. 결과는 별로다. 우리는 한 그릇당 약 2.7개 정도의 전체 참을 추가함에 따라 감소한다고 추정합니다. 첫 번째 그릇부터 마지막 그릇까지의 참은 50% 이상 줄어드는 것과 일치합니다. 시리얼의 무게도 역할을 하는 것으로 나타나며, 그릇을 일정하게 유지할 때 당 1g의 시리얼마다 평균적으로 0.5개 더 많은 참이 있는 것으로 추정됩니다. 그릇과 무게 사이의 상호 작용은 통계적으로 유의하지 않습니다.

데이터, 코드, 사진 등을 확인하려면 이 GitHub 저장소를 참조하세요.

[![BowlofLuckyCharms Image](/assets/img/2024-06-22-HowLuckyisaBowlofLuckyCharms_0.png)](이미지 주소)

## 배경

<div class="content-ad"></div>

2010년대 초반에는 "더블 스탭" 오레오가 실제로 더블 스태프인지 여부에 대한 조사로 인해 인터넷 상에서 소란이 있었습니다. (실제로는 아닙니다.) 흥미로운 아이디어였고, 그 이후로 많은 자료가 작성되었습니다. 첫걸음으로 여기를 참고해보세요. 이 토론은 충분한 주목을 받아 몇몇 교사들이 수업 활동으로 해당 실험을 반복하는 것을 글쎄요 증명했으며, 현지 학생들은 10년 이상 후에도 자신들의 학교에서 유사한 실험을 수행했다고 보고했습니다.

## 소개

2023년 여름 어느 아침, 아침 식사로 럭키 참스를 먹고 있었습니다. 상자는 거의 비어가고, "새 상자를 열 수 있게 될 때까지 기다릴 수 없어..." 하고 내게 한숨을 내쉬었습니다. 저와 비슷한 사람이거나 수백만 명의 다른 사람들처럼, 당신이 럭키 참스를 좋아하고 기억할 수 있는 한을 넘어 60년간 생산되어 온 제품이었습니다. 그들은 정말로 마법 같이 맛있어요. 그런데 그 여름 아침에 숟가락을 쥔 채 앉아서 먹고 있는 그 시리얼 그릇이 전보다 조금 덜 마법 같았습니다. 뭔가 부족해 보였어요. (물론 상징인데요.) 제 생각일까요? 이 효과가 실재성이 있을까요? 그렇다면 측정할 수 있을까요?

당시 대학생 확률 및 통계 과목을 가르치고 있었고, 네 명의 학생과 함께 이를 밝혀보기로 결심했습니다.

<div class="content-ad"></div>

# 실험과 데이터

토론을 거친 후, 팀은 다음 재료와 방법을 결정했습니다.

## 재료

- 가족 사이즈 럭키 참스 6박스 (18.6oz, 527g)
- 전자 주방 저울
- 플라스틱 “그릇” 2개, A 그릇과 B 그릇 (각각 40.125g 및 28.375g)
- 폐기물을 담을 큰 그릇, 일부 휴지봉투, 기타 용품

<div class="content-ad"></div>

럭키 참스는 지역 소매업체인 월마트에서 구입했어요. n = 6 상자에 특별한 점은 없었는데, 이것은 한 번의 여행으로 6층 카파로 홀의 6층에 두 손으로 운반할 수 있는 상자의 수였어요. 부엌 저울은 시리얼의 무게를 측정하기 위한 것이었는데, 팀은 이것이 중요할 것이라고 생각했고, 또한 시럽을 정확히 매번 샘플링하는 데 과도하게 전념하고 싶지 않았어요.

![이미지](/assets/img/2024-06-22-HowLuckyisaBowlofLuckyCharms_1.png)

# 방법

이 실험의 목적을 위해 "그릇"은 상자에서 권장된 대로 (1컵 또는 36g) 대략적으로 1인분의 시리얼을 의미했어요. 아침 식사로 럭키 참스의 36g를 먹기에는 작은 요술사나 리틀매직나인을 제외하고는 불가능하다 고 봐도 될 만큼이나 적은 양이었어요. 팀은 그릇 크기 일치에 특별히 까다롭지 않았고, 1컵에 가까운 양이라면 충분하다고 생각했어요. 어차피 부엌 저울로 시리얼의 질량을 고려하고 있었기 때문에 우리는 건강한 범위의 관측 무게를 목표로 삼았어요.

<div class="content-ad"></div>

<img src="/assets/img/2024-06-22-HowLuckyisaBowlofLuckyCharms_2.png" />

시리얼 한 그릇씩은 상자에서 바로 플라스틱 용기로 붓고, 체중을 측정한 후에 토스트된 오트밀은 마시멜로와 분리되어 버려졌습니다. 그런 다음, 다음 여덟 가지 행운의 매력적인 종류가 인식되고 숫자가 기록되었습니다: 핑크 하트, 무지개, 보라색 굴초, 파란 달, 녹색 클로버, 유니콘, 맛있는 빨간 풍선, 그리고 주황색 별.

<img src="/assets/img/2024-06-22-HowLuckyisaBowlofLuckyCharms_3.png" />

가끔 그릇 안에는 작은 마시멜로 조각이 있었습니다; 모든 매력이 100% 완전하지는 않았습니다. 이를 처리하기 위해, 팀은 조각을 매력의 종류(녹색 클로버, 파란 달 등)로 분류하려고 노력했으며, 그 종류를 확인할 수 있다면 해당 분류에서 그 조각을 1로 계산했습니다. 조각이 불명확하거나 유형 식별에 너무 작으면 버렸습니다.

<div class="content-ad"></div>

# 데이터
데이터는 두 차례에 걸쳐 수집되었습니다. 학생들은 캐릭터를 부어서 세는 것을 쌍으로 협력하여 수행했습니다. 저는 저울과 무게 값을 기록해 컴퓨터에 입력하기 위해 불려지는 동안 하드 복사본을 도왔습니다. 팀은 데이터 수집 분위기에 접어들었고 실험이 끝날 때까지 4명의 학생이 독립적으로 캐릭터를 부어서 세었습니다.

![이미지](/assets/img/2024-06-22-HowLuckyisaBowlofLuckyCharms_4.png)

플라스틱 용기 + 시리얼은 매 라운드마다 함께 저울에 올려 차곡차곡 무게를 측정하였고 실험 초기에 측정된 용기의 무게가 관찰된 총 무게에서 빼졌습니다. 캐릭터는 각각의 열에 입력되어 총계가 계산되었습니다.

<div class="content-ad"></div>


![이미지](/assets/img/2024-06-22-HowLuckyisaBowlofLuckyCharms_5.png)

# 측정된 변수

- 상자: 상자 번호 (1부터 6번)
- 그릇: 각 상자의 연속 그릇 (1부터 13까지 범위)
- 관측: 상자 전체에서 그릇의 관찰된 순서 (1부터 69까지)
- 전체 무게: 플라스틱 용기와 시리얼의 무게(그램)
- 무게: 용기의 무게를 뺀 시리얼의 무게(그램)
- 하트, 별, 기타: 해당 그릇에 대한 그 매력의 개수
- 전체 매력: 여러 매력의 총합

![이미지](/assets/img/2024-06-22-HowLuckyisaBowlofLuckyCharms_6.png)


<div class="content-ad"></div>

여기 R 코드로 데이터 세트의 상위 부분(첫 6행)을 읽고 표시하는 방법이 있습니다. 이 데이터 및 모든 코드는 이 GitHub 저장소에서 공유됩니다.

```R
library(readxl)
Lucky <- read_excel("Lucky.xlsx")
Lucky$Box <- as.factor(Lucky$Box)
head(Lucky)
```

이 데이터를 사용하면 관찰된 무게의 평균은 약 46.3g이었고, 한 그릇에 특정 매력의 최대 수는 15개였습니다(분홍색 하트가 자주색 편못과 동일함). 실제로 이 데이터 집합에 대한 통계를 계산하는 데 하루 종일 할애할 수 있지만, 현재는 주로 Totcharms 및 그것이 그릇과 어느 정도 무게와 관련이 있는지에 초점을 맞추고 있습니다.

다음은 그릇별 Totcharms의 그래프입니다. 상자로 색칠되었습니다:

<div class="content-ad"></div>

```js
Lucky |> ggplot(aes(x = Bowl, y = Totcharms, color = Box)) + 
  geom_point(size = 3) +
  labs(y = '# Charms') -> p1
p1
```

<img src="/assets/img/2024-06-22-HowLuckyisaBowlofLuckyCharms_7.png" />

여기서는 볼의 증가에 따라 Totcharms가 감소하는 명확한 추세를 볼 수 있으며, 패턴이 놀랍도록 선형적입니다. 약간의 곡률이 있을 수 있습니다. 색상을 구분하기 어렵기 때문에 라인 플롯을 만들고 몇 가지 시리즈를 강조해 보겠습니다:

```js
sizes <- c(2, 1, 2, 1, 1, 1)
alphas <- c(1, 0.2, 1, 0.2, 0.2, 0.2)
Lucky |> ggplot(aes(x = Bowl, y = Totcharms)) +
  geom_line(aes(colour = Box, linewidth = Box, alpha = Box)) +
  scale_discrete_manual("linewidth", values = sizes) +
  scale_alpha_manual(values = alphas, guide = "none")
```

<div class="content-ad"></div>

<img src="/assets/img/2024-06-22-HowLuckyisaBowlofLuckyCharms_8.png" />

모든 시리즈가 전반적으로 하강하는 추세를 보이지만, 각 상자별로 그 경로는 다양합니다. Box 3이 높은 위치에서 시작해 몇 개의 그릇마다 높은 위치에 머물다가 10그릇까지 부드럽게 내려가다가 곧 허사로 떨어지는 모습을 주목해 보세요. Box 1은 군중 중에서 가장 낮은 위치에서 시작하여 5그릇 후에 증가하며, 8그릇에 정점을 찍은 뒤 12그릇까지 급격히 하강하는 모습을 살펴보세요. 데이터에 따르면 Box 3 꼭대기 부근에 매력을 집중시켰지만, Box 1 중간 부분에 몰려 있었습니다. 일부 상자는 왔다갔다 하고, 다른 상자는 더 일직선적으로 내려가죠. 하지만 모두를 합치면 전반적으로 감소하는 선형적인 추세를 보입니다. 모든 상자가 적어도 11그릇까지는 갔지만, 12그릇을 가진 상자는 2개 뿐이었고, 하나의 상자인 Box 4만 13그릇까지 간 것을 유의하세요.

이제 Totcharms 대 Weight를 비교해 보겠습니다:

```js
Lucky |> ggplot(aes(x = Weight, y = Totcharms, color = Box)) + 
  geom_point(size = 3) +
  labs(x = 'Weight (g)', y = '# Charms') -> p2
p2
```

<div class="content-ad"></div>


![Plot Image](/assets/img/2024-06-22-HowLuckyisaBowlofLuckyCharms_9.png)

이 플롯은 소음이 많습니다. 최소 무게가 30g 미만부터 최대 무게가 70g 근처까지 다양한 무게 범위를 갖고 있습니다. 특이하게 하나의 그릇이 예외적으로 무거운 무게를 기록했습니다. 이 이상치에는 명백한 설명이 없지만 조금 더 깊이 파고들어 Weight 대 Bowl을 플롯하면 어떤 통찰을 얻을 수 있을지도 모릅니다.

```js
Lucky |> ggplot(aes(x = Bowl, y = Weight, color = Box)) + 
  geom_point(size = 3) + ylim(5, 75) +
  labs(y = 'Weight (g)') -> p3
p3
```

![Plot Image](/assets/img/2024-06-22-HowLuckyisaBowlofLuckyCharms_10.png)


<div class="content-ad"></div>

아쉽게도 그 특정 데이터 포인트의 출처는 시간이 흘러 잊혀진 상태입니다. 하지만 팀이 처음 마무리한 상자였기 때문에 최종적으로 남은 시리얼 양을 판단하는 것이 어려웠을 수도 있으며, 아마 모든 잔여물이 그 마지막 그릇에 붓겨진 것일 수도 있습니다. 아침 식사할 때도 종종 시리얼 상자를 비우려고 할 때 비슷한 일을 하곤 합니다. 만약 그 70g의 12번째 그릇을 (예를 들어) 40g과 30g의 그릇 두 개로 나누었다면, 단 하나가 아니라 두 상자가 모두 13그릇까지 갈 수도 있었고, 아마 아래 모델들이 데이터에 조금 더 잘 맞을지도 모릅니다. 아쉽게도, 그렇게 알 수 없습니다. 과학적인 기업이란 바로 그런 것이죠.

복적과 무게 자체로는 선형 관계가 크지 않지만, Totcharms, Bowl 및 Weight 간에 숨겨진 관계가 있습니다. 이 관계는 3D 시각화로 가장 잘 탐색할 수 있습니다:

```js
library(plotly)
fig <- plot_ly(Lucky, x = ~Bowl, y = ~Weight, z = ~Totcharms, color = ~Box) |>
  add_markers() |>
  layout(scene = list(xaxis = list(title = '그릇'),
                                   yaxis = list(title = '무게 (g)'),
                                   zaxis = list(title = '# 별')),
                      legend=list(title=list(text='상자')))
fig
```

<img src="/assets/img/2024-06-22-HowLuckyisaBowlofLuckyCharms_11.png" />

<div class="content-ad"></div>

3D 플롯은 정말 멋져요, 하지만 위의 정적 디스플레이는 데이터에 정의를 제대로 하지 못해요. 저는 대부분의 모바일/데스크톱 브라우저에서 작동하는 대화형 플롯 버전을 다음 링크에 설정했어요:

거기로 가서 데이터를 돌리고, 확대 및 축소, 이동 등을 확인해보세요. 정확히 올바르게 돌리면 데이터가 3D 공간의 평면 주위에 흩뿌려진 것을 볼 수 있을 거에요. 이것이 우리가 여러 선형 회귀 모델에서 찾고 있는 관계의 정확한 종류에요 (우리는 잠시 후에 다룰 거에요).

# 모델 맞추기

이제 이 변수들 간의 선형 관계를 양적으로 측정해보도록 할게요. Totcharms와 Bowl 간의 단순 선형 회귀 모델부터 시작할 거에요.

<div class="content-ad"></div>

# 그릇

다음은 모델입니다:

```js
mod1 <- lm(Totcharms ~ 그릇, data = Lucky)
summary(mod1)
```

```js
## 
## Call:
## lm(formula = Totcharms ~ 그릇, data = Lucky)
## 
## Residuals:
##      Min       1Q   Median       3Q      Max 
## -16.7629  -5.7629  -0.4327   6.2277  22.2277 
## 
## Coefficients:
##             Estimate Std. Error t value Pr(>|t|)    
## (Intercept)  55.1309     2.1237  25.960  < 2e-16 ***
## 그릇         -2.6698     0.2985  -8.945 4.81e-13 ***
## ---
## Signif. codes:  0 '***' 0.001 '**' 0.01 '*' 0.05 '.' 0.1 ' ' 1
## 
## Residual standard error: 8.313 on 67 degrees of freedom
## Multiple R-squared:  0.5442, Adjusted R-squared:  0.5374 
## F-statistic: 80.01 on 1 and 67 DF,  p-value: 4.807e-13
```

<div class="content-ad"></div>

볼이 고치에 강하게 선형으로 연관되어 있음을 알 수 있습니다. 볼의 기울기는 대략 -2.7이며, 다시 말해, 럭키 참즈 한 그릇을 추가로 먹을 때마다 평균 Totcharms가 2.7개 줄어들 것으로 추정됩니다. 결정 계수(R²)는 0.5442로, Totcharms의 분산의 약 54%가 Bowl을 예측 변수로 사용한 회귀 모델에 의해 설명됨을 의미합니다. 다음으로 적절한 잔차 분석을 포함해야 하지만 일단 건너뛸 것입니다. 말 그대로, 잔차 그림이 상대적으로 잘 작동합니다. 기본값으로 회귀선에 대한 신뢰 대역이 포함된 적합된 선 그래프를 확인해 보겠습니다:

```js
p1 + geom_smooth(method = "lm", aes(group=1), colour="black")
```

<img src="/assets/img/2024-06-22-HowLuckyisaBowlofLuckyCharms_12.png" />

단 명확한 감소 추세가 있는 멋진 관계입니다.

<div class="content-ad"></div>

# 무게에 대한

우리는 무게에 대해 동일한 작업을 할 것이며, 일단 그릇을 무시할 것입니다. 여기서 시작합니다:

```js
mod2 <- lm(Totcharms ~ Weight, data = Lucky)
summary(mod2)
```

```js
## 
## Call:
## lm(formula = Totcharms ~ Weight, data = Lucky)
## 
## Residuals:
##      Min       1Q   Median       3Q      Max 
## -27.0151  -8.7745   0.6901   7.8328  24.4701 
## 
## Coefficients:
##             Estimate Std. Error t value Pr(>|t|)  
## (Intercept)  22.1370    10.5650   2.095   0.0399 *
## Weight        0.3502     0.2256   1.552   0.1254  
## ---
## Signif. codes:  0 '***' 0.001 '**' 0.01 '*' 0.05 '.' 0.1 ' ' 1
## 
## Residual standard error: 12.1 on 67 degrees of freedom
## Multiple R-squared:  0.0347, Adjusted R-squared:  0.02029 
## F-statistic: 2.409 on 1 and 67 DF,  p-value: 0.1254
```

<div class="content-ad"></div>

Weight가 단독으로 Totcharms를 예측하는 데 유용하지 않다고 생각합니다. 이는 이전에 본 산점도와 일치합니다. Weight의 기울기는 0.3502로, 행운의 매 당 1g 추가는 평균적으로 0.35 매의 Totcharms 증가에 해당합니다. 이는 합리적으로 들립니다: 시리얼이 많으면 매력도 많아집니다. 결정 계수는 상당히 낮습니다: R² = 0.0347, 즉 Totcharms의 분산 중 약 NONE%가 Weight를 예측 변수로 사용하는 회귀 모형에 의해 설명된다는 것입니다. 괜찮아요; Weight는 시리얼 양의 가변성을 조절하기 위한 보조 장치였습니다. 여기서 잔차 분석 결과는 생각했던 것보다 그리 나쁘지 않았습니다. 무엇보다 위/아래 끝의 극단적인 관측치가 포함되어 있기 때문에 일부 문제가 예상되었습니다. 완성도를 위해 또 다른 적합 선 그래플을 넣었습니다:

```js
p2 + geom_smooth(method = "lm", aes(group=1), colour="black")
```

<img src="/assets/img/2024-06-22-HowLuckyisaBowlofLuckyCharms_13.png" />

원래 ggpubr 패키지를 사용하여 이러한 적합 선 그래프를 함께 놓고 토론에서 공간을 절약하려고 계획했지만, 그래프가 협소하고 정보가 나오지 않았습니다. 어쨌든, 내가 하려던 건 이거였어요:

<div class="content-ad"></div>

```r
library(ggpubr)
ggarrange(p1 + geom_smooth(method = "lm", aes(group=1), colour="black"),
          p2 + geom_smooth(method = "lm", aes(group=1), colour="black"),
          align = 'h', labels=c('A', 'B'), legend = "right",
          common.legend = TRUE)
```

# Multiple regression

이제 재미있는 부분으로 넘어가 봅시다: Totcharms ~ Bowl 및 Totcharms ~ Weight 관계를 개별적으로 탐색해 보았지만, 이들을 함께 넣으면 어떻게 될까요? 알아보죠:

```r
mod3 <- lm(Totcharms ~ Bowl + Weight, data = Lucky)
summary(mod3)
```

<div class="content-ad"></div>

```js
## 
## 호출:
## lm(formula = Totcharms ~ Bowl + Weight, data = Lucky)
## 
## 잔차:
##      Min       1Q   Median       3Q      Max 
## -12.8825  -5.4425  -0.9975   5.2475  26.5304 
## 
## 계수:
##             추정치 표준 오차 t 값 유의확률    
## (Intercept)  33.3168     6.8655   4.853 7.78e-06 ***
## Bowl         -2.7552     0.2796  -9.855 1.35e-14 ***
## Weight        0.4819     0.1452   3.318  0.00148 ** 
## ---
## 유의수준:  0 '***' 0.001 '**' 0.01 '*' 0.05 '.' 0.1 ' ' 1
## 
## 잔차 표준 오차: 7.754, 자유도: 66
## 다중 R-제곱:  0.6094, 조정 R-제곱:  0.5976 
## F-통계량: 51.49, 자유도: 2, 66,  p값: 3.363e-14
```

여기 보세요! 이제 Bowl과 Weight는 Totcharms와 강한 선형 관계가 있습니다. Bowl의 기울기는 거의 이전과 같은 -2.7이지만, Weight의 추정 기울기는 거의 0.5 charms로 증가했습니다. 각각의 추가적인 1g 시리얼에 대해. (조정된) 다중 R²가 거의 60%로 상승했습니다. 이는 샘플 크기(n = 6), 데이터셋의 일반적인 잡음 수준 및 (작은 마시멜로 조각이 1로 계산된다든가 하는) 의문을 제기할만한 설계 선택에도 불구하고 주목할 만한 것입니다. 회고적으로, 데이터가 훨씬 나쁠 수 있었음에도 불구하고 꽤 놀라운 것입니다.야외에서 손수 수집된 실제 데이터는 그리 친절하지 않은 경우가 흔합니다.

# 회귀 평면 추가

이 시각화를 위한 코드는 다른 예제들보다 좀 더 복잡하고, 간결함을 위해 생략되었지만, 이 모든 것을 GitHub Gist에서 확인할 수 있습니다. 이제 그림을 살펴보도록 하겠습니다.

<div class="content-ad"></div>


![이미지](/assets/img/2024-06-22-HowLuckyisaBowlofLuckyCharms_14.png)

다시 말해요: 정적 버전만으로는 데이터를 충분히 표현할 수 없어요. 대화형 버전을 확인해보세요:

대화형 3D 플롯은 정말 재미있어요. 그래프와 놀면서 즐기시는 만큼 저도 즐겁게 살포시 플레이했어요. 마지막으로, tl;dr 문구에서 우리는 "보울과 무게 사이의 상호작용이 중요하지 않다"고 주장했어요. 독자는 다음과 같은 출력을 통해 확인할 수 있어요 (출력은 생략됨):

```js
summary(lm(Totcharms ~ Bowl * Weight, data = Lucky))
```

<div class="content-ad"></div>

# 토론 및 질문

원래 전체적으로 생각했던 것은 모든 것이 내 상상의 산물이거나 효과가 너무 작아서 'Lucky Charms'가 많이 필요할 수 있다는 것이었습니다. 두 가지 모두 잘못되었습니다. 효과는 실제로 존재하며, 손으로 두 개 상자분을 사용하여 감지할 수만 있다는 것을 깨달았습니다.

# 럭키 참 드롭

전체 모델을 통해 우리는 빠르게 몇 가지 놀라운 결론에 도달합니다. 예를 들어 'Lucky Charms' 상자의 첫 번째 그릇에 얼마나 많은 부적을 추정하십니까? 이 연구에서 평균 무게가 46.3g임을 앞서 확인했습니다. 상자 = 1 일 때, 모델은 평균 부적(Charms) 수를 어림잡아 추정합니다.

<div class="content-ad"></div>

```js
33.3168 + (-2.7552)*1 + 0.4819*46.3
```

```js
## [1] 52.87357
```

그래서 첫 번째 시리얼 그릇에는 약 53개의 매료가 들어 있어요—음, 입맛이 벌써 돕니다. 마지막 그릇은 어떨까요? 좋아요, 모든 상자가 13그릇까지 만들지는 못했지만, 모든 상자가 11그릇까지는 만들었어요. 매료가 몇 개 들어 있을까요?

```js
33.3168 + (-2.7552)*11 + 0.4819*46.3
```

<div class="content-ad"></div>


## [1] 25.32157


와우. 평균 25.3개의 매력이 있네요. 이것은 첫 그릇부터 열한 번째 그릇까지 매력이 52% 감소했다는 것을 의미합니다. 아니요, 제 상상력이 아닙니다. 다변수 선형 회귀 모델이나 화려한 3D 플롯은 잊어버리세요, 배고픈 유아도 눈을 가리고 이 차이를 감지할 수 있을 것입니다.

다음 질문은 무엇일까요? 왜 감소하는 걸까요? 물리적인 측면에서 분석해보면 이렇게 설명할 수 있습니다: 럭키 참스를 박스 단위로 간단한 기계적인 혼합물로 간주합니다. 설탕이 올라간 구운 꺾은 꺼풀과 마시멜로우의 혼합입니다. 운송 중에 흔들림이나 가게 선반에 올려놓는 과정, 집으로 운송하는 과정, 그리고 찬장 주변의 활동 등 많은 외부 힘들이 상자를 괴롭힙니다. 그 결과 약간 밀도가 낮은 마시멜로우는 상자의 윗부분으로 이동하고, 밀도가 높은 구운 꺾은 꺼풀은 상자의 아랫부분으로 쌓입니다.

이런 논리는 타당하다고 생각합니다. 하지만 이에 관련된 몇 가지 질문은 답이 없습니다:

<div class="content-ad"></div>

- 개별 매력 유형에 대해서도 동일한 패턴이 유지되는가요? (빠르게 봤을 때 "아니요"라는 것을 시사합니다.)
- 연관성이 정말 선형인가요, 아니면 더 복잡한 모델이 관계를 더 잘 설명할까요?
- 우리가 간과한 중요한 요인은 무엇인가요?
- 행운의 부적이 감소하는 것을 늦추는 데 사용할 수 있는 전략은 무엇인가요?

- 우리는 매운맛을 더 잘 섞기 위해 상자를 똑똑하게 흔들 수 있을까요? (어떻게든)
- 보관 방법은 어떤가요? 상자를 거꾸로 보관하는 것이 도움이 될까요?
- 아니면 옆으로 평평하게 두는 것은요?
- 등등.

이러한 미해결된 질문들은 다음 기회로 미루어야 할 것 같습니다.

# 다음 단계

<div class="content-ad"></div>

오리지널 실험 이후 2023년 여름, 더 많은 학생 그룹들과 몇 번의 실험을 다시 진행했어요. 첫 번째는 2023년 11월 YSU 메가매쓰 데이에서 중학생들과 함께한 실험이었어요. 메가매쓰 학생들에게 매우 구체적인 지침을 주지 않아서, 상자에서 시리얼 봉지를 빼고 탁상 위로 펴진 봉지 중앙에서 스쿱을 하는 것을 발견했어요. 그들을 탓할 수 없었어요; 봉지를 펼쳐놓은 것이 중앙에서 시리얼을 스쿱하기 더 편리하니까요. 안타깝게도, 이 접근법은 존재했을 지도 하는 어떠한 천연 밀도 정렬 순서도 완전히 파괴했고, 이것이 우리가 의심하는 핵심 기저 요소인 실험의 무결성을 저해했어요. 게다가, 아무도 부모님이 든지 Lucky Charms를 그렇게 먹는 걸 허락하지 않을 거라고 생각해요.

두 번째 실험은 2024년 2월 YSU 수학 축제에서 고등학생들을 대상으로 진행한 두 개의 워크샵 연속으로 진행되었어요. 이번에는 그들을 위해 준비가 돼 있었어요. 더 자세한 지침이 담긴 데이터 수집 시트를 만들어 배포했어요. 여기에서 찾아볼 수 있어요. 추가 데이터셋은 GitHub의 extraData 디렉토리에서 확인할 수 있어요.

앞으로, Lucky Charm의 손실을 더 정확히 추정하기 위해 더 많은 데이터가 필요하고, 상자 안의 Charm을 더 균일하게 분배하는 전략을 테스트하는 것이 흥미로울 것 같아요. 성공한다면, 상자의 첫 번째 그릇은 그렇게 마법적이지 않을 수 있겠지만, 반면에 마지막 그릇들은 새로운 Lucky Charms 상자를 열기를 기다리는 짐 같이 느껴지지 않을 수도 있겠죠!

# 감사의 글

<div class="content-ad"></div>

이 실험과 결과는 여름 2023에 STAT 3743 수업을 듣는 Brenna Brocker, Kate Coppola, Gavin Duwe, 그리고 Haziq Rabbani 네 명의 학생들의 열정적인 도움과 섬세한 주의 덕분에 가능했습니다. 나는 그들이 이 통계적인 길을 함께 걸어준 데 대해 감사하게 생각합니다. 또한, Youngstown State University의 수학 및 통계학 부서가 이 연구와 YSU MegaMath Day 및 YSU MathFest에서의 추가 데이터 수집을 지원해 준 데에도 감사드립니다.

# 공표사항

이미 명백하게 나타났겠지만, 저자와 네 명의 학생 모두가 Lucky Charms 팬이라는 것을 알려드립니다. 여기서 보고된 결과는 General Mills, Inc.와 그 계열사, 공장 생산 기준, 그리고 일하는 사람들 또는 로봇들에 대한 비평이 아니며, 우리는 모두 동일한 물리 법칙에 얽힘을 알아야 합니다. 아침 식사 시리얼 상자도 포함됩니다.

또한, 전체 자료를 재실행하여 수집한 이 추가 데이터를 엿보았습니다. 내가 볼 수 있는 한에, 그 영향은 여전히 존재하지만, 그 정도는 그리 극적이지 않습니다. 원래 추정한 것보다 효과가 실제로 더 작은지, 아니면 중/고등학교 설정에서의 데이터 수집 프로토콜과 어떤 관련이 있는지 알 수 없습니다. 시간과 더 많은 자료가 말해줄 것입니다.

<div class="content-ad"></div>

# 참고 자료 및 코드 예제

이 문서를 작성하는 동안 필요한 그래프를 만들기 위한 코드를 찾아다니면서 대부분의 링크들을 기록해 보았습니다. 하지만 몇 가지 빠뜨린 링크들이 있을 수도 있습니다. 만약 빠진 부분이 있으면 댓글로 알려주시면 수정하도록 하겠습니다.

- https://stackoverflow.com/questions/74750478/correct-syntax-for-manually-scaling-the-width-of-lines-in-ggplot
- https://www.statology.org/ggplot-default-colors/
- https://stackoverflow.com/questions/37348719/ggplot2-single-regression-line-when-colour-is-coded-for-by-a-variable
- http://blog.recursiveprocess.com/2013/03/03/oreo-original-vs-double-vs-mega/
- https://stackoverflow.com/questions/38331198/add-regression-plane-to-3d-scatter-plot-in-plotly
- https://stackoverflow.com/questions/38593153/plotly-regression-line-r
- https://stackoverflow.com/questions/15633714/adding-a-regression-line-on-a-ggplot