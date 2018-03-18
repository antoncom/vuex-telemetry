import * as types from './mutation-types';
// axios使用application/x-www-form-urlencoded必须配合querystring
import querystring from 'querystring'

export const login = ({ dispatch, commit, state }, payload) => {
    if (!payload.params.user) {
        payload.error = state.errors[50002].display
        return
    } else if (!payload.params.password) {
        payload.error = state.errors[50003].display
        return
    }
    Vue.axios.post('/login', querystring.stringify(payload.params)).then(response => {
        var data = response.data

        if (data.errorCode) {
            payload.password = '';
            payload.error = state.errors[data.errorCode].display
            return
        }

        payload.error = ''
        commit(types.LOGIN, response)
        dispatch('info', {counters: 1})
        router.push({ name: 'home' })

    }).catch(error => {
        payload.password = ''
        payload.error = error
    });
}

export const info = ({ commit, state }, payload) => {
    Vue.axios.get('/info', querystring.stringify(payload.params)).then(response => {
        var data = response.data

        if (!data.role) {
            payload.error = state.errors[data.errorCode].display
            return
        }

        payload.error = ''
        commit(types.INFO, response)

    }).catch(error => {
        payload.error = error
    });
}

export const logout = ({ commit, state }, payload) => {
    Vue.axios.delete('/login', querystring.stringify(payload.params)).then(response => {
        var data = response.data

        if (data.token != null) {
            payload.error = state.errors[data.errorCode].display
            return
        }

        payload.error = ''
        commit(types.LOGOUT, response)
        router.push({ name: 'login' })

    }).catch(error => {
        payload.error = error
    });
}
