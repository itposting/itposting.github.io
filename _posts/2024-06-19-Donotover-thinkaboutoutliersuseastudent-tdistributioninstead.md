---
title: "이상치에 대해 과하게 생각하지 마세요, 대신 t-분포를 사용해보세요"
description: ""
coverImage: "/assets/img/2024-06-19-Donotover-thinkaboutoutliersuseastudent-tdistributioninstead_0.png"
date: 2024-06-19 09:24
ogImage: 
  url: /assets/img/2024-06-19-Donotover-thinkaboutoutliersuseastudent-tdistributioninstead_0.png
tag: Tech
originalTitle: "Do not over-think about ‘outliers’, use a student-t distribution instead"
link: "https://medium.com/towards-data-science/do-not-over-think-about-outliers-use-a-student-t-distribution-instead-b6c584b91d5c"
---


## R과 Brms를 사용한 베이지안 접근

다수의 연구자들에게 이상값은 분석의 경로를 급진적으로 바꿀 수 있는 로그 파도와 동일하며 일부 예상된 효과를 "혼란"시킬 수 있습니다. 저는 "극단적인 관측치"라는 용어를 사용하여 이상값은 연구 중인 모집단의 일부가 아닌 관측치를 남깁니다. 예를 들어, 제 분야인 뇌 허혈 연구에서 이상값은 허혈이 있어야 하는 동물인데 실제로 허혈이 없는 동물이며, 극단적인 관측치는 다른 동물들과 매우 다른 작거나 큰 허혈이 있는 동물입니다.

전통적 (빈도론적) 통계 모델은 가우시안 분포의 견고한 기반 위에 구축됩니다. 이에는 중심 한계 정리에 따라 모든 데이터 포인트가 중심 평균 주변에 예측 가능한 패턴으로 군집화될 것이라는 내재된 가정이 존재하는 중요한 제한 사항이 있습니다. 이것은 이상적으로는 플라톤의 이상 세계에서 사실일 수 있지만, 우리 연구자들인 생명 의학 분야의 우리는 이 가정에 의존하기 어려운 초기 샘플링(동물의 수) 때문에 도전적이라는 것을 알고 있습니다.

가우시안 분포는 극단적인 관측치에 매우 민감하며, 그들의 사용은 이상적인 결과를 얻는 가장 좋은 방법은 극단적인 관측치를 제거하는 것이라는 오해를 유발합니다. 이에 대해 한번 심사위원 2로서 기사에서 언급했던 것처럼, "문제는 귀하의 효과를 '가리게' 할 수 있는 극단적인 관측치가 아니라 귀하의 목적에 부적절하다고 믿는 통계 모델을 사용하고 있다는 사실입니다".

<div class="content-ad"></div>

다행히도, 가우시안 모델의 가정에 얽매이지 않아도 된다는 것 알고 계시나요? 다른 선택지가 있으니까요, 바로 스튜던트 t-분포입니다. 저는 실제 생물의 응답을 포착하기 위한 좀 더 적응 가능한 수달로 보고 있어요. 스튜던트 t-분포는 우리 데이터가 어떤 맥락에서든 예상할 수 있는 정상 생물학적 응답인 극단적 관측치로 채워질 수 있음을 인정하기 위한 강력한 대안을 제공해줘요. 어떤 환자나 동물은 치료에 반응하지 않거나 과도하게 반응할 수 있고, 모델링 접근법이 이러한 반응을 스펙트럼의 일부로 인식하는 것은 귀중하답니다. 따라서 이 튜토리얼은 R의 brms 패키지를 통해 스튜던트 t-분포를 사용한 모델링 전략을 탐색합니다. 이 패키지는 베이지안 모델링에 강력한 동반자입니다.

# 스튜던트 t-분포의 밑받침에 있는 것은 무엇인가요?

