---
title: "최신 RAG 09 프롬프트 압축 전문 가이드"
description: ""
coverImage: "/assets/img/2024-06-23-AdvancedRAG09PromptCompression_0.png"
date: 2024-06-23 19:03
ogImage: 
  url: /assets/img/2024-06-23-AdvancedRAG09PromptCompression_0.png
tag: Tech
originalTitle: "Advanced RAG 09: Prompt Compression"
link: "https://medium.com/ai-advances/advanced-rag-09-prompt-compression-95a589f7b554"
---


RAG 프로세스에서는 두 가지 문제가 발생할 수 있습니다:

- 대규모 언어 모델(LLM)은 일반적으로 문맥 길이 제한이 있습니다. 따라서 입력 텍스트가 길수록 프로세스가 더 많은 시간과 비용이 소모됩니다.
- 검색된 문맥이 항상 유용하지는 않을 수 있습니다. 더 큰 청크 중 작은 부분만 답변과 관련이 있을 수도 있습니다. 경우에 따라서는 특정 질문에 답변하기 위해 여러 청크를 결합해야 할 수도 있습니다. 이 문제는 리랭킹을 해도 계속되는 문제일 수 있습니다.

LLM을 위한 프롬프트 압축은 이러한 문제를 해결하기 위한 방법입니다. 본질적으로, 목표는 프롬프트의 주요 정보를 유지하여 입력 토큰을 보다 가치 있게 만드는 것입니다. 이 접근 방식은 모델의 성능을 향상시키고 비용을 줄이는 데 도움이 됩니다. Figure 1의 우측 하단에 표시된 것과 같습니다.

<img src="/assets/img/2024-06-23-AdvancedRAG09PromptCompression_0.png" />

<div class="content-ad"></div>

알아두면 좋은 점은 그림 1의 보라색 점선에 표시된 대로 일부 압축기는 검색된 컨텍스트에 직접적으로 적용될 수도 있다는 것입니다.

전체적으로, 프롬프트 압축 방법은 네 가지 주요 범주로 나뉠 수 있습니다:

- 정보 엔트로피에 기반한 방법, Selective Context, LLMLingua, LongLLMLingua와 같은 것이 있습니다. 그러한 방법들은 작은 언어 모델을 사용하여 원본 프롬프트의 각 토큰의 자기 정보 또는 난해함을 계산합니다. 그런 다음 난해함이 낮은 토큰을 삭제합니다.
- 소프트 프롬프트 튜닝에 기반한 방법, AutoCompressor와 GIST와 같은 것이 있습니다. 이러한 방법들은 특정 도메인에 적합하도록 LLM 매개변수를 세밀하게 튜닝해야 하지만 블랙박스 LLM에 직접 적용할 수는 없습니다.
- 먼저 LLM으로부터 데이터 정제를 수행한 후, 더 해석하기 쉬운 텍스트 요약을 생성하는 모델을 훈련합니다. 이러한 요약은 서로 다른 언어 모델 간에 전송될 수 있으며, 기울기 업데이트가 필요하지 않은 블랙박스 LLM에 적용될 수 있습니다. 대표적인 방법으로는 LLMLingua-2와 RECOMP이 있습니다.
- 토큰 병합 또는 토큰 가지치기에 기반한 방법, ToMe와 AdapLeR과 같은 것이 있습니다. 이러한 방법들은 보통 모델 세밀 튜닝이 필요하거나 추론 과정 중간 결과 생성을 요구합니다.

4번째 유형의 방법이 ViT나 BERT와 같은 작은 모델을 위해 처음 제안되었으므로, 이 기사에서는 첫 세 가지 방법 유형의 대표적 알고리즘 원리를 소개하겠습니다.

<div class="content-ad"></div>

# 선택적 콘텍스트

## 통찰

Figure 2에서는 LLMs가 전체 콘텍스트나 완전한 대화 기록을 요구하지 않고 사용자 쿼리에 응답할 수 있다는 것을 보여줍니다. 적절한 정보가 생략되어도 LLMs는 여전히 예상된 응답을 생성할 수 있습니다. 이는 LLMs가 사전 훈련 중에 얻은 문맥 단서 및 이전 지식으로 누락된 정보를 추론할 수 있는 능력에 기인할 수 있습니다.

<img src="/assets/img/2024-06-23-AdvancedRAG09PromptCompression_1.png" />

<div class="content-ad"></div>

그러므로 성능을 저해하지 않고 덜 유익한 콘텐츠를 걸러내어 문맥 길이를 최적화하는 것이 가능합니다. 이것이 선택적 문맥(Selective Context)의 중요한 통찰입니다.

선택적 문맥은 주어진 문맥에서 문장, 구, 또는 토큰과 같은 어휘 단위의 자기 정보(self-information)를 결정하기 위해 소규모 언어 모델(SLM)을 활용합니다. 그런 다음 이 자기 정보를 사용하여 그들의 유익성을 평가합니다. 높은 자기 정보를 가진 콘텐츠를 선택적으로 유지함으로써, 선택적 문맥은 LLM을 위한 더 간결하고 효율적인 문맥 표현을 제공합니다. 이는 서로 다른 작업 간에 그들의 성능에 영향을 미치지 않고 달성됩니다.

## 자기 정보(Self-Information)

선택적 문맥은 콘텐츠의 품질을 평가하기 위해 자기 정보를 활용합니다.

<div class="content-ad"></div>

자기 정보는 정보 이론에서 중요한 개념으로 놀람 또는 정보 내용이라고도 합니다. 이것은 이벤트에 의해 전달되는 정보량을 측정합니다. 토큰의 음의 로그 우도로 정의됩니다:

\[ I(x) = -\log P(x) \]

여기서 I(x)는 토큰 x의 자기 정보를 나타내고, P(x)는 출력 확률을 나타냅니다.

정보 이론에서 자기 정보는 이벤트와 관련된 놀라움 또는 불확실성의 수준을 측정합니다. 더 많은 정보를 전달하는 드문 이벤트는 더 높은 자기 정보를 가지고 있습니다. 반대로, 덜 많은 정보를 전달하는 일반적인 이벤트는 더 낮은 자기 정보를 가지고 있습니다.

<div class="content-ad"></div>

## 알고리즘

원칙을 더 편리하게 설명하기 위해 소스 코드를 자세히 살펴봅시다.

먼저, 해당 파이썬 라이브러리를 설치하고 Spacy 모델을 다운로드하여 환경을 설정합니다.

```js
(base) Florian:~ Florian$ conda create -n "selective_context" python=3.10 
(base) Florian:~ Florian$ conda activate selective_context
(selective_context) Florian:~ Florian$ pip install selective-context
(selective_context) Florian:~ Florian$ python -m spacy download en_core_web_sm
```

<div class="content-ad"></div>

설치가 완료되면 버전은 다음과 같습니다:

```js
(selective_context) Florian:~ Florian$ pip list | grep selective
selective-context   0.1.4
```

테스트 코드는 다음과 같습니다:

