 # DB Documentation

## Database Configuration
- **Database Type**: PostgreSQL
- **Port**: `5432`

## Tables Overview
1. **restaurants** - レストラン情報
2. **foods** - 料理情報
3. **food_alcohol** - アルコールの情報
4. **tags** - タグの情報
5. **guests** - 客情報
6. **orders** - 注文情報
7. **order_items** - 注文の料理情報
8. **evaluations** - 評価情報


## Table: `restaurants`
- **説明**: レストランの基本情報を保存するテーブル

| カラム名   | データ型          | 制約               | 説明                |
|------------|-------------------|---------------------|---------------------|
| `r_id`     | INT (Primary Key)  | 非負整数 | レストランの一意の識別子 |
| `r_name` | VARCHAR(255)       | 2~255文字, 重複なし |  レストランの名前   |
| `password` | VARCHAR(255)       | 8~255文字 |  レストランのパスワード   |
| `salt` | VARCHAR(255)       |  |  パスワードに追加する文字列           |

## Table: `foods`
- **説明**: レストランが提供する食品の情報を保存するテーブル

| カラム名   | データ型          | 制約               | 説明                |
|------------|-------------------|---------------------|---------------------|
| `f_id`    | INT (Primary Key)  | 非負整数 |  食品の一意の識別子           |
| `r_id`    | INT (Foreign Key)  | 非負整数 |  提供するレストランのID        |
| `f_name`    | VARCHAR(255)       | 1~255文字, 重複なし |  食品の名前                   |
| `price`   | INT     | 非負整数 |  価格                         |
| `t_id`     | INT (Foreign Key)  | 非負整数 |  提供するレストランのID        |
| `is_alcohol`     | BOOLEAN  | |  アルコールかどうかの判別子       |

## Table: `food_alcohol`
- **説明**: アルコール含有食品の詳細を保存するテーブル

| カラム名   | データ型          | 制約               | 説明                |
|------------|-------------------|---------------------|---------------------|
| `f_id`       | INT (Primary Key, Foreign Key)  | 非負整数 |  対応する食品のID             |
| `degree`     | FLOAT              | 非負　|  アルコール度数               |
| `f_quantity` | INT                | 非負整数 |  アルコールの量               |

## Table: `tags`
- **説明**: 食品のタグを保存するテーブル

| カラム名   | データ型          | 制約               | 説明                |
|------------|-------------------|---------------------|---------------------|
| `t_id`       | INT (Primary Key, Foreign Key)  | 非負整数 |  対応するタグの一意の識別子             |
| `r_id`       | INT (Primary Key, Foreign Key)  | 非負整数 |  対応するレストランのID             |
| `t_name`     | VARCHAR(255)              | 1~255文字, 重複なし　|  タグの名前               |

## Table: `customers`
- **説明**: 客の情報を保存するテーブル

| カラム名   | データ型          | 制約               | 説明                |
|------------|-------------------|---------------------|---------------------|
| `c_id`     | INT (Primary Key)  | 非負整数 |  客の一意の識別子         |
| `c_name` | VARCHAR(255)       | 2~255文字, 重複なし |  レストランの名前   |
| `email`    | VARCHAR(255)       | 2~255文字 |  客のメールアドレス       |
| `password` | VARCHAR(255)       | 8~255文字 |  客のパスワード           |
| `salt` | VARCHAR(255)       |  |  パスワードに追加する文字列           |

## Table: `orders`
- **説明**: 注文の情報を保存するテーブル

| カラム名   | データ型          | 制約               | 説明                |
|------------|-------------------|---------------------|---------------------|
| `o_id`    | INT (Primary Key)  | 非負整数 |  注文の一意の識別子           |
| `c_id`    | INT (Foreign Key)  | 非負整数 |  注文した客のID           |
| `r_id`    | INT (Foreign Key)  | 非負整数 |  注文したレストランのID       |
| `o_datetime`  | DATETIME           |  |  注文日時                       |

## Table: `order_items`
- **説明**: 注文された食品のアイテム情報を保存するテーブル

| カラム名   | データ型          | 制約               | 説明                |
|------------|-------------------|---------------------|---------------------|
| `oi_id`      | INT (Primary Key)  | 非負整数 |  注文食品の一意の識別子   |
| `o_id`       | INT (Foreign Key)  | 非負整数 |  対応する注文のID             |
| `f_id`       | INT (Foreign Key)  | 非負整数 |  注文された食品のID           |
| `o_quantity` | INT                | 非負整数 |  注文された数量               |

## Table: `evaluations`
- **説明**: ゲストによる評価情報を保存するテーブル

| カラム名   | データ型          | 制約               | 説明                |
|------------|-------------------|---------------------|---------------------|
| `e_id`            | INT (Primary Key)  | 非負整数 |  評価の一意の識別子           |
| `c_id`            | INT (Foreign Key)  | 非負整数 |  客の一意の識別子         |
| `e_day`           | DATETIME           |  |  評価された日                       |
| `evaluation`      | BOOLEAN               |  |  評価内容                     |
| `total_quantity`  | INT                | 非負整数 |  評価されたアルコールの総量  |
