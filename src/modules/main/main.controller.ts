import { Route } from "@core/interfaces";
import { Router } from "express";
import MainService from "./main.service";

export default class MainRoute implements Route {
    public path = "/";
    public router = Router();
    private mainService = new MainService();

    constructor() {
        this.initializeRoutes();
    }

    private initializeRoutes() {
        this.router.get(this.path, this.mainService.index);
    }
}