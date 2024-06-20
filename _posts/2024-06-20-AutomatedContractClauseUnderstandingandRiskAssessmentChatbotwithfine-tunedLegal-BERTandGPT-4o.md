---
title: "자동 계약 조항 이해 및 위험 평가 챗봇 Legal-BERT 및 GPT-4o 세밀하게 조정하기"
description: ""
coverImage: "/assets/img/2024-06-20-AutomatedContractClauseUnderstandingandRiskAssessmentChatbotwithfine-tunedLegal-BERTandGPT-4o_0.png"
date: 2024-06-20 18:50
ogImage: 
  url: /assets/img/2024-06-20-AutomatedContractClauseUnderstandingandRiskAssessmentChatbotwithfine-tunedLegal-BERTandGPT-4o_0.png
tag: Tech
originalTitle: "Automated Contract Clause Understanding and Risk Assessment Chatbot with fine-tuned Legal-BERT and GPT-4o"
link: "https://medium.com/@prakarsha/automated-contract-clause-understanding-and-risk-assessment-with-fine-tuned-legal-bert-and-gpt-4o-3a6f0423ace3"
---


![이미지](/assets/img/2024-06-20-AutomatedContractClauseUnderstandingandRiskAssessmentChatbotwithfine-tunedLegal-BERTandGPT-4o_0.png)

# 소개

계약은 비즈니스 거래에 있어서 근본적인 역할을 합니다. 그러나 수동으로 계약 분석을 하는 것은 시간이 많이 소요되며 오류가 발생할 수 있습니다. 이 프로세스를 자동화함으로써 시간을 절약할 뿐만 아니라 철저하고 일관된 위험 평가를 보장할 수 있습니다. 본 프로젝트에서는 Legal-BERT와 GPT-4o를 활용하여 계약 조항 이해와 위험 평가를 자동화하는 AI 도구를 개발했습니다.

# 왜 계약 분석을 자동화해야 하는가?

<div class="content-ad"></div>

계약 분석은 법적 준수와 비즈니스 전략에 있어 중요합니다. 자동화된 도구들은 주요 조항을 신속하게 식별하고 위험을 평가하며 자세한 설명을 제공하는 데 도움을 줄 수 있습니다. 이는 법률 전문가와 비즈니스에게 귀중한 자산이 될 것입니다.

# 사용된 기술

## 모델 소개:

Legal-BERT: Legal-BERT는 법적 텍스트의 대규모 말뭉치에 대해 세밀하게 조정된 BERT(Bidirectional Encoder Representations from Transformers)의 특수한 변형입니다. 이는 법적 자연어 처리 작업을 지원하기 위해 법적 언어에 대해 더 정확하고 맥락적으로 관련성 있는 임베딩을 제공하도록 설계되었습니다.

<div class="content-ad"></div>

GPT-4o: GPT-4o는 인간과 유사한 텍스트를 이해하고 생성할 수 있는 고급 언어 모델입니다. 자세하고 일관성 있는 설명을 생성하는 데 특히 유용하며, 위험 평가 작업에 적합합니다.

## 데이터셋:

LegalBench: LegalBench 데이터셋은 LLMs에서 법률 추론을 평가하기 위한 포괄적인 벤치마크입니다. 규정, 판례 및 계약과 같은 다양한 법률 텍스트를 포함하므로 현실적인 법률 작업에 대한 모델을 훈련하고 평가하는 데 이상적입니다.

## 도구:

<div class="content-ad"></div>

Streamlit: Streamlit은 데이터 과학 및 기계 학습 프로젝트를 위한 상호 작용 웹 애플리케이션을 만들 수 있게 해주는 Python 라이브러리입니다. 이 프로젝트에서는 계약 조항 분류 및 리스크 평가 시스템에 사용자 친화적 인터페이스를 구축하는 데 사용됩니다.

Huggingface Transformers: Huggingface Transformers 라이브러리는 BERT와 GPT와 같은 사전 훈련된 모델에 쉽게 액세스할 수 있습니다. 특정 작업에 대한 이러한 모델을 세밀하게 조정하고 애플리케이션에 통합하는 프로세스를 간소화합니다.

# 프로젝트 아키텍처

![Project Architecture](/assets/img/2024-06-20-AutomatedContractClauseUnderstandingandRiskAssessmentChatbotwithfine-tunedLegal-BERTandGPT-4o_1.png)

