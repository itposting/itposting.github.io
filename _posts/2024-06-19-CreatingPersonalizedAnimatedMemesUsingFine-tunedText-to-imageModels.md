---
title: "개성있는 애니메이션 미미 만들기 세밀하게 조정된 텍스트-이미지 모델 사용하기"
description: ""
coverImage: "/assets/img/2024-06-19-CreatingPersonalizedAnimatedMemesUsingFine-tunedText-to-imageModels_0.png"
date: 2024-06-19 21:00
ogImage: 
  url: /assets/img/2024-06-19-CreatingPersonalizedAnimatedMemesUsingFine-tunedText-to-imageModels_0.png
tag: Tech
originalTitle: "Creating Personalized Animated Memes Using Fine-tuned Text-to-image Models"
link: "https://medium.com/better-programming/creating-personalized-animated-memes-using-fine-tuned-text-to-image-models-37a45de4c7c3"
---


## Stable Diffusion과 Deforum을 사용한 개인 맞춤형 미미 생성

안녕하세요! 이 블로그 포스트에서는 Deforum과 섬세하게 조정된 Stable Diffusion(SD) 모델을 사용하여 맞춤형 및 애니메이션 미미를 만드는 과정을 소개하고, 스타일 전이 도구로 사용한 Visual Guide 출처의 몇 가지 미미 예제를 제시할 예정입니다.

시작하기 전에, 아직 저의 블로그에서 섬세하게 조정된 SD 모델을 사용하여 미미 이미지를 생성한 내용을 확인하지 않으셨다면 아래 링크를 확인해보세요:

전체 코드는 저의 GitHub 페이지에서 확인할 수 있습니다. 필요한 부분은 여기 있어요.

<div class="content-ad"></div>

# 단계 1: 모델 파인 튜닝

첫 번째 단계는 SD 모델을 파인 튜닥하는 것입니다. 저는 SD1.5 모델을 선택하고 해당 모델의 가중치를 여기서 다운로드 받았습니다. 그런 다음에는 제 PC가 10GB VRAM을 가진 RTX3080을 사용하기 때문에 로컬에서 학습 알고리즘을 실행했습니다. 충분히 강력한 성능을 가진 듯합니다.

파인 튜닥에 사용할 이미지를 선택할 때 주의하세요. 서로 다른 배경과 표정을 가진 이미지를 사용해 보세요. 저는 다음과 같은 이미지들을 사용했습니다.

![이미지](/assets/img/2024-06-19-CreatingPersonalizedAnimatedMemesUsingFine-tunedText-to-imageModels_0.png)

<div class="content-ad"></div>

훈련 후 모델 체크포인트 파일을 리포지토리의 models/ 하위 폴더로 이동해주세요.

![이미지](/assets/img/2024-06-19-CreatingPersonalizedAnimatedMemesUsingFine-tunedText-to-imageModels_1.png)

# 단계 2: 메멘티콘 템플릿 준비

두 번째 단계는 Deforum 알고리즘을 실행하기 위해 필요한 파일을 준비하는 것입니다: 확산할 소스 비디오, 마스크 비디오 및 설정 파일. 더 쉽게 따라올 수 있도록, 이러한 단계를 세 가지 하위 섹션으로 설명하겠습니다.

<div class="content-ad"></div>

## 단계 2.1: 확산할 소스 비디오 다운로드하기

이 단계에서는 우리의 템플릿으로 사용할 비디오를 간단히 다운로드합니다. 사람이 포함된 비디오면 어떤 비디오든 사용할 수 있습니다. 저는 아래 비디오를 선택했습니다. 해당 비디오를 다운로드하고 templates/dimitri_finds_out/source.mp4 경로에 저장했습니다.

## 단계 2.2: 마스크 비디오 생성

디포럼 알고리즘은 마스크 비디오를 입력으로 사용할 수 있습니다. 마스크 비디오는 확산을 원하는 입력 비디오와 동일한 프레임 수를 가져야 합니다. 각 프레임은 확산을 위한 ROI가 검정색이고 터치하지 않을 부분이 흰색인 이진 강도로 구성됩니다. 그런 다음, 이것은 이진 분할 문제가 되며, 이에 대한 알고리즘은 문헌에서 흔히 사용할 수 있습니다.

<div class="content-ad"></div>

