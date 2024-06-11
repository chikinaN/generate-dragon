# generate-dragon

Discordのbotです。
個人使用です

## botで使ったライブラリ

| ライブラリ名 | ライブラリの使用目的 |
| :-: | :-: |
| discord.js | bot関連のwrapper |
| canvas | node環境下でcanvasを使いたい |

## env

```.env
DISCORD_BOT_TOKEN=...
LOG_CHANNEL_ID=...
DISCORD_BOT_NAME="発表ドラゴン"

DRAGON_BODY_IMAGE_PATH="./public/img/dragon.png"
DRAGON_BALLOON_IMAGE_PATH="./public/img/balloon.png"
```

### 各環境変数の説明

#### DISCORD_BOT_TOKEN

botのトークンを入れるところです。
[qiitaの記事](https://qiita.com/1ntegrale9/items/cb285053f2fa5d0cccdf)等を確認してください。

#### LOG_CHANNEL_ID

起動した等のログを残すように作っている部分ですチャンネルIDをここに貼ってください。

#### DISCORD_BOT_NAME

BOTを作る時にできたDisplay Nameを入れてください。
(たまに自分がTOKENをごっちゃにして別のBOTと混ざるのを防ぐため)

#### DRAGON_BODY_IMAGE_PATH

発表ドラゴンのドラゴン部分です。
ジェネレーターがダメになってしまったので心配になり、
各自がダウンロードしてください。

#### DRAGON_BALLOON_IMAGE_PATH

発表ドラゴンの吹き出し部分です。
ジェネレーターがダメになってしまったので心配になり、
各自がダウンロードしてください。
(「吹き出し=BALLOONは違くね」って意見はおやめください、一単語が思いつかなかったんです！！！)

## イメージ画像の話

このリポジトリには画像を差し込んでいません。
なので適宜画像ファイルをダウンロードしてimgフォルダーにでも置いてください。

### 画像の引用元

ニコニコモンズからの引用

DRAGON_BODY_IMAGE_PATH = <https://commons.nicovideo.jp/works/agreement/nc355601>
DRAGON_BALLOON_IMAGE_PATH= <https://commons.nicovideo.jp/works/agreement/nc355602>
