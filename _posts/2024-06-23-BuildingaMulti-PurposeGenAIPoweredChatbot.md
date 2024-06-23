---
title: "다양한 용도로 활용 가능한 GenAI 기반 챗봇 만들기 방법"
description: ""
coverImage: "/assets/img/2024-06-23-BuildingaMulti-PurposeGenAIPoweredChatbot_0.png"
date: 2024-06-23 20:05
ogImage: 
  url: /assets/img/2024-06-23-BuildingaMulti-PurposeGenAIPoweredChatbot_0.png
tag: Tech
originalTitle: "Building a Multi-Purpose GenAI Powered Chatbot"
link: "https://medium.com/towards-data-science/building-a-multi-purpose-genai-powered-chatbot-db20f1f81d90"
---



![이미지](/assets/img/2024-06-23-BuildingaMulti-PurposeGenAIPoweredChatbot_0.png)

대형 언어 모델(LLM)은 엄청난 파워를 지니고 있으며, 질문 응답, 요약, entity 추출 등 다양한 NLP 작업을 해결하는 데 도움이 될 수 있습니다. 생성형 AI 사용 사례가 계속 확장됨에 따라 종종 현실 세계 응용프로그램에서는 이러한 NLP 작업 중 여러 가지를 해결할 수 있는 능력이 필요합니다. 예를 들어 사용자가 상호 작용할 수 있는 챗봇이 있다면, 대화 내용을 요약하는 것이 일반적인 요청이 될 수 있습니다. 이는 의사-환자 대화 기록, 가상 전화/예약 등 다양한 상황에서 활용될 수 있습니다.

이러한 유형의 문제를 해결하는 방법은 무엇일까요? 질문 응답을 위한 하나, 요약을 위한 다른 하나의 LLM을 사용할 수 있습니다. 또 다른 접근 방식은 동일한 LLM을 다양한 도메인에 대해 파인 튜닝하는 것일 수 있지만, 이 경우엔 전자의 접근 방식에 초점을 맞출 것입니다. 그러나 여러 LLM을 사용하면 해결해야 할 특정한 도전 과제들이 있습니다.

심지어 하나의 모델을 호스팅하는 것은 계산적으로 많은 비용이 소요되며, 대형 GPU 인스턴스가 필요합니다. 여러 LLM을 보유하면 모두에 대한 지속적인 엔드포인트/하드웨어가 필요할 것입니다. 이는 또한 여러 엔드포인트를 관리하고 인프라를 제공하기 위해 추가 비용이 발생한다는 것을 의미합니다.

<div class="content-ad"></div>

SageMaker 추론 컴포넌트를 사용하여이 문제를 해결할 수 있습니다. 추론 컴포넌트를 사용하면 단일 엔드포인트에 여러 가지 모델을 호스팅 할 수 있습니다. 각 모델은 고유 한 컨테이너를 가지고 있으며 모델별로 일정한 하드웨어를 할당하고 확장할 수 있습니다. 이를 통해 단일 엔드포인트 뒤에 두 개의 모델을 가지고 비용과 성능을 최적화 할 수 있습니다.

오늘의 기사에서는 질문 응답과 요약이 가능한 일반적인 AI 기반 챗봇을 만드는 방법을 살펴보겠습니다. 여기서 사용할 도구 몇 가지를 간단히 살펴보겠습니다:

