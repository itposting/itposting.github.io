---
title: "윈도우에 Pyspark 설치하는 단계별 안내법"
description: ""
coverImage: "/assets/img/2024-05-27-AStep-by-StepGuidetoInstallingPysparkonWindows_0.png"
date: 2024-05-27 12:29
ogImage: 
  url: /assets/img/2024-05-27-AStep-by-StepGuidetoInstallingPysparkonWindows_0.png
tag: Tech
originalTitle: "A Step-by-Step Guide to Installing Pyspark on Windows"
link: "https://medium.com/@deepaksrawat1906/a-step-by-step-guide-to-installing-pyspark-on-windows-3589f0139a30"
---


## 소개

![image](/assets/img/2024-05-27-AStep-by-StepGuidetoInstallingPysparkonWindows_0.png)

아파치 스파크는 속도와 사용 편의성으로 인해 엄청난 인기를 얻은 강력한 오픈 소스 분산 컴퓨팅 시스템입니다. 파이스파크는 아파치 스파크를 사용하여 Python 프로그래밍 언어를 통해 스파크의 기능을 활용할 수 있도록 하는 파이썬 API입니다. 스파크는 보통 리눅스 환경과 관련이 있지만, Windows에 Pyspark를 설치하는 것은 다소 어려울 수 있습니다. 이 안내서에서는 Windows 기기에 Pyspark를 설치하는 프로세스를 단계별로 안내해 드리겠습니다.

자, 그럼 Windows에 Pyspark를 설치하는 단계별 프로세스로 들어가 보겠습니다:

<div class="content-ad"></div>

단계 1: 로컬 시스템에 Python 설치하기

a. https://www.python.org/downloads/에서 최신 버전의 Python을 다운로드합니다.

b. 설치 프로그램을 다운로드한 후 실행 파일(예: python-3.x.x.exe)을 더블 클릭하여 설치를 시작하고, 설치 중 "Add Python to PATH"란을 확인하는 상자를 선택해야 합니다.

c. 명령 프롬프트를 열고 python --version 또는 python -V를 입력한 후 엔터를 눌러 Python이 설치되었는지 확인하세요.

<div class="content-ad"></div>

![이미지](/assets/img/2024-05-27-AStep-by-StepGuidetoInstallingPysparkonWindows_1.png)

단계 2: Java 개발 키트 (JDK) 설치하기

a. 오라클 웹사이트에서 최신 JDK 설치 프로그램을 다운로드합니다.

b. 설치 프로그램을 실행하고 화면 안내에 따라 설치를 완료하세요.

<div class="content-ad"></div>

c. JAVA_HOME 환경 변수를 설정합니다. 시스템 환경 변수에 JDK 설치 경로를 추가하세요.

![image](/assets/img/2024-05-27-AStep-by-StepGuidetoInstallingPysparkonWindows_2.png)

d. 명령 프롬프트를 열어 java --version을 입력하고 엔터를 눌러 Java가 설치되었는지 확인하세요.

![image](/assets/img/2024-05-27-AStep-by-StepGuidetoInstallingPysparkonWindows_3.png)

<div class="content-ad"></div>

**단계 3: Apache Spark 설치하기**

a. 스파크 다운로드 페이지(https://spark.apache.org/downloads.html)를 방문해주세요.

![이미지](/assets/img/2024-05-27-AStep-by-StepGuidetoInstallingPysparkonWindows_4.png)

b. SPARK_HOME을 spark가 추출된 환경 변수에 설정하세요. 수정할 부분입니다.

<div class="content-ad"></div>

Markdown 형식으로 표를 변경해주세요.

| 이미지 | 설명 |
| --- | --- |
| <img src="/assets/img/2024-05-27-AStep-by-StepGuidetoInstallingPysparkonWindows_5.png" /> | 스텝 4 : Hadoop 설정 |
| a. | hadoop 폴더 생성 및 그 안에 bin 폴더 생성 |
| b. | winutils 파일 다운로드 - https://github.com/steveloughran/winutils 및 bin 폴더에 넣기 |

<div class="content-ad"></div>

<img src="/assets/img/2024-05-27-AStep-by-StepGuidetoInstallingPysparkonWindows_6.png" />

c. 환경 변수에서 HADOOP_HOME 경로 설정

<img src="/assets/img/2024-05-27-AStep-by-StepGuidetoInstallingPysparkonWindows_7.png" />

단계 5 : Pyspark 설치

<div class="content-ad"></div>

a. 명령 프롬프트를 열고 다음 명령어를 실행하세요 — pip install pyspark

b. 환경 변수에서 PYSPARK_HOME 경로를 설정하세요

![이미지](/assets/img/2024-05-27-AStep-by-StepGuidetoInstallingPysparkonWindows_8.png)

단계 6: 설치 확인

<div class="content-ad"></div>

a. 모든 변수를 경로에 추가해주세요

![이미지](/assets/img/2024-05-27-AStep-by-StepGuidetoInstallingPysparkonWindows_9.png)

b. Python 쉘이나 Jupyter 노트북을 열고 다음 코드를 실행하여 설치를 확인해주세요:

```python
from pyspark.sql import SparkSession

spark = SparkSession.builder.master("local").appName("PySpark Installation Test").getOrCreate()
df = spark.createDataFrame([(1, "Hello"), (2, "World")], ["id", "message"])
df.show()
```

<div class="content-ad"></div>

이미지 :

<img src="/assets/img/2024-05-27-AStep-by-StepGuidetoInstallingPysparkonWindows_10.png" />

Windows에서 PySpark 설치에 대한 주요 고려 사항 :
a. Apache Spark와 PySpark 버전 간의 호환성 확인
b. 환경 변수 설정 후 명령 프롬프트 다시 시작
c. 공식 문서를 의존하고 PySpark 및 종속성에 대해 최신 정보 유지

## 결론:

<div class="content-ad"></div>

축하합니다! Windows 컴퓨터에 PySpark를 성공적으로 설치하셨군요. 이제 Python 프로그래밍 언어의 간편함을 활용하여 분산 데이터 처리 및 분석을 수행할 수 있는 PySpark의 강력함을 경험할 수 있게 되었습니다. Windows 환경에서 PySpark가 제공하는 다양한 기능을 즐겨보세요.