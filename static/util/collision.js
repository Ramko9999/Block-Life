export function isColliding(a, b){

    const canMergeInterval  = (p1, p2) => {
        let smallerInt = p1;
        let largerInt = p2;
        if (p2[0] < p1[0]){
            smallerInt = p2;
            largerInt = p1;
        }
        return smallerInt[1] >= largerInt[0]
    }
    let axrange = [a.x, a.x + a.w]
    let ayrange = [a.y, a.y + a.h]
    let bxrange = [b.x, b.x + b.w]
    let byrange = [b.y, b.y + b.h]
    return canMergeInterval(axrange, bxrange) && canMergeInterval(ayrange, byrange);
}