```js
from selective_context import SelectiveContext

sc = SelectiveContext(model_type='gpt2', lang='en')
text = "INTRODUCTION Continual Learning ( CL ) , also known as Lifelong Learning , is a promising learning paradigm to design models that have to learn how to perform multiple tasks across different environments over their lifetime [To uniform the language and enhance the readability of the paper we adopt the unique term continual learning ( CL ) .]. Ideal CL models in the real world should be deal with domain shifts , researchers have recently started to sample tasks from two different datasets . For instance , proposed to train and evaluate a model on Imagenet first and then challenge its performance on the Places365 dataset . considers more scenarios , starting with Imagenet or Places365 , and then moving on to the VOC/CUB/Scenes datasets. Few works propose more advanced scenarios built on top of more than two datasets."
context, reduced_content = sc(text)

# reduce_ratio를 조절할 수도 있습니다
# context_ratio, reduced_content_ratio = sc(text, reduce_ratio = 0.5)
```

<div class="content-ad"></div>

첫 번째 실행은 GPT-2 모델을 다운로드할 것인데, 해당 모델은 대략 500MB의 크기를 가지고 있어요. 테스트 코드의 결과는 아래 그림 3에 나와 있어요.

![Figure 3](/assets/img/2024-06-23-AdvancedRAG09PromptCompression_3.png)

그다음, sc(text) 함수를 살펴봅시다. 내부 소스 코드는 다음과 같아요:

```js
class SelectiveContext:
    ...
    ...
    def __call__(self, text: str, reduce_ratio: float = 0.35, reduce_level: str = 'phrase') -> List[str]:
        context = self.beautify_context(text)

        self.mask_ratio = reduce_ratio

        sents = [sent.strip() for sent in re.split(self.sent_tokenize_pattern, context) if sent.strip()]

        # 문장, 구문, 또는 토큰 단계에서 축소가 일어나도록 원하시나요?
        assert reduce_level in ['sent', 'phrase', 'token'], f"reduce_level should be one of ['sent', 'phrase', 'token'], got {reduce_level}"
        sent_lus, phrase_lus, token_lus = self._lexical_unit(sents)
        lexical_level = {
            'sent': sent_lus,
            'phrase': phrase_lus,
            'token': token_lus
        }

        # context가 축소된 맥락, masked_sents가 걸러진 맥락을 나타냄
        context, masked_sents = self.self_info_mask(lexical_level[reduce_level].text, lexical_level[reduce_level].self_info, reduce_level)
        return context, masked_sents
```

<div class="content-ad"></div>

위의 코드는 주로 세 가지 단계로 구성되어 있습니다:

- 문맥 내 각 토큰의 자기 정보(self-information)를 계산합니다.
- 구 절이나 문장과 같은 어휘 단위를 기반으로 토큰과 그들의 자기 정보를 병합합니다.
- 정보 문맥을 선택적으로 유지합니다.

단계 1: 자기 정보 계산

각 토큰 xi를 나타내는 문맥 C = x0, x1, …, xn이 주어졌을 때, 우리는 각 토큰 xi의 자기 정보를 계산하기 위해 인과 언어 모델(GPT-2, OPT, LLaMA 등)을 사용합니다:

<div class="content-ad"></div>

아래는 Markdown 형식으로 표시된 코드입니다:


![이미지](/assets/img/2024-06-23-AdvancedRAG09PromptCompression_4.png)

만약 GPT-2를 사용 중이라면, 해당 코드는 다음과 같습니다:

