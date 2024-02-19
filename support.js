const Flags = {
    ftl50: { x: -50, y: 39 },
    ftl40: { x: -40, y: 39 },
    ftl30: { x: -30, y: 39 },
    ftl20: { x: -20, y: 39 },
    ftl10: { x: -10, y: 39 },
    ft0: { x: 0, y: 39 },
    ftr10: { x: 10, y: 39 },
    ftr20: { x: 20, y: 39 },
    ftr30: { x: 30, y: 39 },
    ftr40: { x: 40, y: 39 },
    ftr50: { x: 50, y: 39 },
    fbl50: { x: -50, y: -39 },
    fbl40: { x: -40, y: -39 },
    fbl30: { x: -30, y: -39 },
    fbl20: { x: -20, y: -39 },
    fbl10: { x: -10, y: -39 },
    fb0: { x: 0, y: -39 },
    fbr10: { x: 10, y: -39 },
    fbr20: { x: 20, y: -39 },
    fbr30: { x: 30, y: -39 },
    fbr40: { x: 40, y: -39 },
    fbr50: { x: 50, y: -39 },
    flt30: { x: -57.5, y: 30 },
    flt20: { x: -57.5, y: 20 },
    flt10: { x: -57.5, y: 10 },
    fl0: { x: -57.5, y: 0 },
    flb10: { x: -57.5, y: -10 },
    flb20: { x: -57.5, y: -20 },
    flb30: { x: -57.5, y: -30 },
    frt30: { x: 57.5, y: 30 },
    frt20: { x: 57.5, y: 20 },
    frt10: { x: 57.5, y: 10 },
    fr0: { x: 57.5, y: 0 },
    frb10: { x: 57.5, y: -10 },
    frb20: { x: 57.5, y: -20 },
    frb30: { x: 57.5, y: -30 },
    fglt: { x: -52.5, y: 7.01 },
    fglb: { x: -52.5, y: -7.01 },
    gl: { x: -52.5, y: 0 },
    gr: { x: 52.5, y: 0 },
    fgrt: { x: 52.5, y: 7.01 },
    fgrb: { x: 52.5, y: -7.01 },
    fc: { x: 0, y: 0 },
    fplt: { x: -36, y: 20.15 },
    fplc: { x: -36, y: 0 },
    fplb: { x: -36, y: -20.15 },
    fprt: { x: 36, y: 20.15 },
    fprc: { x: 36, y: 0 },
    fprb: { x: 36, y: -20.15 },
    flt: { x: -52.5, y: 34 },
    fct: { x: 0, y: 34 },
    frt: { x: 52.5, y: 34 },
    flb: { x: -52.5, y: -34 },
    fcb: { x: 0, y: -34 },
    frb: { x: 52.5, y: -34 },

    distance(p1, p2) {
        return Math.sqrt((p1.x - p2.x)**2 + (p1.y-p2.y)**2)
    },
}

function getPos3Flags(flags, dists) {
    const [f1, f2, f3] = flags
    const [d1, d2, d3] = dists

    let x1 = f1.x, y1 = f1.y
    let x2 = f2.x, y2 = f2.y
    let x3 = f3.x, y3 = f3.y

    let valid_x_list = []
    let valid_y_list = []

    // Edge cases
    if (x1 == x2) {
        let y = (y2**2 - y1**2 + d1**2 - d2**2) / (2*(y2-y1))
        // console.log('Initial x')
        valid_y_list.push(y)
    }
    if (y1 == y2) {
        let x = (x2**2 - x1**2 + d1**2 - d2**2) / (2*(x2-x1))
        // console.log('Initial y')
        valid_x_list.push(x)
    }

    // Find valid x and y from 
    const borders = {x_min: -54, x_max: 54, y_min: -32, y_max: 32}
    sign = [-1, 1]
    res = []
    if (valid_y_list.length == 0) {
        const alpha = (y1-y2) / (x2-x1)
        const beta = (y2**2 - y1**2 + x2**2 - x1**2 + d1**2 - d2**2) / (2*(x2-x1))
        const a = alpha**2 + 1
        const b = -2*(alpha*(x1-beta) + y1)
        const c = (x1 - beta)**2 + y1**2 - d1**2
        const D = Math.sqrt(b**2 - 4*a*c)
        for (y_sign of sign) {
            let try_y = (-b + y_sign*D)/(2*a)
            if ((borders.y_min <= try_y) && (try_y <= borders.y_max)) {
                valid_y_list.push(try_y)
            }
        }
    }
    if (valid_x_list.length == 0)
        for (x_sign of sign)
            for (y of valid_y_list) {
                let try_x = x1 + x_sign*Math.sqrt(d1**2 - (y - y1)**2)
                if ((borders.x_min <= try_x) && (try_x <= borders.x_max))
                    valid_x_list.push(try_x)
            }
    let best_solution = {x: null, y: null}
    let best_acc = Infinity
    for (try_x of valid_x_list) {
        for (try_y of valid_y_list) {
            let d_i = (try_x - x3) ** 2 + (try_y - y3) ** 2
            let error = Math.abs(d_i - d3**2)
            if (error < best_acc) {
                best_solution.x = try_x
                best_solution.y = try_y
                best_acc = error
            }  
        }
    }

    return best_solution
}
        
module.exports = {getPos3Flags, Flags};