- SageMaker 추론 컴포넌트: 모델을 호스팅하기 위해 SageMaker Real-Time 추론을 사용할 것입니다. Real-Time 추론 내에서 추론 컴포넌트 기능을 사용하여 여러 모델을 호스팅하고 각 모델에 대해 하드웨어를 할당할 것입니다. 추론 컴포넌트에 대해 처음이라면 이곳의 시작 기사를 참조해주세요.
- Streamlit: Streamlit은 웹 개발을 간단하게하는 오픈 소스 Python 라이브러리입니다. Streamlit을 사용하여 질문 응답 및 요약을 위한 ChatBot UI를 구축할 것입니다. Streamlit을 처음 사용하는 경우 Heiko Hotz의 시작 기사를 참조하여 UI를 구축하는 데 템플릿으로 사용할 수 있습니다.
- 모델
- 질문 응답 모델: 챗봇의 질문 응답 부분에는 Llama7B Chat 모델을 사용할 것입니다. Llama7B Chat은 채팅 중심 대화에 최적화되어 있습니다. 사용할 모델 서버/컨테이너는 DJL Serving에서 제공되는 AWS Large Model 추론 (LMI) 컨테이너입니다. LMI 컨테이너를 사용하면 모델 파티션 및 배치 및 양자화와 같은 기타 최적화가 가능합니다. 기존 LMI Llama 7B Chat 배포 예제를 사용하여 모델 아티팩트를 빌드할 것입니다.
- 요약 모델: 대화의 요약에 대해, Karthick Kaliannan Neelamohan (Apache 2.0 라이센스)에 의해 파인튜닝 된 HuggingFace Hub 모델을 사용할 것입니다. 기본 모델은 BART이며 이미 인기있는 SAMSUM 및 DIALOGSUM 데이터 세트에서 파인튜닝되었습니다. 자체 모델과 데이터가있는 경우 직접 파인튜닝도 가능합니다.

이제 다룰 다양한 구성 요소를 이해했으니 예제로 바로 들어가 봅시다!

<div class="content-ad"></div>

# 주의: 본 기사는 Python, LLMs 및 Amazon SageMaker 인퍼런스에 대한 중급 이해를 전제로 합니다. Amazon SageMaker 인퍼런스를 시작하는 데 도움이 될 것으로 보입니다.

### 면책 조항: 저는 AWS의 머신러닝 아키텍트이며 제 의견은 제 개인적인 것입니다.

## 목차

- 설정 및 엔드포인트 생성
- 인퍼런스 컴포넌트 배포
  a. Llama7B 챗 인퍼런스 컴포넌트 생성
  b. BART 요약 인퍼런스 컴포넌트 생성
- Streamlit UI 생성 및 데모
- 추가 자료 및 결론

<div class="content-ad"></div>

# 1. 설정 및 엔드포인트 생성

개발을 위해 SageMaker Studio에서 ml.c5.xlarge 인스턴스와 conda_python3 커널을 사용할 것입니다. SageMaker 엔드포인트 및 추론 구성 요소를 생성하기 위해 AWS Boto3 Python SDK 및 상위 수준 SageMaker Python SDK를 사용할 것입니다.

```python
import boto3
import sagemaker
import time
from time import gmtime, strftime

# 설정
client = boto3.client(service_name="sagemaker")
runtime = boto3.client(service_name="sagemaker-runtime")
boto_session = boto3.session.Session()
s3 = boto_session.resource('s3')
region = boto_session.region_name
sagemaker_session = sagemaker.Session()
bucket = sagemaker_session.default_bucket()
role = sagemaker.get_execution_role()
print(f"Role ARN: {role}")
print(f"Region: {region}")

# 클라이언트 설정
s3_client = boto3.client("s3")
sm_client = boto3.client("sagemaker")
smr_client = boto3.client("sagemaker-runtime")
```

추론 구성 요소를 만들기 전에 먼저 SageMaker 실시간 엔드포인트를 만들어야 합니다. 여기에서 인스턴스 유형, 수량 및 엔드포인트 수준에서 관리되는 AutoScaling을 활성화합니다.

<div class="content-ad"></div>

위의 표를 마크다운 형식으로 변경해 주세요.

우녕하세울나, 이것은 모델/추론 컴포넌트 수준에서 AutoScaling을 활성화하는 방법과는 다릅니다. 거기서는 각 추론 컴포넌트마다 AutoScaling 정책을 적용하여 모델 복사본 수를 조절할 수 있습니다. 각 모델 복사본은 추론 컴포넌트에 할당된 하드웨어 양을 유지합니다. 엔드포인트 수준에서 관리되는 AutoScaling을 설정하면 활성화한 추론 컴포넌트 수준의 스케일링을 처리할 충분한 컴퓨팅 자원이 있는지 확인해야 합니다. 엔드포인트 수준에서 자체 AutoScaling 정책을 정의할 수도 있지만, 여기에서 컴포넌트 및 엔드포인트 수준의 정책 간의 충돌 가능성에 유의해야 합니다.

