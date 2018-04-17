'use strict';

/**
 * Возвращает массив из 32 делений катушки компаса с названиями.
 * Смотрите детали здесь:
 * https://en.wikipedia.org/wiki/Points_of_the_compass#32_cardinal_points
 *
 * @return {array}
 *
 * Пример возвращаемого значения :
 *  [
 *     { abbreviation : 'N',     azimuth : 0.00 ,
 *     { abbreviation : 'NbE',   azimuth : 11.25 },
 *     { abbreviation : 'NNE',   azimuth : 22.50 },
 *       ...
 *     { abbreviation : 'NbW',   azimuth : 348.75 }
 *  ]
 */
function createCompassPoints() {
    var sides = ['N','E','S','W'];  // use array of cardinal directions only!
    let result = [];
    var dev1,
        dev,
        azim = 360,
        az,
        deg,
        count;

    for (var i = 0; i < 32; i++) {

        az = i * azim / 32;
        deg = az;

        count = 0;
        while (deg >= 90) {
            deg = deg - 90;
            count++;
        }

        if (count > 2) dev = sides[0];else dev = sides[count + 1];

        if (sides[count] === sides[0] || sides[count] === sides[2]) dev1 = sides[count] + dev;else dev1 = dev + sides[count];

        if (deg === 0) result.push({ abbreviation: sides[count], azimuth: az });
        if (deg === 11.25) result.push({ abbreviation: sides[count] + 'b' + dev, azimuth: az });
        if (deg === 22.5) result.push({ abbreviation: sides[count] + dev1, azimuth: az });
        if (deg === 33.75) result.push({ abbreviation: dev1 + 'b' + sides[count], azimuth: az });
        if (deg === 45) result.push({ abbreviation: dev1, azimuth: az });
        if (deg === 56.25) result.push({ abbreviation: dev1 + 'b' + dev, azimuth: az });
        if (deg === 67.5) result.push({ abbreviation: dev + dev1, azimuth: az });
        if (deg === 78.75) result.push({ abbreviation: dev + 'b' + sides[count], azimuth: az });
    }
    return result;
}


/**
 * Раскройте фигурные скобки указанной строки.
 * Смотрите https://en.wikipedia.org/wiki/Bash_(Unix_shell)#Brace_expansion
 *
 * Во входной строке пары фигурных скобок, содержащие разделенные запятыми подстроки,
 * представляют наборы подстрок, которые могут появиться в этой позиции на выходе.
 *
 * @param {string} str
 * @return {Iterable.<string>}
 *
 * К СВЕДЕНИЮ: Порядок выходных строк не имеет значения.
 *
 * Пример:
 *   '~/{Downloads,Pictures}/*.{jpg,gif,png}'  => '~/Downloads/*.jpg',
 *                                                '~/Downloads/*.gif'
 *                                                '~/Downloads/*.png',
 *                                                '~/Pictures/*.jpg',
 *                                                '~/Pictures/*.gif',
 *                                                '~/Pictures/*.png'
 *
 *   'It{{em,alic}iz,erat}e{d,}, please.'  => 'Itemized, please.',
 *                                            'Itemize, please.',
 *                                            'Italicized, please.',
 *                                            'Italicize, please.',
 *                                            'Iterated, please.',
 *                                            'Iterate, please.'
 *
 *   'thumbnail.{png,jp{e,}g}'  => 'thumbnail.png'
 *                                 'thumbnail.jpeg'
 *                                 'thumbnail.jpg'
 *
 *   'nothing to do' => 'nothing to do'
 */
function* expandBraces(str) {
    const OPEN_BR = '{';
    const CLOSE_BR = '}';
    const SEPARATOR = ',';

    yield* parse(str);

    function parse(str) {
        let items = [''];
        let pos = 0;
        while (str[pos]) {
            if (str[pos] !== OPEN_BR) {
                items = combine(items, [readUntil([OPEN_BR])]);
            } else {
                pos += 1;
                items = combine(items, parseExpr());
            }
        }
        return items;

        function parseExpr() {
            let items = [];
            let sepCount = 0;
            while (str[pos] !== CLOSE_BR) {
                if (str[pos] === SEPARATOR) {
                    pos += 1;
                    sepCount += 1;
                } else {
                    items = items.concat(parseExprPart());
                }
            }
            // handle empty alternative: {abc,}
            if (items.length < sepCount + 1) items.push('');
            pos += 1;
            return items;
        }

        function parseExprPart() {
            let items = [''];
            while (str[pos] !== SEPARATOR && str[pos] !== CLOSE_BR) {
                if (str[pos] !== OPEN_BR) {
                    items = combine(items, [readUntil([SEPARATOR, OPEN_BR, CLOSE_BR])]);
                } else {
                    pos += 1;
                    items = combine(items, parseExpr());
                }
            }
            return items;
        }

        function combine(leftItems, rightItems) {
            const res = [];
            for (let left of leftItems)
                for (let right of rightItems)
                    res.push(left + right);
            return res;
        }

        function readUntil(chars) {
            let res = '';
            while (str[pos] && chars.every(x => x !== str[pos])) {
                res += str[pos];
                pos += 1;
            }
            return res;
        }
    }
}