스튜던트 t-분포는 꼬리가 두꺼운 가우시안 분포에 불과해요. 다시 말해, 가우시안 분포는 스튜던트 t-분포의 특별한 경우라고 할 수 있어요. 가우시안 분포는 평균(μ)과 표준 편차(σ)로 정의돼요. 그러나 스튜던트 t-분포는 자유도(DF)라는 추가 매개변수가 더해진다는 점이 다르죠. 이 자유도 매개변수는 분포의 "두께"를 제어하며, 평균으로부터 더 먼 사건에 더 높은 확률을 할당해줘요. 이 특성은 바이오의학과 같이 정상성 가정이 의심스러운 소량의 표본 크기에서 특히 유용해요. 자유도가 증가함에 따라 스튜던트 t-분포는 가우시안 분포에 가까워져요. 이를 밀도 플롯을 이용해 시각적으로 확인할 수 있어요:

<div class="content-ad"></div>

<img src="/assets/img/2024-06-19-너무 생각하지 마세요 아웃라이어를 생각하지 마세요. 그 대신 스튜던트 t-분포를 사용하세요_0.png" />

그림 1에서 평균 주변의 언덕이 자유도가 줄어들면서 더 작아짐을 주의하십시오. 그 결과로 미리 수집되었던 확률이 두꺼운 꼬리로 이동했습니다. 이 특성은 스튜던트 t-분포가 아웃라이어에 대한 민감도를 줄여주는 것입니다. 이에 대한 자세한 내용은 블로그를 참조해주세요.

# 필요한 패키지 로드

필요한 라이브러리를 로드합니다.

<div class="content-ad"></div>

```r
library(ggplot2)
library(brms)
library(ggdist)
library(easystats)
library(dplyr)
library(tibble)
library(ghibli)
```

# 탐색적 데이터 시각화

그래서, 데이터 시뮬레이션을 건너뛰고 진지하게 할 차례입니다. 쥐들이 로타로드 테스트를 수행하는 중 획득한 실제 데이터로 작업할 것입니다.

먼저, 데이터셋을 환경에 로드하고 해당 요소 수준을 설정합니다. 이 데이터셋에는 동물들의 ID, 그룹 변수(Genotype), 테스트가 수행된 두 가지 다른 날짜를 나타내는 지표(day), 같은 날짜에 대한 다양한 시도가 포함되어 있습니다. 이 문서에서는 시도 중 하나(Trial3)만 모델링합니다. 다른 시도들은 변이 모델링에 대한 미래 문서에서 저장할 것입니다.


<div class="content-ad"></div>

데이터 처리를 고려하면 저희의 모델링 전략은 유전형과 일자를 Trial3의 분포의 범주형 예측변수로 사용할 것입니다.

```R
data <- read.csv("Data/Rotarod.csv")
data$Day <- factor(data$Day, levels = c("1", "2"))
data$Genotype <- factor(data$Genotype, levels = c("WT", "KO"))
head(data)
```

![image](/assets/img/2024-06-19-Donotover-thinkaboutoutliersuseastudent-tdistributioninstead_1.png)

Guilherme A. Franchi, 박사의 훌륭한 블로그 게시물에서 소개된 Raincloud 그림을 사용하여 데이터의 초기 전망을 살펴보겠습니다.

<div class="content-ad"></div>

```R
edv <- ggplot(data, aes(x = Day, y = Trial3, fill=Genotype)) +
  scale_fill_ghibli_d("SpiritedMedium", direction = -1) +
  geom_boxplot(width = 0.1,
               outlier.color = "red") +
  xlab('Day') +
  ylab('Time (s)') +
  ggtitle("Rorarod performance") +
  theme_classic(base_size=18, base_family="serif")+
  theme(text = element_text(size=18),
        axis.text.x = element_text(angle=0, hjust=.1, vjust = 0.5, color = "black"),
        axis.text.y = element_text(color = "black"),
        plot.title = element_text(hjust = 0.5),
        plot.subtitle = element_text(hjust = 0.5),
        legend.position="bottom")+
  scale_y_continuous(breaks = seq(0, 100, by=20), 
                     limits=c(0,100)) +
# Line below adds dot plots from {ggdist} package 
  stat_dots(side = "left", 
            justification = 1.12,
            binwidth = 1.9) +
# Line below adds half-violin from {ggdist} package
  stat_halfeye(adjust = .5, 
               width = .6, 
               justification = -.2, 
               .width = 0, 
               point_colour = NA)
edv
```

