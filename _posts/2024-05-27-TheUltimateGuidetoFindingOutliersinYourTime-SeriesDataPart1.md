---
title: "시계열 데이터에서 이상치를 찾는 궁극의 안내서 파트 1"
description: ""
coverImage: "/assets/img/2024-05-27-TheUltimateGuidetoFindingOutliersinYourTime-SeriesDataPart1_0.png"
date: 2024-05-27 14:58
ogImage:
  url: /assets/img/2024-05-27-TheUltimateGuidetoFindingOutliersinYourTime-SeriesDataPart1_0.png
tag: Tech
originalTitle: "The Ultimate Guide to Finding Outliers in Your Time-Series Data (Part 1)"
link: "https://medium.com/towards-data-science/the-ultimate-guide-to-finding-outliers-in-your-time-series-data-part-1-1bf81e09ade4"
---


![Outliers](/assets/img/2024-05-27-TheUltimateGuidetoFindingOutliersinYourTime-SeriesDataPart1_0.png)

이상치: 통계 모델을 왜곡하고 예측을 왜곡시키며 의사 결정 프로세스를 약화시키는 문제가 되는 데이터 포인트들입니다.

그들이 데이터 분석에서 특별히 좋아지지 않는 것은 놀라운 일이 아닙니다.

제 이름은 Sara이며, 물리학 석사 학위를 가지고 있습니다. 현재는 글로벌 에너지 회사에서 데이터 과학자로 일하고 있습니다.


<div class="content-ad"></div>

이 기사는 시계열 데이터에서 이상치를 식별하고 관리하는데 전념한 세 개의 시리즈를 시작합니다. 만약 이 시리즈를 계속해서 따르고 싶다면, 저를 팔로우하고 다음 부분이 발행될 때 업데이트를 받을 수 있도록 구독하세요!

이 첫 번째 글에서는 시계열 데이터에서 이상치를 효과적으로 식별하기 위한 시각적 및 통계적 방법을 탐구합니다. 이 기초적인 지식은 분석 정확도를 향상시키려는 모든 사람에게 중요합니다.

다음 기사에서는 기계 학습 방법에만 집중하여, 그 중요성과 복잡성에 비추어, 전용 논의가 필요합니다.

그 후 세 번째 기사에서는 이상치를 관리하는 다양한 전략을 탐색할 것입니다. 우리는 변형 기술에 집중하여, 그 영향을 완화하는 실용적인 해결책을 제시할 것입니다.

<div class="content-ad"></div>

시작해 봅시다!

컨텐츠:

Part I (이 기사):

- 왜 중요한가요?
- Outliers vs Anomalies
- 올바른 이상 탐지 방법 선택하기
- 단변량 vs 다변량 시계열 데이터
- 이상치 식별

<div class="content-ad"></div>

- 시각 검사
- 통계적 방법

5. 평가 지표

Part II (다음):

3. 이상값 식별

<div class="content-ad"></div>

- 기계 학습 방법
- 평가 지표

다음 장 (예정):

4. 이상값 처리

- 무시하거나 제거하거나?
- 변환 기술
- 대치
- 상한 설정

<div class="content-ad"></div>

어째서 신경 써야 할까요?

만약 여러분이 이 글을 읽고 있다면, 아마도 모델링을 수행하기 전에 이상치를 처리하는 것이 얼마나 중요한지 이미 알고 계실 것입니다.

시계열 데이터에서 이상치에 대해 신경 써야 하는 몇 가지 이유는 다음과 같습니다:

- 이상치는 데이터 집합의 평균, 분산, 상관 계수 등과 같은 주요 통계치를 심각하게 왜곡하고 잘못 표현할 수 있습니다.
- 이상치는 예측 모델의 성능을 훼손시킬 수 있습니다.
- 이상치는 시계열 데이터에서 진정한 추세와 주기적인 행동을 가리고 숨길 수 있습니다.
- 이상치를 철저히 검토하지 않은 데이터에 기반한 결정은 부적절한 전략적 결정으로 이어질 수 있습니다.

<div class="content-ad"></div>

시계열 데이터에서 이상 값 처리가 효과적인 분석에 중요한 이유가 더 많이 있지만, 이것들은 우리가 시작하기를 원하는 충분한 이유일 것입니다.

## Outliers vs Anomalies

"이상 값"과 "이상 값"이라는 용어를 번갈아 사용할 것이지만, 그들의 정의에는 미묘한 차이가 있습니다. 이상 값은 정상에서 벗어나는 모든 데이터 포인트를 가리킬 수 있지만, 이상 값은 특히 대부분의 데이터 포인트로부터 크게 벗어난 극단적인 값이라는 것을 명시적으로 나타냅니다. 많은 방법이 이상 값과 이상 값 모두에 적용될 수 있습니다.

