---
title: "위성 열 영상을 1000m에서 10m로 다운스케일링하는 방법 Python"
description: ""
coverImage: "/assets/img/2024-06-22-DownscalingaSatelliteThermalImagefrom1000mto10mPython_0.png"
date: 2024-06-22 16:48
ogImage: 
  url: /assets/img/2024-06-22-DownscalingaSatelliteThermalImagefrom1000mto10mPython_0.png
tag: Tech
originalTitle: "Downscaling a Satellite Thermal Image from 1000m to 10m (Python)"
link: "https://medium.com/towards-data-science/downscaling-a-satellite-thermal-image-from-1000-m-to-10-m-python-3b2ed19ff103"
---


![image](/assets/img/2024-06-22-DownscalingaSatelliteThermalImagefrom1000mto10mPython_0.png)

# 목차

- 🌅 소개
- 💾 Sentinel-3 (1000 m) 및 Sentinel-2 이미지 다운로드
- ⚙️ Sentinel-3 이미지 처리
- 🌡️ 온도-NDVI 공간
- 📐 열화상 이미지 선명화 (1000 m에서 10 m)
- 🗺️ 선명화된 열화상 이미지 시각화
- 📄 결론
- 📚 참고 자료

## 🌅 소개

<div class="content-ad"></div>

위성에서 촬영한 열화상 이미지를 축소하는 연구는 열화상 이미지를 제공하는 위성들의 공간 및 시간 해상도 사이의 상충 관계 때문에 광범위하게 연구되었습니다. 예를 들어, Landsat-8의 재방문 주기는 16일이며, 원래 열 해상도는 100미터입니다. 반면에 Sentinel-3은 매일 열화상 이미지를 제공할 수 있지만, 공간 해상도는 1000미터입니다.

![이미지](/assets/img/2024-06-22-DownscalingaSatelliteThermalImagefrom1000mto10mPython_1.png)

열화상 이미지의 굵은 해상도를 해결하는 한 가지 방법은 NASA의 Landsat-9와 같은 열 센서가 장착된 추가 위성을 발사하는 것일 수 있습니다. Landsat-9의 경우, Landsat-8과 Landsat-9의 임시 해상도는 8일입니다 (하나의 위성보다는 16일), 맑은 하늘을 전제로 할 때.

그러나 이 접근 방식은 수십억 달러의 투자와 몇 년의 노력이 필요합니다. 대신, 연구자들은 통계적 방법에 집중하여, 공간 해상도는 높지만 임시 해상도는 낮은 위성의 시정/근적외선 (VNIR) 밴드를 열화상 이미지와 상관시킴으로써 열화상 이미지의 낮은 공간 해상도 (하지만 높은 임시 해상도)와 연관시키는데 초점을 맞추었습니다. 예를 들어, 연구들은 Sentinel-2의 VNIR 밴드로부터 계산된 정규화 된 차이 채취 지수 (NDVI)가 Sentinel-3의 열화상 이미지와 역 상관 관계가 있음을 보여주었습니다.

<div class="content-ad"></div>

답변을 요약하면 Sentinel-2의 NDVI와 Sentinel-3의 열화상 이미지 간의 상관 관계가 충분히 강하다면, 해당 방정식을 10m 해상도로 조정하여 10m 해상도의 열화상 이미지를 생성할 수 있습니다.

위성 대역과 센서 스펙트럼에 대해 자세히 알고 싶다면 다음을 참조하십시오:

이 게시물에서는 Sentinel-3로부터 낮은 공간 해상도 열화상 이미지와 Sentinel-2로부터 높은 공간 해상도 VNIR 이미지를 다운로드할 것입니다. 이 두 이미지는 각각의 위성에 의해 동시에 촬영되었습니다. 그런 다음, VNIR 대역을 사용하여 NDVI를 계산하고((NIR-Red)/(NIR+Red)), 이를 1000m로 업스케일하고 NDVI와 열대 대역 간의 상관 관계(둘 다 1000m 해상도)를 탐색할 것입니다. 마지막으로, 이 상관 관계를 사용하여 10m 해상도의 온도 지도를 생성할 것입니다.

