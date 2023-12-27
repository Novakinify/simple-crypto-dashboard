export interface CryptoMarket {
    symbol: string;
    price: number;
    fullName?: string;
    high: number;
    low: number;
    change24Hour: number;
    open24Hour: number;
    mktcap: number;
    imageUrl: string;
}

export interface CryptoCompareResponse {
    RAW: {
    [key: string]: {
        USD: {
        TYPE: string;
        MARKET: string;
        FROMSYMBOL: string;
        TOSYMBOL: string;
        FLAGS: string;
        LASTMARKET: string;
        MEDIAN: number;
        VOLUME24HOUR: number;
        VOLUME24HOURTO: number;
        LASTTRADEID: string;
        PRICE: number;
        LASTUPDATE: number;
        LASTVOLUME: number;
        LASTVOLUMETO: number;
        VOLUMEHOUR: number;
        VOLUMEHOURTO: number;
        OPENHOUR: number;
        HIGHHOUR: number;
        LOWHOUR: number;
        VOLUMEDAY: number;
        VOLUMEDAYTO: number;
        OPENDAY: number;
        HIGHDAY: number;
        LOWDAY: number;
        CHANGE24HOUR: number;
        CHANGEPCT24HOUR: number;
        CHANGEDAY: number;
        CHANGEPCTDAY: number;
        CHANGEHOUR: number;
        CHANGEPCTHOUR: number;
        CONVERSIONTYPE: string;
        CONVERSIONSYMBOL: string;
        SUPPLY: number;
        MKTCAP: number;
        MKTCAPPENALTY: number;
        CIRCULATINGSUPPLY: number;
        TOTALVOLUME24H: number;
        TOTALVOLUME24HTO: number;
        TOTALTOPTIERVOLUME24H: number;
        TOTALTOPTIERVOLUME24HTO: number;
        IMAGEURL: string;
        };
    };
    };
}