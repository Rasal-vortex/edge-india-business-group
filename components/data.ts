export interface Member {
  id: string;
  name: string;
  role: string;
  badge: string;
  categories: ('advisory' | 'founding' | 'regional')[];
  image: string;
  description: string;
  sector: string;
  fullBio: string;
  keyInitiatives: string[];
  location: string;
  tenure: string;
}

export interface GalleryItem {
  id: string;
  title: string;
  category: 'events' | 'meetings' | 'community';
  tag: string;
  description: string;
  image: string;
  colSpan?: string;
  rowSpan?: string;
  date: string;
  location: string;
  participants: string;
  keyTakeaways: string[];
}

export const MEMBERS_DATA: Member[] = [
  {
    id: 'arjun-menon',
    name: 'Arjun Menon',
    role: 'Business Director',
    badge: 'DIRECTOR',
    categories: ['founding', 'advisory'],
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuC5mWtsWeG5EKl5wFnKB86xwHxjKaELI97xrp2V0XYkRHCN5kDkNclrYiiFYi4v4ibpYwocWHYImrUm8yCN6E-5WIPJGZAB17A74MGPwIGLllM0MixAxukWQxWVRRwOrmXgJVH9H3no51nY_J4BjFKwCYKPO-HvyAyH950YY4UttfSRCmIcHm47Tfm0PmM1u59atzQg2OTGmKPvXtU_dXtOKBuHKqWCznvlH9eDsukGJTtBaeiB8ws',
    description: 'Senior Managing Partner, Enterprise Strategy. Over two decades scaling industrial manufacturing conglomerates and facilitating capital consortiums across South Asia.',
    sector: 'Strategy & M&A',
    fullBio: 'Arjun Menon serves as Business Director at Edge India Business Group, where he spearheads long-term institutional expansion and cross-border M&A advisory. Previously, Arjun was Senior Managing Partner at an apex industrial advisory firm and oversaw corporate restructuring transactions exceeding ₹4,500 Crore. He holds engineering degrees from IIT Madras and an MBA from IIM Ahmedabad.',
    keyInitiatives: [
      'National Industrial Corridor Advisory 2026',
      'Advanced Manufacturing Cross-Border Consortium',
      'Apex Institutional Governance Taskforce'
    ],
    location: 'Mumbai & New Delhi',
    tenure: 'Founding Member since 2021'
  },
  {
    id: 'anjali-nair',
    name: 'Anjali Nair',
    role: 'Operations Lead',
    badge: 'OPERATIONS',
    categories: ['advisory'],
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCL3zT_SFOt0Mm63b99R5VEAZOQLNFyezUgY9_5wm3J01zKqEuTOGYKTkKIYPYzsAidqKdKqHiCuh6emQBWT-wpzbd8TFGJlSJjdH6x3HXV3E9kSw5ObAwFUvz_sAztt6RSRe1TNJcp3Gj3XVmzYfTahvtasBNaeQFgxEkeb0H-f7H_jnAbJsuKkJRHhOXNotKC46sC8511xcyqQSeMtDe72LJR8NxGAEIdybjRlww1i166IxKV7Rs',
    description: 'Former VP Operations, Global Logistics & Supply. Pioneer in decarbonized logistics and multi-modal supply chain corridors linking Indian ports to EMEA hubs.',
    sector: 'Logistics & Infrastructure',
    fullBio: 'Anjali Nair directs operational frameworks and supply chain alliances for Edge India Business Group. With over 18 years in container logistics, maritime infrastructure, and supply network automation across Singapore, Rotterdam, and JNPT Mumbai, Anjali advises prominent logistics operators on net-zero multimodal transit.',
    keyInitiatives: [
      'Decarbonized Coastal Shipping Corridors',
      'Autonomous Port Yard Optimization Taskforce',
      'India-Middle East-Europe Economic Corridor Working Group'
    ],
    location: 'Bengaluru & Chennai',
    tenure: 'Advisory Board Member since 2022'
  },
  {
    id: 'rahul-thomas',
    name: 'Rahul Thomas',
    role: 'Business Consultant',
    badge: 'ADVISORY',
    categories: ['founding', 'regional'],
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDaseWM40WHmjGb1-2H-KhgRqJCwtuBXa6SAlVnESz2Zsn12_Hs-5puenso_ePTQHDdkwwojFZEVxySkOx7NJYEKtBKrD0598lFdEl6odK5H9taruxvCwUbh0Lkr8cmfidTWaOiwMP5SiQLjlJlnvD87Fo5JrYEzEtUpIKWiJJhmrSZU7FVfqKRgcxetbpS7RjkXJkS9_AqWt7iuXmWDhcOC3heYUa51UETam-hGLfSFLpZh_fy-j4',
    description: 'Advisory Partner, Private Equity & M&A. Orchestrated over $1.4B in cross-border tech and renewable asset transitions across Indian and Southeast Asian capital markets.',
    sector: 'PE & Strategic Finance',
    fullBio: 'Rahul Thomas is an established private equity advisor and corporate finance veteran. Over his career across Mumbai, London, and Singapore, he has structured syndicated credit facilities, pre-IPO financing rounds, and growth equity buyouts in renewable energy and enterprise cloud infrastructure.',
    keyInitiatives: [
      'Clean Energy Sovereign Capital Syndicate',
      'DeepTech Growth Equity Advisory Pool',
      'Family Office Co-Investment Platform'
    ],
    location: 'Mumbai & London',
    tenure: 'Founding Member since 2021'
  },
  {
    id: 'meera-joseph',
    name: 'Meera Joseph',
    role: 'Community Coordinator',
    badge: 'ALLIANCES',
    categories: ['regional', 'advisory'],
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAum2QYza7dS7QYCDtsJXOHUkSlPxcwkAm7q2xNVkyy-6oI3Xovhno_kXLL1WfMPUFnkY0uvQMM3DZzGwfY2eS25XVgBov9C8G305v-q6aF8i5dYgXp6KQx6SCzukHV05VaxMgUUXEfXVOouyfEReBgk7PqlBkrg2hqZJrrSULCwXKZuyEP7i5SmlaY8o8-yLJ5gVD7EBZqGPhZFqrVMVRQIB0AfqrIqev0FDTVX6gnVh9w_akEqZY',
    description: 'Director of Strategic Partnerships & Alliances. Spearheads member engagement, high-level delegation summits, and cross-chapter stakeholder development initiatives.',
    sector: 'Ecosystem Alliances',
    fullBio: 'Meera Joseph drives stakeholder governance, international embassy trade missions, and apex corporate partnerships for Edge India Business Group. Her diplomatic career and track record bridging governmental policy bodies with tier-1 enterprise conglomerates has catalyzed over 30 bilateral trade memorandums.',
    keyInitiatives: [
      'Annual Edge India Honors Gala',
      'Bilateral GCC-India Trade Delegation',
      'Women Executive Leadership Roundtable'
    ],
    location: 'New Delhi & Hyderabad',
    tenure: 'Regional Chapter Lead since 2023'
  }
];

