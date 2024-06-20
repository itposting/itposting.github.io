---
title: "파이썬 코드를 간단하게 만드는 데이터 엔지니어링 프로젝트"
description: ""
coverImage: "/assets/img/2024-06-19-SimplifyingthePythonCodeforDataEngineeringProjects_0.png"
date: 2024-06-19 05:14
ogImage: 
  url: /assets/img/2024-06-19-SimplifyingthePythonCodeforDataEngineeringProjects_0.png
tag: Tech
originalTitle: "Simplifying the Python Code for Data Engineering Projects"
link: "https://medium.com/towards-data-science/simplifying-the-python-code-for-data-engineering-projects-95f0c41dc58a"
---


## 데이터 수집, 검증, 처리 및 테스트를 위한 파이썬 팁과 기술: 실용적인 안내

다양한 원천과 형식에서 원시 데이터가 나옵니다. 중요한 비즈니스 문제에 대답할 수 있도록 데이터를 사용할 수 있게 하려면 데이터 엔지니어링을 수행하기 위해 상당한 노력과 시간이 필요합니다. 데이터의 양, 속도 및 분석 요구 사항에 따라 기본 데이터 인프라는 다양할 수 있지만, 여러 작업을 단순화하고 최적화하기 위한 일부 기본 코드 설계 기술은 여전히 중요합니다.

본문에서는 데이터 수집부터 파이프라인 테스트까지 일반 데이터 엔지니어링 프로젝트의 여러 중요한 부분을 탐색할 것입니다. 파이썬은 데이터 엔지니어링에 가장 널리 사용되는 프로그래밍 언어이며, 내장 기능 및 효율적인 라이브러리를 사용하여 이러한 사용 사례를 어떻게 처리할 수 있는지 배우겠습니다.

![이미지](/assets/img/2024-06-19-SimplifyingthePythonCodeforDataEngineeringProjects_0.png)

<div class="content-ad"></div>

온라인 독특하고 모든 행사에 어울리는 선물을 판매하는 온라인 소매점을 운영 중이라고 상상해보세요. 이 온라인 상점은 매분, 매초 많은 거래량을 처리하고 있어요. 현재 거래에 대한 구매 습관을 분석하여 더 많은 고객들의 요구를 충족시키고 새로운 고객들에게 더 많은 서비스를 제공하는 것이 당신의 포부입니다. 이로 인해 거래 기록의 데이터 처리에 대해 파고들기로 하게 되었어요.

## #0 모의 데이터

먼저 JSON Lines (JSONL) 텍스트 형식을 사용하여 몇 가지 거래 데이터를 파일에 모의로 작성합니다. 각 줄은 별도의 JSON 객체입니다. 이 형식은 데이터 스트리밍에 매우 적합하며, 웹/앱 분석 및 로그 관리와 같은 분야에서 유용합니다.

파일에서 데이터 필드는 다양한 데이터 유형에 속합니다. 고객 및 제품 식별자(정수/배열 형식), 결제 방법(문자열 형식) 및 총 거래 금액(부동소수점 숫자)을 포함합니다.

<div class="content-ad"></div>

```js
import json
import random
import numpy as np
import datetime

# 기존의 'retail_transactions.jsonl' 파일을 삭제합니다.
! rm -f /p/a/t/h retail_transactions.jsonl

# 거래 횟수를 설정합니다.
no_of_iteration = 500000

# 쓰기 모드로 파일을 엽니다.
with open('retail_transactions.jsonl', 'w') as f:
  for num in range(no_of_iteration):
    if (random.randint(1, 10000) != 5000):
      # 유효한 거래를 생성합니다.
      new_txn = {
        'orderID': num,
        'customerID': random.randint(1, 100000),
        'productID': np.random.randint(10000, size=random.randint(1, 5)).tolist(),
        'paymentMthd': random.choice(['신용 카드', '직불 카드', '디지털 지갑', '착불 현금', '암호화폐']),
        'totalAmt': round(random.random() * 5000, 2),
        'invoiceTime': datetime.datetime.now().isoformat()
      }
    else:
      # 유효하지 않은 거래를 생성합니다.
      new_txn = {
        'orderID': "",
        'customerID': "",
        'productID': "",
        'paymentMthd': "",
        'totalAmt': "",
        'invoiceTime': ""
      }
     
     # 거래를 JSON 라인으로 파일에 씁니다.
     f.write(json.dumps(new_txn) + "\n")
``` 