<img src="/assets/img/2024-06-19-Do not over-think about outliers, use a Student-t distribution instead_2.png" />

Figure 2은 Guilherme A. Franchi, 박사의 원본과 다릅니다. 왜냐하면 우리는 한 가지가 아닌 두 가지 요인을 그래픽 표현하고 있기 때문입니다. 그러나 그래프의 성격은 같습니다. 빨간 점들에 주목해 주세요. 이들이 중심 경향의 평균을 특정 방향으로 기울이는 극단적인 관측값으로 간주될 수 있는 것입니다. 또한 분산이 다른 것을 관찰하며, 따라서 시그마도 모델링하는 것이 더 나은 추정치를 제공할 수 있습니다. 이제 우리의 작업은 brms 패키지를 사용하여 출력을 모델링하는 것입니다.

# brms를 사용하여 통계 모델 맞추기

<div class="content-ad"></div>

저희는 Day 및 Genotype를 상호 작용하는 범주형 예측 변수로 설정하여 Trial 3의 분포에 모델을 맞추었어요. 먼저 자주 쓰이는 가우스 모델을 적합해볼게요. 이 모델은 빈도주의적 프레임워크에서의 일반적인 최소 제곱(OLS) 모델에 해당합니다. 왜냐하면 우리는 기본 평평한 brms 사전 분포를 사용하기 때문이죠. 이 기사에서는 사전 분포는 다루지 않겠지만, 약속드려요. 미래 블로그에서 다뤄볼 거에요.

가우시안 모델 결과를 얻으면, 학생 t 모델의 큰 결과와 비교할 수 있어요. 그 다음, 데이터 분산의 차이를 고려하기 위해 방정식에 addsigma를 추가해요.

## 가우시안 랜드에서 "전형적인" (빈도주의) 모델 적합

우리의 가우시안 모델은 동질 분산성(3)의 전형적(그리고 종종 잘못된) 가정 하에 구축되었어요. 다시 말해, 우리는 모든 그룹이 동일한(또는 매우 유사한) 분산을 갖는다고 가정해요. 연구자로서 이를 본 적이 없어요.

<div class="content-ad"></div>

```r
Gaussian_Fit1 <- brm(Trial3 ~ Day * Genotype, 
           data = data, 
           family = gaussian(),
           # reproducibility를 위한 seed
           seed = 8807,
           control = list(adapt_delta = 0.99),
           # 모델을 내 노트북에 저장하기 위함
           file    = "Models/20240222_OutliersStudent-t/Gaussian_Fit1.rds",
           file_refit = "never")

# 모델 비교를 위해 loo 추가
Gaussian_Fit1 <- 
  add_criterion(Gaussian_Fit1, c("loo", "waic", "bayes_R2"))
```

## 모델 진단

계속하기 전에 실제 관측값과 모델의 예측을 비교하기 위해 몇 가지 간단한 모델 진단을 하는 것이 좋습니다. 이를 다양한 방법으로 수행할 수 있지만, 가장 흔한 방법은 전체 밀도를 그래픽으로 나타내는 것입니다. brms의 pp_check 함수를 사용하여 이를 달성할 수 있습니다.

```r
set.seed(8807)

pp_check(Gaussian_Fit1, ndraws = 100) +
  labs(title = "가우시안 모델") +
  theme_classic()
```

<div class="content-ad"></div>

<table> 태그를 Markdown 형식으로 바꿔보세요.

<div class="content-ad"></div>

이제 bayestestR 패키지 (4)의 describe_posterior 함수를 사용하여 결과를 확인해 봅시다:

```js
describe_posterior(Gaussian_Fit1,
                   centrality = "mean",
                   dispersion = TRUE,
                   ci_method = "HDI",
                   test = "rope",
                   )
```

![그림](/assets/img/2024-06-19-Donotover-thinkaboutoutliersuseastudent-tdistributioninstead_4.png)

