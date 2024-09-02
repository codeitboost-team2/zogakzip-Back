# 🎆조각집
자신의 추억을 게시글로 올려 소중한 사람들과 공유할 수 있는 추억 기록 및 공유 서비스

*Codeit Boost DSWU 1st - Team 2, Backend*

## 🚀기술 스택
- **Node.js**
- **Express**
- **Prisma**



## 📁프로젝트 폴더 구조
```
/zogakzip
C:.
├─controllers        #비즈니스 로직을 포함한 컨트롤러
├─models             #데이터 구조와 비즈니스 로직 정의
├─node_modules       #node 라이브러리리
├─prisma             #prisma 관련 설정
│  ├─migrations      #데이터베이스 마이그레이션
│  └─schema.prisma   #데이터베이스 스키마 정의
├─routes             #API 엔드포인트에 대한 라우터 정의
└─app.js             #애플리케이션 진입점
```

## 🏷️컨벤션
### 들여쓰기
space와 tab을 섞어서 사용하지 않는다. tab을 기본으로 사용한다.

### 명명 규칙
1. 클래스, 메소드명은 파스칼 표기법을 따른다.
2. 변수, 파라미터 등은 카멜 표기법을 따른다.
3. 메소드 이름은 동사+전치사로 시작한다.
4. Boolean 타입의 변수명을 작성할 때는 is 라는 접두사를 사용한다.
5. 상수는 영문 대문자 스네이크 표기법을 사용한다.
6. URL, HTML 같은 범용적인 대문자 약어는 그대로 사용한다.


### 함수
1. 함수 생성자를 사용하여 선언하지 않는다.
```
// Bad - 함수 생성자 사용
const doSomething = new Function('param1', 'param2', 'return param1 + param2;');

// Good - 함수 선언식 사용
function doSomething(param1, param2) {
  return param1 + param2;
}

// Good - 함수 표현식 사용
const doSomething = function(param1, param2) {
  return param1 + param2;
};
```
2. 함수는 사용 전에 선언해야 하며, 함수 선언문은 변수 선언문 다음에 오도록 한다.
```
// Bad - 선언 이전에 사용
const sumedValue = sum(1, 2);
const sum = function(param1, param2) {
  return param1 + param2;
};

// Bad - 선언 이전에 사용
const sumedValue = sum(1, 2);
function sum(param1, param2) {
  return param1 + param2;
};

// Good
const sum = function(param1, param2) {
  return param1 + param2;
};
const sumedValue = sum(1, 2);
```
### 모듈
항상 import와 export를 사용한다.

### 공백
1. 키워드, 연산자와 다른 코드 사이에 공백이 있어야 한다.
```
// Bad
var value;
if(typeof str==='string') {
  value=(a+b);
}

// Good
var value;
if (typeof str === 'string') {
  value = (a + b);
}
```
2. 시작 괄호 바로 다음과 끝 괄호 바로 이전에 공백이 있으면 안 된다.
```
// Bad - 괄호 안에 공백
if ( typeof str === 'string' )

// Bad - 괄호 안 공백
var arr = [ 1, 2, 3, 4 ];

// Good
if (typeof str === 'string') {
  ...
}

// Good
var arr = [1, 2, 3, 4];
```
3. 콤마(,) 다음에 값이 올 경우 공백이 있어야 한다.
```
// Bad - 콤마 뒤 공백
var arr = [1,2,3,4];

// Good
var arr = [1, 2, 3, 4];
```


## 🖼️아키텍처 다이어그램
![아키텍처 다이어그램](https://github.com/user-attachments/assets/d6e0368d-ccdf-4487-bb2e-b45e600a4b40)

## 👩‍💻역할 분담
+ 김도원 : 게시글, 댓글 BE
+ 정유진 : 그룹, 배지 BE
