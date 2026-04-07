export interface User{
    email: string;
    password: string;
}

export interface AuthenticatedUserDetails{
    id: number;
    email: string;
    firstName: string;
    lastName: string;
    role: string;

}


export interface UserUpdatedDetails{
    firstName: string;
    lastName: string;
}