```python
class SelectiveContext:
    ...
    ...    
    def _get_self_info_via_gpt2(self, text: str) -> Tuple[List[str], List[float]]:
        if self.lang == 'en':
            text = f"

<div class="content-ad"></div>

노드 수준에서 선택적인 콘텍스트 필터링을 직접 수행하면 일관성 없는 콘텍스트가 발생할 수 있습니다. 예를 들어 원래 프롬프트에 있는 "2009"는 "209"로 압축될 수 있습니다.

따라서 토큰 수준 필터링 외에도 구, 문장 수준에서 필터링 절차를 구현하는 것이 중요합니다. 필터링의 기본 단위인 어휘 단위는 토큰, 구, 또는 문장이 될 수 있습니다.

각 어휘 단위 u = (xt, …, xt+α)의 자기 정보를 어떻게 계산할까요? u를 구성하는 각 토큰의 자기 정보를 더하여 자기 정보의 가산성 원리를 따릅니다:

![이미지](/assets/img/2024-06-23-AdvancedRAG09PromptCompression_5.png)

<div class="content-ad"></div>

해당 코드는 다음과 같습니다. 특정 변수에 대한 디버깅 정보가 추가되었습니다:

class SelectiveContext:
    ...
    ...
    def _lexical_unit(self, sents):

        if self.sent_level_self_info:
            sent_self_info = []
            all_noun_phrases = []
            all_noun_phrases_info = []
            all_tokens = []
            all_token_self_info = []

            for sent in sents:
                # print(sent)
                tokens, self_info = self.get_self_information(sent)
                '''
                ipdb> sent
                'INTRODUCTION Continual Learning ( CL ) , also known as Lifelong Learning , is a promising learning paradigm to design models that have to learn how to perform multiple tasks across different environments over their lifetime [To uniform the language and enhance the readability of the paper we adopt the unique term continual learning ( CL ) .].'

                ipdb> tokens
                ['IN', 'TR', 'ODUCT', 'ION', ' Contin', 'ual', ' Learning', ' (', ' CL', ' )', ',', ' also', ' known', ' as', ' Lif', 'elong', ' Learning', ',', ' is', ' a', ' promising', ' learning', ' paradigm', ' to', ' design', ' models', ' that', ' have', ' to', ' learn', ' how', ' to', ' perform', ' multiple', ' tasks', ' across', ' different', ' environments', ' over', ' their', ' lifetime', ' [', 'To', ' uniform', ' the', ' language', ' and', ' enhance', ' the', ' read', 'ability', ' of', ' the', ' paper', ' we', ' adopt', ' the', ' unique', ' term', ' continual', ' learning', ' (', ' CL', ' )', '.', '].']

                ipdb> self_info
                [7.514791011810303, 1.632637619972229, 0.024813441559672356, 0.006853647995740175, 12.09920597076416, 2.1144468784332275, 9.457701683044434, 2.4503376483917236, 10.236454963684082, 0.8689146041870117, 5.269547939300537, 4.641763210296631, 0.22138957679271698, 0.010370315983891487, 10.071824073791504, 0.6905602216720581, 0.01698811538517475, 1.5882389545440674, 0.4495090842247009, 0.45371606945991516, 6.932497978210449, 6.087430477142334, 3.66465425491333, 3.3969509601593018, 7.337691307067871, 5.881226539611816, 1.7340556383132935, 4.599822521209717, 6.482723236083984, 4.045308589935303, 4.762691497802734, 0.213468670845
                
                sent_self_info.append(np.mean(self_info))

                all_tokens.extend(tokens)
                all_token_self_info.extend(self_info)

                noun_phrases, noun_phrases_info = self._calculate_lexical_unit(tokens, self_info)
                '''
                ipdb> noun_phrases
                ['INTRODUCTION Continual Learning', ' (', ' CL', ' )', ',', ' also', ' known', ' as', ' Lifelong Learning', ',', ' is', ' a promising learning paradigm', ' to', ' design', ' models', ' that', ' have', ' to', ' learn', ' how', ' to', ' perform', ' multiple tasks', ' across', ' different environments', ' over', ' their lifetime', ' [', 'To', ' uniform', ' the language', ' and', ' enhance', ' the readability', ' of', ' the paper', ' we', ' adopt', ' the unique term continual learning', ' (', ' CL', ' )', '.', ']', '.']
                
                ipdb> noun_phrases_info
                [4.692921464797109, 2.4503376483917236, 10.236454963684082, 0.8689146041870117, 5.269547939300537, 4.641763210296631, 0.22138957679271698, 0.010370315983891487, 3.5931241369495788, 1.5882389545440674, 0.4495090842247009, 4.284574694931507, 3.3969509601593018, 7.337691307067871, 5.881226539611816, 1.7340556383132935, 4.599822521209717, 6.482723236083984, 4.045308589935303, 4.762691497802734, 0.2134686708
                
                if all_noun_phrases:
                    noun_phrases[0] = f" {noun_phrases[0]}"
                all_noun_phrases.extend(noun_phrases)
                all_noun_phrases_info.extend(noun_phrases_info)
            
            return [
                LexicalUnits('sent', text=sents, self_info=sent_self_info),
                LexicalUnits('phrase', text=all_noun_phrases, self_info=all_noun_phrases_info),
                LexicalUnits('token', text=all_tokens, self_info=all_token_self_info)
            ]

Step 3: 선택적 정보 컨텍스트 보존

각 어휘 단위의 자가 정보를 계산한 후, 정보성이 어떻게 평가될 수 있는지에 대한 의문이 생깁니다. 논문은 가장 정보가 많은 콘텐츠를 선택하기 위해 백분위 기반 필터링 접근 방식을 제안합니다. 이는 고정된 임계값을 사용하거나 상위 k개 어휘 단위를 고정하는 것보다 바람직합니다.

<div class="content-ad"></div>

먼저, 자기 정보 값에 따라 용어를 내림차순으로 정렬합니다. 그런 다음, 모든 용어의 자기 정보 값에 대한 p-백분위수를 계산합니다. 그런 다음, 자기 정보 값이 p-백분위수 이상인 용어를 선택적으로 유지합니다.

해당하는 코드는 다음과 같습니다.

class SelectiveContext:
    ...
    ...

    def self_info_mask(self, sents: List[str], self_info: List[float], mask_level):
        # mask_level: 문장, 구, 또는 토큰을 가리는 이등급
        sents_after_mask = []
        masked_sents = []
                
        self.ppl_threshold = np.nanpercentile(self_info, self.mask_ratio * 100)

        # if title is not None:
        #     with open(os.path.join(self.path, title+'_prob_token.tsv'), 'w', encoding='utf-8') as f:
        #         for token, info in zip(tokens, self_info):
        #             f.write(f"{token}\t{info}\n")
        #     with open(os.path.join(self.path, title+'_prob_sent.tsv'), 'w', encoding='utf-8') as f:
        #         for sent, info in zip(sents, sent_self_info):
        #             f.write(f"{sent}\n{info}\n\n")

        for sent, info in zip(sents, self_info):
            if info < self.ppl_threshold:
                masked_sents.append(sent)
                sents_after_mask.append(self.mask_a_sent(sent, mask_level))
            else:
                sents_after_mask.append(sent)
        masked_context = " ".join(sents_after_mask) if mask_level == 'sent' else "".join(sents_after_mask)
        
        return masked_context, masked_sents

# LLMLingua

<div class="content-ad"></div>

## 개요

LLMLingua는 선택적 컨텍스트가 종종 압축된 콘텐츠 간의 상호 연결과 LLM 및 프롬프트 압축에 사용된 소규모 언어 모델 사이의 상관 관계를 무시하는 것을 제안합니다. LLMLingua는 이러한 문제를 정확히 다룹니다.

특히, 그림 4에 나와 있는 것처럼 LLMLingua는 예시, 데모 및 질문과 같은 원래 프롬프트의 다양한 구성 요소에 동적으로 다른 압축 비율을 할당하기 위해 예산 컨트롤러를 사용합니다. 또한 LLMLingua는 시멘틱 무결성을 유지하기 위해 고약간의, 데모 수준의 압축을 수행하여 심하게 압축된 비율에서도 유지합니다. 또한 LLMLingua는 세분화된 프롬프트 압축을 위해 토큰 레벨 반복 알고리즘을 도입합니다.

<div class="content-ad"></div>

비교적으로 Selective Context에 비해 LLMLingua는 조건적 의존성을 고려하면서 프롬프트의 핵심 정보를 더 효과적으로 유지할 수 있습니다. 이를 통해 프롬프트를 20배 압축할 수 있습니다.

## 예산 컨트롤러

예산 컨트롤러는 LLMLingua의 중요한 구성 요소로, 원래 프롬프트의 다양한 부분에 동적으로 다른 압축 비율을 할당하는 데 사용됩니다.

프롬프트의 다양한 섹션은 압축에 대해 다른 민감도를 가지고 있습니다. 예를 들어, 지시사항과 질문은 민감하며, 시연은 민감하지 않습니다. 예산 컨트롤러는 지시사항과 질문에 낮은 압축 비율을 할당하여 필수 정보를 보존하는 역할을 합니다. 반면, 시연에는 중복 정보를 제거하기 위해 더 높은 압축 비율을 할당할 수 있습니다.

<div class="content-ad"></div>

예산 컨트롤러 알고리즘이 그림 5에 표시되어 있습니다:

![이미지](/assets/img/2024-06-23-AdvancedRAG09PromptCompression_7.png)

주요 변수는 다음과 같습니다:

- M_𝑠: GPT-2 또는 LLaMA와 같은 작은 언어 모델.
- x = (x^ins , x^dems , x^que): 지시사항, 데모 및 질문이 포함된 원시 프롬프트.
- 𝐿, 𝐿_ins, 𝐿_dems 및 𝐿_que은 x, x^ins , x^dems 및 x^que의 토큰 수를 나타냅니다.
- 𝜏_dems: 데모에 대한 압축률로, 목표 전체 압축률 𝜏 및 지시사항과 질문에 대한 사전 정의된 압축률인 𝜏_ins 및 𝜏_que가 포함됩니다.
- D: 이 집합에는 압축된 데모가 포함됩니다.

<div class="content-ad"></div>

메인 프로세스는 다음과 같습니다:

- 시연의 압축률 계산
- GPT-2 또는 LLaMA와 같은 작은 언어 모델을 사용하여 원래 시연 집합의 각 시연의 난해도 계산
- 모든 시연을 난해도에 따라 내림차순으로 정렬
- 순서대로 시연을 선택하여 집합 D에 추가
- 시연을 압축한 후, 남은 예산을 지시사항과 질문에 할당
- 일반화된 압축 후 집합 D 출력

시연 수준의 프로세스를 통해 예산 컨트롤러는 압축 중에 주요 정보를 유지하여 원래 프롬프트의 크기를 효과적으로 줄일 수 있습니다. 이 방법은 특히 여러 시연을 포함하는 프롬프트에 적합합니다.

관련 코드는 control_context_budget 함수에 있습니다.

<div class="content-ad"></div>

## 반복 토큰 수준 프롬프트 압축 (ITPC)

프롬프트 압축을 위해 퍼플렉시티를 사용하는 것에는 내재적인 한계가 있습니다: 독립 가정입니다. 이 가정은 프롬프트의 각 토큰을 독립적으로 간주합니다. 다시 말해, 토큰의 발생 확률은 이전 토큰에만 의존하며 다른 토큰과 관련이 없습니다.

이 가정의 문제는 자연어에서 종종 발생하는 토큰 간의 복잡한 종속성을 간과한다는 것입니다. 이러한 종속성은 맥락을 이해하고 의미 무결성을 보존하는 데 중요합니다.

이러한 간과로 압축 프로세스 중에 중요한 정보의 손실이 발생할 수 있습니다. 예를 들어, 고률 압축에서, 토큰이 맥락에서 중요한 추론 단계 또는 논리적 연결을 제공하는 경우, 해당 토큰을 이 퍼플렉시티에만 의존하여 보관할지 여부를 결정하면 불완전한 추론 프로세스로 이어질 수 있습니다.

<div class="content-ad"></div>

이 문제를 해결하기 위해 LLMLingua는 반복적인 토큰 수준 프롬프트 압축(ITPC) 알고리즘을 도입했습니다. 독립적인 확률에만 의존하는 대신, 이 방법은 프롬프트 압축 중 각 토큰의 중요성을 더 정확하게 평가합니다. 이를 위해 각 세그먼트를 반복적으로 처리하고 현재 컨텍스트 내에서 각 토큰의 조건부 확률을 고려합니다. 이 접근 방식은 토큰 간 종속성을 더 잘 보호하는 데 도움을 줍니다.

ITPC의 자세한 단계는 다음과 같습니다:

![Figure 6](/assets/img/2024-06-23-AdvancedRAG09PromptCompression_8.png)

이 과정을 통해 ITPC 알고리즘은 프롬프트의 길이를 효과적으로 압축하면서 프롬프트 의미의 무결성을 유지하여 LLM의 추론 비용을 줄일 수 있습니다.

<div class="content-ad"></div>

**반복 압축 프롬프트 함수에 관련된 코드입니다.**

## 명령어 튜닝

Figure 4에서는 명령어 튜닝 또한 LLMLingua에서 중요한 단계임을 보여줍니다. 이 단계의 목적은 압축 프롬프트에 사용되는 작은 언어 모델과 LLM 간의 분포 차이를 최소화하는 것입니다.

Figure 7은 명령어 튜닝의 단계를 보여줍니다.

<div class="content-ad"></div>

```
![Image](/assets/img/2024-06-23-AdvancedRAG09PromptCompression_9.png)

