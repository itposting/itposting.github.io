---
title: "위성 이미지에서 GANs적대적 생성 신경망을 사용하여 구름 제거하기"
description: ""
coverImage: "/assets/img/2024-06-19-ErasingCloudsfromSatelliteImageryUsingGANsGenerativeAdversarialNetworks_0.png"
date: 2024-06-19 18:49
ogImage: 
  url: /assets/img/2024-06-19-ErasingCloudsfromSatelliteImageryUsingGANsGenerativeAdversarialNetworks_0.png
tag: Tech
originalTitle: "Erasing Clouds from Satellite Imagery Using GANs (Generative Adversarial Networks)"
link: "https://medium.com/towards-data-science/erasing-clouds-from-satellite-imagery-using-gans-generative-adversarial-networks-2d7f8467ef2e"
---


## 파이썬으로부터 GAN(Generative Adversarial Networks) 만들어 보기

![이미지](/assets/img/2024-06-19-ErasingCloudsfromSatelliteImageryUsingGANsGenerativeAdversarialNetworks_0.png)

GAN(Generative Adversarial Networks)이라는 아이디어는 2014년 Goodfellow와 그 동료들에 의해 소개되었고, 곧 그 이후에 컴퓨터 비전 및 이미지 생성 분야에서 극도로 인기를 끌게 되었습니다. 인공지능 분야에서의 급속한 발전과 새로운 알고리즘의 수가 늘어나는 것을 고려하더라도, 이 개념의 단순함과 창의성은 여전히 매우 인상적입니다. 그래서 오늘은 이러한 네트워크가 얼마나 강력할 수 있는지를 보여주기 위해 위성 RGB(빨강, 녹색, 파랑) 이미지에서 구름을 제거하는 시도를 해보려고 합니다.

적절히 균형 잡히고 충분히 크며 올바르게 전처리된 컴퓨터 비전 데이터셋을 준비하는 데에는 상당한 시간이 소요되므로, 저는 Kaggle에 어떤 것이 있는지 살펴보기로 결정했습니다. 이 작업에 가장 적합하다고 생각한 데이터셋은 EuroSat이며, 이는 오픈 라이선스를 가지고 있습니다. 이 데이터셋은 Sentinel-2에서 64x64 픽셀의 27000개의 레이블이 지정된 RGB 이미지로 구성되어 있고, 다중 클래스 분류 문제를 해결하기 위해 만들어졌습니다.

<div class="content-ad"></div>


![이미지](/assets/img/2024-06-19-ErasingCloudsfromSatelliteImageryUsingGANsGenerativeAdversarialNetworks_1.png)

우리는 분류 자체에 흥미가 없지만 EuroSat 데이터셋의 주요 기능 중 하나는 모든 이미지에 맑은 하늘이 있습니다. 그것이 정확히 우리가 필요한 것입니다. [3]에서 이 접근법을 채택하여, 우리는 이 Sentinel-2 샷을 대상으로 사용하고 입력을 추가하여 (구름) 노이즈를 생성할 것입니다.

그래서 우리가 GANs에 대해 실제로 이야기하기 전에 데이터를 준비해 봅시다. 우선, 데이터를 다운로드하고 모든 클래스를 하나의 디렉토리로 병합해야 합니다.

🐍전체 Python 코드: GitHub.


<div class="content-ad"></div>

```js
import numpy as np
import pandas as pd
import random

from os import listdir, mkdir, rename
from os.path import join, exists
import shutil
import datetime

import matplotlib.pyplot as plt
from highlight_text import ax_text, fig_text
from PIL import Image

import warnings

warnings.filterwarnings('ignore')
```

```js
classes = listdir('./EuroSat')
path_target = './EuroSat/all_targets'
path_input = './EuroSat/all_inputs'

"""UNPACK한 아카이브 파일의 파일 이름을 변경하기 위해 단 한 번만 실행하세요"""
mkdir(path_input)
mkdir(path_target)
k = 1
for kind in classes:
  path = join('./EuroSat', str(kind))
  for i, f in enumerate(listdir(path)):
    shutil.copyfile(join(path, f),
                  join(path_target, f))
    rename(join(path_target, f), join(path_target, f'{k}.jpg'))
    k += 1
```

