---
title: "개발자를 위한 Linux 명령어 치트시트 필수 DevOps 커맨드 모음"
description: ""
coverImage: "/assets/img/2024-06-22-CheatSheetLinuxCommandsforDevOps_0.png"
date: 2024-06-22 00:12
ogImage: 
  url: /assets/img/2024-06-22-CheatSheetLinuxCommandsforDevOps_0.png
tag: Tech
originalTitle: "CheatSheet: Linux Commands for DevOps"
link: "https://medium.com/@vinodhakumara2681997/cheatsheet-linux-commands-for-devops-80be32b88656"
---


<img src="/assets/img/2024-06-22-CheatSheetLinuxCommandsforDevOps_0.png" />

당연히요! DevOps 전문가로서, 리눅스 명령줄을 능숙하게 사용하는 것은 서버 관리, 자동화 및 문제 해결에 매우 중요합니다. 이 포괄적인 가이드에서는 명확한 설명과 실용적인 예제를 함께 제공하여 50가지 이상의 필수 리눅스 명령(치트시트)를 다룰 것입니다. 이를 통해 당신의 리눅스 기술을 쉽고 실용적인 방식으로 향상시키는 데 도움이 될 것입니다.

- id - 현재 사용자 또는 다른 사용자의 사용자 및 그룹 이름 및 숫자 ID (UID 또는 그룹 ID)를 찾는 데 사용됩니다.
예: id -u root

2. cd - 디렉토리 변경: 다른 디렉토리로 이동합니다.
예시: cd /home/user/documents

<div class="content-ad"></div>

3. **pwd** - Print Working Directory: 현재 디렉토리의 전체 경로를 표시합니다. 예시: pwd

4. **mkdir** - Make Directory: 새로운 디렉토리를 생성합니다. 예시: mkdir new_folder

5. **rm** - Remove: 파일이나 디렉토리를 삭제합니다. 예시: rm file.txt

6. **cp** - Copy: 파일이나 디렉토리를 복사합니다. 예시: cp file.txt /backup

<div class="content-ad"></div>

7. mv - 이동: 파일이나 디렉토리를 이동합니다.
예시: mv file.txt /new_location

8. touch - 빈 파일 생성: 새로운 빈 파일을 생성합니다.
예시: touch new_file.txt

9. cat - 연결하고 내용 표시: 파일의 내용을 확인합니다.
예시: cat file.txt

10. nano - 텍스트 편집기: 텍스트 파일을 편집합니다.
예시: nano file.txt

<div class="content-ad"></div>

11. grep - 텍스트 검색: 파일에서 텍스트 패턴을 검색합니다.
예시: grep "패턴" file.txt

12. find - 파일 및 디렉터리 검색: 파일 및 디렉터리를 찾습니다. 예시: find /검색할/경로 -name "파일명"

13. chmod - 파일 권한 변경: 파일 권한을 수정합니다.
예시: chmod 755 file.sh

14. chown - 소유권 변경: 파일 또는 디렉터리의 소유자 및 그룹을 변경합니다.
예시: chown 사용자:그룹 file.txt

<div class="content-ad"></div>

15. **ps** - Process Status: 현재 실행 중인 프로세스를 표시합니다.
예시: ps aux

16. **top** - 시스템 활동 모니터링: 시스템 프로세스를 실시간으로 모니터링합니다. 예시: top

17. **kill** - 프로세스 종료: 프로세스 ID를 사용하여 프로세스를 종료합니다. 또한 이름 또는 다른 속성에 기반하여 프로세스를 종료하는 pkill을 사용할 수도 있습니다.
예시: kill PID
pkill 프로세스_이름

18. **wget** - 파일 다운로드: 인터넷에서 파일을 다운로드합니다.
예시: wget https://example.com/file.zip

<div class="content-ad"></div>

19. less - 파일 내용을 한 화면씩 볼 수 있어 파일 내에서 쉽게 이동하고 검색할 수 있습니다. 예시: less test.log

20. tar - 아카이브 및 추출: 압축된 아카이브 파일을 생성하거나 추출합니다. 예시: tar -czvf archive.tar.gz folder

21. ssh - 보안 셸: 원격 서버에 안전하게 연결합니다. 예시: ssh user@remote_host

22. scp - 안전하게 파일 복사: SSH를 사용하여 로컬 및 원격 시스템 간에 파일을 복사합니다. 예시: scp file.txt user@remote_host:/path

<div class="content-ad"></div>

23. rsync - Remote Sync: 시스템 간 파일 및 디렉터리를 동기화합니다.
예시: rsync -avz local_folder/ user@remote_host:remote_folder/

24. df - 디스크 여유 공간: 디스크 공간 사용량을 표시합니다.
예시: df -h

25. du - 디스크 사용량: 파일 및 디렉터리의 크기를 표시합니다.
예시: du -sh /path/to/directory

26. ifconfig - 네트워크 구성: 네트워크 인터페이스를 표시하거나 구성합니다 (폐기됨, ip를 사용하세요).
예시: ifconfig

<div class="content-ad"></div>

27. **ip** - IP Configuration: IP 주소 및 네트워크 설정을 관리합니다. 예: `ip addr show`

28. **netstat** - 네트워크 통계: 네트워크 연결 및 통계를 표시합니다 (사용이 권장되지 않습니다, **ss**를 사용하세요). 예: `netstat -tuln`

29. **systemctl** - 시스템 제어: systemd를 사용하여 시스템 서비스를 관리합니다. 예: `systemctl start service_name`

30. **journalctl** - 시스템 로그: systemd의 저널을 사용하여 시스템 로그를 확인합니다. 예: `journalctl -u service_name`

<div class="content-ad"></div>

31. free - 이 명령은 이용 가능한 총 빈 공간의 양을 표시합니다.  
예시: free -m

32. at - 나중에 명령 실행: 지정된 시간에 명령을 실행합니다.  
예시: echo "command" | at 15:30

33. ping - 네트워크 연결 확인: 호스트로의 네트워크 연결을 확인합니다.  
예시: ping google.com

34. traceroute - 경로 추적: 호스트에 도달하기 위해 패킷이 이동하는 경로를 추적합니다.  
예시: traceroute google.com

<div class="content-ad"></div>

35. - 웹사이트 연결 확인: 웹사이트가 정상적으로 작동하는지 확인합니다.
예시: curl -Is https://example.com | head -n 1

36. dig - 도메인 정보 검색기: 도메인의 DNS 정보를 가져옵니다.
예시: dig example.com

37. hostname - 호스트 이름 표시 또는 설정: 시스템의 호스트 이름을 표시하거나 변경합니다.
예시: hostname

38. who - 사용자 표시: 현재 로그인한 사용자를 표시합니다.
예시: who

<div class="content-ad"></div>

39. useradd - 사용자 추가: 새 사용자 계정을 만듭니다.
예시: useradd 새사용자

40. usermod - 사용자 수정: 사용자 계정 속성을 수정합니다.
예시: usermod -aG 그룹이름 사용자이름

41. passwd - 비밀번호 변경: 사용자 비밀번호를 변경합니다.
예시: passwd 사용자이름

42. sudo - 슈퍼유저 권한 실행: 슈퍼유저로써 명령어를 실행합니다.
예시: sudo 명령어

<div class="content-ad"></div>

43. **lsof** - 파일 목록 표시: 열려 있는 파일과 해당 파일을 사용하는 프로세스 목록을 표시합니다. 예시: lsof -i :포트

44. **nc** - Netcat: 네트워크 연결을 통해 데이터를 읽고 쓰는 네트워크 유틸리티입니다. 예시: echo "Hello" | nc 호스트 포트

45. **scp** - 호스트 간 안전한 복사: 호스트 간에 파일을 안전하게 복사합니다. 예시: scp 파일.txt 사용자@원격_호스트:/경로

46. **sed** - 스트림 편집기: 정규 표현식을 사용한 텍스트 조작입니다. 예시: sed `s/old/new/g` 파일.txt

<div class="content-ad"></div>

47. awk - 텍스트 처리: 패턴 스캔 및 텍스트 처리.
예시: awk `'print $2'` file.txt

48. cut - 텍스트 열 추출: 텍스트에서 특정 열을 추출합니다. 예시: cut -d"," -f2 file.csv

49. sort - 줄 정렬: 텍스트 파일의 줄을 정렬합니다.
예시: sort file.txt

50. diff - 파일 비교: 두 파일을 비교하여 차이점을 표시합니다. 예시: diff file1.txt file2.txt

<div class="content-ad"></div>

51. ls - 파일 및 디렉토리 목록 조회: 디렉토리 내용을 나열합니다.
예시: ls -la

52. history - 이 명령은 이전에 실행된 명령을 확인하는 데 사용됩니다.
예시: history 10

53. cron - 작업 일정 예약: 예약된 작업을 관리합니다.
예시: crontab -e

54. ssh-keygen - 이 명령은 공개 및 개인 인증 키 쌍을 생성하는 데 사용됩니다. 이 인증 과정을 통해 사용자는 암호를 제공하지 않고 원격 서버에 연결할 수 있습니다.
예시: ssh-keygen

<div class="content-ad"></div>

55. nslookup - "Name server Lookup"의 약자입니다. DNS 호스트 이름을 IP 또는 IP를 호스트 이름으로 확인하는 도구입니다. 문제 해결 중에 매우 유용합니다.  
예시: nslookup google.com

56. tr - 문자 변환 또는 삭제에 사용됩니다.

이러한 명령어는 Linux 시스템과 작업하는 DevOps 전문가에게 필수적인 다양한 작업을 다룹니다. 각 명령어와 옵션에 대한 자세한 정보는 항상 man 페이지 (man 명령)를 참조하시기 바랍니다.  
예시: cat crazy.txt | tr "[a-z]" "[A-Z]"

57. tnc - "Test Network Connection"의 약어입니다. 주로 문제 해결 중에 사용되는 명령어입니다. 연결에 대한 진단 정보를 표시합니다.  
예시: tnc google.com --port 443

<div class="content-ad"></div>


58. w - 현재 사용자를 표시합니다.

59. su - 사용자 전환.
예시: su - root

60. ac(All Connections) — 모든 사용자 또는 지정된 사용자의 총 연결 시간을 나타냅니다.
예시: ac john

61. tail — 파일의 마지막 부분을 표시합니다. 실시간 로그 모니터링에 자주 사용됩니다.
예시: tail monitor.logs


<div class="content-ad"></div>

62. head — 파일의 첫 부분을 표시하여 파일 내용의 처음을 빠르게 확인하는 데 자주 사용됩니다.
예시: head content.txt

63. ip route — IP 라우팅 테이블을 표시하거나 조작하는 데 사용됩니다. IP 테이블 규칙을 명확하게 표시합니다.
예시: ip rout

DevOps 작업을 위한 Linux 명령어와 팁 자세히 보기

# 결론

<div class="content-ad"></div>

DevOps 전문가들은 주로 시스템을 관리하고 작업을 자동화하며 인프라의 원활한 작동을 보장하기 위해 필수적인 Linux 명령어 세트에 의존합니다. 이러한 명령어는 DevOps 작업에 기초를 두고 있으며 시스템 관리부터 배포 자동화에 이르기까지 다양한 문맥에서 사용됩니다.