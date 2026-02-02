import { Injectable } from '@angular/core';
import { astro } from 'iztro';

// ============================================
// INTERFACES
// ============================================

export interface TuViInput {
    fullName: string;
    gender: 'male' | 'female';
    birthDate: Date;
    birthTime: string;
}

export interface StarInfo {
    name: string;
    type: 'major' | 'minor' | 'adjective' | 'changsheng' | 'boshi' | 'jiangqian' | 'suiqian';
    brightness?: string;
    brightnessShort?: string; // M/V/Đ/L/B/H
    mutagen?: string;
    mutagenShort?: string; // 祿/權/科/忌
}

export interface DecadalInfo {
    range: [number, number]; // [start age, end age]
    heavenlyStem: string;
    earthlyBranch: string;
}

export interface Palace {
    index: number;
    name: string;
    nameVi: string;
    heavenlyStem: string;
    earthlyBranch: string;
    majorStars: StarInfo[];
    minorStars: StarInfo[];
    adjectiveStars: StarInfo[];
    changsheng12: string;
    boshi12: string;
    jiangqian12: string;
    suiqian12: string;
    decadal: DecadalInfo;
    ages: number[];
    isBodyPalace: boolean;
    isOriginalPalace: boolean;
}

export interface HoroscopePosition {
    name: string;
    index: number;
    heavenlyStem: string;
    earthlyBranch: string;
    mutagen: string[];
}

export interface TuViChart {
    // Basic info
    fullName: string;
    gender: string;
    solarDate: string;
    lunarDate: string;
    chineseDate: string;
    time: string;
    timeRange: string;

    // Zodiac info
    zodiacSign: string;
    sign: string;
    heavenlyStemOfSoul: string;
    earthlyBranchOfSoul: string;
    earthlyBranchOfBody: string;
    fiveElement: string;

    // Soul and Body stars
    soulStar: string;
    bodyStar: string;

    // Palaces (12 cung)
    palaces: Palace[];

    // Current horoscope (based on viewing year)
    horoscope?: {
        decadal: HoroscopePosition;
        age: HoroscopePosition & { nominalAge: number };
        yearly: HoroscopePosition;
        monthly: HoroscopePosition;
        daily: HoroscopePosition;
    };

    // Tuần và Triệt positions
    tuanTriet?: {
        tuan: string[]; // 2 cung bị Tuần
        triet: string[]; // 2 cung bị Triệt
    };

    // Raw astrolabe for advanced usage
    rawAstrolabe: any;
}

// ============================================
// MAPPINGS
// ============================================

const PALACE_NAMES_VI: Record<string, string> = {
    '命宫': 'Mệnh',
    '兄弟': 'Huynh Đệ',
    '夫妻': 'Phu Thê',
    '子女': 'Tử Nữ',
    '财帛': 'Tài Bạch',
    '疾厄': 'Tật Ách',
    '迁移': 'Thiên Di',
    '仆役': 'Nô Bộc',
    '官禄': 'Quan Lộc',
    '田宅': 'Điền Trạch',
    '福德': 'Phúc Đức',
    '父母': 'Phụ Mẫu',
};

const EARTHLY_BRANCH_VI: Record<string, string> = {
    '子': 'Tý', '丑': 'Sửu', '寅': 'Dần', '卯': 'Mão',
    '辰': 'Thìn', '巳': 'Tỵ', '午': 'Ngọ', '未': 'Mùi',
    '申': 'Thân', '酉': 'Dậu', '戌': 'Tuất', '亥': 'Hợi',
};

const HEAVENLY_STEM_VI: Record<string, string> = {
    '甲': 'Giáp', '乙': 'Ất', '丙': 'Bính', '丁': 'Đinh',
    '戊': 'Mậu', '己': 'Kỷ', '庚': 'Canh', '辛': 'Tân',
    '壬': 'Nhâm', '癸': 'Quý',
};

// Brightness: 廟/旺/得/平/陷 → M/V/Đ/B/H (5 levels in traditional Tu Vi)
// Note: iztro uses 'Hạn' instead of 'Hãm'
const BRIGHTNESS_SHORT: Record<string, string> = {
    '廟': 'M', '旺': 'V', '得': 'Đ', '平': 'B', '陷': 'H',
    'Miếu': 'M', 'Vượng': 'V', 'Đắc': 'Đ', 'Bình': 'B', 'Hãm': 'H', 'Hạn': 'H',
};

// Mutagen: 祿/權/科/忌
const MUTAGEN_SHORT: Record<string, string> = {
    '禄': '祿', '权': '權', '科': '科', '忌': '忌',
    '祿': '祿', '權': '權',
    'Lộc': '祿', 'Quyền': '權', 'Khoa': '科', 'Kỵ': '忌',
};