# 시계열 데이터에 적합한 이상 값 탐지 방법을 선택하는 방법?

<div class="content-ad"></div>


![The Ultimate Guide to Finding Outliers in Your Time-Series Data Part 1](/assets/img/2024-05-27-TheUltimateGuidetoFindingOutliersinYourTime-SeriesDataPart1_1.png)

시계열 데이터의 이상 탐지 방법을 선택하기 위해서는 데이터셋과 예상되는 이상과 깊이 이해가 필요합니다.

그렇다면, 데이터셋의 크기와 사용 가능한 계산 리소스를 고려해보세요.

해석 가능성이 중요한 데이터셋의 경우 Z-Score와 이동 평균과 같은 간단한 방법이 이상적일 수 있습니다. 그러나 섬세한 패턴을 감지해야 하는 복잡한 시나리오와 같은 경우에는 LSTM 네트워크와 같은 고급 기법이 유용할 수 있습니다(이에 대한 자세한 내용은 이 시리즈의 두 번째 부분에서 다룰 예정이며, 상당한 데이터와 계산 능력이 필요합니다).


<div class="content-ad"></div>

## 기억하세요: 데이터셋 크기, 계산 자원, 해석 가능성, 그리고 작업의 성격은 적절한 이상점 탐지 방법을 선택하는 데 중요합니다.

정확한 성능 평가를 위해 다양한 방법과 지표를 실험해 보는 것이 유익할 수 있습니다. 가능하다면 정확도를 향상시키기 위해 여러 방법의 앙상블을 사용하는 것을 고려해보세요. 또한 분야에 대해 알고 있는 사학자나 전문가의 의견을 활용하여 방법을 선택할 수 있습니다.

사기 탐지와 같이 이상치가 드물지만 중요한 경우와 같이 이상치 탐지 방법을 평가하는 것은 특히 어려울 수 있습니다.

정밀도, 재현율, F1 점수와 같은 지표는 사기 활동을 포착하면서 거짓 양성을 줄이는 이러한 방법의 효과를 평가하는 데 중요합니다.

<div class="content-ad"></div>

예측 유지보수와 같은 맥락에서 ROC 곡선과 AUC 지표는 잠재적인 기계 고장을 적시에 식별하는 데 매우 유용합니다.

건강 관리와 같은 산업에서는 시각화가 환자의 중요 생리 신호를 모니터링하는 데 자주 사용되지만, 이러한 방법의 정확성은 올바른 해석을 위해 도메인 전문 지식에 매우 의존합니다.

# 단변량 vs 다변량 데이터

이상치 분석을 시작하기 전에 데이터가 단변량인지 다변량인지 고려하는 것이 중요합니다.

<div class="content-ad"></div>

단변량 시계열 데이터는 시간에 따라 기록된 단일 관측값 순서로 구성됩니다. 전형적인 예시로는 일일 주식 가격, 월간 판매 수치 또는 연간 기상 데이터가 있습니다.

![image](/assets/img/2024-05-27-TheUltimateGuidetoFindingOutliersinYourTime-SeriesDataPart1_2.png)

반면, 다변량 시계열 데이터는 동일한 시간 간격에서 관찰되고 기록된 여러 변수 또는 순서로 구성됩니다.

이 유형의 데이터는 서로 다른 변수 간의 관계 및 상호작용을 포착하며 개별적인 추세 및 계절적 변동도 포함합니다. 예를 들어, 다변량 시계열에는 온도, 습도 및 풍속의 일일 측정치가 동시에 기록된 것이 포함될 수 있습니다.

<div class="content-ad"></div>


![이미지](/assets/img/2024-05-27-TheUltimateGuidetoFindingOutliersinYourTime-SeriesDataPart1_3.png)

이 기사에서 설명된 몇 가지 방법은 일변량 데이터에 더 적합하며 다른 몇 가지는 여러 변수를 처리하는 데 특화되어 있습니다.

그러나 일부는 두 가지에 모두 적용할 수 있습니다. 방법에 깊이 들어가기 전에 두 종류의 데이터에 대한 일반적인 방법을 소개하겠습니다.

일변량 데이터에 대해 시계열 플롯 및 상자 그림과 같은 시각적 검사 방법이 일반적으로 사용되며 한 번에 한 변수에 초점을 맞춥니다. 또한 일변량 설정에서 STL 분해가 전통적으로 사용됩니다. Z-점수, 수정된 Z-점수 방법 및 Grubbs' 검정도 이 유형의 데이터에 사용됩니다.


<div class="content-ad"></div>