중요한 두 번째 단계는 노이즈 생성입니다. 다양한 방법을 사용할 수 있지만, 예를 들어 일부 픽셀을 무작위로 마스킹하거나 가우시안 노이즈를 추가하는 등의 방법이 있습니다. 그러나 이 글에서는 저는 새로운 방식인 Perlin 노이즈를 시도해 보고 싶습니다. Perlin 노이즈는 80년대에 Ken Perlin이 영화 연기 효과를 개발할 때 발명했습니다. 이 종류의 노이즈는 일반적인 랜덤 노이즈에 비해 더 유기적인 외관을 가지고 있습니다. 저에게 이를 증명하는 기회를 주세요.

```js
def generate_perlin_noise(width, height, scale, octaves, persistence, lacunarity):
    noise = np.zeros((height, width))
    for i in range(height):
        for j in range(width):
            noise[i][j] = pnoise2(i / scale,
                                  j / scale,
                                  octaves=octaves,
                                  persistence=persistence,
                                  lacunarity=lacunarity,
                                  repeatx=width,
                                  repeaty=height,
                                  base=0)
    return noise

def normalize_noise(noise):
    min_val = noise.min()
    max_val = noise.max()
    return (noise - min_val) / (max_val - min_val)

def generate_clouds(width, height, base_scale, octaves, persistence, lacunarity):
    clouds = np.zeros((height, width))
    for octave in range(1, octaves + 1):
        scale = base_scale / octave
        layer = generate_perlin_noise(width, height, scale, 1, persistence, lacunarity)
        clouds += layer * (persistence ** octave)

    clouds = normalize_noise(clouds)
    return clouds

def overlay_clouds(image, clouds, alpha=0.5):

    clouds_rgb = np.stack([clouds] * 3, axis=-1)

    image = image.astype(float) / 255.0
    clouds_rgb = clouds_rgb.astype(float)

    blended = image * (1 - alpha) + clouds_rgb * alpha

    blended = (blended * 255).astype(np.uint8)
    return blended
```

<div class="content-ad"></div>

```js
가로, 세로 = 64, 64
옥타브 = 12  # 합쳐지는 잡음 레이어의 수
지속성 = 0.5  # 낮은 지속성은 높은 주파수 옥타브의 진폭을 줄입니다.
라쿠나리티 = 2  # 높은 라쿠나리티는 높은 주파수 옥타브의 주파수를 늘립니다.
for i in range(len(listdir(path_target))):
  기본_스케일 = random.uniform(5, 120)  # 잡음 주파수
  알파 = random.uniform(0, 1)  # 투명도

  구름 = generate_clouds(가로, 세로, 기본_스케일, 옥타브, 지속성, 라쿠나리티)

  이미지 = np.asarray(Image.open(join(path_target, f'{i+1}.jpg')))
  이미지 = Image.fromarray(overlay_clouds(이미지, 구름, 알파))
  이미지.save(join(path_input, f'{i+1}.jpg'))
  print(f'{i+1}/{len(listdir(path_target))}번째 처리 완료')
```

```js
인덱스 = np.random.randint(27000)
fig, ax = plt.subplots(1,2)
ax[0].imshow(np.asarray(Image.open(join(path_target, f'{인덱스}.jpg')))
ax[1].imshow(np.asarray(Image.open(join(path_input, f'{인덱스}.jpg')))
ax[0].set_title("원본")
ax[0].axis('off')
ax[1].set_title("입력")
ax[1].axis('off')
plt.show()
```

<img src="/assets/img/2024-06-19-ErasingCloudsfromSatelliteImageryUsingGANsGenerativeAdversarialNetworks_2.png" />

위에서 볼 수 있듯이 이미지의 구름은 매우 현실적이며 다양한 "밀도"와 질감을 가지며 실제 구름과 유사합니다.

<div class="content-ad"></div>

만약 저처럼 Perlin 소음에 흥미를 느낀다면, 게임 개발 산업에서 이 소음이 어떻게 적용될 수 있는지에 대한 정말 멋진 비디오가 있어요!

이제 우리가 사용할 준비가 된 데이터셋이 있으니, GANs에 대해 이야기해 보겠습니다.

# 생성적 적대 신경망