## 💾 Sentinel-3(1000 m) 및 Sentinel-2 이미지(10 m) 다운로드

<div class="content-ad"></div>

이미 R 및 Python에서 Sentinel-2 이미지를 다운로드하는 방법에 대해 세 번의 게시물을 작성했습니다. 또한 Python에서 Sentinel-3 이미지를 다운로드하는 방법에 대한 게시물도 있습니다. 이곳에서는 해당 단계들을 반복하고 싶지 않아서 이 게시물을 참조하시기 바랍니다:

R에서 Sentinel-2 이미지 다운로드:

Python에서 Sentinel-2 이미지 다운로드:

Python에서 Sentinel-3 이미지 다운로드:

<div class="content-ad"></div>

만약 코드를 작성하지 않고 이미지를 다운로드하고 싶지 않다면, 다음 게시물을 확인해보세요:

열화상 이미지를 축소화하기 위한 통계적 방법을 적용하는 중요한 단계는 위성에서 동시에 촬영된 선명한 이미지를 찾는 것입니다. 이미지를 다운로드하기 전에 날짜, 구름 양, 그리고 귀하의 관심 지역(AOI)에 기반하여 메타데이터를 필터링할 수 있습니다. Sentinel 메타데이터(관심 지역, 구름 양 등)를 필터링하고 처리하는 방법을 더 알고 싶다면 다음을 참조해보세요:

이 게시물에서, 제 관심 지역(AOI)는 캘리포니아에 위치하며, 2023년 6월 19일에 Sentinel-2 및 Sentinel-3로 촬영된 선명한 이미지를 발견했습니다. 다른 위치나 날짜를 검색하고 싶다면 자유롭게 찾아보세요. 그러나 제가 다운로드한 이미지를 사용하길 원한다면, 다음 정보가 있습니다:

Sentinel-2: S2B_MSIL2A_20230620T183919_N0509_R070_T10SFG_20230620T224951

<div class="content-ad"></div>


satellite = “SENTINEL-2”

level = “S2MSI2A”

AOI = “POLYGON ((-121.0616 37.6391, -120.966 37.6391, -120.966 37.6987, -121.0616 37.6987, -121.0616 37.6391))”

start_date = “2023–06–19” ; end_date = “2023–06–21”


<div class="content-ad"></div>


satellite = “SENTINEL-3”

level= “LST”

AOI = “POLYGON ((-121.0616 37.6391, -120.966 37.6391, -120.966 37.6987, -121.0616 37.6987, -121.0616 37.6391))”


<div class="content-ad"></div>

start_date = “2023–06–19” ; end_date = “2023–06–21”

Sentinel-2에서 NIR 및 레드 밴드(NDVI를 계산하는 데 필요한 밴드)를 10m로 다운로드한 후 Sentinel-3에서 열화상 이미지를 다운로드하면 디렉토리에 이 세 파일이 있어야 합니다:

![Image](/assets/img/2024-06-22-DownscalingaSatelliteThermalImagefrom1000mto10mPython_2.png)

## ⚙️ Sentinel-3 이미지 처리

<div class="content-ad"></div>

Sentinel-3 이미지는 Sentinel-2보다 훨씬 넓은 장면을 커버합니다. 따라서 Sentinel-3 각 픽셀의 평균 NDVI 값을 필요로 하므로 Sentinel-3 이미지를 Sentinel-2 이미지의 범위에 따라 클리핑해야 합니다. 이를 위해 첫 번째 단계는 Sentinel-3 이미지를 Sentinel-2 이미지와 동일한 투영으로 재매핑하는 것입니다. 이를 수행하기 위해 다음과 같은 코드를 사용할 수 있습니다:

```js
import numpy as np
import rasterio
from rasterio.warp import calculate_default_transform, reproject, Resampling
from pyproj import Transformer

input_raster = 'Sentinel-3_L2_LST_reproj.tif'
output_raster = 'Sentinel-3_L2_LST_reproj_32610.tif'
dst_crs = 'EPSG:32610'

# 입력 래스터 파일 읽기
with rasterio.open(input_raster) as src:
    # 목적지 CRS에 대한 변환, 너비 및 높이 가져오기
    transform, width, height = calculate_default_transform(src.crs, dst_crs, src.width, src.height, *src.bounds)

    # 목적지 설정
    kwargs = src.meta.copy()
    kwargs.update({
        'crs': dst_crs,
        'transform': transform,
        'width': width,
        'height': height,
        'dtype': np.float32,
    })

    # 목적지 생성 및 재매핑된 데이터 작성
    with rasterio.open(output_raster, 'w', **kwargs) as dst:
        # 재매핑 수행
        for i in range(1, src.count + 1):
            reproject(
                source=src.read(1).astype(np.float32) * src.scales[0] + src.offsets[0],
                destination=rasterio.band(dst, i),
                src_transform=src.transform,
                src_crs=src.crs,
                dst_transform=transform,
                dst_crs=dst_crs,
                resampling=Resampling.bilinear)
```

이 스크립트에서는 이전 단계에서 다운로드한 Sentinel-3 래스터 이미지를 읽고, 지정된 CRS로 재매핑하기 위한 변환 매개변수를 계산하고, 재매핑된 데이터를 포함한 새로운 래스터 파일을 내보냅니다. 이러한 단계를 거치면 디렉토리에 다음 네 가지 파일이 있어야 합니다:

![image](/assets/img/2024-06-22-DownscalingaSatelliteThermalImagefrom1000mto10mPython_3.png)


<div class="content-ad"></div>

Sentinel-3 열화상 이미지가 Sentinel-2 좌표 시스템으로 변경되었으므로 이제 Sentinel-2 데이터 범위를 기반으로 열화상 이미지를 잘라내는 작업을 할 수 있습니다. 아래 코드를 사용하여 작업할 수 있어요:

```js
import rasterio
import numpy as np

# 두 래스터 파일 열기
with rasterio.open('T10SFG_20230620T183919_B08_10m.jp2') as small_raster:
    with rasterio.open('Sentinel-3_L2_LST_reproj_32610.tif') as big_raster:

        # 더 작은 래스터의 범위 가져오기
        min_x, min_y, max_x, max_y = small_raster.bounds

        # 더 큰 래스터에서 더 작은 래스터의 범위 내의 데이터 읽기
        window = rasterio.windows.from_bounds(min_x, min_y, max_x, max_y, big_raster.transform)
        data = big_raster.read(window=window)

        # 더 큰 래스터의 메타데이터 업데이트하여 더 작은 래스터의 범위와 일치시키기
        clipped_meta = big_raster.meta.copy()
        clipped_meta.update({
            'height': window.height,
            'width': window.width,
            'transform': rasterio.windows.transform(window, big_raster.transform),
            'dtype': data.dtype
        })

        # 잘라낸 데이터 쓰기
        with rasterio.open('Sentinel-3_L2_LST_reproj_32610_clipped.tif', 'w', **clipped_meta) as clipped_raster:
            clipped_raster.write(data)
```

이 스크립트에서는 두 래스터 파일(Sentinle-3 및 Sentinel-2 이미지)을 읽고, 더 작은 래스터의 범위(Sentinel-2)를 추출하고, 더 큰 래스터(Sentinle-3 열화상 이미지)에서 해당 데이터를 읽어와서 잘라낸 Sentinle-3의 메타데이터를 Sentinel-2 이미지와 일치하도록 업데이트한 후, 잘라낸 열화상 이미지를 새 TIFF 파일에 작성합니다.

<img src="/assets/img/2024-06-22-DownscalingaSatelliteThermalImagefrom1000mto10mPython_4.png" />

<div class="content-ad"></div>

NDVI 및 클리핑된 온도 맵을 옆으로 나란히 플롯해 봅시다:

```js
import numpy as np
import matplotlib.pyplot as plt
import rasterio
from rasterio.plot import show

# 파일 경로
red_path = '/content/T10SFG_20230620T183919_B04_10m.jp2'
nir_path = '/content/T10SFG_20230620T183919_B08_10m.jp2'

clipped_temperature_path = '/content/Sentinel-3_L2_LST_reproj_32610_clipped.tif'

# 래스터 데이터 읽기
with rasterio.open(red_path) as red_src:
  red = red_src.read(1)

with rasterio.open(nir_path) as nir_src:
  nir = nir_src.read(1)

with rasterio.open(clipped_temperature_path) as clipped_temp_ds:
  clipped_temperature = clipped_temp_ds.read(1)

# NDVI 계산
ndvi = (nir - red) / (nir + red)

# NDVI와 온도를 옆으로 플롯
fig, (ax1,ax2) = plt.subplots(ncols=2, figsize=(12, 6))

# NDVI 플롯
im1 = ax1.imshow(ndvi, cmap=ndvi_cmap, vmin=0, vmax=0.6)
ax1.set_title('NDVI', fontweight='bold', fontsize=14)
fig.colorbar(im1, ax=ax1, shrink=0.5)

# 클리핑된 온도 플롯
im2= ax2.imshow(clipped_temperature, cmap=ndvi_cmap.reversed(), vmin=300, vmax=315)
ax2.set_title('Clipped Temperature', fontweight='bold', fontsize=14)
fig.colorbar(im2, ax=ax2, shrink=0.5)
plt.show()
```

<img src="/assets/img/2024-06-22-DownscalingaSatelliteThermalImagefrom1000mto10mPython_5.png" />

위와 같이 Sentinel-3 열화상 이미지를 Sentinel-2 맵의 범위에 맞게 성공적으로 클립했습니다. 그러나 Sentinel-2 이미지도 잘린 상태이며, 온도 픽셀의 평균 NDVI 값을 얻기 위해 존속 통계를 실행하면 많은 NaN 값을 얻게 됩니다.

<div class="content-ad"></div>


![이미지](/assets/img/2024-06-22-DownscalingaSatelliteThermalImagefrom1000mto10mPython_6.png)

다음 단계에서 데이터프레임에서 NaN 값을 제외하여 수정할 것입니다.

## 🌡️ 온도-NDVI 공간

같은 투영 및 범위를 갖는 두 개의 명확한 이미지, 즉 센티넬-3에서의 열화상 이미지와 센티넬-2에서의 VNIR 이미지가 있을 때, 각 온도 픽셀의 평균 NDVI 값을 얻기 위해 존 채택 통계를 실행할 수 있습니다. 기본적으로 존 채택 통계 방식을 통해 10m에서 1000m로 NDVI 지도를 집계하여 온도-NDVI 공간에서 온도 값에 대한 NDVI 값을 플로팅할 수 있습니다.


<div class="content-ad"></div>

소개에서 언급했듯이 열값은 NDVI 값과는 역상관 관계에 있어야 합니다. 높은 NDVI는 식물의 비율이 더 높은 것을 나타내며 더 차가운 픽셀에 해당하고, 낮은 NDVI는 적은 식물이나 벌거벗은 토양에 해당하여 더 따뜻한 픽셀에 해당합니다. 우리의 AOI(관심 영역)에서 열과 NDVI 값 사이의 공간을 탐색하기 위해 존솔 통계를 수행해 보겠습니다:

```js
import rasterio
import rasterio.features
import rasterio.mask
import pandas as pd
import geopandas as gpd
import rasterstats

import rasterio
from rasterio.features import shapes
mask = None

# 입력 래스터 열기
with rasterio.open('Sentinel-3_L2_LST_reproj_32610_clipped.tif') as src:
    # 래스터 밴드 읽기
    image = src.read(1).astype(np.float32) * src.scales[0] + src.offsets[0]
    results = (
        {'properties': {'Temperature': v}, 'geometry': s}
        for i, (s, v)
        in enumerate(
            shapes(image, mask=mask, transform=src.transform)))
    geoms = list(results)
    gpd_polygonized_raster = gpd.GeoDataFrame.from_features(geoms)

# 래스터 열기
with rasterio.open('T10SFG_20230620T183919_B08_10m.jp2') as nir_src:
    with rasterio.open('T10SFG_20230620T183919_B04_10m.jp2') as red_src:

        # 데이터를 float32로 읽기
        nir = nir_src.read(1).astype(np.float32) * nir_src.scales[0] + nir_src.offsets[0]
        red = red_src.read(1).astype(np.float32) * red_src.scales[0] + red_src.offsets[0]

        # NDVI 계산
        ndvi = (nir - red) / (nir + red)

        # 각 다각형에 대한 존솔 통계 계산
        stats = rasterstats.zonal_stats(gpd_polygonized_raster.geometry, ndvi, affine=nir_src.transform, stats='mean')

        # NDVI의 평균값을 데이터프레임에 추가
        gpd_polygonized_raster['NDVI'] = [s['mean'] for s in stats]

# 다각형 레이어를 shapefile로 저장
gpd_polygonized_raster.to_file('output_polygons.shp')

# geodataframe로부터 pandas 데이터프레임 생성
stats_df = pd.DataFrame(gpd_polygonized_raster.drop(columns='geometry'))

# 데이터프레임 출력
print(stats_df)
```