기계 학습 방법 중 Isolation Forest, LOF 및 Autoencoders와 같은 방법들은 일반적으로 다변량 데이터에서 차원 축소와 이상 탐지에 사용되지만, 단일 시계열 데이터를 압축하고 복원하여 재구성 오류를 기반으로 이상을 식별하는 데도 사용됩니다.

![이미지](/assets/img/2024-05-27-TheUltimateGuidetoFindingOutliersinYourTime-SeriesDataPart1_4.png)

팁: 이 정신 지도에 나열된 방법 이외에도 더 많은 이상치 탐지 방법이 있습니다.

여러 변수가 포함된 데이터의 경우 산점도 분석이 일반적으로 여러 변수 간의 관계를 조사하는 데 사용됩니다. Isolation Forests, LOF 및 Autoencoders는 고차원 데이터를 처리하는 데 자연스럽게 적합합니다.

<div class="content-ad"></div>

다중 변수 데이터에도 여러 가지 일변량 방법을 적용할 수 있습니다. 예를 들어, Z-점수 방법은 각 변수에 대해 독립적으로 Z-점수를 계산하여 다중 변수 상황에서도 사용할 수 있습니다.

상자 도표는 다차원 데이터셋 내 각 변수에 대해 별도로 사용될 수 있어 각 차원에서 이상치를 식별하는 데 도움이 됩니다. 다차원 시나리오에서는 산점도를 사용하여 변수 쌍을 플롯할 수 있습니다. STL 분해는 전통적으로 일변량이지만 각 시리즈를 독립적으로 분해하여 다중 변수 시리즈를 분석하는 데 적용할 수 있습니다.

# 데이터에서 이상치를 탐지하기 위한 최상의 방법은 무엇입니까?

# 시각적 방법

<div class="content-ad"></div>

시각 검사는 시계열 데이터에서 이상치를 식별하는 데 중요한 방법입니다. 데이터의 특성에 따라 시각적 검사를 어떻게 수행할지가 영향을 받습니다.

시계열 플롯

시계열 데이터에 대한 가장 간단한 플롯입니다. 시간 경향, 패턴, 계절 변동 및 잠재적 이상치를 시간에 따라 확인할 수 있습니다. 다른 데이터에서 크게 벗어난 지점은 종종 쉽게 발견할 수 있습니다.

```js
import matplotlib.pyplot as plt
import matplotlib.dates as mdates

def plot_temporal_trends(df, columns):

    num_plots = len(columns)
    fig, axes = plt.subplots(num_plots, 1, figsize=(10, num_plots * 3), sharex=False)  # sharex=False로 x축을 공유하지 않음
    fig.suptitle(f'시간 트렌드', fontsize=16, y=1.02 + 0.01 * num_plots)

    if num_plots == 1:  # axes가 반복 가능한지 확인
        axes = [axes]

    for ax, col in zip(axes, columns):
        ax.plot(df.index, df[col], marker='o', markersize=4, linestyle='-', label=col)
        ax.set_title(f'{col} - {title}')
        ax.set_ylabel('값')

        # 각 subplot의 x축에 대한 날짜 포매터 설정
        ax.xaxis.set_major_locator(mdates.YearLocator(base=2))
        ax.xaxis.set_major_formatter(mdates.DateFormatter('%Y'))

        # 틱 라벨을 더 잘 보이도록 회전 및 정렬
        ax.tick_params(axis='x', rotation=45)

        ax.legend()

    plt.tight_layout(rect=[0, 0, 1, 0.97])  # 제목을 위한 공간을 만들기 위해 레이아웃 조정
    plt.show()

columns = df.columns.tolist()
plot_temporal_trends(df, columns)
```

<div class="content-ad"></div>

<img src="/assets/img/2024-05-27-TheUltimateGuidetoFindingOutliersinYourTime-SeriesDataPart1_5.png" />

이상값을 발견할 수 있나요? 🤔 이 시각화는 이상값을 쉽게 드러낼 수도 있고, 데이터의 복잡성에 따라 더 자세한 분석이 필요할 수도 있습니다. 대부분의 경우, 추가 시각화가 필요할 수도 있습니다.

## 이상값 분석에서 계절 고려 사항

이상값을 계절별로 처리하는 것은 매우 중요할 수 있습니다, 특히 계절 변동을 나타내는 데이터를 다룰 때입니다. 많은 시계열 데이터 세트는 특정 시기에 명확한 패턴을 보여줍니다.

<div class="content-ad"></div>

사실 이상값으로 보였던 데이터 포인트가 계절에 따라 처리되면 이상값으로 간주되지 않을 수도 있습니다. 다시 말해 데이터와 문제의 성겁에 따라 다릅니다!