여기서 'intercept'(절편)와 'GenotypeKO'(KO 동물의 같은 시간대 추정 차이)에 집중해 보겠습니다. WT 동물은 로타로드에서 약 37초를 보내는 반면, KO 동물은 한초도 안 되는 0.54초를 더 보냅니다. 이 분야의 연구자로서, 이 차이는 무의미하며 유전자형은 로타로드 성능에 영향을 미치지 않는다고 말할 수 있습니다. 또한, 모델에서 2.9인 Day의 영향도 무의미하다고 생각됩니다. 이러한 추정치를 brms의 훌륭한 conditional_effects 함수를 사용하여 쉽게 시각화할 수 있습니다.

<div class="content-ad"></div>

```R
# Convex hull을 위한 그래프를 생성합니다
Gaussian_CondEffects <- 
  conditional_effects(Gaussian_Fit1)

Gaussian_CondEffects <- plot(Gaussian_CondEffects, 
       plot = FALSE)[[3]]

Gaussian_CondEffects + 
  geom_point(data=data, aes(x = Day, y = Trial3, color = Genotype), inherit.aes=FALSE) +
  Plot_theme +
  theme(legend.position = "bottom", legend.direction = "horizontal")
```

<img src="/assets/img/2024-06-19-Donotover-thinkaboutoutliersuseastudent-tdistributioninstead_5.png" />

Figure 8에서 상호 작용 항목에 대한 추정치와 불확실성을 볼 수 있습니다. 여러 ggplot 요소로 플롯을 사용자 정의했으며, 원래 Quarto Notebook에서 확인할 수 있습니다. 날 1과 날 2 모두 유사한 불확실성을 보여줍니다. 날 1에 더 큰 분산이 있지만, 날 2에는 낮습니다. 이 점에 대해 이 기사 끝에 짧은 조각을 통해 다룰 예정입니다.

이제 동일한 데이터를 학생 t 분포를 사용하여 모델링할 때 얼마나 우리의 이해가 얼마나 변하는지 살펴봅시다.


<div class="content-ad"></div>

# 방문해 주셔서 감사합니다: 학생-t 분포를 사용한 모델 적합

우리 `brms` 모델에서 학생-t 분포를 사용할 시간입니다.

```js
Student_Fit <- brm(Trial3 ~ Day * Genotype, 
           data = data, 
           family = student,
           # 재현성을 위한 시드
           seed = 8807,
           control = list(adapt_delta = 0.99),
           # 모델을 내 노트북에 저장하기 위함
           file    = "Models/20240222_OutliersStudent-t/Student_Fit.rds",
           file_refit = "never")

# 모델 비교를 위한 loo 추가
Student_Fit <- 
  add_criterion(Student_Fit, c("loo", "waic", "bayes_R2"))
```

## 모델 진단

<div class="content-ad"></div>

이전과 같이 모델 진단 결과를 그래프로 표현해봤어요:

![Figure 9](/assets/img/2024-06-19-Donotover-thinkaboutoutliersuseastudent-tdistributioninstead_6.png)

Figure 9에서 관측값과 예측값의 평균 모양과 정점이 일치하는 것을 볼 수 있어요. 우리 모델은 0 미만의 값을 예측하는 것으로 보입니다. 이는 현재는 건너뜁니다만 중요한 연구 이슈입니다. 그러나 이는 0 이하의 값에 대한 하한선을 설정하는 정보 전제나 분포 계열(예: log_normal`,hurdle_lognormal’, or `zero_inflated_poisson’)의 사용을 함축합니다. 경우에 따라 Andrew Heiss (5)가 이와 관련한 훌륭한 예시를 제공합니다.

## student-t 분포의 결과 확인

<div class="content-ad"></div>

후방 분포를 살펴보겠습니다:

```js
describe_posterior(Student_Fit,
                   centrality = "mean",
                   dispersion = TRUE,
                   ci_method = "HDI",
                   test = "rope",
                   )
```

<img src="/assets/img/2024-06-19-Donotover-thinkaboutoutliersuseastudent-tdistributioninstead_7.png" />

