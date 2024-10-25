

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
            "r_name",  "pasword"
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

### 'GET restaurant'
- **説明**: A
- **リクエスト**: なし
- **レスポンス**: 
    - **ステータスコード**: 
    - **内容**:
    - **ボディ**:

### 'GET restaurant'
- **説明**: A
- **リクエスト**: なし
- **レスポンス**: 
    - **ステータスコード**: 
    - **内容**:
    - **ボディ**: