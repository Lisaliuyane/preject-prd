export const isOneToOne = (id) => {
    if (process.env.NODE_ENV === 'production') {
        return id === 159 || id === 0
    }
    return id === 143 || id === 0
}

export const getOneToOneId = () => {
    if (process.env.NODE_ENV === 'production') {
        return 159
    }
    return 143
}

export const isOneToMany = (id) => {
    if (process.env.NODE_ENV === 'production') {
        return id === 160
    }
    return id === 144
}

export const getOneToManyId = () => {
    if (process.env.NODE_ENV === 'production') {
        return 160
    }
    return 144
}

export const isManyToOne = (id) => {
    if (process.env.NODE_ENV === 'production') {
        return id === 161
    }
    return id === 145
}

export const getManyToOneId = () => {
    if (process.env.NODE_ENV === 'production') {
        return 161
    }
    return 145
}

export default {
    isOneToOne,
    isOneToMany,
    isManyToOne,
    getOneToOneId,
    getOneToManyId,
    getManyToOneId
}