이 아이디어를 더 잘 설명하기 위해, 동남아시아를 여행하다가 밖이 너무 춥다고 느낄 때 후디가 절실하게 필요하다고 상상해 보세요. 가장 가까운 거리 시장에 가보니, 몇 가지 브랜드 의류가 있는 작은 가게를 발견했어요. 판매자가 유명한 브랜드 ExpensiveButNotWorthIt의 후디를 시도해보라며 괜찮은 후디를 가져다줍니다. 더 자세히 살펴보고 분명히 가짜라고 결론 내리게 됩니다. 판매자가 말합니다: '잠시만요, 진짜 것이 있어요.' 그가 다른 후디를 가져오는데, 브랜드 제품과 더 닮았지만 여전히 가짜입니다. 이와 같은 반복 작업을 몇 번 거친 후, 판매자가 전설적인 ExpensiveButNotWorthIt의 구별이 어려운 사본을 가져와 여러분은 기꺼이 구매하게 됩니다. 이것이 바로 GANs가 작동하는 방식입니다!

<div class="content-ad"></div>

GAN의 경우, 당신은 판별자(D)라고 불립니다. 판별자의 목표는 진짜 물체와 가짜 물체를 구별하거나 이진 분류 작업을 수행하는 것입니다. 이에 반해, 생성자(G)는 높은 품질의 가짜를 생성하려고 하는 판매자라고 불립니다. 판별자와 생성자는 서로 능가하기 위해 독립적으로 훈련됩니다. 따라서 최종적으로 우리는 높은 품질의 가짜를 얻습니다.

![이미지](/assets/img/2024-06-19-ErasingCloudsfromSatelliteImageryUsingGANsGenerativeAdversarialNetworks_3.png)

훈련 과정은 일반적으로 다음과 같이 진행됩니다:

- 입력 노이즈를 샘플링합니다 (우리의 경우 구름이 있는 이미지).
- 노이즈를 생성자(G)에 공급하고 예측을 수집합니다.
- D 손실을 계산합니다. G의 출력에 대한 하나와 실제 데이터에 대한 다른 예측을 얻어서 이루어집니다.
- D의 가중치를 업데이트합니다.
- 다시 입력 노이즈를 샘플링합니다.
- 노이즈를 생성자(G)에 공급하고 예측을 수집합니다.
- G 손실을 계산합니다. G의 예측을 D에 공급하여 이루어집니다.
- G의 가중치를 업데이트합니다.

<div class="content-ad"></div>


![Erasing Clouds from Satellite Imagery Using GANs](/assets/img/2024-06-19-ErasingCloudsfromSatelliteImageryUsingGANsGenerativeAdversarialNetworks_4.png)

In other words, we can define a value function V(G,D):

![Value function V(G,D)](/assets/img/2024-06-19-ErasingCloudsfromSatelliteImageryUsingGANsGenerativeAdversarialNetworks_5.png)

where we want to minimize the term log(1-D(G(z))) to train G and maximize log D(x) to train D (in this notation x — real data sample and z — noise).


<div class="content-ad"></div>

이제 파이토치에서 구현해 봅시다!

원본 논문에서 저자들은 Multilayer Perceptron (MLP)을 사용하는 것에 대해 언급합니다; 이것은 ANN으로 간단히도 불립니다만, 저는 미세한 접근을 시도하고 싶습니다 — Generator로 UNet [5] 아키텍처를 사용하고, Discriminator로는 ResNet [6]을 사용하고 싶습니다. 이들은 둘 다 잘 알려진 CNN 아키텍처이기 때문에 여기서 설명하지는 않겠습니다 (댓글에서 별도의 글을 쓸지 여부를 알려주세요).

이제 구축해 봅시다. Discriminator:

```python
import torch
import torch.nn as nn
import torch.optim as optim
import torch.nn.functional as F
from torch.utils.data import Dataset, DataLoader
from torchvision import transforms
from torch.utils.data import Subset
```

<div class="content-ad"></div>

