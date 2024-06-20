---
title: "소형 머신 러닝 - 주성분 분석"
description: ""
coverImage: "/assets/img/2024-06-20-TinyMLPrincipalComponentAnalysis_0.png"
date: 2024-06-20 17:00
ogImage: 
  url: /assets/img/2024-06-20-TinyMLPrincipalComponentAnalysis_0.png
tag: Tech
originalTitle: "TinyML — Principal Component Analysis"
link: "https://medium.com/@thommaskevin/tinyml-principal-component-analysis-pca-5379d0874592"
---


From mathematical foundations to edge implementation

# 소셜 미디어:

👨🏽‍💻 Github: thommaskevin/TinyML (github.com)
👷🏾 Linkedin: Thommas Kevin | LinkedIn
📽 Youtube: Thommas Kevin — YouTube
👨🏻‍🏫 Research group: Conecta.ai (ufrn.br)

![image](/assets/img/2024-06-20-TinyMLPrincipalComponentAnalysis_0.png)

<div class="content-ad"></div>

# 1 — PCA 알고리즘 이론

주성분 분석 (PCA)은 데이터 분석에서 널리 사용되는 강력한 기술로, 데이터 세트의 차원을 줄이면서 중요한 정보를 유지하는 데 특히 유용합니다. 이는 원래 변수를 주성분이라고 불리는 새로운, 상관관계가 없는 변수 세트로 변환하여 달성됩니다. PCA의 주요 측면을 자세히 살펴봅시다:

- 차원 축소: PCA는 고차원 데이터 세트를 처리하는 데 중요합니다. 중요한 정보를 추출하고 관련성이 낮은 특징을 제거하여 분석 프로세스를 단순화합니다.
- 데이터 탐색 및 시각화: PCA는 데이터 탐색 및 시각화에 중요한 역할을 합니다. 숨겨진 패턴과 통찰을 찾아내는 데 기여합니다.
- 선형 변환: PCA는 데이터의 선형 변환을 수행하며, 분산의 방향을 식별하는 데 목적을 두고 있습니다. 이를 통해 데이터 세트의 더 간결한 표현이 가능해집니다.
- 특성 선택: 주성분은 설명하는 분산에 기반하여 순위가 매겨집니다. 이 순위는 데이터의 가장 중요한 측면을 강조하는 효과적인 특성 선택을 용이하게 합니다.
- 데이터 압축: PCA는 데이터를 압축하는 데 뛰어납니다. 큰 데이터 세트의 효율적인 저장 및 처리를 위해 원본 정보의 상당 부분을 유지합니다.
- 클러스터링 및 분류: PCA는 클러스터링 및 분류 작업에서 실용적으로 활용됩니다. 잡음을 줄이고 기존 구조를 강조함으로써 알고리즘의 성능을 향상시킵니다.

## 1.1 — 데이터 적합성

<div class="content-ad"></div>

"Adequacy of Data" 또는 "Data Suitability"는 일반적으로 사용 가능한 데이터가 특정 목적이나 분석에 적합하고 충분하며 관련성 있는지 여부를 나타냅니다. 그것은 손에 있는 데이터가 의도된 사용 또는 연구에 필요한 요구 사항과 기준을 충족하는지를 평가합니다.

1.1.1 — Kaiser-Meyer-Olkin(KMO)

Kaiser-Meyer-Olkin 측정치는 분석을 위한 표본의 적절성을 평가하며, 고려중인 변수가 구분된 신뢰성 있는 요인을 얻을 것으로 예상되는지 여부를 나타냅니다. KMO 통계치는 0에서 1 사이의 범위 내에 있으며, 더 높은 값은 요인 분석에 더 적합함을 나타냅니다.

- KMO가 0.5 이상일 경우: 주로 허용 가능하다고 간주되며, 데이터 집합이 요인 분석에 적합함을 나타냅니다.
- KMO가 0.5 미만일 경우: 데이터 집합이 요인 분석에 적합하지 않을 수 있다는 것을 시사합니다.

<div class="content-ad"></div>

<img src="/assets/img/2024-06-20-TinyMLPrincipalComponentAnalysis_1.png" />

1.1.2 — Bartlett의 구형성 검정

Bartlett의 구형성 검정은 요인 분석의 맥락에서 사용되는 통계적 검정으로, 관측된 변수들의 상관 행렬이 항등 행렬과 유의하게 다른지를 결정하기 위해 사용됩니다. 간단히 말하면, 이는 변수들 사이에 충분한 상관관계가 있는지를 평가하여 요인 분석을 계속 진행할 수 있는지 여부를 파악하는 데 도움이 됩니다.

다음은 Bartlett의 구형성 검정의 자세한 단계와 수학적 공식입니다:

<div class="content-ad"></div>

단계 1: 가설 설정

- 귀무가설 (H0): 관찰된 상관 행렬은 독립 행렬이며 변수 간 상관 관계가 없음을 나타냅니다.
- 대립가설 (H1): 관찰된 상관 행렬은 독립 행렬이 아니며 변수 간 유의한 상관 관계가 있다는 것을 시사합니다.

단계 2: 바트렛의 구형성 검정 통계량 계산

바트렛의 구형성 검정 통계량은 카이제곱 (χ2) 분포를 따릅니다. 검정 통계량의 공식은 다음과 같습니다.

<div class="content-ad"></div>

<img src="/assets/img/2024-06-20-TinyMLPrincipalComponentAnalysis_2.png" />

여기서:

- n은 관찰값의 수입니다.
- p는 변수의 수입니다.
- det(R)은 관찰된 상관 행렬의 행렬식입니다.
- det(I)은 항등 행렬의 행렬식입니다.

단계 3: 자유도 결정

<div class="content-ad"></div>

자유도(df)는 카이 제곱 분포의 경우 다음과 같이 계산됩니다:

![image](/assets/img/2024-06-20-TinyMLPrincipalComponentAnalysis_3.png)

단계 4: 임계값과 비교

계산된 χ² 통계량을 선택한 유의 수준 (예: 0.05)에서 카이 제곱 분포 표의 임계값과 비교합니다.

<div class="content-ad"></div>

### 단계 5: 결정 내리기

만약 계산된 χ2 값이 임계값보다 크다면, 귀무가설을 기각해야 합니다. 이는 변수들 간에 상관 관계가 유의미하며 요인 분석이 적절할 수 있다는 것을 시사합니다.

### 1.2 — 상관계수 행렬

변수 집합에 대한 Pearson 상관계수 행렬은 행렬 형태로 표현될 수 있습니다. n개의 변수를 X1,X2,…,Xn으로 표시한다고 가정해 봅시다. 이러한 변수에 대한 Pearson 상관계수 행렬 R은 다음과 같습니다:

<div class="content-ad"></div>


![image](/assets/img/2024-06-20-TinyMLPrincipalComponentAnalysis_4.png)

Here:

- The diagonal elements (main diagonal) are all 1 because each variable perfectly correlates with itself.
- The off-diagonal elements (rij) represent the Pearson correlation coefficient between variables Xi and Xj.
- The matrix is symmetric (rij=rji) because the correlation between Xi and Xj is the same as the correlation between Xj and Xi.

The formula to compute rij (Pearson correlation coefficient between Xi and Xj) is given by:


<div class="content-ad"></div>


![이미지](/assets/img/2024-06-20-TinyMLPrincipalComponentAnalysis_5.png)

이 공식에는 평균 (Xˉi 및 Xˉj) 및 제곱 차이의 합이 포함되어 있습니다. 두 변수에 대한 이전에 설명한 쌍별 계산과 유사합니다.

피어슨 상관 관계는 선형 관계만을 측정하므로 비선형 관계는 포착하지 못할 수 있습니다. 피어슨 상관 계수는 -1에서 1 사이의 범위를 가집니다:

- r=1: 완벽한 양의 상관 관계;
- r=−1: 완벽한 음의 상관 관계;
- r=0: 선형 상관 관계 없음.

<div class="content-ad"></div>

## 1.3 — 고유값과 고유벡터

1.3.1 — 고유값 (λ)

고유값은 데이터의 최대 변이성을 포착하는, 정사각 행렬에서 유도된 독립적인 벡터들입니다. 고유값은 따라서 연구된 변수들에 의해 포착된 총 분산의 부분으로 이해될 수 있습니다.

