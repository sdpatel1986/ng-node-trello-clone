export interface BOARD {
    link: string;
    title: string;
    subject: string;
}

interface CARDCONTENT {
    title: string;
    index: number;
    items: string[];
}

export interface BOARDCONTENT {
    cards: CARDCONTENT[];
}
export interface BOARDSCONTENT {
    [hashofboard: string]: BOARDCONTENT;
}

export interface USERTYPE {
    login: string;
    password: string;
}