```js
class ResidualBlock(nn.Module):
    def __init__(self, in_channels, out_channels, stride = 1, downsample = None):
        super(ResidualBlock, self).__init__()
        self.conv1 = nn.Sequential(
                        nn.Conv2d(in_channels, out_channels, kernel_size = 3, stride = stride, padding = 1),
                        nn.BatchNorm2d(out_channels),
                        nn.ReLU())
        self.conv2 = nn.Sequential(
                        nn.Conv2d(out_channels, out_channels, kernel_size = 3, stride = 1, padding = 1),
                        nn.BatchNorm2d(out_channels))
        self.downsample = downsample
        self.relu = nn.ReLU()
        self.out_channels = out_channels

    def forward(self, x):
        residual = x
        out = self.conv1(x)
        out = self.conv2(out)
        if self.downsample:
            residual = self.downsample(x)
        out += residual
        out = self.relu(out)
        return out


class ResNet(nn.Module):
    def __init__(self, block=ResidualBlock, all_connections=[3,4,6,3]):
        super(ResNet, self).__init__()
        self.inputs = 16
        self.conv1 = nn.Sequential(
                        nn.Conv2d(3, 16, kernel_size = 3, stride = 1, padding = 1),
                        nn.BatchNorm2d(16),
                        nn.ReLU()) #16x64x64
        self.maxpool = nn.MaxPool2d(kernel_size = 2, stride = 2) #16x32x32


        self.layer0 = self.makeLayer(block, 16, all_connections[0], stride = 1) #connections = 3, shape: 16x32x32
        self.layer1 = self.makeLayer(block, 32, all_connections[1], stride = 2)#connections = 4, shape: 32x16x16
        self.layer2 = self.makeLayer(block, 128, all_connections[2], stride = 2)#connections = 6, shape: 1281x8x8
        self.layer3 = self.makeLayer(block, 256, all_connections[3], stride = 2)#connections = 3, shape: 256x4x4
        self.avgpool = nn.AvgPool2d(4, stride=1)
        self.fc = nn.Linear(256, 1)

    def makeLayer(self, block, outputs, connections, stride=1):
        downsample = None
        if stride != 1 or self.inputs != outputs:
            downsample = nn.Sequential(
                nn.Conv2d(self.inputs, outputs, kernel_size=1, stride=stride),
                nn.BatchNorm2d(outputs),
            )
        layers = []
        layers.append(block(self.inputs, outputs, stride, downsample))
        self.inputs = outputs
        for i in range(1, connections):
            layers.append(block(self.inputs, outputs))

        return nn.Sequential(*layers)


    def forward(self, x):
        x = self.conv1(x)
        x = self.maxpool(x)
        x = self.layer0(x)
        x = self.layer1(x)
        x = self.layer2(x)
        x = self.layer3(x)
        x = self.avgpool(x)
        x = x.view(-1, 256)
        x = self.fc(x).flatten()
        return F.sigmoid(x)
```

Generator:

```js
class DoubleConv(nn.Module):
    def __init__(self, in_channels, out_channels):
        super(DoubleConv, self).__init__()
        self.double_conv = nn.Sequential(
            nn.Conv2d(in_channels, out_channels, kernel_size=3, padding=1),
            nn.BatchNorm2d(out_channels),
            nn.ReLU(inplace=True),
            nn.Conv2d(out_channels, out_channels, kernel_size=3, padding=1),
            nn.BatchNorm2d(out_channels),
            nn.ReLU(inplace=True)
        )

    def forward(self, x):
        return self.double_conv(x)

class UNet(nn.Module):
    def __init__(self):
      super().__init__()
      self.conv_1 = DoubleConv(3, 32) # 32x64x64
      self.pool_1 = nn.MaxPool2d(kernel_size=2, stride=2) # 32x32x32

      self.conv_2 = DoubleConv(32, 64)  #64x32x32
      self.pool_2 = nn.MaxPool2d(kernel_size=2, stride=2) #64x16x16

      self.conv_3 = DoubleConv(64, 128)  #128x16x16
      self.pool_3 = nn.MaxPool2d(kernel_size=2, stride=2) #128x8x8

      self.conv_4 = DoubleConv(128, 256)  #256x8x8
      self.pool_4 = nn.MaxPool2d(kernel_size=2, stride=2) #256x4x4

      self.conv_5 = DoubleConv(256, 512)  #512x2x2

      #DECODER
      self.upconv_1 = nn.ConvTranspose2d(512, 256, kernel_size=2, stride=2) #256x4x4
      self.conv_6 = DoubleConv(512, 256) #256x4x4


      self.upconv_2 = nn.ConvTranspose2d(256, 128, kernel_size=2, stride=2) #128x8x8
      self.conv_7 = DoubleConv(256, 128)  #128x8x8

      self.upconv_3 = nn.ConvTranspose2d(128, 64, kernel_size=2, stride=2) #64x16x16
      self.conv_8 = DoubleConv(128, 64)  #64x16x16

      self.upconv_4 = nn.ConvTranspose2d(64, 32, kernel_size=2, stride=2) #32x32x32
      self.conv_9 = DoubleConv(64, 32)  #32x32x32

      self.output = nn.Conv2d(32, 3, kernel_size = 3, stride = 1, padding = 1) #3x64x64

    def forward(self, batch):

      conv_1_out = self.conv_1(batch)
      conv_2_out = self.conv_2(self.pool_1(conv_1_out))
      conv_3_out = self.conv_3(self.pool_2(conv_2_out))
      conv_4_out = self.conv_4(self.pool_3(conv_3_out))
      conv_5_out = self.conv_5(self.pool_4(conv_4_out))

      conv_6_out = self.conv_6(torch.cat([self.upconv_1(conv_5_out), conv_4_out], dim=1))
      conv_7_out = self.conv_7(torch.cat([self.upconv_2(conv_6_out), conv_3_out], dim=1))
      conv_8_out = self.conv_8(torch.cat([self.upconv_3(conv_7_out), conv_2_out], dim=1))
      conv_9_out = self.conv_9(torch.cat([self.upconv_4(conv_8_out), conv_1_out], dim=1))

      output = self.output(conv_9_out)


      return F.sigmoid(output)
```

