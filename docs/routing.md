

# API Documentation

## Base URL
http://0.0.0.0:8000

### 'GET restaurant/dish'
- **説明**: 料理の全取得
- **リクエスト**:
    - **ヘッダ**: JWTトークン 
- **レスポンス**: 
    - **ステータスコード**: 200 OK
    - **ボディ**:
        [{
            "f_id", "r_id", "f_name", "price", "tag", "is_alcolol", "degree", "f_quantity"
        },]

### 'GET restaurant/dish'
- **説明**: 料理のタグ毎の取得
- **リクエスト**:
    - **ヘッダ**: JWTトークン 
- **レスポンス**: 
    - **ステータスコード**: 200 OK
    - **ボディ**:
        [{
            "f_id", "r_id", "f_name", "price", "is_alcohol", "degree", "f_quantity"
        },]

### 'POST restaurant/dish'
- **説明**: 料理の送信
- **リクエスト**:
    - **ヘッダ**: JWTトークン 
    - **ボディ**:
        {
            "f_name", "price", "is_alcohol", "degree", "f_quantity"
        }
- **レスポンス**: 
    - **ステータスコード**: 201 Created
    - **ボディ**:
        {
            "f_id", "r_id", "f_name", "price", "is_alcohol", "degree", "f_quantity"
        }

### 'PUT restaurant/dish/{id}'
- **説明**: 料理の更新
- **リクエスト**:
    - **ヘッダ**: JWTトークン 
    - **ボディ**:
        {
            "f_name", "price", "is_alcohol", "degree", "f_quantity"
        }
- **レスポンス**: 
    - **ステータスコード**: 200 OK
    - **ボディ**:
        {
            "f_id", "r_id", "f_name", "price", "is_alcohol", "degree", "f_quantity"
        }

### 'DELETE restaurant/dish/{id}'
- **説明**: 料理の削除
- **リクエスト**:
    - **ヘッダ**: JWTトークン 

- **レスポンス**: 
    - **ステータスコード**: 202 Successful Response
    - **ボディ**:
        {
            "f_id", "r_id", "f_name", "price", "is_alcohol", "degree", "f_quantity"
        }

### 'POST restaurant/login'
- **説明**: レストランのログイン
- **リクエスト**:
    - **ボディ**
        {
            "username",  "pasword"
        }
- **レスポンス**: 
    - **ステータスコード**: 200 OK
    - **ボディ**:
        {
            "access_token", "token_type"
        }
    
### 'POST restaurant/sighup'
- **説明**: レストランの新規登録
- **リクエスト**:
    - **ボディ**
        {
            "r_name", "pasword"
        }
- **レスポンス**: 
    - **ステータスコード**: 201 Created
    - **ボディ**:
        {
            "r_id", "access_token", "token_type"
        }

### 'POST customer/login'
- **説明**: 客のログイン
- **リクエスト**:
    - **ボディ**
        {
            "username", "password"
        }
- **レスポンス**: 
    - **ステータスコード**: 200 OK
    - **ボディ**:
        {
            "access_token", "token_type"
        }
    
### 'POST customer/sighup'
- **説明**: 客の新規登録
- **リクエスト**:
    - **ボディ**
        {
            "pasword", "email"
        }
- **レスポンス**: 
    - **ステータスコード**: 201 Created
    - **ボディ**:
        {
            "c_id", "access_token", "token_type"
        }

### 'POST customer/order/{r_id}'
- **説明**: 料理の注文
- **リクエスト**:
    - **ヘッダ**: JWTトークン 
    - **ボディ**:
        {
            "c_id", 
            [{
            "f_id", "quantity"
        },]}
- **レスポンス**: 
    - **ステータスコード**: 200 OK

### 'POST customer/status/{r_id}'
- **説明**: 注文した場合の客の状態の変化
- **リクエスト**:
    - **ヘッダ**: JWTトークン 
    - **ボディ**:
        {
            "status"}
- **レスポンス**: 
    - **ステータスコード**: 200 OK

### 'GET customer/status'
- **説明**: 現在の客の状態
- **リクエスト**:
    - **ヘッダ**: JWTトークン 
- **レスポンス**: 
    - **ステータスコード**: 200 OK
    - **ボディ**: 
        {
            "status"
        }

### 'GET customer/review'
- **説明**: 前回の店が評価済かの確認
- **リクエスト**:
    - **ヘッダ**: JWTトークン 
    - **ボディ**:
        {
            "is_checked"
        }
- **レスポンス**: 
    - **ステータスコード**: 200 OK

### 'POST customer/review'
- **説明**: 前回の店の評価
- **リクエスト**:
    - **ヘッダ**: JWTトークン 
    - **ボディ**:
        {
            "is_good"
        }
- **レスポンス**: 
    - **ステータスコード**: 200 OK
