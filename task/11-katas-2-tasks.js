'use strict';

/**
 * Возвращает номер банковского счета, распаршеный из предоставленной строки.
 *
 * Вы работаете в банке, который недавно приобрел аппарат, помогающий в чтении писем и факсов, отправленных филиалами.
 * Аппарат сканирует бумажный документ и генерирует строку с банковсчким счетом, который выглядит следующим образом:
 *
 *    _  _     _  _  _  _  _
 *  | _| _||_||_ |_   ||_||_|
 *  ||_  _|  | _||_|  ||_| _|
 *
 * Каждая строка содержит номер счета, записанный с помощью '|' и '_'.
 * Каждый счет должен иметь 9 цифр в диапазоне от 0 до 9.
 *
 * Ваша задача -- написать функцию, которая будет принимать номер счета строкой, как описано выше, и парсить ее в обычные числа.
 *
 * @param {string} bankAccount
 * @return {number}
 *
 * Example of return :
 *
 *   '    _  _     _  _  _  _  _ \n'+
 *   '  | _| _||_||_ |_   ||_||_|\n'+     =>  123456789
 *   '  ||_  _|  | _||_|  ||_| _|\n'
 *
 *   ' _  _  _  _  _  _  _  _  _ \n'+
 *   '| | _| _|| ||_ |_   ||_||_|\n'+     => 23056789
 *   '|_||_  _||_| _||_|  ||_| _|\n',
 *
 *   ' _  _  _  _  _  _  _  _  _ \n'+
 *   '|_| _| _||_||_ |_ |_||_||_|\n'+     => 823856989
 *   '|_||_  _||_| _||_| _||_| _|\n',
 *
 */
function parseBankAccount(bankAccount) {
    let result = '';
    let arr = bankAccount.split('\n');
    let pattern = RegExp("(.{3})");
    arr = arr.map(element => element.split(pattern));

    for (let i = 0; i < arr[0].length; i++) {

        if (arr[0][i] === '   ' && arr[1][i] === '  |') result += 1;
        if (arr[2][i] === '|_ ') result += 2;
        if (arr[1][i] === ' _|' && arr[2][i] === ' _|') result += 3;
        if (arr[0][i] === '   ' && arr[1][i] === '|_|') result += 4;
        if (arr[1][i] === '|_ ' && arr[2][i] === ' _|') result += 5;
        if (arr[1][i] === '|_ ' && arr[2][i] === '|_|') result += 6;
        if (arr[0][i] === ' _ ' && arr[2][i] === '  |') result += 7;
        if (arr[1][i] === '|_|' && arr[2][i] === '|_|') result += 8;
        if (arr[1][i] === '|_|' && arr[2][i] === ' _|') result += 9;
        if (arr[1][i] === '| |' && arr[2][i] === '|_|') result += 0;
    }
    return result;
}


/**
 * Возвращает строку, в которой будут вставлены переносы строки в правильных местах. Каждая часть до переноса строки должна быть не больше, чем переданное в функцию число.
 * Строка может быть перенесена только по границе слов.
 *
 * @param {string} text
 * @param {number} columns
 * @return {Iterable.<string>}
 *
 * @example :
 *
 *  'The String global object is a constructor for strings, or a sequence of characters.', 26 =>  'The String global object',
 *                                                                                                'is a constructor for',
 *                                                                                                'strings, or a sequence of',
 *                                                                                                'characters.'
 *
 *  'The String global object is a constructor for strings, or a sequence of characters.', 12 =>  'The String',
 *                                                                                                'global',
 *                                                                                                'object is a',
 *                                                                                                'constructor',
 *                                                                                                'for strings,',
 *                                                                                                'or a',
 *                                                                                                'sequence of',
 *                                                                                                'characters.'
 */
function* wrapText(text, columns) {
    let result = '';
    if (text.length < columns) return yield text;

    while (text) {
        let edge = text.slice(0, columns + 1).lastIndexOf(' ');
        if (edge > 0) {
            result = text.slice(0, edge);
            yield result.trim();
            text = text.slice(edge).trim();
        } else return yield text;
    }
}


/**
 * Возвращает ранг заданной покерной комбинации.
 * Ранги смотрите тут: https://en.wikipedia.org/wiki/List_of_poker_hands
 * https://ru.wikipedia.org/wiki/%D0%9F%D0%BE%D0%BA%D0%B5%D1%80
 *
 * @param {array} hand
 * @return {PokerRank} rank
 *
 * @example
 *   [ '4♥','5♥','6♥','7♥','8♥' ] => PokerRank.StraightFlush
 *   [ 'A♠','4♠','3♠','5♠','2♠' ] => PokerRank.StraightFlush
 *   [ '4♣','4♦','4♥','4♠','10♥' ] => PokerRank.FourOfKind
 *   [ '4♣','4♦','5♦','5♠','5♥' ] => PokerRank.FullHouse
 *   [ '4♣','5♣','6♣','7♣','Q♣' ] => PokerRank.Flush
 *   [ '2♠','3♥','4♥','5♥','6♥' ] => PokerRank.Straight
 *   [ '2♥','4♦','5♥','A♦','3♠' ] => PokerRank.Straight
 *   [ '2♥','2♠','2♦','7♥','A♥' ] => PokerRank.ThreeOfKind
 *   [ '2♥','4♦','4♥','A♦','A♠' ] => PokerRank.TwoPairs
 *   [ '3♥','4♥','10♥','3♦','A♠' ] => PokerRank.OnePair
 *   [ 'A♥','K♥','Q♥','2♦','3♠' ] =>  PokerRank.HighCard
 */
const PokerRank = {
    StraightFlush: 8,
    FourOfKind: 7,
    FullHouse: 6,
    Flush: 5,
    Straight: 4,
    ThreeOfKind: 3,
    TwoPairs: 2,
    OnePair: 1,
    HighCard: 0
}

function getPokerHandRank(hand) {
    function IndexOfCardByValue(value) {return 'A234567891JQK'.indexOf(value.slice(0,1))}

    function indexOfSuit(value) {
        return '♣♦♥♠'.indexOf(value.slice(-1)) * 13;
    }

    function equalityComparison(num1, num2) {
        return cardIndex[num1]===cardIndex[num2];
    }

    function notEqualityСomparison(num1, num2) {
        return cardIndex[num1]!==cardIndex[num2];
    }

    function equalAndnotEqual(equalityComparison, notEqualityСomparison) {
        return equalityComparison && notEqualityСomparison;
    }

    function noName(value) {
        return value[4]-value[0]===4 && value[1]!==0
            || value[4]-value[1]===3 && value[0]===0 && value[1]===9;
    }

    var cardIndex = hand.map((element)=>{return IndexOfCardByValue(element)});
    var indexSuit = hand.map((element)=>{return indexOfSuit(element)});
    var IndexInDeck = hand.map((element)=>{return indexOfSuit(element) + IndexOfCardByValue(element)});

    cardIndex = cardIndex.sort((a, b)=>{return a - b});
    IndexInDeck = IndexInDeck.sort((a, b)=>{return a - b});
    indexSuit = indexSuit.sort((a, b)=>{return a - b});

    if (noName(IndexInDeck))return PokerRank.StraightFlush;
    if (equalAndnotEqual(equalityComparison(0, 3),notEqualityСomparison(0, 4))
        || equalAndnotEqual(equalityComparison(1, 4),notEqualityСomparison(0, 1))) return PokerRank.FourOfKind;
    if (equalAndnotEqual(equalityComparison(0, 2),notEqualityСomparison(0, 3)) && equalityComparison(3,4)
        || equalAndnotEqual(equalityComparison(2, 4),notEqualityСomparison(1, 2))) return PokerRank.FullHouse;
    if (indexSuit[0]=== indexSuit[4]) return PokerRank.Flush;
    if (noName(cardIndex)) return PokerRank.Straight;
    if (equalAndnotEqual(equalityComparison(0, 2),notEqualityСomparison(2, 3))
        || equalAndnotEqual(equalityComparison(2, 4),notEqualityСomparison(1, 2))
        || equalAndnotEqual(equalityComparison(1, 3),notEqualityСomparison(1, 0))) return PokerRank.ThreeOfKind;
    else{
        var obj = {};

        for (var i = 0; i < cardIndex.length; i++) {
            var str = cardIndex[i];
            obj[str] = true;
        }
        if (Object.keys(obj).length===3) return PokerRank.TwoPairs;
        if (Object.keys(obj).length===4) return PokerRank.OnePair;
    }
    return PokerRank.HighCard;
}


