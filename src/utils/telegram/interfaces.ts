export interface SendTelegramMessageOptions {
    chat_id: string;
    text: string;
    bot_token: string;
  }

  export interface ResponsForSendMessageWithFetch {
    ok: boolean
  }