이 스크립트에서는 열 래스터를 여각화하고, Sentinel-2 이미지에서 NDVI를 계산하고, 각 온도 픽셀에 대한 존솔 통계(평균 NDVI)를 계산합니다.

<div class="content-ad"></div>

위 표와 이전에 논의한 것처럼, Sentinel-3에서 열화 데이터를 가지고 있는 일부 픽셀에는 NaN 값이 있습니다. 이는 Sentinel-2 이미지의 자른 부분 때문입니다. Sentinel-2에서 NaN 값을 가진 행을 제외하겠습니다:

```python
# NaN 값이 있는 행 삭제
df_clean = stats_df.dropna(subset=['NDVI'])
df_clean
```

결과는 다음과 같습니다:

<img src="/assets/img/2024-06-22-DownscalingaSatelliteThermalImagefrom1000mto10mPython_8.png" />

<div class="content-ad"></div>

이 깔끔한 데이터프레임을 사용하여 온도-NDVI 공간을 그래프로 표현할 수 있어요:

```js
import pandas as pd
import numpy as np
import matplotlib.pyplot as plt
import seaborn as sns
from scipy.stats import linregress

# 산점도 생성
plt.figure(figsize=(8, 6))
sns.scatterplot(x='NDVI', y='Temperature', data=df_clean, palette='coolwarm')

# 그래프 제목 및 축 레이블 설정
plt.title('NDVI 대 온도 그래프', fontsize=16, fontweight='bold')
plt.xlabel('NDVI', fontsize=14)
plt.ylabel('Temperature', fontsize=14)

# 그래프 보여주기
plt.show()
```

결과는 다음과 같아요:

<img src="/assets/img/2024-06-22-DownscalingaSatelliteThermalImagefrom1000mto10mPython_9.png" />

<div class="content-ad"></div>

위 그림에서 NDVI와 온도 사이의 역상관 관계를 관찰할 수 있지만 몇 가지 점이 이상치로 나타납니다. 이는 식물 및 맨 소토 외의 다른 특징을 나타내는 이미지의 픽셀 때문일 수 있습니다. 이러한 픽셀을 제거하기 위해 NDVI 값이 0.1에서 0.6 사이이고 온도 값이 300 켈빈에서 330 켈빈 사이인 값만 유지한 다음, 그에 맞게 그림을 업데이트하겠습니다:

```js
import pandas as pd
import numpy as np
import matplotlib.pyplot as plt
import seaborn as sns
from scipy.stats import linregress

# 지정된 조건에 기반하여 데이터프레임 필터링
filtered_df = df_clean[(df_clean['NDVI'] >= 0.1) & (df_clean['NDVI'] <= 0.6) &
                 (df_clean['Temperature'] >= 300) & (df_clean['Temperature'] <= 330)]

# 온도 대 NDVI의 산점도 그리기
plt.figure(figsize=(8, 6))
sns.scatterplot(x='NDVI', y='Temperature', data=filtered_df, palette='coolwarm')

# 선형 회귀 모델 적합
slope, intercept = np.polyfit(filtered_df['NDVI'], filtered_df['Temperature'], 1)

# 적합된 선 그리기
x_line = np.linspace(min(filtered_df['NDVI']), max(filtered_df['NDVI']), 100)
y_line = slope * x_line + intercept
plt.plot(x_line, y_line, 'r', label='Fitted line')

# 방정식 문자열 작성
equation_str = f'y = {slope:.2f}x + {intercept:.2f}'

# 그림에 방정식 표시
plt.text(min(filtered_df['NDVI']), max(filtered_df['Temperature']), equation_str, fontsize=12, color='red')

# 그림 제목과 축 레이블 설정
plt.title('1-1. 온도 vs NDVI 그래프', fontsize=16, fontweight='bold')
plt.xlabel('온도', fontsize=14)
plt.ylabel('NDVI', fontsize=14)

# 그림 표시
plt.show()
```