- 고유값은 식 Av=λv이 비제로 해 v를 가지는 스칼라 λ입니다.
- 종종 λ로 표시됩니다.

<div class="content-ad"></div>

고윳값을 찾는 방정식은 A를 원래 행렬에서 λI(단위 행렬)을 뺀 후 Determinant를 구하여 얻는 특성 방정식을 풀어야 합니다:

det(A−λI)=0

λ에 대한 이 방정식을 해결하면 행렬 A의 고윳값을 얻게 됩니다.

1.3.2 —고유벡터 (v)

<div class="content-ad"></div>

- 고유벡터는 방정식 Av=λv를 만족하는 0이 아닌 벡터 v입니다.
- 종종 v로 표기됩니다.

- 고유값을 구했다면, 각 고유값을 방정식 Av=λv에 대입하여 v에 대해 풀어서 해당하는 고유벡터를 찾을 수 있습니다. 이 솔루션들이 고유벡터를 형성합니다.

이 과정은 아래와 같이 요약될 수 있습니다:

- 고유문자식: det(A−λI)=0;
- 고유값(λ) 구하기: 고유문자식을 해결하여 고유값 λ를 찾습니다.
- 고유벡터(v) 찾기: 각 고유값 λ에 대해, (A−λI)v=0인 선형 방정식을 풀어 해당하는 고유벡터 v를 찾습니다.

<div class="content-ad"></div>

## 1.4 — 요인들

PCA는 식별된 직교 기저의 새로운 축을 나타내는 요인의 집합입니다. 첫 번째 요인은 샘플의 분산을 가장 잘 설명하는 조합입니다. 두 번째 요인은 두 번째로 높은 분산을 설명하며 첫 번째 요인과 관련이 없습니다. 이와 같이 계속됩니다. 따라서 PCA 알고리즘의 출력은 초관련 변수 집합으로부터 유도된 상관관계가 없는 변수 집합입니다.

PCA에서 주성분(요인)을 형성하기 위해 원래 변수들의 선형 조합을 행렬 형태로 표현할 수 있습니다. 표준화된 데이터 행렬을 Z로 표시하고(열은 표준화된 변수를 나타냄), 고유벡터 행렬을 V로 표시합니다(열은 고유벡터를 나타냄). k번째 주성분(Fk)을 얻기 위한 선형 조합은 다음과 같이 표현될 수 있습니다:

![이미지](/assets/img/2024-06-20-TinyMLPrincipalComponentAnalysis_6.png)

<div class="content-ad"></div>

여기에는 Z가 표준화된 데이터 행렬이고, Vk는 k번째 고유값에 해당하는 고유벡터 행렬의 k번째 열입니다. Fk의 개별 요소는 다음과 같이 표현될 수 있습니다:


| Fk1 |
| Fk2 |
| ... |
| Fkn |


이 식에서 Fki는 k번째 주성분의 i번째 관측값, Zij는 j번째 표준화된 변수의 i번째 관측값, Vjk는 j번째 고유벡터의 k번째 요소입니다.

이 선형 결합을 사용하여 k번째 주성분을 원래 표준화된 변수들의 가중 합으로 표현할 수 있습니다. 가중치는 k번째 고유벡터의 요소로 제공됩니다. 각 주성분은 원래 변수들의 다른 선형 결합을 나타내며, 데이터의 최대 분산을 포착합니다.

<div class="content-ad"></div>

1.4.1 — 요인 수

- 카이저의 규칙: 이 방법은 각각의 고유값이 1보다 큰 값을 가지는 요인을 선택하는 방법으로 구성되어 있습니다. 다시 말해서, 우리는 1 이상의 분산을 설명하는 요인들만 사용하고 싶습니다.
- 공유 분산 분석: 이 방법은 누적된 공유 분산의 합을 분석하는 주관적인 방법입니다. 이 방법을 통해 우리는 가능한 한 적은 수의 요인을 유지하면서 가장 많은 분산을 설명하는 요인의 수를 선택하려고 합니다. 이를 위해, 비즈니스 문제에 따라 70~90%의 공유 분산이 설명되면 충분할 수 있으므로, 공유 분산의 70~90%를 합한 요인이 정의될 것입니다.

## 1.5— 요인 부하

요인 부하는 특정 요인에 대한 각 원본 변수에 할당된 가중치를 의미합니다. 이러한 부하는 각 변수와 해당 요인간의 관계의 강도와 방향을 나타냅니다. 요인 부하의 수학적 설명을 살펴봅시다.

<div class="content-ad"></div>

PCA에서 요인 적재량은 표준화된 데이터의 공분산 행렬 또는 상관 행렬의 고유벡터에서 유도됩니다. Vk가 k번째 고유값에 연결된 고유벡터라고 가정해 봅시다. j번째 변수와 k번째 요인의 요인 적재량(λjk)은 Vk의 요소에서 얻어집니다.

요인 적재량은 원래 변수 Xj가 k번째 요인에 얼마나 기여하는지를 나타냅니다. λjk가 양수이면, Xj와 k번째 요인 사이에 긍정적 상관 관계가 있다는 것을 시사하며, 음수이면 음적 상관 관계를 시사합니다. 요인 적재량의 크기는 관계의 강도를 나타냅니다.

요인 모델에서 요인 적재량(λjk)은 원래 변수와 잠재적인 요인 사이의 관계를 나타내는 매개변수입니다. 이 모델은 다음과 같이 표현됩니다:

<div class="content-ad"></div>

아래와 같은 테이블을 Markdown 포맷으로 바꿔주세요.


| 변수 | 설명 |
|------|------|
| Xj   | j번째 원본 변수 |
| λjk  | Xj와 k번째 요인 간의 관계를 나타내는 요인 로딩 |
| Fk   | k번째 잠재 요인 |
| εj   | j번째 변수와 연관된 오차 |


<div class="content-ad"></div>

기존 변수에서 잠재 요인으로 설명되는 분산의 비율을 의미합니다. "공용성"의 수학적 설명을 살펴보겠습니다.

만약 p개의 원래 변수 X1,X2,…,Xp가 있다면, j번째 변수 (Hj)의 공용성은 다음과 같이 계산됩니다:


<div class="content-ad"></div>

- m은 인자의 수입니다.
- λjk는 j번째 변수의 k번째 인자에 대한 인자 적재입니다.

공통 분산은 잠재적 요인에 의해 설명된 Xj 변수의 분산의 총량을 나타냅니다. 합계에서 각 항목 2λjk^2은 공통 분산에 기여하며, k번째 인자에 의해 설명된 변수 Xj의 분산의 비율을 나타냅니다.

실용적으로, Hj가 1에 가까우면 변수 Xj가 잠재적 요인에 의해 잘 설명된다는 것을 나타냅니다. 0에 가까우면 변수는 모델의 요인들에 의해 잘 표현되지 않습니다.

모든 변수의 공통성의 합계는 모델의 요인들에 의해 설명된 총 분산의 전반적인 지표입니다. 변수가 p개인 경우, 총 분산은 다음과 같습니다:

<div class="content-ad"></div>

아래는 요인에 의해 설명된 분산이며:

![image2](/assets/img/2024-06-20-TinyMLPrincipalComponentAnalysis_12.png)

요인에 의해 설명된 분산의 비율은 요인에 의해 설명된 분산을 총 분산으로 나누어 계산할 수 있습니다.

<div class="content-ad"></div>

# 2— TinyML 구현

이 예시를 통해 ESP32, 아두이노, 라즈베리파이 및 다른 다양한 마이크로컨트롤러 또는 IoT 장치에 기계 학습 알고리즘 (PCA)을 구현할 수 있습니다.

1 — 다음 명령으로 micromlgen 패키지를 설치하세요:

```js
!pip install micromlgen
!pip install factor_analyzer
```

<div class="content-ad"></div>

2 — 라이브러리 가져오기

```python
from micromlgen import port
import pandas as pd
from sklearn.decomposition import PCA
from sklearn.discriminant_analysis import StandardScaler
import seaborn as sns
import matplotlib.pyplot as plt
import plotly.express as px
import numpy as np

from factor_analyzer.factor_analyzer import calculate_kmo
from factor_analyzer.factor_analyzer import calculate_bartlett_sphericity
from factor_analyzer import FactorAnalyzer
```

