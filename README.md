# クイズアプリ（React / Redux Toolkit）

## 概要

Open Trivia Database (OpenTDB) を利用したクイズアプリです。  
ジャンル・タイプ・難易度・問題数を選択し、クイズに挑戦できます。

**設計面では「責務分離」と「テストしやすさ」を重視**しています。

### 実際の動作（デモ）

![クイズアプリのデモ](./assets/gif_latest.gif)

#### こだわりポイント

- **レスポンシブデザイン**: スマホでも快適に操作可能。
- **落ち着いた配色**: 彩度を抑えたマットなデザインで、長時間のプレイでも目が疲れにくい工夫をしました。

---

## 使用技術

### 使用技術

![React](https://img.shields.io/badge/react-%2320232d.svg?style=for-the-badge&logo=react&logoColor=%2361DAFB)
![Vite](https://img.shields.io/badge/vite-%23646CFF.svg?style=for-the-badge&logo=vite&logoColor=white)
![CSS3](https://img.shields.io/badge/css3-%231572B6.svg?style=for-the-badge&logo=css3&logoColor=white)
![JavaScript](https://img.shields.io/badge/javascript-%23323330.svg?style=for-the-badge&logo=javascript&logoColor=%23F7DF1E)
![GitHub](https://img.shields.io/badge/github-%23121011.svg?style=for-the-badge&logo=github&logoColor=white)


- React
- Redux Toolkit
- React Router
- Axios
- lodash / he
- JavaScript (ES Modules)

---

## アーキテクチャ概要

UI (Component)
↓
Custom Hook
↓
Redux (Slice / Selector)
↓
Model
↓
Fetcher (API)

- UI は描画専用
- ビジネスロジックは Model / Redux に集約
- API 仕様を UI に漏らさない設計

---

## 状態管理（Redux）

### Slice 構成

- **quizContent**：クイズ取得・保持
- **quizProgress**：進行状況・回答結果
- **quizSettings**：開始前の設定情報

### 設計方針

- Redux state は「事実データのみ」
- 派生データは selector に集約
- Slice 間連携は extraReducers のみに限定

---

## Model / Fetcher 設計

- Fetcher：API 通信のみ担当
- Model：データ整形・正誤判定・表示変換を担当
- UI 層は API レスポンス構造を直接知らない

---

## コンポーネント設計

- Component：描画専用
- Custom Hook：画面ロジック・副作用を集約
- Redux selector / dispatch は Hook 経由のみ

  <!-- widgets/
  ├─ QuizContent/useQuizContent.js
  └─ QuizResult/useQuizResult.js -->

---

## テスト方針

| レイヤー               | 方針                 |
| ---------------------- | -------------------- |
| Model                  | 単体テスト必須       |
| Redux Slice / Selector | 単体テスト必須       |
| Component              | 表示・イベント最小限 |
| main.jsx               | テスト対象外         |

---

## 画面構成

- Home：条件選択
- Quiz：出題・回答・結果表示

Home → Quiz → 結果 → Home

---

## 工夫した点 / 学び

- Model / Redux / UI の責務分離
- Selector による派生データ管理
- 「全部テストしない」設計判断
- Redux Toolkit を使った状態設計の整理

---