파일에 빈 데이터 필드가 있는 여러 건의 개별 거래를 발견할 수 있습니다. 이것은 실제 세계에서 자주 발생하는 데이터 품질 문제 중 하나인 누락된 데이터 문제를 모방합니다.

## #1 데이터 수집 — 수확

파일에서 거래 기록을 읽는 가장 간단한 방법 중 하나는 데이터 세트를 리스트로 반복하고 이후에 이를 Pandas DataFrame으로 변환하는 것입니다.

<div class="content-ad"></div>

이 방법은 데모 데이터셋의 500,000개 거래에 대해 훌륭하게 작동할 것입니다. 그러나 실제 세계의 데이터셋은 수백만에서 심지어 수십억 행에 이를 수 있습니다. 전체 계산이 완료될 때까지 기다릴 필요가 있거나 메모리 문제가 발생할 수도 있습니다.

가끔은 전체 결과에 신경 쓰지 않고 마지막 레코드가 로드되기 전에 초기 결과를 처리하고 싶을 수 있습니다. 이런 경우에는 yield를 사용하여 제너레이터의 흐름을 제어할 수 있습니다.

사용자 코드와 라이브러리 코드를 번갈아가며 실행하는 루틴이 있습니다. 이는 순차적으로 실행되어 첫 번째 레코드에 도달하기 전에 두 번째 레코드에 액세스할 수 없음을 의미합니다. 이 개념에 대해 자세히 알아보려면 Pydata 토크 비디오에서 설명을 찾을 수 있습니다.

yield 문은 다양한 실용적인 용도가 있습니다. 예를 들어 파일의 각 줄을 통해 이동하고 비어 있지 않은 레코드만 yield할 수 있습니다. 아래에서는 실시간 데이터 필터링을 실행하는 방법을 보여줍니다:

<div class="content-ad"></div>

```js
import json

def read_json_file(file_name):
  # JSONL 파일 읽기
  with open(file_name) as f:
    for line in f:
      txn = json.loads(line)
      # 유효한 거래만 반환
      if (txn['orderID'] != ""):
        yield(txn)

txn_generator = read_json_file('retail_transactions.jsonl')
```

이 코드의 출력은 Python 생성기를 제공하며, 이는 특별한 유형의 반복자입니다. 반복문에서 next 함수를 사용하여 하나씩 다음 항목을 반환할 수 있습니다. 실시간 데이터 필터링 외에도, 데이터를 사전 처리하고 미리 정의된 일괄 크기로 제공하는 생성기 함수를 설계할 수 있습니다. 이 방법은 기계 학습 모델 훈련을 위해 데이터를 간편하게 전달하기 위해 사용될 수 있습니다. 더불어 생성기를 사용하여 웹 요청 및 응답을 비동기적으로 처리하는데도 사용할 수 있습니다.

## #2 데이터 유효성 검사 — Pydantic

JSON 데이터 목록이 주어진다고 가정해보세요. 데이터는 데이터 처리 후 거래 기록 정보를 포함합니다. 다음은 샘플 거래 정보입니다:

<div class="content-ad"></div>

```js
{
 'orderID': 10000,
 'customerID': 48316,
 'productID': [5620],
 'paymentMthd': 'Cash on delivery',
 'totalAmt': 9301.2,
 'invoiceTime': '2024-06-10T23:30:29.608443',
 'price': -1
}
```

각 데이터가 들어올 때마다 유효성이 검증되었는지 확인하고, 그렇지 않으면 후속 데이터 처리 함수를 실행할 때 다양한 유형의 오류가 발생할 수 있습니다. 이는 pydantic 라이브러리를 사용하여 달성할 수 있습니다.

```js
from datetime import datetime
from pydantic import BaseModel, ValidationError

# 거래 기록용 데이터 모델 정의
class TxnModel(BaseModel):
  orderID: int
  customerID: int
  productID: list[int]
  paymentMthd: str
  totalAmt: float
  invoiceTime: datetime

try:
  # 샘플 거래에 대해 스키마에 대한 유효성을 검증
  TxnModel.model_validate(sample_txn)
  print("유효성 검사 성공!")
except ValidationError as exc:
  # 유효성 검사 오류가 있는 경우 오류 메시지 출력
  print("유효성 검사 오류:")
  print(exc.errors())

# 결과:
# 유효성 검사 성공
```

때로는 더 엄격한 유효성 검사 규칙을 적용할 필요가 있습니다. Pydantic 기본 모델은 가능한 경우 문자열 데이터를 정수로 변환하려고 시도합니다. 이를 피하려면 strict=True를 모델 수준이나 필드 수준에서 설정할 수 있습니다.

