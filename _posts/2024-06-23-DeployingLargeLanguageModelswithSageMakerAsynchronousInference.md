---
title: "SageMaker 비동기 추론으로 대형 언어 모델 배포하는 방법"
description: ""
coverImage: "/assets/img/2024-06-23-DeployingLargeLanguageModelswithSageMakerAsynchronousInference_0.png"
date: 2024-06-23 19:59
ogImage: 
  url: /assets/img/2024-06-23-DeployingLargeLanguageModelswithSageMakerAsynchronousInference_0.png
tag: Tech
originalTitle: "Deploying Large Language Models with SageMaker Asynchronous Inference"
link: "https://medium.com/towards-data-science/deploying-large-language-models-with-sagemaker-asynchronous-inference-c00038b70b3e"
---


<img src="/assets/img/2024-06-23-DeployingLargeLanguageModelswithSageMakerAsynchronousInference_0.png" />

LLM(대규모 언어 모델)은 인기를 얻고 있으며 이를 추측하는 방법도 늘어가고 있습니다. LLM 호스팅에는 모델의 크기와 배포된 하드웨어의 최적 사용을 보장해야 한다는 어려움이 잘 알려져 있습니다. LLM 사용 사례도 다양합니다. 어떤 것은 실시간 응답 시간이 필요할 수 있고, 다른 것은 거의 실시간 기반의 지연 시간 요구 사항일 수 있습니다.

후자와 더 많은 오프라인 추측 사용 사례를 위해, SageMaker 비동기 추론이 좋은 옵션으로 제공됩니다. 비동기 추론에서는 이름에서 알 수 있듯이 지연 시간이 굉장히 엄격하지 않지만 필요에 따라 호출하고 확장할 수 있는 활성화된 엔드포인트가 필요합니다. 특히 LLM에서 이러한 유형의 작업 부하는 내용 편집/생성, 요약 등과 같은 사용 사례로 인해 점점 인기를 얻고 있습니다. 이러한 작업 부하들은 하위 초 단위 응답이 필요하지는 않지만 필요에 따라 호출할 수 있는 적시의 추론을 필요로 하며, SageMaker Batch Transform과 같은 완전히 오프라인적인 성격과는 대조적입니다.

이 예시에서는 HuggingFace 텍스트 생성 추론 서버를 SageMaker 비동기 엔드포인트와 함께 사용하여 Flan-T-5-XXL 모델을 호스팅하는 방법을 살펴볼 것입니다.

<div class="content-ad"></div>

참고: 본 글은 Python, LLMs 및 Amazon SageMaker에 대한 기본적인 이해를 전제로 합니다. Amazon SageMaker 추론을 시작하려면 다음 가이드를 참조해주세요. SageMaker 비동기 추론의 기초를 다룰 것이지만 더 깊은 소개를 원하시면 다음에 나오는 스타터 예제를 참조해주세요.

공지: 저는 AWS의 머신 러닝 아키텍트이며, 이견은 제 개인적인 의견입니다.

# 목차

- SageMaker 비동기 추론을 사용하는 시점
- TGI 비동기 추론 구현
   a. 설정 및 엔드포인트 배포
   b. 비동기 추론 호출
   c. 자동 스케일링 설정
- 추가 자료 및 결론

<div class="content-ad"></div>

# 1. SageMaker 비동기 추론 사용 시점

SageMaker 추론은 현재 사용 사례에 따라 활용할 수 있는 네 가지 옵션이 있습니다. 세 가지 엔드포인트 기반 옵션이 있고 완전 오프라인 추론을 위한 한 가지 옵션이 있습니다:

- 엔드포인트 기반 옵션:
    - SageMaker 실시간 추론: 서브초/밀리초 응답 시간과 고 처리량 워크로드를 위한 옵션입니다. 이 엔드포인트는 CPU, GPU 또는 Inferentia 칩을 활용하며 하드웨어 단계에서 AutoScaling을 적용하여 인프라를 확장할 수 있습니다. 일반적인 사용 사례로는 Ad-Tech 기반 예측, 실시간 챗봇 등이 있습니다.
    - SageMaker 서버리스 추론: 갑작스럽고 간헐적인 워크로드에 최적화되어 있으며 cold-start를 허용할 수 있는 옵션입니다 (Provisioned Concurrency를 통해 완화할 수 있음). 여기서는 엔드포인트 뒤에 있는 모든 인프라를 관리하지 않으며 확장은 자동으로 처리됩니다.
    - SageMaker 비동기 추론: 오늘 다룰 옵션으로, 비동기 추론을 통해 거의 실시간 기반의 응답 시간 요구 사항을 충족하고 여전히 엔드포인트를 위해 정의한 전용 하드웨어를 사용합니다. 그러나 비동기 추론의 경우 실시간 추론과 달리 0 개의 인스턴스로 축소할 수 있는 옵션이 있습니다. 비동기 추론을 통해 내장 큐를 사용하여 요청을 관리하고이 큐의 가득 찬 정도에 따라 확장할 수 있습니다.

- 오프라인 추론:
    - SageMaker 배치 변환: 데이터셋이 있고 데이터셋으로 반환된 출력만 필요할 때 최적입니다. 영구적인 엔드포인트는 없으며 완전히 오프라인 추론입니다. 일반적인 사용 사례로는 특정 주기에 추론이 필요한 데이터셋이 있는 경우 일정 시간에 배치 변환 작업을 실행하는 것이 있습니다.

이 사용 사례에서는 특히 비동기 추론에 초점을 맞추고 있습니다. 이 옵션은 거의 실시간 능력과 0 인스턴스로 축소할 수 있는 능력 때문에 Batch Transform과 Real-Time Inference 사이에서 결혼 생각할 수 있는 옵션입니다. 즉시 생성이 필요하지 않은 사용 사례를 위한 LLM을 호스팅하는 데 효율적인 방법으로 기능을 제공할 수 있습니다.

<div class="content-ad"></div>

이러한 사용 사례의 예시로는 요약, 콘텐츠 생성, 편집 등이 있습니다. 이러한 사용 사례는 모두 가변 시간에 activation이 필요할 수 있으므로 지속적인 엔드포인트가 필요하지만 실시간 추론의 응답 시간은 필요로 하지 않을 수도 있습니다. 비동기 추론을 통해 성능과 비용 측면에서 이러한 종류의 사용 사례들을 다룰 수 있습니다.

오늘의 예시로, 우리는 인기 있는 Flan 모델을 SageMaker 비동기 추론에 적용해 보겠습니다. SageMaker 비동기 추론 엔드포인트를 생성하는 것은 실시간 엔드포인트 생성과 매우 유사합니다. 주요 차이점은 실시간 추론처럼 페이로드를 직접 전달하는 대신 입력 데이터에 대한 S3 경로가 필요하다는 점입니다.

![이미지](/assets/img/2024-06-23-DeployingLargeLanguageModelswithSageMakerAsynchronousInference_1.png)

비동기 엔드포인트 내에는 내부 대기열도 있음을 유의해야 합니다. 모든 추론마다 SageMaker는 요청을 대기열에 넣고 결과 위치를 S3에 반환합니다. 비동기 엔드포인트에 대해 AutoScaling을 구성할 때 이 대기열 내의 요청 수에 따라 스케일을 조정할 수 있습니다. 또한 출력 S3 경로에서 직접 폴링하는 대신 성공 또는 오류 있는 추론 알림을 수신하기 위해 선택적으로 SNS 토픽을 통합할 수도 있습니다.

<div class="content-ad"></div>

이제 비동기 추론에 대한 이해가 조금 더 깊어졌으니 구현부로 넘어가 봅시다!

# 2. TGI 비동기 추론 구현

우리는 새로운 SageMaker Studio 환경에서 Base Python3 커널과 ml.c5.xlarge 인스턴스로 작업할 것입니다. 비동기 추론을 위해 익숙한 Boto3 AWS Python SDK 및 상위 레벨 SageMaker Python SDK를 사용할 것입니다.

## a. 설정 및 엔드포인트 배포

<div class="content-ad"></div>

비동기 추론을 사용하려면 먼저 데이터가 저장될 출력 S3 경로를 정의해야 합니다.