저는 PixelLib이라는 사용하기 쉬운 라이브러리를 알고 있습니다. 이 라이브러리는 기본적으로 PointRend를 기반으로 한 시맨틱 세그멘테이션 라이브러리입니다. 몇 줄의 코드로 세그먼트된 프레임을 생성할 수 있게 해줍니다. 사용하려면 이 링크에서 PointRend 모델을 다운로드하여 models/ 하위폴더로 이동해야 합니다.

마스크 생성을 자동화하는 스크립트 create_mask.py를 작성했습니다. 이 스크립트는 소스 비디오 경로와 출력 마스크 비디오를 저장할 경로 두 가지를 입력받습니다.

```js
python create_mask.py \
  --video_path="templates/dimitri_finds_out/source.mp4" \
  --save_path="templates/dimitri_finds_out/mask.mp4"
```

PixelLib은 시맨틱 세그멘테이션 라이브러리이므로 프레임에서 감지된 각 사람에 대한 마스크를 제공합니다. 우리가 관심 영역을 선택하기 위해, 모든 감지된 사람 중에서 면적이 가장 큰 사람을 선택하는 절차를 구현했습니다. 이는 다음 두 함수에 의해 수행됩니다:

<div class="content-ad"></div>

```js
def max_nonzero_channel(arr):
    # 채널 차원을 제외한 모든 차원을 합산합니다
    channel_sums = np.sum(arr != 0, axis=tuple(range(arr.ndim-1)))
    # 가장 높은 합을 가진 채널의 인덱스를 찾습니다
    max_channel_index = np.argmax(channel_sums)
    return max_channel_index

def frame_segmentation(path_to_extracted_frames, frame_count, save_path_for_mask_frames):
    create_folder(save_path_for_mask_frames) # 폴더가 없을 경우 생성합니다
    for index in tqdm(range(frame_count)):
        # 비디오의 각 프레임에 대해 PointRend를 실행합니다
        r, output = ins.segmentImage(f"{path_to_extracted_frames}frame{index}.jpg", 
                                     show_bboxes=True, segment_target_classes=target_classes, 
                                     save_extracted_objects=False, mask_points_values=False, 
                                     extract_segmented_objects=True, output_image_name=None)
        # 사람이 감지되었다면 최대 nonzero 픽셀 개수를 가진 채널을 선택합니다
        if r["masks"].ndim == 3:
            picked_object = int(max_nonzero_channel(r["masks"][:, :, :]))
            cv2.imwrite(f"{save_path_for_mask_frames}mask{index:05}.png", (1 - r["masks"][:, :, picked_object]).astype(int) * 255)
        # 그렇지 않으면 흰 프레임을 생성합니다
        else:
            cv2.imwrite(f"{save_path_for_mask_frames}mask{index:05}.png", np.ones((output.shape)).astype(int) * 255)
```

다음 비디오는 PointRend의 출력 및 후처리된 마스크 비디오로 선택한 소스 비디오의 내용을 보여줍니다.