결과는 다음과 같습니다:

<img src="/assets/img/2024-06-22-DownscalingaSatelliteThermalImagefrom1000mto10mPython_10.png" />

<div class="content-ad"></div>

이제는 역상관 관계가 더 잘 보이고 있으며, NDVI 값과 온도 간 관계를 설명하는 방정식도 나와 있습니다.

## 📐 열화상 이미지 선명하게하기 (1000m에서 10m)

이번 단계에서는 1000m 해상도에서 집계된 NDVI와 온도 간의 관계를 발견한 방정식이 10m 해상도에도 유효할 수 있다고 가정할 것입니다. 이 방정식을 원래의 NDVI 지도에 적용하여 10m 해상도에서 온도를 추정할 수 있습니다.

```js
import rasterio
import numpy as np
import matplotlib.pyplot as plt

# NIR 및 RED 파일 열기
with rasterio.open('T10SFG_20230620T183919_B08_10m.jp2') as src:
    nir = src.read(1)
    meta = src.meta

with rasterio.open('T10SFG_20230620T183919_B04_10m.jp2') as src:
    red = src.read(1)

# NDVI 계산
ndvi = (nir - red) / (nir + red)

# NDVI를 사용하여 온도 추정
temp = -21.85 * ndvi + 314.9

# NDVI를위한 컬러 램프 만들기
ndvi_cmap = plt.cm.RdYlGn

# NDVI 및 온도를 나란히 그리기
fig, (ax1, ax2) = plt.subplots(ncols=2, figsize=(12, 6))

# NDVI 그리기
im1 = ax1.imshow(ndvi, cmap=ndvi_cmap, vmin=0, vmax=0.6)
ax1.set_title('NDVI', fontweight='bold', fontsize=14)
fig.colorbar(im1, ax=ax1, shrink=0.7)

# 온도 그리기
im2 = ax2.imshow(temp, cmap=ndvi_cmap.reversed(), vmin=300, vmax=315)
ax2.set_title('Temperature', fontweight='bold', fontsize=14)
fig.colorbar(im2, ax=ax2, shrink=0.7)

plt.show()
```

<div class="content-ad"></div>

NIR 및 빨간색 대역을 읽어 NDVI를 계산하고 유도된 방정식에 기반하여 온도 값을 추정합니다. 다음으로, NDVI 및 온도에 대한 결과를 시각화하여 옆에 플롯을 표시합니다. 지도는 다음과 같습니다:

![맵](/assets/img/2024-06-22-DownscalingaSatelliteThermalImagefrom1000mto10mPython_11.png)

## 🗺️ 날카로워진 열 영상의 시각화

이 섹션에서는 시각화 측면에 더욱 집중할 것입니다. 우리는 이미지의 중앙 영역을 확대하고, 이미지를 중앙을 기준으로 자릅니다. 또한 온도 차트를 제시하기 위해 Sentinel-2의 NDVI 지도, 원본 Sentinel-3 열 영상(1000m 해상도) 및 분석 결과를 기반으로한 날카로운 Sentinel-3 영상(10m 해상도)을 비교 및 자세한 검토를 위해 옆에 함께 제시할 것입니다.

<div class="content-ad"></div>

```python
# NDVI 및 온도를 옆으로 나란히 플로팅합니다
fig, axs = plt.subplots(ncols=3, figsize=(15, 5))

# NDVI 플로팅
vmin, vmax = 0, 0.6
ndvi_subset = ndvi[int(0.75 * ndvi.shape[0]):, int(0.75 * ndvi.shape[1]):]
im1 = axs[0].imshow(ndvi_subset, cmap=ndvi_cmap, vmin=vmin, vmax=vmax)
axs[0].set_title('NDVI', fontweight='bold', fontsize=14)
axs[0].set_xticks([])
axs[0].set_yticks([])
fig.colorbar(im1, ax=axs[0], shrink=0.7)

# 온도 플로팅
with rasterio.open('Sentinel-3_L2_LST_reproj_32610_clipped.tif') as src:
    original_temp = src.read(1)

vmin, vmax = 300, 315
temp_subset = original_temp[int(0.75 * original_temp.shape[0]):, int(0.75 * original_temp.shape[1]):]
im3 = axs[1].imshow(temp_subset, cmap=ndvi_cmap.reversed(), vmin=vmin, vmax=vmax)
axs[1].set_title('Temperature', fontweight='bold', fontsize=14)
axs[1].set_xticks([])
axs[1].set_yticks([])
fig.colorbar(im3, ax=axs[1], shrink=0.7)

vmin, vmax = 300, 315
temp_subset = temp[int(0.75 * temp.shape[0]):, int(0.75 * temp.shape[1]):]
im2 = axs[2].imshow(temp_subset, cmap=ndvi_cmap.reversed(), vmin=vmin, vmax=vmax)
axs[2].set_title('Temperature', fontweight='bold', fontsize=14)
axs[2].set_xticks([])
axs[2].set_yticks([])
fig.colorbar(im2, ax=axs[2], shrink=0.7)

# 서브플롯 간 간격 조정
fig.subplots_adjust(wspace=0.2)

plt.show()
```

지도는:

<img src="/assets/img/2024-06-22-DownscalingaSatelliteThermalImagefrom1000mto10mPython_12.png" />

## 📄 결론


<div class="content-ad"></div>

Visible과 Near-Infrared (VNIR) 대역과 열 이미지 간의 직접적 상관 관계는 열 이미지의 해상도를 향상시키는 유용한 방법으로 입증되었습니다. 이 기술은 위성의 적절한 공간 해상도를 가진 위성이 없을 때 온도를 높은 공간 해상도로 추정하는 데 실용적으로 활용됩니다. 이 다운스케일링 방법은 고해상도 열지도가 필요할 때 유용한 도구로 작용하며 소규모 온도 변화에 대한 세부 정보를 제공합니다. 앞으로 더 많은 고급 열 센서를 갖춘 위성을 발사함에 따라 빈도가 더 높은 고해상도 열 이미지를 얻을 수 있게 될 것입니다. 그 전까지는 이 방법이 더 높은 해상도의 열 이미지를 구현하는 비용 효율적인 선택지로 남아 있습니다.

## 📚 참고 자료

Copernicus 센티넬 데이터 [2024] - 센티넬 데이터에 대한 정보

Copernicus 서비스 정보 [2024] - Copernicus 서비스 정보에 관한 정보

<div class="content-ad"></div>

아감, N., 쿠스타스, W. P., 앤더슨, M. C., 리, F., 닐, C. M. U. (2007). 열화상 이미지 공간 개선을 위한 식물 지수 기반 기술. Remote Sensing of Environment, 107(4), 545–558. ISSN 0034–4257.

가오, F., 쿠스타스, W. P., 앤더슨, M. C. (2012). 육지 위의 열화상 위성 이미지 개선을 위한 데이터 마이닝 접근 방식. Remote Sensing, 4, 3287–3319.

휴리나, H., 코헨, Y., 카르니엘리, A., 파노프, N., 쿠스타스, W. P., 아감, N. (2019). Sentinel-3 위성 이미지의 열화상 개선을 위한 TsHARP 유틸리티 평가. Remote Sensing, 11, 2304.

📱 저와 더 다양한 콘텐츠를 공유하려면 다른 플랫폼에서 연락하세요! LinkedIn, ResearchGate, Github 및 Twitter.

<div class="content-ad"></div>

여기 해당 링크를 통해 제공되는 관련 게시물들이 있습니다: