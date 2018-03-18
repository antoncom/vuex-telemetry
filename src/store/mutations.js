import * as types from './mutation-types';

export default {
    [types.LOGIN]: (state, response) => {
        state.token = response.data.token
        state.role = response.data.role
        //state.accountInfo = response.data.accountInfo
        state.authenticated = true

        // Сохраняем токен и роль в сесии
        sessionStorage.setItem('token', state.token)
        sessionStorage.setItem('role', state.role)

    },

    [types.VALIDATE_ERROR]: (state, errors) => {
        state.validate_errors = errors
    },

    [types.LOGOUT]: (state) => {
        console.log("LOGOUT")
        state.name = ''
        state.token = ''
        state.role = 0
        state.accountInfo = {}
        state.authenticated = false

        sessionStorage.clear()
    },

    [types.INFO]: (state, response) => {
        console.log("INFO MUTATION")
        state.accountInfo = response.data
    }
}