## 코드 데모

이제 코드 데모를 시작해 봅시다. 먼저 환경을 설정하세요.

```js
(base) Florian:~ Florian$ conda create -n "llmlingua" python=3.11

(base) Florian:~ Florian$ conda activate llmlingua

(llmlingua) Florian:~ Florian$ pip install llmlingua
```

<div class="content-ad"></div>

설치된 버전은 다음과 같습니다:

```js
llmlingua          0.2.1
```

테스트 코드는 아래와 같습니다:

```js
from llmlingua import PromptCompressor

GSM8K_PROMPT = "질문: 안젤로와 멜라니는 다음 주에 시험을 볼 것으로 계획하기 위해 함께 공부해야 할 시간을 계획하려고 합니다. 그들은 교과서의 2장을 공부하고 메모를 해야 할 4개의 문제지가 있습니다. 그들은 교과서의 각 장에 3시간, 각 문제지에 1.5시간을 할애해야 한다고 생각합니다. 하루에 최대 4시간 공부할 계획이기 때문에, 1시간마다 10분 휴식을 취하고, 하루에 3번 10분짜리 간식 휴식을 취하며, 매일 점심시간에는 30분을 포함한 경우, 그들은 다음 주에 총 몇 일을 공부할 계획이어야 할까요?\n단계별로 생각해 봅시다.\n안젤로와 멜라니는 2장에 각각 3시간을 할애해야 한다고 생각하여 2장 x 3시간 = 총 6시간이 됩니다.\n문제지에는 각 문제지에 1.5시간을 할애할 계획이기 때문에, 1.5시간 x 4개의 문제지 = 총 6시간입니다.\n안젤로와 멜라니는 공부를 시작해야 할 12시간의 계획이 필요한데, 하루에 4시간씩이므로, 12 / 4 = 3일이 필요합니다.\n그러나, 휴식과 점심시간을 포함해야 합니다. 1시간에 10분씩 휴식을 취하고 싶어 한다면, 총 12시간 x 10분 = 휴식을 위해 120분이 더 필요합니다.\n또한 3번의 10분짜리 간식 휴식과 점심시간에 30분을 포함하고 싶어 한다면, 120분 휴식 + 30분 간식 휴식 + 30분 점심시간 = 총 180분, 또는 180 / 60분당 1시간 = 3시간을 더 필요합니다.\n그래서 안젤로와 멜라니는 12시간 공부 + 3시간 휴식을 계획합니다 = 총 15시간을 공부할 계획입니다.\n하루에 4시간씩 공부할 예정이라면, 15시간 / 하루 4시간 = 3.75입니다.\n그들은 필요한 모든 시간을 고려하여 4일을 공부할 계획이어야 합니다.\n답은 4입니다\n\n질문: 동일한 가격으로 4개의 사과 또는 1개의 수박을 구입할 수 있습니다. 오렌지, 사과 및 수박으로 고른 36개의 과일을 구입했으며 1개의 오렌지 가격은 $0.50입니다. 총 청구액이 $66이라면, 1개의 사과는 얼마인가요?\n단계별로 생각해 봅시다.\n만약 36개의 과일이 3종류의 과일로 골고루 나눠졌다면, 나는 각각의 과일을 36/3 = 12개씩 샀습니다.\n만약 1개의 오렌지 비용이 $0.50이라면, 12개의 오렌지는 $0.50 x 12 = $6입니다.\n총 청구액이 $66이며 오렌지에 $6을 썼다면, 다른 2종류의 과일에는 $66 - $6 = $60을 사용했습니다.\n수박 가격을 W로 가정하고, 4개의 사과를 동일한 가격으로 구입할 수 있으며 1개의 사과 가격이 A이라면, 1W=4A입니다.\n우리가 $60에 12개의 수박과 12개의 사과를 샀다면, $60 = 12W + 12A임을 알 수 있습니다.\n1W=4A를 알고 있다면, 위를 $60 = 12(4A) + 12A로 변환할 수 있습니다.\n$60 = 48A + 12A\n$60 = 60A\n그러면 1개의 사과(A)의 가격은 $60/60= $1이 됩니다.\n답은 1입니다\n\n질문: 수지는 800명의 학생이 있는 대형학교에 다니고 있고, 사라는 300명의 학생만 있는 작은 학교에 다니고 있습니다. 수지는 학년 초에 100명의 소셜 미디어 팔로워가 있었습니다. 그녀는 학년 초 첫 주에 40명의 새로운 팔로워를 얻었으며, 그 중 절반을 둘째 주에 얻었고, 그 중 절반을 셋째 주에 얻었습니다. 사라는 학년 초에 시작할 때 50명의 소셜 미디어 팔로워가 있었지만, 첫 주에 90명의 새로운 팔로워를 얻고, 둘째 주에는 그 중 3분의 1을 얻었으며, 셋째 주에는 그 중 3분의 1을 얻었습니다. 3주 후, 가장 많은 총 팔로워를 보유한 소녀는 몇 명의 소셜 미디어 팔로워를 가지고 있습니까?\n단계별로 생각해 봅시다.\n한 주 후, 수지는 100+40 = 140명의 팔로워가 있습니다.\n둘째 주에 수지는 40/2 = 20명의 새로운 팔로워를 얻습니다.\n셋째 주에 수지는 20/2 = 10명의 새로운 팔로워를 얻습니다.\n합계적으로, 수지는 140+20+10 = 총 170명의 팔로워를 가지고 3주를 마칩니다.\n한 주 후, 사라는 50+90 = 140명의 팔로워가 있습니다.\n둘째 주에 사라는 90/3 = 30명의 팔로워를 얻습니다.\n셋째 주에 사라는 30/3 = 10명의 팔로워를 얻습니다.\n그래서 사라는 140+30+10 = 총 180명의 팔로워를 가지고 3주를 마칩니다.\n따라서 수라는 총 180명의 팔로워를 가진 소녀로, 가장 많은 총 팔로워를 가지고 있습니다.\n답은 180입니다"

llm_lingua = PromptCompressor()

## 또는 phi-2 모델을 사용하세요,
# llm_lingua = PromptCompressor("microsoft/phi-2")

## 또

<div class="content-ad"></div>

기본 모델은 처음 실행할 때 다운로드됩니다. 또는 양자화된 모델을 사용할 수도 있습니다. 실행 결과는 아래 그림 8에서 확인할 수 있습니다:

![Figure 8](/assets/img/2024-06-23-AdvancedRAG09PromptCompression_10.png)

# LongLLMLingua

LLMLingua의 문제는 압축 프로세스 중에 사용자 질문을 고려하지 않아 관련 없는 정보를 유지할 수 있다는 것입니다.

<div class="content-ad"></div>

LongLLMLingua는 사용자 질문을 압축 과정에 통합하여 이 문제를 해결하고자 합니다.

![image](/assets/img/2024-06-23-AdvancedRAG09PromptCompression_11.png)

그림 9에 나타난 것처럼 LongLLMLingua는 LLMs(Large Language Models)에서 주요 정보의 인지를 향상시키기 위해 네 가지 새로운 구성 요소를 제안했습니다:

- 질문 인식 코스 그레인 및 파인 그레인 압축
- 문서 재정렬 메커니즘
- 동적 압축 비율
- 서브시퀀스 복구 알고리즘

<div class="content-ad"></div>

## 질문 인식 코어스 그래인드 압축

LongLLMLingua는 다른 맥락 x^doc_k에 의존하는 질문 x^que의 엉킴도를 나타내기 위해 퍼플렉서티를 활용하는 것을 제안합니다. 제한적인 문장 x^restrict = "주어진 문서에서 이 질문에 대한 답변을 얻을 수 있다"는 x^que 뒤에 추가될 수 있습니다. 이 문장은 x^que와 x^doc_k 간의 연결을 강화시키며, 환각 효과를 줄이는 정규화 요소 역할을 합니다. 이는 다음과 같이 표현될 수 있습니다:

```
<img src="/assets/img/2024-06-23-AdvancedRAG09PromptCompression_12.png" />