예를 들어, 저는 최근 댐에서의 수질 측정 데이터를 다루는 프로젝트에 참여했습니다. 여기서 이상값은 계절별로 분석해야 한다는 것이 빠르게 명확해졌습니다. 각 계절은 고유한 특성과 추세를 가지고 있으며, 이는 파라미터에 독특한 방식으로 영향을 미칩니다. 계절별로 데이터를 분할하여, 각 하위 그룹에 효과적인 특정 이상값 탐지 방법을 적용할 수 있었습니다.

예를 들어, 비가 많이 오는 계절의 수질 이상값은 유출 때문에 일반적일 수 있지만, 건조한 계절에는 비정상적일 수 있습니다.

게다가, 계절별 분석은 계절적 영향을 고려하여 예측 모델을 개선할 수 있습니다. 이것은 농업, 관광 및 소매업과 같은 계절적 변화에 크게 영향을 받는 산업에 중요할 수 있습니다.

<div class="content-ad"></div>

박스 플롯

데이터 집합이나 데이터 하위 집합에서 이상 징후를 정적으로 식별하는 데 유용합니다. 상자 외부의 점들(일반적으로 사분위수에서 1.5배의 사분위 범위로 설정)은 잠재적인 이상값입니다.

```js
def plot_outliers(param_dfs):
    for key, df in param_dfs.items():
        plt.figure(figsize=(10, 6))
        df.boxplot()
        plt.title(f'{key}의 박스 플롯')
        plt.xticks(rotation=45)
        plt.show()

# 이상값을 플롯하는 함수 호출
plot_outliers(param_dfs)
```

![Boxplot image](/assets/img/2024-05-27-TheUltimateGuidetoFindingOutliersinYourTime-SeriesDataPart1_6.png)

<div class="content-ad"></div>

상기 그림에서는 특정 매개변수를 다른 수심별로 분석하여 이들을 옆에 비교했습니다. 플롯 상의 작은 검은 원은 잠재적 이상점을 나타냅니다. 이러한 시각적 단서는 각 하위 집합 내에서 근본적으로 벗어난 데이터 포인트를 신속하게 식별하는 데 중요합니다.

산포도

시계열 데이터가 다른 변수와 관련이 있다면, 산포도는 두 변수의 맥락에서 이상점을 식별하는 데 도움이 될 수 있습니다.

```js
# 플로팅
plt.figure(figsize=(10, 6))
# 정상 데이터
plt.scatter(df['연간 소득'][:-5], df['신용카드 지출'][:-5], color='blue')
plt.title('연간 소득 대 신용카드 지출')
plt.xlabel('연간 소득 ($)')
plt.ylabel('신용카드 지출 ($)')
plt.legend()
plt.grid(True)
plt.show()
```

<div class="content-ad"></div>


<img src="/assets/img/2024-05-27-TheUltimateGuidetoFindingOutliersinYourTime-SeriesDataPart1_7.png" />

# 통계적 방법

## STL 분해

시계열 데이터는 추세, 계절성 및 잔류로 분할될 수 있다는 것을 이미 알고 계시다시피,


<div class="content-ad"></div>

STL 분해는 LOESS(Locally Estimated Scatterplot Smoothing)를 사용하여 시계열 신호를 이 세 가지 구분된 구성 요소로 효과적으로 분리하는 데 유용합니다. 이를 통해 데이터의 기본적인 행동에 대한 명확한 통찰력을 얻어 분석하고 예측할 수 있는 능력이 향상됩니다.

참고: STL은 데이터 포인트가 시간 순서대로 배열되어 있다고 가정합니다. STL 분해는 데이터 포인트들이 자연적인 시간 순서로 서로 뒤이어 따라 오는 시리즈를 예상합니다. 이는 추세 및 계절 변동을 정확하게 추정하기 위한 중요한 요소로, 각 포인트가 이어지는 포인트를 이해하는 데 기여합니다.

![이미지](/assets/img/2024-05-27-TheUltimateGuidetoFindingOutliersinYourTime-SeriesDataPart1_8.png)

STL은 이상치를 식별하는 데 어떻게 도움을 줄까요?

<div class="content-ad"></div>

STL 분해의 잔여 구성 요소는 계절성 및 추이 구성 요소로 설명할 수 없는 데이터 부분을 나타냅니다.

이상적으로는 잔여는 무작위 잡음이어야 합니다. 이상점은 종종 잔여 시리즈에서 일반적인 잡음 수준에서 현저하게 벗어나는 이상한 돌출이나 패딩으로 감지될 수 있습니다. 따라서 잔여에서 극단적인 값들을 찾아보세요. 잔여는 이상적으로 무작위 잡음을 나타내므로 어떠한 중요한 이탈도 이상점을 나타낼 수 있습니다.