![비디오 링크](https://miro.medium.com/v2/resize:fit:1200/1*YSFCLiOQ-kPB-bf_4MQQ1g.gif)

create_mask.py를 실행한 후, 마스크 비디오가 템플릿의 하위 폴더에 있음을 확인해주세요.

<div class="content-ad"></div>

## 단계 2.3: Deforum 설정 준비

마지막 단계는 템플릿용 Deforum 알고리즘을 위한 settings.txt 파일을 생성하는 것입니다. 이 파일은 기본적으로 Deforum 매개변수 목록으로, 여기에 중요한 몇 가지가 있습니다: seed_behavior, animation_prompts, video_init_path, 그리고 video_mask_path.

seed_behavior: Deforum은 일반적으로 SD 실행을 위해 무작위 시드를 사용하지만, 애니메이션 일관성을 위해 "고정"으로 설정해야 합니다. 이렇게 하면 확산된 영역의 색상과 세부 사항이 연속된 프레임 내에서 의사 일관되게 유지됩니다.

animation_prompts: 일반적인 SD 프롬프팅과 달리 우리는 풍경에 대한 많은 세부 정보와 신호 입력할 필요가 없습니다. 입력 비디오를 공급하면 공간 영역의 대부분 세부 사항이 보존됩니다. 따라서 “sks 사람 사진, 현실적인 얼굴”과 같은 스타일 신호 몇 가지만 입력해도 충분합니다. 저의 비디오에는 웃고 춤추는 남성이 포함되어 있으므로 입력한 프롬프트는 “댄스 클럽에서 웃고 춤추는 sks 남성 사진, 현실적인 얼굴, 초상화 세부 사항, 강조 조명…”입니다.

<div class="content-ad"></div>

video_init_path 및 video_mask_path: 이러한 매개변수는 각각 source.mp4 및 mask.mp4의 경로입니다.

dimitri_finds_out 템플릿 설정 중 일부는 다음과 같습니다:

```js
{
    "ENABLE_STORY_MODE":"True",
    "batch_name":"dimitri_finds_out",
    "width":900,
    "height":900,
    "bit_depth_output":8,
    "seed":-1 ,
    "seed_behavior":"fixed",
    "sampler":"euler_ancestral",
    "steps":70,
    "scale":15,
    "ddim_eta":0.0,
    "filename_format":"{timestring}_{index}_{prompt}.png",
    "use_init":false,
    "init_image":"",
    "strength":0.75,
    "use_mask":false,
    "use_alpha_as_mask":false,
    "invert_mask":false,
    "animation_prompts":{
 "0": "picture of laughing sks man in a dance club, realistic face, ultra detailed face, accent lighting, extremely detailed, ultra detailed, intricate details, high composition, 8k, cinematic lighting, blurry:-1, disfigured:-1, ugly:-1, deformed:-1, bad anatomy:-1, poorly drawn face:-1, poorly drawn hands:-1, malformed hands:-1, disgusting:-1, poorly drawn:-1, poorly drawn face:-1"
    },
    "animation_mode":"Video Input",
    "max_frames":348,
    "diffusion_cadence":"6",
    "border":"warp",
    "video_init_path":"templates/dimitri_finds_out/source.mp4",
    "extract_nth_frame":1,
    "overwrite_extracted_frames":true,
    "use_mask_video":true,
    "video_mask_path":"templates/dimitri_finds_out/mask.mp4",
    "interpolate_key_frames":false,
    "fps":24
}
```

설정 파일을 settings.txt로 저장합니다. 아래에 나타낸대로, 소스 비디오, 마스크 비디오, 및 설정 파일은 templates/dimitri_finds_out/ 하위 폴더에 저장됩니다.

<div class="content-ad"></div>

<img src="/assets/img/2024-06-19-CreatingPersonalizedAnimatedMemesUsingFine-tunedText-to-imageModels_2.png" />

# 단계 3: Deforum 실행하기

이제 Deforum 스크립트를 실행할 준비가 되었습니다. 저는 Deforum 기능을 제어하는 메타 스크립트인 run.py를 만들었습니다. 다음과 같이 명령줄에 두 가지 인자를 제공해야 합니다. 템플릿 이름과 여러분의 미세 조정된 모델의 이름입니다:

```js
python run.py \
  --meme_template="dimitri_finds_out" \
  --finetuned_model_path="your_finetuned_model.ckpt"
```

<div class="content-ad"></div>

하드웨어에 따라 스크립트 실행이 몇 분 정도 걸릴 수 있습니다. 제 경우에는 약 5분이 소요됩니다. 결과 동영상은 output/ 폴더에 저장됩니다.

![이미지](https://miro.medium.com/v2/resize:fit:1200/1*SlWST_jBJkg7rUxj2aHUMQ.gif)

# 단계 4: 동영상에 텍스트 추가

상상력과 유머 감각이 발휘되는 단계입니다. 우리는 동영상에 텍스트를 추가하여 미eme의 필수 요소인 비디오에 텍스트를 추가합니다. 제 메타 스크립트에는 텍스트 추가 기능이 구현되어 있지 않습니다(곧 추가할 예정). ffmpeg를 사용하여 명령줄을 통해 동영상에 텍스트를 추가할 수 있습니다.

<div class="content-ad"></div>

```bash
ffmpeg -i 경로/비디오 -vf "drawtext=text='당신의 텍스트':x=(w-tw)/2:y=(h-th)/12:fontfile=C:/Windows/Fonts/Arial.ttf:fontsize=40:fontcolor=white" 경로/출력/비디오
```

아래는 제가 한 작업입니다:

![이미지](https://miro.medium.com/v2/resize:fit:1200/1*BjphB2HVk5ANzpA_f1y-fA.gif)

제 블로그를 읽어주셔서 감사합니다. 곧 비슷한 콘텐츠 생성을 위해 ControlNet을 사용하는 또 다른 블로그를 작성할 예정입니다.

<div class="content-ad"></div>

좋은 하루 보내세요!