```js
sagemaker_session = sagemaker.Session()
default_bucket = sagemaker_session.default_bucket()
bucket_prefix = "async-llm-output"
async_output_path = f"s3://{default_bucket}/{bucket_prefix}/output"
print(f"내 모델 추론 결과는 다음 S3 경로에 저장될 것입니다: {async_output_path}")
```

그런 다음 이 S3 경로를 사용하여 비동기 추론 구성을 지정할 수 있습니다. 이 경우 SNS 주제를 지정하지 않지만, 성공적이거나 오류가 발생했을 때 서비스를 통해 알림을받기를 원하는 경우 선택적으로 포함할 수 있습니다.

```js
from sagemaker.async_inference.async_inference_config import AsyncInferenceConfig

async_config = AsyncInferenceConfig(
    output_path=async_output_path,
    max_concurrent_invocations_per_instance=10,
    # 선택적으로 Amazon SNS 주제 지정
    # notification_config = {
    # "SuccessTopic": "arn:aws:sns:<aws-region>:<account-id>:<topic-name>",
    # "ErrorTopic": "arn:aws:sns:<aws-region>:<account-id>:<topic-name>",
    # }
)
```

<div class="content-ad"></div>

이 정의된 후에는 Flan T-5-XXL 모델을 위한 HuggingFace Hub 링크에서 SageMaker 코드를 직접 가져올 수 있습니다. 이 코드는 Text Generation Inference 모델 서버를 활용하며, Tensor Parallelism과 같은 내장 최적화가 포함되어 있습니다.

```js
# huggingface hub에서 배포 코드 직접 가져와서 비동기 구성 추가
hub = {
   'HF_MODEL_ID':'google/flan-t5-xxl',
   'SM_NUM_GPUS': json.dumps(4)
}

huggingface_model = HuggingFaceModel(
   image_uri=get_huggingface_llm_image_uri("huggingface",version="1.1.0"),
   env=hub,
   role=role, 
)
```

그런 다음 SageMaker 모델 객체와 비동기 구성을 함께 사용하여 엔드포인트를 생성할 수 있습니다.

```js
# SageMaker 추론을 위해 모델 배포
predictor = huggingface_model.deploy(
 initial_instance_count=1,
 instance_type="ml.g5.12xlarge",
 container_startup_health_check_timeout=300,
 async_inference_config=async_config
)
```

<div class="content-ad"></div>

콘솔 또는 UI에서 엔드포인트가 비동기 타입으로 지정되었음을 확인할 수 있습니다.

![image](/assets/img/2024-06-23-DeployingLargeLanguageModelswithSageMakerAsynchronousInference_2.png)

## b. 비동기 추론 호출

단일 페이로드로 엔드포인트를 호출하려면 실시간 추론과 같이 "predict" 내장 메소드를 사용할 수 있습니다.

<div class="content-ad"></div>

```js
# 단일 호출

payload = "미국의 수도는 어디인가요?"
input_data = {
    "inputs": payload,
    "parameters": {
        "early_stopping": True,
        "length_penalty": 2.0,
        "max_new_tokens": 50,
        "temperature": 1,
        "min_length": 10,
        "no_repeat_ngram_size": 3,
        },
}
predictor.predict(input_data)
```

그러나 현실적인 사용 사례에 대한 비동기 추론을 확장하려면 S3에서 데이터로 엔드포인트를 호출할 수 있습니다. 비동기 추론의 아이디어는 여러 요청이 입력 S3 버킷에 저장되어 있고 호출은 각 데이터 포인트에 대한 결과와 해당하는 S3 출력 파일을 반환한다는 것입니다. 여기서 한 가지 더 강조하고 싶은 것은 전체 데이터 집합이 처리되고 요청에 의해 호출할 엔드포인트가 없는 Batch Transform과 다르다는 점입니다.

이제 우리는 이 데모를 위해 동일한 데이터포인트를 가진 가짜 데이터 집합을 만들어 S3로 옮기겠습니다. 다음 코드는 입력 파일을 포함하는 로컬 디렉터리를 생성합니다:

```py
import json
import os

output_directory = 'inputs'
os.makedirs(output_directory, exist_ok=True)

for i in range(1, 20):
    json_data = [input_data.copy()]

    file_path = os.path.join(output_directory, f'input_{i}.jsonl')
    with open(file_path, 'w') as input_file:
        for line in json_data:
            json.dump(line, input_file)
            input_file.write('\n')
```

