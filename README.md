
# 推し活うちわジェネレーター

好きなテキストや図形を自由に配置して、オリジナルの応援うちわ画像を作成できるWebアプリです。

![OGP画像](./public/ogp-image.png)

## 主な機能

- テキストやフォント、色、サイズ、回転の自由なカスタマイズ
- ハート・星・音符・キラキラ・丸などのデコパーツ追加
- 背景の塗りつぶしモード（全塗り・うちわ型・角丸背景・塗りなし）
- 角丸背景は四隅が透過されるPNGでダウンロード可能
- 作成したうちわ画像をPNG形式でダウンロード
- 共有用URLの発行
- GitHubリポジトリへのリンクをフッターに表示

## 使い方

1. 画面左側でテキストやデコパーツ、背景などを自由に設定します。
2. プレビューを見ながら調整します。
3. 「ダウンロード」ボタンで透過PNG画像として保存できます。
4. 「共有用URLコピー」で現在のデザインを他の人と共有できます。

## 開発・ビルド

このプロジェクトは [Create React App](https://github.com/facebook/create-react-app) で作成されています。

### 開発サーバー起動

```
npm install
npm start
```

### 本番ビルド

```
npm run build
```

## GitHubリポジトリ

https://github.com/esuji5/uchiwa_generator

## デプロイ方法

このプロジェクトは `gh-pages` を使ってGitHub Pagesにデプロイできます。

```
npm run deploy
```

初回や依存パッケージが未インストールの場合は、事前に `npm install` を実行してください。

## 公開URL

アプリは以下のURLで公開されています：

[https://esuji5.github.io/uchiwa_generator](https://esuji5.github.io/uchiwa_generator)
