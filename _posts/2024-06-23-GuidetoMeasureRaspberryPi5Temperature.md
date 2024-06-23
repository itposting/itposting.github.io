---
title: "Raspberry Pi 5 온도 측정 가이드"
description: ""
coverImage: "/assets/img/2024-06-23-GuidetoMeasureRaspberryPi5Temperature_0.png"
date: 2024-06-23 18:20
ogImage: 
  url: /assets/img/2024-06-23-GuidetoMeasureRaspberryPi5Temperature_0.png
tag: Tech
originalTitle: "Guide to Measure Raspberry Pi 5 Temperature"
link: "https://medium.com/@MrTechGuy/guide-to-measure-raspberry-pi-5-temperature-429d61a1ec44"
---


라즈베리 파이 5의 온도를 이해하는 것은 중요합니다, 특히 고부하 작업 중일 때에는 더욱 중요합니다. 라즈베리 파이 5의 온도를 측정하는 데 도움이 되는 단계별 안내서가 여기 있습니다:

# 소개:

- 라즈베리 파이 5는 일반적으로 자주 사용하는 조건 하에서 이전 모델인 라즈베리 파이 4보다 더 적게 발열합니다. 그러나 지속적인 고부하 과업 시에는 열 쓰로틀링이 발생할 수 있습니다.
- 열 쓰로틀링은 소프트웨어가 일정한 온도 이상일 때 CPU 속도를 제한하는 기능입니다. 쓰로틀링 상태에서도 라즈베리 파이 5는 라즈베리 파이 4보다 우수한 성능을 발휘합니다.

# CPU 온도 측정 방법:

<div class="content-ad"></div>

vcgencmd 명령어 사용하기:

- vcgencmd 명령어를 사용하면 Raspberry Pi의 성능에 관한 소중한 정보를 얻을 수 있습니다.
- Python 바인딩을 사용하면 온도를 포함한 다양한 매개변수를 프로그래밍 방식으로 모니터링할 수 있습니다.

Python 스크립트:

- 제공된 코드를 사용하여 온도, CPU 클록 속도 및 현재 쓰로틀링 상태를 모니터링하고 기록하는 Python 스크립트를 작성합니다.
- 이 스크립트는 readings.txt라는 파일에 측정값을 저장합니다.

<div class="content-ad"></div>

```python
import sys
import os
import time
from vcgencmd import Vcgencmd

def main():
    start_time = time.time()
    fb = open("/home/pi/readings.txt","a+")
    fb.write("경과 시간 (초),온도 (°C),클럭 속도 (MHz),쓰로틀\n")
    vcgm = Vcgencmd()
    while True:
        temp = vcgm.measure_temp()
        clock = int(vcgm.measure_clock('arm')/1000000)
        throttled = vcgm.get_throttled()['breakdown']['2']

        string = '%.0f,%s,%s,%s\n' % ((time.time() - start_time),temp,clock,throttled)
        print(string, end='')
        fb.write(string)
        time.sleep(1)

if __name__ == '__main__':
    main()
```

스트레스 테스팅:

- 터미널 창을 열고 스크립트를 실행합니다.
- 다른 터미널 창에서 stress 도구를 사용하여 모든 CPU 코어에 대한 스트레스 테스트를 시작합니다:

```bash
$ sudo apt install stress
$ stress --cpu 4
```  

<div class="content-ad"></div>

이것은 무거운 작업을 가하며 CPU 온도가 증가합니다.

쓰로틀링 제한:

- 라즈베리 파이 보드는 프로세서를 80°C에서 쓰로틀링합니다.
- 85°C에서 추가 쓰로틀링이 발생하여 손상을 방지합니다.

냉각 없는 경우 관측:

<div class="content-ad"></div>

- 냉각 없이 Raspberry Pi 5의 유휴 온도는 약 65°C 정도입니다.
- 스트레스 테스트와 같은 강도 높은 활동 중에는 온도가 상승하여 85°C 열 한계를 약간 넘어서 안정화되기도 합니다. 이는 지속적인 열 추소를 유발할 수 있습니다.

# 결론:

동영상 시청 또는 데스크톱 작업과 같은 일반적인 활동은 CPU에 크게 부담을주지 않을 수 있지만, 냉각 없이 중대하고 지속적인 부하를 가할 경우 Raspberry Pi 5를 열 한계에 끌어올릴 수 있습니다. 온도를 모니터링하면 냉각 솔루션을 추가할 필요가 있는지에 대한 판단을 내릴 수 있습니다.

본문의 저자는 Amazon Services LLC Associates Program의 참여자로, 이는 광고 수익을 제공하기 위해 디자인된 제품을 Amazon.com에 광고하고 링크하는 제휴 광고 프로그램입니다. 이 말은 우리의 링크를 통해 제품을 구매할 때마다 추가 비용없이 소액의 커미션을 벌 수 있다는 뜻입니다.