<div class="content-ad"></div>

또한 데이터 필드에 사용자 정의 유효성 검사 규칙을 적용할 수 있습니다. 예를 들어, 지불 방법 값이 우리의 기대에 부합하는지 확인하고 싶을 수 있습니다. 테스트를 용이하게하기 위해 샘플 케이스의 지불 방법을 수동으로 'Bitcoin'으로 설정하고, 이후 AfterValidator를 사용하여 추가 확인을 위한 함수를 포함시킵니다. 

```js
from typing import Annotated
from pydantic.functional_validators import AfterValidator

# 사용자 정의 유효성 검사 규칙 적용
def validate_payment_mthd(paymentMthd: str):
  possible_values = ['신용 카드', '직불 카드', '디지털 지갑', '대금 지불', '암호화폐']
  if paymentMthd not in possible_values:
    raise ValueError(f"유효하지 않은 지불 방법, 지불 유형은 {possible_values}중 하나여야 합니다.")
  return storage

# 거래 레코드를 위한 데이터 모델 정의
class TxnModel(BaseModel):
  orderID: int = Field(strict=True)
  customerID: int
  productID: list[int]
  paymentMthd: Annotated[str, AfterValidator(validate_payment_mthd)]
  totalAmt: Annotated[float, Field(strict=True, gt=0)]
  invoiceTime: datetime

# 존재하지 않는 지불 방법 수동으로 정의
sample_txn['paymentMthd'] = 'Bitcoin'

try:
  # 스키마에 대한 샘플 케이스 유효성 검사
  TxnModel.model_validate(sample_txn)
  print("유효성 검사 성공!")
except ValidationError as exc:
  # 유효성 검사 오류에 대한 오류 메시지 출력
  print("유효성 검사 오류:")
  print(exc.errors()[0]['ctx'])

# 출력
# 유효성 검사 오류:
# {'error': ValueError("유효하지 않은 지불 방법, 지불 유형은 ['신용 카드', '직불 카드', '디지털 지갑', '대금 지불', '암호화폐']중 하나여야 합니다.")}
```

이 유효성 검사기는 지불 방법이 가능한 값 목록에 포함되지 않음을 성공적으로 식별합니다. Pydantic의 내부 유효성 검사 논리를 적용한 후 사용자 정의 유효성 함수가 실행됩니다. 코드가 ValueError를 발생시키며 ValidationError이 채워집니다.

오류가 발생하면 수정 조치를 취할 수 있습니다. 이러한 기능은 데이터 오류를 제거하여 데이터의 정확성과 완전성을 보장하는 데 도움을 줍니다.

<div class="content-ad"></div>

## #3 데이터 처리

(1) Python 데코레이터

데이터 유효성 검사 후 데이터 집중적인 함수를 다루기 시작합니다. 데이터 파이프라인이 복잡해지면 실행 시간이 길어지는 경우가 많습니다. 함수의 성능을 최적화하고 실행 시간을 개선하는 데 필요한 자료를 식별하고자 합니다. 간단한 방법 중 하나는 각 함수의 시작과 끝에서 두 개의 타임스탬프를 수집한 후 그들 간의 시간 차이를 계산하는 것입니다.

데이터 파이프라인 전체에 걸쳐 코드가 깔끔하게 유지되도록 하기 위해서는 Python 데코레이터를 활용할 수 있습니다.

<div class="content-ad"></div>

예를 들어, 모든 거래에 대한 가격을 분류하는 데 걸리는 시간을 측정할 수 있습니다.

```js
import time

# 주어진 함수의 실행 시간을 측정합니다.
def time_decorator(func):
  def wrapper(*args, **kwargs):
    begin_time = time.time()
    output = func(*args, **kwargs)
    end_time = time.time()
    print(f"함수 {func.__name__}의 실행 시간: {round(end_time - begin_time, 2)} 초.")
    return output
  return wrapper

# 각 거래의 총 금액을 범주화합니다.
@time_decorator
def group_txn_price(data):
  for txn in data:
    price = txn['totalAmt']
    if 0 <= price <= 1500:
      txn['totalAmtCat'] = '낮음'
    elif 1500 < price <= 3500:
      txn['totalAmtCat'] = '보통'
    elif 3500 < price:
      txn['totalAmtCat'] = '높음'
  return data

txn_list = group_txn_price(txn_list)

# 결과
# 함수 group_txn_price의 실행 시간: 0.26 초.
```

