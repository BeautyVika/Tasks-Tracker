type FieldErrorType = {
    error: string
    field: string
}
export type ResponseType<T = {}> = {
    resultCode: number
    messages: string[]
    fieldsErrors: FieldErrorType[]
    data: T
}