export const GALLERY_DATA: GalleryItem[] = [
  {
    id: 'national-growth-keynote',
    title: 'National Growth Keynote',
    category: 'events',
    tag: 'Annual Summit 2025',
    description: 'Over 350 apex leaders convening in New Delhi to outline decadal industrial policy.',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAnzHuWc8Rs649oF5-oZ7fs3uipdoJhurp7Jf4olkx0vZlAmbTMjmCtjvquNAFUFJsSHgg0NielQuWyNhdR12BO08MTyEzO6fIjxK-RpAk4zYDFExwRRadoyuEGXm0KzmWJmdebd-SYuPJA1Rqx9UjV4uPEU0tdSle8cCzlnwE27UwoBeExc006CHEzKJ_QEYEDTjt-PQmpAl4JSO_CyhjGBmnMLIZAC1aN6ZrfK1DK55ChoSqfoHs',
    colSpan: 'sm:col-span-2',
    rowSpan: 'sm:row-span-2',
    date: 'November 14, 2025',
    location: 'Bharat Mandapam, New Delhi',
    participants: '380+ C-Suite Executives, Cabinet Ministers & Global Institutional Allocators',
    keyTakeaways: [
      'Decadal policy consensus on India-wide advanced semiconductor supply chain development.',
      'Unveiling of the ₹1,200 Cr Edge India Syndicate Opportunity Pipeline for clean-tech manufacturing.',
      'Bilateral industrial corridor framework ratified by leading enterprise stakeholders.'
    ]
  },
  {
    id: 'strategy-council',
    title: 'Strategy Council',
    category: 'meetings',
    tag: 'Closed-Door',
    description: 'Intimate executive roundtable on capital allocation, geopolitical diversification, and domestic infrastructure.',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDake2n004ujZcRiSEhmX3U9iTd9Z1EzBGXe5_cqAjmADklJfn9zGt6xN1oiBHKTfJYrWKJjPGi7Qf9pg7k892VjqKhi-nlxFpb2ARXuN4GuH1qFuzv6PIJGQacd3B1Aicbb0tcMnBAlpscZGEIZs3UAzWU4BdP0-Cy1HFkKvJLE599ixuUToHN90ePGo7xfgYGOpiJvxdvLdswUBqqXELzWR95mz4EkX8ZpIE8zcHK3GpvyxMlmq4',
    date: 'January 18, 2026',
    location: 'Taj Mahal Palace, Mumbai',
    participants: '24 Invited Managing Directors and Family Office Principals',
    keyTakeaways: [
      'Assessment of cross-border liquidity trends and currency hedging mechanisms for Q1-Q3.',
      'Evaluation of state-level capital subsidies across Maharashtra and Tamil Nadu corridors.',
      'Closed-circuit review of upcoming infrastructure concession auctions.'
    ]
  },
  {
    id: 'founders-lounge',
    title: "Founders' Lounge",
    category: 'community',
    tag: 'Evening Reception',
    description: 'Private terrace reception connecting high-growth technology founders with sovereign and institutional capital.',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCGTOKSqXXVj2xaVpmXfkP0dO3tulZdE3WY18EJK8usAQtrxTx1Od6YlYMxpZ9f7b-0N9f-Yk-e2G6CjhaWnvA_zCtUcdg3EpJNkXFAvoydm2PaV3eJ0kCIhNbDdqFEtrcqjQgB7_it-iYD4B_cdgV4fSofQmOrxiz9OW5NDgbcFmgt7HTGs0IDdF-RjHoEVEcoOXRMewrRRJKdksdhX_SGrhXYmJCFupTXuJ8o1Z26FOco77FF4HI',
    date: 'February 22, 2026',
    location: 'Worli Sky Lounge, Mumbai',
    participants: '75 Founders & Senior Venture Partners',
    keyTakeaways: [
      'Facilitated bilateral discussions across 14 scale-up enterprises in EV mobility and SaaS.',
      'Initiation of syndicated co-investment term sheets.',
      'Informal advisory pairings established between seasoned industrialists and first-generation founders.'
    ]
  },
  {
    id: 'bilateral-trade-agreement',
    title: 'Bilateral Trade Agreement',
    category: 'meetings',
    tag: 'MOU Signing',
    description: 'Cross-border capital syndicate signing between Indian manufacturing consortium and GCC partners.',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBgnYKe5_S2ooQGldmbsw-dU-R3SUqXW9p4FpV1VertkWmdXIr6woNvsqkIofsz6tlD1ULcTaPhtQhibbHlcyE8ZLPld6ygc8PjrLEqrTngAoLQmSQttvH-4s2_PM4Ysd_c7GMLg0nBLwoM5aoJkIWfXF4KfvEJ-Jn_lw5S7ALIkFB4dbW-yKhpL3bEypVJjRv2njH--RWMhqvNTiPe47MOqs8BA_k01dGdsqiPg0Lps8jQ1RlEpU0',
    rowSpan: 'sm:row-span-2',
    date: 'March 05, 2026',
    location: 'Emirates Towers, Dubai & Mumbai Virtual Hub',
    participants: 'Signatories from Edge India Consortium and UAE Bilateral Trade Council',
    keyTakeaways: [
      'Formal ratification of ₹650 Cr dedicated corridor for precision heavy engineering exports.',
      'Streamlined regulatory clearance and bonded warehouse concessions in Jebel Ali.',
      'Quarterly bilateral review rhythm established under Edge India Secretariat.'
    ]
  },
  {
    id: 'tech-frontier-forum',
    title: 'Tech Frontier Forum',
    category: 'events',
    tag: 'Bengaluru',
    description: 'Pioneering discussions on quantum computing, deeptech commercialization, and semiconductor fabrication.',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAineE6lw7gFKVKt1J24Th006OnXBd1BXZmxP9YmJVpOkkuxbDl8JVtJuLmN4YjTl3KCSlv0iqblV9MsFiPoGyStAjjRPnLDd2IJoMGKy30fdiZWRGKrAj7iUPvzGtaBHiBl_sg55t8-rJ-TLOB2sNGvub4hgRl1RxZy9-ayMLT8H2qhAwzYrJalks9tPKAgrfXBfEq99PXYmwgPPRYEGE_iMiN1k10TFLnBoW0Yk-KWwqLeaJ7YJ8',
    date: 'April 11, 2026',
    location: 'ITC Gardenia, Bengaluru',
    participants: '190 DeepTech Innovators, CTOs & R&D Directors',
    keyTakeaways: [
      'Release of the 2026 Indian Enterprise AI & Quantum Preparedness Whitepaper.',
      'Tri-party incubation collaboration announced between two IIT research parks and enterprise sponsors.',
      'Establishment of the Edge India Hardware Acceleration Sandbox.'
    ]
  },
  {
    id: 'western-regional-delegation',
    title: 'Western Regional Delegation',
    category: 'community',
    tag: 'Community Chapter',
    description: 'Regional leadership meeting overlooking the Mumbai coast, reviewing coastal logistics and port automation.',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCD7eRAzJhiC7WOHTjFsxXitef2N2ONBg9ygbPu7Q8zgzgODs1IFY78AW02ffnqLxfvwrp6IOft6g1ZrwvYfjgtCZuwZE22Wt3ANIezM9glfF1mDijA28ZKQqC_iklU7GB7sDEGU3Vuz_MM7ygAwBtWOAHBHELPo3y4nB3s9cqXBuKGWwehw_f1_TKxOff3SiOVoOEiedWUncqv64isYCl8cww40oFco0J0jtJMxpEOHp773zEpFYg',
    colSpan: 'sm:col-span-2',
    date: 'May 19, 2026',
    location: 'Nariman Point, Mumbai',
    participants: 'Western Chapter Steering Committee & Port Authority Delegates',
    keyTakeaways: [
      'Review of maritime turnaround metrics at Western seaports.',
      'Deployment of AI-based predictive maintenance across 6 container freight stations.',
      'Welcoming 12 new industrial conglomerate members to the Western Chapter.'
    ]
  },
  {
    id: 'deal-flow-review',
    title: 'Deal Flow Review',
    category: 'meetings',
    tag: 'Analytics',
    description: 'Deep-dive analytical review of syndicated investments, capital multiples, and pipeline metrics.',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCr7qlE9ocgv3Ol8IOuTaBuhQpwcgP8WRvisknNJU7wHV2RVQ26vWWoWNh-6k6_jrYIxdKINsasut_O5EdI-1AJZnf-SMCC8144oL4nzv8pxv0VXkYgOyeWwVVt3z5niHCcB1_6fUZa-TRXJimZTOmbaV3RQgpqGyCRf6hGjTZ7VUv49c5LG4Yys_Hkaqk7Ni5w6rKXNgfu67jsub-Q-w2p6l8_V-4e3MG3K850kH1-sZT6K-40S-o',
    date: 'June 08, 2026',
    location: 'Capital Tower, Gurugram',
    participants: 'Consortium Investment Committee & Lead Underwriters',
    keyTakeaways: [
      'Auditing ₹1,200 Cr cumulative syndicated deployment across 18 high-growth companies.',
      'Average IRR benchmark of 24.2% across participating institutional co-investors.',
      'Risk modeling for geopolitical commodity fluctuations in Q3.'
    ]
  },
  {
    id: 'edge-india-honors',
    title: 'Edge India Honors',
    category: 'events',
    tag: 'Gala Evening',
    description: 'Annual prestigious honors celebrating exceptional industrial governance and bilateral enterprise impact.',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBiOZ-yUiUEV3hAt6Ua0CdDW_EG8TenCapaHB0NlPiqZGG7LG_FNPwu3wPXTGtRr1hnm3O6OeDcCVvCBH_F29RJg9mkT9V_oPxDf4_fb6zry1kQq7_Nr70LjAkHsgDe_THkBoRzUKfBpSzxfw9bGS2AJhTx3vZzSlGR98giPY4ieksw2uxokCDVxoFFwYOvgXMcHt189joLGDQPpxwUtqeulrvYyVFxaydDFNkxfCKgDUO57eeN8YY',
    date: 'July 25, 2026',
    location: 'The Leela Palace, New Delhi',
    participants: '400+ Distinguished Dignitaries, Enterprise Icons & Honorees',
    keyTakeaways: [
      'Presentation of the Lifetime Industrial Leadership Award to leading manufacturing pioneers.',
      'Celebration of 500+ active C-Suite executive milestone across the Edge India ecosystem.',
      'Pledge of ₹250 Cr toward rural technical skill academies and STEM endowments.'
    ]
  }
];