<div class="content-ad"></div>

프로젝트의 워크플로우를 개요로 설명한 아키텍처 다이어그램이 있습니다. 프로세스는 계약 조항 텍스트 입력으로 시작되며, 먼저 Legal BERT 모델을 사용하여 분류됩니다. 그 다음으로, 해당 조항은 GPT-4o를 활용한 위험 분석이 수행됩니다. 마지막으로, 분류 및 위험 분석 결과가 다른 GPT-4o 모델에 의해 통합되어 종합적인 출력 보고서로 형식화됩니다. 이 아키텍처는 잠재적 위험을 평가하기 위해 계약 조항을 자동으로 평가하는 효율적이고 자동화된 시스템을 보장합니다.

# 데이터셋 요약 📜

LegalBench 데이터셋은 대형 언어 모델(Large Language Models, LLMs)에서 법적 추론을 평가하기 위해 선별된 162가지 작업들을 컬렉션한 포괄적인 데이터셋입니다. 이러한 작업들은 40명의 참여자들에 의해 기여되었으며, 이진 분류, 다중 분류, 추출, 생성, 연역 등 다양한 유형을 포함합니다. 법률 텍스트는 법전, 사법 판례, 계약서 등 다양한 분야의 법률 텍스트가 포함되어 있습니다. 각 작업은 법률적 맥락에서 LLMs의 성능을 벤치마킹하기 위해 설계된 학습 및 평가 분할을 포함하고 있습니다. 자세한 정보는 LegalBench 웹사이트를 방문해 주세요.

# 데이터 처리

<div class="content-ad"></div>

첫 번째 단계는 계약 조항 데이터 세트를 처리하는 것입니다. 이 데이터 세트에는 감사 조항인지 아닌지를 나타내는 레이블이 지정된 조항이 포함되어 있습니다. 데이터는 정리되고 전처리되어 BERT 토크나이저와 호환되도록 보장됩니다. 이 단계는 Legal BERT 모델의 미세 조정을 위해 데이터를 준비하는 데 중요합니다.

데이터 세트는 그런 다음 train, test 및 validation 세 부분으로 분할됩니다. 훈련 및 검증 데이터 세트는 모델을 훈련하는 데 사용되며, 테스트 데이터 세트는 모델을 보이지 않은 데이터로 평가하는 데 예약됩니다. 훈련 및 검증 데이터 세트는 토큰화되어 Legal BERT 모델의 미세 조정 과정에 공급할 준비가 되어 있습니다. 이를 통해 모델이 효과적으로 학습하고 새로운, 보이지 않는 계약 조항에도 잘 일반화될 수 있도록 합니다.

```js
# 토크나이저 및 모델 초기화
tokenizer = BertTokenizer.from_pretrained('nlpaueb/legal-bert-base-uncased')
model = BertForSequenceClassification.from_pretrained('nlpaueb/legal-bert-base-uncased', num_labels=2)
model.to(device)

# 입력 데이터를 토큰화
train_encodings = tokenizer(train_data['cleaned_text'].tolist(), truncation=True, padding=True, max_length=512)
val_encodings = tokenizer(val_data['cleaned_text'].tolist(), truncation=True, padding=True, max_length=512)

# 레이블을 텐서로 변환
train_labels = torch.tensor(train_data['answer'].apply(lambda x: 1 if x.lower() == "yes" else 0).tolist())
val_labels = torch.tensor(val_data['answer'].apply(lambda x: 1 if x.lower() == "yes" else 0).tolist())

# 데이터셋 클래스 생성
class LegalDataset(torch.utils.data.Dataset):
    def __init__(self, encodings, labels):
        self.encodings = encodings
        self.labels = labels

    def __getitem__(self, idx):
        item = {key: torch.tensor(val[idx]) for key, val in self.encodings.items()}
        item['labels'] = self.labels[idx]
        return item

    def __len__(self):
        return len(self.labels)

# 데이터셋 생성
train_dataset = LegalDataset(train_encodings, train_labels)
val_dataset = LegalDataset(val_encodings, val_labels)
```

# LEGAL-BERT: 로스쿨에서 나온 머펫들

<div class="content-ad"></div>