이 모델 하에 우리의 추정치가 다소 변한 것을 볼 수 있어요. 절편(WT at 1 day)에 대한 추정치가 7초 감소했습니다. 그 이유는 무엇일까요? 초기에 발견한 극단 값들이 데이터의 중심 경향 측정에 덜 영향을 미치기 때문입니다. 따라서 이는 1일차 전형적인 WT 동물의 무게를 더 정확하게 측정한 것입니다. 또한, 일자별 영향이 상당히 증가한 것을 관찰할 수 있습니다. 거의 10초가 초기 가우시안 추정치보다 더 많이 소요되어요. 중요한 점은, KO 유전자형의 영향이 더 두드러지게 나타나며, 초기 가우시안 모델의 0.52보다 학생 t 모델에서 5.5로 약 10배 증가했습니다. 이 데이터의 맥락을 고려해볼 때, 두 모델 간의 대조가 뚜렷하다고 생각해요.

<div class="content-ad"></div>

그래픽적으로 조건부 효과를 확인해 보겠습니다. conditional_effects를 사용해요:

```js
Student_CondEffects <- 
  conditional_effects(Student_Fit)

Student_CondEffects <- plot(Student_CondEffects, 
       plot = FALSE)[[3]]

Student_CondEffects + 
  geom_point(data=data, aes(x = Day, y = Trial3, color = Genotype), inherit.aes=FALSE) +
  Plot_theme +
  theme(legend.position = "bottom", legend.direction = "horizontal")
```

<img src="/assets/img/2024-06-19-Donotover-thinkaboutoutliersuseastudent-tdistributioninstead_8.png" />

더 나은 추정을 얻을 수 있을까요? 이 특정 예시에서는 가능하다고 생각해요. 처음부터 데이터의 분산 차이를 쉽게 알아차렸으며, 특히 첫째 날과 둘째 날의 시각화를 비교할 때 더욱 명확해졌어요. 학생 t-분포를 사용하여 추정치를 향상시켰고, residual variance를 예측하는 이분산성 모델을 개발하여 추정치를 더욱 개선했습니다.

<div class="content-ad"></div>

요거 하나 남았네요.

# 학생-t 분포를 사용하여 시그마 예측

우리는 brms의 thebf 함수를 사용하여 반응 변수로 시그마를 포함시킵니다. 이 경우, 우리는 동일한 예측 변수인 Day와 Genotype을 사용하여이 매개 변수를 모델링할 것입니다.

```js
Student_Mdl2 <- bf (Trial3 ~ Day * Genotype,
                     sigma ~ Day * Genotype)

Student_Fit2 <- brm(
           formula = Student_Mdl2,
           data = data, 
           family = student,
           # 재현성을 위한 시드
           seed = 8807,
           control = list(adapt_delta = 0.99),
           # 모델을 내 노트북에 저장하기 위함
           file    = "Models/20240222_OutliersStudent-t/Student_Fit2.rds",
           file_refit = "never")

# 모델 비교를 위해 loo 추가
Student_Fit2 <- 
  add_criterion(Student_Fit2, c("loo", "waic", "bayes_R2"))
```

<div class="content-ad"></div>

## 모델 진단

![Figure 11](/assets/img/2024-06-19-Donotover-thinkaboutoutliersuseastudent-tdistributioninstead_9.png)

피겨 11은 좋아보이지만 0 미만의 예측값이 조금 불편합니다. 이 경우, 이것이 추정치와 그들의 불확실성에 강력한 편향을 미치지는 않는다고 판단합니다. 그러나 이는 실제 연구를 할 때 고려할 부분입니다.

## 예측 시그마를 사용한 학생-t 분포 결과 확인

<div class="content-ad"></div>

이제 우리는 사후 분포를 살펴보겠습니다.

![image](/assets/img/2024-06-19-Donotover-thinkaboutoutliersuseastudent-tdistributioninstead_10.png)

우리는 다른 두 적합된 모델에 비해 더 많은 매개변수를 볼 수 있습니다. 이는 시그마에 대한 응답이 이제 모델의 주효과로 포함되었기 때문입니다. 이 체계 아래에서 우리는 y절편이 가우시안 모델의 것에 더 가깝고 유전형 (GenotypeKO)의 영향이 반으로 줄어든 것을 볼 수 있습니다.