<div class="content-ad"></div>

이미 제공된 유틸리티 함수를 사용하여 로컬 파일을 S3에 업로드하여 추론할 수 있습니다.

```js
def upload_file(input_location):
    prefix = f"{bucket_prefix}/input"
    return sagemaker_session.upload_data(
        input_location,
        bucket=default_bucket,
        key_prefix=prefix,
        extra_args={"ContentType": "application/json"} # 꼭 지정해야함
    )

sample_data_point = upload_file("inputs/input_1.jsonl")
print(f"샘플 데이터 포인트가 업로드되었습니다: {sample_data_point}")
```

그런 다음 Boto3 SDK를 통해 "invoke_endpoint_async" API 호출로이 S3 경로에서 샘플 추론을 실행할 수 있습니다.

```js
import boto3
runtime = boto3.client("sagemaker-runtime")

response = runtime.invoke_endpoint_async(
    EndpointName=predictor.endpoint_name,
    InputLocation=sample_data_point,
    Accept='application/json',
    ContentType="application/json"
)

output_location = response["OutputLocation"]
print(f"출력 위치: {output_location}")
```

<div class="content-ad"></div>

한 번 더 제공된 유틸리티 함수를 사용하여 출력 파일의 출력을 관찰합니다. LLM을 사용하여 실제 추론을 수행하고 S3 파일을 생성하는 데 시간이 걸릴 수 있습니다. 따라서 제공된 함수에서는 화면에 표시할 내용이 포함된 데이터 파일이 나타날 때까지 데이터 파일을 확인합니다.

```js
import urllib, time
from botocore.exceptions import ClientError

# 함수 참조/크레딧: https://github.com/aws/amazon-sagemaker-examples/blob/main/async-inference/Async-Inference-Walkthrough-SageMaker-Python-SDK.ipynb
def get_output(output_location):
    output_url = urllib.parse.urlparse(output_location)
    bucket = output_url.netloc
    key = output_url.path[1:]
    while True:
        try:
            return sagemaker_session.read_s3_file(bucket=output_url.netloc, key_prefix=output_url.path[1:])
        except ClientError as e:
            if e.response["Error"]["Code"] == "NoSuchKey":
                print("output을 기다리는 중...")
                time.sleep(60)
                continue
            raise

output = get_output(output_location)
print(f"Output: {output}")
```

그런 다음 모든 샘플 데이터 포인트를 실행하여 모든 입력 파일에서 추론을 수행할 수 있습니다:

```js
inferences = []
for i in range(1, 20):
    input_file = f"inputs/input_{i}.jsonl"
    input_file_s3_location = upload_file(input_file)
    print(f"{input_file}을 사용하여 Endpoint를 호출 중")
    async_response = predictor.predict_async(input_path=input_file_s3_location)
    output_location = async_response.output_path
    print(output_location)
    inferences += [(input_file, output_location)]
    time.sleep(0.5)

for input_file, output_location in inferences:
    output = get_output(output_location)
    print(f"입력 파일: {input_file}, 출력: {output}")
```

<div class="content-ad"></div>

<img src="/assets/img/2024-06-23-DeployingLargeLanguageModelswithSageMakerAsynchronousInference_3.png" />

## c. AutoScaling 설정

비동기 추론에서 자동 스케일링은 실시간 추론과 마찬가지로 Application AutoScaling을 통해 설정됩니다. 이곳에서의 차이점은 스케일링할 수 있는 새로운 메트릭이 있다는 점입니다.

비동기 추론 내에서 이미 구현된 내부 대기열이 있음을 이해했듯이, 자동 스케일링은 이 대기열에 있는 항목의 수에 따라 확장하거나 축소할 수 있습니다. 이는 CloudWatch 메트릭 "ApproximateBackLogSize"로 캡처됩니다. 이 요청은 이미 처리 중인 것이거나 아직 처리되지 않은 것입니다.

<div class="content-ad"></div>

