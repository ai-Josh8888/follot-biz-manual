export default {
  title: 'Follot Biz マニュアル',
  base: '/follot-biz-manual/',
  description: 'Follot Biz の操作ガイド',
  lang: 'ja',
  lastUpdated: true,

  themeConfig: {
    search: {
      provider: 'local'
    },

    // サイトのロゴ（任意）
    // logo: '/logo.svg',

    // 右上のナビゲーション
    nav: [
      { text: 'マニュアルTop', link: '/guide/auth' },
      // { text: 'GitHub', link: 'https://github.com/...' }, // GitHubリポジトリがあれば
    ],

    // サイドバーの設定
    sidebar: {
      // '/guide/' で始まるURLのページに、このサイドバーを表示する
      '/guide/': [
        {
          text: '基本操作',
          items: [
            { text: 'ログイン・認証', link: '/guide/auth' },
          ]
        },
        {
          text: '主な機能',
          items: [
            { text: '顧客管理', link: '/guide/customers' },
            { text: 'Bizトーク (顧客チャット)', link: '/guide/chat' },
            { text: 'Teamチャット (社内)', link: '/guide/team-chat' },
            { text: 'タスク管理', link: '/guide/tasks' },
            { text: 'AI機能', link: '/guide/ai' },
            { text: '顧客ノート', link: '/guide/customer-note' },
            { text: '通知管理', link: '/guide/notifications' },
          ]
        },
        {
          text: '連携機能',
          items: [
            { text: '外部連携について', link: '/guide/integrations' },
          ]
        },
        {
          text: '各種設定',
          items: [
            { text: 'アカウント設定', link: '/guide/settings-account' },
            { text: 'テナント・組織設定', link: '/guide/settings-tenant' },
            { text: '新規組織の登録', link: '/guide/settings-register-org' },
            { text: 'LINE連携', link: '/guide/settings-line' },
            { text: 'ChatWork連携', link: '/guide/settings-chatwork' },
          ]
        }
      ]
    },

    // 右上のソーシャルリンク（任意）
    // socialLinks: [
    //   { icon: 'github', link: 'https://github.com/...' }
    // ]

    footer: {
      message: 'Follot Biz Documentation',
      copyright: 'Copyright © 2024 Coobal. Inc.'
    }
  }
}
