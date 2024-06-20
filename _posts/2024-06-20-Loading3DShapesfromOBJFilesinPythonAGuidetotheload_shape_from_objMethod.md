---
title: "파이썬에서 OBJ 파일에서 3D 모양 불러오기 load_shape_from_obj 메소드 안내"
description: ""
coverImage: "/assets/img/2024-06-20-Loading3DShapesfromOBJFilesinPythonAGuidetotheload_shape_from_objMethod_0.png"
date: 2024-06-20 16:36
ogImage: 
  url: /assets/img/2024-06-20-Loading3DShapesfromOBJFilesinPythonAGuidetotheload_shape_from_objMethod_0.png
tag: Tech
originalTitle: "Loading 3D Shapes from OBJ Files in Python: A Guide to the load_shape_from_obj Method"
link: "https://medium.com/@harunijaz/the-code-above-is-a-python-function-that-reads-and-loads-data-from-a-obj-e6f6e5c3dfb9"
---


아래는 .obj 파일에서 데이터를 읽어 딕셔너리에 로드하는 Python 함수 코드입니다. .obj 파일은 3D 모델의 형태에 대한 정보를 저장하는 3D 모델 파일 형식으로, 3D 모델의 꼭지점과 면과 같은 정보를 저장합니다. 이 함수는 file_path라는 매개변수를 하나 가져오는데, 이는 .obj 파일의 경로입니다.

이 함수는 먼저 꼭지점과 면 데이터를 각각 저장하는 두 리스트인 vertices와 faces를 초기화합니다. 그런 다음 open 함수를 사용하여 file_path 매개변수로 지정된 파일을 엽니다. with 문은 블록 내의 코드 실행이 완료되면 파일이 자동으로 닫히도록 하는 데 사용됩니다.

함수는 파일의 각 줄을 읽고 if 문을 사용하여 줄이 'v'로 시작하는지 또는 'f'로 시작하는지를 확인합니다. 줄이 'v'로 시작하면 그것은 꼭지점 데이터로 처리되어 vertices 리스트에 추가됩니다. 줄이 'f'로 시작하면 그것은 면 데이터로 처리되어 faces 리스트에 추가됩니다.

파일의 모든 줄을 처리한 후 함수는 두 개의 키, "vertices"와 "faces"를 갖는 shape_data라는 딕셔너리를 생성하여 형태의 꼭지점과 면 데이터를 저장합니다. 그리고 이 딕셔너리가 함수에 의해 반환됩니다.

<div class="content-ad"></div>

기능에는 try-except 블록을 사용하여 오류 처리도 포함되어 있습니다. .obj 파일을 찾을 수 없는 경우, 함수는 FileNotFoundError를 잡고 파일을 찾을 수 없다는 메시지를 인쇄합니다. 다른 오류가 발생하면 해당 오류를 잡고 모양을로드하는 동안 오류가 발생했다는 메시지를 출력합니다.

Markdown 형식으로 표를 변경하였습니다.

```python
def load_shape_from_obj(self, file_path):
    try:
        vertices = []
        faces = []
        with open(file_path) as f:
            for line in f:
                if line[0] == "v":
                    vertex = list(map(float, line[2:].strip().split()))
                    vertices.append(vertex)
                elif line[0] == "f":
                    face = list(map(int, line[2:].strip().split()))
                    faces.append(face)

        shape_data = {"vertices": vertices, "faces": faces}

        return shape_data

    except FileNotFoundError:
        print(f"{file_path}를 찾을 수 없습니다.")
    except:
        print("모양을로드하는 동안 오류가 발생했습니다.")
```

다음은 코드의 단계별 설명입니다:

- 함수는 모양의 정점 및 면 데이터를 저장하는 두 개의 리스트, vertices와 faces를 정의하는 것으로 시작합니다.
- 함수는 파일 경로 매개변수로 지정된 파일을 열기 위해 open 함수를 사용합니다.
- 함수는 for 루프를 사용하여 파일의 각 줄을 읽고, 해당 줄이 "v" 또는 "f"로 시작하는지를 확인하기 위해 if 문을 사용합니다.
- 줄이 "v"로 시작하는 경우, 해당 줄은 정점 데이터로 처리되고 정점 데이터가 vertices 목록에 추가됩니다.
- 줄이 "f"로 시작하면 해당 줄은 면 데이터로 처리되고 면 데이터가 faces 목록에 추가됩니다.
- 파일의 모든 줄이 처리된 후, 함수는 "vertices"와 "faces"라는 두 개의 키를 가진 shape_data라는 딕셔너리를 만들어 모양의 정점 및 면 데이터를 저장합니다.
- 함수는 모양을로드하는 동안 발생할 수 있는 모든 오류를 처리하기 위해 try-except 블록을 사용합니다.
- .obj 파일을 찾을 수 없는 경우, 함수는 FileNotFoundError를 잡고 파일을 찾을 수 없다는 메시지를 출력합니다.
- 다른 오류가 발생하면 해당 오류를 잡고 모양을로드하는 동안 오류가 발생했다는 메시지를 출력합니다.
- 함수는 shape_data 딕셔너리를 반환합니다.