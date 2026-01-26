import { AxiosResponse } from "axios";
import $api from "../http";

export interface IUser {
    email: string;
    isActivated: boolean;
    id: string;
}

export default class UserService {
    static async fetchUsers(): Promise<AxiosResponse<IUser[]>> {
        return $api.get<IUser[]>('/users');
    }
}