이제 데이터를 훈련/테스트 세트로 분할하고 torch 데이터 세트로 래핑해야합니다:

<div class="content-ad"></div>

```python
class dataset(Dataset):
    def __init__(self, batch_size, images_paths, targets, img_size=64):
        self.batch_size = batch_size
        self.img_size = img_size
        self.images_paths = images_paths
        self.targets = targets
        self.len = len(self.images_paths) // batch_size

        self.transform = transforms.Compose([
            transforms.ToTensor(),
        ])

        self.batch_im = [self.images_paths[idx * self.batch_size:(idx + 1) * self.batch_size] for idx in range(self.len)]
        self.batch_t = [self.targets[idx * self.batch_size:(idx + 1) * self.batch_size] for idx in range(self.len)]

    def __getitem__(self, idx):
        pred = torch.stack([
            self.transform(Image.open(join(path_input, file_name)))
            for file_name in self.batch_im[idx]
        ])
        target = torch.stack([
            self.transform(Image.open(join(path_target, file_name)))
            for file_name in self.batch_im[idx]
        ])
        return pred, target

    def __len__(self):
        return self.len
```

멋져요. 이제 훈련 루프를 작성할 시간입니다. 그 전에 손실 함수와 옵티마이저를 정의해 봅시다:

```python
device = torch.device("cuda" if torch.cuda.is_available() else "cpu")

batch_size = 64
num_epochs = 15
learning_rate_D = 1e-5
learning_rate_G = 1e-4

discriminator = ResNet()
generator = UNet()

bce = nn.BCEWithLogitsLoss()
l1loss = nn.L1Loss()

optimizer_D = optim.Adam(discriminator.parameters(), lr=learning_rate_D)
optimizer_G = optim.Adam(generator.parameters(), lr=learning_rate_G)

scheduler_D = optim.lr_scheduler.StepLR(optimizer_D, step_size=10, gamma=0.1)
scheduler_G = optim.lr_scheduler.StepLR(optimizer_G, step_size=10, gamma=0.1)
```

이전 GAN 알고리즘 그림의 손실 함수와는 다른 것을 볼 수 있습니다. 특히 L1 손실을 추가했습니다. 이 아이디어는 우리가 무작위로 이미지를 생성하는 것이 아니라 입력에서 대부분의 정보를 유지하고 노이즈만 제거하려고 한다는 것입니다. 따라서 G 손실은 다음과 같을 것입니다:

<div class="content-ad"></div>


G_loss = log(1 − D(G(z))) + 𝝀 |G(z)-y|

instead of just

G_loss = log(1 − D(G(z)))

𝝀 is an arbitrary coefficient, which balances two components of the losses.


<div class="content-ad"></div>

이제 데이터를 분할하여 훈련 과정을 시작해봅시다:

```js
test_ratio, train_ratio = 0.3, 0.7
num_test = int(len(listdir(path_target)) * test_ratio)
num_train = int((int(len(listdir(path_target))) - num_test))

img_size = (64, 64)

print("훈련 샘플 수:", num_train)
print("테스트 샘플 수:", num_test)

random.seed(231)
train_idxs = np.array(random.sample(range(num_test + num_train), num_train))
mask = np.ones(num_train + num_test, dtype=bool)
mask[train_idxs] = False

images = {}
features = random.sample(listdir(path_input), num_test + num_train)
targets = random.sample(listdir(path_target), num_test + num_train)

random.Random(231).shuffle(features)
random.Random(231).shuffle(targets)

train_input_img_paths = np.array(features)[train_idxs]
train_target_img_path = np.array(targets)[train_idxs]
test_input_img_paths = np.array(features)[mask]
test_target_img_path = np.array(targets)[mask]

train_loader = dataset(batch_size=batch_size, img_size=img_size, images_paths=train_input_img_paths, targets=train_target_img_path)
test_loader = dataset(batch_size=batch_size, img_size=img_size, images_paths=test_input_img_paths, targets=test_target_img_path)
```

이제 훈련 루프를 실행해봅시다:

```js
train_loss_G, train_loss_D, val_loss_G, val_loss_D = [], [], [], []
all_loss_G, all_loss_D = [], []
best_generator_epoch_val_loss, best_discriminator_epoch_val_loss = -np.inf, -np.inf
for epoch in range(num_epochs):

    discriminator.train()
    generator.train()

    discriminator_epoch_loss, generator_epoch_loss = 0, 0

    for inputs, targets in train_loader:
        inputs, true = inputs, targets

        '''1. 판별자 (ResNet) 훈련하기'''
        optimizer_D.zero_grad()

        fake = generator(inputs).detach()

        pred_fake = discriminator(fake).to(device)
        loss_fake = bce(pred_fake, torch.zeros(batch_size, device=device))

        pred_real = discriminator(true).to(device)
        loss_real = bce(pred_real, torch.ones(batch_size, device=device))

        loss_D = (loss_fake + loss_real) / 2

        loss_D.backward()
        optimizer_D.step()

        discriminator_epoch_loss += loss_D.item()
        all_loss_D.append(loss_D.item())

        '''2. 생성자 (UNet) 훈련하기'''
        optimizer_G.zero_grad()

        fake = generator(inputs)
        pred_fake = discriminator(fake).to(device)

        loss_G_bce = bce(pred_fake, torch.ones_like(pred_fake, device=device))
        loss_G_l1 = l1loss(fake, targets) * 100
        loss_G = loss_G_bce + loss_G_l1
        loss_G.backward()
        optimizer_G.step()

        generator_epoch_loss += loss_G.item()
        all_loss_G.append(loss_G.item())

    discriminator_epoch_loss /= len(train_loader)
    generator_epoch_loss /= len(train_loader)
    train_loss_D.append(discriminator_epoch_loss)
    train_loss_G.append(generator_epoch_loss)

    discriminator.eval()
    generator.eval()

    discriminator_epoch_val_loss, generator_epoch_val_loss = 0, 0

    with torch.no_grad():
        for inputs, targets in test_loader:
            inputs, targets = inputs, targets

            fake = generator(inputs)
            pred = discriminator(fake).to(device)

            loss_G_bce = bce(fake, torch.ones_like(fake, device=device))
            loss_G_l1 = l1loss(fake, targets) * 100
            loss_G = loss_G_bce + loss_G_l1
            loss_D = bce(pred.to(device), torch.zeros(batch_size, device=device))

            discriminator_epoch_val_loss += loss_D.item()
            generator_epoch_val_loss += loss_G.item()

    discriminator_epoch_val_loss /= len(test_loader)
    generator_epoch_val_loss /= len(test_loader)

    val_loss_D.append(discriminator_epoch_val_loss)
    val_loss_G.append(generator_epoch_val_loss)

    print(f"------에포크 [{epoch+1}/{num_epochs}]------\n훈련 손실 D: {discriminator_epoch_loss:.4f}, 검증 손실 D: {discriminator_epoch_val_loss:.4f}")
    print(f'훈련 손실 G: {generator_epoch_loss:.4f}, 검증 손실 G: {generator_epoch_val_loss:.4f}')

    if discriminator_epoch_val_loss > best_discriminator_epoch_val_loss:
        discriminator_epoch_val_loss = best_discriminator_epoch_val_loss
        torch.save(discriminator.state_dict(), "discriminator.pth")
    if generator_epoch_val_loss > best_generator_epoch_val_loss:
        generator_epoch_val_loss = best_generator_epoch_val_loss
        torch.save(generator.state_dict(), "generator.pth")

    fig, ax = plt.subplots(1,3)
    ax[0].imshow(np.transpose(inputs.numpy()[7], (1,2,0)))
    ax[1].imshow(np.transpose(targets.numpy()[7], (1,2,0)))
    ax[2].imshow(np.transpose(fake.detach().numpy()[7], (1,2,0)))
    plt.show()
```

