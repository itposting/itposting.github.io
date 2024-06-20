---
title: "페도라 40에서 AMD ROCm을 활용한 Running Llama와 Stable Diffusion"
description: ""
coverImage: "/assets/img/2024-06-19-RunningLlamaandStableDiffusionwithAMDROCmonFedora40_0.png"
date: 2024-06-19 04:33
ogImage: 
  url: /assets/img/2024-06-19-RunningLlamaandStableDiffusionwithAMDROCmonFedora40_0.png
tag: Tech
originalTitle: "Running Llama and Stable Diffusion with AMD ROCm on Fedora 40"
link: "https://medium.com/@seancheo/running-generative-ai-on-amd-in-fedora-40-28aa3bebb187"
---


![이미지](/assets/img/2024-06-19-RunningLlamaandStableDiffusionwithAMDROCmonFedora40_0.png)

생성적 AI에서 AMD가 얼마나 실용적인지 궁금하신가요? 기업 측면에서, TensorWave는 AMD의 하드웨어가 Nvidia보다 우위를 지을 수 있다고 주장하고 있으며, Lamini은 AMD에서 솔루션을 이미 1년 이상 실행 중입니다.

하지만 저는 기업 AI 배포에서 활동하는 것은 아닙니다. 저는 생성적 AI를 적용하는 방법을 배우는 사용자로, 새로운 개발 사항을 확인하면서 기업 측면을 따라가고 있습니다.

작년에 자신의 PC에서 LLM을 실행하려고 시도했을 때 많은 문제를 마주쳤습니다. Fedora에서 AMD의 ROCm을 설정하는 방법에 대해 Anvesh G. Jhuboo의 안내에 따랐습니다. 동작했지만 소프트웨어가 너무 새로웠습니다. 하위 응용 프로그램들이 아직 업데이트되지 않았기 때문에 ROCm을 성공적으로 설치했다는 멋진 화면이 나왔지만 아무것도 실행할 수 없었습니다.

<div class="content-ad"></div>

당시로부터 많은 변화가 있었고, Stable Diffusion, Ollama, llama.cpp를 실행하려는 경험에 대해 써보기로 결심했어요.

하지만 먼저, 역사 교훈부터 시작해볼게요.

# 계산 에코시스템의 역사: CUDA, OpenCL, ROCm 및 SYCL

Nvidia가 CUDA를 출시한 것이 2007년에 모든 것이 시작되었어요. 당시에는 그래픽 카드가 단순히 그래픽 카드였고, 이를 다른 용도로 확장하는 아이디어가 나왔어요. 특히 CPU보다 유리한 분야인 병렬 컴퓨팅 또는 동시에 많은 계산을 수행하는 곳에서 그들의 이점을 확장하려고 했죠. 각각의 계산이 CPU보다 느리더라도, 그래픽 카드는 한 번에 더 많은 계산을 수행할 수 있기 때문에 총 처리량이 훨씬 높아지는 것이죠.

<div class="content-ad"></div>

한 해 후에 스티브 잡스는 오랜 OpenGL과 구분되는 대안인 OpenCL을 공개 표준 산업 단체인 크로노스 그룹에서 발표했습니다. 애플은 AMD, Nvidia 및 인텔과 같은 다른 회원들의 지원을 받으며 이 표준을 개발하고 홍보하는 데 큰 역할을 했습니다.

OpenCL은 애플에게 AMD와 Nvidia 사이의 그래픽 카드 파트너를 자유롭게 전환할 수 있는 기회를 제공했습니다. 애플 인사이더는 이후 몇 년간 애플과 Nvidia 간의 긴장 관계를 다루었습니다.

하지만 애플은 OpenCL에 충실하지 않았습니다. 2014년에는 iPhone을 위해 초기에, 2017년에는 Mac OS 지원을 추가하면서 자체 계산 플랫폼 Metal을 개발했습니다. 한 해 후에는 애플이 자사 프로세서인 M1로 알려질 것으로 알려진 자체 프로세서를 개발하고 있다는 소문이 나왔습니다. 같은 해에 애플은 Metal을 선호해 OpenCL 지원을 폐기할 것이라고 발표했습니다.