/**
 * Возвращает набор прямоугольников из заданной фигуры.
 * Фигура -- это многострочный набор ASCII символов из '-', '+', '|' и пробелов.
 * Ваша задача -- разбить фигуру на прямоугольники, из которых она составлена.
 *
 * К СВЕДЕНИЮ: Порядок прямоугольников не имеет значения.
 *
 * @param {string} figure
 * @return {Iterable.<string>} decomposition to basic parts
 * 
 * @example
 *
 *    '+------------+\n'+
 *    '|            |\n'+
 *    '|            |\n'+              '+------------+\n'+
 *    '|            |\n'+              '|            |\n'+         '+------+\n'+          '+-----+\n'+
 *    '+------+-----+\n'+       =>     '|            |\n'+     ,   '|      |\n'+     ,    '|     |\n'+
 *    '|      |     |\n'+              '|            |\n'+         '|      |\n'+          '|     |\n'+
 *    '|      |     |\n'               '+------------+\n'          '+------+\n'           '+-----+\n'
 *    '+------+-----+\n'
 *
 *
 *
 *    '   +-----+     \n'+
 *    '   |     |     \n'+                                    '+-------------+\n'+
 *    '+--+-----+----+\n'+              '+-----+\n'+          '|             |\n'+
 *    '|             |\n'+      =>      '|     |\n'+     ,    '|             |\n'+
 *    '|             |\n'+              '+-----+\n'           '+-------------+\n'
 *    '+-------------+\n'
 */
function* getFigureRectangles(figure) {
    var countStr = 0;
    var countCol = 0;
    var x=0;
    var y=0;
    var points = [];
    var matrix = figure.split('\n');

    function topLeftCornerOfRectangles() {
        return matrix[j][i] === '+'
            && matrix[j+1][i] !== ' '
            && matrix[j][i + 1] !== undefined
            && matrix[j + 1][i] !== undefined
            && matrix[j][i + 1] !== ' ';
    }

    for (var j = 0; j < matrix.length; j++) {
        for (var i = 0; i < matrix[0].length; i++) {
            if (matrix[j][i] === '+' && matrix[j + 1][i] === ' ' && matrix[j][i + 1] === undefined
                || matrix[j][i] === '+' && matrix[j + 1][i] === undefined && matrix[j][i + 1] === ' ') {
                points.push(j);
                points.push(i);
            }
        }
    }

    for (var j = 0; j < matrix.length; j++) {
        for (var i = 0; i < matrix[0].length; i++) {
            if (topLeftCornerOfRectangles(j, i)){
                x = i+1;
                y = j+1;
                countStr = 0;
                countCol = 0;
                if (j===points[0] && i===points[2] && matrix[points[3]][points[1]]===' ')continue;
                while (matrix[j+1][x]===' '){
                    x++;
                    countStr++;
                }
                while (matrix[y][i]!=='+'){
                    y++;
                    countCol++
                }
                yield `+${'-'.repeat(countStr)}+${`\n|${' '.repeat(countStr)}|`.repeat(countCol)}\n+${'-'.repeat(countStr)}+\n`
            }
        }
    }
}


module.exports = {
    parseBankAccount : parseBankAccount,
    wrapText: wrapText,
    PokerRank: PokerRank,
    getPokerHandRank: getPokerHandRank,
    getFigureRectangles: getFigureRectangles
};
