export interface VisualDiaryItem {
  readonly alt: string;
  readonly country: string;
  readonly image: string;
  readonly title: string;
  readonly wide?: boolean;
}

export interface DestinationCard {
  readonly alt: string;
  readonly description: string;
  readonly image: string;
  readonly price: string;
  readonly rating: string;
  readonly title: string;
}

export interface SuggestionCard {
  readonly alt: string;
  readonly image: string;
  readonly location: string;
  readonly price: string;
  readonly title: string;
}

export interface BlogPost {
  readonly category: string;
  readonly excerpt: string;
  readonly image: string;
  readonly title: string;
}

export const navigationItems = [
  "Home",
  "Destinations",
  "Tours",
  "Hotels",
  "Blog",
  "Contact",
] as const;

export const heroImage =
  "https://lh3.googleusercontent.com/aida-public/AB6AXuCg0tkFvUSRvjjSmOt_subHDKhJnyXcL3rlIfQE3Jb5M_r5QYZLt7YYVGblQ7SEn7DyHzD4lbE6dP-rLtymSWNVTb0BpjBaHzyBqDsgcK-23bpxaciOe89sOtBNSKUn8lvUDT0keX8HCxGIi5aDbQ6b--KeiIEO92PDpg-4lohkr4kdYn1MW_cz2p-zxMbsbB2rGLdjzfEf0S4Oa_d2I-vbwJoUtJ380bcKXWIVhiBfVp113dBGZJGald2rtFVCwcGcFuIxB1KSxG94";

export const visualDiaryItems: readonly VisualDiaryItem[] = [
  {
    alt: "Luxurious infinity pool overlooking tropical jungle in Bali at sunset",
    country: "Indonesia",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuCXt_uOk39Ti37dURaaAO9Gv1kYVRVrW8XysehQZYZ-kt8ZIZ2bwtsNbCd8AQ10u4z3Ws-ygeCNJUv5Gop1UT63u6X8MxMOwsc3rhdMRY3tsgjeEe7qMzcd2149-FycyLeFDO7xpx9kcEWk2_fS8DKpX_9kDbN7JeuBgbv1G_I2vQxg6YBjFVxc2nyFZne7rAd3m-oBrS93hnfaOSPn5-SrDsWnmzW4Kbf9FhEm3BsIhBf9ZX3-3YD5FUAC77BSp5tPXQZqXBkT11Kv",
    title: "Ubud Sanctuary",
  },
  {
    alt: "Sunset over Santorini caldera with white domed buildings",
    country: "Greece",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuBPOgbPq_XwQHxqcdV8CyyHHmuASmYTCmNh8iC7Qa31o9m88sCugttUqmVEJ9bS5RPzElQEn3SYK-jK_z3ZTIrVazznHG0pefnGU_WXvkW-iVA_-PFDRH_IKzie9_WL8XUqXMxcvGZ2MQlUIH04iFzpzi0-Dw9h8BagV-0zsnmNHMyzCNzFKofG6m8Jgt1H4eP9Kmlfbm3tlEv7MKPMhepN0PChYlQh5bYZy_lqG6VpCO0OfdJSwkDnmnv66dBHDhuW2r9OkGCMoo0l",
    title: "Oia Heights",
    wide: true,
  },
  {
    alt: "Orange torii gates at Fushimi Inari shrine in Kyoto",
    country: "Japan",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuAF4vsCxEPUT55N-RY2qaIvB_vfZFOivZwZ9iOvf16bFRt0ntzY8S9f8SN1Y69IGH9UEwQJJ4z-s409ytBeuTtHET1tRKmmZZ7purJkx80yYpcbQu-HMrFGCLFQrH9MmxYVPtwbNMaGNC0pX5pHQFf6Pf20qr-d6DU5b8mbJ09TwyrMdeGgJK7i0ug1bPf7MuX84yyLKpMlihdxXp-Rx3Wny5jGquG2LmnAUEA0Xk-SSmox9ULLpYVMrzC7tbttWUuf-vk8cdjTvwoC",
    title: "Kyoto Rituals",
  },
  {
    alt: "Snow-capped alpine mountains reflecting in a turquoise lake",
    country: "Switzerland",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuDmQGXS04u9LQQr8k62J4bbs5yRMtU1_3unbCZXTbhnDlAJZd6PTnWl9ObnEBg_XeHpk1EW78JTlcFrpgc03E6GF_GD30D8cTau7EFb48AKzznjX8M3MAwWIJrOGch91X09_JxAecQVTs0keSp11X99OraPR_Nmvc-aV-NT4PPebtaG5J9v2tIMaM5eCrLoVdStV6ZMQr2G8xdbmvLDtw1ByehwABdtCZGgp9ceBVrFy-U-3crNf73iAB6_pRpzvDuMxU397e3baeGv",
    title: "Alpine Silence",
    wide: true,
  },
] as const;

