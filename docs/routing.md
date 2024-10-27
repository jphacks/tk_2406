

# API Documentation

## Base URL
http://0.0.0.0:8000

### 'POST restaurant/tag'
- **説明**: タグの投稿
- **リクエスト**:
    - **ヘッダ**: JWTトークン
- **レスポンス**: 
    - **ステータスコード**: 200 OK
    - - **ボディ**:
        {
            "r_id", "t_id", "t_name"
        }

### 'GET restaurant/tag'
- **説明**: タグ一覧の取得
- **リクエスト**:
    - **ヘッダ**: JWTトークン
- **レスポンス**: 
    - **ステータスコード**: 200 OK
    - - **ボディ**:
        {
            ["t_id", "r_id", "t_name"]
        }

### 'GET restaurant/url'
- **説明**: urlのcheck項目の取得
- **リクエスト**:
    - **ヘッダ**: JWTトークン 
- **レスポンス**: 
    - **ステータスコード**: 200 OK
    - **ボディ**:
        {
              "check"
          }

### 'POST restaurant/url/{r_id}'
- **説明**: check項目の検証
- **リクエスト**:
    - **ヘッダ**:
    - **ボディ**:
        {
            "check"
        }
- **レスポンス**: 
    - **ステータスコード**: 200 OK


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

### 'GET restaurant/dish?t_id=??'
- **説明**: 料理のタグ毎の取得
- **リクエスト**:
    - **ヘッダ**: JWTトークン 
- **レスポンス**: 
    - **ステータスコード**: 200 OK
    - **ボディ**:
        [{
            "f_id", "r_id", "f_name", "price",  "tag", "is_alcohol", "degree", "f_quantity"
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
            "access_token", "token_type"
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
            "c_name", "pasword", "email"
        }
- **レスポンス**: 
    - **ステータスコード**: 201 Created
    - **ボディ**:
        {
            "access_token", "token_type"
        }

### 'POST customer/order/{r_id}'
- **説明**: 料理の注文
- **リクエスト**:
    - **ヘッダ**: JWTトークン 
    - **ボディ**:
        {
            [{
            "f_id", "quantity"
        },]}
- **レスポンス**: 
    - **ステータスコード**: 200 OK
 
### 'GET customer/order/{r_id}'
- **説明**: 料理の取得
- **リクエスト**:
    - **ボディ**:

- **レスポンス**: 
    - **ステータスコード**: 200 OK
    - **ボディ**: wip
 
### 'GET customer/order/{r_id}?tag={tag}'
- **説明**: 料理のタグによる取得
- **リクエスト**:
    - **ボディ**:
- **レスポンス**: 
    - **ステータスコード**: 200 OK
    - **ボディ**: wip

### 'POST customer/status/{r_id}'
- **説明**: 注文した場合の客の状態の変化
- **リクエスト**:
    - **ヘッダ**: JWTトークン 
    - **ボディ**:
        {
            "status"
      }
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
- **レスポンス**: 
    - **ステータスコード**: 200 OK
    - **ボディ**:
        {
            "is_checked",
              ["f_name", "quantity"],
        }

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
