/**
 * Long-form guides.
 *
 * Content, not components: every guide is data so the page template stays one
 * file and the prerenderer picks new guides up from the same list.
 *
 * Two rules apply to everything here, and they are the reason these pages are
 * worth publishing at all:
 *  1. No performance figures. No win rates, no returns, no equity curves,
 *     unless they link to a verified third-party track record. Buyers in this
 *     market screen hard for overclaiming, and the competition is full of it.
 *  2. Every guide states a real limitation. A page that only sells reads like
 *     the scams it sits beside in the results.
 */
export interface GuideSection {
  heading: string;
  body?: string[];
  bullets?: string[];
  table?: { head: string[]; rows: string[][] };
}

export interface Guide {
  slug: string;
  /** The <h1>. */
  title: string;
  /** SEO title, without the brand suffix. */
  pageTitle: string;
  metaDescription: string;
  /** One-line summary for the index. */
  blurb: string;
  readingMinutes: number;
  intro: string[];
  sections: GuideSection[];
  caveat: { title: string; body: string };
  faqs: { q: string; a: string }[];
  related: { label: string; path: string }[];
}

export const guides: Guide[] = [
  {
    slug: 'connect-ea-to-mt5',
    title: 'How to connect an Expert Advisor to your MT5 account',
    pageTitle: 'How to Connect an Expert Advisor to Your MT5 Account',
    metaDescription:
      'Connect an Expert Advisor to MetaTrader 5 in four steps — licence code, account number, server and trading password — plus what to check when it does not work.',
    blurb: 'The four things you need, where to find each of them, and the four reasons it usually fails.',
    readingMinutes: 5,
    intro: [
      'Connecting an Expert Advisor to a MetaTrader 5 account takes about two minutes once you have the four pieces of information it needs. Most of the time people spend on it goes into finding the server name and working out which password to use.',
      'This describes how it works with TradeFx, where the Expert Advisor runs on our infrastructure rather than in a terminal on your machine. The principles are the same elsewhere; the steps are not.',
    ],
    sections: [
      {
        heading: 'What you need before you start',
        bullets: [
          'Your 9-character licence code, from My Expert Advisors in the dashboard',
          'Your MT5 account number — the login, usually 8 or 9 digits',
          'Your server name, exactly as MetaTrader shows it',
          'Your trading password, not the investor password',
        ],
        body: [
          'The last two are where people get stuck, so they are worth a moment each.',
        ],
      },
      {
        heading: 'Finding your server name',
        body: [
          'In MetaTrader 5, open File, then Open an Account, and the server appears next to your broker — something like Exness-MT5Real8 or ICMarketsSC-MT5. It is also shown in the bottom-right corner of the terminal while you are connected.',
          'Copy it exactly, including capitals, hyphens and any trailing number. A server name that is close but not identical will fail to connect, and the error the broker returns is rarely specific about why.',
        ],
      },
      {
        heading: 'Trading password, not investor password',
        body: [
          'MetaTrader accounts have two passwords. The investor password is read-only: it lets software see the account but not place orders. The trading password — sometimes called the master password — can place orders.',
          'An Expert Advisor has to place orders, so it needs the trading password. If you enter the investor password the account will connect and then simply never trade, which is a confusing failure to diagnose. If you are not sure which you have, reset the trading password with your broker before you start.',
        ],
      },
      {
        heading: 'The four steps',
        bullets: [
          'Open Trading Accounts in your TradeFx dashboard and choose Connect account.',
          'Pick the licence you want to use, or paste the 9-character code.',
          'Enter a name for the account, the platform, your account number, the server and the trading password.',
          'Submit. We verify the credentials, check the account type, and the Expert Advisor starts on a verified account.',
        ],
        body: [
          'The name is only for you — it is what the account is called in your dashboard, so "Exness Live" is more useful than the account number.',
        ],
      },
      {
        heading: 'When it does not work',
        table: {
          head: ['Symptom', 'Usual cause', 'Fix'],
          rows: [
            ['Credentials rejected immediately', 'Server name not exactly right', 'Copy it again from the terminal, including the trailing digits'],
            ['Connects but never trades', 'Investor password used instead of the trading password', 'Reset the trading password with your broker and reconnect'],
            ['Rejected for TradeFx Heddge specifically', 'The account is netting, not hedging', 'Open a hedging-enabled MT5 account; netting cannot hold both sides'],
            ['Connects, then drops', 'Account logged in elsewhere, or the broker restricts concurrent sessions', 'Close other terminals using the same login'],
          ],
        },
      },
      {
        heading: 'What happens to your password',
        body: [
          'It is encrypted before it is stored and is never displayed again — not to you and not to our staff. It is used to connect to your broker and nothing else.',
          'It does not allow deposits or withdrawals. A MetaTrader trading password can place and manage orders; moving money is done through your broker, by you. You can disconnect the account from your dashboard at any time, which stops the Expert Advisor immediately.',
        ],
      },
    ],
    caveat: {
      title: 'Connecting an account is not the same as being ready to trade',
      body: 'A connected account will start taking positions as soon as the Expert Advisor sees a setup. Decide your account size and make sure you are comfortable with the drawdown before you connect, not after. Disconnecting stops new trades but does not close positions already open.',
    },
    faqs: [
      {
        q: 'Do I need to leave MetaTrader running on my computer?',
        a: 'No. The Expert Advisor runs on our infrastructure, so your machine can be switched off. You only need MetaTrader to look at the account yourself.',
      },
      {
        q: 'Can I use one licence on two accounts?',
        a: 'No. A licence covers one trading account at a time. You can disconnect it from one account and connect it to another, but it cannot run on both at once.',
      },
      {
        q: 'What if I change brokers?',
        a: 'Disconnect the old account in your dashboard and connect the new one with the same licence code. Nothing needs to be reissued.',
      },
      {
        q: 'Will I still be able to trade the account myself?',
        a: 'Yes, though we would not recommend it on the same account. Manual positions and the Expert Advisor will both be using the same margin, and the results become impossible to read apart.',
      },
      {
        q: 'How do I know it is actually working?',
        a: 'The dashboard shows the account as connected, the Expert Advisor as active, and a trade statement that fills in as positions close. If the licence shows as connected but the statement stays empty for days in an active market, tell us.',
      },
    ],
    related: [
      { label: 'Which brokers are supported', path: '/supported-brokers' },
      { label: 'Compare the Expert Advisors', path: '/products/compare' },
      { label: 'How it works, end to end', path: '/how-it-works' },
    ],
  },

  {
    slug: 'forex-ea-without-vps',
    title: 'Running a forex Expert Advisor without a VPS',
    pageTitle: 'Running a Forex EA Without a VPS',
    metaDescription:
      'Most Expert Advisors need a VPS running around the clock. Managed execution removes that — what it changes, what it costs you, and who should still run their own.',
    blurb: 'Why EAs normally need a server, what managed execution changes, and what you give up.',
    readingMinutes: 4,
    intro: [
      'A conventional Expert Advisor is a file you load into MetaTrader. It only trades while that terminal is open and connected, which is why most EA vendors tell you to rent a VPS: a Windows server that keeps the terminal running when your own machine is not.',
      'That is a real cost and a real maintenance job. There is another way to run the same kind of strategy, and it is worth understanding the trade-off before you pick either.',
    ],
    sections: [
      {
        heading: 'Why an EA normally needs a VPS',
        body: [
          'The Expert Advisor is code running inside your MetaTrader terminal. Close the terminal, sleep the laptop or lose the connection, and the strategy stops — mid-position, if it happens at the wrong moment.',
          'A VPS solves this by putting the terminal somewhere that never sleeps. It also usually sits closer to the broker, which shortens the round trip on every order.',
        ],
      },
      {
        heading: 'What a VPS actually costs',
        body: [
          'The rental is the smaller part. You also take on keeping Windows patched, watching that the terminal is still running, restarting it when it is not, and noticing when the broker connection drops at three in the morning.',
          'For a trader running several accounts this is a reasonable trade. For someone who bought one Expert Advisor and wants it to work, it is a second product to manage.',
        ],
      },
      {
        heading: 'The managed alternative',
        body: [
          'With managed execution the strategy runs on infrastructure the vendor operates, and your account is connected to it. There is no terminal for you to keep alive, no server to patch, and nothing to restart. Your machine can be off.',
          'This is how TradeFx Expert Advisors work. You connect your MetaTrader account with a licence code and the execution happens on our side.',
        ],
      },
      {
        heading: 'What you give up',
        bullets: [
          'You are not holding the terminal, so you cannot change the strategy’s parameters yourself.',
          'You are trusting a third party’s uptime rather than your own server.',
          'You cannot inspect the running code the way you could a file on your own VPS.',
          'If you want to run software from several vendors, you may still end up needing a VPS for the rest.',
        ],
        body: [
          'What you do not give up is control of the money. The broker account stays in your name, the funds stay with your broker, and you can disconnect the Expert Advisor whenever you like.',
        ],
      },
      {
        heading: 'Who should still run their own VPS',
        bullets: [
          'You trade manually and want your charts and tools available from anywhere',
          'You run Expert Advisors from several vendors and want them in one place',
          'You have written your own strategy and want to tune it yourself',
          'You need a specific broker-adjacent location for latency reasons',
        ],
        body: [
          'We sell a VPS for exactly these cases. If you bought a TradeFx Expert Advisor and nothing else, you do not need one, and we would rather say so than sell you a second product.',
        ],
      },
    ],
    caveat: {
      title: 'Managed execution moves the risk, it does not remove it',
      body: 'Your own VPS can fail, and so can ours. The difference is who is watching and who fixes it, not whether failure is possible. Anyone describing either arrangement as guaranteed uptime is overstating it.',
    },
    faqs: [
      {
        q: 'Is a VPS required for TradeFx Expert Advisors?',
        a: 'No. They run on our infrastructure. A VPS adds nothing for a customer who only runs our Expert Advisors.',
      },
      {
        q: 'Does managed execution mean you hold my money?',
        a: 'No. The broker account is in your name, the funds stay with your broker, and we cannot deposit or withdraw. We place trades on the account and nothing else.',
      },
      {
        q: 'What happens if my internet goes down?',
        a: 'Nothing. The Expert Advisor is not running on your connection. Your dashboard will be unreachable until you are back online, but the strategy carries on.',
      },
      {
        q: 'Can I still run my own EAs alongside?',
        a: 'On a separate account, yes. Running two systems on one account means they share margin and the results become impossible to attribute.',
      },
    ],
    related: [
      { label: 'Forex trading VPS', path: '/services/trading-vps' },
      { label: 'How it works, end to end', path: '/how-it-works' },
      { label: 'Compare the Expert Advisors', path: '/products/compare' },
    ],
  },

  {
    slug: 'gold-scalping-ea-mt5',
    title: 'Gold scalping EAs for MT5: what actually matters',
    pageTitle: 'Gold Scalping EA for MT5: What Actually Matters on XAUUSD',
    metaDescription:
      'Spread, execution and drawdown control decide whether a gold scalping Expert Advisor works on XAUUSD. The arithmetic, and what to ask any vendor before buying.',
    blurb: 'The spread arithmetic that decides whether any gold scalper can work, and what to ask before buying one.',
    readingMinutes: 6,
    intro: [
      'Gold is the instrument most scalping Expert Advisors are pointed at, and it is also the one where the arithmetic is least forgiving. Before comparing vendors, it is worth understanding what actually determines whether a gold scalper can work at all.',
      'None of this is specific to us. It applies to any XAUUSD scalper you are considering.',
    ],
    sections: [
      {
        heading: 'Why scalpers pick gold',
        body: [
          'XAUUSD moves. Daily ranges are wide relative to the major currency pairs, volume is deep enough to get filled, and the London and New York overlap concentrates activity into a predictable window.',
          'That volatility is the opportunity and the problem. The same movement that produces a quick target produces a quick stop.',
        ],
      },
      {
        heading: 'The spread arithmetic, which decides everything',
        body: [
          'A scalper works small targets. Suppose the strategy aims for 40 cents of movement on gold. On a raw-spread account the spread might be 15 cents; on a standard account it might be 35.',
          'On the raw account you keep 25 cents of a winning move. On the standard account you keep 5. The strategy has not changed — the account type has — and the second version needs a hit rate so high that no strategy sustains it.',
          'This is why every serious gold scalper insists on a raw-spread or ECN account, and why a vendor who does not mention account type either has not thought about it or is hoping you will not.',
        ],
      },
      {
        heading: 'Execution and slippage',
        body: [
          'Being right about direction is not enough if the fill arrives late. On a fast-moving instrument the difference between the price the strategy saw and the price it got is a real cost, and it is paid on every trade rather than occasionally.',
          'This is where managed execution or a broker-adjacent VPS earns its place, and it is worth asking any vendor where their execution actually runs.',
        ],
      },
      {
        heading: 'Drawdown control',
        body: [
          'A scalping strategy will have losing runs. What matters is whether the system has a hard limit — a stop on every position, a cap on total exposure, and a daily loss ceiling that stops trading rather than trying to trade back.',
          'A system without a daily ceiling relies on the market turning before the account does. That works until it does not.',
        ],
      },
      {
        heading: 'Backtests and what they are worth',
        body: [
          'The market is full of gold EAs sold on a smooth backtested equity curve. A backtest can be optimised until it describes the past rather than the market, and one fitted closely enough will always look excellent.',
          'What is worth something is a verified live track record, on a third-party service, over a period that includes conditions the strategy found difficult. Ask for it. If the answer is a screenshot, you have your answer.',
        ],
      },
      {
        heading: 'Questions to ask any vendor',
        bullets: [
          'What account type does this need, and what happens on a standard-spread account?',
          'Is there a verified live track record I can view, not a backtest?',
          'Is there a stop on every position, and a daily loss limit?',
          'Where does execution run, and what is the typical latency to my broker?',
          'What happens during high-impact news — does it trade through or stand aside?',
          'Do I own anything, or am I renting access?',
        ],
      },
    ],
    caveat: {
      title: 'We do not publish performance figures',
      body: 'You will not find a win rate or a return figure for TradeFx Scalper on this site, because we will not publish numbers we cannot point you to an independent record of. Treat any vendor’s unverified figures — including ours, if we ever published them — as marketing rather than evidence.',
    },
    faqs: [
      {
        q: 'What spread do I need for a gold scalping EA?',
        a: 'As tight as your broker offers, which in practice means a raw-spread or ECN account rather than a standard one. The arithmetic above shows why: on wide spreads the strategy is paying away most of its target on every trade.',
      },
      {
        q: 'Does a gold scalper work on MT4?',
        a: 'It can, but execution and symbol handling are cleaner on MT5, and a strategy ported from MT4 often behaves differently in live trading. TradeFx Scalper is MT5 only for that reason.',
      },
      {
        q: 'How often should a gold scalper trade?',
        a: 'It varies with the session. Busy during the London and New York overlap, quiet otherwise. A system that trades constantly regardless of conditions is not being selective, which is usually a warning rather than a feature.',
      },
      {
        q: 'Can I run it on a small account?',
        a: 'It depends on the lot sizes your broker allows and the drawdown you can absorb. Send us your account size with a quotation request and we will tell you honestly whether it is sensible.',
      },
    ],
    related: [
      { label: 'TradeFx Scalper', path: '/products/scalper' },
      { label: 'Which brokers are supported', path: '/supported-brokers' },
      { label: 'Compare the Expert Advisors', path: '/products/compare' },
    ],
  },

  {
    slug: 'hedging-ea-mt5',
    title: 'Hedging EAs for MT5: how two-sided strategies work',
    pageTitle: 'Hedging EA for MT5: How Two-Sided Strategies Work',
    metaDescription:
      'What a hedging Expert Advisor does, why it needs a hedging-enabled MT5 account, the costs nobody mentions, and when hedging is the wrong tool.',
    blurb: 'What hedging actually buys you, the carrying costs nobody mentions, and when it is the wrong tool.',
    readingMinutes: 6,
    intro: [
      'A hedging Expert Advisor holds positions on both sides of a market at the same time, rather than picking a direction. The aim is a flatter equity curve through volatile conditions, not a larger win on any one trade.',
      'It is a legitimate approach with real costs, and it needs a specific kind of account. Both are worth understanding before you buy one.',
    ],
    sections: [
      {
        heading: 'Hedging and netting accounts',
        body: [
          'MetaTrader 5 accounts come in two kinds. On a netting account, buying and then selling the same instrument nets off into a single position — the second order reduces or closes the first. On a hedging account, both positions exist side by side.',
          'A hedging Expert Advisor cannot run on a netting account. There is nothing to configure around it: the account simply will not hold both sides.',
        ],
      },
      {
        heading: 'How to check which you have',
        body: [
          'In MetaTrader 5, the account type is shown in the terminal under account properties, and your broker states it when the account is opened. Some brokers offer both and you choose at signup; some offer only netting.',
          'When you connect an account to TradeFx we detect this automatically and tell you before anything starts, rather than letting a hedging strategy fail quietly on a netting account.',
        ],
      },
      {
        heading: 'What the strategy is trying to do',
        body: [
          'Holding both sides means a sharp move against one leg is cushioned by a gain on the other. The position as a whole moves less than either side alone.',
          'The strategy then manages the pair — adjusting as price moves, and closing both legs when the combined position reaches its target. The goal is to survive volatility that would stop out a directional position, and to close on the net result.',
        ],
      },
      {
        heading: 'The costs nobody mentions',
        bullets: [
          'You pay the spread on both legs, not one.',
          'Margin is reserved for both positions, so the same account supports fewer trades.',
          'Swap is charged on both sides overnight, and the two rarely cancel out — on many pairs the net carry is negative.',
          'A hedged pair can sit open far longer than a directional trade, so those carrying costs accumulate.',
        ],
        body: [
          'None of this makes hedging a bad approach. It does mean a hedging strategy has to clear a higher bar before it is profitable, and any description that omits the carrying cost is not describing the whole trade.',
        ],
      },
      {
        heading: 'When hedging is the wrong tool',
        bullets: [
          'You have a strong directional view — hedging deliberately gives up most of the upside.',
          'Your account is tight on margin; two legs need headroom.',
          'You are trading instruments with a heavy negative carry.',
          'You want a busy trade log; hedged pairs are often held for a long time.',
        ],
      },
    ],
    caveat: {
      title: 'Hedging is not risk-free, and anyone saying so is selling',
      body: 'Holding both sides reduces how violently a position moves against you. It does not remove the possibility of loss, and the carrying costs mean a hedged pair that goes nowhere still costs money. Any marketing that presents hedging as a way to trade without risk is describing something that does not exist.',
    },
    faqs: [
      {
        q: 'Is hedging allowed on all MT5 accounts?',
        a: 'No. It needs an account the broker has set up in hedging mode. Netting accounts close one side against the other and cannot hold both.',
      },
      {
        q: 'Is hedging legal?',
        a: 'It depends on your jurisdiction and your broker. Some regulators restrict it for retail accounts. Check with your broker, and check the rules that apply where you live, before buying a hedging strategy.',
      },
      {
        q: 'Does hedging guarantee I cannot lose?',
        a: 'No. It reduces how sharply the position moves against you and it costs money to hold. Both legs pay spread, both reserve margin, and both accrue swap.',
      },
      {
        q: 'Why is it spelled Heddge?',
        a: 'That is the product name. The strategy is ordinary hedging.',
      },
    ],
    related: [
      { label: 'TradeFx Heddge', path: '/products/heddge' },
      { label: 'Which brokers are supported', path: '/supported-brokers' },
      { label: 'Compare the Expert Advisors', path: '/products/compare' },
    ],
  },
];

export function guideBySlug(slug: string | undefined): Guide | undefined {
  return guides.find((g) => g.slug === slug);
}