const ZODIAC_VI: Record<string, string> = {
    '鼠': 'Tý (Chuột)', '牛': 'Sửu (Trâu)', '虎': 'Dần (Hổ)', '兔': 'Mão (Mèo)',
    '龙': 'Thìn (Rồng)', '蛇': 'Tỵ (Rắn)', '马': 'Ngọ (Ngựa)', '羊': 'Mùi (Dê)',
    '猴': 'Thân (Khỉ)', '鸡': 'Dậu (Gà)', '狗': 'Tuất (Chó)', '猪': 'Hợi (Lợn)',
};

function getHourIndex(birthTime: string): number {
    const timeMap: Record<string, number> = {
        '23:00-01:00': 0, '01:00-03:00': 1, '03:00-05:00': 2, '05:00-07:00': 3,
        '07:00-09:00': 4, '09:00-11:00': 5, '11:00-13:00': 6, '13:00-15:00': 7,
        '15:00-17:00': 8, '17:00-19:00': 9, '19:00-21:00': 10, '21:00-23:00': 11,
    };
    return timeMap[birthTime] ?? 0;
}

function extractStarInfo(star: any, type: StarInfo['type']): StarInfo {
    if (typeof star === 'string') {
        return { name: star, type };
    }

    const brightness = star?.brightness || '';
    const mutagen = star?.mutagen || '';

    return {
        name: star?.name || '',
        type,
        brightness,
        brightnessShort: BRIGHTNESS_SHORT[brightness] || '',
        mutagen,
        mutagenShort: MUTAGEN_SHORT[mutagen] || '',
    };
}

// ============================================
// SERVICE
// ============================================

@Injectable({
    providedIn: 'root'
})
export class TuViService {

    generateChart(input: TuViInput): TuViChart {
        const birthDate = new Date(input.birthDate);
        const dateString = this.formatDateString(birthDate);
        const hourIndex = getHourIndex(input.birthTime);
        const isMale = input.gender === 'male';

        // Generate astrolabe using iztro
        const astrolabe = astro.bySolar(
            dateString,
            hourIndex,
            isMale ? 'male' : 'female',
            true,
            'vi-VN'
        );

        console.log('Astrolabe generated:', astrolabe);

        // Extract palaces with full data
        const palaces = this.extractPalaces(astrolabe);

        // Get horoscope for current year
        const currentYear = new Date().getFullYear();
        const horoscope = this.extractHoroscope(astrolabe, currentYear);

        const chart: TuViChart = {
            fullName: input.fullName,
            gender: isMale ? 'Nam' : 'Nữ',
            solarDate: this.formatDisplayDate(birthDate),
            lunarDate: this.formatLunarDateVi(astrolabe.lunarDate || ''),
            chineseDate: astrolabe.chineseDate || '',
            time: astrolabe.time || '',
            timeRange: astrolabe.timeRange || '',

            zodiacSign: ZODIAC_VI[astrolabe.sign] || astrolabe.zodiac || astrolabe.sign || '',
            sign: astrolabe.sign || '',
            heavenlyStemOfSoul: astrolabe.earthlyBranchOfSoulPalace || '',
            earthlyBranchOfSoul: astrolabe.earthlyBranchOfSoulPalace || '',
            earthlyBranchOfBody: astrolabe.earthlyBranchOfBodyPalace || '',
            fiveElement: astrolabe.fiveElementsClass || '',

            soulStar: astrolabe.soul || '',
            bodyStar: astrolabe.body || '',

            palaces,
            horoscope,
            tuanTriet: this.calculateTuanTriet(astrolabe.chineseDate?.split(' ')?.[0] || ''),
            rawAstrolabe: astrolabe,
        };

        return chart;
    }

    /**
     * Get horoscope for a specific year
     */
    getHoroscope(astrolabe: any, year: number) {
        return this.extractHoroscope(astrolabe, year);
    }

    private extractPalaces(astrolabe: any): Palace[] {
        const rawPalaces = astrolabe.palaces || [];

        return rawPalaces.map((palace: any, index: number) => {
            const palaceName = palace?.name || '';

            // Extract all star types with brightness/mutagen
            const majorStars = (palace?.majorStars || []).map((s: any) => extractStarInfo(s, 'major'));
            const minorStars = (palace?.minorStars || []).map((s: any) => extractStarInfo(s, 'minor'));
            const adjectiveStars = (palace?.adjectiveStars || []).map((s: any) => extractStarInfo(s, 'adjective'));

            // Extract decadal info
            const decadal: DecadalInfo = {
                range: palace?.decadal?.range || [0, 0],
                heavenlyStem: palace?.decadal?.heavenlyStem || '',
                earthlyBranch: palace?.decadal?.earthlyBranch || '',
            };

            return {
                index,
                name: palaceName,
                nameVi: PALACE_NAMES_VI[palaceName] || palaceName,
                heavenlyStem: palace?.heavenlyStem || '',
                earthlyBranch: palace?.earthlyBranch || '',
                majorStars,
                minorStars,
                adjectiveStars,
                changsheng12: palace?.changsheng12 || '',
                boshi12: palace?.boshi12 || '',
                jiangqian12: palace?.jiangqian12 || '',
                suiqian12: palace?.suiqian12 || '',
                decadal,
                ages: palace?.ages || [],
                isBodyPalace: palace?.isBodyPalace || false,
                isOriginalPalace: palace?.isOriginalPalace || false,
            };
        });
    }

    private extractHoroscope(astrolabe: any, year: number): TuViChart['horoscope'] {
        try {
            const horoscope = astrolabe.horoscope(`${year}-1-1`);
            if (!horoscope) return undefined;

            return {
                decadal: {
                    name: horoscope.decadal?.name || '',
                    index: horoscope.decadal?.index ?? -1,
                    heavenlyStem: horoscope.decadal?.heavenlyStem || '',
                    earthlyBranch: horoscope.decadal?.earthlyBranch || '',
                    mutagen: horoscope.decadal?.mutagen || [],
                },
                age: {
                    name: horoscope.age?.name || '',
                    index: horoscope.age?.index ?? -1,
                    heavenlyStem: horoscope.age?.heavenlyStem || '',
                    earthlyBranch: horoscope.age?.earthlyBranch || '',
                    mutagen: horoscope.age?.mutagen || [],
                    nominalAge: horoscope.age?.nominalAge || 0,
                },
                yearly: {
                    name: horoscope.yearly?.name || '',
                    index: horoscope.yearly?.index ?? -1,
                    heavenlyStem: horoscope.yearly?.heavenlyStem || '',
                    earthlyBranch: horoscope.yearly?.earthlyBranch || '',
                    mutagen: horoscope.yearly?.mutagen || [],
                },
                monthly: {
                    name: horoscope.monthly?.name || '',
                    index: horoscope.monthly?.index ?? -1,
                    heavenlyStem: horoscope.monthly?.heavenlyStem || '',
                    earthlyBranch: horoscope.monthly?.earthlyBranch || '',
                    mutagen: horoscope.monthly?.mutagen || [],
                },
                daily: {
                    name: horoscope.daily?.name || '',
                    index: horoscope.daily?.index ?? -1,
                    heavenlyStem: horoscope.daily?.heavenlyStem || '',
                    earthlyBranch: horoscope.daily?.earthlyBranch || '',
                    mutagen: horoscope.daily?.mutagen || [],
                },
            };
        } catch (e) {
            console.error('Error extracting horoscope:', e);
            return undefined;
        }
    }

    private formatDateString(date: Date): string {
        const year = date.getFullYear();
        const month = date.getMonth() + 1;
        const day = date.getDate();
        return `${year}-${month}-${day}`;
    }

    private formatDisplayDate(date: Date): string {
        const day = date.getDate().toString().padStart(2, '0');
        const month = (date.getMonth() + 1).toString().padStart(2, '0');
        const year = date.getFullYear();
        return `${day}/${month}/${year}`;
    }

