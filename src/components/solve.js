// solve.js
// Giải quyết bài toán balo bằng các thuật toán khác nhau
// Các thuật toán được định nghĩa trong các file riêng biệt và được gọi từ đây
import { greedySolver } from './greedy-solver.js';          
import { dpSolver } from './dp-solver.js';              
import { branchAndBoundSolver } from './branch-solver.js';         

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


