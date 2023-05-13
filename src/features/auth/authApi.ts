import {instance} from "common/api/commonApi"
import {ResponseType} from "common/types/common.types"

export const authApi = {
    login(data: LoginType) {
        return instance.post<ResponseType<{ userId: number }>>('auth/login', data)
    },
    logOut() {
        return instance.delete<ResponseType>('auth/login')
    },
    me(){
        return instance.get<ResponseType<UserType>>('auth/me')
    }
}
export type LoginType ={
    email: string
    password: string
    rememberMe?: boolean
    captcha?: string
}
export type UserType ={
    id: number,
    email: string,
    login: string
}