Real-Time Inference와 비슷한 방식으로 Boto3 SDK를 사용하여 정책을 설정했습니다. 최소 인스턴스 수를 0으로 정의했는데, 이 기능은 Asynchronous Inference에서만 지원됩니다.

```js
client = boto3.client(
    "application-autoscaling"
)  # SageMaker를 포함한 다른 서비스의 Application Auto Scaling을 나타내는 일반 클래스

resource_id = (
    "endpoint/" + predictor.endpoint_name + "/variant/" + "AllTraffic"
)  # application autoscaling이 엔드포인트를 참조하는 형식

# 비동기 엔드포인트에서 인스턴스 수를 0으로 설정하여 Autoscaling 구성
response = client.register_scalable_target(
    ServiceNamespace="sagemaker",
    ResourceId=resource_id,
    ScalableDimension="sagemaker:variant:DesiredInstanceCount",
    MinCapacity=0,
    MaxCapacity=5,
)
```

최소 및 최대 인스턴스 수를 지정한 후, 확장 및 축소에 대한 쿨다운 기간을 정의할 수 있습니다. 여기에서 "MetricName"을 "ApproximateBackLogSize" 메트릭으로 지정하였음을 알려드립니다.

```js
response = client.put_scaling_policy(
    PolicyName="Invocations-ScalingPolicy",
    ServiceNamespace="sagemaker",  # 리소스를 제공하는 AWS 서비스의 이름 공간
    ResourceId=resource_id,  # 엔드포인트 이름
    ScalableDimension="sagemaker:variant:DesiredInstanceCount",  # SageMaker는 인스턴스 수만 지원
    PolicyType="TargetTrackingScaling",  # 'StepScaling'|'TargetTrackingScaling'
    TargetTrackingScalingPolicyConfiguration={
        "TargetValue": 5.0,  # 메트릭의 목표 값 - 여기서 메트릭은 SageMakerVariantInvocationsPerInstance입니다.
        "CustomizedMetricSpecification": {
            "MetricName": "ApproximateBacklogSizePerInstance",
            "Namespace": "AWS/SageMaker",
            "Dimensions": [{"Name": "EndpointName", "Value": predictor.endpoint_name}],
            "Statistic": "Average",
        },
        "ScaleInCooldown": 600,  # 쿨다운 기간은 이전 작업의 영향이 나타나기 전에 추가 인스턴스를 시작하거나 종료하는 것을 방지합니다.
        "ScaleOutCooldown": 100,  # ScaleOutCooldown - 확장 작업 완료 후 다른 확장 작업을 시작하기 전의 시간 간격.
    },
)
```

<div class="content-ad"></div>

AutoScaling을 테스트하려면 일정 기간 동안 요청을 보낼 수 있습니다. 스케일링 정책에 따르면 대상 값은 엔드포인트 뒤에 있는 큐에서 아직 처리 중이거나 처리되지 않은 요청 또는 호출을 5회로 설정됩니다.

```js
request_duration = 60 * 15 # 15분
end_time = time.time() + request_duration
print(f"{request_duration}초 동안 테스트가 실행됩니다.")
while time.time() < end_time:
    predictor.predict(input_data)
```

일정 시간 동안 요청을 보내지 않은 후에는 인스턴스 수가 제로로 축소되고, 큐가 완전히 비어 있는 것을 주의하세요:

![이미지](/assets/img/2024-06-23-DeployingLargeLanguageModelswithSageMakerAsynchronousInference_4.png)

<div class="content-ad"></div>

# 3. 추가 자료 및 결론

전체 예제 코드는 위 링크에서 찾을 수 있습니다. SageMaker 비동기 추론은 전적으로 실시간이나 일괄 처리가 아닌 특정 LLM 사용 사례에 사용할 수 있는 기능입니다. 이 기사가 귀하에게 LLM을 규모 확장하여 인퍼런스를 제공하는 다른 방법에 대한 유용한 소개였기를 바랍니다. 이 분야에서 더 많은 콘텐츠를 기대해 주세요!

항상 읽어 주셔서 감사합니다. 읽은 후 의견을 자유롭게 남겨 주세요.

이 기사를 즐겁게 보셨다면 LinkedIn에서 저와 연락하고 Medium 뉴스레터를 구독해 주시기 바랍니다.