그러나 주목해야 할 점이 하나 있습니다. 첫 번째 스튜던트-t 모델에서 y절편에 대한 불확실성은 24.1에서 37.4 사이였습니다. 그러나 마지막 모델에서 불확실성은 24.3에서 46.1로 증가했습니다. 즉, 서로 다른 분산을 고려할 때 이 (그리고 다른) 매개변수에 대한 확신이 줄어든다는 것을 의미합니다. 예를 들어, 일(day)의 경우, 1.2에서 18.9였던 범위가 -5.6에서 18.1로 변합니다. 이 경우, 이제 두 번째 날이 로터로드에 보낸 시간이 증가된다는 것에 대해 덜 확신할 수 있습니다.

<div class="content-ad"></div>

이 예제에서는 데이터의 다른 분산을 고려하면 결과에 대한 매우 다른 아이디어를 제공합니다.

마지막으로, 우리는 로그 스케일에 표시된 시그마가 날짜와 유전형에 따라 의미 있는 변화가 있음을 확인할 수 있습니다:

```js
Student_CondEffects2 <- 
  conditional_effects(Student_Fit2)

Student_CondEffects2 <- plot(Student_CondEffects2, 
       plot = FALSE)[[3]]

Student_CondEffects2 + 
  geom_point(data=data, aes(x = Day, y = Trial3, color = Genotype), inherit.aes=FALSE) +
  Plot_theme +
  theme(legend.position = "bottom", legend.direction = "horizontal")


Student_CondEffects3 <- 
  conditional_effects(Student_Fit2, dpar = "sigma")

Student_CondEffects3 <- plot(Student_CondEffects3, 
       plot = FALSE)[[3]]

Student_CondEffects3 + 
  Plot_theme +
  theme(legend.position = "bottom", legend.direction = "horizontal")
```

<img src="/assets/img/2024-06-19-Donotover-thinkaboutoutliersuseastudent-tdistributioninstead_11.png" />

<div class="content-ad"></div>

![링크 텍스트](/assets/img/2024-06-19-Donotover-thinkaboutoutliersuseastudent-tdistributioninstead_12.png)

두 번째 그래프에서 본 것은 시그마입니다. 이는 일자 및 유전형 간이 이 매개변수의 분산을 효과적으로 설명합니다. 특히 WT 쥐의 경우, 첫 번째 날에는 훨씬 더 불확실성이 높게 나타나는 반면, 두 번째 날에는 이 매개변수가 유사합니다.

우리는 이 글을 샘플 외 예측을 위해 세 가지 모델을 비교하며 결론을 낼 수 있습니다.

# 모델 비교

<div class="content-ad"></div>

WAIC 기준을 사용하여 모델 비교를 수행합니다. WAIC는 외부 샘플 예측 오차를 추정하기 위해 사용됩니다. WAIC는 관측 데이터의 로그 우도와 유효 파라미터 수를 모두 고려하여 모델 적합성과 복잡성 사이의 균형을 제공합니다. 다른 기준과는 달리 WAIC는 포인트 추정 대신 파라미터의 사후 분포를 내재적으로 반영하므로 베이지안 분석에 특히 적합합니다.

데이터 세트와 베이지안 모델이 주어졌을 때, WAIC는 다음과 같이 계산됩니다:

WAIC = -2×(LLPD - pWAIC)

여기서, LLPD는 로그 점별 예측 밀도로, 각 관측 데이터 지점에 대한 로그 우도를 후방 샘플 전체에 걸쳐 평균한 값입니다. WAIC는 유효 파라미터 수로, 로그 우도의 평균과 후방 샘플들 간 평균 로그 우도의 차로 계산됩니다.

<div class="content-ad"></div>

퍼포먼스 패키지의 compare_performance 함수를 사용합니다. easystats 환경에 포함된 일부 함수입니다 (4, 7, 8).

```js
Fit_Comp <- 
  compare_performance(
    Gaussian_Fit1, 
    Student_Fit, 
    Student_Fit2, 
    metrics = "all")

Fit_Comp
```