한편 AMD도 2016년 말에 ROCm 플랫폼과 Radeon Instinct 하드웨어를 출시하는 등 머신 러닝을 위한 기업 솔루션을 확대하고 있었습니다.

<div class="content-ad"></div>

Khronos는 더 개방적인 방향을 향해 가고자 하는 SYCL이라는 새로운 표준을 다시 출시할 것입니다. 이에 Intel의 그래픽 및 기계 학습 솔루션이 이에 맞추어 발전할 것입니다.

거의 2 10년이 넘는 혁신과 전환이 있었던 복잡한 생태계입니다. 모든 사람이 원만하게 협력했다면, 지금쯤에는 성숙하고 개방적인 표준이 있었을텐데요, 하지만 이것은 마치 왕좌의 게임과 같습니다. 특정 하드웨어 설정을 위한 플랫폼이라면, 이것이 가장 잘 지원할 것입니다.

![이미지](/assets/img/2024-06-19-RunningLlamaandStableDiffusionwithAMDROCmonFedora40_1.png)

둘째로, Nvidia는 모두에 비해 9년의 선도를 보유하고 있으며, 그들에게는 그에 대한 인정이 필요합니다. 그들의 도구들은 더욱 성숙해지고 있으며, 대부분의 대학과 연구자들이 CUDA를 사용할 것입니다. 일반적으로, 최첨단 연구를 위해서는 Nvidia와 CUDA가 기본이 될 것이지만, 대안들도 속도를 내고 있습니다.

<div class="content-ad"></div>

# (간단하게) 생성적 AI 스택

처음에 언급했듯이, 나는 사용자다. 무언가를 실행하고 싶고, 그것이 분야가 많이 발전한 곳이라고 생각해요. 트랜스포머 아키텍처는 현재 매우 잘 알려져 있고, LLM과 Stable Diffusion 모델에 대한 표준화된 형식이 널리 채택되고 있습니다.

다음은 LLM 실행을 위해 모든 것이 어떻게 연결되는지 크게 단순화된 요약입니다:

![이미지](/assets/img/2024-06-19-RunningLlamaandStableDiffusionwithAMDROCmonFedora40_2.png)

<div class="content-ad"></div>

기본적으로 TextGen WebUI와 같은 프론트 엔드를 설치하고 백엔드를 별도로 설정하거나 LM Studio나 kobold.cpp와 같은 통합 솔루션을 선택할 수 있습니다. 프롬프트를 보내면 백엔드는 어떻게 처리할지 결정해야 합니다. 이는 PyTorch와 같은 딥 러닝 프레임워크를 사용하여 올바른 컴퓨팅 플랫폼을 사용하도록 설정해야 할 수 있습니다. 또는 프레임워크를 완전히 배제하고 요청을 직접 컴퓨팅 플랫폼으로 보낼 수도 있습니다.

여기 몇 가지 함의가 있습니다:

- 운영 체제나 배포판 선택이 중요합니다. 현재 Windows는 ROCm 5.7만 지원하며 PyTorch를 지원하지 않습니다. 그러나 지원되는 몇 가지 카드 중 하나를 가지고 있다면 LM Studio와 같은 매우 직관적인 옵션이 있습니다. 주요 소비자 배포판에서 Ubuntu는 AMD 웹사이트에서 공식 지원을 받고 있으며, Fedora와 Arch는 문서와 패키지를 제공하고 있습니다.
- 버전이 중요합니다. 먼저, 프로젝트가 PyTorch를 사용하는 경우 Python 3.8에서 3.11이 필요할 것입니다. 최신 Linux 배포판은 Python 3.12를 사용할 수 있으므로 가상 환경이 필요할 수 있습니다. 프로젝트 자체가 이를 처리할 수도 있고, 문서를 확인하여 설정이 필요할 수도 있습니다. 또한 프로젝트가 사용하는 PyTorch 버전에 따라 특정 버전의 ROCm이 필요할 것입니다. 특히 ROCm 6.0은 하위 호환성이 없습니다.
- 업데이트가 전파되는 데 시간이 걸립니다. ROCm에 업데이트가 있는 경우, PyTorch 및 기타 라이브러리에 통합되어야 하며, 배포판에 패키징되어야 합니다(깔끔한 설치 프로세스를 원할 경우). 그 후에 프로젝트는 선택한 라이브러리의 새 버전에서 업데이트 및 테스트를 수행해야 합니다.