```js
# Container Parameters, increase health check for LLMs: 
variant_name = "AllTraffic"
instance_type = "ml.g5.12xlarge" # 하나의 인스턴스 당 4개의 GPU
model_data_download_timeout_in_seconds = 3600
container_startup_health_check_timeout_in_seconds = 3600

# 엔드포인트 수준에서 관리되는 AutoScaling 설정
initial_instance_count = 1
max_instance_count = 2
print(f"초기 인스턴스 수: {initial_instance_count}")
print(f"최대 인스턴스 수: {max_instance_count}")
```

또한 LLMs를 처리하기 위해 컨테이너 레벨 매개변수를 활성화하고 최소 미해결 요청(LOR) 라우팅을 활성화합니다.

```js
# 엔드포인트 구성 생성
endpoint_config_response = client.create_endpoint_config(
    EndpointConfigName=epc_name,
    ExecutionRoleArn=role,
    ProductionVariants=[
        {
            "VariantName": variant_name,
            "InstanceType": instance_type,
            "InitialInstanceCount": 1,
            "ModelDataDownloadTimeoutInSeconds": model_data_download_timeout_in_seconds,
            "ContainerStartupHealthCheckTimeoutInSeconds": container_startup_health_check_timeout_in_seconds,
            "ManagedInstanceScaling": {
                "Status": "ENABLED",
                "MinInstanceCount": initial_instance_count,
                "MaxInstanceCount": max_instance_count,
            },
            # 가장 적은 미해결 또는 임의로 설정할 수 있음: https://aws.amazon.com/blogs/machine-learning/minimize-real-time-inference-latency-by-using-amazon-sagemaker-routing-strategies/
            "RoutingConfig": {"RoutingStrategy": "LEAST_OUTSTANDING_REQUESTS"},
        }
    ],
)

# 엔드포인트 생성
endpoint_name = "ic-ep-chatbot" + strftime("%Y-%m-%d-%H-%M-%S", gmtime())
create_endpoint_response = client.create_endpoint(
    EndpointName=endpoint_name,
    EndpointConfigName=epc_name,
)
print("엔드포인트 Arn: " + create_endpoint_response["EndpointArn"])
```

<div class="content-ad"></div>

내부에서 우리의 엔드포인트를 만든 후에는 두 가지 다른 모델을 나타내는 두 가지 추론 컴포넌트를 추가할 수 있습니다.

## 2. 추론 컴포넌트 배포

추론 컴포넌트는 단일 모델 컨테이너를 나타냅니다. 일반적으로 추론 컴포넌트를 생성하려면 SageMaker 모델 객체를 참조하고 모델 데이터 및 컨테이너 정보를 상속받을 수 있습니다. 이 정보 외에 할당하는 컴퓨팅 및 모델의 복사본 수를 추가할 수 있습니다. 각 복사본은 초기에 할당한 추론 컴포넌트에 지정된 것과 동일한 컴퓨팅을 가질 것입니다.

### a. Llama7B 채팅 추론 컴포넌트 생성

<div class="content-ad"></div>

"Llama7B Chat"에는 DJL Serving에서 제공되는 LMI 컨테이너를 사용할 예정입니다. LMI 컨테이너를 사용하면 serving.properties 파일을 지정하여 작업 중인 모델과 일괄 처리 및 양자화와 같은 기타 최적화를 지정할 수 있습니다.

```js
engine=MPI
option.model_id=TheBloke/Llama-2-7B-Chat-fp16
option.task=text-generation
option.trust_remote_code=true
option.tensor_parallel_degree=1
option.max_rolling_batch_size=32
option.rolling_batch=lmi-dist
option.dtype=fp16
```

"model_id" 매개변수는 작업 중인 모델을 지정합니다. 이 경우, 모델 가중치는 HuggingFace Model ID에서 지정된 것을 가져옵니다. 사용자 지정으로 사전 조정된 모델이있는 경우 해당 모델 가중치의 S3 경로를 지정할 수 있습니다. 이 serving 파일과 함께 사용자 지정 사전/후 처리 또는 사용자 고유의 모델 로딩 로직이 있는 경우 추론 스크립트를 지정할 수 있습니다. 이를 구성한 후에는 SageMaker 모델 개체에 대해 예상대로 model.tar.gz를 만들고 사용 중인 컨테이너(관리되는 컨테이너 또는 자체 컨테이너)를 지정합니다.

```js
%%sh
# tarball 생성
mkdir mymodel
rm mymodel.tar.gz
mv serving.properties mymodel/
mv model.py mymodel/
tar czvf mymodel.tar.gz mymodel/
rm -rf mymodel
```

<div class="content-ad"></div>

```js
# 이미지 가져오기
image_uri = sagemaker.image_uris.retrieve(
        framework="djl-deepspeed",
        region=sagemaker_session.boto_session.region_name,
        version="0.26.0"
    )
print(f"사용 중인 이미지: {image_uri}")

# SageMaker 모델 객체 생성
from sagemaker.utils import name_from_base
llama_model_name = name_from_base(f"Llama-7b-chat")
print(llama_model_name)

create_model_response = sm_client.create_model(
    ModelName=llama_model_name,
    ExecutionRoleArn=role,
    PrimaryContainer={"Image": image_uri, "ModelDataUrl": code_artifact},
)
model_arn = create_model_response["ModelArn"]

print(f"모델 생성됨: {model_arn}")
```

추론 구성 요소에서는 SageMaker 모델 객체에서 이 메타데이터를 상속할 수 있습니다. 이 외에도 컴퓨팅 요구 사항과 복사본 수를 지정합니다. Llama7B Chat의 경우 한 복사본 당 하나의 GPU를 지정합니다.

```js
llama7b_ic_name = "llama7b-chat-ic" + strftime("%Y-%m-%d-%H-%M-%S", gmtime())
variant_name = "AllTraffic"

# llama 추론 컴포넌트 반응
create_llama_ic_response = sm_client.create_inference_component(
    InferenceComponentName=llama7b_ic_name,
    EndpointName=endpoint_name,
    VariantName=variant_name,
    Specification={
        "ModelName": llama_model_name,
        "ComputeResourceRequirements": {
            # llama 7b 채팅에는 하나의 GPU가 필요합니다
            "NumberOfAcceleratorDevicesRequired": 1,
            "NumberOfCpuCoresRequired": 1,
            "MinMemoryRequiredInMb": 1024,
        },
    },
    # 복사본에 대한 자동 스케일링 설정 가능, 각 복사본은 할당한 하드웨어를 유지합니다
    RuntimeConfig={"CopyCount": 1},
)

print("IC Llama Arn: " + create_llama_ic_response["InferenceComponentArn"])
```

추론 컴포넌트를 생성한 후 샘플 추론을 실행하여 추론 컴포넌트 이름을 헤더로 지정할 수 있습니다.

<div class="content-ad"></div>

```js
import json
content_type = "application/json"
chat = [
  {"role": "user", "content": "안녕하세요, 어떻게 지내세요?"},
  {"role": "assistant", "content": "저는 잘 지내고 있어요. 오늘 어떻게 도와드릴까요?"},
  {"role": "user", "content": "저는 기계 학습에 대해 더 배우고 싶은 소프트웨어 엔지니어입니다."},
]

payload = {"chat": chat, "parameters": {"max_tokens":256, "do_sample": True}
response = smr_client.invoke_endpoint(
    EndpointName=endpoint_name,
    InferenceComponentName=llama7b_ic_name, # IC 이름 지정
    ContentType=content_type,
    Body=json.dumps(payload),
)
result = json.loads(response['Body'].read().decode())
print(type(result['content']))
print(type(result))
```

## b. BART Summarization 추론 컴포넌트 생성

BART 추론 컴포넌트의 생성은 Llama7B 채팅 컴포넌트와 매우 유사합니다. 주요 차이점은 사용하는 컨테이너가 다르기 때문에 모델 데이터와 이미지 URI의 패키지화 방법이 다를 것입니다. 이 경우에는 HuggingFace PyTorch 이미지를 사용하고 HuggingFace 모델 ID와 해결하려는 NLP 작업을 지정합니다.

```js
from sagemaker.utils import name_from_base

bart_model_name = name_from_base(f"bart-summarization")
print(bart_model_name)

# 필요한 경우 귀하의 지역으로 교체
hf_transformers_image_uri = '763104351884.dkr.ecr.us-east-1.amazonaws.com/huggingface-pytorch-inference:1.13.1-transformers4.26.0-cpu-py39-ubuntu20.04'

# 환경 변수
env = {'HF_MODEL_ID': 'knkarthick/MEETING_SUMMARY',
      'HF_TASK':'summarization',
      'SAGEMAKER_CONTAINER_LOG_LEVEL':'20',
      'SAGEMAKER_REGION':'us-east-1'}

create_model_response = sm_client.create_model(
    ModelName=bart_model_name,
    ExecutionRoleArn=role,
    # 이 경우 HF Hub로 직접 모델 데이터를 가리키는 데이터 포인트 없음
    PrimaryContainer={"Image": hf_transformers_image_uri, 
                      "Environment": env},
)
model_arn = create_model_response["ModelArn"]
print(f"생성된 모델: {model_arn}")
```

<div class="content-ad"></div>

한 번 더 SageMaker Model 객체를 Inference 구성 요소에 전달하고 모델에 필요한 하드웨어를 지정합니다.

```js
bart_ic_name = "bart-summarization-ic" + strftime("%Y-%m-%d-%H-%M-%S", gmtime())
variant_name = "AllTraffic"

# BART inference component reaction
create_bart_ic_response = sm_client.create_inference_component(
    InferenceComponentName=bart_ic_name,
    EndpointName=endpoint_name,
    VariantName=variant_name,
    Specification={
        "ModelName": bart_model_name,
        "ComputeResourceRequirements": {
            # will reserve one GPU
            "NumberOfAcceleratorDevicesRequired": 1,
            "NumberOfCpuCoresRequired": 8,
            "MinMemoryRequiredInMb": 1024,
        },
    },
    # can setup autoscaling for copies, each copy will retain the hardware you have allocated
    RuntimeConfig={"CopyCount": 1},
)

print("IC BART Arn: " + create_bart_ic_response["InferenceComponentArn"])
```

Inference 구성 요소가 모두 생성되면 SageMaker Studio UI에서 시각화할 수 있습니다:

<img src="/assets/img/2024-06-23-BuildingaMulti-PurposeGenAIPoweredChatbot_1.png" />

<div class="content-ad"></div>

# 3. Streamlit UI 생성 및 데모

이제 SageMaker 엔드포인트와 추론 컴포넌트를 생성했으니, 이 모든 것을 Streamlit 애플리케이션에서 함께 사용할 수 있습니다. 나중에 호출할 기준으로 환경 변수를 설정해줍니다.

```js
import json
import os
import streamlit as st
from streamlit_chat import message
import boto3

smr_client = boto3.client("sagemaker-runtime")
os.environ["endpoint_name"] = "여기에 엔드포인트 이름 입력"
os.environ["llama_ic_name"] = "여기에 llama IC 이름 입력"
os.environ["bart_ic_name"] = "여기에 bart IC 이름 입력"
```

또한 사용자 입력, 모델 출력 및 채팅 대화를 유지하기 위해 Streamlit 세션 상태 변수를 설정합니다. 대화를 지우는 클리어 버튼을 만들어 이 버튼을 클릭하면 우리가 정의한 상태 변수를 재설정합니다.

<div class="content-ad"></div>

```python
# 세션 상태 변수에 사용자 및 모델 입력을 저장합니다.
if 'generated' not in st.session_state:
    st.session_state['generated'] = []
if 'past' not in st.session_state:
    st.session_state['past'] = []
if 'chat_history' not in st.session_state:
    st.session_state['chat_history'] = []

# 클리어 버튼
clear_button = st.sidebar.button("대화 지우기", key="clear")
# 클릭 시 모든 것 초기화
if clear_button:
    st.session_state['generated'] = []
    st.session_state['past'] = []
    st.session_state['chat_history'] = []
```