이 출력 결과에 따르면, 아웃 오브 샘플 예측에서 시그마를 예측하는 우리의 Student-t 모델이 가장 적게 패널티를 받았습니다 (WAIC = 497). 이 모델에서 시그마에 대한 추정치가 없는 이유는 이것이 응답 변수로 포함되었기 때문입니다. 이 표는 또한 Student-t 모델이 가우시안 모델보다 잔차 분산 (시그마)이 적다는 것을 보여줍니다. 이는 분산이 예측 변수로 더 잘 설명된다는 것을 의미합니다. 동일한 결과를 그래프로 시각화할 수 있습니다.

```js
Fit_Comp_W <- 
loo_compare(
 Gaussian_Fit1, 
    Student_Fit, 
    Student_Fit2,  
  criterion = "waic")

# WAIC 그래프 생성
Fit_Comp_WAIC <- 
  Fit_Comp_W[, 7:8] %>% 
  data.frame() %>% 
  rownames_to_column(var = "model_name") %>% 
  
ggplot(
  aes(x    = model_name, 
      y    = waic, 
      ymin = waic - se_waic, 
      ymax = waic + se_waic)
  ) +
  geom_pointrange(shape = 21) +
  scale_x_discrete(
    breaks=c("Gaussian_Fit1", 
             "Student_Fit", 
             "Student_Fit2"), 
            
    labels=c("Gaussian_Fit1", 
             "Student_Fit", 
             "Student_Fit2") 
             
    ) +
  coord_flip() +
  labs(x = "", 
       y = "WAIC (score)",
       title = "") +
  Plot_theme

Fit_Comp_WAIC
```

<div class="content-ad"></div>


![이미지](/assets/img/2024-06-19-Donotover-thinkaboutoutliersuseastudent-tdistributioninstead_13.png)

그림 14는 우리의 마지막 모델이 샘플 외 예측에 대해 덜 처벌받는 것을 보여줍니다.

GitHub 사이트에서이 게시물의 최신 버전을 찾을 수 있습니다. 이 여정이 유익했는지, 이 연습에 추가할 건설적인 의견이 있는지 알려주세요.

* 별도로 표기하지 않은 경우, 모든 이미지는 R 코드를 사용하여 작성된 것입니다.


<div class="content-ad"></div>

# 참고 자료

1. M. 아산울라, B. M. G. 키브리아, M. 샤킬, Normal and student´s t distributions and their applications (Atlantis Press, 2014; [링크](http://dx.doi.org/10.2991/978-94-6239-061-4)).

2. P.-C. Bürkner, Brms: An r package for bayesian multilevel models using stan. 80 (2017), doi:10.18637/jss.v080.i01.

3. K. 양, J. 투, T. 첸, Homoscedasticity: an overlooked critical assumption for linear regression. General Psychiatry. 32, e100148 (2019).

<div class="content-ad"></div>

4. D. Makowski, M. S. Ben-Shachar, D. Lüdecke, bayestestR: 베이지안 프레임워크 내에서 효과 및 불확실성, 존재 및 중요성을 설명하는 책 (2019년). 4, 1541 페이지.

5. A. Heiss, 베이지안 베타 및 제로 인플레이티드 베타 회귀 모형으로 비율을 모델링하는 안내서 (2021년), (http://dx.doi.org/10.59350/7p1a4-0tw75에서 다운로드 가능).

6. A. Gelman, J. Hwang, A. Vehtari, 베이지안 모델에 대한 예측 정보 기준 이해. 통계 및 컴퓨팅. 24, 997–1016 페이지 (2013년).

7. D. Lüdecke, M. S. Ben-Shachar, I. Patil, P. Waggoner, D. Makowski, Performance: 통계 모형의 평가, 비교 및 테스트를 위한 R 패키지. 6, 3139 페이지 (2021년).

<div class="content-ad"></div>

8. D. Makowski, M. Ben-Shachar, D. Lüdecke, bayestestR: 베이지안 프레임워크 내에서 효과 및 불확실성, 존재 및 유의성을 설명하는 방법. Journal of Open Source Software. 4, 1541 (2019).