왜 질문 x^que의 조건 아래 문서 수준의 퍼플렉서티를 계산하지 않는 걸까요? 이는 문서가 종종 관련 없는 정보를 많이 포함하기 때문입니다. x^que에 의존하더라도 전체 문서에 대해 계산된 퍼플렉서티 점수는 충분히 구분되지 않을 수 있으므로, 문서 수준의 압축에는 부적합한 측정 항목이 됩니다.

<div class="content-ad"></div>

해당 코드는 get_distance_longllmlingua 함수에서 찾을 수 있습니다.

## 질문 인식 미세압축

LongLLMLingua는 대조적인 난해도 개념을 소개했습니다.

![이미지](/assets/img/2024-06-23-AdvancedRAG09PromptCompression_13.png)

<div class="content-ad"></div>

먼저, 우리는 질문을 고려하지 않고 토큰의 수수께끼를 계산합니다. 이를 perplexity(x_i | x`i)로 표현합니다. 그런 다음, 우리는 질문을 포함하여 perplexity를 다시 측정합니다. 이 경우 perplexity(x_i | x^que, x`i)로 나타냅니다. 이는 질문 x^que가 주어졌을 때 토큰 x_i 이전의 모든 토큰을 보는 놀라움을 측정합니다.

목표는 각 토큰의 놀람 수준이 질문과 관련하여 어떻게 변하는지 결정하는 것입니다. 질문을 포함할 때 단어가 덜 놀랍다면, 그 단어는 질문과 매우 관련이 있을 수 있습니다.

## 문서 재배열 메커니즘

Figure 10에 나와 있는 것처럼, 추론 과정에서 LLM은 주어의 시작과 끝에서 내용을 사용하는 경향이 있으며, 중간 내용은 무시합니다. 이 문제를 "Lost in the Middle(가운데에서 사라짐)"이라고 합니다.

<div class="content-ad"></div>

<img src="/assets/img/2024-06-23-AdvancedRAG09PromptCompression_14.png" />

Figure 10은 관련 정보가 시작 부분에 위치할 때 LLM이 가장 잘 작동한다는 것을 보여줍니다. 이에 따라 LongLLMLingua는 일반 압축의 결과를 기반으로 단락을 조직화하여 그들을 점수의 내림차순으로 앞에서 뒤로 배열합니다.

<img src="/assets/img/2024-06-23-AdvancedRAG09PromptCompression_15.png" />

## 동적 압축 비율

<div class="content-ad"></div>

문서마다 중요 정보 밀도가 다르기 때문에, 질문과 관련이 더 많은 문서에는 더 많은 예산(즉, 더 낮은 압축 비율)을 할당해야 합니다.

LongLLMLingua는 굵은 압축에서 중요도 점수를 사용하여 미세한 압축 과정 중에 예산 분배를 안내합니다.

특히, LLMLingua의 예산 컨트롤러를 사용하여 보유 문서의 초기 예산을 설정합니다. 그런 다음, 미세 압축 단계에서 각 문서에 압축 예산을 동적으로 할당합니다. 이 할당은 해당 문서의 중요도 점수의 순위 지수에 기반하며, 이는 굵은 압축 단계 중에 결정됩니다.

LongLLMLingua는 적응적 할당을 위해 선형 스케줄러를 사용하며, 각 토큰 xi의 예산을 다음과 같이 정의할 수 있습니다:

<div class="content-ad"></div>


![image](/assets/img/2024-06-23-AdvancedRAG09PromptCompression_16.png)

여기서 Nd는 문서의 수를 나타내며, δτ는 동적 할당의 총 예산을 제어하는 하이퍼파라미터입니다.

해당 코드는 get_dynamic_compression_ratio 함수에서 찾을 수 있습니다.

## 서브시퀀스 복구 알고리즘


<div class="content-ad"></div>

제11 그림에 나와 있듯이, 세밀한 토큰별 압축 과정에서 주요 엔티티의 일부 토큰이 폐기될 수 있습니다. 예를 들어, 원본 프롬프트의 "2009"는 "209"로 압축될 수 있고, "Wilhelm Conrad Rontgen"은 "Wilhelmgen"으로 압축될 수 있습니다.

![그림 1](/assets/img/2024-06-23-AdvancedRAG09PromptCompression_17.png)

LongLLMLingua는 LLM의 응답에서 원본 콘텐츠를 복구할 수 있는 서열 복원 알고리즘을 제안했습니다. 이에 대한 자세한 내용은 제12 그림에 나와 있습니다.

![그림 2](/assets/img/2024-06-23-AdvancedRAG09PromptCompression_18.png)

<div class="content-ad"></div>

기본 프로세스는 다음 단계를 포함합니다:

- LLMs 응답에서 토큰 yl을 트래버스하고 압축된 프롬프트 x˜에 나타나는 가장 긴 부분 문자열 y˜key,l을 선택합니다.
- 원래의 프롬프트 x에서 y˜key,l에 해당하는 최대 공통 최단 부분수열 xi,j를 찾습니다.
- LLMs 응답에서 해당하는 토큰 y˜key,l을 xi,j로 대체합니다.

해당 코드는 함수 recover에서 찾을 수 있습니다.

## 코드 데모스트레이션

<div class="content-ad"></div>

환경 설정 방법은 LLMLingua와 같습니다. 여기에 시험용 코드가 있습니다:

```js
from llmlingua import PromptCompressor

GSM8K_PROMPT = "질문: 앤젤로와 멜라니는 다음 주에 임박한 시험을 위해 얼마나 많은 시간을 함께 공부해야 하는지 계획하려고 합니다. 그들은 공부할 교과서의 장을 2장과 암기해야 할 문제집을 4개 발견했습니다. 그들은 교과서의 장당 3시간, 문제집당 1.5시간을 할애해야 한다고 생각했습니다. 만약 그들이 하루에 최대 4시간을 공부할 계획이고 매 시간마다 10분 휴식을 취하며 매일 3회 10분 간식 휴식과 하루에 30분의 점심 시간을 포함한다면, 다음 주에 총 몇 일 동안 공부할 계획을 세워야 할까요?\n단계별로 생각해 봅시다\n앤젤로와 멜라니는 각 교과서 장에 3시간을 할애해야 한다고 생각했습니다. 2장 x 3시간 = 총 6시간.\n문제집에는 문제집당 1.5시간을 할애할 계획이며 4개의 문제집이 있습니다. 1.5시간 x 4개 = 총 6시간.\n앤젤로와 멜라니는 공부할 12시간의 계획을 시작해야 합니다. 하루에 4시간씩, 12 / 4 = 3일이 필요합니다.\n하지만 휴식과 점심 시간을 고려해야 합니다. 매 시간에 10분 휴식을 취하고 싶어 시간당 총 120분의 공부시간이 있습니다.\n그들은 또한 3회 10분 간식 휴식을 취하고 싶어 하며, 3 x 10분 = 30분.\n그리고 매일 30분의 점심 시간을 포함하고 싶어 하여, 휴식을 위한 120분 + 간식 휴식 30분 + 점심 30분 = 180분, 혹은 180 / 60분 = 3시간이 더 필요합니다.\n그래서 앤젤로와 멜라니는 공부할 12시간 + 휴식 3시간 = 총 15시간의 계획을 세우기를 원합니다.\n하루에 최대 4시간씩 공부할 계획이며, 15시간 / 하루당 4시간 = 3.75\n그들은 필요한 모든 시간을 고려하려면 공부할 일정이 4일이어야 합니다.\n정답은 4입니다\n\n질문: 동일한 가격으로 4개의 사과나 1개의 수박을 구입할 수 있습니다. 주인은 주전에 도전하기로 결심합니다. 그는 $80,000에 집을 사고 $50,000의 수리비를 들였습니다. 집 값은 150% 증가했습니다. 그는 얼마의 이익을 냈습니까?"

QUESTION = "질문: 조쉬는 집을 뒤집어 보기로 결정합니다. 그는 $80,000에 집을 사고 $50,000을 수리합니다. 이로 인해 집 값이 150% 증가했습니다. 그가 얼마의 이익을 냈습니까?"

llm_lingua = PromptCompressor()

compressed_prompt = llm_lingua.compress_prompt(
    GSM8K_PROMPT.split("\n\n")[0],
    question = QUESTION,
    condition_in_question = "after_condition",
    reorder_context = "sort",
    dynamic_context_compression_ratio = 0.3,
    condition_compare = True,
    context_budget = "+100",
    rank_method = "longllmlingua",
)

print('-' * 100)
print("original:")
print(GSM8K_PROMPT.split("\n\n")[0])

print('-' * 100)
print("compressed_prompt:")
print(compressed_prompt)
```

실행 결과는 아래 그림에서 확인할 수 있습니다:

<img src="/assets/img/2024-06-23-AdvancedRAG09PromptCompression_19.png" />

<div class="content-ad"></div>

# AutoCompressor

이전에 언급된 방법과는 다르게, AutoCompressor는 부드러운 프롬프트 기반 접근 방식입니다.

기존 모델을 스마트하게 세밀하게 조정하여 어휘를 확장하고 "요약 토큰" 및 "요약 벡터"를 활용하여 컨텍스트 정보를 간추립니다.

![이미지](/assets/img/2024-06-23-AdvancedRAG09PromptCompression_20.png)

<div class="content-ad"></div>

Figure 14에는 AutoCompressor의 아키텍처가 나와 있습니다. AutoCompressor는 다음 단계에서 작동합니다:

- 어휘 확장: 이 단계는 모델의 기존 어휘에 "요약 토큰"을 추가하는 작업을 포함합니다. 이러한 토큰을 사용하면 모델이 대량의 정보를 더 작은 벡터로 압축할 수 있습니다.
- 문서 분할: 처리할 문서를 작은 세그먼트로 나누고, 각 세그먼트에는 요약 토큰이 추가됩니다. 이러한 토큰은 이전 세그먼트들의 요약 정보도 함께 운반하여 요약 누적을 만듭니다.
- 미세 조정 훈련: AutoCompressor는 "다음 단어 예측" 작업을 활용하여 준지도 학습 방법을 사용하여 모델을 미세 조정합니다. 이 작업의 목표는 현재 토큰 앞의 토큰들과 현재 세그먼트 앞의 세그먼트들의 요약 벡터를 기반으로 다음 단어를 예측하는 것입니다.
- 역전파: AutoCompressor는 각 세그먼트에 대해 시간을 거슬러가는 역전파(BPTT)와 그래디언트 체크포인팅을 사용하여 계산 그래프의 크기를 최소화합니다. 모델이 전체 문서에 대해 역전파를 수행하므로 전체 컨텍스트의 연관성을 학습할 수 있습니다.

## 코드

AutoCompressor는 코드를 제공하고 있으며, 관심 있는 독자들은 시도해볼 수 있습니다.

<div class="content-ad"></div>