LEGAL-BERT는 법적 NLP 작업에 특화된 BERT 모델로, 다양한 영어 법률 텍스트 12GB를 사전 훈련했습니다. 이 모델은 법적 연구, 컴퓨팅 법률, 그리고 법률 기술 응용 프로그램을 지원하며, 일반 BERT 모델보다 도메인 특화 작업에서 우수한 성과를 거두고 있습니다.

![Legal-BERT](/assets/img/2024-06-20-AutomatedContractClauseUnderstandingandRiskAssessmentChatbotwithfine-tunedLegal-BERTandGPT-4o_2.png)

## Legal-BERT 세밀 조정

처리된 데이터셋을 사용하여 Legal BERT 모델을 계약 조항을 분류하는 작업에 특히 맞게 세밀 조정할 수 있습니다. 강건한 모델 성능을 보장하기 위해 K-폴드 교차 검증 방법이 채택되었습니다.

<div class="content-ad"></div>

## 왜 K-Fold 교차 검증을 사용해야 할까요?

K-Fold 교차 검증은 데이터 세트를 약간의 동일한 크기로 k개의 하위 세트(폴드)로 분할하는 것을 포함합니다. 모델은 k-1개의 폴드에서 훈련을 받고 남은 폴드에서 유효성을 검사합니다. 이 프로세스는 각각 다른 폴드를 유효성 검사 세트로 사용하여 k번 반복됩니다. 결과는 모델 성능의 더 신뢰할 수 있는 추정을 제공하기 위해 평균화됩니다.

```js
kf = StratifiedKFold(n_splits=5)
accuracies, precisions, recalls, f1s = [], [], [], []
texts = train_data['cleaned_text']
labels = train_data['answer']
i=0
for train_index, val_index in kf.split(texts, labels):
    train_texts = texts[texts.index.isin(train_index)]
    val_texts = texts[texts.index.isin(val_index)]
    train_labels = labels[labels.index.isin(train_index)]
    val_labels = labels[labels.index.isin(val_index)]

    # 새 모델 초기화
    model = BertForSequenceClassification.from_pretrained('nlpaueb/legal-bert-base-uncased', num_labels=2)
    tokenizer = BertTokenizer.from_pretrained('nlpaueb/legal-bert-base-uncased')
    model.to(device)

    accuracy, precision, recall, f1 = train_and_evaluate(train_texts, train_labels, val_texts, val_labels, model, tokenizer)

    accuracies.append(accuracy)
    precisions.append(precision)
    recalls.append(recall)
    f1s.append(f1)

    model.save_pretrained('fine-tuned-legal-bert-fold'+str(i))
    tokenizer.save_pretrained('fine-tuned-legal-bert-fold'+str(i))
    i+=1
```

이 기술은 모델이 데이터의 다른 하위 집합에서 평가되어 과적합을 완화시키며 정확도, 정밀도, 재현율 및 F1 점수의 포괄적인 평가를 제공합니다. K-Fold 교차 검증을 사용함으로써, 모델이 훈련 데이터뿐만 아니라 새로운, 보지 못한 데이터에 대해 효과적으로 잘 작동하는 것을 보장할 수 있습니다.

<div class="content-ad"></div>

학습 결과 해석

![image](/assets/img/2024-06-20-AutomatedContractClauseUnderstandingandRiskAssessmentChatbotwithfine-tunedLegal-BERTandGPT-4o_3.png)

세밀하게 조정된 모델들이 모든 지표에서 무려나게 조금 가르치지 않은 Legal-BERT 모델을 능가하여 학습 과정의 효과를 입증합니다. 가르치지 않은 모델의 낮은 정확도와 정밀도는 올바른 분류에 어려움을 겪으며 높은 재현율에도 불구하고 그것을 보여줍니다. 반면에 k-fold 교차 검증을 통해 평가된 세밀하게 조정된 모델들은 높은 정확도, 정밀도, 재현율, 그리고 F1 점수로 균형 잡힌 성능을 보여 주어 모델이 과적합 없이 잘 일반화되었음을 입증합니다. 이 유효성 검사 방법은 견고한 모델 평가를 보장하여 서로 다른 데이터 분할에서의 일관된 성능 향상을 강조합니다.

# 리스크 분석

<div class="content-ad"></div>

법적 BERT 모델을 세밀 조정한 후, 새로운 계약 조항을 분류하는 데 사용됩니다. 분류된 조항은 그 후 GPT-4o에 전달되어 리스크 분석을 진행합니다. GPT-4o는 고급 자연어 이해 능력을 활용하여 조항과 관련된 잠재적인 위험을 식별합니다. 이 분석은 가능한 법적 영향과 우려 사항에 대한 자세한 통찰력을 제공합니다.

