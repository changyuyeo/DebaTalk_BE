type UserIdType = { userId: string }
type UserEmailType = { email: string }
type UserNicknameType = { nickname: string }

export type ExistsUserType = UserIdType | UserEmailType | UserNicknameType
