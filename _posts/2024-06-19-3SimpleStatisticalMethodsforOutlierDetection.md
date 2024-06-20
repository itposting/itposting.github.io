---
title: "이상치 탐지를 위한 3가지 간단한 통계적 방법"
description: ""
coverImage: "/assets/img/2024-06-19-3SimpleStatisticalMethodsforOutlierDetection_0.png"
date: 2024-06-19 20:07
ogImage: 
  url: /assets/img/2024-06-19-3SimpleStatisticalMethodsforOutlierDetection_0.png
tag: Tech
originalTitle: "3 Simple Statistical Methods for Outlier Detection"
link: "https://medium.com/towards-data-science/3-simple-statistical-methods-for-outlier-detection-db762e86cd9d"
---


<img src="/assets/img/2024-06-19-3SimpleStatisticalMethodsforOutlierDetection_0.png" />

데이터 과학자의 일 중 중요한 부분은 데이터를 정제하고 전처리하는 것입니다. 이 과정 중 하나인 이상치 탐지와 제거는 매우 중요합니다. 대규모의 이상치, 급증, 그리고 나쁜 데이터는 정확한 기계 학습 모델을 학습하는 데 방해가 될 수 있기 때문에, 이상치를 적절하게 처리하는 것이 중요합니다.

하지만 데이터 과학자들이 항상 이상치를 식별하기 위해 격리 숲 또는 국소 이상치 요소처럼 기계 학습 모델을 사용하는 것은 아닙니다. 제 데이터 과학 경력에서 배운 한 가지는 간단한 해결 방법이 효과적이면 그것을 사용해야 한다는 것입니다.

이번에는 대부분의 시간에 잘 동작하는 이상치를 탐지하는 데 유용한 3가지 간단한 통계적 솔루션을 제공하고자 합니다. 또한 이를 Python에서 어떻게 수행하는지도 보여드릴 것입니다.

<div class="content-ad"></div>

# 1. Z 점수

Z 점수는 표준 점수로도 알려져 있으며, 특이값을 감지하는 데 사용되는 잘 알려진 방법 중 하나입니다. 기본적으로 어떤 데이터 포인트가 평균에서 몇 개의 표준 편차만큼 떨어져 있는지를 나타냅니다.

어떤 데이터셋의 특정 데이터 포인트의 Z 점수는 다음과 같이 계산됩니다:

![](/assets/img/2024-06-19-3SimpleStatisticalMethodsforOutlierDetection_1.png)

<div class="content-ad"></div>

어디서:

- Z는 Z 점수 값입니다.
- x는 데이터 포인트입니다.
- μ는 데이터 집합의 평균입니다.
- σ는 표준 편차입니다.

따라서 Z 점수가 4인 경우 데이터 포인트가 평균보다 4 표준 편차 위에 있음을 의미합니다. Z 점수가 -4인 경우에는 평균보다 4 표준 편차 아래에 있습니다.

Z 점수의 경우, 일반적으로 3 이상 또는 -3 미만의 값은 이상치로 간주됩니다. 그러나이 기준은 유연하며 프로그래머에 따라 조정할 수 있습니다.

<div class="content-ad"></div>

아래와 같이 Python과 scipy.stats 패키지를 사용하여 데이터프레임 열의 각 값의 z 점수를 계산하는 간단한 방법이 있어요:

```python
from scipy import stats

df["z_score"] = stats.zscore(df["column_of_interest"])
```

데이터셋의 각 값에 대한 z 점수를 얻은 후에는 이상값을 걸러낼 수 있어요:

```python
df_clean = df[(df["z_score"] <= 3) & (df["z_score"] >= -3)]
```

<div class="content-ad"></div>

z 점수의 단점 중 하나는 이상치 탐지 방법임에도 불구하고 이상치에 민감하다는 것입니다. 데이터 세트에 매우 큰 이상치가 있는 경우 평균을 왜곡할 수 있습니다 (평균은 이상치에 민감하기 때문입니다). 평균이 왜곡되면 더 작지만 여전히 관련 있는 이상치를 잡지 못할 수 있습니다.

## 2. IQR

IQR (사분위 범위)는 평균 대신 중앙값을 기준점으로 사용하기 때문에 z 점수보다 견고합니다.

![이미지](/assets/img/2024-06-19-3SimpleStatisticalMethodsforOutlierDetection_2.png)

<div class="content-ad"></div>

이제 IQR 값을 구했으니, 다른 점들이 이상값인지 판별하는 기준점으로 사용될 것입니다. Q1 값보다 1.5 * IQR 이상 또는 Q3 값보다 1.5 * IQR 이하인 모든 점은 이상치로 간주됩니다.

이 경우, 46.5(27 + 13 * 1.5)보다 큰 값 또는 -5.5(14 - 13 * 1.5)보다 작은 값은 이상치로 간주됩니다.

파이썬에서 numpy의 percentile 및 scipy stats의 IQR 함수를 사용하여 이를 계산하는 방법은 다음과 같습니다:

```python
from scipy.stats import iqr
import numpy as np

# 데이터의 IQR 구하기
iqr_data = iqr(df["column_of_interest"])
# 범위를 벗어나는 값을 얻기 위한 참조점 계산 (1.5 * IQR)
iqr_lim = 1.5 * iqr_data

# 상위 (Q3 또는 75번째 백분위수)와 하위사분위 (Q1 또는 25번째 백분위수) 계산
q1 = np.percentile(df["column_of_interest"], 25)
q3 = np.percentile(df["column_of_interest"], 75)

# 사분위수와 IQR*1.5를 사용하여 상한선과 하한선 결정
상한선 = q3 + iqr_lim
하한선 = q1 - iqr_lim

# 상한선보다 작거나 하한선보다 큰 값은 이상치로 간주하고 제거
df_clean_iqr = df[(df["column_of_interest"] >= lower_limit) 
& (df["column_of_interest"] <= upper_limit)]
```

<div class="content-ad"></div>

위에서 볼 수 있듯이 데이터 세트의 IQR을 계산하려면 z 점수보다 몇 가지 더 많은 단계/코드 줄이 필요합니다. 또한 각 데이터 포인트에 대한 가시적인 "점수"를 얻지 못하므로 얼마나 이상하게 큰지를 나타내지 않습니다. 여기서는 어떤 것이 범위를 벗어났는지 여부만을 알 수 있습니다.

그러나 중앙값을 사용하기 때문에 평균보다 쉽게 왜곡되지 않아서 데이터 세트의 이상치에 덜 민감합니다.

# 3. 수정된 z 점수

수정된 z 점수는 z 점수와 IQR의 측면을 모두 고려하여 표준 z 점수의 더 견고한 버전을 만듭니다. 데이터 점이 얼마나 "멀리 떨어져" 있는지를 대략적으로 알려주는 점수를 제공하면서도 이상치에 민감하지 않습니다.

<div class="content-ad"></div>

z 점수와 수정된 z 점수의 주요 차이점은 수정된 z 점수가 평균 대신 중앙값을 기준점으로 사용한다는 것입니다. 표준 편차가 평균과 직접적으로 관련되어 있기 때문에, 수정된 z 점수는 정확한 표준 편차를 측정하지 않습니다. 그러나 중위수 절대 편차(MAD)를 사용하여 표준 편차를 근사하려고 합니다.

![image](/assets/img/2024-06-19-3SimpleStatisticalMethodsforOutlierDetection_3.png)

여기서,

- 0.6745는 표준 편차의 중위수에 해당하는 값을 근사화하는 데 사용되는 상수입니다.
- xi는 조사하는 데이터 포인트입니다.
- x͂는 데이터셋의 중앙값입니다.
- MAD는 데이터셋의 중위수 절대 편차입니다.

<div class="content-ad"></div>

중앙값 절대 편차를 계산하려면 데이터 세트의 중앙값에서 각 데이터 포인트를 빼면 됩니다. 이 뺄셈의 절대값을 취하세요. 마지막으로, 이러한 절대 차이의 중앙값을 취하면 됩니다.

일반적으로 수정된 z 점수에서는 점수가 ` 3.5 또는 `-3.5 인 값이 이상치로 간주됩니다.

수정된 z 점수의 계산 방법과 Python에서의 실제 예제에 대한 더 자세한 정보가 필요하시면 수정된 z 점수에 관한 제 글을 참조해주세요:

Python에서 수정된 z 점수를 구현하는 방법은 다음과 같습니다:

<div class="content-ad"></div>

```js
# 이 함수는 값을 취하고 데이터 집합을 취하여 하나의 값을 위한 수정된 z 점수를 반환합니다.
def compute_mod_z_score(value,df):
    # 데이터 집합의 MAD(흑백절대편차) 계산 (관심 있는 열)
    med_abs_dev = (np.abs(df["column_of_interest"] - 
                  df["column_of_interest"].median())).median()
    const = 0.6745
    mod_z = (const * (value - df["column_of_interest"].median()) 
            / med_abs_dev)
    return mod_z

# 위의 함수를 전체 열에 적용하여 수정된 Z 점수를 모든 데이터 점에 대해 얻습니다.
df["mod_zscore"]=df["column_of_interest"].apply(compute_mod_z_score,df=df)
```

수정된 Z 점수의 주요 단점은 덜 알려져 있으며 MAD와 같은 변수를 사용하기 때문에 설명하기가 조금 더 복잡하고 어려울 수 있다는 것입니다. 또한 저는 아는 한 Python 라이브러리 중에 수정된 Z 점수를 계산하는 것이 없습니다.

# 결론

보시다시피, 이상치 탐지의 각 통계적 방법마다 이점과 단점이 있습니다. 제가 일하는 곳에서는 이를 모두 사용했지만 다른 데이터 집합과 사용 사례에 대해 사용했습니다. 데이터를 탐색하여 문제에 접근하는 방법을 알아야 한다는 점의 중요성을 강조할 수 없습니다.


<div class="content-ad"></div>

만약 데이터셋이 급격한 변동이 있는 경우에는 수정된 z 점수나 IQR이 가장 적합할 수 있습니다. 가장 간단하고 설명하기 쉬운 해결책을 찾고 있다면 z 점수 / 표준 점수를 선택하는 것이 좋습니다. 

언제나 여러분만의 테스트를 실행하고 다른 데이터 과학자들이나 결과에 혜택을 받을 수 있는 관련 이해당사자들과 상의하는 것이 중요합니다.

# 읽어주셔서 감사합니다