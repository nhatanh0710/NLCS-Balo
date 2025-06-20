// solve.js
// =========
// Nhập đường dẫn tới ba hàm giải thuật đã tồn tại của bạn.
// Đổi lại path nếu chúng nằm ở file khác.

import { greedySolver } from './greedy-solver.js';          // hoặc './greedy.js'
import { dpSolver } from './dp-solver.js';              // hoặc './dp.js'
import { branchAndBoundSolver } from './branch-solver.js';          // hoặc './branch.js'

/**
 * Hàm duy nhất được trang input.js gọi.
 * @param {Object} input  - { items: Array, capacity: number, type: "balo1|balo2|balo3" }
 * @param {"greedy"|"dp"|"branch"} algo
 * @returns {Object}       Kết quả của thuật toán (tùy bạn định nghĩa)
 */
export function solve(input, algo) {
    const { items, capacity, type } = input;

    switch (algo) {
        case 'greedy':
            return greedySolver(items, capacity, type);

        case 'dp':
            return dpSolver(items, capacity, type);

        case 'branch':
            return branchAndBoundSolver(items, capacity, type);

        default:
            throw new Error(`Unknown algorithm: ${algo}`);
    }
}