3 — 데이터셋 로드

Decathlon

<div class="content-ad"></div>

41행 13열로 구성된 데이터베이스가 있습니다. 첫 10개 열은 각 선수의 10종목 경기 성적에 해당합니다. 열 11과 12는 각각 선수의 등급과 획득한 점수를 나타냅니다. 마지막 열은 2004년 올림픽 게임 또는 2004년 데카스론과 같은 종목에 해당하는 범주형 변수입니다.

다음은 변수입니다.

- 100m (100m 달리기)
- long.jump (멀리뛰기)
- shot.put (역도)
- High.jump (높이뛰기)
- 400m (400m 달리기)
- 110m.hurdle (110m 허들)
- Discus (원반 던지기)
- Pole.vault (양봉)
- Javeline (투창)
- 1500m (1500m 달리기)


patch = './data/decathlon.csv'
df = pd.read_csv(patch, index_col=0)


<div class="content-ad"></div>

안녕하세요! 아래는 Markdown 형식으로 테이블의 변경 내용이 있습니다.

<img src="/assets/img/2024-06-20-TinyMLPrincipalComponentAnalysis_13.png" />

4 — 데이터셋 시각화

```js
sns.pairplot(df)
```

<img src="/assets/img/2024-06-20-TinyMLPrincipalComponentAnalysis_14.png" />

<div class="content-ad"></div>

5- 데이터 표준화하기

```js
columns_selected = ['100m', 'Long.jump', 'Shot.put', 'High.jump', '400m', '110m.hurdle',
       'Discus', 'Pole.vault', 'Javeline']

X = df[columns_selected]
```

```js
X_standardized = StandardScaler().fit_transform(X)
df_X_standardized = pd.DataFrame(X_standardized, columns=columns_selected)
```

6- 데이터의 상관 행렬 분석하기

<div class="content-ad"></div>

6.1- 상관 행렬

```js
corr = X.corr()
corr
```

<img src="/assets/img/2024-06-20-TinyMLPrincipalComponentAnalysis_15.png" />

```js
# 그림 크기 조정
plt.figure(figsize=(10, 8))

# 히트맵 생성을 위한 기존 코드
sns.heatmap(corr, xticklabels=corr.columns, yticklabels=corr.columns)

# 히트맵에 값 추가
for i in range(len(corr.columns)):
    for j in range(len(corr.columns)):
        plt.text(j + 0.5, i + 0.5, f"{corr.iloc[i, j]:.2f}", ha='center', va='center', color='w')

# 히트맵 표시
plt.show()
```

<div class="content-ad"></div>


![이미지](/assets/img/2024-06-20-TinyMLPrincipalComponentAnalysis_16.png)

6.2 — 고유값과 고유벡터

```js
X = np.matrix(X)
cov_matrix =  np.cov(np.transpose(X))
```

```js
np.diagonal(cov_matrix)
```

<div class="content-ad"></div>

<img src="/assets/img/2024-06-20-TinyMLPrincipalComponentAnalysis_17.png" />

```js
eigenvalues, eigenvectors = np.linalg.eig(cov_matrix)
sorted_indices = np.argsort(eigenvalues)[::-1]
eigenvalues = eigenvalues[sorted_indices]
eigenvectors = eigenvectors[:, sorted_indices]
```

```js
eigenvalues
```

<img src="/assets/img/2024-06-20-TinyMLPrincipalComponentAnalysis_18.png" />

<div class="content-ad"></div>

```js
고유벡터
```

![이미지](/assets/img/2024-06-20-TinyMLPrincipalComponentAnalysis_19.png)

7— 데이터 적합성

7.1 — 카이저-마이어-올킨 (KMO)

<div class="content-ad"></div>

```js
# KMO 값 계산
kmo_score, kmo_model = calculate_kmo(X)

# KMO 점수 표시
print(f'카이저-마이어-올킨 (KMO) 점수: {kmo_model}')
```

![image](/assets/img/2024-06-20-TinyMLPrincipalComponentAnalysis_20.png)