export const BRAND_ASSETS = {
  logo: 'https://lh3.googleusercontent.com/aida/AEtjO1VIwkbpfyqdEr_iq_G3b7xG6cX-ymJFZxhBvjlgGQ6gFlFIegLUcvVDDtiaO8Kakk8DlPamVBD2jLkZKIbjj9GgreHR5KA0NqPdhrVIEIKceD_L56A0twdykiS0UwNa6CNEkqVbScUUi-hJofzP346sIZlYKYisFw3Gg33bRwSv0sxpL8XcLZlah_TK9-wn3CGXEotKZSLIQG7DdpU2G2A-Lxzi7HsQSD6rN3k-XoqfdsOO-38c7ayj8A',
  boardroomHero: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDeQwzH_q9wPu3lzvYGsWBBD4_pFMowBehlQTR7k1wPUTyjOK3WCAfaqyo56ciCXyy9TUQWtHJxrC5yEgScIfTTp5MAUXqd0IbxSyTfvGP_3guiyxYIsBY_5yhBffwNxs7FkwFP3vvmlDM8hlcgLzjI63F-3E_q3NssRKK4nAT71kg7fhMscH4bNGMS8cvGSYQXG0kZHuvikVulG84H7qQB2z13OfVscOH9II7LlWh3plKw4F7f0RM',
  aboutConference: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDkqCVY8ocYKAhVCLEOLwuH12IHwyO9GqnW3hICU1yKsmz_cmDC4CjzaKl08ms-MxyDEFRuVMbgUXBMEJuv_v7NHkiPQGOddtyi1463eFgCVqrdkyfm-nN9owjqC64i1bzQhJoPyTZirHQUAJLj8VZzzjGIfrxcfNANdwBXfA-0Z0XOUNS10MvS8_Vtv0DAvbOTZ_UVULOQIp1pQZbIjKiHN8xqTBxKOBbSmkceYl43dnhdw95GD7I',
};