잔여의 표준 편차를 분석하여 평균 잔여로부터 일반적으로 분류되는 이상한 거리에 있는 점들을 식별할 수 있습니다. 예를 들어, 평균 잔여에서 2 또는 3 표준 편차 이상 떨어진 데이터 포인트는 이상점으로 간주될 수 있습니다.

추이 구성 요소는 단기 변동을 완화시키고 데이터 집합의 폭넓은 움직임을 강조합니다. 이상점은 추이에 예상치 못한 변동이나 대부분의 데이터가 설정한 부드러운 패턴과 어울리지 않는 급격한 변화를 일으킬 수 있습니다.

<div class="content-ad"></div>

## 단계 1: 잔차 플롯 검토

먼저 STL 분해에서 얻은 잔차 플롯을 살펴봅니다. 이 플롯은 추세나 계절성 구성 요소로 설명할 수 없는 데이터 포인트를 보여줍니다.

## 단계 2: 통계 지표 계산

잔차의 평균과 표준 편차를 계산합니다. 이는 정규 분포된 잡음 패턴에서 기대하는 것과 유의미하게 다른 데이터 포인트를 결정하는 데 도움이 됩니다.

<div class="content-ad"></div>

## 단계 3: 이상치에 대한 임계값 정의

일반적으로, 평균으로부터 2 또는 3 표준 편차 이상 떨어진 데이터 포인트는 이상치로 간주됩니다. 이상치에 얼마나 민감하게 대응할지에 따라 임계값을 선택할 수 있습니다. 많은 경우, 3 표준 편차를 사용하는 것이 일반적입니다.

## 단계 4: 이상치 식별

잔차 구성 요소에서 이 임계값을 초과하는 데이터 포인트를 식별합니다. 이것들이 당신의 잠재적인 이상치입니다.

<div class="content-ad"></div>

## 단계 5: 시각적 검사 및 상호 확인

원래 시계열 플롯과 추세 및 계절성 구성 요소의 플롯을 다시 살펴보세요. 식별된 이상점이 이러한 구성 요소와 어떤 관련이 있는지 살펴보세요.

이상점이 단순히 유례 없는 변동이거나 오류 또는 이상 현상을 나타낼 가능성이 있는지 확인하세요. 이는 데이터에 대한 문맥적 지식을 포함할 수 있습니다.

```js
import numpy as np
#예시

# 잔차의 평균과 표준 편차 계산
residuals = result.resid
mean_resid = np.mean(residuals)
std_resid = np.std(residuals)

# 이상점 감지를 위한 임계값 정의
threshold = 3 * std_resid

# 잠재적인 이상점 식별
outliers = residuals[np.abs(residuals - mean_resid) > threshold]

# 이상점의 날짜 및 값 출력
print(outliers)
```

<div class="content-ad"></div>

Z-점수와 수정된 Z-점수 방법

Z-점수는 표준 점수로도 알려져 있으며, 데이터 포인트가 데이터 집합의 평균으로부터 몇 표준 편차 떨어져 있는지를 측정합니다. 이는 아래 공식을 사용하여 계산됩니다:


Z = (X - μ) / σ


- X는 개별 데이터 포인트를 나타냅니다.
- μ는 데이터 집합의 평균을 나타냅니다.
- σ는 데이터 집합의 표준 편차를 나타냅니다.

<div class="content-ad"></div>

일정 임계값(일반적으로 2 또는 3)보다 높은 Z-점수를 가진 데이터 포인트는 이상값으로 간주됩니다.

참고: Z-점수 방법은 데이터가 정규 분포를 따른다고 가정하거나 적어도 대략적으로 정규 분포를 따른다고 가정합니다. 또한, 특이값이 평균과 표준 편차에 비해 극단적인 값을 가질 것이라고 가정합니다.

```js
import numpy as np

def identify_outliers_with_z_score(df, z_thresh=z_thresh):
    print("Z-점수 방법을 사용하여 이상값 식별:")
    for col in df.columns:
        if np.issubdtype(df[col].dtype, np.number):  # 숫자 데이터만
            df_col = df[col].dropna()  # NaN 값 제거
            z_scores = np.abs((df_col - df_col.mean()) / df_col.std(ddof=0))
            outliers = df_col[z_scores > z_thresh]
            print(f"{col} - 이상값: {len(outliers)}")
            print(outliers, "\n")

z_thresh = 3
identify_outliers_with_z_score(df)
```

데이터 세트에서 이상값을 식별하기 위해 Z-점수 임계값을 선택하는 것은 데이터 분석 결과에 상당한 영향을 줄 수 있는 중요한 결정임을 기억해 주세요.

<div class="content-ad"></div>

아래는 일반 분포 하에서의 z-점수에 대한 설명입니다: z-점수 1은 곡선 아래 약 68%를, z-점수 2는 약 95%를, z-점수 3는 약 99.7%를 포함합니다.

만약 다양한 임계값을 사용하여 데이터의 이상치 개수를 궁금해 한다면, 그것을 플로팅하여 비교할 수도 있습니다:

```js
def count_outliers_by_z_threshold(series, z_thresholds=[1, 2, 3]):
    """주어진 Z-점수 임계값에 대해 이상치 개수를 반환합니다."""
    mean = series.mean()
    std = series.std()
    z_scores = np.abs((series - mean) / std)

    # 각 Z-점수 임계값에 대한 이상치 개수 계산
    counts = {}
    for z_thresh in z_thresholds:
        counts[z_thresh] = (z_scores > z_thresh).sum()
    return counts

# 'param_dfs'가 DataFrame의 딕셔너리인 것을 가정합니다
z_thresholds = [1, 2, 3]
outlier_counts_by_threshold = {z: 0 for z in z_thresholds}

for df in param_dfs.values():
    for column in df.columns:
        series = df[column].dropna()  # NaN 값 제거
        counts = count_outliers_by_z_threshold(series, z_thresholds)
        for z_thresh, count in counts.items():
            outlier_counts_by_threshold[z_thresh] += count

# 플로팅을 위해 이상치 개수를 리스트로 변환
counts = [outlier_counts_by_threshold[z] for z in z_thresholds]

# 플로팅
plt.figure(figsize=(8, 6))
bars = plt.bar(z_thresholds, counts, color=['blue', 'orange', 'green'])

plt.xlabel('Z-점수 임계값')
plt.ylabel('이상치 개수')
plt.title('Z-점수 임계값에 따른 이상치 수')
plt.xticks(z_thresholds)

# 각 막대에 높이 값으로 주석 달기
for bar in bars:
    yval = bar.get_height()
    plt.text(bar.get_x() + bar.get_width()/2, yval + 0.05 * max(counts), int(yval), ha='center', va='bottom')

plt.show()
```

<div class="content-ad"></div>


![image](/assets/img/2024-05-27-TheUltimateGuidetoFindingOutliersinYourTime-SeriesDataPart1_11.png)

시계열 데이터를 다루고 있기 때문에 연도별 이상치 분포를 시각화하는 것이 유용할 수 있습니다:

```js
df['Z-Score'] = zscore(df['Value'])

# Z-score가 3보다 크거나 -3보다 작은 경우를 이상치로 정의
df['Outlier'] = (df['Z-Score'] > 3) | (df['Z-Score'] < -3)

# 연도별 이상치 개수 계산
outlier_counts = df.resample('Y')['Outlier'].sum().astype(int)

# 연도를 별도 열로 얻기 위해 인덱스 재설정 및 플로팅 준비
outlier_counts = outlier_counts.reset_index()
outlier_counts['Year'] = outlier_counts['index'].dt.year
outlier_counts.drop('index', axis=1, inplace=True)

plt.figure(figsize=(10, 6))
colors = plt.cm.viridis(np.linspace(0, 1, len(outlier_counts)))
plt.bar(outlier_counts['Year'], outlier_counts['Outlier'], color=colors)
plt.title('Distribution of Outliers Per Year')
plt.xlabel('Year')
plt.ylabel('Number of Outliers')
plt.xticks(outlier_counts['Year'])  # 모든 연도가 표시되도록
plt.grid(True, which='both', linestyle='--', linewidth=0.5)
plt.show()
```

![image](/assets/img/2024-05-27-TheUltimateGuidetoFindingOutliersinYourTime-SeriesDataPart1_12.png)



<div class="content-ad"></div>

한 계절 당:

![image](/assets/img/2024-05-27-TheUltimateGuidetoFindingOutliersinYourTime-SeriesDataPart1_13.png)

Robust Z-Score

수정된 Z-점수 방법으로도 알려진 이 기술은 일반적인 Z-점수를 개선하기 위해 평균 대신 중앙값(M)을 사용합니다. 평균은 가장 신뢰할 수있는 통계적 측정 방법이 아니기 때문에 중앙값을 사용합니다. 또한 표준 편차 대신 중앙값의 절대 편차(MAD)를 사용합니다.

<div class="content-ad"></div>

![이미지](/assets/img/2024-05-27-TheUltimateGuidetoFindingOutliersinYourTime-SeriesDataPart1_14.png)

수정된 Z-점수 공식의 0.6745 배수는 중앙값 절대편차(MAD)를 표준 편차와 비교 가능하게 만들기 위해 사용됩니다.

이 조정이 필요한 이유는 정의에 따라 MAD가 동일한 데이터 집합에 대해 표준 편차보다 작기 때문입니다. 따라서 이런 스케일링을 고려하여 임계값을 조정해야 합니다.

참고: 중앙값과 MAD는 평균과 표준 편차보다 이상값에 강인한 특성을 가집니다. 때로는, 이 강인성으로 인해 MAD 값이 작아질 수 있으며, 특히 이상값이 극단적인 경우에 그렇습니다. 따라서, 가장 극단적인 관측치만 이상값으로 표시되도록 하기 위해 약간 더 높은 임계값이 필요할 수 있습니다 (문맥에 따라 3.5, 4 또는 5).

<div class="content-ad"></div>

```python
from scipy.stats import median_absolute_deviation

# 중앙값 및 중앙값 절대 편차(MAD)를 사용하여 수정된 Z-점수 계산
df['Median'] = df['Value'].median()
df['MAD'] = median_absolute_deviation(df['Value'])
df['Modified_Z-Score'] = 0.6745 * (df['Value'] - df['Median']) / df['MAD']

# 수정된 Z-점수가 3보다 크거나 -3보다 작은 경우 이상값으로 정의
df['Outlier'] = (df['Modified_Z-Score'] > 3.5) | (df['Modified_Z-Score'] < -3.5)

# 연도별 이상값 수 계산
outlier_counts = df.resample('Y')['Outlier'].sum().astype(int)

# 인덱스 재설정하여 연도를 별도의 열로 가져오고 플로팅을 위해 준비
outlier_counts = outlier_counts.reset_index()
outlier_counts['Year'] = outlier_counts['index'].dt.year
outlier_counts.drop('index', axis=1, inplace=True)

# 연도별 그래픽 플로팅
plt.figure(figsize=(10, 6))
colors = plt.cm.viridis(np.linspace(0, 1, len(outlier_counts)))
plt.bar(outlier_counts['Year'], outlier_counts['Outlier'], color=colors)
plt.title('연도별 이상값 분포')
plt.xlabel('연도')
plt.ylabel('이상값 수')
plt.xticks(outlier_counts['Year'])  # 모든 연도를 표시하도록 설정
plt.grid(True, which='both', linestyle='--', linewidth=0.5)
plt.show()
```

![이미지](/assets/img/2024-05-27-TheUltimateGuidetoFindingOutliersinYourTime-SeriesDataPart1_15.png)

## 통계 및 시각적 방법 통합

Z-점수 방법(임계값 3)으로 감지된 이상값을 시계열 도표로 시각화합시다.



<div class="content-ad"></div>

```js
#여기서 이상치는 사전입니다.
def plot_outliers(df, outliers_dict):
    #한 stage마다 이상치가 있는 column의 수만큼 subplot의 행 수가 됩니다.
    for stage, columns_outliers in outliers_dict.items():
        #플롯 수 결정
        num_plots = len(columns_outliers)
        if num_plots == 0:
            continue  # 이 stage에 이상치가 없으면 건너뜁니다.

        #서브플롯 만들기
        fig, axes = plt.subplots(nrows=num_plots, figsize=(15, num_plots * 5), sharex=True)
        fig.suptitle(f'{stage} Stage의 이상치 시각화', fontsize=16)

        if num_plots == 1:  # 플롯이 하나뿐이면 iterable로 만들기
            axes = [axes]

        for ax, (column, outliers) in zip(axes, columns_outliers.items()):
            #전체 데이터 시리즈 플롯
            ax.plot(df.index, df[column], label=f'{column} (전체 시리즈)', color='black', linestyle='-', marker='', alpha=0.5)

            #이상치 강조
            if not outliers.empty:
                ax.scatter(outliers.index, outliers, color='red', label='이상치', marker='o', s=50)

            ax.set_title(f'{column}의 이상치')
            ax.set_ylabel('값')
            ax.legend()

            #x축 주요 로케이터와 포매터 설정
            ax.xaxis.set_major_locator(mdates.YearLocator())
            ax.xaxis.set_major_formatter(mdates.DateFormatter('%Y'))
            plt.setp(ax.xaxis.get_majorticklabels(), rotation=45, ha='right')

        plt.tight_layout(rect=[0, 0, 1, 0.96])  # 레이아웃 조정
        plt.show()
```

![2024-05-27-TheUltimateGuidetoFindingOutliersinYourTime-SeriesDataPart1_16.png](/assets/img/2024-05-27-TheUltimateGuidetoFindingOutliersinYourTime-SeriesDataPart1_16.png)

Grubb의 Test

Grubb의 테스트, 최대 또는 최소값을 데이터셋의 평균 및 표준편차와 비교하여 잠재적인 이상치를 식별하는 최대 표준화 잔차 테스트로 알려져 있습니다.

<div class="content-ad"></div>

