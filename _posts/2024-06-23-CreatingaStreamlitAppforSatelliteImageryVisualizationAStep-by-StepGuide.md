---
title: "위성 이미지 시각화를 위한 Streamlit 앱 만들기 단계별 가이드"
description: ""
coverImage: "/assets/img/2024-06-23-CreatingaStreamlitAppforSatelliteImageryVisualizationAStep-by-StepGuide_0.png"
date: 2024-06-23 15:59
ogImage: 
  url: /assets/img/2024-06-23-CreatingaStreamlitAppforSatelliteImageryVisualizationAStep-by-StepGuide_0.png
tag: Tech
originalTitle: "Creating a Streamlit App for Satellite Imagery Visualization: A Step-by-Step Guide"
link: "https://medium.com/towards-data-science/creating-a-streamlit-app-for-satellite-imagery-visualization-a-step-by-step-guide-8209593be994"
---



![image](https://miro.medium.com/v2/resize:fit:1400/1*DZ2rEeyOTUZ2bWq8FnvJ2w.gif)

# Table of Contents

- 🌟 Introduction
- 📌 Setup
- 💾 Design the pages
- 🌍 Functions for Map Visualization
- 📄 Conclusion
- 📚 References

## 🌟 Introduction


<div class="content-ad"></div>

공유는 우리 삶의 필수적인 부분이 되었습니다. 매 순간 X, Instagram, TikTok 등 다양한 플랫폼에 수많은 사진과 비디오가 업로드되며, 이는 다른 사람들과 순간을 공유하기 위한 것입니다. 코딩도 예외가 아니며, 우리가 코드를 다른 사람들과 공유할 수 있는 플랫폼 중 하나가 Streamlit입니다. 저는 이전에 다양한 방법을 사용하여 위성 이미지를 다운로드하고 시각화하는 것에 관한 여러 포스트를 게시해 왔습니다. 이번 포스트에서는 인증 설정이 필요 없는 Streamlit 앱을 개발하는 방법을 보여 드리겠습니다. 이 앱은 지구상의 어떤 지점과 기간에 캡처된 Sentinel-2의 사용 가능한 이미지를 나열하고, 사용자들이 해당 목록에서 이미지를 선택하고 해당 위치의 RGB 이미지와 씬 분류를 시각화할 수 있게 합니다. 이 포스트는 다른 사람들과 공유하기 위해 이 앱을 개발하는 단계별 가이드입니다. 더 알고 싶다면 계속 읽어보세요!

## 📌 설정

Streamlit을 사용하여 어떤 앱을 만들든, 첫 번째 단계는 임의의 이름을 가진 폴더를 만들고 그 안에 두 가지를 설정하는 것입니다. 첫 번째는 우리의 주요 코드를 포함할 빈 Python 스크립트입니다. 두 번째로 옵션인데, .streamlit이라는 하위 폴더를 만드는 것입니다. 이 하위 폴더는 웹 앱에 로그인하는 데 사용되는 사용자 이름과 비밀번호(자격 증명)을 저장하는 데 사용됩니다. 앱에 로그인 페이지를 원치 않는 경우 이 하위 폴더를 무시할 수 있습니다. 그렇지 않으면 메모장을 열어 아래 형식으로 사용자 이름과 비밀번호를 작성하고 secrets.toml이라는 이름으로 저장하세요.

```js
[passwords]
# 규칙을 따라 입력하세요: username = "password"
Mahyar = "abc123"
```  

<div class="content-ad"></div>

만약 설정 단계를 따르면 폴더에 이러한 파일이 있어야 합니다:

![Image 1](/assets/img/2024-06-23-CreatingaStreamlitAppforSatelliteImageryVisualizationAStep-by-StepGuide_0.png)

![Image 2](/assets/img/2024-06-23-CreatingaStreamlitAppforSatelliteImageryVisualizationAStep-by-StepGuide_1.png)

💾 페이지 디자인하기

<div class="content-ad"></div>

다음 단계는 사용자 경험을 향상시키기 위해 앱에 추가할 요소를 고려하는 것입니다. 사용자를 안내하는 텍스트 정보, 앱 실행에 필요한 사용자로부터 필요한 정보, 그리고 단계별로 앱을 실행하는 버튼을 포함합니다. 사용자가 어떤 위치와 기간의 위성 이미지를 볼 수 있도록 하는 것이 목표이므로, 다음 요소들을 페이지에 포함해야 합니다:

- 로그인 페이지
- 환영 메시지
- 페이지 제목
- 위성 이름에 관한 정보
- 위치 및 위치 주변의 버퍼
- 검색 기간
- 구름 덮인 정도

세 개의 버튼: 이용 가능한 목록을 가져오는 버튼, 목록을 다운로드하는 버튼, 선택한 이미지를 시각화하는 버튼.
모든 이 요소들은 다음과 같은 메인 스크립트의 라인을 사용하여 구현할 수 있습니다:

Part 1: 필수 라이브러리 및 사용자 인증

<div class="content-ad"></div>

```js
import streamlit as st
import pandas as pd
import numpy as np
import matplotlib.pyplot as plt
from st_files_connection import FilesConnection
from pystac_client import Client
from odc.stac import load
import hmac


def check_password():
    """Returns `True` if the user had a correct password."""

    def login_form():
        """Form with widgets to collect user information"""
        with st.form("Credentials"):
            st.text_input("Username", key="username")
            st.text_input("Password", type="password", key="password")
            st.form_submit_button("Log in", on_click=password_entered)

    def password_entered():
        """Checks whether a password entered by the user is correct."""
        if st.session_state["username"] in st.secrets[
            "passwords"
        ] and hmac.compare_digest(
            st.session_state["password"],
            st.secrets.passwords[st.session_state["username"]],
        ):
            st.session_state["password_correct"] = True
            del st.session_state["password"]  # Don't store the username or password.
            del st.session_state["username"]
        else:
            st.session_state["password_correct"] = False

    # Return True if the username + password is validated.
    if st.session_state.get("password_correct", False):
        return True

    # Show inputs for username + password.
    login_form()
    if "password_correct" in st.session_state:
        st.error("😕 User not known or password incorrect")
    return False


if not check_password():
    st.stop()
``` 

이 코드는 위성 이미지를 시각화하는 Streamlit 앱을 설정합니다. 웹 앱을 구축하는 데 필요한 필수 라이브러리를 가져옵니다. 데이터 조작 및 숫자 연산을 위해 pandas 및 numpy, 파일 연결을 위한 st_files_connection, 보안 비밀번호 비교를 위해 HMAC를 포함하여 필요한 라이브러리를 가져옵니다.

check_password() 함수는 사용자 인증을 처리합니다. 입력된 자격 증명을 HMAC를 사용하여 저장된 자격 증명과 비교하여 확인하는 login_form()을 생성합니다. 주요 check_password() 함수는 로그인 프로세스의 상태를 관리하고 로그인이 실패하는 경우 오류 메시지를 표시합니다. 사용자가 인증되지 않은 경우 앱을 중지합니다.

<div class="content-ad"></div>

```python
# Main Streamlit app starts here
st.write("스트림릿에 오신 것을 환영합니다! 위성 시각화 앱입니다...")

# Display Title
st.title("위성 지도 포털")
st.markdown("아래 데이터를 입력하세요.")

# Initialize session state for date_labels and user_date
if 'date_labels' not in st.session_state:
    st.session_state.date_labels = []

if 'data' not in st.session_state:
    st.session_state.data = None

if 'user_date' not in st.session_state:
    st.session_state.user_date = None

if 'user_date_index' not in st.session_state:
    st.session_state.user_date_index = 0

collections=["sentinel-2-l2a"]
columns = ['collection', 'start_date', 'end_date', 'min_cloud_cover', 'max_cloud_cover', 'longitude', 'latitude','buffer']

with st.form(key="test"):
    
    collection=st.selectbox("컬렉션*",options=collections,index=None)
    start_date = st.date_input(label="시작 날짜*")
    end_date = st.date_input(label="끝 날짜*")
    max_cloud_cover  = st.number_input(label="최대 구름 덮인 정도*",value=10)
    longitude=st.number_input(label="경도*", format="%.4f",value=-119.7513)
    latitude=st.number_input(label="위도*", format="%.4f",value=37.2502)
    buffer=st.number_input(label="버퍼 (0.01 = 1 km)*", format="%.2f",value=0.01)

    # Mark Mandatory fields
    st.markdown("**필수 입력란*")

    submit_button_run = st.form_submit_button(label="실행")
    submit_button_list = st.form_submit_button(label="가능한 이미지 목록 표시")
    submit_button_viz = st.form_submit_button(label="시각화")
```

<div class="content-ad"></div>

`C:\Users\Streamlit` streamlit run streamlit_app_authen_sentinel_2.py 실행하면 브라우저에서 로그인 및 주요 페이지를 볼 수 있습니다:

부분 1: 로그인 페이지

![이미지](/assets/img/2024-06-23-CreatingaStreamlitAppforSatelliteImageryVisualizationAStep-by-StepGuide_2.png)

<div class="content-ad"></div>

## 제2부: 메인 페이지

![이미지](/assets/img/2024-06-23-CreatingaStreamlitAppforSatelliteImageryVisualizationAStep-by-StepGuide_3.png)

## 🌍 지도 시각화 기능

지금까지 로그인 페이지를 만들고 메인 페이지를 디자인했습니다. 현재 메인 페이지에서는 사용자 입력을 수집하고 아직 기능이 구현되지 않은 세 개의 버튼이 있습니다. 이 섹션에서는 이 버튼을 작동하도록 코드를 완성할 것입니다. 첫 번째 버튼은 "실행"이며, 이 버튼은 사용자 입력 매개변수를 사용하여 클라우드 데이터베이스를 검색하고 DataFrame에 있는 사용 가능한 이미지를 표시하는 기능을 합니다. 이 버튼에 기능을 추가하기 위해 두 가지 추가 부분(Part 3 및 Part 4)을 포함했습니다.

<div class="content-ad"></div>

Part 3: 검색 기능 정의

```python
def search_satellite_images(collection="sentinel-2-l2a",
                            bbox=[-120.15,38.93,-119.88,39.25],
                            date="2023-06-01/2023-06-30",
                            cloud_cover=(0, 10)):
    
    # 검색 클라이언트 정의
    client=Client.open("https://earth-search.aws.element84.com/v1")
    search = client.search(collections=[collection],
                            bbox=bbox,
                            datetime=date,
                            query=[f"eo:cloud_cover<{cloud_cover[1]}", f"eo:cloud_cover>{cloud_cover[0]}"])

    # 일치하는 항목 수 출력
    print(f"찾은 이미지 수: {search.matched()}")

    data = load(search.items(), bbox=bbox, groupby="solar_day", chunks={})

    print(f"데이터에 있는 날짜 수: {len(data.time)}")

    return data

def get_bbox_with_buffer(latitude=37.2502, longitude=-119.7513, buffer=0.01):
    
    min_lat = latitude - buffer
    max_lat = latitude + buffer
    min_lon = longitude - buffer
    max_lon = longitude + buffer
    
    bbox = [min_lon, min_lat, max_lon, max_lat]
    return bbox
```

Part 3은 사용자가 지정한 매개변수에 따라 STAC API에 연결하여 위성 이미지를 검색하는 search_satellite_images 함수를 정의하는 것으로 시작합니다. 해당 함수는 일치하는 데이터를 반환합니다. 다른 함수 get_bbox_with_buffer는 지정된 위도, 경도 주변에 특정 버퍼를 설정하여 경계 상자를 계산합니다.

Part 4: 실행 버튼

<div class="content-ad"></div>


# 이러한 열이 있는 빈 DataFrame을 만듭니다
df = pd.DataFrame(columns=columns)

if "mdf" not in st.session_state:
    st.session_state.mdf = pd.DataFrame(columns=df.columns)


# 새 데이터
with st.form(key="test"):
    
    collection=st.selectbox("collection*",options=collections,index=None)
    start_date = st.date_input(label="start_date*")
    end_date = st.date_input(label="end_date*")
    max_cloud_cover  = st.number_input(label="max_cloud_cover*",value=10)
    longitude=st.number_input(label="longitude*", format="%.4f",value=-119.7513)
    latitude=st.number_input(label="latitude*", format="%.4f",value=37.2502)
    buffer=st.number_input(label="buffer (0.01 = 1 km)*", format="%.2f",value=0.01)

    # 필수 사항 표시
    st.markdown("**필수*")

    submit_button_run = st.form_submit_button(label="Run")
    submit_button_list = st.form_submit_button(label="List Available Images")
    submit_button_viz = st.form_submit_button(label="Visualize")

    if submit_button_run:
        new_df=pd.DataFrame(
            [
                {   
                    "collection": collection,
                    "start_date":start_date.strftime("%Y-%m-%d"),
                    "end_date": end_date.strftime("%Y-%m-%d"),
                    "max_cloud_cover":max_cloud_cover,
                    "longitude": longitude,
                    "latitude": latitude,
                    "buffer": buffer,

                }

            ]
        )
        
        st.session_state.mdf = pd.concat([st.session_state.mdf, new_df], axis=0)
        st.dataframe(st.session_state.mdf)
        st.success("Your request successfully submitted!")

        data = search_satellite_images(collection=collection,
                                       date=f"{start_date}/{end_date}",
                                       cloud_cover=(0, max_cloud_cover),
                                       bbox=get_bbox_with_buffer(latitude=latitude, longitude=longitude, buffer=buffer))
        st.session_state.data = data

        date_labels = []
        # 시간 단계 수 결정
        numb_days = len(data.time)
        # 각 시간 단계 반복
        for t in range(numb_days):
            scl_image = data[["scl"]].isel(time=t).to_array()
            dt = pd.to_datetime(scl_image.time.values)
            year = dt.year
            month = dt.month
            day = dt.day
            date_string = f"{year}-{month:02d}-{day:02d}"
            date_labels.append(date_string)
        
        st.session_state.date_labels= date_labels


두 번째 부분에서 주 어플리케이션 로직은 빈 DataFrame을 초기화하고 세션 상태에 DataFrame이 있는지 확인합니다.

“Run” 버튼을 클릭하면 사용자 입력 값으로 새 DataFrame 항목을 생성하고 세션 상태를 업데이트하며 업데이트된 DataFrame을 표시합니다. 그런 다음 search_satellite_images를 호출하여 데이터를 가져 오고 이 데이터를 처리하여 날짜 레이블을 추출하고 형식을 맞추어 세션 상태에 저장합니다. 이러한 설정을 통해 사용자는 매개 변수를 입력하고 위성 이미지를 검색하며 결과를 시각화 할 수 있습니다.

이 시점에서 Streamlit 앱을 실행하면 지정된 위치 및 날짜에 대해 다음과 같은 테이블이 표시됩니다:


<div class="content-ad"></div>

아래는 "Run" 버튼을 활성화한 후 "List Available Images" 버튼을 활성화하는 단계입니다. 이 버튼을 클릭하면 사용자가 지정한 위치, 날짜 및 구름 양에 따라 Sentinel-2에 의해 촬영된 사용 가능한 이미지가 표시됩니다.

파트 5: List Available Images 버튼

```js
    if submit_button_list:
        user_date=st.selectbox("Available Images*",options=st.session_state.date_labels,index=None)
        if user_date:
            st.session_state.user_date = user_date
            st.session_state.user_date_index = user_date.index()
```

<div class="content-ad"></div>

"List Available Images" 버튼을 클릭하면 이 코드가 위성 이미지의 사용 가능한 날짜를 나열하는 드롭다운 메뉴를 생성합니다. 사용자가 날짜를 선택하면 해당 날짜와 인덱스를 저장하는 세션 상태를 업데이트하여 사용자의 선택에 기반한 추가 작업을 가능하게 합니다.

이제 앱을 다시 실행하고 "List Available Images" 버튼을 클릭하면 사용 가능한 이미지를 나열하는 드롭다운 메뉴가 표시됩니다. 이 중 하나를 선택해주세요:

![이미지](/assets/img/2024-06-23-CreatingaStreamlitAppforSatelliteImageryVisualizationAStep-by-StepGuide_5.png)

사용 가능한 이미지 중 하나를 선택한 후 마지막 단계는 "Visualize" 버튼을 완료하고 활성화하는 것입니다. "Visualize" 버튼의 목표는 사용자가 지정한 위치와 버퍼에 대해 선택한 위성 이미지를 표시하는 것입니다. 시각화에 관한 이 메시지에서 설명된 코드를 사용했지만 오른쪽에 장면 분류의 파이 차트를 표시하는 추가 기능을 추가했습니다. 이를 위해 각 장면 클래스의 개수를 반환하는 함수를 정의하고 시각화 버튼에서 사용해야 합니다:

<div class="content-ad"></div>

파트 6: Count 함수

```js
def count_classified_pixels(data,num):
    
    scl_image = data[["scl"]].isel(time=num).to_array()
 
    # 분류된 픽셀 수 세기 
    count_saturated = np.count_nonzero(scl_image == 1)        # 포화 또는 결함
    count_dark = np.count_nonzero(scl_image == 2)             # 어두운 지역 픽셀
    count_cloud_shadow = np.count_nonzero(scl_image == 3)     # 구름 그림자
    count_vegetation = np.count_nonzero(scl_image == 4)       # 식물
    count_soil = np.count_nonzero(scl_image == 5)             # 노출된 토양
    count_water = np.count_nonzero(scl_image == 6)            # 물
    count_clouds_low= np.count_nonzero(scl_image == 7)        # 낮은 확률 구름 / 분류되지 않은 구름
    count_clouds_med = np.count_nonzero(scl_image == 8)       # 중간 확률 구름
    count_clouds_high = np.count_nonzero(scl_image == 9)      # 높은 확률 구름
    count_clouds_cirrus = np.count_nonzero(scl_image == 10)   # 시르러스 구름
    count_clouds_snow = np.count_nonzero(scl_image == 11)     # 눈

    counts = {
    '어둠/밝은 영역': count_cloud_shadow +count_dark+count_clouds_low+count_clouds_med+count_clouds_high+count_clouds_cirrus +count_clouds_snow +count_saturated,
    '식물': count_vegetation,
    '노출된 토양': count_soil,
    '물': count_water,
    }

    return counts
```

파트 7: 시각화 버튼

```js
if submit_button_viz:
        
        date_string_title= f"타겟 지역의 Sentinel-2 이미지"
        fig, axs = plt.subplots(nrows=1, ncols=2, figsize=(16, 8))  

        rgb = st.session_state.data[["red", "green", "blue"]].isel(time=st.session_state.user_date_index).to_array()
        rgb.plot.imshow(robust=True, ax=axs[0])
        axs[0].axis('off')  # 축 눈금과 레이블 숨기기
        axs[0].set_title(date_string_title)

        # 데이터 준비 
        counts = count_classified_pixels(st.session_state.data, st.session_state.user_date_index )
        labels = list(counts.keys())
        values = list(counts.values())
        colors = ['DarkGrey', 'chartreuse', 'DarkOrange', 'cyan']
        explode = (0.3, 0.1, 0.1, 0.1)  # 첫 번째 조각 튀어나오기

        # 파이 차트 그리기 
        axs[1].pie(values, labels=labels, colors=colors, autopct='%1.0f%%', startangle=140, explode=explode)
        axs[1].legend(labels, loc='best', bbox_to_anchor=(1, 0.5))
        axs[1].axis('equal')  # 파이 차트를 원으로 만들기
        axs[1].set_title('클래스 분포')

        # 그림을 Streamlit에 표시
        st.pyplot(fig)
```

<div class="content-ad"></div>

"Visualize" 버튼을 클릭하면 코드가 관심 영역(AOI) 위의 Sentinel-2 이미지를 나타내는 제목이 있는 플롯을 설정합니다. 두 개의 서브플롯이 나란히 만들어집니다. RGB 이미지가 선택된 날짜의 세션 상태 데이터에서 추출되어 시각적 명확성을 높이기 위해 첫 번째 서브플롯에 축 레이블 없이 표시됩니다. 모든 버튼이 활성화된 상태에서 앱을 한 번 더 실행해 봅시다:

![이미지](/assets/img/2024-06-23-CreatingaStreamlitAppforSatelliteImageryVisualizationAStep-by-StepGuide_6.png)

![이미지](/assets/img/2024-06-23-CreatingaStreamlitAppforSatelliteImageryVisualizationAStep-by-StepGuide_7.png)

구름 양, 날짜 및 좌표의 기본값을 변경하여 시각화에 어떻게 영향을 주는지 확인해 보세요.

<div class="content-ad"></div>

## 📄 결론

이 가이드에서는 지구상의 어떤 지점에서든 언제든 위성 이미지를 시각화하기 위한 Streamlit 애플리케이션을 만드는 과정을 안내했습니다. 우리는 앱을 안전하게 보호하기 위해 로그인 페이지를 설정한 후 사용자 입력을 수집하는 주 페이지를 디자인하는 것으로 시작했습니다. "실행" 버튼 기능을 구현하여 사용 가능한 위성 이미지를 검색하고, "사용 가능한 이미지 목록" 버튼을 클릭하면 사용 가능한 이미지의 드롭다운 메뉴가 표시되고, "시각화" 버튼을 클릭하여 선택한 위성 이미지를 표시할 수 있도록 했습니다. 이 인터랙티브한 방식은 사용자들이 코드를 커뮤니티와 쉽게 공유하고 위성 이미지를 효과적으로 탐색하고 다양한 시나리오를 탐구하여 인사이트를 얻을 수 있도록 합니다.

## 📚 참고 자료

https://github.com/stac-utils/pystac-client/blob/main/docs/quickstart.rst

<div class="content-ad"></div>

https://www.element84.com/earth-search/examples/

Copernicus Sentinel 데이터 [2024]에 대한 센티넬 데이터

Copernicus 서비스 정보 [2024]에 대한 코퍼니커스 서비스 정보.

📱더 많은 흥미로운 콘텐츠를 보기 위해 다른 플랫폼에서 저와 연결하세요! LinkedIn, ResearchGate, Github 및 Twitter.

<div class="content-ad"></div>

이 링크를 통해 확인할 수 있는 관련 게시물이 있습니다: