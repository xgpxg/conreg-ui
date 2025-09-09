const state = {
    isLogin: false,
    token: '',
    nickname: '',
    avatar: '',
    email: '',
    other: {
        password_has_set: false
    }
}

//初始化
const initState = (state, token) => {
    if (token) {
        state.token = token
        state.isLogin = true
    }
}

initState(state, localStorage.getItem('token'))


const mutations = {
    setToken: (state, token) => {
        state.token = token
        state.isLogin = true
        localStorage.setItem('token', token)
    },
    setNickname: (state, nickname) => {
        state.nickname = nickname
    },
    setAvatar: (state, avatar) => {
        state.avatar = avatar
    },
    setEmail: (state, email) => {
        state.email = email
    },
    setOther: (state, other) => {
        state.other = other
    },
    resetToken: (state) => {
        state.isLogin = false
        state.token = ''
        state.nickname = ''
        state.avatar = ''
        localStorage.removeItem('token')
        localStorage.removeItem('debug_app')
    },
}

const actions = {}

export default {
    namespaced: true,
    state,
    mutations,
    actions
}