참고: 데이터가 1차원 정규 분포를 따르고 이상치는 평균과 표준편차에 비해 극단적인 값을 가질 것으로 가정합니다.

중요한 점은 그럽스 검정이 일반적으로 데이터 집합에서 최댓값 또는 최솟값 중 하나를 포함해 한 번에 한 데이터 포인트씩 수행됩니다.

![image](/assets/img/2024-05-27-TheUltimateGuidetoFindingOutliersinYourTime-SeriesDataPart1_17.png)

G는 그럽스 검정 통계량, X는 의심스러운 이상치 값(데이터 집합에서 최대값 또는 최소값), X(바로 위에 bar가 있는)는 데이터 집합의 평균이며, s는 데이터 집합의 표준 편차입니다.

<div class="content-ad"></div>

의심되는 이상값이 유의한지 여부를 결정하기 위해 계산된 검정 통계량 G를 적절한 통계 분포(일반적으로 T-분포)의 임계값과 비교합니다.

G가 임계값을 초과하는 경우, 의심되는 이상값은 통계적으로 유의하다고 간주되며, 이는 이상값일 가능성이 높음을 나타냅니다.

```js
from pyod.models.grubbs import grubbs_test

# PyOD를 사용하여 Grubbs' 테스트 적용
outliers_grubbs = []
for col in df.columns:
    outliers = grubbs_test(df[col])
    outliers_grubbs.extend([(idx, col) for idx in outliers])
print("Grubbs' 테스트에 의해 감지된 이상값:")
print(outliers_grubbs)
```

# 평가 메트릭

<div class="content-ad"></div>

저는 이에 대해 전체 블로그 글을 쓸 수도 있을 거예요.

하지만 간단히 하기 위해, 주요 평가 지표를 언급하며 몇 가지 예시를 드릴게요.

적절한 평가 지표를 선택하는 것은 시계열 분석에서 이상 탐지 방법의 효과를 평가하는 데 매우 중요한 요소에요.

## 최적의 지표는 데이터의 성격, 해당 이상값의 특성 및 거짓 긍정과 거짓 부정 사이에서 필요한 균형에 따라 다를 거예요.

<div class="content-ad"></div>

예시: 사기 탐지

사기 탐지에서 이상 징후는 드물지만 중요합니다. 여기서 핵심적인 지표는 정밀도, 재현율, 그리고 F1 점수입니다. 정밀도는 실제로 이상 징후인 것들 중에 몇 개를 올바르게 식별했는지 측정합니다. 재현율은 방법으로 올바르게 식별된 실제 이상 징후의 수를 측정합니다. F1 점수는 정밀도와 재현율을 균형 있게 고려해 방법의 성능을 종합적으로 평가하는 데 도움을 줍니다.

예시: 예측 유지보수

예측 유지보수에서는 이상을 적시에 식별하는 것이 중요합니다. 여기서 수신기 조작 특성 (ROC) 곡선과 곡선 아래 영역 (AUC)은 주요 지표입니다. 이러한 지표들은 참 양성 비율과 거짓 양성 비율 사이의 균형을 이해하는 데 도움을 줍니다. 이는 서로 다른 운영 요구 사항을 충족시키기 위해 감지 임계값을 최적화하는 데 중요합니다.

<div class="content-ad"></div>

예시: 의료

의료 분야에서 해석 가능성은 매우 중요하기 때문에 시각화 역시 매우 중요합니다. 이들은 전문가들이 감지된 이상 현상을 확인하고 의사 결정에 미치는 영향을 이해할 수 있도록 돕습니다. 도메인 지식을 통합함으로써, 이러한 시각 도구들은 결과물의 타당성과 해석 가능성을 향상시켜 미래에 적용 가능하고 중요한 이상 현상임을 보장합니다.

적절한 지표를 선택하는 것은 시계열 데이터에서 이상 현상을 효과적으로 감지하고 관리하는 데 상당한 영향을 미칠 수 있습니다.

이상 현상 관리에 어떤 지표를 선택해야 하는지 알아보았습니다.

지금까지입니다! 이 글이 마음에 든다면 반드시 클랩을 눌러주세요 😋. 비슷한 기사를 원하신다면 제 팔로우도 환영합니다!

<div class="content-ad"></div>

## 시계열 분석에서 주로 사용하는 통계적 방법은 무엇인가요?

## 그 밖에 어떤 방법을 알고 계신가요? 댓글로 알려주세요 :)

저는 물리학과 천문학 배경을 가진 데이터 과학자인 사라 노브레가입니다. 인공지능, MLOps, 스마트 시티, 지속가능성, 우주학, 그리고 인권에 관심이 많습니다.

참고 문헌

<div class="content-ad"></div>

시계열 데이터에서 이상 감지를 어떻게 수행하나요?
