"use strict";
import {Router} from "express";

export default class NoteApiRouter {
    constructor(config) {
        this.router = Router();
        this.routes();
    }

    getRouter() {
        return this.router;
    }

    private routes() {
        this.router.get('/list/:page', (req, res) => {

        });

        this.router.get('/v/:id', (req, res) => {

        });

        this.router.get('/search', (req, res) => {

        });

        this.router.post('/write', (req, res) => {

        });

        this.router.post('/edit', (req, res) => {

        });

        this.router.post('/delete', (req, res) => {

        });
    }
}

function checkString(str) {
    return str ? str : null;
}