export const destinationCards: readonly DestinationCard[] = [
  {
    alt: "Norwegian fjords with deep blue water and dramatic mountain peaks",
    description:
      "Sail through cinematic cliffs and quiet coastal villages shaped by ancient glacial landscapes.",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuCg4Pc4Hz2ckphmn1PXS-ra4wYOkUqi7PMGWKx61d5rMwLWxEwWY9yD9IAF7y6ED_dd3XsvuYHLJpjONv34C5d-NT7TZNwMJ3GE2UEGHGQosEdJI1MXtNKDRueIJXq0fSBHje9meDPhmJuiXmHKGqBBLuE93xjrlgt64-QMJgo8xyI1ZlOPUNmSQ95M1p-VknE5zyYismU3NeJlov_lokR9yBG_xV_ioAQIrI3-iCN6Zs7bY0PzXTqJb2qkYxvPYK24z3G9ZP2hIvls",
    price: "$1,200",
    rating: "4.9",
    title: "Nordic Fjords",
  },
  {
    alt: "Big Ben and Westminster Bridge in London at dusk",
    description:
      "Discover the perfect blend of historic architecture and cutting-edge modern culture.",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuCIBL4yRfAkIWlPfBg6EEXIpLsxANGUc4HpdqvjcNLWLR0lbcucB_In7Pae-G1W_plTCRD_6zPSFdgBo5pyaSvUqSkvbeJ3g8zcr_OdCdwHnL7fVZOkJ3Gmu4KisipjrzsOfWFy8oUkLpAYP9TA7AxZrfRVQVasOVWebBj5tS3v2iW24WaImU46qVZPgKWuBOzvOkPUYdMdEwGWodlbYLlSKUBynxUkh4nMkwc5A1eTBOHm7nme0BufNc858zAwcmU5kw0sEEJohfGq",
    price: "$850",
    rating: "4.7",
    title: "London Essence",
  },
  {
    alt: "Medieval German town with half-timbered houses",
    description:
      "Wander through fairy-tale villages and explore the majestic castles of the Black Forest.",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuDiPv71cX-SLFEC50j5ADgesaGwtxXoy8-nT-4_OE9DE3MyblA4EmKN-pbYDYqd_zAlunErJEyN7zjXebxA8PdMGtsJeJMYwJaG-TwPKOUprlw7k4n5F6Y7P2mV2eisvlduz5KufDqUoQrUdB-QBXWkkJqFqYT-770OyBNIL4Ow2iRHEG2p7Kaxv78AkbJ2UwynnS1fcSIPcWFb4Fe7gTRF0UBPlvETC_US-Jyt_AR5HEnvAK7DYhRnXtnPuoKlxKaLakZnYYAUgrIP",
    price: "$1,100",
    rating: "4.8",
    title: "Bavarian Trails",
  },
] as const;

