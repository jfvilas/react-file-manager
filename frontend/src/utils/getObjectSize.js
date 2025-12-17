const getSizeUnits = (space,size) => {
    if (!size) return  { size:'', units:''}

    let units = space.sumUnits[0]
    if (size > space.sumReducer) {
        size = (size/space.sumReducer).toFixed(0)
        units = space.sumUnits[1]
        if (size>space.sumReducer) {
            size = (size/space.sumReducer).toFixed(0)
            units=space.sumUnits[2]
        }
    }
    return { size, units }
}

export const getObjectSize = (space,size) => {
    let sizeUnits = getSizeUnits(space, size)
    return sizeUnits.size +' ' + sizeUnits.units
}
             