저는 Windows와 Linux을 장착한 듀얼 부팅 시스템을 사용하고 있습니다. 일반적으로 Windows는 더 제한적이지만 사용 가능한 옵션이 번거롭지 않고, Linux는 성능이 뛰어나며 더 많은 옵션이 있습니다.

<div class="content-ad"></div>

저는 제 Linux 배포판으로 Fedora를 선택했어요. 개인적으로 저는 bleeding-edge 패키지를 갖고 있는 배포판이 실험적인 AI 작업에 가장 적합하다고 느꼈고, Fedora가 ROCm 관련 모든 것을 잘 패키징한다는 점도 좋아해요. 

## 시작하기 전에

Anvesh의 가이드에서 언급한 대로, 권한 설정과 재정의 몇 단계가 필요해요. 먼저 GPU 자원에 액세스 권한을 부여해야 해요:

```bash
sudo usermod -a -G video $LOGNAME
```

<div class="content-ad"></div>

다음으로, ROCm을 올바르게 설치합니다. 저는 여기서 hipblas만 호출하여 바로 가기를 사용할 것입니다. 이것은 LLMs의 계산의 기본인 행렬 곱셈을 위한 주요 라이브러리입니다. hipblas는 대부분의 다른 ROCm 패키지를 의존성으로 설치할 것입니다. 필요시 진단을 위해 rocminfo도 추가하였습니다.

```js
sudo dnf install rocminfo hipblas
```

일부 소비자 그래픽 카드, 특히 오래된 것들은 공식적으로 지원되지 않을 수 있지만, 대체 방법으로 작동할 수 있습니다. 이 명령을 터미널 창에서 실행하거나 ~/.bashrc에 추가하여 부팅시 자동으로 실행되도록 합니다.

RX 7000 시리즈:

<div class="content-ad"></div>

```js
export HSA_OVERRIDE_GFX_VERSION=11.0.0
```

RX 6000 series:

```js
export HSA_OVERRIDE_GFX_VERSION=10.3.0
```

# ROCm을 사용하여 Fedora 40에서 Ollama와 Open WebUI 설정하기

<div class="content-ad"></div>

Ollama는 LLMs를 실행하는 데 시작하기 쉽고 다듬어진 방법 중 하나입니다. 설치는 GitHub 페이지에 명시된 대로 간단합니다:

```js
curl -fsSL https://ollama.com/install.sh | sh
```

만일 ROCm이 성공적으로 설치되었다면, Ollama가 이를 감지할 수 있어야 합니다.

![이미지](/assets/img/2024-06-19-RunningLlamaandStableDiffusionwithAMDROCmonFedora40_3.png)

<div class="content-ad"></div>

거기서 다음과 같이 실행할 수 있어요:

```js
ollama run llama3
```

그리고 터미널 창에서 Llama 3과 대화할 수 있습니다. 또는 Open WebUI를 설치하고 더 다듬어진 인터페이스에 연결할 수도 있어요. "Ollama가 컴퓨터에 있는 경우" 지침을 따라 Open WebUI를 설치했어요.

```js
docker run -d -p 3000:8080 --add-host=host.docker.internal:host-gateway -v open-webui:/app/backend/data --name open-webui --restart always ghcr.io/open-webui/open-webui:main
```

<div class="content-ad"></div>

같은 기기에서 Open WebUI와 Ollama를 실행할 경우 문제가 발생할 수 있습니다. 문제 해결 페이지에서는 Open WebUI를 성공적으로 시작하려면 --network=host를 사용하는 방법에 대해 다루고 있습니다.

