---
title: "기존의 GPT-4보다 뛰어난 성능을 자랑하는 스탠포드 대학팀의 대형 모델이 모바일폰에서도 구동될 수 있다는 점이 인기를 끌며 하룻밤 사이에 2천 회 이상 다운로드되었습니다"
description: ""
coverImage: "/assets/img/2024-05-27-BetterThanGPT-4theStanfordteamslargemodelthatcanberunonmobilephonesbecamepopularwithover2kdownloadsovernight_0.png"
date: 2024-05-27 14:30
ogImage:
  url: /assets/img/2024-05-27-BetterThanGPT-4theStanfordteamslargemodelthatcanberunonmobilephonesbecamepopularwithover2kdownloadsovernight_0.png
tag: Tech
originalTitle: "Better Than GPT-4, the Stanford team’s large model that can be run on mobile phones became popular, with over 2k downloads overnight"
link: "https://medium.com/gitconnected/better-than-gpt-4-the-stanford-teams-large-model-that-can-be-run-on-mobile-phones-became-popular-bc958501ec01"
---


![Octopus v2](/assets/img/2024-05-27-BetterThanGPT-4theStanfordteamslargemodelthatcanberunonmobilephonesbecamepopularwithover2kdownloadsovernight_0.png)

대규모 모델 구현의 과정에서, 엔드사이드 AI는 매우 중요한 방향입니다.

최근 스탠퍼드 대학의 연구자들이 출시한 Octopus v2는 개발자 커뮤니티로부터 큰 관심을 받으며 인기를 끌고 있습니다. 모델의 다운로드 횟수가 하룻밤 사이에 2천 건을 넘었습니다.

200억 개의 파라미터를 갖는 Octopus v2는 정확도와 대기 시간 측면에서 GPT-4를 능가하며, 콘텍스트 길이를 95% 줄였습니다. 또한, Octopus v2는 Llama7B + RAG 구성보다 36배 빠릅니다.


<div class="content-ad"></div>

많은 네티즌들이 한탄했습니다: 디바이스 측 인공지능 에이전트 시대가 도래했습니다!

![image](/assets/img/2024-05-27-BetterThanGPT-4theStanfordteamslargemodelthatcanberunonmobilephonesbecamepopularwithover2kdownloadsovernight_1.png)

- 논문: 옥토퍼스 v2: 슈퍼 에이전트용 기기 내 언어 모델
- 논문 주소: https://arxiv.org/abs/2404.01744
- 모델 홈페이지: https://huggingface.co/NexaAIDev/Octopus-v2

모델 개요

<div class="content-ad"></div>

옥토퍼스-V2-2B는 안드로이드 API에 맞게 설계된 20 억 개의 매개변수를 가진 오픈 소스 언어 모델로, 안드로이드 기기에서 원활하게 실행되며 안드로이드 시스템 관리에서 여러 기기 및 다양한 응용 프로그램의 조작까지 확장하는 데 사용됩니다.

![이미지](/assets/img/2024-05-27-BetterThanGPT-4theStanfordteamslargemodelthatcanberunonmobilephonesbecamepopularwithover2kdownloadsovernight_2.png)

일반적으로 검색 증강 생성 (RAG) 방법은 잠재적인 기능 매개변수에 대한 상세한 설명을 필요로 하며 (때로는 수만 개의 입력 토큰이 필요할 수도 있음), 이에 기반하여 옥토퍼스-V2-2B는 훈련 및 추론 단계에서 고유한 기능 토큰 전략을 도입하여 GPT-4와 유사한 성능 수준을 달성할 뿐만 아니라 추론 속도를 크게 향상시켜 RAG 기반 방법을 능가합니다. 이로 인해 엣지 컴퓨팅 기기에 특히 유용합니다.

![이미지](/assets/img/2024-05-27-BetterThanGPT-4theStanfordteamslargemodelthatcanberunonmobilephonesbecamepopularwithover2kdownloadsovernight_3.png)

<div class="content-ad"></div>

문어-V2-2B는 다양한 복잡한 시나리오에서 개별, 중첩 및 병렬 함수 호출을 생성할 수 있습니다.

데이터 세트

훈련, 검증 및 테스트 단계에서 고품질 데이터 세트를 사용하고 특히 효율적인 훈련을 달성하기 위해, 연구팀은 데이터 세트를 세 가지 주요 단계로 생성했습니다:

- 관련 쿼리 및 관련 함수 호출 매개변수 생성;
- 적절한 기능 구성요소에서 관련이 없는 쿼리 생성;
- Google Gemini을 통한 이진 검증 지원.

<div class="content-ad"></div>


![image](/assets/img/2024-05-27-BetterThanGPT-4theStanfordteamslargemodelthatcanberunonmobilephonesbecamepopularwithover2kdownloadsovernight_4.png)

Research team은 이 모델을 훈련하기 위해 20가지의 안드로이드 API 설명을 작성했습니다. 다음은 예시 안드로이드 API 설명입니다:

```js
def get_trending_news (category=None, region='US', language='en', max_results=5):
    """
    카테고리, 지역 및 언어에 기반한 트렌드 뉴스 기사를 가져옵니다.
    Parameters:
    - category (str, optional): 필터링할 뉴스 카테고리입니다. 모든 카테고리에 대해 기본값으로 None을 사용합니다. 선택적으로 제공할 수 있습니다.
    - region (str, optional): 지역별 뉴스를 위한 ISO 3166-1 알파-2 국가 코드입니다. 기본값으로 'US'를 사용합니다. 선택적으로 제공할 수 있습니다.
    - language (str, optional): 기사 언어를 위한 ISO 639-1 언어 코드입니다. 기본값으로 'en'을 사용합니다. 선택적으로 제공할 수 있습니다.
    - max_results (int, optional): 반환할 기사의 최대 수입니다. 기본값으로 5를 사용합니다. 선택적으로 제공할 수 있습니다.
    Returns:
    - list [str]: 각각 기사를 나타내는 문자열의 목록입니다. 각 문자열은 기사 제목과 URL을 포함합니다.
    """
```

모델 개발 및 훈련



<div class="content-ad"></div>

이 연구는 프레임워크에서 Google Gemma-2B 모델을 사전 학습 모델로 사용하며 두 가지 다른 훈련 방법을 채택합니다: 전체 모델 훈련과 LoRA 모델 훈련.

전체 모델 훈련에서는 AdamW 옵티마이저를 사용하며 학습률은 5e-5로 설정되고 웜업 단계 수는 10으로, 선형 학습률 스케줄러가 사용됩니다.

LoRA 모델 훈련은 전체 모델 훈련과 동일한 옵티마이저와 학습률 구성을 사용하며 LoRA 랭크는 16으로 설정되며, LoRA는 다음 모듈에 적용됩니다: q_proj, k_proj, v_proj, o_proj, up_proj, down_proj. 그 중 LoRA 알파 매개변수는 32로 설정됩니다.

두 훈련 방법 모두 에포크 수는 3으로 설정됩니다.

<div class="content-ad"></div>

다음 코드를 사용하면 단일 GPU에서 Octopus-V2-2B 모델을 실행할 수 있습니다.

```js
from transformers import AutoTokenizer, GemmaForCausalLM
import torch
import time

def inference(input_text):
    start_time = time.time()
    input_ids = tokenizer(input_text, return_tensors="pt").to(model.device)
    input_length = input_ids["input_ids"].shape[1]
    outputs = model.generate(
        input_ids=input_ids["input_ids"],
        max_length=1024,
        do_sample=False
    )
    generated_sequence = outputs[:, input_length:].tolist()
    res = tokenizer.decode(generated_sequence[0])
    end_time = time.time()
    return {"output": res, "latency": end_time - start_time}

model_id = "NexaAIDev/Octopus-v2"
tokenizer = AutoTokenizer.from_pretrained(model_id)
model = GemmaForCausalLM.from_pretrained(
    model_id, torch_dtype=torch.bfloat16, device_map="auto"
)

input_text = "Take a selfie for me with front camera"
nexa_query = f"아래는 사용자쿼리입니다. 올바른 함수를 호출하고 함수를 호출하는 매개변수를 생성하십시오.\n\n쿼리: {input_text}\n\n응답:"
start_time = time.time()
print("넥사 모델 결과:\n", inference(nexa_query))
print("latency:", time.time() - start_time, "초")
```

평가

벤치마크 테스트에서 Octopus-V2-2B는 단일 A100 GPU에서 "Llama7B + RAG 솔루션"보다 36배 빠른 탁월한 추론 속도를 보여주었습니다. 게다가, Octopus-V2-2B는 클러스터화된 A100/H100 GPU에 의존하는 GPT-4-turbo보다 168% 빠릅니다. 이 효율적인 개선은 Octopus-V2-2B의 기능 토큰 디자인에 기인합니다.

<div class="content-ad"></div>

![Octopus-V2-2B](/assets/img/2024-05-27-BetterThanGPT-4theStanfordteamslargemodelthatcanberunonmobilephonesbecamepopularwithover2kdownloadsovernight_5.png)

옥토퍼스-V2-2B는 속도뿐만 아니라 정확도 면에서도 우수하며, "라마7B + RAG 솔루션"을 31% 초과하는 함수 호출 정확도로 능가합니다. 옥토퍼스-V2-2B는 GPT-4 및 RAG + GPT-3.5와 비교 가능한 함수 호출 정확도를 달성합니다.

![Learn More](/assets/img/2024-05-27-BetterThanGPT-4theStanfordteamslargemodelthatcanberunonmobilephonesbecamepopularwithover2kdownloadsovernight_6.png)

관심 있는 독자들은 연구 내용에 대한 원본 논문을 읽어서 더 많이 알아볼 수 있습니다.

<div class="content-ad"></div>

참고: [https://mp.weixin.qq.com/s/qnFZOPLpdRxW42_cLUcImA](https://mp.weixin.qq.com/s/qnFZOPLpdRxW42_cLUcImA)

기사가 마음에 드셨나요? 더 많은 학습을 원하신다면 제한 없이 읽을 수 있는 Medium 회원이 되어보세요. 이 링크를 통해 회원이 되면 추가 비용 없이 저를 지원해 주시게 됩니다. 미리 감사드리고 앞으로 또 만나요!