```js
def run_riskAnalysis(clause):
    # GPT-4o를 활용한 리스크 분석
    risk_template = "당신은 법률 자문가입니다. 주어진 조항에서 잠재적인 위험을 식별하세요."
    prompt = clause
    response = openai.ChatCompletion.create(
        model="gpt-4o",
        messages=[
            {"role": "system", "content": risk_template},
            {"role": "user", "content": prompt}
        ]
    )
    return response['choices'][0]['message']['content']
```

# 두 모델의 응답 통합

분류 및 위험 분석 결과를 얻은 후, 우리는 출력을 통합하여 일관된 보고서로 만듭니다. GPT-4o를 다시 활용하여 분류 레이블과 식별된 위험을 종합 설명에 결합합니다. 이 통합 단계는 최종 보고서가 명확하고 정보 제공이며 실행 가능하도록 보장함으로써 사용자가 계약 조항의 잠재적인 위험을 이해하기 쉽게 만듭니다.

<div class="content-ad"></div>

```python
# ChatCompletion endpoint를 사용하여 prompt를 실행하는 기능
def run_gpt_integration(classification_label, risk_analysis, clause):
    prompt = (
        f"'{classification_label}'로 분류된 계약 조항입니다:\n\n"
        f"'{clause}'\n\n"
        f"이 조항에서 식별된 잠재적 위험은 다음과 같습니다:\n{risk_analysis}\n\n"
    )
    response = openai.ChatCompletion.create(
        model="gpt-4o",
        messages=[
            {"role": "system", "content": "당신은 법률 자문사입니다. 이 조항, 그 분류, 그리고 식별된 위험에 대한 통합된, 일관된 설명을 제공해주세요. 다음 템플릿에 맞춰 응답해주세요:"},
            {"role": "user", "content": prompt}
        ]
    )
    return response['choices'][0]['message']['content']
```

# 챗봇 구축하기

시스템을 사용자 친화적으로 만들기 위해 Streamlit을 사용하여 챗봇을 만들 수 있습니다. 챗봇 인터페이스를 통해 사용자들이 계약 조항을 입력하고 실시간으로 분류 및 위험 분석 결과를 받을 수 있습니다. 이 챗봇은 분류를 위해 섬세하게 튜닝된 Legal BERT 모델과 위험 분석 및 설명을 생성하기 위해 GPT-4o를 활용합니다. 인터페이스에는 전문적인 외관을 위한 사용자 정의 스타일링이 포함되어 있어 사용자 경험을 향상시키며 계약 분석을 위한 직관적인 도구를 제공합니다.

```python
# Streamlit 앱
st.title("계약 조항 분류 및 위험 탐지")

# 채팅 기록 초기화
if "messages" not in st.session_state:
    st.session_state.messages = []

if st.session_state.messages:
    for i, chat in enumerate(st.session_state.messages):
        message(chat['question'], is_user=True, key=f"user_{i}", avatar_style="big-smile")
        message(chat['answer'], key=f"bot_{i}")
else:
    st.markdown("아직 채팅 기록이 없습니다. 계약 조항을 입력하여 시작해보세요.")

user_input = st.chat_input(placeholder="계약 조항을 입력하세요...")

if user_input:
    with st.spinner('분석 중입니다. 잠시 기다려주세요...'):
        response = classify_and_analyze_clause(user_input)
    response = classify_and_analyze_clause(user_input)
    st.session_state.messages.append({"question": user_input, "answer": "\n"+response})
    st.experimental_rerun()
```

<div class="content-ad"></div>

# 챗봇 데모

아래 영상에서 작동 중인 챗봇을 확인해주세요. 코드는 제 깃헙 저장소에서 확인할 수 있습니다.

챗봇의 샘플 응답

