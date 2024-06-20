---
title: "윈도우에서 NVIDIA GPU 가속을 활용해 llama-cpp-python 설치하기 간단 안내"
description: ""
coverImage: "/assets/img/2024-06-20-Installingllama-cpp-pythonwithNVIDIAGPUAccelerationonWindowsAShortGuide_0.png"
date: 2024-06-20 14:56
ogImage: 
  url: /assets/img/2024-06-20-Installingllama-cpp-pythonwithNVIDIAGPUAccelerationonWindowsAShortGuide_0.png
tag: Tech
originalTitle: "Installing llama-cpp-python with NVIDIA GPU Acceleration on Windows: A Short Guide"
link: "https://medium.com/@piyushbatra1999/installing-llama-cpp-python-with-nvidia-gpu-acceleration-on-windows-a-short-guide-0dfac475002d"
---


<img src="/assets/img/2024-06-20-Installingllama-cpp-pythonwithNVIDIAGPUAccelerationonWindowsAShortGuide_0.png" />

개발자이신가요? 로컬 LLM 개발을 위해 Windows에서 하드웨어 가속된 llama-cpp-python의 성능을 끌어올리고 싶으신가요? 더 이상 찾지 마세요! 이 안내서에서는 스텝별로 안내하여 본인이 설치하는 동안 겪은 문제점을 피할 수 있도록 도와드리겠습니다.

# Prerequisites:

- Visual Studio 설치:

<div class="content-ad"></div>

- Windows용 C++ CMake 도구.
- C++ 핵심 기능
- Windows 10/11 SDK.

![이미지](/assets/img/2024-06-20-Installingllama-cpp-pythonwithNVIDIAGPUAccelerationonWindowsAShortGuide_1.png)

2. CUDA Toolkit:

- NVIDIA 공식 웹사이트에서 CUDA Toolkit 12.2를 다운로드하고 설치합니다.
- nvcc --version 및 nvidia-smi로 설치 여부 확인합니다.

<div class="content-ad"></div>

<img src="/assets/img/2024-06-20-Installingllama-cpp-pythonwithNVIDIAGPUAccelerationonWindowsAShortGuide_2.png" />

- 환경 변수에 CUDA_PATH (C:\Program Files\NVIDIA GPU Computing Toolkit\CUDA\v12.2)를 추가하세요.

## 설치 단계:

새 명령 프롬프트를 열고 Python 환경을 활성화하세요 (예: conda 사용). 다음 명령을 실행하세요:

<div class="content-ad"></div>

```shell
CMAKE_ARGS=-DLLAMA_CUBLAS=on을 설정합니다.
FORCE_CMAKE=1로 설정합니다.
pip install llama-cpp-python --force-reinstall --upgrade --no-cache-dir

# 컴파일 시 cuBLAS가 사용되고 있는지 확인하려면 --verbose를 사용하세요.
```

설치 중 --verbose 옵션을 추가하면 CUDA가 컴파일에 사용되는지 확인할 수 있습니다.

![이미지](/assets/img/2024-06-20-Installingllama-cpp-pythonwithNVIDIAGPUAccelerationonWindowsAShortGuide_3.png)

CUDA가 올바르게 구성되지 않았다면, llama-cpp-python은 하드웨어 가속을 사용하지 않고 설치됩니다.

<div class="content-ad"></div>

만약 Cuda가 감지되지만 No CUDA toolset founderror가 발생한다면 다음을 수행하세요:

- 파일을 복사합니다: C:\Program Files\NVIDIA GPU Computing Toolkit\CUDA\v12.2\extras\visual_studio_integration\MSBuildExtensions 에서 아래 경로로:
(Enterprise 버전 인 경우) C:\Program Files\Microsoft Visual Studio\2022\Enterprise\MSBuild\Microsoft\VC\v170\BuildCustomizations
또는
(Community 버전인 경우) C:\Program Files\Microsoft Visual Studio\2022\Community\MSBuild\Microsoft\VC\v170\BuildCustomizations

```js
copy "C:\Program Files\NVIDIA GPU Computing Toolkit\CUDA\v12.2\extras\visual_studio_integration\MSBuildExtensions" "C:\Program Files\Microsoft Visual Studio\2022\Enterprise\MSBuild\Microsoft\VC\v170\BuildCustomizations"
```

(설치에 기반하여 경로를 조정하세요)

<div class="content-ad"></div>

# 테스트

- 다음의 Python 코드를 실행하여 설치를 확인하세요:

```js
from llama_cpp import Llama
llm = Llama(model_path="model.gguf", n_gpu_layers=30, n_ctx=3584, n_batch=521, verbose=True)
# GPU 및 모델에 맞게 n_gpu_layers를 조정하세요
output = llm("Q: 태양계의 행성을 말해주세요? A: ", max_tokens=32, stop=["Q:", "\n"], echo=True)
print(output)
```

![링크 텍스트](/assets/img/2024-06-20-Installingllama-cpp-pythonwithNVIDIAGPUAccelerationonWindowsAShortGuide_4.png)

<div class="content-ad"></div>

만약 설치가 올바르게 되었다면, 모델 속성에서 BLAS = 1 지표가 표시될 것입니다.

# 결론:

이 단계를 따르면, Windows 기기에 cuBLAS 가속을 사용하여 llama-cpp-python을 성공적으로 설치했을 것입니다. 이 안내서는 과정을 간소화하고 흔한 문제를 피할 수 있도록 돕는 것을 목표로 합니다.

이제 향상된 성능을 갖는 로컬 llama 개발에 뛰어들 준비가 되었습니다. GPU 오프로딩에 행운을 빕니다!