사용자 입력을 받기 위한 제출 버튼을 생성하고, 이 버튼을 클릭하면 Llama7B 채팅 모델이 호출됩니다.

```python
if submit_button and user_input:
    st.session_state['past'].append(user_input)
    model_input = {"role": "user", "content": user_input}
    st.session_state['chat_history'].append(model_input)
    payload = {"chat": st.session_state['chat_history'], "parameters": {"max_tokens":400, "do_sample": True,
                                                                        "maxOutputTokens": 2000}
    # Llama 호출
    response = smr_client.invoke_endpoint(
        EndpointName=os.environ.get("endpoint_name"),
        InferenceComponentName=os.environ.get("llama_ic_name"), # IC 이름 지정
        ContentType="application/json",
        Body=json.dumps(payload),
    )
    full_output = json.loads(response['Body'].read().decode())
    print(full_output)
    display_output = full_output['content']
    print(display_output)
    st.session_state['chat_history'].append(full_output)
    st.session_state['generated'].append(display_output)
```

다음 명령으로 앱을 시작하면 UI를 볼 수 있으며 작동 중인 질문 응답 채팅 모델을 확인할 수 있습니다.


<div class="content-ad"></div>

```js
streamlit run app.py
```

<img src="/assets/img/2024-06-23-BuildingaMulti-PurposeGenAIPoweredChatbot_2.png" />

사이드에는 요약 버튼도 만들어 봅시다:

```js
summarize_button = st.sidebar.button("대화 요약", key="summarize")
```

<div class="content-ad"></div>


<img src="/assets/img/2024-06-23-BuildingaMulti-PurposeGenAIPoweredChatbot_3.png" />

요약 후에 미세 조정된 BART 모델을 호출합니다. BART 모델의 경우 입력이 모델이 이해할 수 있는 형식으로 구조화되어야 합니다. 다음과 유사한 형식으로 구조화된 입력을 원합니다:

<img src="/assets/img/2024-06-23-BuildingaMulti-PurposeGenAIPoweredChatbot_4.png" />

"chat_history" 상태 변수에 입력 및 출력을 모두 캡처하여 모델에 맞게 형식화하고 BART Inference Component를 호출합니다.


<div class="content-ad"></div>

```js
# 요약을 위한
if summarize_button:
    st.header("Summary")
    st.write("요약 생성 중....")
    chat_history = st.session_state['chat_history']
    text = ''''''
    for resp in chat_history:
        if resp['role'] == "user":
            text += f"Ram: {resp['content]}\n"
        elif resp['role'] == "assistant":
            text += f"AI: {resp['content']}\n"
    summary_payload = {"inputs": text}
    summary_response = smr_client.invoke_endpoint(
        EndpointName=os.environ.get("endpoint_name"),
        InferenceComponentName=os.environ.get("bart_ic_name"),  # IC 이름 지정
        ContentType="application/json",
        Body=json.dumps(summary_payload),
    )
    summary_result = json.loads(summary_response['Body'].read().decode())
    summary = summary_result[0]['summary_text']
    st.write(summary)
```

![이미지](/assets/img/2024-06-23-BuildingaMulti-PurposeGenAIPoweredChatbot_5.png)

# 4. 추가 자료 및 결론

전체 예제 코드는 위 링크에서 찾을 수 있습니다. 다중 LLM(Large Language Model)을 실제 사례에 대해 비용 효율적이고 성능 효율적으로 활용하는 방법을 보여주는 좋은 예제였기를 희망합니다.


<div class="content-ad"></div>

위에서 논의한 주제와 그 외에도 더 다뤄볼 GenAI/AWS 기사와 심층적인 내용을 기대해주세요. 항상 읽어주셔서 감사합니다. 의견이 있으시면 언제든지 남겨주세요. 

이 기사가 마음에 드셨다면 LinkedIn에서 저와 연결하고 제 Medium 뉴스레터를 구독해보세요.