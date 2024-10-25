# DB Documentation

## Database Configuration
- **Database Type**: PostgreSQL
- **Port**: `5432`

## Tables Overview
1. **restaurants** - レストラン情報
2. **foods** - 料理情報
3. **food_alcohol** - アルコールの情報
4. **guests** - 客情報
5. **orders** - 注文情報
6. **order_items** - 注文の料理情報
7. **evaluations** - 評価情報


## Table: `restaurants`
- **説明**: レストランの基本情報を保存するテーブル

| カラム名   | データ型          | 説明                |
|------------|-------------------|---------------------|
| `r_id`     | INT (Primary Key)  | レストランの一意の識別子 |
| `r_name` | VARCHAR(255)       | レストランの名前   |
| `password` | VARCHAR(255)       | レストランのパスワード   |

## Table: `foods`
- **説明**: レストランが提供する食品の情報を保存するテーブル

| カラム名  | データ型          | 説明                        |
|-----------|-------------------|-----------------------------|
| `f_id`    | INT (Primary Key)  | 食品の一意の識別子           |
| `r_id`    | INT (Foreign Key)  | 提供するレストランのID        |
| `f_name`    | VARCHAR(255)       | 食品の名前                   |
| `price`   | INT     | 価格                         |
| `tag`     | VARCHAR(255)       | タグやカテゴリー名           |

## Table: `food_alcohol`
- **説明**: アルコール含有食品の詳細を保存するテーブル

| カラム名     | データ型          | 説明                        |
|--------------|-------------------|-----------------------------|
| `f_id`       | INT (Foreign Key)  | 対応する食品のID             |
| `degree`     | FLOAT              | アルコール度数               |
| `f_quantity` | INT                | アルコールの量               |

## Table: `customers`
- **説明**: 客の情報を保存するテーブル

| カラム名   | データ型          | 説明                        |
|------------|-------------------|-----------------------------|
| `c_id`     | INT (Primary Key)  | 客の一意の識別子         |
| `c_name` | VARCHAR(255)       | レストランの名前   |
| `email`    | VARCHAR(255)       | 客のメールアドレス       |
| `password` | VARCHAR(255)       | 客のパスワード           |

## Table: `orders`
- **説明**: 注文の情報を保存するテーブル

| カラム名  | データ型          | 説明                        |
|-----------|-------------------|-----------------------------|
| `o_id`    | INT (Primary Key)  | 注文の一意の識別子           |
| `c_id`    | INT (Foreign Key)  | 注文した客のID           |
| `r_id`    | INT (Foreign Key)  | 注文したレストランのID       |
| `o_datetime`  | DATETIME           | 注文日時                       |

## Table: `order_items`
- **説明**: 注文された食品のアイテム情報を保存するテーブル

| カラム名     | データ型          | 説明                        |
|--------------|-------------------|-----------------------------|
| `oi_id`      | INT (Primary Key)  | 注文食品の一意の識別子   |
| `o_id`       | INT (Foreign Key)  | 対応する注文のID             |
| `f_id`       | INT (Foreign Key)  | 注文された食品のID           |
| `o_quantity` | INT                | 注文された数量               |

## Table: `evaluations`
- **説明**: ゲストによる評価情報を保存するテーブル

| カラム名          | データ型          | 説明                        |
|-------------------|-------------------|-----------------------------|
| `e_id`            | INT (Primary Key)  | 評価の一意の識別子           |
| `c_id`            | INT (Foreign Key)  | 客の一意の識別子         |
| `e_day`           | DATETIME           | 評価された日                       |
| `evaluation`      | TEXT               | 評価内容                     |
| `total_quantity`  | INT                | 評価されたアルコールの総量  