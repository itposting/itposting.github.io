---
title: "이해할 수 있는 이상 탐지 Frequent Patterns Outlier Factor FPOF"
description: ""
coverImage: "/assets/img/2024-05-27-InterpretableOutlierDetectionFrequentPatternsOutlierFactorFPOF_0.png"
date: 2024-05-27 15:02
ogImage:
  url: /assets/img/2024-05-27-InterpretableOutlierDetectionFrequentPatternsOutlierFactorFPOF_0.png
tag: Tech
originalTitle: "Interpretable Outlier Detection: Frequent Patterns Outlier Factor (FPOF)"
link: "https://medium.com/towards-data-science/interpretable-outlier-detection-frequent-patterns-outlier-factor-fpof-0d9cbf51b17a"
---

## 범주형 데이터를 지원하며 이상치를 감지하고, 이상치에 대한 설명을 제공하는 감지 방법

이상치 탐지는 기계 학습에서 흔한 작업입니다. 구체적으로, 이는 지도 레이블이 없는 데이터를 분석하는 비지도학습의 한 형태입니다. 데이터 집합에서 다른 항목에 비해 이례적인 항목을 찾는 작업입니다.

데이터에서 이상치를 식별하려는 이유는 여러 가지가 있을 수 있습니다. 분석 중인 데이터가 회계 기록이고 오류 또는 사기를 찾고자 한다면, 데이터에는 수동으로 각 거래를 검토하기에는 너무 많은 거래가 포함되어 있어서 소수의 거래를 조사해야 합니다. 가장 이상한 레코드를 찾아 이를 조사하는 것이 좋은 시작점일 수 있습니다. 이는 오류와 사기가 모두 드물어서 이상치로 드러날 것이라는 생각으로 이루어진 것입니다.

다시 말하지만, 모든 이상치가 흥미로운 것은 아니지만, 오류와 사기는 아마도 이상치가 될 가능성이 있으므로 이를 찾을 때 이상치를 식별하는 것은 매우 실용적인 기술일 수 있습니다.

<div class="content-ad"></div>

또는 데이터에는 신용 카드 거래, 센서 읽기, 기상 측정, 생물학적 데이터 또는 웹 사이트 로그가 포함될 수 있습니다. 모든 경우에, 오류나 다른 문제를 시사하는 레코드를 식별하는 것이 유용할 수 있으며, 가장 흥미로운 레코드를 찾는 것도 도움이 될 수 있습니다.

또한 이상값 탐지는 비즈니스나 과학적 발견의 일부로 사용되어 데이터와 데이터에 설명된 프로세스를 더 잘 이해하는 데 도움이 될 수 있습니다. 과학적 데이터의 경우, 가장 이례적인 레코드를 찾는 것이 종종 가장 과학적으로 흥미로울 수 있습니다.

## 이상값 탐지에서 해석 가능성의 필요성

분류 및 회귀 문제의 경우 해석 가능한 모델을 사용하는 것이 종종 바람직합니다. 이는 정확도가 낮아질 수 있지만(탭화면 데이터의 경우 가장 높은 정확도는 일반적으로 해석하기 어려운 부스트 모델에서 얻어집니다), 안전성이 높아집니다. 우리는 모델이 보지 못한 데이터를 어떻게 다루게 될지 알고 있습니다. 그러나 분류 및 회귀 문제의 경우에는 개별 예측이 이루어지는 이유를 이해할 필요가 없는 경우도 흔합니다. 모델이 상당히 정확하다면, 모델이 예측을 만들도록만 하는 것만으로 충분할 수도 있습니다.

<div class="content-ad"></div>

이상치 탐지를 수행하면 해석 가능성이 훨씬 더 높아집니다. 이상치 탐지기가 레코드를 매우 이상하다고 예측하는 경우, 왜 이렇게 예측되었는지 명확하지 않으면 해당 항목을 처리하는 방법을 알 수 없을 수도 있고, 그것이 이상할 수도 있는지 여부조차 알 수 없습니다.

사실, 상황에 따라 이상치 탐지를 수행해도, 왜 이상치로 표시된 항목이 표시되었는지를 잘 이해하지 못하면 그 가치가 제한될 수 있습니다. 신용 카드 거래 데이터 세트를 확인하는 경우 이상치 탐지 루틴이 매우 이례적인 것으로 보이는 일련의 구매를 식별하고, 따라서 의심스럽다고 식별할 경우, 이것들을 효과적으로 조사할 수 있는 방법은 무엇인지 알고 있어야만 합니다. 경우에 따라 이것이 명백하거나, 시간을 들여 조사한 후에 분명해질 수도 있지만, 발견된 시점에서 이상 점의 특성이 명확하다면 훨씬 효율적입니다.

분류 및 회귀와 마찬가지로 해석 가능성이 불가능한 경우, 사후 해설이라고 하는 것을 사용하여 예측을 이해하려는 시도를 하는 것이 종종 가능합니다. Feature importances, proxy models, ALE plots 등을 사용하는 XAI(Explainable AI) 기법을 사용합니다. 이들은 아주 유용하며 앞으로의 기사에서도 다룰 것입니다. 그러나, 처음부터 결과가 명확한 것의 장점도 아주 큽니다.

이 기사에서는 특히 표 형식의 데이터에 초점을 맞추지만, 이후의 기사에서 다른 형식을 살펴볼 것입니다. 오늘날 흔히 사용되는 탭 데이터를위한 이상치 검출 알고리즘 중에는 Isolation Forests, Local Outlier Factor (LOF), KNNs, One-Class SVM 등 여러 가지가 있습니다. 이들은 종종 매우 잘 작동하지만, 불행히도 대부분의 경우 이상치를 찾은 이유에 대한 설명을 제공하지 않습니다.

<div class="content-ad"></div>

대부분의 이상치 탐지 방법은 알고리즘 수준에서 이해하기 쉽지만, 그래도 어떤 레코드가 탐지기에 의해 높은 점수를 받았고 다른 레코드가 그렇지 않았는지를 결정하는 것은 어렵습니다. 예를 들어 금융 거래 데이터 세트를 Isolation Forest와 같은 방법으로 처리하면 가장 이롭은 레코드를 볼 수 있지만, 특히 테이블에 많은 특성이 있는 경우, 이상치가 드문 조합의 다중 특성을 포함하거나 이상치가 특성이 높지만 다중 특성이 다소 이상한 경우에는 왜 그런지 이해하는 것이 어려울 수 있습니다.

## FPOF(Frequent Patterns Outlier Factor)

지금은 최소한 빠르게라도 이상치 탐지와 해석에 대해 살펴보았습니다. 이 기사의 나머지는 저의 책인 파이썬에서의 이상치 탐지(https://www.manning.com/books/outlier-detection-in-python)에서 다루는 FPOF에 대한 발췌문입니다.

FPOF(FP-outlier: Frequent pattern based outlier detection)은 이상치 탐지에 어느 정도의 해석 가능성을 제공할 수 있는 소수의 탐지기 중 하나이며, 이상치 탐지에서 더 많이 사용되어야 할 가치가 있습니다.

<div class="content-ad"></div>

카테고리 데이터와 함께 작동하도록 설계된 매력적인 속성을 갖고 있습니다. 대부분의 현실 세계의 표 데이터는 숫자 및 범주형 열을 모두 포함하는 혼합된 형태입니다. 그러나 대부분의 검출기는 모든 열이 숫자인 것으로 가정하며, 모든 범주형 열을 숫자로 인코딩해야 합니다(원핫, 서수 또는 다른 인코딩을 사용하여).

FPOF와 같은 검출기가 데이터가 범주형이라고 가정하는 경우, 우리는 반대의 문제를 겪습니다: 모든 숫자 특성은 범주형 형식으로 변환되어야 합니다. 둘 중 어느 것이라도 사용 가능하지만, 데이터가 주로 범주형인 경우 FPOF와 같은 검출기를 사용할 수 있는 것이 편리합니다.

그리고 이상 탐지를 수행할 때 일부 숫자 검출기와 일부 범주형 검출기를 함께 사용할 때 혜택이 있습니다. 불행히도, 비교적 적은 수의 범주형 검출기가 있기 때문에 FPOF는 이런 면에서도 유용하며, 해석력이 필요하지 않은 경우에도 유용합니다.

## FPOF 알고리즘

<div class="content-ad"></div>

FPOF는 테이블에서 빈발 아이템 세트(Frequent Item Sets, FISs)를 식별하여 작동합니다. 이것들은 하나의 특성에서 매우 흔한 값이거나 함께 자주 나타나는 여러 열에 걸친 값의 세트일 수 있습니다.

거의 모든 테이블에는 상당수의 FIS가 포함되어 있습니다. 단일 값에 기초한 FIS는 한 열의 일부 값이 다른 값보다 매우 흔하기 때문에 항상 발생하며, 이는 거의 항상 사실입니다. 그리고 여러 열에 걸친 FIS는 열 사이에 연관성이 있을 때 발생합니다: 특정 값(또는 숫자 값의 범위)이 다른 열에서 다른 값(또는 다시 말해 숫자 값의 범위)과 연관이 있을 때 발생합니다.

FPOF는 데이터셋에 많은 빈발 아이템 세트를 포함하고 있다는 아이디어에 기반을 두고 있습니다(거의 모든 데이터셋이 해당됩니다). 그러므로 대부분의 행에는 여러 빈발 아이템 세트가 포함되며, 정상 레코드에는 이상 값(이상치) 행보다 훨씬 더 빈발한 아이템 세트가 포함됩니다. 이를 활용하여 대부분의 행보다 훨씬 적고 훨씬 덜 빈발한 FIS를 포함하는 행을 이상치로 식별할 수 있습니다.

## 실제 데이터 예시

<div class="content-ad"></div>

실제로 FPOF를 사용하는 실제 예제를 살펴보면 OpenML의 SpeedDating 세트를 살펴봅니다 (https://www.openml.org/search?type=data&sort=nr_of_likes&status=active&id=40536, CC BY 4.0 DEED 라이선스).

FPOF를 실행하는 것은 먼저 데이터 집합에서 FIS를 채굴하는 것으로 시작합니다. 이를 지원하기 위해 Python에서 사용할 수 있는 여러 라이브러리가 있습니다. 이 예제에서는 머신러닝을 위한 범용 라이브러리 인 mlxtend (https://rasbt.github.io/mlxtend/)를 사용합니다. 빈발 항목 집합을 식별하는 여러 알고리즘을 제공하며, 여기서는 apriori라는 알고리즘을 사용합니다.

먼저 OpenML에서 데이터를 수집합니다. 보통 범주형 및 (binned) 숫자형 특성을 모두 사용할 것이지만, 여기서는 간단하게 일부 특성만 사용할 것입니다.

언급했듯이 FPOF는 숫자형 특성의 binning을 필요로 합니다. 일반적으로 각 숫자 열에 대해 작은 수의 (5에서 20개 정도) 폭이 동일한 bin을 사용합니다. 이를 위해 pandas의 cut() 메서드가 편리합니다. 이 예제는 더 간단합니다. 여기서는 범주형 열만 다룹니다.

<div class="content-ad"></div>

```python
from mlxtend.frequent_patterns import apriori
import pandas as pd
from sklearn.datasets import fetch_openml
import warnings

warnings.filterwarnings(action='ignore', category=DeprecationWarning)

data = fetch_openml('SpeedDating', version=1, parser='auto')
data_df = pd.DataFrame(data.data, columns=data.feature_names)

data_df = data_df[['d_pref_o_attractive', 'd_pref_o_sincere',
                   'd_pref_o_intelligence', 'd_pref_o_funny',
                   'd_pref_o_ambitious', 'd_pref_o_shared_interests']]
data_df = pd.get_dummies(data_df)
for col_name in data_df.columns:
    data_df[col_name] = data_df[col_name].map({0: False, 1: True})

frequent_itemsets = apriori(data_df, min_support=0.3, use_colnames=True)

data_df['FPOF_Score'] = 0

for fis_idx in frequent_itemsets.index:
    fis = frequent_itemsets.loc[fis_idx, 'itemsets']
    support = frequent_itemsets.loc[fis_idx, 'support']
    col_list = (list(fis))
    cond = True
    for col_name in col_list:
        cond = cond & (data_df[col_name])

    data_df.loc[data_df[cond].index, 'FPOF_Score'] += support

min_score = data_df['FPOF_Score'].min()
max_score = data_df['FPOF_Score'].max()
data_df['FPOF_Score'] = [(max_score - x) / (max_score - min_score)
                         for x in data_df['FPOF_Score']]
```

아프리오리 알고리즘은 모든 기능이 원-핫 인코딩되어 있어야합니다. 이를 위해 판다의 get_dummies() 메서드를 사용합니다.

그런 다음 apriori 메서드를 호출하여 빈번한 항목 집합을 결정합니다. 이를 수행하기 위해 FIS가 나타나는 행의 최소 분수 인 최소 지원을 지정해야합니다. 이 값을 너무 높게 설정하면 강한 이상값도 FIS를 포함 시키지 않으며 FIS가 적게 포함 된 레코드를 어렵게 구별하게됩니다. 그리고 이 값을 너무 낮게 설정하면 FIS가 의미없을 수 있으며 이상값도 이니셜과 동일한 수의 FIS를 포함 할 수 있습니다. 낮은 최소 지원으로 apriori를 사용하면 매우 많은 수의 FIS를 생성 할 수 있으며 실행 속도가 느려지고 해석 가능성이 낮아질 수 있습니다. 이 예에서는 0.3을 사용합니다.

FIS의 크기에 제한을 둘 수도 있고 때로는 그렇게합니다. 최소 및 최대 열 수 사이에 관련되도록 요구하는 여러 항목 집합의 크기에 제한을 둘 수 있으며 가장 관심 있는 이상값의 형태를 좁히는 데 도움이 될 수 있습니다.



<div class="content-ad"></div>

빈도가 높은 항목 집합은 지원과 열 값을 나타내는 팬더 데이터프레임에서 반환됩니다. 이 값은 원-핫 인코딩된 열 형식으로 표시되며 원본 열과 값을 나타냅니다.

결과를 해석하기 위해 먼저 자주 등장하는 항목 집합(frequent_itemsets)을 확인할 수 있습니다. 각 FIS의 길이를 포함하려면:

```js
frequent_itemsets['length'] = \
    frequent_itemsets['itemsets'].apply(lambda x: len(x))
```

총 24개의 FIS가 발견되었으며, 가장 긴 것은 세 가지 특징을 포함하고 있습니다. 다음 표는 지원에 따라 정렬된 처음 열 개의 행을 표시합니다.

<div class="content-ad"></div>


![image](/assets/img/2024-05-27-InterpretableOutlierDetectionFrequentPatternsOutlierFactorFPOF_0.png)

그런 다음 각 빈번한 항목 집합을 루프하고 지원하는 빈번한 항목 집합을 포함하는 각 행에 대해 점수를 증가시킵니다. 이는 선택적으로 길이가 더 큰 빈번한 항목 집합을 선호하도록 조정할 수 있습니다(예를 들어, 지원이 0.4이고 5개 열을 포함하는 FIS는, 그 외의 조건이 동일한 경우, 2개 열을 포함하는 지원이 0.4인 FIS보다 관련성이 더 높습니다), 하지만 여기서는 각 행의 FIS 수 및 지원을 간단히 사용합니다.

실제로 이것은 정상성에 대한 점수를 생성하고 이상값이 아닙니다. 따라서 점수를 0.0과 1.0 사이로 정규화할 때 순서를 뒤집습니다. 이제 가장 높은 점수를 가진 행이 가장 강한 이상값입니다: 가장 적고 가장 일반적인 빈번한 항목 집합을 가진 행입니다.

원래 데이터프레임에 점수 열을 추가하고 점수별로 정렬하면 가장 정상적인 행을 확인할 수 있습니다:


<div class="content-ad"></div>


![이미지](/assets/img/2024-05-27-InterpretableOutlierDetectionFrequentPatternsOutlierFactorFPOF_1.png)

이 행의 값들이 FISs와 잘 일치하는 것을 볼 수 있습니다. d_pref_o_attractive의 값은 [21-100]이며 이는 FIS(지원 0.36)와 일치합니다. d_pref_o_ambitious와 d_pref_o_shared_interests의 값은 각각 [0-15]로, 이 또한 FIS(지원 0.59)와 일치합니다. 다른 값들도 대부분 FIS들과 일치합니다.

가장 이상한 행은 다음과 같이 표시됩니다. 이는 식별된 FIS들과 일치하지 않습니다.

![이미지](/assets/img/2024-05-27-InterpretableOutlierDetectionFrequentPatternsOutlierFactorFPOF_2.png)


<div class="content-ad"></div>

자주 나오는 항목 집합 자체가 꽤 이해하기 쉬우므로,이 방법은 상당히 해석 가능한 결과를 얻는 장점이 있습니다. 다만, 자주 나오는 항목 집합이 많이 사용되는 경우에는 이러한 장점이 적을 수 있습니다.

![image](/assets/img/2024-05-27-InterpretableOutlierDetectionFrequentPatternsOutlierFactorFPOF_3.png)

해석력은 향상될 수 있지만, 이상치는 "포함하지 않는다"는 방식으로 식별되기 때문에, 각 이상치의 점수를 설명하는 것은 해당 이상치에 포함되지 않는 모든 항목 집합을 나열하는 것을 의미합니다. 그러나 각 이상치를 설명하기 위해 모든 누락된 항목 집합을 나열하는 것이 반드시 필요한 것은 아닙니다. 누락된 가장 일반적인 항목 집합을 나열하는 것은 대부분의 목적에 충분할 것입니다. 행에 나타나는 항목 집합과 있는 항목 집합의 통계와 빈도를 비교하는 것은 좋은 컨텍스트를 제공합니다.

이 방법의 변형 중 하나는 자주 나오는 것이 아닌 드문 항목 집합을 사용하는 것인데, 각 행의 드문 항목 집합의 수와 희귀성에 따라 각 행을 점수 매깁니다. 이 방법도 유용한 결과를 얻을 수 있지만, 계산 비용이 상당히 많이 소요되며, 더 많은 항목 집합이 채굴되어야 하고, 각 행은 많은 항목 집합과 테스트되어야 합니다. 그러나 최종 점수는 각 행에 누락된 대신 발견된 항목 집합을 기반으로 하므로 더 해석하기 쉬울 수 있습니다.

<div class="content-ad"></div>

## 결론

여기에 나와 있는 코드 외에는 파이썬에서 FPOF를 구현한 것을 알지 못합니다. 그러나 R에서는 구현된 것이 있습니다. FPOF 작업의 주요 부분은 FISs를 채굴하는 것이며, 여기에서 사용된 mlxtend 라이브러리를 포함하여 이를 수행할 수 있는 다양한 파이썬 도구가 있습니다. 위에서 본 FPOP의 나머지 코드는 꽤 간단합니다.

이상 탐지에서 해석 가능성의 중요성을 고려할 때, FPOF는 매우 유용할 수 있습니다.

향후 기사에서는 이상 탐지를 위한 다른 해석 가능한 방법에 대해 알아볼 것입니다.

<div class="content-ad"></div>

모든 그림은 저자에 의해 생성되었습니다.