```js
docker run -d --network=host -v open-webui:/app/backend/data -e OLLAMA_BASE_URL=http://127.0.0.1:11434 --name open-webui --restart always ghcr.io/open-webui/open-webui:main
```

Open WebUI는 더 많은 통계를 노출할 것입니다. 8bn 파라미터를 갖는 4비트 양자화된 Llama 3 모델에서 CPU에서 실행 중인 경우 초당 약 10토큰을 생성해야 합니다. 6750 XT와 ROCm과 같은 그래픽 카드를 올바르게 사용하는 경우, 초당 약 60토큰을 생성해야 합니다.

<img src="/assets/img/2024-06-19-RunningLlamaandStableDiffusionwithAMDROCmonFedora40_4.png" />

<div class="content-ad"></div>

거의 끝났어요, 한 가지만 더 해야 합니다. Ollama은 시스템 부팅 시 systemd 서비스로 설치됩니다. systemd 서비스는 bashrc 이전에 로드됩니다. 다시 말해, 재부팅 후에 이전의 bashrc 명령을 완전히 놓칠 수 있으며 CPU 전용 모드로 실행되어 모델을 느리게 만들 수 있습니다.

따라서 /etc/systemd/system/ollama.service 파일을 열고 [Service] 아래 부분을 찾으세요. 그 다음에 익숙해보일 행을 추가하세요. 필요하다면 10.3.0을 변경하세요:

```js
Environment=”HSA_OVERRIDE_GFX_VERSION=10.3.0"
```

이렇게 보여야 합니다:

<div class="content-ad"></div>


![image](/assets/img/2024-06-19-RunningLlamaandStableDiffusionwithAMDROCmonFedora40_5.png)

# Fedora 40에서 ROCm을 이용하여 llama.cpp 및 Mikupad 설정하기

Ollama 및 Open WebUI는 쉽지만 무거운 것으로 간주될 수 있습니다. 다른 극단인 llama.cpp 자체, LM Studio, Ollama 및 KoboldCpp를 구동하는 추론 엔진을 살펴봅시다. Mikupad에서 이를 실행할 것인데, 이는 매우 가벼운 프런트 엔드입니다.

문서는 충분히 간단합니다:


<div class="content-ad"></div>

```js
git clone https://github.com/ggerganov/llama.cpp
cd llama.cpp
```

그런 다음, 복잡한 부분이 옵니다. llama.cpp 저장소는 코드일 뿐입니다. 컴파일해야 합니다. hipblas만으로는 충분하지 않으므로 컴파일을 위해 몇 가지 개발자 라이브러리가 필요합니다:

```js
sudo dnf install rocm-hip-devel hipblas-devel rocblas-devel
```

이러한 패키지를 설치한 후 AMD 지원으로 컴파일하는 명령을 사용하세요. 필요한 경우 오버라이드가 활성화되었는지 확인하세요.

<div class="content-ad"></div>

```js
make LLAMA_HIPBLAS=1
```

이후, HuggingFace로 이동하여 몇 개의 GGUF 모델을 가져오세요. 저는 이 글을 쓰는 동안 우연히 최신 `10b 파라미터 모델이었던 DeepSeek V2 Lite를 시도해보려고 합니다.

여기서 --port 11434를 사용하도록 설정했어요. Open WebUI에서 시도해 보려고 합니다. 대부분의 경우에는 -ngl 999를 사용하여 모델의 모든 레이어를 GPU로 보낼 것으로 예상합니다. 그리고 Q&A에 충분한 -c 4096의 컨텍스트 크기를 설정했습니다.

```js
./llama-server --port 11434 -m models/DeepSeek-V2-Lite-Chat.Q4_K_M.gguf -c 4096 -ngl 999
```

<div class="content-ad"></div>

llama.cpp가 ROCm과 함께 작동하는지 확인하는 두 가지 방법이 있습니다. 먼저 시작할 때 시스템 정보를 표시할 때 BLAS = 1이라고 나와야 합니다.

![시스템 정보 확인](/assets/img/2024-06-19-RunningLlamaandStableDiffusionwithAMDROCmonFedora40_6.png)

다음으로, 모델이 GPU에 성공적으로 로드되었는지 확인하세요.

![모델 GPU로 로드됨 확인](/assets/img/2024-06-19-RunningLlamaandStableDiffusionwithAMDROCmonFedora40_7.png)

<div class="content-ad"></div>

llama.cpp 서버가 실행 중이면 Open WebUI는 llama.cpp 백엔드와 함께 작동할 수 있습니다. 설정 → 연결로 이동하여 "OpenAI API" 아래에 서버 IP를 입력하고 끝에 "v1"을 추가하고 API 키를 "none" 또는 서버에 지정한 것으로 설정하면 됩니다.

참고: 만약 Open WebUI가 도커를 통해 설치되었다면, 도커가 실행 중일 때 llama.cpp가 자체 포트를 열려고 시도할 때 문제가 발생할 수 있습니다. 이 경우에는 도커를 일시 중지하려면 sudo service docker stop을 사용한 후 Docker를 재시작하고 Open WebUI를 Open WebUI의 지침에 따라 실행하면 됩니다.

![Running Llama and Stable Diffusion with AMD ROCm on Fedora 40_8](/assets/img/2024-06-19-RunningLlamaandStableDiffusionwithAMDROCmonFedora40_8.png)

그 후 연결을 새로고침하면 작동해야 합니다.

<div class="content-ad"></div>

## Mikupad 사용법

Mikupad 설정은 간단합니다. HTML 파일이기 때문에 다운로드하고 열기만 하면 됩니다:

```js
git clone https://github.com/lmg-anon/mikupad.git
cd mikupad
open mikupad.html
```

그럼 웹 페이지가 열릴 것입니다. 서버 세부 정보가 정확한지 확인하고 준비가 되면 Predict를 클릭하세요.

<div class="content-ad"></div>


![이미지](/assets/img/2024-06-19-RunningLlamaandStableDiffusionwithAMDROCmonFedora40_9.png)

# Fedora 40에서 ROCm과 함께 Stable Diffusion WebUI 설정하기

Stable Diffusion WebUI(이하 SDWebUI)의 문서는 간단해 보이지만 몇 가지 복잡함이 있습니다:

- Python 3.10 가상 환경을 생성하려고 하는데 Fedora는 Python 3.12를 사용합니다.
- 기본적으로 이전 버전의 PyTorch를 설치하려고 하는데, 해당 버전은 ROCm 5.6이 필요하나 Fedora는 ROCm 6.0을 사용합니다.


<div class="content-ad"></div>

모든 문제가 해결되었습니다. 여기에 사용 중인 해결 방법이 있어요.

파이썬 버전 문제를 해결하기 위해, 시스템 수준에서 별도의 파이썬 버전을 설치할 수는 있지만, 그 아이디어는 별로 마음에 들지 않아요. 대신 conda를 선택했죠. 가상 환경을 설정해야 하는데 이미 이 작업을 위해 가상 환경을 만들고 있으니 이 상황이 얼마나 어처구니었는지 잘 알고 있어요. 하지만 나중에 정리하기가 더 쉬우니까 괜찮아요.

```js
sudo dnf install conda
```

그리고 이제 SDWebUI가 잘 작동하도록 가상 환경을 생성해볼게요.

<div class="content-ad"></div>


```js
conda create -n “diffusion-installer” python=3.10.6
conda activate diffusion-installer
```

한번 더 컴파일러가 필요합니다. 이번에는 대부분의 최신 리눅스 배포판보다 오래된 컴파일러가 필요합니다. SDWebUI가 필요하니 그걸 받아야 합니다. 이 명령을 실행하기 전에 “diffusion-installer”가 활성화되어 있는지 확인하세요.

```js
conda install -c conda-forge gcc=12.1.0
```

그런 다음 수동으로 설치해야 합니다. 자동 스크립트를 사용하면 오래된 PyTorch를 바로 다운로드하게 되어 발생하는 귀찮은 중복을 피할 수 있습니다.


<div class="content-ad"></div>

그러면 저장소를 받아서 새롭게 만든 폴더로 들어가 보겠습니다.

```js
git clone https://github.com/AUTOMATIC1111/stable-diffusion-webui
cd stable-diffusion-webui
```

다른 작업을 하기 전에, webui-user.sh 파일을 열어서 Torch를 설치하는 줄의 주석을 해제하고, ROCm 6.0을 지원하는 PyTorch 버전으로 변경해야 합니다. 제 시스템에서 PyTorch 2.3.1이 작동하지 않아서 여기에서는 2.3.0을 사용했습니다.

```js
export TORCH_COMMAND="pip install torch==2.3.0+rocm6.0 torchvision torchaudio --extra-index-url https://download.pytorch.org/whl/rocm6.0"
```

<div class="content-ad"></div>

아래와 같이 작성해보세요:


![이미지](/assets/img/2024-06-19-RunningLlamaandStableDiffusionwithAMDROCmonFedora40_10.png)


이제 손가락 교차해보세요!

```bash
./webui.sh
```

<div class="content-ad"></div>

Ollama나 llama.cpp와 다르게, SDWebUI는 GPU로 성공적으로 로드되었는지 여부를 명시적으로 알려주지 않습니다. 그러나 SDWebUI가 ROCm을 사용하는 PyTorch의 특정 버전을 다운로드했기 때문에 두 가지 중 하나가 발생할 수 있습니다.

- PyTorch를 ROCm과 함께 성공적으로 사용
- 오류가 발생

따라서 SDWebUI의 브라우저 창이 열리면 이미지를 생성할 수 있다면, 올바르게 작동 중일 가능성이 높습니다.

![image](/assets/img/2024-06-19-RunningLlamaandStableDiffusionwithAMDROCmonFedora40_11.png)

<div class="content-ad"></div>

# 앞으로 볼 것들

만약 뉴스가 사실이라면, Nvidia의 지원을 받아 TSMC가 가격을 올릴 가능성이 높습니다. 물론 TSMC가 이렇게 잘 실행한 덕분일 것입니다. 하지만 그게 의미하는 바가 GPU와 AI가 일반 시장에 접근하기 어려워질 것을 의미하는 걸까요? 그런 일은 없었으면 좋겠습니다.

Intel은 여전히 자체 공장을 보유하고 있지만, 일부 CPU에는 TSMC를 사용하게 될 것으로 예상됩니다. 한편 TSMC의 생산 능력이 모두 예약되어 있기 때문에 AMD는 보다 많은 공급을 위해 Samsung과 협력하고 있습니다.

AI 자체는 아직 멀은 길이 남아 있습니다. 모든 사람들의 관심이 LLM에 집중되어 있지만, 의약품 발견, 의료 진단 및 스칼렛 요한슨과 똑같이 묘한 목소리가 나오는 가상 음성처럼 주목받지 않는 더 많은 분야에도 AI가 사용되고 있습니다.

<div class="content-ad"></div>

최종적으로 건강하고 성공적인 경쟁을 선호합니다. 더 많은 경쟁은 주요 플레이어들이(제조업체 뿐만 아니라 OpenAI, Meta, Anthropic과 같은 플랫폼 소유자들) 모여 일부 응용 프로그램에 대한 오픈 표준에 합의하는 것이 전부 소유권으로 남아 있는 것보다 더 큰 가능성을 의미합니다.

성공적인 이야기로 넘어가면, AMD는 많이 발전했습니다. 1년도 채 지나지 않은 때에는 ROCm과 아무것도 호환이 되지 않을 것 같았고 오래된 표준으로 되돌아가서 성능 저하가 발생했던 것 같은데, 이제는 대부분의 것들이 아마도 작동할 것으로 보입니다. 몇 군데 소금을 조금씩 넣어야 할 수도 있지만요. 아직 완벽하지는 않지만 큰 개선이 이루어졌습니다.