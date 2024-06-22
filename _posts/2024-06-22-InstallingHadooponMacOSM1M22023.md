---
title: "Apple 실리콘M1M2에서 MacOS에 하둡을 설치하는 방법 2023 최신 가이드"
description: ""
coverImage: "/assets/img/2024-06-22-InstallingHadooponMacOSM1M22023_0.png"
date: 2024-06-22 16:24
ogImage: 
  url: /assets/img/2024-06-22-InstallingHadooponMacOSM1M22023_0.png
tag: Tech
originalTitle: "Installing Hadoop on MacOS (M1 M2) : 2023"
link: "https://medium.com/@MinatoNamikaze02/installing-hadoop-on-macos-m1-m2-2023-d963abeab38e"
---


이와 유사한 기사가 몇 개 있지만, 저는 여러 중요한 정보가 누락된 기사를 시도해봐서 이를 작성하게 되었습니다. 설치 과정에서 겪은 모든 문제를 다루었습니다.

아래 단계를 주의 깊게 따라 주세요. 몇 가지 문제를 겪은 후에 제대로 설정하는 데 많은 시간이 걸렸습니다. 하지만 전반적인 과정은 간단합니다. 행운을 빕니다.

Homebrew로 Hadoop을 설치해보세요.


$ brew install hadoop


<div class="content-ad"></div>

해당 디렉토리로 이동해주세요. 작업 중인 버전에 따라 3.3.6을 원하는 버전으로 변경해주세요.


$ cd /opt/homebrew/Cellar/hadoop/3.3.6/libexec/etc/hadoop


원하는 코드 에디터에서 디렉토리를 열어주세요.


$ code .


<div class="content-ad"></div>

아래 파일들에 관심이 있습니다.

core-site.xml

```js
<property>
     <name>fs.defaultFS</name>
     <value>hdfs://localhost:9000</value>
     <final>true</final>
</property>
```

<div class="content-ad"></div>

hdfs-site.xml

```xml
<구성>
   <속성>
      <이름>dfs.replication</이름>
      <값>1</값>
   </속성>
</구성>
```

mapred-site.xml

```xml
<구성>
  <속성>
    <이름>yarn.app.mapreduce.am.env</이름>
    <값>HADOOP_MAPRED_HOME=/opt/homebrew/opt/hadoop</값>
  </속성>
  <속성>
    <이름>mapreduce.map.env</이름>
    <값>HADOOP_MAPRED_HOME=/opt/homebrew/opt/hadoop</값>
  </속성>
  <속성>
    <이름>mapreduce.reduce.env</이름>
    <값>HADOOP_MAPRED_HOME=/opt/homebrew/opt/hadoop</값>
  </속성>
</구성>
```

<div class="content-ad"></div>

yarn-site.xml

```xml
<configuration>
   <property>
      <name>yarn.nodemanager.aux-services</name>
      <value>mapreduce_shuffle</value> 
   </property>
</configuration>
```

hadoop-env.sh

```sh
export JAVA_HOME=/Library/Java/JavaVirtualMachines/adoptopenjdk-8.jdk/Contents/Home
```

<div class="content-ad"></div>

참고: Mac에 더 최신 버전의 Java가 설치되어 있을 수 있지만, 하둡은 Java 11 이상과 호환되지 않습니다. 이는 제게 큰 문제였으며 adoptopenjdk8을 수동으로 설치한 후에야 문제를 해결할 수 있었습니다.

설치하기 위한 brew 명령어는 다음과 같습니다.


$ brew install --cask adoptopenjdk8


다음으로 모든 것이 잘 작동하는지 확인해야 합니다. 터미널에 가서 다음을 입력하세요:

<div class="content-ad"></div>

```bash
$ start-all.sh

만약 이 명령어가 다음과 같은 오류를 발생시킨다면:

![InstallingHadooponMacOSM1M2](/assets/img/2024-06-22-InstallingHadooponMacOSM1M22023_1.png)

그렇다면, 다음 명령어를 실행해야 합니다:
```

<div class="content-ad"></div>

```shell
$ stop-all.sh

$ ssh-keygen -t rsa -P "" -f ~/.ssh/id_rsa (이미 컴퓨터에 SSH 키가 설정되어 있는 경우 이 단계를 건너뜁니다).

$ cat ~/.ssh/id_rsa.pub >> ~/.ssh/authorized_keys

$ hadoop namenode -format
```

<div class="content-ad"></div>

이제 안전하게 $ start-all.sh를 실행할 수 있어요.

이 몤령어를 사용하여 모든 프로세스가 올바르게 실행 중인지 확인할 수 있어요.

$ jps

![이미지](/assets/img/2024-06-22-InstallingHadooponMacOSM1M22023_2.png)

<div class="content-ad"></div>

지금 http://localhost:9870 으로 이동해주세요

![이미지](/assets/img/2024-06-22-InstallingHadooponMacOSM1M22023_3.png)

설치가 완료되었습니다. 참여해 주셔서 감사합니다.

건박.

<div class="content-ad"></div>

별도 팁(인터넷에서 해결책을 찾기 어려운 몇 가지 귀찮은 오류가 있습니다. 그래서 여기에 올려두었습니다.):

- 가끔은 하둡을 시작하고 로컬호스트:9870에서 웹 인터페이스를 열 때 "404 사이트에 연결할 수 없음" 오류가 발생할 수 있습니다. 이것은 매우 흔한 오류입니다. 하둡 프로세스를 정지하고 이 명령어를 실행하여 수정할 수 있습니다 - `$ hadoop namenode -format`. 이렇게 간단합니다.
- 다음과 같은 문제가 발생할 수 있습니다:

```![이미지](/assets/img/2024-06-22-InstallingHadooponMacOSM1M22023_4.png)```

이는 웹 인터페이스의 "브라우저 파일 시스템" 탭을 열 때 발생합니다.

<div class="content-ad"></div>

```
![](/assets/img/2024-06-22-InstallingHadooponMacOSM1M22023_5.png)

이 문제는 하둡에 참조된 호환되지 않는 자바 버전(`11`) 때문에 발생합니다. 자바 버전을 변경해도 작동하지 않는 경우 다음 수정 사항을 시도해보세요:

- $ hadoop namenode -format
- 컴퓨터를 다시 시작하세요 (유령 프로세스가 문제를 일으킬 수 있습니다).

편집: 여기까지 읽어주셨다면 클랩(clap)을 눌러주시고 팔로우 해주시면 감사하겠습니다. 단 몇 분이면 됩니다!