    // Convert Chinese lunar date to Vietnamese
    private formatLunarDateVi(chineseLunarDate: string): string {
        const numMap: Record<string, string> = {
            '〇': '0', '一': '1', '二': '2', '三': '3', '四': '4',
            '五': '5', '六': '6', '七': '7', '八': '8', '九': '9',
            '十': '10', '廿': '20', '卅': '30',
        };
        const monthMap: Record<string, string> = {
            '正': '1', '一': '1', '二': '2', '三': '3', '四': '4', '五': '5', '六': '6',
            '七': '7', '八': '8', '九': '9', '十': '10', '冬': '11', '腊': '12',
        };

        // Parse year: 一九九〇年 -> 1990
        const yearMatch = chineseLunarDate.match(/([〇一二三四五六七八九]+)年/);
        const monthMatch = chineseLunarDate.match(/年([正一二三四五六七八九十冬腊]+)月/);
        const dayMatch = chineseLunarDate.match(/月(.+)$/);

        let year = '';
        if (yearMatch) {
            year = yearMatch[1].split('').map(c => numMap[c] || c).join('');
        }

        let month = '';
        if (monthMatch) {
            const m = monthMatch[1];
            if (m === '十') month = '10';
            else if (m === '十一') month = '11';
            else if (m === '十二') month = '12';
            else month = monthMap[m] || m;
        }

        let day = '';
        if (dayMatch) {
            const d = dayMatch[1];
            if (d.startsWith('初')) {
                // 初一 -> 1, 初十 -> 10
                const rest = d.slice(1);
                if (rest === '十') day = '10';
                else day = numMap[rest] || rest;
            } else if (d.startsWith('廿')) {
                const rest = d.slice(1);
                if (!rest) day = '20';
                else day = (20 + parseInt(numMap[rest] || '0', 10)).toString();
            } else if (d.startsWith('卅')) {
                const rest = d.slice(1);
                if (!rest) day = '30';
                else day = (30 + parseInt(numMap[rest] || '0', 10)).toString();
            } else if (d === '十') {
                day = '10';
            } else {
                day = numMap[d] || d;
            }
        }

        return `Ngày ${day} tháng ${month} năm ${year}`;
    }

    // Calculate Tuần and Triệt based on year's heavenly stem
    // Tuần: empty spaces in 60 Jiazi cycle
    // Triệt: cutting positions based on year stem
    calculateTuanTriet(yearStem: string): { tuan: string[], triet: string[] } {
        const EARTHLY_BRANCHES = ['Tý', 'Sửu', 'Dần', 'Mão', 'Thìn', 'Tỵ', 'Ngọ', 'Mùi', 'Thân', 'Dậu', 'Tuất', 'Hợi'];

        // Tuần (Không Vong) - based on Can Chi cycle
        // Giáp-Kỷ: Tuất-Hợi, Ất-Canh: Thân-Dậu, Bính-Tân: Ngọ-Mùi, Đinh-Nhâm: Thìn-Tỵ, Mậu-Quý: Dần-Mão
        const TUAN_MAP: Record<string, string[]> = {
            '甲': ['Tuất', 'Hợi'], 'Giáp': ['Tuất', 'Hợi'],
            '己': ['Tuất', 'Hợi'], 'Kỷ': ['Tuất', 'Hợi'],
            '乙': ['Thân', 'Dậu'], 'Ất': ['Thân', 'Dậu'],
            '庚': ['Thân', 'Dậu'], 'Canh': ['Thân', 'Dậu'],
            '丙': ['Ngọ', 'Mùi'], 'Bính': ['Ngọ', 'Mùi'],
            '辛': ['Ngọ', 'Mùi'], 'Tân': ['Ngọ', 'Mùi'],
            '丁': ['Thìn', 'Tỵ'], 'Đinh': ['Thìn', 'Tỵ'],
            '壬': ['Thìn', 'Tỵ'], 'Nhâm': ['Thìn', 'Tỵ'],
            '戊': ['Dần', 'Mão'], 'Mậu': ['Dần', 'Mão'],
            '癸': ['Dần', 'Mão'], 'Quý': ['Dần', 'Mão'],
        };

        // Triệt (截路) - based on year stem
        // Giáp-Ất: Thân-Dậu, Bính-Đinh: Tuất-Hợi, Mậu-Kỷ: Tý-Sửu, Canh-Tân: Dần-Mão, Nhâm-Quý: Thìn-Tỵ
        const TRIET_MAP: Record<string, string[]> = {
            '甲': ['Thân', 'Dậu'], 'Giáp': ['Thân', 'Dậu'],
            '乙': ['Thân', 'Dậu'], 'Ất': ['Thân', 'Dậu'],
            '丙': ['Tuất', 'Hợi'], 'Bính': ['Tuất', 'Hợi'],
            '丁': ['Tuất', 'Hợi'], 'Đinh': ['Tuất', 'Hợi'],
            '戊': ['Tý', 'Sửu'], 'Mậu': ['Tý', 'Sửu'],
            '己': ['Tý', 'Sửu'], 'Kỷ': ['Tý', 'Sửu'],
            '庚': ['Dần', 'Mão'], 'Canh': ['Dần', 'Mão'],
            '辛': ['Dần', 'Mão'], 'Tân': ['Dần', 'Mão'],
            '壬': ['Thìn', 'Tỵ'], 'Nhâm': ['Thìn', 'Tỵ'],
            '癸': ['Thìn', 'Tỵ'], 'Quý': ['Thìn', 'Tỵ'],
        };

        return {
            tuan: TUAN_MAP[yearStem] || [],
            triet: TRIET_MAP[yearStem] || [],
        };
    }
}