```js
# 변수별로 KMO를 시각화하는 막대 차트 생성
plt.figure(figsize=(12, 6))
plt.bar(df_X_standardized.columns, kmo_score, color='blue')
plt.title('변수별 KMO')
plt.xlabel('변수')
plt.ylabel('KMO 값')
plt.grid()
plt.xticks(rotation=45, ha='right')  # 더 잘 보이도록 x축 레이블 회전
```

![image](/assets/img/2024-06-20-TinyMLPrincipalComponentAnalysis_21.png)


<div class="content-ad"></div>

7.2 — 바틀렛의 구 구형성 검정

```js
# 바틀렛의 구 구형성 검정 계산
chi_square, p_value = calculate_bartlett_sphericity(X)

# 검정 통계량 표시
print(f'카이제곱 값: {chi_square}')
print(f'P-value: {p_value}')
```

![Image](/assets/img/2024-06-20-TinyMLPrincipalComponentAnalysis_22.png)

```js
# 바틀렛의 구 구형성 검정 시각화
plt.figure(figsize=(6, 4))
plt.bar(['카이제곱 값', 'P-value'], [chi_square, p_value], color=['blue', 'green'])
plt.title("바틀렛의 구 구형성 검정")
plt.ylabel('값')
plt.show()
```

<div class="content-ad"></div>

<img src="/assets/img/2024-06-20-TinyMLPrincipalComponentAnalysis_23.png" />

### 8 - 주성분 분석

```js
X = np.asarray(X)
```

```js
pca = PCA()
pca.fit(X)
autovalores = pca.explained_variance_
autovetores = pca.components_
```

<div class="content-ad"></div>

8.1 — 카이젤의 법칙

```js
# 관련 요인 분석 객체를 생성하고 데이터에 적합화합니다
fa = FactorAnalyzer()
fa.fit(X)

# 고유값을 가져옵니다
eigenvalues, _ = fa.get_eigenvalues()
```

```js
# 고유값을 요인 번호에 대해 그려봅니다
plt.figure(figsize=(10, 8))
plt.plot(range(1, len(eigenvalues) + 1), eigenvalues, marker='o')
plt.title("Scree Plot")
plt.xlabel("요인 번호")
plt.ylabel("고유값")
plt.axhline(1, color='red', linestyle='dashed', linewidth=2, label="카이젤의 기준 (고유값 = 1)")
plt.legend()
plt.grid()
plt.show()
```

<img src="/assets/img/2024-06-20-TinyMLPrincipalComponentAnalysis_24.png" />

<div class="content-ad"></div>

8.2 — 공유 분산의 분석

```js
exp_var_cumul = np.cumsum(pca.explained_variance_ratio_)
```

```js
# 공분산 설명 비율 시각화
plt.figure(figsize=(10, 8))
# 각 요인으로 설명되는 누적 분산 플롯
plt.plot(exp_var_cumul )
plt.title('요인별 공분산 설명 비율')
plt.xlabel('요인 수')
plt.ylabel('누적 설명 분산 (%)')
plt.grid()
plt.show()
```

<img src="/assets/img/2024-06-20-TinyMLPrincipalComponentAnalysis_25.png" />

<div class="content-ad"></div>

8.3 — Plot Components

```python
model = PCA(n_components=2)
X_pca = model.fit(X)
```

```python
components = model.fit_transform(X)
components 
```

```python
loadings = model.components_.T * np.sqrt(model.explained_variance_)

fig = px.scatter(components, x=0, y=1)

for i, feature in enumerate(columns_selected):
    fig.add_shape(
        type='line',
        x0=0, y0=0,
        x1=loadings[i, 0],
        y1=loadings[i, 1]
    )
    fig.add_annotation(
        x=loadings[i, 0],
        y=loadings[i, 1],
        ax=0, ay=0,
        xanchor="center",
        yanchor="bottom",
        text=feature,
    )
fig.show()
```

<div class="content-ad"></div>


![Image](/assets/img/2024-06-20-TinyMLPrincipalComponentAnalysis_26.png)

9 - Inverse Transform

```js
X_reconstructed = model.inverse_transform(components)
X_reconstructed
```

![Image](/assets/img/2024-06-20-TinyMLPrincipalComponentAnalysis_27.png)


<div class="content-ad"></div>

10— 마이크로콘트롤러에 구현할 모델 획득

