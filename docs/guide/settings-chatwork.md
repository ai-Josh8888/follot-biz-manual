# ChatWork連携設定

**※この設定は、管理者権限を持つユーザーのみ表示・編集が可能です。**

ChatWorkとFollot Bizを連携させるための設定です。連携することで、ChatWorkでのやり取りをBizトーク内で一元管理できるようになります。

## 設定の主な流れ

1.  **ChatWorkでの準備**:
    *   ChatWorkの管理画面でAPI設定を行い、「APIトークン」を取得します。
    *   （OAuth認証を利用する場合）OAuthアプリケーションを作成し、「クライアントID」「クライアントシークレット」を取得します。
2.  **Follot Bizでの設定**:
    *   「テナント設定」>「連携設定」>「ChatWork」を開きます。
    *   認証方式（APIトークン or OAuth）を選択し、ChatWork側で取得した情報を入力して接続テストと保存を行います。
3.  **Webhook URLの設定**:
    *   Follot Bizで表示される「Webhook URL」を、ChatWorkのAPI設定に登録します。これにより、ChatWorkでのイベントがFollot Bizに通知されるようになります。

## ユーザーの招待と承認

Bizトークのルームから顧客をChatWorkに招待できます。顧客が招待を承認し、ChatWork上でメッセージを送信すると、Follot Bizの管理画面に通知が届きます。管理者がこれを承認・紐付けすることで連携が完了します。