```python
import torch
from transformers import AutoTokenizer
from auto_compressor import LlamaAutoCompressorModel, AutoCompressorModel

# 6천개의 토큰을 4개의 압축 단계로 압축하여 훈련된 AutoCompressor를 로드합니다.
tokenizer = AutoTokenizer.from_pretrained("princeton-nlp/AutoCompressor-Llama-2-7b-6k")
# Llama 모델을 실행하려면 bfloat16 + cuda가 필요합니다.
model = LlamaAutoCompressorModel.from_pretrained("princeton-nlp/AutoCompressor-Llama-2-7b-6k", torch_dtype=torch.bfloat16).eval().cuda()

prompt = '현재 미국 대통령의 이름은 "'
prompt_tokens = tokenizer(prompt, add_special_tokens=False, return_tensors="pt").input_ids.cuda()

context = """조 바이든(Joe Biden)은 1942년 11월 20일 필라델피아 주 스크랜턴(Scranton)에서 태어나 중산층 가정에서 자랐습니다. 그는 델라웨어 대학을 졸업하며 역사와 정치학을 복수전공했습니다. 그 후 1968년에 실라큐스 대학 로 스쿨에서 법학 학위를 취득했습니다.
바이든의 정치 경력은 1970년 델라웨어주 뉴캐슬 카운티 의회의 의원으로 선출되면서 시작되었습니다. 1972년 그의 아내 네일리아와 1세 딸 나오미가 차량 사고로 사망하고 아들 베아우와 헌터가 다쳤습니다. 이러한 비극적인 상황에도 불구하고 바이든은 자신의 약속을 지키기로 선택하고 그의 아들들의 침대 옆에서 상원 의원으로 취임했습니다.
바이든은 1973년부터 2009년까지 델라웨어 주 상원의원으로 6회 임기를 보냈습니다. 상원 의원으로 활동하는 동안 바이든은 여러 위원회에 참여했으며 외교 문제에 대한 지식으로 유명했습니다. 그는 여러 차례 상원 외교위원회 위원장으로 활약했습니다.
2008년 조 바이든은 대통령 선거에서 버락 오바마의 동역자로 선택되었습니다. 부통령으로 활동하면서 바이든은 오바마 행정부에서 정책 수립과 경제 회복, 외교 문제, Affordable Care Act (ACA, 일명 오바마케어) 시행 등의 문제를 다루는 데 중요한 역할을 했습니다.
부통령으로 두 기간을 재직한 후 조 바이든은 2020년 대통령 선거에 출마하기로 결정했습니다. 그는 민주당 후보로 확정되어 재집권 중인 도널드 트럼프 대통령과 대선에서 맞붙었습니다. 바이든은 통일을 약속하며 코로나19 대유행, 기후 변화, 인종 정의, 미국 내 부의 불평등 등을 포함한 여러 중요 문제에 대처하겠다고 공약했습니다.
2020년 11월 선거에서 바이든은 승리하고 2021년 1월 20일에 미국 46대 대통령으로 취임했습니다. 78세의 나이로 바이든은 미국 역사상 최고령 대통령이 되었습니다.
대통령으로서 조 바이든은 인프라 투자, 기후 변화 대책, 이민 개혁, 의료 서비스 접근성 확대 등을 중점으로 한 그의 정책을 실행하려고 노력했습니다. 그는 국제 관계에서 외교의 중요성을 강조했고 전 세계 파트너와의 동맹을 새롭게 구축하려고 노력했습니다.
공공분야의 긴 경력 동안 조 바이든은 양당 간의 협력, 공감, 노동 계층 문제에 대한 헌신으로 인해 인정받았습니다. 그는 국가를 향한 직면한 난제를 극복하며 나라를 하나로 이끄고 모든 미국인을 위한 긍정적인 변화를 만들기 위해 계속 노력하고 있습니다."""
context_tokens = tokenizer(context, add_special_tokens=False, return_tensors="pt").input_ids.cuda()

summary_vectors = model(context_tokens, output_softprompt=True).softprompt
print(f"{context_tokens.size(1)}개의 토큰을 {summary_vectors.size(1)}개의 요약 벡터로 압축 중")
# >>> 660개의 토큰을 50개의 요약 벡터로 압축 중

generation_with_summary_vecs = model.generate(prompt_tokens, do_sample=False, softprompt=summary_vectors, max_new_tokens=12)[0]
print("요약 벡터 사용해서 생성:\n" + tokenizer.decode(generation_with_summary_vecs))
# >>> 현재 미국 대통령의 이름은 "조"이며 성은 "바이든"입니다.

next_tokens_without_context = model.generate(prompt_tokens, do_sample=False, max_new_tokens=11)[0]
print("컨텍스트 없이 생성:\n" + tokenizer.decode(next_tokens_without_context))
# >>> 현재 미국 대통령의 이름은 "도널드"이며 성은 "트럼프"입니다.
```

# LLMLingua-2

LLMLingua-2는 LLaMa-7B와 같은 인과 언어 모델로부터 정보 엔트로피를 기반으로 토큰 또는 어휘 단위를 삭제하여 프롬프트를 압축하는 데 두 가지 문제를 식별합니다:

(1) 정보 엔트로피를 결정하는 소형 언어 모델이 프롬프트 압축 목표와 일치하지 않습니다.


<div class="content-ad"></div>

(2) 양방향 컨텍스트를 활용하지 않고 있어서, 빠른 압축을 위해 필요한 모든 정보를 포괄하지 못할 수 있습니다.

이 문제들의 핵심은 정보 엔트로피가 압축에 대한 최적의 척도가 아닐 수 있다는 것입니다.

LLMLingua-2의 전체 아키텍처는 다음과 같이 그림 15에 나와 있습니다:

![LLMLingua-2 Architecture](/assets/img/2024-06-23-AdvancedRAG09PromptCompression_21.png)

<div class="content-ad"></div>

이슈 1을 해결하기 위해 LLMLingua-2는 데이터 증류 과정을 도입했습니다. 이 과정은 LLM에서 지식을 추출하여 중요 정보를 잃지 않으면서 프롬프트를 압축합니다. 동시에 추출형 텍스트 압축 데이터셋을 구축합니다. 이 데이터셋으로 훈련을 진행하면 작은 언어 모델이 프롬프트 압축에 효과적으로 정렬될 수 있습니다.

이슈 2를 해결하기 위해 LLMLingua-2는 프롬프트 압축을 토큰 분류 문제로 다룹니다. 이 접근 방식은 압축된 프롬프트가 원래 프롬프트와 충실하다는 것을 보장합니다. 전이 전체 양방향 컨텍스트에서 프롬프트 압축을 위한 모든 필요한 정보를 캡처하기 위해 트랜스포머 인코더를 사용합니다.

## 효과적인 프롬프트 압축 데이터셋 구축 방법

데이터 증류

<div class="content-ad"></div>

데이터 정제는 GPT-4와 같은 대규모 언어 모델에서 지식을 추출하여 필수 정보를 잃지 않고 프롬프트를 효과적으로 압축하는 것을 의미합니다.

LLMLingua-2에서는 Figure 16에 나와 있는 것처럼 주의 깊게 설계된 지침을 따릅니다. 이러한 지침은 GPT-4로 하여금 원본 텍스트에서 비필수 단어를 제외하고 생성 프로세스 중에 새로운 단어를 추가하지 않으면서 텍스트를 압축하도록 요구합니다.

동시에, 이러한 지침은 압축 비율 제한을 부과하지 않습니다. 대신, GPT-4에게 최대한 많은 정보를 유지한 채 원본 텍스트를 최대한 압축하도록 요청합니다.

<img src="/assets/img/2024-06-23-AdvancedRAG09PromptCompression_22.png" />

<div class="content-ad"></div>

그림 17에서 보듯이, GPT-4는 매우 긴 컨텍스트를 처리할 때 종종 높은 압축 비율을 적용합니다. 이는 긴 컨텍스트를 처리하는 능력이 제한되어 있기 때문일 수 있습니다. 이러한 공격적인 압축은 상당한 정보 손실로 이어지며, 후속 작업의 성능에 상당한 영향을 미칩니다.

![그림](/assets/img/2024-06-23-AdvancedRAG09PromptCompression_23.png)

이 문제를 해소하기 위해 LLMLingua-2는 긴 텍스트를 512 토큰을 초과하지 않는 여러 청크로 나누는 청크 압축 방법을 채택했으며, 그런 다음 GPT-4에게 각 블록을 따로 압축하도록 안내합니다.

데이터 주석화

<div class="content-ad"></div>