```js
### 조항 설명과 리스크 평가

**조항:**
'각 당사자는 기본 당사자가 합의한 감사 권리를 제공하기 위해 시급한 조항, 그 적합성을 동반하지 않는 부회사 또는 다른 계열사(온라인 그룹 또는 해당되는 경우 Skype 그룹의 부회사 또는 다른 계열사를 의미)에게 타당한 타당성을 부여해야 한다.'

**조항 분류**: 감사 조항

### 설명:
이 조항은 양 당사자가 부회사 및 다른 계열사가 기본 당사자 자신이 합의한 감사 권리를 제공하도록 보장하도록 요구하는 바입니다. 이 조항은 응시 그룹 또는 Skype 그룹과 관련된 특히 '온라인 그룹' 또는 'Skype 그룹'에 관한 계열사 또는 계열사를 명시합니다.

### 잠재적인 위험:
1. **범위의 모호함**: '온라인 그룹' 및 'Skype 그룹'에 대한 명확한 정의의 부족으로 인해 어떤 기관이 이러한 범주에 속하는지에 대해 혼란을 초래할 수 있으며, 감사 권리의 범위와 적용에 대한 분쟁을 유발할 수 있습니다.

2. **부회사 및 계열사에 대한 통제**: 조항의 효과는 각 당사자가 가진 부회사 및 계열사의 준수를 강제할 수 있는 능력에 달려 있습니다. 당사자가 이러한 기관들에 충분한 통제 능력을 가지지 못한 경우, 이로 인해 준수하지 않고 계약 위반으로 이어질 위험이 있습니다.

3. **부회사/계열사의 동의**: 부회사 및 계열사는 자체적인 거버넌스를 갖고 있을 수 있으며 외부 감사 요구에 저항할 수 있습니다. 이로 인해 법적 도전이나 운영상의 침략이 발생할 수 있습니다.

4. **개인정보 보호 및 기밀성 우려**: 감사는 민감한 데이터에 접근할 수 있습니다. 부회사 및 계열사에게 감사 권리를 확장함으로써 기밀 정보에 접근할 수 있는 기관 수가 증가하며, 중대한 프라이버시 및 기밀성 문제를 겪을 수 있습니다.

5. **관할권 문제**: 여러 관할권에서 운영하는 부회사 및 계열사는 감사 권리의 범위 및 강제성에 영향을 미치는 현지 법률의 영향을 받을 수 있습니다. 각 나라에는 데이터 보호 및 감사 관행에 관한 독특한 규정이 있습니다.

6. **운영 장애**: 강제 감사는 부회사나 계열사의 정상 운영을 방해할 수 있으며 특히 규모나 지리적으로 분산된 경우 중요한 운영 효율을 저해할 수 있습니다.

7. **강제 가능성**: 복잡한 구조나 간접적인 통제를 갖고 있는 부회사와 계열사에 걸친 감사 권리를 실질적으로 집행하는 것은 어려울 수 있습니다. 이는 상당한 집행 어려움을 일으킬 수 있습니다.

### 완화 권고사항:
식별된 위험을 대처하기 위해 다음과 같이 조항을 수정하는 것을 고려해보세요:

- **범위 명확히 정의**: 감사 권리가 적용되는 기관을 명확하게 구분하여 '온라인 그룹' 및 'Skype 그룹'과 같은 모호한 용어를 제거하세요.
- **집행 가능성 확인**: 각 당사자가 부회사 및 계열사의 준수를 실질적으로 시행할 수 있는지 확인하세요. 통제에 관한 제한 사항을 평가하고 공개하세요.
- **부회사/계열사의 동의**: 부회사 및 계열사로부터 동의를 얻는 필요성과 절차에 대한 규정을 포함하여 그들의 거버넌스 구조를 고려하세요.
- **데이터 개인정보 준수**: 해당되는 데이터 보호 및 개인정보 보호법과 일치하는지 확인하고 민감한 정보 보호를 위한 보호 장치를 추가할 수 있도록 보장하세요.
- **실질적인 고려사항**: 운영상의 방해와 무능률을 완화하기 위해 감사 범위와 빈도에 합리적인 제한 사항을 포함하세요.

조항의 복잡성과 잠재적인 영향을 고려하여 실무, 법률 및 운영적 현실과 조화를 이루도록 사용자 정의하는 것을 강력히 권장합니다.
```

<div class="content-ad"></div>

# 참고 자료

- LegalBench 데이터셋
- LegalBench 연구 논문
- Legal-BERT 사전 학습 모델
- Legal-BERT 연구 논문
- Hugging Face Transformers
- OpenAI API
- Streamlit
- k-fold Cross-Validation에 대한 친절한 소개
- Fine Tuned Legal-Bert
- Github 코드