데코레이터 접근 방식을 사용하면 원래 함수의 소스 코드를 변경하지 않고도 코드를 재사용할 수 있습니다. 마찬가지로, 작업이 실패할 때 함수 완료 로깅이나 이메일 알림에 대한 데코레이터 아이디어를 적용할 수 있습니다.

(2) Map, reduce, filter

<div class="content-ad"></div>

이것들은 많은 개발자들이 익숙할 것으로 생각되는 일반적으로 사용되는 Python 배열 메서드들입니다. 그러나 몇 가지 이유로 언급할 가치가 있다고 생각합니다: (1) 변경 불가능 - 이러한 함수들은 원래 리스트의 값들을 수정하지 않습니다; (2) 연쇄적 유연성 - 동시에 여러 함수의 조합을 적용할 수 있습니다; 그리고 (3) 간결하고 가독성 있음 - 오직 한 줄의 코드로만 가능합니다.

JSON 객체 목록이 있는 경우, 결제 방법과 총액만 포함된 몇 개의 예제를 살펴보겠습니다.

Map: 목록의 모든 요소에 동일한 작업을 수행합니다 (예: 결제 방법의 값에 접미사 추가).

```js
updated_txn_list = list(map(lambda x: {
                      'paymentMthd': f"{x['paymentMthd']}_2024",
                      "totalAmt": x["totalAmt"]
                   }, txn_list))

print(updated_txn_list)

# 출력
# [{'paymentMthd': 'Cryptocurrency_2024', 'totalAmt': 3339.85},
# {'paymentMthd': 'Cash on delivery_2024', 'totalAmt': 872.52},
# ...]
```

<div class="content-ad"></div>

테이블 태그를 Markdown 형식으로 변경해주세요.

```js
updated_txn_list = list(map(lambda x: x, filter(lambda y: y["paymentMthd"] == "Cryptocurrency", txn_list)))

print(updated_txn_list)

# Output
# [{'paymentMthd': 'Cryptocurrency', 'totalAmt': 3339.85},
# {'paymentMthd': 'Cryptocurrency', 'totalAmt': 576.15},
# ...}] 
```

Reduce: 단일 값 결과를 얻는 방법(예: 모든 요소를 합하거나 곱하는 것)입니다.

```js
from functools import reduce

total_amt_crypto = reduce(lambda acc, x: acc + x["totalAmt"], updated_txn_list, 0)

print(total_amt_crypto)

# Output
# 250353984.67000002
```

<div class="content-ad"></div>

데이터 과학 프로젝트의 변환 단계에서 이러한 함수를 활용할 수 있어요. 예를 들어, 데이터를 조정하거나 정규화하기 위해 map()을 사용하거나 이상점과 관련 없는 데이터 포인트를 제거하기 위해 filter()를 사용하거나 요약 통계를 생성하기 위해 reduce()를 사용할 수 있어요.

## #4 데이터 파이프라인 테스트 - Pytest

데이터 파이프라인은 종종 데이터 수집, 데이터 정제 및 추출-변환-로드 (ETL) 작업을 포함해요. 잠재적인 오류 범위는 넓고 쉽게 간과될 수 있어요, 특히 모델 흐름과 결과가 사용자에게 해석하기 어려울 때요. 이러한 이유로 개발 팀은 테스트 노력에 더 heavily 의존합니다.

가장 인기 있는 Python 테스트 프레임워크 중 하나는 Pytest에요. 기술 팀과 의사 결정자 모두가 신뢰할 수 있는 변환된 데이터의 고품질을 보장하고 싶다고 상상해봐요. 우리는 거래 가격을 분류하는 함수에 대한 테스트를 수행하고 싶어할 거예요. 이를 달성하기 위해 두 개의 파이썬 파일을 준비해야 해요:

<div class="content-ad"></div>

- feature_engineering.py: 이 파일에는 이전에 작성한 함수가 포함되어 있습니다.

```python
# 각 거래의 총 금액을 범주화합니다.
def add_features(sample_cases):
  for txn in sample_cases:
    price = txn['totalAmt']
    if 0 <= price <= 1500:
      txn['totalAmtCat'] = '낮음'
    elif 1500 < price <= 3500:
      txn['totalAmtCat'] = '보통'
    elif 3500 < price:
      txn['totalAmtCat'] = '높음'
  
  return sample_cases
```

- test_feature_engineering.py: "test_" 접두사가 있는 파일이며, Pytest에서 테스트 목적으로 인식합니다.

```python
from feature_engineering import add_features

def test_add_features():
  sample_cases = [{
      'orderID': 1,
      'customerID': 36536,
      'productID': [2209, 2262, 4912, 3162, 5734],
      'paymentMthd': 'Cryptocurrency',
      'totalAmt': 576.15,
      'invoiceTime': '2024-06-10T23:53:25.329928'
    }]

  # 샘플 케이스를 사용하여 함수 호출
  sample_cases = add_features(sample_cases)
 
  # assert 문을 확인합니다.
  for txn in sample_cases:
    assert 'totalAmtCat' in list(txn.keys())
    assert len(txn) == 7
    assert len(txn['totalAmtCat']) != 0
```

<div class="content-ad"></div>

위의 단언문은 새로운 'totalAmtCat' 데이터 필드가 비어 있지 않은 값으로 추가되며, 원래의 데이터 필드는 영향을 받지 않습니다. Pytest 명령을 실행함으로써 테스트가 통과되었음을 확인할 수 있습니다!

![이미지](/assets/img/2024-06-19-SimplifyingthePythonCodeforDataEngineeringProjects_1.png)

더 고급 사례로, 'load_data', 'clean_data' 및 'add_features'라는 세 가지 함수가 있는 경우, 이러한 함수들의 출력을 한 번에 하나씩 확인하도록 테스트 파일을 어떻게 설계해야 할까요?

```js
import pytest
import json
from feature_engineering import load_data, clean_data, add_features

# 임시 JSONL 파일 설정
@pytest.fixture
def jsonl_file(tmp_path):
  sample_cases = [{'orderID': 10000,
    'customerID': 48316,
    'productID': [5620],
    'paymentMthd': 'Cash on delivery',
    'totalAmt': 9301.2,
    'invoiceTime': '2024-06-10T23:30:29.608443',
    'price': -1
  }]

  file_path = tmp_path + "/test_transactions.jsonl"

  with open(file_path, 'w') as f:
    for txn in sample_cases:
        f.write(json.dumps(txn) + "\n")

  return file_path

# `load_data` 함수를 검증하는 테스트 함수
def test_load_data(jsonl_file):
  data = load_data(jsonl_file)
  # 여기에 단언문 작성

# `clean_data` 함수를 검증하는 테스트 함수
def test_clean_data(jsonl_file):
  data = load_data(jsonl_file)
  data = clean_data(data)
  # 여기에 단언문 작성

# `add_features` 함수를 검증하는 테스트 함수
def test_add_features(jsonl_file):
  data = load_data(jsonl_file)
  data = clean_data(data)
  data = add_features(data)
  # 여기에 단언문 작성
```

<div class="content-ad"></div>

초기화를 위해 JSON Lines 파일과 샘플 테스트 케이스를 사용하는 고정된 기준을 정의해야 합니다. 여기서는 앞에서 언급한 time_decorator와 비슷하게 작동하는 @pytest.fixture decorator를 사용합니다. 이 decorator는 샘플 파일을 반복해서 초기화하는 것을 방지하는 데 도움이 됩니다. 남은 코드에서는 파이프라인 함수를 실행하기 위해 여러 테스트 함수를 사용하고 논리 오류를 감지하기 위해 assert 문을 사용합니다.

## 마무리

우리는 데이터 엔지니어링 프로젝트의 중요한 측면을 몇 가지 경험했고 효율성과 가독성을 위해 Python 코드를 단순화하고 최적화하는 방법을 탐구했습니다:

- yield를 사용하여 대용량 데이터셋을 처리하고 효율적인 메모리 사용을 가능케 함으로써 데이터 수집
- Pydantic을 활용하여 스키마 및 사용자 정의 값 패턴을 기반으로 데이터 필드를 유효성 검사함으로써 데이터 검증
- Python decorator 및 내장 라이브러리를 적용하여 중복 코드 없이 추가 기능을 활성화함으로써 데이터 처리
- Pytest를 사용하여 워크플로 전체에서 품질 높은 함수 출력을 보장함으로써 파이프라인 테스트

<div class="content-ad"></div>

## 마지막으로

이 글을 즐겨 읽으셨다면, 제 Medium 페이지와 LinkedIn 페이지를 팔로우해 주시기 바랍니다. 그렇게 하시면 데이터 과학 사이드 프로젝트, 머신 러닝 운영(MLOps) 데모, 그리고 프로젝트 관리 방법론과 관련된 흥미로운 컨텐츠를 받아보실 수 있습니다.