/**
 * Возвращает ZigZag матрицу
 *
 * Основная идея в алгоритме сжатия JPEG -- отсортировать коэффициенты заданного изображения зигзагом и закодировать их.
 * В этом задании вам нужно реализовать простой метод для создания квадратной ZigZag матрицы.
 * Детали смотрите здесь: https://en.wikipedia.org/wiki/JPEG#Entropy_coding
 * https://ru.wikipedia.org/wiki/JPEG
 * Отсортированные зигзагом элементы расположаться так: https://upload.wikimedia.org/wikipedia/commons/thumb/4/43/JPEG_ZigZag.svg/220px-JPEG_ZigZag.svg.png
 *
 * @param {number} n - размер матрицы
 * @return {array}  массив размером n x n с зигзагообразным путем
 *
 * @example
 *   1  => [[0]]
 *
 *   2  => [[ 0, 1 ],
 *          [ 2, 3 ]]
 *
 *         [[ 0, 1, 5 ],
 *   3  =>  [ 2, 4, 6 ],
 *          [ 3, 7, 8 ]]
 *
 *         [[ 0, 1, 5, 6 ],
 *   4 =>   [ 2, 4, 7,12 ],
 *          [ 3, 8,11,13 ],
 *          [ 9,10,14,15 ]]
 *
 */
function getZigZagMatrix(n) {
    let mtx = [];
    for (let i = 0; i < n; i++)
        mtx[i] = [];

    let i = 1, j = 1;
    for (let e = 0; e < n*n; e++) {
        mtx[i-1][j-1] = e;
        if ((i + j) % 2 == 0) {
            
            if (j < n) j ++;
            else       i += 2;
            if (i > 1) i --;
        } else {
            
            if (i < n) i ++;
            else       j += 2;
            if (j > 1) j --;
        }
    }
    return mtx;
}


/**
 * Возвращает true если заданный набор костяшек домино может быть расположен в ряд по правилам игры.
 * Детали игры домино смотрите тут: https://en.wikipedia.org/wiki/Dominoes
 * https://ru.wikipedia.org/wiki/%D0%94%D0%BE%D0%BC%D0%B8%D0%BD%D0%BE
 * Каждая костяшка представлена как массив [x,y] из значений на ней.
 * Например, набор [1, 1], [2, 2], [1, 2] может быть расположен в ряд ([1, 1] -> [1, 2] -> [2, 2]),
 * тогда как набор [1, 1], [0, 3], [1, 4] не может.
 * К СВЕДЕНИЮ: в домино любая пара [i, j] может быть перевернута и представлена как [j, i].
 *
 * @params {array} dominoes
 * @return {bool}
 *
 * @example
 *
 * [[0,1],  [1,1]] => true
 * [[1,1], [2,2], [1,5], [5,6], [6,3]] => false
 * [[1,3], [2,3], [1,4], [2,4], [1,5], [2,5]]  => true
 * [[0,0], [0,1], [1,1], [0,2], [1,2], [2,2], [0,3], [1,3], [2,3], [3,3]] => false
 *
 */
function canDominoesMakeRow(dominoes) {
    let result = dominoes.map(element => {
        return element[0] + element[1];
    }).reduce((pValue, cValue) => pValue + cValue);
    return result % 2 !== 0;
}


/**
 * Возвращает строковое представление заданного упорядоченного списка целых чисел.
 *
 * Строковое представление списка целых чисел будет состоять из элементов, разделенных запятыми. Элементами могут быть:
 *   - отдельное целое число
 *   - или диапазон целых чисел, заданный начальным числом, отделенным от конечного числа черточкой('-').
 *     (Диапазон включает все целые числа в интервале, включая начальное и конечное число)
 *     Синтаксис диапазона должен быть использован для любого диапазона, где больше двух чисел.
 *
 * @params {array} nums
 * @return {bool}
 *
 * @example
 *
 * [ 0, 1, 2, 3, 4, 5 ]   => '0-5'
 * [ 1, 4, 5 ]            => '1,4,5'
 * [ 0, 1, 2, 5, 7, 8, 9] => '0-2,5,7-9'
 * [ 1, 2, 4, 5]          => '1,2,4,5'
 */
function extractRanges(nums) {
    let result = '';
    for (let i = 0; i < nums.length - 1; i++) {
        let j = i;

        while (nums[j] === nums[j + 1] - 1) j++;

        if (nums[i] + 1 !== nums[i + 1] && i !== nums.length - 2)
            result += `${ nums[i] },`;
        else if (nums[i] + 1 === nums[i + 1] && nums[i] + 2 !== nums[i + 2])
            result += `${ nums[i] },${ nums[i + 1] },`;
        else
            result += `${ nums[i] }-${ nums[j] },`;
        i = j;
    }
    return result.slice(0, -1);
}

module.exports = {
    createCompassPoints : createCompassPoints,
    expandBraces : expandBraces,
    getZigZagMatrix : getZigZagMatrix,
    canDominoesMakeRow : canDominoesMakeRow,
    extractRanges : extractRanges
};