현재 데이터 축소를 통해 원본 텍스트와 해당 압축 버전의 쌍을 확보하였습니다. 데이터 주석 작업의 목표는 원본 텍스트의 각 토큰에 이진 레이블을 할당하는 것입니다. 이는 압축 후 해당 토큰을 유지해야 하는지를 결정합니다.

GPT-4가 지시에 엄격하게 따르지 않을 수 있기 때문에, LLMLingua-2는 검색 범위를 제한하기 위해 슬라이딩 윈도우 기술을 사용합니다. 또한 GPT-4의 압축 과정 중 원본 단어에 잠재적인 변경이 발생하는 것을 다루기 위해 퍼지 매칭을 사용합니다.

품질 관리

LLMLingua-2는 GPT-4 축산 및 자동 주석 레이블의 생성된 압축 텍스트의 품질을 평가하기 위해 Variation Rate(VR) 및 Alignment Gap(AG) 두 개의 품질 제어 메트릭을 사용합니다.

<div class="content-ad"></div>

Variation Rate은 압축된 텍스트와 원본 텍스트 중 다른 단어의 백분율을 측정합니다. Alignment Gap은 자동 주석 단어의 품질을 평가합니다.

LLMLingua-2는 이러한 측정치를 사용하여 낮은 품질의 샘플을 제외함으로써 데이터셋의 품질을 보장할 수 있습니다.

## Compressor

이진 분류 문제로 간주됩니다.

<div class="content-ad"></div>

처음에는 프롬프트 압축 문제를 이진 분류 문제로 변환할 수 있습니다. 기본 개념은 각 어휘 단위를 독립적인 엔티티로 고려하고 "유지(preserve)" 또는 "폐기(discard)" 라벨을 할당하는 것입니다. 이 방법은 압축된 프롬프트의 내용의 무결성을 보존하면서 모델의 설계를 간소화합니다.

모델 아키텍처

트랜스포머 인코더 기반 특징 인코더가 사용되고 상단에 선형 분류 레이어가 추가됩니다.

이 아키텍처는 각 어휘 단위의 양방향 컨텍스트 정보를 캡처하여 압축 작업에 필수적인 정보를 제공할 수 있습니다.

<div class="content-ad"></div>

압축 전략

원래 프롬프트 x의 압축 전략은 세 단계로 구성되어 있습니다. 목표 압축 비율은 1/τ로 정의되며, 여기서 τ는 압축된 프롬프트의 단어 수와 원래 프롬프트 x의 단어 수를 나눈 값입니다.

- 먼저, 압축된 프롬프트 x˜에 유지할 토큰의 목표 수를 결정합니다: N˜ = τN.
- 그런 다음, 토큰 분류 모델을 사용하여 각 단어 xi가 '보존'으로 표시될 확률 pi를 예측합니다.
- 마지막으로, 원래 프롬프트 x에서 확률 pi 값이 가장 높은 상위 N˜개의 단어를 보존하여 원래 순서를 유지하고 압축된 프롬프트 x˜를 형성합니다.

## 코드

<div class="content-ad"></div>

위에서 볼 수 있듯이, LLMLingua-2의 주요 작업은 압축기를 구축하는 것입니다. 그렇다면 한 번 획득한 압축기를 어떻게 활용할 수 있을까요?

아래 코드를 참조해 주세요(LLMLingua와 환경 설정 방법은 같습니다). 주요 내부 프로세스는 compress_prompt_llmlingua2 함수에서 확인할 수 있습니다.

```js
from llmlingua import PromptCompressor

PROMPT = "John: So, um, I've been thinking about the project, you know, and I believe we need to, uh, make some changes. I mean, we want the project to succeed, right? So, like, I think we should consider maybe revising the timeline.\n\nSarah: I totally agree, John. I mean, we have to be realistic, you know. The timeline is, like, too tight. You know what I mean? We should definitely extend it."

llm_lingua = PromptCompressor(
    model_name="microsoft/llmlingua-2-xlm-roberta-large-meetingbank",
    use_llmlingua2=True,
)
compressed_prompt = llm_lingua.compress_prompt(PROMPT, rate=0.33, force_tokens=['\n', '?'])

## 또는 LLMLingua-2-small 모델 사용
# llm_lingua = PromptCompressor(
#     model_name="microsoft/llmlingua-2-bert-base-multilingual-cased-meetingbank",
#     use_llmlingua2=True,
# )

print('-' * 100)
print("original:")
print(PROMPT)

print('-' * 100)
print("compressed_prompt:")
print(compressed_prompt)
```

실행 결과는 다음과 같이 나타납니다:

<div class="content-ad"></div>


![이미지](/assets/img/2024-06-23-AdvancedRAG09PromptCompression_24.png)

# RECOMP

RECOMP은 추출 및 요약 두 가지 유형의 훈련된 압축기를 소개합니다. 추출 압축기는 검색된 문서에서 유용한 문장을 선택하고, 추상적 압축기는 여러 문서에서 정보를 결합하여 요약을 생성합니다.

Figure 19은 RECOMP에서 압축기의 위치를 보여줍니다.


<div class="content-ad"></div>


<img src="/assets/img/2024-06-23-AdvancedRAG09PromptCompression_25.png" />

## 추출 압축기

입력 문서 세트에서 n개의 문장 [s1, s2, …, sn]가 주어지면, 이중 인코더 모델을 학습합니다. 이 모델은 문장 si와 입력 시퀀스 x를 고정 차원 임베딩으로 임베딩합니다. 이러한 임베딩의 내적은 입력 x에 si를 추가하여 대상 출력 시퀀스를 생성할 때 LLM에게 얻는 혜택을 나타냅니다.

압축기에서 최종 요약 s는 입력과의 내적에 따라 순위가 매겨진 상위 N개의 문장으로 구성됩니다.


<div class="content-ad"></div>

## 추상 압축기

추상 압축기는 인코더-디코더 모델입니다. 입력 시퀀스 x와 검색된 문서 세트의 연결을 가져와서 요약 s를 출력합니다.

이 방법은 LLM(예: GPT-3과 비슷한 모델)을 사용하여 훈련 데이터 세트를 생성하고 이 데이터를 필터링한 다음 필터링된 데이터 세트로 인코더-디코더 모델을 훈련하는 것을 포함합니다.

## 코드

<div class="content-ad"></div>

RECOMP의 코드는 아직 초기 단계에 있기 때문에 여기에서는 시연하지 않습니다. 관심 있는 독자들은 직접 시도해 볼 수 있습니다.

# 결론

이 기사에서는 프롬프트 압축 방법을 도입하였습니다. 방법 분류, 알고리즘 원칙 및 코드 설명에 대한 정보가 포함되어 있습니다.

논의된 방법 중 LongLLMLingua가 우수한 선택일 수 있습니다. 이미 연구 프로젝트에서 구현하였습니다. LongLLMLingua의 단점이나 더 나은 방법이 발견되면 기사를 업데이트하겠습니다. 또한, LLMLingua-2도 시도해볼 수 있으며, 속도와 메모리 사용에 이점을 가지고 있습니다.

<div class="content-ad"></div>

RAG 기술에 관심이 있다면, 제 다른 기사들도 확인해보세요.

그리고 최신 AI 관련 콘텐츠는 제 뉴스레터에서 찾을 수 있어요.

마지막으로, 이 기사에 오류나 누락된 내용이 있다면 또는 궁금한 점이 있다면 댓글 섹션에 남겨주세요.