export const suggestionCards: readonly SuggestionCard[] = [
  {
    alt: "Minimalist modern villa with an infinity pool overlooking a vineyard",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuBkw-TrvS0JWahNeSAf6KTALx0u6Rrbegt31EcXVvHFPieRtl6V4vkxzCrPVPfr-uJdef8bDhsPQAAsmrOKPN9nEp--h-3RKSZMaaeTWeFJzHXxc4DPvu-TlMqNBuiRiokaMn9oaDpjZZzrHR6WPPDcbtqdvXYHqBg-F3i1A7EDk3LIaTBVWdOZbuJBOzyVc0R1lTwiIAbcshvds1h4fCvFvUkca_rU4umBUWHDPVZE5EiQiAmBGQ5ugcAhWYgdja275XacPDgfxQwp",
    location: "Tuscany, Italy",
    price: "$450/nt",
    title: "The Glass House Villa",
  },
  {
    alt: "Luxury eco-resort in a dense tropical forest",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuCJobfkEYOAXGvJu_F0oRnLZJYZqLgRyDtVQraRwbpXsYOD5-tqPyPvIJk2mWwD4xlXvXdkoo8is-cGJwMsh3yrolNyZzeaHMbCUG5xWbTgcoYDvJTWZef4SCZ7UsrIKqYOtIlpZmYrrkNUhs4cfvCMOL7A-8oS_1VVJFuK_oY0FEo2E1p-1BvGOxF_j6DVYSRIMefSEWYhAjNOm0xvaarbJVsFa1-IzSBLv6VCSX5FYjc3xVWr-ciGCsNDiyU1_brubeMTUevO81il",
    location: "Maldives",
    price: "$890/nt",
    title: "Azure Bay Resort",
  },
  {
    alt: "Luxury yacht sailing through turquoise Mediterranean waters",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuCLmxLbLp9No_ehZTLqY_5nrYVKNIbcsUFHvN1FUo4YsJpn4BuuGJVhtps750yfqY0ciORlKhhjKeysB7j1foXXHbxTcx_PeW_5m9u1ySIFMK6p2ojBfOuA_MafNjfnBvrxt6EnTjL2Ye8cvhRyGcR2A63G11F2mFesiN8VJBVmtoJBbO6frIhbmgoYzVauyaM_E2Ao0ddeJNjoHKJo_dp0Jz9bLx-MQ6v4Fq5IkxCZytnAhLyEpl6qbVWn4PDbqzyWrKsz-Vd9c_wB",
    location: "Monaco",
    price: "$2,500/day",
    title: "Private Yacht Charter",
  },
  {
    alt: "Adventurer sitting by a campfire under a starry desert sky",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuAn4NNneXeR47MVW6PYI_VVfrTIRc_zR52zyEoO7o-N5KG1K-1-dADaAwpuQepsbr31DuwHTETK-I_sComrcw3U-HPGSaH1_waCYeKnBD9YzvVH3uqI0WjXh4jDAWGGWnxysrpJvdgg96a3B7QggLy9-MvRJMIRvy1BFXseWdOHm_e-w5lptHzoL_wqECmJiAfew5JU4IXbUSeTg5bdzg4ikqDTxU3CxDuwlm0d1Iom-PqGJDcEOhmIkpJoFGUrTnzUR8qPSf4nnPHX",
    location: "Wadi Rum, Jordan",
    price: "$120/xp",
    title: "Desert Stargazing",
  },
] as const;

export const blogPosts: readonly BlogPost[] = [
  {
    category: "Slow Travel",
    excerpt:
      "A deep dive into the quiet neighborhoods that define the soul of the world's most vibrant metropolis.",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuDtt0oAPt9XMzwKJnSHhK7PcgWbJfRDVqVk6mjPhH2rCG8YpEX5SxQZC2R2T9bT-9mHvJWNQyynnK1QHcLJte8qLPLK2KbdMzQ11gzUG4IMy6eq0KGl_CbjVXUL6X3W7Vts1TseBCB6Co3h4Nf0pcKM0FNJX4RO6JOxQVCkqjunkrHRZCEwn44IYcIgtSk0KLeM8AJZEINdMWVxoRfVwTR_4XlnUvI7uoHZp5IJlMR7mR9byLrRP4_uZhkpYNZnW1JIqzgeg1M1MdlM",
    title: "The Art of Getting Lost in Tokyo",
  },
  {
    category: "Adventure",
    excerpt:
      "Why the Italian Alps remain the ultimate sanctuary for those seeking silence and scale.",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuAeDwT8WT54Ej4puGch3RH38le1A7QZqNXe2UEHzVendx3EpQxBDW1q35Qepftc_SXwGdx9hT-jPNNBZMpyr_LFwCnb1g2AJckK7bsd1esGEU3RDpDJEycIL3dJsDW4iFvDeZomGQ9OBkG5Wnifbax-UnHnkgfea7lXl_C0tCIuX6ZQxwb0CpiRCBDfpxRPw8XcJBe1WG8pr0jplWz1bNOKgkIODiro7FbuZxyGK-SfY3E6ENOb2OzVUYtuXoXY1Gk55OrvTEpw9NPQ",
    title: "Dolomites: A Vertical Symphony",
  },
  {
    category: "Lifestyle",
    excerpt:
      "Our curated list of hidden culinary gems where locals go to escape the tourist crowds.",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuAOG1GqkAafE8BPlrfHvv_BNKHOGgQCF45XIqo08tfmbX3XEv43HnGBVNOYzbHin8voUJMmbAzNAVSXB5Yyw0QJ9ooQBR28QnH-l6PpoNCCVnP1E4wG4a6OhBUhiF9UaEdON6PZpFXxOsM5vno4-_VkJ5mimmWf6QLtRaYMK210umzVOVXyu1P6k1m5uG8sZHuRqc_7FZlmMv1eOp7YjlRA-miXbRIXJAGmxWub8X3OJy-8_JX0cvDXdlZavvHfwXj1RokPilnI5IkG",
    title: "The Best Parisian Bistros of 2024",
  },
] as const;
