export interface UserInfoEdit {
    username: string;
    email: string;
    name: string;
    avatar: string | null;
    newPassword?: string;
}