<div class="content-ad"></div>

코드가 끝나면 손실을 그래프로 그려볼 수 있어요. 이 코드는 이 멋진 웹사이트에서 일부 채택되었어요:

```js
from matplotlib.font_manager import FontProperties

background_color = '#001219'
font = FontProperties(fname='LexendDeca-VariableFont_wght.ttf')
fig, ax = plt.subplots(1, 2, figsize=(16, 9))
fig.set_facecolor(background_color)
ax[0].set_facecolor(background_color)
ax[1].set_facecolor(background_color)

ax[0].plot(range(len(all_loss_G)), all_loss_G, color='#bc6c25', lw=0.5) 
ax[1].plot(range(len(all_loss_D)), all_loss_D, color='#00b4d8', lw=0.5)

ax[0].scatter(
      [np.array(all_loss_G).argmax(), np.array(all_loss_G).argmin()],
      [np.array(all_loss_G).max(), np.array(all_loss_G).min()],
      s=30, color='#bc6c25',
   )
ax[1].scatter(
      [np.array(all_loss_D).argmax(), np.array(all_loss_D).argmin()],
      [np.array(all_loss_D).max(), np.array(all_loss_D).min()],
      s=30, color='#00b4d8',
   )

ax.text(
      np.array(all_loss_G).argmax()+60, np.array(all_loss_G).max()+0.1,
      f'{round(np.array(all_loss_G).max(),1)}',
      fontsize=13, color='#bc6c25',
      font=font,
      ax=ax[0]
   )
ax.text(
      np.array(all_loss_G).argmin()+60, np.array(all_loss_G).min()-0.1,
      f'{round(np.array(all_loss_G).min(),1)}',
      fontsize=13, color='#bc6c25',
      font=font,
      ax=ax[0]
   )

ax.text(
      np.array(all_loss_D).argmax()+60, np.array(all_loss_D).max()+0.01,
      f'{round(np.array(all_loss_D).max(),1)}',
      fontsize=13, color='#00b4d8',
      font=font,
      ax=ax[1]
   )
ax.text(
      np.array(all_loss_D).argmin()+60, np.array(all_loss_D).min()-0.005,
      f'{round(np.array(all_loss_D).min(),1)}',
      fontsize=13, color='#00b4d8',
      font=font,
      ax=ax[1]
   )
for i in range(2):
    ax[i].tick_params(axis='x', colors='white')
    ax[i].tick_params(axis='y', colors='white')
    ax[i].spines['left'].set_color('white') 
    ax[i].spines['bottom'].set_color('white') 
    ax[i].set_xlabel('Epoch', color='white', fontproperties=font, fontsize=13)
    ax[i].set_ylabel('Loss', color='white', fontproperties=font, fontsize=13)

ax[0].set_title('Generator', color='white', fontproperties=font, fontsize=18)
ax[1].set_title('Discriminator', color='white', fontproperties=font, fontsize=18)
plt.savefig('Loss.jpg')
plt.show()
# ax[0].set_axis_off()
# ax[1].set_axis_off()
```

또한 테스트 데이터셋에서 임의의 샘플을 시각화할게요:

```js
random.Random(2).shuffle(test_target_img_path)
random.Random(2).shuffle(test_input_img_paths)
subset_loader = dataset(batch_size=5, img_size=img_size, images_paths=test_input_img_paths,
                        targets=test_target_img_path)
generator = UNet()
generator.load_state_dict(torch.load('generator.pth'))

generator.eval()
for X, y in subset_loader:
    fig, axes = plt.subplots(5, 3, figsize=(9, 9))

    for i in range(5):
        axes[i, 0].imshow(np.transpose(X.numpy()[i], (1, 2, 0)))
        axes[i, 0].set_title("Input")
        axes[i, 0].axis('off')
        
        axes[i, 1].imshow(np.transpose(y.numpy()[i], (1, 2, 0)))
        axes[i, 1].set_title("Target")
        axes[i, 1].axis('off')
        
        generated_image = generator(X[i].unsqueeze(0)).detach().numpy()[0]
        axes[i, 2].imshow(np.transpose(generated_image, (1, 2, 0)))
        axes[i, 2].set_title("Generated")
        axes[i, 2].axis('off')
    
    # 레이아웃 조정
    plt.tight_layout()
    plt.savefig('Test.jpg')
    plt.show()
    break 
```

<div class="content-ad"></div>

<img src="/assets/img/2024-06-19-ErasingCloudsfromSatelliteImageryUsingGANsGenerativeAdversarialNetworks_6.png" />

여기서 보시다시피, 결과는 완벽하지 않고 땅커버 유형에 매우 의존합니다. 그럼에도 불구하고, 구축된 모델은 이미지에서 구름을 제거하며, G 및 D 깊이를 늘리는 것으로 성능을 향상시킬 수 있습니다. 다른 유망한 전략은 서로 다른 땅커버 유형을 위해 별도의 모델을 훈련시키는 것입니다. 예를 들어, 작물밭과 물 투구는 분명히 다른 공간적 특징을 가지고 있기 때문에 일반화 모델의 능력에 영향을 주는 경우가 있습니다.

이 기사가 지리정보 도메인에서 심층 학습 알고리즘을 적용하는 데 새로운 시각을 제공해 드렸기를 바랍니다. 내 생각에는, GANs는 데이터 과학자가 활용할 수 있는 가장 강력한 도구 중 하나이며, 여러분의 도구 상자의 필수적인 부분이 되길 희망합니다!

===========================================

<div class="content-ad"></div>

참고문헌:

1. Goodfellow, Ian, Jean Pouget-Abadie, Mehdi Mirza, Bing Xu, David Warde-Farley, Sherjil Ozair, Aaron Courville 및 Yoshua Bengio. “Generative adversarial nets.” Advances in neural information processing systems 27 (2014). [논문 링크](https://proceedings.neurips.cc/paper_files/paper/2014/file/5ca3e9b122f61f8f06494c97b1afccf3-Paper.pdf)

2. Helber, Patrick, Benjamin Bischke, Andreas Dengel 및 Damian Borth. “Eurosat: A novel dataset and deep learning benchmark for land use and land cover classification.” IEEE Journal of Selected Topics in Applied Earth Observations and Remote Sensing 12, no. 7 (2019): 2217–2226. [논문 링크](https://arxiv.org/pdf/1709.00029)

3. Wen, Xue, Zongxu Pan, Yuxin Hu 및 Jiayin Liu. “Generative adversarial learning in YUV color space for thin cloud removal on satellite imagery.” Remote Sensing 13, no. 6 (2021): 1079. [논문 링크](https://www.mdpi.com/2072-4292/13/6/1079)

<div class="content-ad"></div>

5. Ronneberger, Olaf, Philipp Fischer, and Thomas Brox. “U-net: Convolutional networks for biomedical image segmentation.” In Medical image computing and computer-assisted intervention–MICCAI 2015: 18th international conference, Munich, Germany, October 5–9, 2015, proceedings, part III 18, pp. 234–241. Springer International Publishing, 2015. [Link](https://arxiv.org/pdf/1505.04597)

6. He, Kaiming, et al. “Deep residual learning for image recognition.” Proceedings of the IEEE conference on computer vision and pattern recognition. 2016. [Link](https://openaccess.thecvf.com/content_cvpr_2016/papers/He_Deep_Residual_Learning_CVPR_2016_paper.pdf)

===========================================

<div class="content-ad"></div>

제 Medium의 모든 게시물은 무료이며 공개되어 있습니다. 그래서 여기서 저를 팔로우해 주시면 정말 감사하겠습니다!

P.s. 저는 (지리)데이터 과학, 머신 러닝/인공지능, 기후 변화에 대해 열정적으로 관심을 가지고 있습니다. 그래서 어떤 프로젝트에서 함께 작업하고 싶다면 LinkedIn에서 연락 주세요.

🛰️더 많은 소식을 받아보려면 팔로우하세요!🛰️