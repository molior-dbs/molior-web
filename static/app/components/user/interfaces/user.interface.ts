/**
 * A molior user
 */
export interface User {
    /**
     * The username
     */
    username: string;
    /**
     * The identification
     */
    user_id: number;
    /**
     * If the user is an administrator
     */
    is_admin: boolean;
    /**
     * The password of the user
     */
    password: string;
    /**
     * The email of the user
     */
    email: string;
}
