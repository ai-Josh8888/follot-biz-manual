import { defineConfig } from 'vitepress'

export default defineConfig({
  title: "Follot Biz マニュアル",
  description: "Follot Biz 操作ガイド",

  themeConfig: {
    search: {
      provider: 'local'
    },

    nav: [
      { text: 'ホーム', link: '/' },
      { text: 'マニュアル一覧', link: '/guide/auth' }
    ],

    sidebar: {
      '/': [
        {
          text: '1. はじめに',
          collapsed: false,
          items: [
            { text: 'ログイン・認証', link: '/guide/auth' },
            { text: '組織の開設', link: '/guide/org-register' },
            { text: 'メンバー招待・承認', link: '/guide/invite' },
          ]
        },
        {
          text: '2. 社内業務・ツール',
          collapsed: false,
          items: [
            { text: 'Teamチャット', link: '/basic/team-chat' },
            { text: 'タスク管理', link: '/basic/tasks' },
            { text: '通知の確認', link: '/basic/notifications' },
            { text: 'AI機能', link: '/basic/ai' },
          ]
        },
        {
          text: '3. 顧客対応 (Biz)',
          collapsed: false,
          items: [
            { text: '顧客名簿の管理', link: '/biz/customers' },
            { text: '顧客ノート', link: '/biz/customer-note' },
            { text: 'Bizトーク (顧客対応)', link: '/biz/biz-talk' },
          ]
        },
        {
          text: '4. 外部連携',
          collapsed: true,
          items: [
            { text: 'ChatWork連携', link: '/connect/chatwork' },
            { text: 'LINE連携', link: '/connect/line' },
          ]
        },
        {
          text: '5. 管理者設定',
          collapsed: true,
          items: [
            { text: '全体設定・契約', link: '/admin/settings' },
            { text: 'ブラックリスト管理', link: '/admin/blacklist' },
          ]
        },
        {
          text: 'テスト仕様書',
          collapsed: true,
          items: [
            { text: 'AI機能', link: '/test-cases/AI機能%2025477fe36e8280e5be64dfcd14f47c3a' },
            { text: 'Bizトーク機能', link: '/test-cases/Bizトーク機能%2025477fe36e82808aa129e8493ec496a5' },
            { text: 'ChatWork連携機能', link: '/test-cases/ChatWork連携機能%2027f77fe36e82802a93ddf90e4749c093' },
            { text: 'LINE連携機能', link: '/test-cases/LINE連携機能%202a077fe36e828002b62eee80a96f54d6' },
          ]
        }
      ]
    },

    socialLinks: []
  }
})