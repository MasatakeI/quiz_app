# クイズアプリ（React / Redux Toolkit）

## 概要

Open Trivia Database（OpenTDB）を利用したクイズアプリです。ジャンル・タイプ・難易度・問題数を選択し、柔軟にクイズへ挑戦できます。

**設計の主眼は「責務分離」と「テストしやすさ」**。UI／状態管理／ドメインロジック／API 通信を明確に分離し、変更に強い構成を採用しています。

---

## デモ / リンク

- [🚀 実際のアプリはこちら](https://quiz-app-zeta-pearl.vercel.app/)
- [デモ](./assets/gif_latest.gif)

---

## 特長

- **レスポンシブ対応**：スマホ・タブレットでも快適な操作性
- **落ち着いた配色**：長時間プレイでも疲れにくいマットデザイン
- **拡張しやすい設計**：新しい条件・表示の追加が容易

---

## 使用技術

- React
- Redux Toolkit
- React Router
- Axios
- lodash / he
- JavaScript（ES Modules）

---

## アーキテクチャ

```
UI（Component）
  ↓
Custom Hook
  ↓
Redux（Slice / Selector）
  ↓
Model
  ↓
Fetcher（API）
```

### 設計方針

- UI は描画に専念
- ビジネスロジックは Model / Redux に集約
- API 仕様を UI に漏らさない

---

## 状態管理（Redux）

### Slice 構成

- **quizContent**：クイズの取得・保持
- **quizProgress**：進行状況・回答結果
- **quizSettings**：開始前の設定情報

### ルール

- Redux state は **事実データのみ** を保持
- 派生データは **selector** に集約
- Slice 間連携は **extraReducers のみ** に限定

---

## Model / Fetcher

- **Fetcher**：API 通信のみを担当
- **Model**：

  - データ整形
  - 正誤判定
  - 表示用データ変換

UI 層は API レスポンス構造を直接扱いません。

---

## コンポーネント設計

- **Component**：描画専用
- **Custom Hook**：画面ロジック・副作用を集約
- Redux の `selector / dispatch` は Hook 経由のみ

---

## テスト方針

| レイヤー               | 方針                 |
| ---------------------- | -------------------- |
| Model                  | 単体テスト必須       |
| Redux Slice / Selector | 単体テスト必須       |
| Component              | 表示・イベント最小限 |
| main.jsx               | テスト対象外         |

**すべてをテストしない**判断により、保守性と開発速度のバランスを重視しています。

---

## 画面構成 / フロー

- **Home**：条件選択
- **Quiz**：出題・回答・結果表示

```
Home → Quiz → 結果 → Home
```

---

## 学び・工夫

- Model / Redux / UI の責務分離
- Selector による派生データ管理
- テスト範囲の取捨選択
- Redux Toolkit を用いた状態設計の整理

---

## 今後の改善案（Optional）

- 問題履歴・スコア保存
- カテゴリ別ランキング
- テストカバレッジの可視化
