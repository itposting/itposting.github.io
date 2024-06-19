---
title: "ComfyUI에서 의상을 어떻게 변경하나요"
description: ""
coverImage: "/assets/img/2024-06-19-HowtoChangeOutfitsinComfyUI_0.png"
date: 2024-06-19 20:58
ogImage: 
  url: /assets/img/2024-06-19-HowtoChangeOutfitsinComfyUI_0.png
tag: Tech
originalTitle: "How to Change Outfits in ComfyUI"
link: "https://medium.com/@promptingpixels/how-to-change-outfits-in-comfyui-7d20eaeccdc0"
---


일반적으로 ComfyUI나 Automatic1111에서 옷을 바꾸는 과정은 캐릭터 포즈를 유지하면서 원하는 스타일을 적용하는 데 조금의 프롬프트 엔지니어링이나 LoRA가 필요한 귀찮은 인페인팅과 제어넷을 필요로 합니다.

조금의 실험 끝에 IPAdapter의 스타일 추출과 Grounding Dino 및 Segment Anything 모델의 정확한 세분화를 결합하면 후처리를 최소화하면서 매우 정확하고 불편한 옷 갈아입기를 할 수 있습니다.

다음은 방법입니다:

작업흐름 및 상세가이드: 이 작업을 실제로 확인하고 워크플로를 다운로드하고 싶다면, Prompting Pixels 웹사이트에서 무료로 이용할 수 있습니다.

<div class="content-ad"></div>

# 최종 결과

워크플로우 세부사항에 대해 들어가기 전에, 이전과 이후의 이미지를 시각적으로 보여드립니다:

# 작업 공간 설정

세 가지 다른 그룹으로 분리하는 것이 조직적 관점과 전반적인 프로세스에서의 상황을 고려할 때 좋은 방법이라고 생각했습니다. 이 세 그룹은 다음과 같습니다: 기본 워크플로우, IPAdapter 및 세분화. 각각에서 무엇이 벌어지고 있는지 살펴보겠습니다:

<div class="content-ad"></div>

# 기본 작업 흐름

여기서 소개하는 것은 기본적으로 ComfyUI에서 시작하는 기본 작업 흐름입니다. 여기서 가장 주목할 만한 변화는 전체 이미지가 아닌 부분 이미지를 다루기 때문에, 생성 체크포인트 대신 인페인팅 체크포인트를 불러와야 한다는 것입니다.

그리고 추천하는 좋은 SDXL 체크포인트로는 RealVision, ICBINP XL 또는 기본 SDXL 인페인팅 체크포인트가 있습니다.

당신의 프롬프트에 대해, 특정 세그먼트를 변경할 것이기 때문에 무엇이 나타나길 원하는지 정의해야 합니다. 이 예시에서는 기본 셔츠를 화려한 하와이안 셔츠로 변환할 것입니다.

<div class="content-ad"></div>

# IPAdapter

IPAdapter은 이미지 프롬프트 어댑터를 의미합니다. 기본적으로 이 노드들은 스타일이나 사람의 일반적인 특징을 모델로 전송할 수 있습니다.

이를 작은 LoRA나 텍스트 임베딩처럼 생각해보세요.

따라서 이미지를 입력으로 제공하고 이미지에서 관련 정보를 추출하는 것을 Load Image 노드를 통해 수행해야 합니다.

<div class="content-ad"></div>

ComfyUI에 이미지 프롬프트 어댑터(IPAdapter)를 설정하려면 CLIP-ViT-H-14-laion2B-s32B-b79K.safetensors 및 ip-adapter-plus_sdxl_vit-h.safetensors 모델을 불러와야 합니다. 이 모델들과 관련된 다른 모델들은 IPAdapter GitHub 리포지토리에서 찾을 수 있습니다.

해당 디렉터리에 모델을 넣은 후 이미지 출력을 Load Image 노드에서 IPAdapter 고급 노드로 전달해야 합니다.

또한, CLIP 모델을 Load CLIP Vision과 IPAdapter Unified Loader를 IPAdapter 고급 노드로 가져와야 합니다. 이전에 언급된 IP 어댑터 모델을 사용하는 경우 프리셋을 PLUS(고 강도)로 설정해야 합니다.

마지막으로 IPAdapter Advanced에서 weight_type를 스타일 전송으로 변경해야 합니다.

<div class="content-ad"></div>

IPAdapter Advanced로부터의 모델 출력은 직접 KSampler 노드로 들어가게 되는데, 수정된 모델 파일은 이제 원하는 입력에 기반하여 정확하게 이미지/스타일을 그릴 수 있습니다.

# 세분화

이 프로세스 중 가장 멋진 부분 중 하나는 GroundingDino 모델의 구현입니다. 이 세분화 모델은 텍스트 프롬프트를 제공하고 해당 이미지 내에서 그것을 찾아서 그에 맞게 분할할 수 있습니다.

이것은 굉장히 강력한 기능입니다.

<div class="content-ad"></div>

저희의 작업 흐름 중에 셔츠를 세분화하는 데 사용 중인데, 실제로 모자부터 신발, 심지어 전체 배경까지 거의 모든 것을 세분화할 수 있어요. 가능성은 무한해요.

이를 설치하려면 Segment Anything 사용자 정의 노드를 가져와야 해요 (ComfyUI 매니저나 GitHub 저장소를 통해 이용 가능해요).

IPAdapter와 같이 세분화할 때 이미지가 먼저 입력이 되어야 해요.

그러므로 Load Image 노드를 설정하고 그 다음 GroundingDinoSAMSegment 노드로 전달하세요.

<div class="content-ad"></div>

또한, SAMModelLoader 노드와 GroundingDinoModelLoader의 Segment Anything 모델을 가져와야 합니다. 처음 실행할 때 이 모델 로더 노드들은 관련 모델(약 3GB)을 다운로드한 다음 GroundingDinoSAMSegment 노드로 전달합니다.

GroundingDinoSAMSegment 노드에는 세그먼트할 객체의 단어를 입력할 수 있는 텍스트 필드가 있습니다. 셔츠, 안경 등과 같이 세그먼트하려는 객체의 단어를 입력할 수 있습니다.

이제 셔츠, 안경과 같은 여러 객체를 정의할 수 있지만, 신뢰성이 거의 없다는 것을 알았습니다:

![이미지](/assets/img/2024-06-19-HowtoChangeOutfitsinComfyUI_0.png)

<div class="content-ad"></div>

임계값에 대해 일반적으로 말하자면, 낮은 값은 모델이 선택을 더 자유롭게 할 수 있게 하지만 높은 값은 더 자신 있게 만듭니다. 값이 너무 높으면 선택된 것이 없는 오류가 발생할 수 있습니다.

분할한 후에는 마스크를 VAE 인코딩(인페인팅용) 노드(mask 입력)와 IPAdapter Advanced(주의 마스크 입력) 노드에 모두 전달해야 합니다. 원본 이미지는 VAE 인코딩(인페인팅용) 노드에도 전달되어야 합니다.

선택 사항: 마스크에 FeatherMask 노드를 추가하여 가장자리를 부드럽게 만들어 더 나은 결과를 얻을 수 있습니다.

# 큐 프롬프트 및 결과 검토

<div class="content-ad"></div>

한 번 모두 연결되면 프롬프트를 대기열에 넣고 결과를 검토할 수 있습니다. 원하는 결과물의 꽤 정확한 표현이 셔츠가 멋진 하와이안 셔츠로 변환되었음을 확인해야 합니다.

출력 이미지를 주의 깊게 살펴보고 원하는 결과물을 얻기 위해 필요한 대로 설정을 조정하세요.

완벽하게 작동하는 완벽한 조합을 찾기 위해 다양한 설정으로 실험하고 다양한 모델을 테스트할 수 있도록하려면 설정을 조정하세요.

# 이 프로세스의 장단점

<div class="content-ad"></div>

제안하는 방법에 대한 장단점을 요약해 드리겠습니다. 이 워크플로우를 잘 활용하는 데 도움이 될 수 있어요:

장점:

- GroundingDino의 Zero-shot 객체 감지 기능을 사용하면 이미지를 자동으로 분할하고 보정할 수 있습니다.
- 정확한 분할이 모델이 올바른 영역만 보정하도록 합니다.
- '가상 시착'과 같은 소비자를 대상으로 하는 응용 프로그램이 가능합니다.

단점:

<div class="content-ad"></div>

- Segmentation이 추가적인 몇 개의 GB VRAM을 소비하므로, ControlNets, LoRAs, AnimateDiff 등 다른 노드들과 함께 사용할 때 문제가 발생할 수 있습니다.
- 물리적인 적용이 아니라 스타일 적용만 가능합니다. 예를 들어, 긴 소매 셔츠가 IPAdapter에 입력되어도 최종 이미지는 여전히 단추 소매로 표시될 것입니다.

👉 AI 예술 기술을 강화하고 싶다면, 무료 프롬프팅 픽셀 강좌를 확인해보세요.