```js
print(port(model))
```

```js
#pragma once
namespace Eloquent {
    namespace ML {
        namespace Port {
            class PCA {
                public:
                    /**
                    * 차원 축소 적용
                    * @warn 목적지 벡터가 제공되지 않으면 원본 벡터를 덮어씁니다!
                    */
                    void transform(float *x, float *dest = NULL) {
                        static float u[2] = {0};
                        u[0] = dot(x, -0.010208828727, 0.009522664636, 0.07801034572, 0.004103495259, -0.003935853874, -0.004232033634, 0.21088426957, -0.00282519103, 0.974263356619);
                        u[1] = dot(x, -0.015215508318, 0.016476395215, 0.128355383147, 0.008750586985, -0.049637455695, -0.049172415055, 0.964175225747, -0.0112017847, -0.219782142624);
                        memcpy(dest != NULL ? dest : x, u, sizeof(float) * 2);
                    }

                protected:
                    /**
                    * 가변 길이 인수로 점곱 계산
                    */
                    float dot(float *x, ...) {
                        va_list w;
                        va_start(w, 9);
                        static float mean[] = {10.998048780488, 7.26, 14.477073170732, 1.976829268293, 49.616341463415, 14.605853658537, 44.325609756098, 4.76243902439, 58.316585365854};
                        float dot = 0.0;

                        for (uint16_t i = 0; i < 9; i++) {
                            dot += (x[i] - mean[i]) * va_arg(w, double);
                        }

                        return dot;
                    }
                };
            }
        }
    }
```

11— 템플릿을 .h 파일에 저장

<div class="content-ad"></div>

```js
with open('./PCA/PCA.h', 'w') as file:
    file.write(port(model))
```

12- 완성된 아두이노 스케치

아래에 표시된 대로 아두이노 스케치에 "PCA.h" 파일을 포함시키세요:

```js
#include "PCA.h"

Eloquent::ML::Port::PCA pca;

void setup() {
    Serial.begin(115200);
}

void loop() {
    float X_1[9] = {11.04,  7.58, 14.83,  2.07, 49.81, 14.69, 43.75,  5.02, 63.19};
    float result_1[2];
    pca.transform(X_1, result_1);
    Serial.print("입력 X1로 예측한 결과:");
    for (int i = 0; i < 2; i++) {
        Serial.print(" ");
        Serial.print(result_1[i]);
    }
    Serial.println();  // 맨 끝에 새 줄 추가
    delay(2000);

    float X_2[9] = {10.76,  7.4 , 14.26,  1.86, 49.37, 14.05, 50.72,  4.92, 60.15};
    float result_2[2];
    pca.transform(X_2,  result_2);
    Serial.print("입력 X2로 예측한 결과:");
    for (int i = 0; i < 2; i++) {
        Serial.print(" ");
        Serial.print(result_2[i]);
    }
    Serial.println();  // 맨 끝에 새 줄 추가
    delay(2000);
}
```

<div class="content-ad"></div>

결과:

구성요소 X1: [ 4.65528953, -1.59196422]

역변환 X1: [10.97474627, 7.27810093, 14.63589674, 1.98200161, 49.67703998, 14.66443304, 43.77240463, 4.76711978, 63.20194867]

구성요소 X2: [ 3.12393184, 5.77720022]

<div class="content-ad"></div>

역변환 된 X2: [10.87825406, 7.38493559, 15.46230692, 2.0402022, 49.3172806, 14.30855419, 50.55463117, 4.68889837, 60.09039224]

![이미지](/assets/img/2024-06-20-TinyMLPrincipalComponentAnalysis_28.png)

전체 프로젝트는 다음에서 확인할 수 있어요: [TinyML/07_principal_components_analysis at main · thommaskevin/TinyML](github.com)

## 만약 마음에 드신다면, 제게 커피한 잔 ⚡️💰(Bitcoin)을 사주실래요?

<div class="content-ad"></div>

아래는 Markdown 형식으로 변경된 코드입니다:


code: bc1qzydjy4m9yhmjjrkgtrzhsgmkq79qenvcvc7qzn

![image](/assets/img/2024-06-20-TinyMLPrincipalComponentAnalysis_29.png)
